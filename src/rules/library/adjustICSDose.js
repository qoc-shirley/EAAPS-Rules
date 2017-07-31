import * as calculate from './calculateICSDose';

export const ICSDose = ( medication, level ) => {
  const max = medication.maxPuffPerTime;
  let lowMediumICSDose = false;
  let highestICSDose = false;
  let counter = 1;
  let testAdjustment;

  if ( level === 'lowestMedium' ) {
    while ( lowMediumICSDose === false && ( counter < max ) ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( ( testAdjustment > medication.lowCeilICS ) && ( testAdjustment < medication.highFloorICS ) ) {
        // medication.maxPuffPerTime = counter;
        lowMediumICSDose = true;
      }
      counter++;
    }
  }
  else if ( level === 'highest' ) {
    while ( highestICSDose === false && ( counter < max ) ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( testAdjustment >= medication.maxGreenICS ) {
        // medication.maxPuffPerTime = counter;
        highestICSDose = true;
      }
      counter++;
    }
  }
  if ( lowMediumICSDose === false && counter > max ) {
    // console.log("cannot be adjusted with original doseICS");
    return [];
  }
  else if ( highestICSDose === false && counter > max ) {
    // console.log("cannot be adjusted with original doseICS");
    return [];
  }

  return medication;
};

export const ICSDoseToOriginalMedication = ( medication, patientMedication ) => {
  const max = medication.maxPuffPerTime;
  let equal = false;
  let counter = 1;
  let testAdjustment;
  while ( equal === false && ( counter < max ) ) {
    testAdjustment = medication.doseICS * medication.timesPerDay * counter;
    if ( calculate.ICSDose( testAdjustment ) === calculate.patientICSDose( patientMedication ) ) {
      // medication.maxPuffPerTime = counter;
      equal = true;
    }
    counter++;
  }
  if ( equal === false && counter > max ) {
    // console.log("ICS DOSE cannot be made equal");
    return null;
  }

  return medication;
};
