import _ from 'lodash';
import masterMedications from '../MedicationData/MedicationData'

const calculateICSDose = (medication) => {
  return medication.doseICS * medication.timesPerDay;
};

const getLowestICSDose = (newMedications) => {
  return _.chain(newMedications)
    .min(
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
  if (calculateICSDose(medication) >= medication.highFloorICS) {
    doseLevel = "high";
  }
  else if (calculateICSDose(medication) <= medication.lowCeilICS) {
    doseLevel = "low";
  }
  else if ((calculateICSDose(medication) > medication.lowCeilICS) &&
    (calculateICSDose(medication) < medication.highFloorICS)) {
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

              result.push(addToRecommendations(newMedications));
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

export const rule4 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .filter(
      _.reduce((result) => {
        console.log("aaa");
        _.partial((medicationElement, patientMedication) => {
          if(patientMedication.chemicalType === "ICS" &&
            patientMedication.name !== "symbicort" &&
            (calculateICSDose(patientMedication) === "medium" || calculateICSDose(patientMedication) === "high") &&
            _.filter(patientMedications, { chemicalType: "laba" })) {
            if(patientMedication.chemicalType === "laba,ICS") {
              result.push(_.filter(medicationElement, { name: "singulair"}));
            }
            else if(_.filter(patientMedications, { chemicalType: "laba", chemicalType: "ICS" })) {
              const filteredMedication = _.filter(medicationElement,
                {
                  chemicalType: "laba,ICS",
                  chemicalABA: patientMedication.chemicalLABA,
                  chemicalICS: patientMedication.chemicalICS
                });
              if(filteredMedication){
                if((patientMedication.chemicalType === "laba" && _.filter(filteredMedication, { device: patientMedication.device })) ||
                  (patientMedication.chemicalType === "ICS" && _.filter(filteredMedication, { device: patientMedicaiton.device })) {
                  //ADD: recommend new medication at the same ICS dose as the original medication ICS Dose
                  result.push(_.filter(medicationElement, { name: "singulair"}));
                }
                else {
                  result.push(_.filter(medicationElement, { name: "singulair"}));
                }
              }
              else {
                result.push(_.filter(medicationElement, { name: "singulair"}));å
              }
            }
          }
          else if(patientMedication.name === "symbicort" &&
            (calculateICSDose(patientMedication) === "medium" || calculateICSDose(patientMedication) === "high")) {
            console.log("b");
            result.push(_.filter(medicationElement, { name: "symbicort", din: patientMedication.din }))
          }
        }, masterMedications );
        return result;
      }, [])
    )
    .concat()
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
          if(calculateICSDose(patientMedication) >= patientMedication.maxGreenICS) {
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

  if(!_.isEmpty(consultRespirologist)) {
    return consultRespirologist.concat("consult a respirologist");
  }
  return [];
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

export const rule10 = (patientMedications, masterMedications) => {
  const consultRespirologist = _
    .chain(patientMedications)
    .filter(
      _.partial((medicationElements, patientMedication) => {
        if (patientMedication.name === "symbicort" &&
          patientMedication.function === "controller,reliever" &&
          ( calculateICSDose(patientMedication) >= patientMedication.maxGreenICS )) {
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