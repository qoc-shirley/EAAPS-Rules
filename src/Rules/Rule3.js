import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
import * as categorize from './Library/CategorizeDose';
import * as match from './Library/Match';

const rule3 = (patientMedications, masterMedications) => {
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
              const tryTimesPerDay = match.timesPerDay(isLabaICS, patientMedication);

              if (!_.isEmpty(tryTimesPerDay)) {
                const tryDoseICS = match.doseICS(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryDoseICS)) {
                  result.push(tryDoseICS);
                }
                const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                if(!_.isEmpty(tryMinimizePuffs)) {
                  result.push(tryMinimizePuffs);
                }
                result.push(tryTimesPerDay);
              }
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

export default rule3;
