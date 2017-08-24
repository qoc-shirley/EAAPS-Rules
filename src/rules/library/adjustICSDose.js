import * as calculate from './calculateICSDose';
import _ from 'lodash';

export const ICSDose = ( medication, level ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let lowMediumICSDose = false;
  let highestICSDose = false;
  let counter = 1;
  let testAdjustment;

  if ( level === 'lowestMedium' ) {
    while ( lowMediumICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment > _.toInteger( medication.lowCeilICS ) &&
        testAdjustment < _.toInteger( medication.highFloorICS ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        medication.maxPuffPerTime = counter;
        lowMediumICSDose = true;

        return medication;
      }
      counter++;
    }
  }
  else if ( level === 'highest' ) {
    // console.log('max:', max);
    // console.log('medication: ', medication);
    while ( highestICSDose === false && counter <= max ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      // console.log( 'test adjustment: ', testAdjustment, medication.maxGreenICS, counter );
      // console.log('compare values: ',  testAdjustment === _.toInteger( medication.maxGreenICS ));
      if ( testAdjustment === _.toInteger( medication.maxGreenICS ) ) {
        medication.maxPuffPerTime = counter;
        highestICSDose = true;

        return medication;
      }
      counter++;
    }
  }

  return [];
};

export const checkDoseReduction = ( medication, level, originalICSDose ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let exactlyFifty = false;
  let betweenFiftyAndFullDose = false;
  let counter = 1;
  let testAdjustment;

  if ( level === 'exactlyFifty' ) {
    while ( exactlyFifty === false && counter <= max ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment === originalICSDose / 2 ) {
        medication.maxPuffPertime = counter;
        exactlyFifty = true;

        return medication;
      }
      counter++;
    }
  }
  else if ( level === 'betweenFiftyAndFullDose' ) {
    exactlyFifty = true;
    while ( betweenFiftyAndFullDose === false && counter <= max ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment >= originalICSDose / 2 &&
         testAdjustment < originalICSDose ) {
        medication.maxPuffPerTime = counter;
        betweenFiftyAndFullDose = true;

        return medication;
      }
      counter++;
    }
  }

  return [];

};

export const ICSDoseToOriginalMedication = ( medication, patientMedication ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let equal = false;
  let counter = 1;
  let testAdjustment;
  while ( equal === false && ( counter <= max ) ) {
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    // console.log('testAdjustment: ', testAdjustment, calculate.patientICSDose( patientMedication ));
    if ( testAdjustment === calculate.patientICSDose( patientMedication ) ) {
      // console.log("adjust equal: ", medication);
      medication.maxPuffPerTime = counter;
      equal = true;

      return medication;
    }
    counter++;
  }

  return [];

};

export const ICSDoseToDose = ( medication, dose ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let equal = false;
  let counter = 1;
  let testAdjustment;
  while ( equal === false && ( counter <= max ) ) {
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    if ( testAdjustment === dose ) {
      equal = true;

      return medication;
    }
    counter++;
  }

  return [];
};

export const ICSDoseToMax = ( medication ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let equal = false;
  let counter = max;
  let testAdjustment;
  while ( equal === false && ( counter > 0 ) ) {
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    if ( testAdjustment === _.toInteger( medication.maxGreenICS ) ) {
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
  const max = _.toInteger( medication.maxPuffPerTime );
  let higherNext = false;
  let counter = 1;
  let testAdjustment;
  while ( higherNext === false && ( counter <= max ) ) {
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    // console.log(testAdjustment , calculate.patientICSDose( patientMedication ));
    if ( testAdjustment > calculate.patientICSDose( patientMedication ) ) {
      medication.maxPuffPerTime = counter;
      higherNext = true;

      return medication;
    }
    counter = counter + 1;
  }

  return [];

};
