import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
import * as get from './Library/GetICSDose';
import * as categorize from './Library/CategorizeDose';
import * as adjust from './Library/AdjustICSDose';

const equalICSDose = (medication, patientMedication) => {
  if (calculate.patientICSDose(patientMedication) === calculate.ICSDose(medication)) {
    return medication;
  }
  else {
    return adjust.ICSDoseToOriginalMedication(medication, patientMedication);
  }
};

const matchDevice = (medications, matchMedication) => {
  return _.filter(medications, {device: matchMedication.device});
};
const matchTimesPerDay = (medications, matchMedication) => {
  return _.filter(medications, {timesPerDay: matchMedication.timesPerDay});
};
const minimizePuffsPerTime = (medications, minimizeMedicationsPuffs) => {
  const minimize = _.filter(medications, (medication) => {
    return medication.doseICS > minimizeMedicationsPuffs.doseICS
  });
  if (_.size(minimize) > 1) {
    return _.maxBy(minimize, 'doseICS');
  }
  return minimize;
};

const rule1 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
          const newMedications = _.filter(medicationElement, {chemicalType: "laba, ICS"});
          if (patientMedication.chemicalType === "ICS" && !_.isEmpty(newMedications)) {

            let chemicalICSMedications = _.filter(newMedications, {chemicalICS: patientMedication.chemicalICS});
            if (!_.isEmpty(chemicalICSMedications)) {

              const typeICS = _.filter(chemicalICSMedications, {chemicalType: "ICS"});
              const matchOriginalICSDevice = matchDevice(typeICS, patientMedication);

              if (!_.isEmpty(matchOriginalICSDevice)) {
                chemicalICSMedications = matchOriginalICSDevice;
              }

              const equalMedications = _.filter(chemicalICSMedications, (medication) => {
                return equalICSDose(medication, patientMedication);
              });
              const tryTimePerDay = matchTimesPerDay(equalMedications, patientMedication);

              if (!_.isEmpty(tryTimesPerDay)) {
                const tryMinimizePuffs = minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryMinimizePuffs)) {
                  result.push(tryMinimizePuffs);
                }
                result.push(tryTimesPerDay);
              }
              else if (!_.isEmpty(equalMedications)) {
                result.push(equalMedications);
              }
              else {
                console.log("recommend the next closest higher ICS DOSE than the original medication's dose");
                const nextHigherICSDose = _.filter(chemicalICSMedications, (medication) => {
                  return calculate.ICSDose(medication) > calculate.patientICSDose(patientMedication);
                });
                const tryTimesPerDay = matchTimesPerDay(nextHigherICSDose, patientMedication);
                if (!_.isEmpty(tryTimesPerDay)) {
                  const tryMinimizePuffs = minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                  if (!_.isEmpty(tryMinimizePuffs)) {
                    result.push(tryMinimizePuffs);
                  }
                  result.push(tryTimesPerDay);
                }
                else {
                  const tryMinimizePuffs = minimizePuffsPerTime(nextHigherICSDose, patientMedication);
                  if (!_.isEmpty(tryMinimizePuffs)) {
                    result.push(tryMinimizePuffs);
                  }
                  result.push(nextHigherICSDose);
                }
              }

              const maxICSDose = _.filter(chemicalICSMedications, (medication) => {
                return medication.maxGreenICS < calculate.patientICSDose(patientMedication);
              });
              if (!_.isEmpty(maxICSDose)) {
                console.log("recommend this new medication at max ICS DOSE (maxGreenICS)");
                const tryTimesPerDay = matchTimesPerDay(maxICSDose, patientMedication);
                if (!_.isEmpty(tryTimesPerDay)) {
                  const tryMinimizePuffs = minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                  if (!_.isEmpty(tryMinimizePuffs)) {
                    result.push(tryMinimizePuffs);
                  }
                  result.push(tryTimesPerDay);
                }
                result.push(chemicalICSMedications);
              }
            }
          }
          else {
            const newMedication =
              _.filter(medicationElement, (medication) => {
                return (
                    medication.chemicalLABA === "salmeterol" &&
                    medication.chemicalICS === "fluticasone" &&
                    medication.device === "diskus"
                  ) && (
                    medication.chemicalLABA === "salmeterol" &&
                    medication.chemicalICS === "fluticasone" &&
                    medication.device === "inhaler2"
                  ) && (
                    medication.chemicalLABA === "formoterol" &&
                    medication.chemicalICS === "budesonide"
                  ) && (
                    medication.chemicalLABA === "formoterol" &&
                    medication.chemicalICS === "mometasone"
                  )
              });
            console.log("categorize original and new medications");
            const low = _.filter(newMedication, (medication) => {
              return categorize.ICSDose(medication) === "low";
            });
            const medium = _.filter(newMedication, (medication) => {
              return categorize.ICSDose(medication) === "medium";
            });
            const high = _.filter(newMedication, (medication) => {
              return categorize.ICSDose(medication) === "high";
            });
            const excessive = _.filter(newMedication, (medication) => {
              return categorize.ICSDose(medication) === "excessive";
            });

            if (categorize.patientICSDose(patientMedication) === "low") {
              console.log("find new medication in low category");
              result.push(get.lowestICSDose(low));
            }
            else if (categorize.patientICSDose(patientMedication) === "medium") {
              console.log("find new medication in medium category");
              result.push(get.lowestICSDose(medium));
            }
            else if (categorize.patientICSDose(patientMedication) === "high") {
              console.log("find new medication in high category");
              result.push(get.lowestICSDose(high));
            }
            else if (categorize.patientICSDose(patientMedication) === "excessive") {
              console.log("recommend highest possible ICS DOSE in each new medication");
              result.push(get.highestICSDose(excessive));
            }
          }
          if (patientMedication.chemicalType === "ltra") {
            result.push(patientMedication);
          }
          return result;
        }, masterMedications, patientMedications);

      rule(patientMedication);

      return result;
    }, [])
    .value();
};
export default rule1;