import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
// import * as categorize from './Library/CategorizeDose';
import * as get from './Library/GetICSDose';
import * as adjust from './Library/AdjustICSDose';
import * as match from './Library/Match';

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
              // const tryOriginalDevice
              // const tryMatchDoseICS = match.doseICS(isLabaICS, );
              const recommendHighest = adjust.ICSDose(isLabaICS, "highest");
              if (!_.isEmpty(recommendHighest)) {
                if (_.size(recommendHighest) > 2) {
                  const tryMinimize = match.minimizePuffsPerTime(recommendHighest, get.lowestICSDose(recommendHighest));
                  result.push(tryMinimize);
                  result.push(findLtra);//any ltra? or all ltra in orgMeds
                }
                result.push(recommendHighest);
                result.push(findLtra);//any ltra? or all ltra in orgMeds
              }
            }
            else if (!_.isEmpty(isICS) && !_.isEmpty(isLaba)) {
              console.log("laba and ICS");
              const filteredMedication = _.filter(medicationElement,
                {
                  chemicalType: "laba,ICS",
                  chemicalABA: patientMedication.chemicalLABA,
                  chemicalICS: patientMedication.chemicalICS
                });
              const highestICSDose = _.filter(filteredMedication, (medication) => {
                return (adjust.ICSDose(medication, "highest") !== []);
              });
              if (!_.isEmpty(highestICSDose)) {
                const getDeviceIcsOrLaba = _.filter(filteredMedication, (medication) => {
                  return medication.device === isLaba.device || medication.device === isICS.device
                });
                const getICSDevice = _.filter(filteredMedication, (medication) => {
                  return medication.device === isICS.device
                });
                const getLabaDevice = _.filter(filteredMedication, (medication) => {
                  return medication.device === isLaba.device
                });
                if (!_.isEmpty(getDeviceIcsOrLaba)) {
                  if (!_.isEmpty(getICSDevice)) {
                    const tryMinimizePuffs = match.minimizePuffsPerTime(getICSDevice, patientMedication);
                    if (!_.isEmpty(tryMinimizePuffs)) {
                      result.push(get.lowestICSDose(tryMinimizePuffs));
                      result.push(_.filter(medications, {chemicalType: "ltra"}));
                    }
                    result.push(get.lowestICSDose(getICSDevice));
                    result.push(_.filter(medications, {chemicalType: "ltra"}));
                  }
                  result.push(get.lowestICSDose(getLabaDevice));
                  result.push(_.filter(medications, {chemicalType: "ltra"}));
                }
              }
              else {
                result.push(_.filter(medications, {chemicalType: "ltra"}));
                result.push(_.filter(medications, {chemicalType: "laba"}));
              }

            }
            else {
              result.push(_.filter(medications, {chemicalType: "ltra"}));
              result.push(_.filter(medications, {chemicalType: "laba"}));
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
      result = _.flatten(result);
      result = _.uniqBy(result, "id");
      return result;
    }, [])
    .value();
};

export default rule5;