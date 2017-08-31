import * as calculate from './calculateICSDose';
import _ from 'lodash';

export const ICSDose = ( medication, level ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let lowMediumICSDose = false;
  let highestICSDose = false;
  let highICSDose = false;
  let lowICSDose = false;
  let counter = 1;
  let testAdjustment;

  if ( level === 'medium' ) {
    while ( lowMediumICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment > _.toInteger( medication.lowCeilICS ) &&
        testAdjustment < _.toInteger( medication.highFloorICS ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        lowMediumICSDose = true;

        return Object.assign( medication, { maxPuffPerTime: counter } );
      }
      counter += 1;
    }
  }
  else if ( level === 'high' ) {
    while ( highICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment >= _.toInteger( medication.highFloorICS ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        highICSDose = true;

        return Object.assign( medication, { maxPuffPerTime: counter } );
      }
      counter += 1;
    }
  }
  else if ( level === 'low' ) {
    while ( lowICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment <= _.toInteger( medication.lowCeilICS ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        lowICSDose = true;

        return Object.assign( medication, { maxPuffPerTime: counter } );
      }
      counter += 1;
    }
  }
  else if ( level === 'highest' ) {
    // console.log('max:', max);
   //  console.log('medication: ', medication);
    while ( highestICSDose === false && counter <= max ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      // console.log( 'test adjustment: ', testAdjustment, medication.maxGreenICS, counter );
      // console.log('compare values: ',  testAdjustment === _.toInteger( medication.maxGreenICS ));
      if ( testAdjustment === _.toInteger( medication.maxGreenICS ) ) {
        highestICSDose = true;

        return Object.assign( medication, { maxPuffPerTime: counter } );
      }
      counter += 1;
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
        exactlyFifty = true;

        return Object.assign( medication, { maxPuffPerTime: counter } );
      }
      counter += 1;
    }
  }
  else if ( level === 'betweenFiftyAndFullDose' ) {
    exactlyFifty = true;
    while ( betweenFiftyAndFullDose === false && counter <= max ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment >= originalICSDose / 2 &&
         testAdjustment < originalICSDose ) {
        betweenFiftyAndFullDose = true;

        return Object.assign( medication, { maxPuffPerTime: counter } );
      }
      counter += 1;
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
    if ( testAdjustment === calculate.patientICSDose( patientMedication ) ) {
      // console.log("adjust equal: ", medication);
      equal = true;

      return Object.assign( medication, { maxPuffPerTime: counter } );
    }
    counter += 1;
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
    counter += 1;
  }

  return [];
};

// export const ICSDoseToMax = ( medication ) => {
//   const max = _.toInteger( medication.maxPuffPerTime );
//   let equal = false;
//   let counter = max;
//   let testAdjustment;
//   while ( equal === false && ( counter > 0 ) ) {
//     testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
//     if ( testAdjustment === _.toInteger( medication.maxGreenICS ) ) {
//       medication.maxPuffPerTime = counter;
//       equal = true;
//       return medication;
//     }
//     counter = counter - 1;
//   }
//
//   return [];
// };

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
      higherNext = true;

      return Object.assign( medication, { maxPuffPerTime: counter } );
    }
    counter += 1;
  }

  return [];
};
