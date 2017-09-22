import _ from 'lodash';
import * as calculate from './calculateICSDose';

export const patientICSDose = ( medication ) => {
  let doseLevel = '';
  if ( calculate.patientICSDose( medication ) >= _.toInteger( medication.highFloorICS ) ) {
    doseLevel = 'high';
  }
  else if ( calculate.patientICSDose( medication ) <= _.toInteger( medication.lowCeilICS ) ) {
    doseLevel = 'low';
  }
  else if ( ( calculate.patientICSDose( medication ) > _.toInteger( medication.lowCeilICS ) ) &&
    ( calculate.patientICSDose( medication ) < _.toInteger( medication.highFloorICS ) ) ) {
    doseLevel = 'medium';
  }
  else if ( calculate.patientICSDose( medication ) > _.toInteger( medication.maxGreenICS ) ) {
    doseLevel = 'excessive';
  }

  return doseLevel;
};

export const ICSDose = ( medication ) => {
  let doseLevel = '';
  if ( calculate.ICSDose( medication ) >= _.toInteger( medication.highFloorICS ) ) {
    doseLevel = 'high';
  }
  else if ( calculate.ICSDose( medication ) <= _.toInteger( medication.lowCeilICS ) ) {
    doseLevel = 'low';
  }
  else if ( ( calculate.ICSDose( medication ) > _.toInteger( medication.lowCeilICS ) ) &&
    ( calculate.ICSDose( medication ) < _.toInteger( medication.highFloorICS ) ) ) {
    doseLevel = 'medium';
  }
  else if ( calculate.ICSDose( medication ) > _.toInteger( medication.maxGreenICS ) ) {
    doseLevel = 'excessive';
  }

  return doseLevel;
};
