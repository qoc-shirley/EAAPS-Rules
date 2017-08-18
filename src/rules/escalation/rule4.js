import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';

const rule4 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
      .reduce( ( result, originalMedication ) => {
        const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          if ( ( patientMedication.chemicalType === 'laba,ICS' || ( patientMedication.chemicalType === 'ICS' &&
              !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba' } ) ) ) ) &&
            patientMedication.name !== 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {

            if ( patientMedication.chemicalType === 'laba,ICS' ) {
              return _.chain( _masterMedications )
                .filter( { name: 'singular' } )
                .concat( result, patientMedication )
                .value();
            }

            return _.chain( _masterMedications )
              .reduce( ( accResult, medication ) => {
                const laba = _.chain( _patientMedications )
                  .find( { chemicalType: 'laba' } )
                  .value();
                if ( medication.name === 'singulair' ) {
                  accResult.push( medication );
                }

                if ( medication.chemicalType !== 'laba,ICS' &&
                  ( ( medication.chemicalLABA !== laba.chemicalLABA &&
                      medication.chemicalICS !== patientMedication.chemicalICS ) ||
                    ( medication.device !== patientMedication.device &&
                      medication.device !== laba.device )
                  )
                ) {
                  return accResult.push( patientMedication );
                }

                const adjustToOrgIcsDose = adjust.ICSDoseToOriginalMedication( medication, patientMedication );
                if ( medication.chemicalType === 'laba,ICS' &&
                     medication.chemicalLABA === laba.chemicalLABA &&
                     medication.chemicalICS === patientMedication.chemicalICS &&
                  ( medication.device === patientMedication.device || medication.device === laba.device )
                  && ( _.isNil( accResult.new ) ||
                    // compare original ICSDOSE to new Medication
                    // and also check if the doseICS is greater than stored doseICS
                    ( !_.isEmpty( adjustToOrgIcsDose ) &&
                     accResult.new.doseICS < adjustToOrgIcsDose.doseICS ) )
                   ) {
                  return Object.assign( {}, accResult, { new: adjustToOrgIcsDose } );
                }
                // NEED TO REVIEW THIS - SEEMS TO BE INCORRECT
                // talk to Jordan or kent
                else if ( medication.chemicalType === 'laba,ICS' &&
                          medication.chemicalLABA === laba.chemicalLABA &&
                          medication.chemicalICS === patientMedication.chemicalICS &&
                        ( _.isNil( accResult.new ) ||
                          ( !_.isEmpty( adjustToOrgIcsDose ) &&
                          accResult.new.doseICS < adjustToOrgIcsDose.doseICS ) )
                        ) {
                  return Object.assign( {}, accResult, { new: medication } );
                }

                return accResult;
              }, [] )
              .thru( ( medication ) => {
                return medication.new || medication;
              } )
              .concat( result )
              .value();
          }
          // REVIEW THIS - we neglected to recommend a SMART medication (e.g. tag with instant relief)
          // => what does this mean?
          if ( patientMedication.name === 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {
            return result.concat( 'SMART',
              _.filter( _masterMedications,
                { name: 'symbicort', function: 'controller,reliever', din: patientMedication.din } ) );
          }

          return result;
        }, masterMedications, patientMedications );
        rule( originalMedication );

        return result;
      }, [] )
    .value();
};

export default rule4;
