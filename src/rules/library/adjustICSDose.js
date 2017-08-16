import * as calculate from './calculateICSDose';

export const ICSDose = ( medication, level ) => {
  const max = medication.maxPuffPerTime;
  let lowMediumICSDose = false;
  let highestICSDose = false;
  let counter = 1;
  let testAdjustment;

  if ( level === 'lowestMedium' ) {
    while ( lowMediumICSDose === false && ( counter <= max ) ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( ( testAdjustment > medication.lowCeilICS ) && ( testAdjustment < medication.highFloorICS ) ) {
        medication.maxPuffPerTime = counter;
        lowMediumICSDose = true;
      }
      counter++;
    }
  }
  else if ( level === 'highest' ) {
    while ( highestICSDose === false && counter <= max ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( testAdjustment === medication.maxGreenICS ) {
        medication.maxPuffPerTime = counter;
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
      if ( testAdjustment === originalICSDose / 2 ) {
        exactlyFifty = true;
      }
      counter++;
    }
  }
  else if ( level === 'betweenFiftyAndFullDose' ) {
    exactlyFifty = true;
    while ( betweenFiftyAndFullDose === false && counter <= max ) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ( testAdjustment >= originalICSDose / 2 &&
         testAdjustment < originalICSDose ) {

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

  return medication;
};

export const ICSDoseToOriginalMedication = ( medication, patientMedication ) => {
  const max = medication.maxPuffPerTime;
  let equal = false;
  let counter = 1;
  let testAdjustment;
  while ( equal === false && ( counter <= max ) ) {
    testAdjustment = medication.doseICS * medication.timesPerDay * counter;
    // console.log('testAdjustment: ', testAdjustment, calculate.patientICSDose( patientMedication ));
    if ( testAdjustment === calculate.patientICSDose( patientMedication ) ) {
      // console.log("equal");
      medication.maxPuffPerTime = counter;
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

export const ICSDoseToDose = ( medication, dose ) => {
  const max = medication.maxPuffPerTime;
  let equal = false;
  let counter = 1;
  let testAdjustment;
  while ( equal === false && ( counter <= max ) ) {
    testAdjustment = medication.doseICS * medication.timesPerDay * counter;
    if ( testAdjustment  === dose ) {
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

export const ICSDoseToMax = ( medication ) => {
  const max = medication.maxPuffPerTime;
  let equal = false;
  let counter = max;
  let testAdjustment;
  while ( equal === false && ( counter > 0 ) ) {
    testAdjustment = medication.doseICS * medication.timesPerDay * counter;
    if ( testAdjustment === medication.maxGreenICS ) {
      medication.maxPuffPerTime = counter;
      equal = true;
    }
    counter = counter - 1;
  }
  if ( equal === false ) {
    // console.log("ICS DOSE cannot be made equal");
    return null;
  }

  return medication;
};

export const ICSHigherNext = ( medication, patientMedication ) => {
  // console.log(medication, patientMedication);
  const max = medication.maxPuffPerTime;
  let higherNext = false;
  let counter = 1;
  let testAdjustment;
  while ( higherNext === false && ( counter <= max ) ) {
    testAdjustment = medication.doseICS * medication.timesPerDay * counter;
    // console.log(testAdjustment , calculate.patientICSDose( patientMedication ));
    if ( testAdjustment > calculate.patientICSDose( patientMedication ) ) {
      medication.maxPuffPerTime = counter;
      higherNext = true;
    }
    counter = counter + 1;
  }
  if ( higherNext === false ) {
    // console.log("ICS DOSE cannot be made equal");
    return null;
  }

  return medication;
};
