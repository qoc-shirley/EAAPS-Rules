import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';

const rule4 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
      .reduce( ( result, originalMedication ) => {
        const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          if ( ( patientMedication.chemicalType === 'laba,ICS' || patientMedication.chemicalType === 'ICS' ) &&
            patientMedication.name !== 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) &&
            ( !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba' } ) ) ) ) {

            if ( patientMedication.chemicalType === 'laba,ICS' ) {
              result.push( patientMedication );
              result.push(
                  _.chain( _masterMedications )
                    .filter( { name: 'singular' } )
                    .value(),
              );

              return result;
            }
            result.push( _
              .chain( _masterMedications )
              .reduce( ( accResult, medication ) => {
                const laba = _.chain( _patientMedications )
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
                // talk to Jordan or kent
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
          // => what does this mean?
          if ( patientMedication.name === 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {
            result.push( _.filter( _masterMedications, { name: 'symbicort', din: patientMedication.din } ) );
          }
        }, masterMedications, patientMedications );
        rule( originalMedication );

        return result;
      }, [] )
    .value();
};

export default rule4;
