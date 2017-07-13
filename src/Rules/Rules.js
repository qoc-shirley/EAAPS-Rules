import _ from 'lodash';
import ruleMinus1 from './RuleMinus1';
import rule0 from './Rule0';
// import rule1 from './Rule1';
// import rule3 from './Rule3';
import rule4 from './Rule4';
// import rule5 from 'Rule5';
import rule6 from './Rule6';
import rule7 from './Rule7';
import rule8 from './Rule8';
import rule9 from './Rule9';
import rule10 from './Rule10';
import rule11 from './Rule11';
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

//////////////////////////////////////////////// RULES ////////////////////////////////////////////////////////////////
export const rules = {
  ruleMinus1,
  rule0,
  rule4,
  rule6,
  rule7,
  rule8,
  rule9,
  rule10,
  rule11,
};

//rule 1
export const rule1 = (patientMedications, masterMedications) => {
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
              result.push(high);
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

//rule 3
export const rule3 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
          const filterOrgMeds = _.filter(medications, (medication) => {
            return medication.name !== "symbicort" &&
              (
                medication.chemicalType === "laba,ICS" ||
                medication.chemicalType === "laba" ||
                medication.chemicalType === "ICS"
              ) &&
              calculate.patientICSDose(medication) === "low"
          });
          const isLabaICS = _.filter(filterOrgMeds, {chemicalType: "laba,ICS"});
          const isLaba = _.filter(filterOrgMeds, {chemicalType: "laba"});
          const isICS = _.filter(filterOrgMeds, {chemicalType: "ICS"});
          if (!_.isEmpty(filterOrgMeds)) {
            if (!_.isEmpty(isLabaICS)) {
              //do matches and attempts
              result.push(isLabaICS);
            }
            else if (!_.isEmpty(isLaba) && !_.isEmpty(isICS)) {
              const filteredMedication = _.filter(medicationElement,
                {
                  chemicalType: "laba,ICS",
                  chemicalABA: patientMedication.chemicalLABA,
                  chemicalICS: patientMedication.chemicalICS
                });
              if (!_.isEmpty(filteredMedication)) {
                if (!_.isEmpty(_.filter(filteredMedication, (medication) => {
                    return medication.device === isLaba.device || medication.device === isICS.device
                  }))) {
                  //test to see which device can be put into the lowest possible dose within the medium dose category
                  result.push();
                }
                else {
                  //increase the original medication ICD to lowest possible dose within the medium dose category + recommend LTRA
                  //match ICS device can be put into the lowest possible dose within the medium dose category
                  //match the ICS medication with ^ device
                  //match timesPerDay
                  //minimize required ICS puffPerTime
                }
              }
              else {
                //increase original medication ICS to lowest dose in medium category + recommend LABA
                //match ICS Org device
                //attempt to match ICS ORG dosePerPuff
                //match timesPerDay
                //minimize required ICS puffPerTime
              }
            }
            else {
            }
          }
          else if (patientMedication.name === "symbicort" && categorize.patientICSDose(patientMedication) === "low") {
            result.push(_.filter(medicationElement, {
              name: "symbicort",
              function: "controller,reliever",
              din: patientMedication.din
            }));
          }
          return result;
        }, masterMedications, patientMedications);

      rule(patientMedication);

      return result;
    }, [])
    .value();
};

export const rule5 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
          const findLtra = _.find(medications, {chemicalType: "ltra"});

          if (patientMedication.name !== "symbicort" &&
            (
              patientMedication.chemicalType === "laba,ICS" ||
              patientMedication.chemicalType === "laba" ||
              patientMedication.chemicalType === "ICS"
            ) &&
            !_.isEmpty(findLtra) &&
            calculate.patientICSDose(findLtra) < findLtra.maxGreenICS) {
            const typeICS = _.filter(medications, {chemicalType: "ICS"});
            if (patientMedication.chemicalType === "laba,ICS") {
              result.push(patientMedication);
              result.push(findLtra); //any ltra? or all ltra in orgMeds
              //match the orgMed[device] does this refer to matching the laba, ics device?
              //attempt to match the orgMed[dosePerPuff]
              //after matching orgMed[dosePerPuff] or if not possible to match orgMed[dosePerPuff],  
              // choose the [dosePerPuff] that will minimize the required [puffsPerTime]
            }
            else if (patientMedication.chemicalType === "laba" && !_.isEmpty(typeICS)) {
              const filteredNewMedications = _.filter(medicationElement, {chemicalType: "laba,ICS",});
              for (let i = 0; i < _.size(filteredNewMedications); i++) {
                for (let j = 0; j < _.size(typeICS); i++) {
                  if (
                    (
                      filteredNewMedications.chemicalLABA === patientMedication.chemicalLABA &&
                      filteredNewMedications.chemicalICS === patientMedication.chemicalICS
                    ) || (
                      filteredNewMedications.chemicalLABA === typeICS.chemicalLABA &&
                      filteredNewMedications.chemicalICS === typeICS.chemicalICS
                    )
                  ) {
                    if (
                      filteredNewMedications.device === patientMedication.device ||
                      filteredNewMedications.device === typeICS.device
                    ) {
                      //recommend new medication at highest available ICS Dose (maxGreenICS)
                      result.push(findLtra);
                      //choose original ICS device if not choose LABA
                      //choose dose ICS that will minimize puffPerTime
                    }
                    else {
                      //increase original medication ICS to highest ICS DOSE (maxGreenICS)
                      result.push(findLtra);
                      result.push(patientMedication);
                      //match ICS original device
                      //attempt to match ICS orig dose ICS
                      //attempt to match ICS orig timesPerDay
                      //minimize required CS puffPerTime, highest doseICS
                    }
                  }
                  else {
                    //increase the original medication ICS to highest ICS DOSE (maxGreenICS)
                    result.push(findLtra);
                    result.push(patientMedication);
                    //match ICS original device
                    //attempt to match ICS orig dose ICS
                    //attempt to match ICS orig timesPerDay
                    //minimize required CS puffPerTime, highest doseICS
                  }
                }
              }
            }
          }

          if (patientMedication.name === "symbicort" && _.some(patientMedication, {chemicalType: "ltra"})) {
            result.push(
              _.filter(
                medicationElement,
                {
                  name: "symbicort",
                  function: "controller,reliever",
                  din: patientMedication.din
                })
            );
          }
          return result;
        }, masterMedications, patientMedications);

      rule(patientMedication);

      return result;
    }, [])
    .value();
};