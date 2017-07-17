import _ from 'lodash';
import * as categorize from './library/categorizeDose';
import * as get from './library/getICSDose';
import * as adjust from './library/adjustICSDose';
import * as match from './library/match';

const rule3 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
        console.log(categorize.patientICSDose(patientMedication), categorize.patientICSDose(patientMedication) === "low");

          const filterOrgMeds = _.filter(medications, (medication) => {
            return medication.name !== "symbicort" &&
              (
                (medication.chemicalType === "laba,ICS" && categorize.patientICSDose(medication) === "low")||
                medication.chemicalType === "laba" ||
                (medication.chemicalType === "ICS" && categorize.patientICSDose(medication) === "low")
              )
          });
          console.log("filterOrgMeds: ", filterOrgMeds);
          const isLabaICS = _.filter(filterOrgMeds, {chemicalType: "laba,ICS"});
          const isLaba = _.filter(filterOrgMeds, {chemicalType: "laba"});
          const isICS = _.filter(filterOrgMeds, {chemicalType: "ICS"});
          if (!_.isEmpty(isLabaICS) || (!_.isEmpty(isLaba) && !_.isEmpty(isICS))) {
            if (patientMedication.chemicalType === "laba,ICS") {
              console.log("laba,ICS");
              const tryTimesPerDay = match.timesPerDay(isLabaICS, patientMedication);

              if (!_.isEmpty(tryTimesPerDay)) {
                console.log("tryTimes");
                const tryDoseICS = match.doseICS(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryDoseICS)) {
                  console.log("tryDose");
                  result.push(tryDoseICS);
                }
                const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryMinimizePuffs)) {
                  console.log("tryPuffs");
                  result.push(tryMinimizePuffs);
                }
                result.push(tryTimesPerDay);
              }
              result.push(isLabaICS);
            }
            else if (patientMedication.chemicalType === "laba" && !_.isEmpty(isICS)) {
              console.log("laba and ICS");
              const filteredMedication = _.filter(medicationElement, (masterMedication) => {
                return masterMedication.chemicalType === "laba,ICS" &&
                  ( _.filter(isLaba, (medication) => {
                    return masterMedication.chemicalLABA === medication.chemicalLABA
                  }) && _.filter(isICS, (medication) => {
                    return masterMedication.chemicalICS === medication.chemicalICS
                    })
                  )
              });

              if (!_.isEmpty(filteredMedication)) {
                console.log("filteredMedication: ", filteredMedication);

                const getDeviceIcsOrLaba = _.filter(filteredMedication, (medication) => {
                  return (medication.device === isLaba.device) || (medication.device === isICS.device)
                });
                const getICSDevice = _.filter(filteredMedication, (medication) => {
                  return medication.device === isICS.device
                });
                const getLabaDevice = _.filter(filteredMedication, (medication) => {
                  return medication.device === isLaba.device
                });
                console.log("getDeviceIcsOrLaba: ",getDeviceIcsOrLaba);
                console.log("getICSDevice: ",getICSDevice);
                console.log("getLabaDevice: ",getLabaDevice);
                if (!_.isEmpty(getDeviceIcsOrLaba)) {
                  console.log("match device?");
                  if (!_.isEmpty(getICSDevice)) {
                    console.log("match ics device");
                    const tryMinimizePuffs = match.minimizePuffsPerTime(getICSDevice, get.lowestICSDose(isICS));
                    if (!_.isEmpty(tryMinimizePuffs)) {
                      result.push(get.lowestICSDose(tryMinimizePuffs));
                    }
                    else {
                      result.push(get.lowestICSDose(getICSDevice));
                    }
                  }
                  else {
                    console.log("match laba device");
                    const tryMinimizePuffs = match.minimizePuffsPerTime(getLabaDevice, get.lowestICSDose(isLaba));
                    if (!_.isEmpty(tryMinimizePuffs)) {
                      result.push(get.lowestICSDose(tryMinimizePuffs));
                    }
                    else {
                      result.push(get.lowestICSDose(getLabaDevice));
                    }
                  }
                }
                else {
                  const increaseOriginalMedication = adjust.ICSDose(getDeviceIcsOrLaba, "lowestMedium");
                  if (!_.isEmpty(increaseOriginalMedication)) {
                    const tryICSDevice = match.device(increaseOriginalMedication, getICSDevice);
                    if (!_.isEmpty(tryICSDevice)) {
                      const tryDoseICS = match.doseICS(tryICSDevice, getICSDevice);
                      if (!_.isEmpty(tryDoseICS)) {
                        const tryTimesPerDay = match.timesPerDay(tryDoseICS, getICSDevice);
                        if (!_.isEmpty(tryTimesPerDay)) {
                          const tryMinimize = match.minimizePuffsPerTime(tryTimesPerDay, getICSDevice);
                          if (!_.isEmpty(tryMinimize)) {
                            result.push(tryMinimize);
                            //what is there is no ltra in original medications?
                            result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
                          }
                          result.push(tryTimesPerDay);
                          result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
                        }
                        result.push(tryDoseICS);
                        result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
                      }
                      result.push(tryICSDevice);
                      result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
                    }
                    result.push(increaseOriginalMedication);
                    result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
                  }
                }
              }
              else {
                const increaseOriginalMedication = adjust.ICSDose(filteredMedication, "lowestMedium");
                if (!_.isEmpty(increaseOriginalMedication)) {
                  const tryICSDevice = match.device(increaseOriginalMedication, isICS);
                  if (!_.isEmpty(tryICSDevice)) {
                    const tryDoseICS = match.doseICS(tryICSDevice, isICS);
                    if (!_.isEmpty(tryDoseICS)) {
                      const tryTimesPerDay = match.timesPerDay(tryDoseICS, isICS);
                      if (!_.isEmpty(tryTimesPerDay)) {
                        const tryMinimize = match.minimizePuffsPerTime(tryTimesPerDay, isICS);
                        if (!_.isEmpty(tryMinimize)) {
                          result.push(tryMinimize);
                          //what is there is no laba in original medications?
                          result.push(_.filter(patientMedications, {chemicalType: "laba"}));
                        }
                        result.push(tryTimesPerDay);
                        result.push(_.filter(patientMedications, {chemicalType: "laba"}));
                      }
                      result.push(tryDoseICS);
                      result.push(_.filter(patientMedications, {chemicalType: "laba"}));
                    }
                    result.push(tryICSDevice);
                    result.push(_.filter(patientMedications, {chemicalType: "laba"}));
                  }
                  result.push(increaseOriginalMedication);
                  result.push(_.filter(patientMedications, {chemicalType: "laba"}));
                }
              }
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
      result = _.flatten(result);
      result = _.uniqBy(result, "id");
      return result;
    }, [])
    .value();
};

export default rule3;
