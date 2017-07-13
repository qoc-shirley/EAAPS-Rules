import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
import * as get from './Library/GetICSDose';
import * as categorize from './Library/CategorizeDose';
import * as adjust from './Library/AdjustICSDose';

const equalICSDose = (medication, patientMedication) => {
  if (calculate.patientICSDose(patientMedication) === calculate.ICSDose(medication)) {
    return true;
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
          const newMedications = _.filter(medicationElement, {chemicalType: "laba, ICS"});
          if (patientMedication.chemicalType === "ICS" && !_.isEmpty(newMedications)) {

            const chemicalICSMedications = _.filter(newMedications, {chemicalICS: patientMedication.chemicalICS});
            if (!_.isEmpty(chemicalICSMedications)) {
              //attempt to match device
              //is each condition going to be checked?
              for (let i = 0; i < _.size(chemicalICSMedications); i++) {
                const isEqual = equalICSDose(chemicalICSMedications[i], patientMedication);
                if (!_.isEmpty(isEqual)) {
                  result.push(isEqual);
                }
                //should this condition be last out of the 3?
                if (chemicalICSMedications[i]) {
                  console.log("recommend the next closest higher ICS DOSE than the original medication's dose");
                }
                if (chemicalICSMedications[i].maxGreenICS < calculate.patientICSDose(patientMedication)) {
                  console.log("recommend this new medication at max ICS DOSE (maxGreenICS)");
                }
              }
              //attempt to match the patientMedication TimesPerDay
              //minimize the required puffPerTime
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
            //recommend the lowest possible ICS DOSE in each new medication
            // but I'm only supposed to return the medication row so I will not be
            // doing this but the doctor?
            //still confused on returning the lowest possible ICS DOSE in rule 2 the lowest dose
            //  out of a group of medications was returned
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
              result.push(get.lowestICSDose(excessive));
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