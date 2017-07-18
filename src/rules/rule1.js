import _ from 'lodash';
import * as calculate from './library/calculateICSDose';
import * as get from './library/getICSDose';
import * as categorize from './library/categorizeDose';
import * as adjust from './library/adjustICSDose';
import * as match from './library/match';

const equalICSDose = (medication, patientMedication) => {
  if (calculate.patientICSDose(patientMedication) === calculate.ICSDose(medication)) {
    return medication;
  }
  else {
    return adjust.ICSDoseToOriginalMedication(medication, patientMedication);
  }
};

const rule1 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
          const newMedications = _.filter(medicationElement, {chemicalType: "laba,ICS"});
          console.log("beginning: ", patientMedication.chemicalType === "ICS", newMedications);
          if (patientMedication.chemicalType === "ICS" && !_.isEmpty(newMedications)) {
            console.log("there is chemical ICS and laba,ics");

            let chemicalICSMedications = _.filter(newMedications, {chemicalICS: patientMedication.chemicalICS});
            console.log("chemicalICSMedications: ", chemicalICSMedications);
            if (!_.isEmpty(chemicalICSMedications)) {
              console.log("exist a new medication “chemicalICS” same as the original medication’s “chemicalICS");
              // const typeICS = _.filter(chemicalICSMedications, {chemicalType: "ICS"});
              const matchOriginalICSDevice = match.device(chemicalICSMedications, patientMedication);
              if (!_.isEmpty(matchOriginalICSDevice)) {
                chemicalICSMedications = matchOriginalICSDevice;
              }

              const equalMedications = _.filter(chemicalICSMedications, (medication) => {
                return equalICSDose(medication, patientMedication);
              });
              const tryTimesPerDay = match.timesPerDay(equalMedications, patientMedication);
              if (!_.isEmpty(tryTimesPerDay)) {
                const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryMinimizePuffs)) {
                  result.push(tryMinimizePuffs);
                }
                else {
                  result.push(tryTimesPerDay);
                }
              }
              else if (!_.isEmpty(equalMedications)) {
                result.push(equalMedications);
              }
              else {
                console.log("recommend the next closest higher ICS DOSE than the original medication's dose");
                const nextHigherICSDose = _.filter(chemicalICSMedications, (medication) => {
                  return calculate.ICSDose(medication) > calculate.patientICSDose(patientMedication);
                });
                const tryTimesPerDay = match.timesPerDay(nextHigherICSDose, patientMedication);
                if (!_.isEmpty(tryTimesPerDay)) {
                  const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                  if (!_.isEmpty(tryMinimizePuffs)) {
                    result.push(tryMinimizePuffs);
                  }
                  else {
                    result.push(tryTimesPerDay);
                  }
                }
                else {
                  const tryMinimizePuffs = match.minimizePuffsPerTime(nextHigherICSDose, patientMedication);
                  if (!_.isEmpty(tryMinimizePuffs)) {
                    result.push(tryMinimizePuffs);
                  }
                  else{
                    result.push(nextHigherICSDose);
                  }
                }
              }

              const maxICSDose = _.filter(chemicalICSMedications, (medication) => {
                return medication.maxGreenICS < calculate.patientICSDose(patientMedication);
              });
              if (!_.isEmpty(maxICSDose)) {
                console.log("recommend this new medication at max ICS DOSE (maxGreenICS)");
                const tryTimesPerDay = match.timesPerDay(maxICSDose, patientMedication);
                if (!_.isEmpty(tryTimesPerDay)) {
                  const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                  if (!_.isEmpty(tryMinimizePuffs)) {
                    result.push(tryMinimizePuffs);
                  }
                  else {
                    result.push(tryTimesPerDay);
                  }
                }
                const tryMinimizePuffs = match.minimizePuffsPerTime(maxICSDose, patientMedication);
                if (!_.isEmpty(tryMinimizePuffs)) {
                  result.push(tryMinimizePuffs);
                }
                else {
                  result.push(maxICSDose);
                }
              }
            }
            else {
              console.log("DOESN'T exist a new medication “chemicalICS” same as the original medication’s “chemicalICS");
              const newMedication =
                _.filter(medicationElement, (medication) => {
                  return (
                      medication.chemicalLABA === "salmeterol" &&
                      medication.chemicalICS === "fluticasone" &&
                      medication.device === "diskus"
                    ) || (
                      medication.chemicalLABA === "salmeterol" &&
                      medication.chemicalICS === "fluticasone" &&
                      medication.device === "inhaler2"
                    ) || (
                      medication.chemicalLABA === "formoterol" &&
                      medication.chemicalICS === "budesonide"
                    ) || (
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
                const tryMinimizePuff = match.minimizePuffsPerTime(get.lowestICSDose(low), patientMedication);
                if (!_.isEmpty(tryMinimizePuff)) {
                  result.push(tryMinimizePuff);
                }
                else {
                  result.push(get.lowestICSDose(low));
                }
              }
              else if (categorize.patientICSDose(patientMedication) === "medium") {
                console.log("find new medication in medium category");
                const tryMinimizePuff = match.minimizePuffsPerTime(get.lowestICSDose(medium), patientMedication);
                if (!_.isEmpty(tryMinimizePuff)) {
                  result.push(tryMinimizePuff);
                }
                else{
                  result.push(get.lowestICSDose(medium));
                }
              }
              else if (categorize.patientICSDose(patientMedication) === "high") {
                console.log("find new medication in high category");
                const tryMinimizePuff = match.minimizePuffsPerTime(get.lowestICSDose(high), patientMedication);
                if (!_.isEmpty(tryMinimizePuff)) {
                  result.push(tryMinimizePuff);
                }
                else {
                  result.push(get.lowestICSDose(high));
                }
              }
              else if (categorize.patientICSDose(patientMedication) === "excessive") {
                console.log("recommend highest possible ICS DOSE in each new medication");
                const tryMinimizePuff = match.minimizePuffsPerTime(get.highestICSDose(excessive), patientMedication);
                if (!_.isEmpty(tryMinimizePuff)) {
                  result.push(tryMinimizePuff);
                }
                else {
                  result.push(get.highestICSDose(excessive));
                }
              }
            }
          }
          if (patientMedication.chemicalType === "ltra") {
            console.log("ltra");
            result.push(patientMedication);
          }
          result = _.flatten(result);
          result = _.uniqBy(result, "id");
          return result;
        }, masterMedications, patientMedications);

      rule(patientMedication);

      return result;
    }, [])
    .value();
};
export default rule1;