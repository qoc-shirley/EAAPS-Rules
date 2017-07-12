import _ from 'lodash';
import masterMedications from '../MedicationData/MedicationData'

const calculateICSDose = (medication) => {
  return medication.doseICS * medication.timesPerDay;
};

const calculateICSDosePatient = (medication) => {
  return medication.doseICS * medication.timesPerDay * medication.puffPerTime;
};

const getLowestICSDose = (newMedications) => {
  return _.chain(newMedications)
    .minBy(
      (medication) => {
        return calculateICSDose(medication)
      }
    )
    .value();
};

const addToRecommendations = (elements) => {
  return _.chain(elements)
    .reduce((recommend, addElement) => {
      recommend.push(addElement);
      return recommend;
    }, [])
    .value();
};

const categorizeICSDose = (medication) => {
  let doseLevel = '';
  if (calculateICSDosePatient(medication) >= medication.highFloorICS) {
    doseLevel = "high";
  }
  else if (calculateICSDosePatient(medication) <= medication.lowCeilICS) {
    doseLevel = "low";
  }
  else if ((calculateICSDosePatient(medication) > medication.lowCeilICS) &&
    (calculateICSDosePatient(medication) < medication.highFloorICS)) {
    doseLevel = "medium";
  }
  else if (calculateICSDosePatient(medication) > medication.maxGreenICS) {
    doseLevel = "excessive";
  }
  return doseLevel;
};

const categorizeICSDoseMaster = (medication) => {
  let doseLevel = '';
  if (calculateICSDose(medication) >= medication.highFloorICS) {
    doseLevel = "high";
  }
  else if (calculateICSDose(medication) <= medication.lowCeilICS) {
    doseLevel = "low";
  }
  else if ((calculateICSDose(medication) > medication.lowCeilICS) &&
    (calculateICSDosePatient(medication) < medication.highFloorICS)) {
    doseLevel = "medium";
  }
  else if (calculateICSDose(medication) > medication.maxGreenICS) {
    doseLevel = "excessive";
  }
  return doseLevel;
};

const getLabaICSAndICS = (patientMedications) => {
  let result = [];
  let labaICS = false;
  let ICS = false;
  return _.chain(patientMedications)
    .filter(
      _.partial((medicationElements, patientMedication) => {
        if (patientMedication.chemicalType === "ICS") {
          ICS = true;
          result.push(patientMedication);
        }
        else if (patientMedication.chemicalType === "laba,ICS") {
          labaICS = true;
          result.push(patientMedication);
        }
      }, masterMedications))
    .concat(result)
    .flatten()
    .value();
};

// calculateMaximumPuffsPerTime rename calculateMaximumPuffsPerTime(medication.maxPuffPerTime, medication.level)
const adjustICSDose = (medication, level) => {
  const max = medication.maxPuffPerTime;
  let lowMediumICSDose = false;
  let highestICSDose = false;
  let counter = 1;
  let testAdjustment;

  if (level === "lowestMedium") {
    while (lowMediumICSDose === false && (counter < max)) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ((testAdjustment > medication.lowCeilICS) && (testAdjustment < medication.highFloorICS)) {
        medication.maxPuffPerTime = counter;
        lowMediumICSDose = true;
      }
      counter++;
    }
  }
  else if (level === "highest") {
    while (highestICSDose === false && (counter < max)) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if (testAdjustment >= medication.maxGreenICS) {
        medication.maxPuffPerTime = counter;
        highestICSDose = true;
      }
      counter++;
    }
  }
  if (lowMediumICSDose === false && counter > max) {
    console.log("cannot be adjusted with original doseICS");
    return [];
  }
  else if(highestICSDose === false && counter > max) {
    console.log("cannot be adjusted with original doseICS");
    return [];
  }
  return medication;
};

const adjustICSDoseToOriginalMedication = (medication, patientMedication) => {
  const max = medication.maxPuffPerTime;
  let equal = false;
  let counter = 1;
  let testAdjustment;
  while (equal === false && (counter < max)) {
    testAdjustment = medication.doseICS * medication.timesPerDay * counter;
    if (calculateICSDose(testAdjustment) === calculateICSDosePatient(patientMedication)) {
      medication.maxPuffPerTime = counter;
      equal = true;
    }
    counter++;
  }
  if (equal === false && counter > max) {
    console.log("ICS DOSE cannot be made equal");
    return [];
  }
  return medication;
};

const equalICSDose = (medication, patientMedication) => {
  if (calculateICSDosePatient(patientMedication) === calculateICSDose(medication)) {
    return true;
  }
  else {
    return adjustICSDoseToOriginalMedication(medication, patientMedication);
  }
};

//////////////////////////////////////////////// RULES ////////////////////////////////////////////////////////////////

export const rule1 = (patientMedications) => {
  return _.chain(patientMedications)
    .filter((patientMedication) => {
      return patientMedication.chemicalType === "laac";
    })
    .value();
};

export const rule2 = (patientMedications, masterMedications) => {
  let result = [];
  return _.chain(patientMedications)
    .filter(
      _.partial((medicationElement, patientMedication) => {
        if (patientMedication.chemicalType !== "ICS") {

          if ((patientMedication.chemicalType === "laba") && (_.some(medicationElement, { chemicalType: "laba,ICS" }) )) {

            const isLabaICSAndChemicalLABA = _.chain( medicationElement )
              .filter( {
                chemicalType: "laba,ICS",
                chemicalLABA: patientMedication.chemicalLABA,
              } )
              .isEmpty()
              .value();

            if ( !isLabaICSAndChemicalLABA ) {

              const isChemicalLABAAndDeviceEqual = _.chain( medicationElement )
                .filter( {
                  chemicalType: "laba,ICS",
                  chemicalLABA: patientMedication.chemicalLABA,
                  device: patientMedication.device
                } )
                .isEmpty()
                .value();

              if ( !isChemicalLABAAndDeviceEqual ) {

                let newMedications = _.filter(medicationElement, {
                  chemicalType: "laba,ICS",
                  chemicalLABA: patientMedication.chemicalLABA,
                  device: patientMedication.device
                });

                const lowestICSDose = getLowestICSDose(newMedications);
                result.push(addToRecommendations(lowestICSDose)); //concat doesn't work
              }
              else {
                let newMedications = _.filter(medicationElement, {
                  chemicalType: "laba,ICS",
                  chemicalLABA: patientMedication.chemicalLABA
                });

                const lowestICSDose = getLowestICSDose(newMedications);
                result.push(addToRecommendations(lowestICSDose));
              }
            }
            else {
              const newMedications = _.chain(medicationElement)
                .reduce((recommend, medication) => {
                  if (medication.chemicalLABA === "salmeterol" && medication.chemicalICS === "fluticasone" && medication.device === "diskus") {
                    recommend.push(medication);
                  }
                  if (medication.chemicalLABA === "salmeterol" && medication.chemicalICS === "fluticasone" && medication.device === "inhaler2") {
                    recommend.push(medication);
                  }
                  if (medication.chemicalLABA === "formoterol" && medication.chemicalICS === "budesonide") {
                    recommend.push(medication);
                  }
                  if (medication.chemicalLABA === "formoterol" && medication.chemicalICS === "budesonide") {
                    recommend.push(medication);
                  }
                  return recommend;
                }, [])
                .value();

              const lowestICSDose = getLowestICSDose(newMedications);
              result.push(addToRecommendations(lowestICSDose));
            }
          }
          else {
            const newMedications =
              ["Flovent 125 ug 1 PUFF bid",
                "Discus Flovent 100 ug 1 PUFF puff bid",
                "Pulmicort 200 ug 1 PUFF bid",
                "Asmanex 200 ug I PUFF od",
                "Alvesco 200 ug I PUFF od, OR QVAR 100 I PUFF ug bid"
              ];

            result.push(addToRecommendations(newMedications));
          }
        }

        if (patientMedication.chemicalType === "ltra") {
          result.push(patientMedication);
        }
      }, masterMedications))
    .concat(result)
    .value();
};
export const rule3 = (patientMedications, masterMedications) => {
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
                if (chemicalICSMedications[i].maxGreenICS < calculateICSDosePatient(patientMedication)) {
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
              return categorizeICSDoseMaster(medication) === "low";
            });
            const medium = _.filter(newMedication, (medication) => {
              return categorizeICSDoseMaster(medication) === "medium";
            });
            const high = _.filter(newMedication, (medication) => {
              return categorizeICSDoseMaster(medication) === "high";
            });
            const excessive = _.filter(newMedication, (medication) => {
              return categorizeICSDoseMaster(medication) === "excessive";
            });

            if (categorizeICSDose(patientMedication) === "low") {
              console.log("find new medication in low category");
              result.push(getLowestICSDose(low));
            }
            else if (categorizeICSDose(patientMedication) === "medium") {
              console.log("find new medication in medium category");
              result.push(getLowestICSDose(medium));
            }
            else if (categorizeICSDose(patientMedication) === "high") {
              console.log("find new medication in high category");
              result.push(getLowestICSDose(high));
            }
            else if (categorizeICSDose(patientMedication) === "excessive") {
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

export const rule4 = (patientMedications, masterMedications) => {
  let result = [];
  return _.chain(patientMedications)
    .filter(
      // _.reduce((result) => {
      _.partial((medicationElement, patientMedication) => {
        if (patientMedication.chemicalType === "ICS" &&
          patientMedication.name !== "symbicort" &&
          (categorizeICSDose(patientMedication) === "medium" || categorizeICSDose(patientMedication) === "high") &&
          (!_.isEmpty(_.filter(patientMedications, {chemicalType: "laba"})) )) {
          if (!_.isEmpty(_.filter(patientMedications, {chemicalType: "laba, ICS"}))) {
            result.push(patientMedication);
            result.push(_.filter(medicationElement, {name: "singulair"}));
          }
          const getLABAAndICS =  _.filter(patientMedications,
            (medication) => {
            return medication.chemicalType === "laba" || medication.chemicalType === "ICS"
          });
          if (!_.isEmpty(getLABAAndICS)) {
            const filteredMedication = _.filter(medicationElement,
              {
                chemicalType: "laba,ICS",
                chemicalABA: patientMedication.chemicalLABA,
                chemicalICS: patientMedication.chemicalICS
              });
            if (!_.isEmpty(filteredMedication)) {
              if (!_.isEmpty(_.filter(filteredMedication, {device: patientMedication.device}))) {
                console.log("device");
                if (!_.isEmpty(_.filter(filteredMedication, (medication) => {
                    return medication.device === patientMedication.device &&
                      calculateICSDose(medication) === calculateICSDosePatient(patientMedication);
                  }))) {
                  result.push(_.max(_.filter(filteredMedication, {device: patientMedication.device}), 'doseICS'));
                }
                else {
                  result.push(_.filter(filteredMedication, (medication) => {
                    return medication.device === patientMedication.device &&
                      calculateICSDose(medication) === calculateICSDosePatient(patientMedication);
                  }));
                }
                result.push(patientMedication);
                result.push(_.filter(medicationElement, {name: "singulair"}));
              }
              else {
                result.push(patientMedication);
                result.push(_.filter(medicationElement, {name: "singulair"}));
              }
            }
            else {
              result.push(patientMedication);
              result.push(_.filter(medicationElement, {name: "singulair"}));
            }
          }
        }
        if (patientMedication.name === "symbicort" &&
          (categorizeICSDose(patientMedication) === "medium" || categorizeICSDose(patientMedication) === "high")) {
          result.push(_.filter(medicationElement, {name: "symbicort", din: patientMedication.din}));
        }
      }, masterMedications)
      //return result;
      //}, [])
    )
    .concat(result)
    .value();
};

export const rule5 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
          const findLtra = _.find(medications, { chemicalType: "ltra" });

          if (patientMedication.name !== "symbicort" &&
            (
              patientMedication.chemicalType === "laba,ICS" ||
              patientMedication.chemicalType === "laba" ||
              patientMedication.chemicalType === "ICS"
            ) &&
              !_.isEmpty(findLtra) &&
              calculateICSDosePatient(findLtra) < findLtra.maxGreenICS) {
            const typeICS = _.filter(medications, { chemicalType: "ICS" });
            if (patientMedication.chemicalType === "laba,ICS") {
              result.push(patientMedication);
              result.push(findLtra); //any ltra? or all ltra in orgMeds
              //match the orgMed[device] does this refer to matching the laba, ics device?
              //attempt to match the orgMed[dosePerPuff]
              //after matching orgMed[dosePerPuff] or if not possible to match orgMed[dosePerPuff],  
              // choose the [dosePerPuff] that will minimize the required [puffsPerTime]
            }
            else if(patientMedication.chemicalType === "laba" && !_.isEmpty(typeICS)) {
              const filteredNewMedications = _.filter(medicationElement, { chemicalType: "laba,ICS", });
              for (let i = 0; i < _.size(filteredNewMedications); i++) {
                for (let j = 0; j < _.size(typeICS); i++) {
                  if(
                    (
                      filteredNewMedications.chemicalLABA === patientMedication.chemicalLABA &&
                      filteredNewMedications.chemicalICS === patientMedication.chemicalICS
                    ) || (
                      filteredNewMedications.chemicalLABA === typeICS.chemicalLABA &&
                      filteredNewMedications.chemicalICS === typeICS.chemicalICS
                    )
                  ) {
                    if(
                      filteredNewMedications.device === patientMedication.device ||
                      filteredNewMedications.device === typeICS.device
                    ){
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

          if (patientMedication.name === "symbicort" && _.some(patientMedication, { chemicalType: "ltra" })) {
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

export const rule6 = (patientMedications) => {

  const consultRespirologist = _
    .chain(patientMedications)
    .filter((patientMedication) => {
      const filterChemicalTypeLtra = _.filter(patientMedications, { chemicalType: "ltra" });
      const isFilteredLtraGreatermaxGreenICS = _
        .chain(filterChemicalTypeLtra)
        .filter((patientMedication) => {
          if(calculateICSDosePatient(patientMedication) >= patientMedication.maxGreenICS) {
            return true;
          }
          return false;
        })
        .isEmpty()
        .value();
      if (patientMedication.name !== "symbicort" &&
        (patientMedication.chemicalType === "laba,ICS" ||
        patientMedication.chemicalType === "ICS" ||
        patientMedication.chemicalType === "laba" ) &&
        filterChemicalTypeLtra && !isFilteredLtraGreatermaxGreenICS) {
        return true;
      }
      return false
    })
    .value();

  if (!_.isEmpty(consultRespirologist)) {
    return consultRespirologist.concat("consult a respirologist");
  }
  return [];
};

export const rule7 = (patientMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      if (patientMedication.name === "symbicort" &&
        patientMedication.function === "controller,reliever" &&
        categorizeICSDose(patientMedication) === "low") {
        console.log("ya");
        if (adjustICSDose(patientMedication, "lowestMedium") === []) {
          console.log("yaya");
          console.log("filter 1:", _.filter(patientMedications, (medication) => {
            return medication.name === "symbicort" &&
              medication.function === "controller,reliever" &&
              categorizeICSDose(medication) === "low"
          }));
          result.push(
            _.max(
              _.filter(patientMedications, (medication) => {
                return medication.name === "symbicort" &&
                  medication.function === "controller,reliever" &&
                  categorizeICSDose(medication) === "low"
              }),
              'doseICS'));
        }
        else {
          console.log("yayaya");
          console.log("adjustICSDose: ", adjustICSDose(patientMedication, "lowestMedium"));
          result.push(adjustICSDose(patientMedication, "lowestMedium"));
        }
      }
      console.log("return");
      console.log(result);
      return result;
    }, [])
    .value();
};

export const rule8 = (patientMedications, masterMedications) => {
  const isSMARTMediumOrHigh = _.chain( patientMedications)
    .filter( (patientMedication) => {
      if( patientMedication.name === "symbicort" &&
        patientMedication.function === "controller,reliever" &&
        (categorizeICSDose( patientMedication ) === "medium" || categorizeICSDose( patientMedication ) === "high")) {
        return true;
      }
      return false;
    })
    .value();

  if(!_.isEmpty(isSMARTMediumOrHigh) ) {
    return isSMARTMediumOrHigh
      .concat(
        _.chain( masterMedications)
          .filter( { name: "singulair" })
          .value()
      )
  }
  return [];
};

export const rule9 = ( patientMedications ) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      if (patientMedication.name === "symbicort" && patientMedication.controller === "controller,reliever" &&
        ( calculateICSDose( patientMedication ) < patientMedication.maxGreenICS ) &&
        _.some( patientMedications, { chemicalType: "ltra" } ) ) {
        console.log("ya");
        if (adjustICSDose(patientMedication, "highest") === []) {
          console.log("yaya");
          result.push(
            _.max(
              _.filter(patientMedications, (medication) => {
                return medication.name === "symbicort" &&
                  medication.controller === "controller,reliever" &&
                  (calculateICSDose( medication ) < medication.maxGreenICS)
              }),
              'doseICS'));
          result.push( patientMedications );
          result.push( _.filter( patientMedications, { chemicalType: "ltra" } ) );
        }
        else {
          console.log("yayaya");
          console.log("adjustICSDose: ", adjustICSDose(patientMedication, "highest"));
          result.push( patientMedications );
          result.push(adjustICSDose(patientMedication, "highest"));
          result.push( _.filter( patientMedications, { chemicalType: "ltra" } ) );
        }
      }
      console.log("return");
      console.log(result);
      return result;
    }, [])
    .value();
};

export const rule10 = (patientMedications, masterMedications) => {
  const consultRespirologist = _
    .chain(patientMedications)
    .filter(
      _.partial((medicationElements, patientMedication) => {
        if (patientMedication.name === "symbicort" &&
          patientMedication.function === "controller,reliever" &&
          ( calculateICSDosePatient(patientMedication) >= patientMedication.maxGreenICS )) {
          if (_.find(patientMedications, { chemicalType: "ltra" } )) {
            return true;
          }
          return false;
        }
      }, masterMedications)
    )
    .value();

  if(!_.isEmpty(consultRespirologist)) {
    return consultRespirologist.concat("consult a respirologist");
  }
  return [];
};

export const rule11 = (patientMedications, masterMedications) => {
  let newMedication = [];
  let filteredPatientMedications = getLabaICSAndICS(patientMedications);
  if (_.find(filteredPatientMedications, { chemicalType: "ICS" }) && _.find(filteredPatientMedications, { chemicalType: "laba,ICS" })) {
    newMedication = _.filter(masterMedications, { name: "singulair" } );
  }
  else {
    filteredPatientMedications = [];
  }
  return _.concat(newMedication, filteredPatientMedications)
};

export const rule12 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      let rule =
        _.partial((medicationElement, medications, patientMedication) => {
        if(
            patientMedication.name === "symbicort" &&
          (
            patientMedication.chemicalType === "laba,ICS" ||
            patientMedication.chemicalType === "laba" ||
            patientMedication.chemicalType === "ICS"
          ) && calculateICSDosePatient(patientMedication) === "low"
        ) {

        }
        else if (patientMedication.name === "symbicort" && categorizeICSDose(patientMedication) === "low") {
            result.push(_.filter(medicationElement, { name: "symbicort", function: "controller,reliever",din: patientMedication.din }));
        }
          return result;
        }, masterMedications, patientMedications);

      rule(patientMedication);

      return result;
    }, [])
    .value();
};