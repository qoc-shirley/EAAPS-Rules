import * as calculate from './CalculateICSDose';

export const patientICSDose = (medication) => {
  let doseLevel = '';
  if (calculate.patientICSDose(medication) >= medication.highFloorICS) {
    doseLevel = "high";
  }
  else if (calculate.patientICSDose(medication) <= medication.lowCeilICS) {
    console.log("here");
    doseLevel = "low";
  }
  else if ((calculate.patientICSDose(medication) > medication.lowCeilICS) &&
    (calculate.patientICSDose(medication) < medication.highFloorICS)) {
    doseLevel = "medium";
  }
  else if (calculate.patientICSDose(medication) > medication.maxGreenICS) {
    doseLevel = "excessive";
  }
  return doseLevel;
};

export const ICSDose = (medication) => {
  let doseLevel = '';
  if (calculate.ICSDose(medication) >= medication.highFloorICS) {
    doseLevel = "high";
  }
  else if (calculate.ICSDose(medication) <= medication.lowCeilICS) {
    doseLevel = "low";
  }
  else if ((calculate.ICSDose(medication) > medication.lowCeilICS) &&
    (calculate.ICSDose(medication) < medication.highFloorICS)) {
    doseLevel = "medium";
  }
  else if (calculate.ICSDose(medication) > medication.maxGreenICS) {
    doseLevel = "excessive";
  }
  return doseLevel;
};