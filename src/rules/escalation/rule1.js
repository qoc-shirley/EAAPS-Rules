import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';

const rule1 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientOriginalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, medications, patientMedication ) => {
          const newMedications = _.filter( _masterMedications, { chemicalType: 'laba,ICS' } );
          if ( patientMedication.chemicalType === 'ltra' ) {
            result.push( patientMedication );

            return result;
          }
          else if ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( newMedications ) ) {
            const chemicalICSMedications = _.chain( newMedications )
              .filter( { chemicalICS: patientMedication.chemicalICS } )
              .value();
            const equal = _.chain( chemicalICSMedications )
              .filter( ( medication ) => {
                return adjust.ICSDoseToOriginalMedication( medication, patientMedication ) === [];
              } )
              .value();
            if ( !_.isEmpty( chemicalICSMedications ) && !_.isEmpty( equal ) ) {
              const checkNewMedication = _.chain( equal )
                .filter( { device: patientMedication.device } )
                .reduce( ( accResult, medication ) => {
                  if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                    const newMedAdjust = adjust.ICSDoseToMax( medication );
                    if ( _.isNil( accResult.toMax ) ) {
                      return Object.assign( {}, accResult, { toMax: newMedAdjust } );
                    }
                    if ( accResult.toMax.doseICS < newMedAdjust.doseICS ) {
                      return Object.assign( {}, accResult, { toMax: newMedAdjust } );
                    }

                    return accResult;
                  }
                  else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                    const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                    if ( _.isNil( accResult.toNext ) ) {
                      return Object.assign( {}, accResult, { toNext: newMedAdjust } );
                    }
                    if ( accResult.toNext.doseICS < newMedAdjust.doseICS ) {
                      return Object.assign( {}, accResult, { toNext: newMedAdjust } );
                    }

                    return accResult;
                  }

                  return medication;
                }, [] )
                .thru( medication => medication.toNext || medication.toMax || medication )
                .value();

              return result.push( checkNewMedication );
            }

            else {
              result.push(
                _.chain( _masterMedications )
                  .filter( ( medication ) => {
                    return (
                      medication.chemicalLABA === 'salmeterol' &&
                      medication.chemicalICS === 'fluticasone' &&
                      medication.device === 'diskus'
                    ) || (
                      medication.chemicalLABA === 'salmeterol' &&
                      medication.chemicalICS === 'fluticasone' &&
                      medication.device === 'inhaler2'
                    ) || (
                      medication.chemicalLABA === 'formoterol' &&
                      medication.chemicalICS === 'budesonide'
                    ) || (
                      medication.chemicalLABA === 'formoterol' &&
                      medication.chemicalICS === 'mometasone'
                    );
                  })
                  .reduce( ( accMedicationCategory, medication ) => {
                    const category = categorize.ICSDose( medication );

                    if ( _.isNil( accMedicationCategory[category] ) ) {
                      accMedicationCategory[category] = medication;
                    }

                    else {
                      if ( category === 'excessive' &&
                        calculate.ICSDose( accMedicationCategory[category] ) <= calculate.ICSDose( medication ) ) {
                        accMedicationCategory[category] = medication;
                      }
                      else if ( calculate.ICSDose( accMedicationCategory[category] ) >
                        calculate.ICSDose( medication ) ) {
                        accMedicationCategory[category] = medication;
                      }
                    }

                    return accMedicationCategory;
                  }, {} )
                  .thru( ( list ) => {
                    return list[categorize.patientICSDose( patientMedication )] || [];
                  } )
                  .value(),
              );
            }
          }

          return result;
        }, masterMedications, patientMedications );

      rule( patientOriginalMedication );

      return result;
    }, [] )
    .flatten()
    .value();
};
export default rule1;
