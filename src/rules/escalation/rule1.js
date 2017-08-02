import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';

const equalICSDose = ( medication, patientMedication ) => {
  if ( calculate.patientICSDose( patientMedication ) === calculate.ICSDose( medication ) ) {
    return medication;
  }

  return adjust.ICSDoseToOriginalMedication( medication, patientMedication );
};

const minimizePuffsPerTime = ( medications, minimizeMedicationsPuffs ) => {
  const minimize = _.filter( medications, ( medication ) => {
    return medication.doseICS > minimizeMedicationsPuffs.doseICS;
  } );
  if ( _.isEmpty( minimize ) ) {
    return null;
  }
  else if ( _.size( minimize ) > 1 ) {
    return _.maxBy( minimize, 'doseICS' );
  }

  return minimize;
};

const rule1 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientOriginalMedication ) => {
      const rule =
        _.partial( ( medicationElement, medications, patientMedication ) => {
          const newMedications = _.filter( medicationElement, { chemicalType: 'laba,ICS' } );
          if ( patientMedication.chemicalType === 'ltra' ) {
            result.push( patientMedication );

            return result;
          }
          else if ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( newMedications ) ) {
            const chemicalICSMedications = _.chain( newMedications )
              .filter( { chemicalICS: patientMedication.chemicalICS } )
              .value();

            if ( !_.isEmpty( chemicalICSMedications ) ) {
              let checkNewMedication = _.chain( chemicalICSMedications )
                .filter( { device: patientMedication.device } )
                .reduce( ( accResult, medication ) => {
                  if ( !_.isNil( equalICSDose( medication, patientMedication ) ) ) {
                    return medication;
                  }
                  else if ( calculate.ICSDose( medication ) > calculate.patientICSDose( patientMedication ) ) {
                    return medication;
                  }

                  if ( medication.maxGreenICS < calculate.patientICSDose( patientMedication ) ) {
                    return medication;
                  }

                  return accResult;
                }, [] )
                .value();

              if ( _.isEmpty( checkNewMedication ) ) {
                checkNewMedication =  _.chain( chemicalICSMedications )
                  .reduce( ( accResult, medication ) => {
                    if ( !_.isNil( equalICSDose( medication, patientMedication ) ) ) {
                      return medication;
                    }
                    else if ( calculate.ICSDose( medication ) > calculate.patientICSDose( patientMedication ) ) {
                      return medication;
                    }

                    if ( medication.maxGreenICS < calculate.patientICSDose( patientMedication ) ) {
                      return medication;
                    }

                    return accResult;
                  }, [] )
                  .value();
              }

              const matchTimesPerDay = _.chain( checkNewMedication )
                .filter( { timesPerDay: patientMedication.timesPerDay } )
                .value();

              if ( _.size( matchTimesPerDay ) >= 2 ) {
                const attemptMinimize = _.chain( matchTimesPerDay )
                  .filter( ( medication ) => {
                    return medication.doseICS > patientMedication.doseICS;
                  } )
                  .value();
                if ( _.isEmpty( attemptMinimize ) ) {
                  result.push( matchTimesPerDay );
                }

                return attemptMinimize;
              }
              else if ( _.size( matchTimesPerDay ) === 1 ) {
                result.push( matchTimesPerDay );
              }

              result.push( minimizePuffsPerTime( checkNewMedication, patientMedication ) ||
                checkNewMedication );
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
                  return list[categorize.patientICSDose( patientMedication )] || [];
                } )
                .value(),
            );
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
