import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
// import * as categorize from './Library/CategorizeDose';
import * as get from './Library/GetICSDose';
// import * as adjust from './Library/AdjustICSDose';
// import * as match from './Library/Match';

const rule5 = (patientMedications, masterMedications) => {
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
          const findLtra = _.find(medications, {chemicalType: "ltra"});
          const isLabaICS = _.filter(filterOrgMeds, {chemicalType: "laba,ICS"});
          const isLaba = _.filter(filterOrgMeds, {chemicalType: "laba"});
          const isICS = _.filter(filterOrgMeds, {chemicalType: "ICS"});

          if (!_.isEmpty(isLabaICS) || (!_.isEmpty(isLaba) && !_.isEmpty(isICS)) &&
            !_.isEmpty(findLtra) &&
            calculate.patientICSDose(findLtra) < findLtra.maxGreenICS) {

            if (!_.isEmpty(isLabaICS)) {
              const recommendHighest = get.highestICSDose(isLabaICS);
              const tryOriginalDevice
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

export default rule5;