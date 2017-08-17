import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';

const rule4 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
      .reduce( ( result, medication ) => {
        const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
          if ( ( patientMedication.chemicalType === 'laba,ICS' || patientMedication.chemicalType === 'ICS' ) &&
            patientMedication.name !== 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) &&
            ( !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba' } ) ) ) ) {

            if ( patientMedication.chemicalType === 'laba,ICS' ) {
              result.push( patientMedication );
              result.push(
                  _.chain( medicationElement )
                    .filter( { name: 'singular' } )
                    .value(),
              );

              return result;
            }
            result.push( _
              .chain( medicationElement )
              .reduce( ( accResult, medication ) => {
                const laba = _.chain( originalMedications )
                  .find( { chemicalType: 'laba' } )
                  .value();
                if ( medication.name === 'singulair' ) {
                  accResult.push( medication );
                }

                if ( medication.chemicalType !== 'laba,ICS' &&
                  medication.chemicalLABA !== patientMedication.chemicalLABA &&
                  medication.chemicalICS !== patientMedication.chemicalICS &&
                  ( medication.device !== patientMedication.device &&
                    medication.device !== laba.device
                  )
                ) {
                  accResult.push( patientMedication );

                  return accResult;
                }

                if ( medication.chemicalType === 'laba,ICS' &&
                     medication.chemicalLABA === patientMedication.chemicalLABA &&
                     medication.chemicalICS === patientMedication.chemicalICS &&
                     medication.device === patientMedication.device && ( _.isNil( accResult.new ) ||
                     calculate.ICSDose( accResult.new ) <= calculate.ICSDose( medication ) )
                   ) {
                  accResult.new = medication;

                  return accResult;
                }
                // NEED TO REVIEW THIS - SEEMS TO BE INCORRECT
                else if ( medication.chemicalType === 'laba,ICS' &&
                          medication.chemicalLABA === patientMedication.chemicalLABA &&
                          medication.chemicalICS === patientMedication.chemicalICS &&
                          medication.device === laba.device && ( _.isNil( accResult.new ) ||
                          calculate.ICSDose( accResult.new ) <= calculate.ICSDose( medication ) )
                        ) {
                  accResult.new = medication;

                  return accResult;
                }

                return accResult;
              }, [] )
              .thru( ( medication ) => {
                return medication.new || medication;
              } )
              .value(),
            );
          }
          // REVIEW THIS - we neglected to recommend a SMART medication (e.g. tag with instant relief)
          if ( patientMedication.name === 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {
            result.push( _.filter( medicationElement, { name: 'symbicort', din: patientMedication.din } ) );
          }
        }, masterMedications, patientMedications );
        rule( medication );

        return result;
      }, [] )
    .value();
};

export default rule4;
