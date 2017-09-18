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
  let testAdjustmentLaba;
  console.log('medication to adjust: ', medication, level);

  if ( level === 'medium' ) {
    // console.log('medium');
    while ( lowMediumICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      testAdjustmentLaba = _.toInteger( medication.doseLABA ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment > _.toInteger( medication.lowCeilICS ) &&
        testAdjustment < _.toInteger( medication.highFloorICS ) &&
        testAdjustment <= _.toInteger( medication.maxGreenICS ) &&
        testAdjustmentLaba <= _.toInteger( medication.maxGreenLABA ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        lowMediumICSDose = true;
        console.log('medication medium: ',  Object.assign( medication, { puffsPerTime: counter } ) );

        return Object.assign( medication, { puffsPerTime: counter } );
      }
      counter += 1;
    }
  }
  else if ( level === 'high' ) {
    while ( highICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      testAdjustmentLaba = _.toInteger( medication.doseLABA ) * _.toInteger( medication.timesPerDay ) * counter;
      console.log('testAdjustment  high: ',  _.toInteger( medication.doseICS ),  _.toInteger( medication.timesPerDay ),  counter );
      if ( testAdjustment >= _.toInteger( medication.highFloorICS ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        highICSDose = true;
        console.log('medication high: ',  Object.assign( medication, { puffsPerTime: counter } ) );

        return Object.assign( medication, { puffsPerTime: counter } );
      }
      counter += 1;
    }

    return [];
  }
  else if ( level === 'low' ) {
    while ( lowICSDose === false && ( counter <= max ) ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      testAdjustmentLaba = _.toInteger( medication.doseLABA ) * _.toInteger( medication.timesPerDay ) * counter;
      if ( testAdjustment <= _.toInteger( medication.lowCeilICS ) &&
        testAdjustment <= _.toInteger( medication.maxGreenICS ) &&
        testAdjustmentLaba <= _.toInteger( medication.maxGreenLABA ) ) {
        // console.log( 'test adjustment: ', testAdjustment, counter );
        lowICSDose = true;
        console.log('medication low: ',  Object.assign( medication, { puffsPerTime: counter } ) );

        return Object.assign( medication, { puffsPerTime: counter } );
      }
      counter += 1;
    }
  }
  else if ( level === 'highest' ) {
    // console.log('max:', max);
   // console.log('medication: ', medication);
    while ( highestICSDose === false && counter <= max ) {
      testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
      testAdjustmentLaba = _.toInteger( medication.doseLABA ) * _.toInteger( medication.timesPerDay ) * counter;
      // console.log( 'test adjustment: ', testAdjustment, medication.maxGreenICS, counter );
      // console.log('compare values ICS: ',  testAdjustment === _.toInteger( medication.maxGreenICS ));
      // console.log('compare values LABA: ',  testAdjustmentLaba  <= _.toInteger( medication.maxGreenLABA ),testAdjustmentLaba, medication.maxGreenLABA);
      if ( testAdjustment === _.toInteger( medication.maxGreenICS ) &&
           testAdjustmentLaba <= _.toInteger( medication.maxGreenLABA ) ) {
        highestICSDose = true;
        // console.log('medication highest: ',  Object.assign( medication, { puffsPerTime: counter } ) );

        return Object.assign( medication, { puffsPerTime: counter } );
      }
      counter += 1;
    }
  }

  return [];
};

export const checkDoseReduction = ( medication, level, patientMedication ) => {
  const clonedMedication = _.cloneDeep( medication );
  const max = _.toInteger( clonedMedication.maxPuffPerTime );
  let exactlyFifty = false;
  let betweenFiftyAndFullDose = false;
  let counter = 1;
  let testAdjustment;
  let testAdjustmentLaba;
  let timesPerDayRange = false;
  if ( clonedMedication.name === 'asmanex' || clonedMedication.name === 'alvesco' ) {
    timesPerDayRange = true;
    Object.assign( clonedMedication, { timesPerDay: 1 } );
  }

  if ( level === 'exactlyFifty' ) {
    while ( exactlyFifty === false && counter <= max ) {
      if ( max === counter && clonedMedication.timesPerDay === 1 && timesPerDayRange === true ) {
        counter = 1;
        Object.assign( clonedMedication, { timesPerDay: 2 } );
      }
      testAdjustment = _.toInteger( clonedMedication.doseICS ) *
        _.toInteger( clonedMedication.timesPerDay ) *
        counter;
      testAdjustmentLaba = _.toInteger( clonedMedication.doseLABA ) *
        _.toInteger( clonedMedication.timesPerDay ) *
        counter;
      if ( testAdjustment === calculate.patientICSDose( patientMedication ) / 2  &&
        testAdjustment <= _.toInteger( clonedMedication.maxGreenICS ) &&
        testAdjustmentLaba <= _.toInteger( clonedMedication.maxGreenLABA ) ) {
        exactlyFifty = true;

        return Object.assign( medication, { puffsPerTime: counter, timesPerDay: clonedMedication.timesPerDay } );
      }
      counter += 1;
    }

    return [];
  }
  else if ( level === 'betweenFiftyAndFullDose' ) {
    while ( betweenFiftyAndFullDose === false && counter <= max ) {
      if ( max === counter && clonedMedication.timesPerDay === 1 && timesPerDayRange === true ) {
        counter = 1;
        Object.assign( clonedMedication, { timesPerDay: 2 } );
      }
      testAdjustment = _.toInteger( clonedMedication.doseICS ) *
        _.toInteger( clonedMedication.timesPerDay ) *
        counter;
      testAdjustmentLaba = _.toInteger( clonedMedication.doseLABA ) *
        _.toInteger( clonedMedication.timesPerDay ) *
        counter;
     // console.log('testAdjustMent: ', testAdjustment,
      // calculate.patientICSDose( patientMedication ), counter, medication, patientMedication)
      if ( testAdjustment >= calculate.patientICSDose( patientMedication ) / 2 &&
          testAdjustment < calculate.patientICSDose( patientMedication ) &&
          testAdjustment <= _.toInteger( clonedMedication.maxGreenICS ) &&
        testAdjustmentLaba <= _.toInteger( clonedMedication.maxGreenLABA ) ) {
        betweenFiftyAndFullDose = true;
        // console.log('medication adjust: ',  clonedMedication, Object.assign( clonedMedication, { puffsPerTime: counter } ) );

        return Object.assign( medication, { puffsPerTime: counter, timesPerDay: clonedMedication.timesPerDay } );
      }
      counter += 1;
    }

    return [];
  }
  else if ( level === 'betweenOneAndFifty' ) {
    while ( betweenFiftyAndFullDose === false && counter <= max ) {
      if ( max === counter && clonedMedication.timesPerDay === 1 && timesPerDayRange === true ) {
        counter = 1;
        Object.assign( clonedMedication, { timesPerDay: 2 } );
      }
      testAdjustment = _.toInteger( clonedMedication.doseICS ) *
        _.toInteger( clonedMedication.timesPerDay ) *
        counter;
      testAdjustmentLaba = _.toInteger( clonedMedication.doseLABA ) *
        _.toInteger( clonedMedication.timesPerDay ) *
        counter;
      if ( testAdjustment >= 1 &&
        testAdjustment < calculate.patientICSDose( patientMedication ) &&
        testAdjustment <= _.toInteger( clonedMedication.maxGreenICS ) &&
        testAdjustmentLaba <= _.toInteger( clonedMedication.maxGreenLABA ) ) {
        betweenFiftyAndFullDose = true;
        // console.log('medication adjust: ',  Object.assign( medication, { maxPuffPerTime: counter } ));

        return Object.assign( medication, { puffsPerTime: counter, timesPerDay: clonedMedication.timesPerDay } );
      }
      counter += 1;
    }

    return [];
  }

  return [];
};

export const ICSDoseToOriginalMedication = ( medication, patientMedication ) => {
  const max = _.toInteger( medication.maxPuffPerTime );
  let equal = false;
  let counter = 1;
  let testAdjustment;
  let timesPerDayRange = false;
  if ( medication.timesPerDay === '1 OR 2' ) {
    // console.log('1or2');
    timesPerDayRange = true;
    Object.assign( medication, { timesPerDay: 1 } );
  }
  while ( equal === false && ( counter <= max ) ) {
    if ( max === counter && medication.timesPerDay === 1 && timesPerDayRange === true ) {
      counter = 1;
      Object.assign( medication, { timesPerDay: 2 } );
    }
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    if ( testAdjustment === calculate.patientICSDose( patientMedication ) ) {
      // console.log("adjust equal: ", medication);
      equal = true;

      return Object.assign( medication, { puffsPerTime: counter } );
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
  let timesPerDayRange = false;
  if ( medication.timesPerDay === '1 OR 2' ) {
    // console.log('1or2');
    timesPerDayRange = true;
    Object.assign( medication, { timesPerDay: 1 } );
  }
  while ( equal === false && ( counter <= max ) ) {
    if ( max === counter && medication.timesPerDay === 1 && timesPerDayRange === true ) {
      counter = 1;
      Object.assign( medication, { timesPerDay: 2 } );
    }
    // console.log('timesPErDay: ',  medication, medication.timesPerDay, timesPerDayRange);
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    if ( testAdjustment === dose ) {
      equal = true;
      // console.log('equal: ', medication, testAdjustment, dose, counter);

      return medication;
    }
    counter += 1;
  }

  return [];
};

export const ICSHigherNext = ( medication, patientMedication ) => {
  // console.log(medication);
  const max = _.toInteger( medication.maxPuffPerTime );
  let higherNext = false;
  let counter = 1;
  let testAdjustment;
  let testAdjustmentLaba;
  let timesPerDayRange = false;
  if ( medication.timesPerDay === '1 OR 2' ) {
    // console.log('1or2');
    timesPerDayRange = true;
    Object.assign( medication, { timesPerDay: 1 } );
  }
  while ( higherNext === false && ( counter <= max ) ) {
    if ( max === counter && medication.timesPerDay === 1 && timesPerDayRange === true ) {
      counter = 1;
      Object.assign( medication, { timesPerDay: 2 } );
    }
    testAdjustment = _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay ) * counter;
    testAdjustmentLaba = _.toInteger( medication.doseLABA ) * _.toInteger( medication.timesPerDay ) * counter;
    // console.log(testAdjustment , calculate.patientICSDose( patientMedication ));
    if ( testAdjustment > calculate.patientICSDose( patientMedication ) &&
         testAdjustment <= _.toInteger( medication.maxGreenICS ) &&
      testAdjustmentLaba <= _.toInteger( medication.maxGreenLABA ) ) {
      higherNext = true;

      return Object.assign( medication, { puffsPerTime: counter } );
    }
    counter += 1;
  }

  return [];
};
