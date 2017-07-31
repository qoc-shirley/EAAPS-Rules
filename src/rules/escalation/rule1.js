import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
// import * as get from '../library/getICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const equalICSDose = ( medication, patientMedication ) => {
  if ( calculate.patientICSDose( patientMedication ) === calculate.ICSDose( medication ) ) {
    return medication;
  }

  return adjust.ICSDoseToOriginalMedication( medication, patientMedication );
};

const rule1 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      const rule =
        _.partial( ( medicationElement, medications, patientMedication ) => {
          if ( patientMedication.chemicalType === 'ltra' ) {
            result.push( patientMedication );

            return result;
          }
          else if ( patientMedication.chemicalType === 'ICS' ) {

            const newMedications = _.filter( medicationElement, { chemicalType: 'laba,ICS' } );

            if ( _.isEmpty( newMedications ) ) {
              return result;
            }

            const chemicalICSMedications = _.chain( newMedications )
              .filter( { chemicalICS: patientMedication.chemicalICS } )
              .isEmpty()
              .value();

            if (!chemicalICSMedications) {
              // console.log("exist a new medication “chemicalICS” same as the original medication’s “chemicalICS");
              // const typeICS = _.filter(chemicalICSMedications, {chemicalType: "ICS"});
              // const matchOriginalICSDevice = match.device(chemicalICSMedications, patientMedication);
              // // if (!_.isEmpty(matchOriginalICSDevice)) {
              // //   chemicalICSMedications = matchOriginalICSDevice;
              // // }
              //
              // const equalMedications = _.filter(chemicalICSMedications, (medication) => {
              //   return equalICSDose(medication, patientMedication);
              // });
              // const tryTimesPerDay = match.timesPerDay(equalMedications, patientMedication);
              // if (!_.isEmpty(tryTimesPerDay)) {
              //   const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
              //   if (!_.isEmpty(tryMinimizePuffs)) {
              //     result.push(tryMinimizePuffs);
              //   }
              //   else {
              //     result.push(tryTimesPerDay);
              //   }
              // }
              // else if (!_.isEmpty(equalMedications)) {
              //   result.push(equalMedications);
              // }
              // else {
              //   // console.log("recommend the next closest higher ICS DOSE than the original medication's dose");
              //   const nextHigherICSDose = _.filter(chemicalICSMedications, (medication) => {
              //     return calculate.ICSDose(medication) > calculate.patientICSDose(patientMedication);
              //   });
              //   const tryTimesPerDay = match.timesPerDay(nextHigherICSDose, patientMedication);
              //   if (!_.isEmpty(tryTimesPerDay)) {
              //     const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
              //     if (!_.isEmpty(tryMinimizePuffs)) {
              //       result.push(tryMinimizePuffs);
              //     }
              //     else {
              //       result.push(tryTimesPerDay);
              //     }
              //   }
              //   else {
              //     const tryMinimizePuffs = match.minimizePuffsPerTime(nextHigherICSDose, patientMedication);
              //     if (!_.isEmpty(tryMinimizePuffs)) {
              //       result.push(tryMinimizePuffs);
              //     }
              //     else {
              //       result.push(nextHigherICSDose);
              //     }
              //   }
              // }
              //
              //   const maxICSDose = _.filter(chemicalICSMedications, (medication) => {
              //     return medication.maxGreenICS < calculate.patientICSDose(patientMedication);
              //   });
              //   if (!_.isEmpty(maxICSDose)) {
              //     // console.log("recommend this new medication at max ICS DOSE (maxGreenICS)");
              //     const tryTimesPerDay = match.timesPerDay(maxICSDose, patientMedication);
              //     if (!_.isEmpty(tryTimesPerDay)) {
              //       const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
              //       if (!_.isEmpty(tryMinimizePuffs)) {
              //         result.push(tryMinimizePuffs);
              //       }
              //       else {
              //         result.push(tryTimesPerDay);
              //       }
              //     }
              //     const tryMinimizePuffs = match.minimizePuffsPerTime(maxICSDose, patientMedication);
              //     if (!_.isEmpty(tryMinimizePuffs)) {
              //       result.push(tryMinimizePuffs);
              //     }
              //     else {
              //       result.push(maxICSDose);
              //     }
            }
          }
          else {
            // medicationElement = medication from spreadsheet
            const masterMedication = medicationElement;
            result.push(
              _.chain( masterMedication )
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
                } )
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
                    else if ( calculate.ICSDose( accMedicationCategory[category] ) > calculate.ICSDose( medication ) ) {
                      accMedicationCategory[category] = medication;
                    }
                  }

                  return accMedicationCategory;
                }, {} )
                .thru( ( list ) => {
                  return list[categorize.patientICSDose( patientMedication )];
                } )
                .value(),
            );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( patientMedication );

      return result;
    }, [] )
    .flatten()
    .uniqBy( 'id' )
    .value();
};
export default rule1;
