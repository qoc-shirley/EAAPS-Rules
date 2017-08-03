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
        lowMediumICSDose = true;
      }
      counter++;
    }
  }
  else if ( level === 'highest' ) {
    while ( highestICSDose === false && counter <= max ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( testAdjustment >= medication.maxGreenICS ) {
        highestICSDose = true;
      }
      counter++;
    }
  }
  if ( lowMediumICSDose === false && counter > max ) {
    return [];
  }
  else if ( highestICSDose === false ) {

    return [];
  }

  return medication;
};

export const checkDoseReduction = ( medication, level, originalICSDose ) => {
  const max = medication.maxPuffPerTime;
  let exactlyFifty = false;
  let betweenFiftyAndFullDose = false;
  let counter = 1;
  let testAdjustment;

  if ( level === 'exactlyFifty' ) {
    while ( exactlyFifty === false && counter <= max ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( calculate.ICSDose( testAdjustment ) === originalICSDose / 2 ) {
        exactlyFifty = true;
      }
      counter++;
    }
  }
  else if ( level === 'betweenFiftyAndFullDose' ) {
    while ( betweenFiftyAndFullDose === false && counter <= max ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( calculate.ICSDose( testAdjustment ) >= originalICSDose / 2 &&
        calculate.ICSDose( testAdjustment ) < originalICSDose ) {
        betweenFiftyAndFullDose = true;
      }
      counter++;
    }
  }
  if ( exactlyFifty === false ) {
    return [];
  }
  else if ( betweenFiftyAndFullDose === false ) {

    return [];
  }

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
