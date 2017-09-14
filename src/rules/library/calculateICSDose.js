import _ from 'lodash';

export const patientICSDose = ( medication ) => {
  if ( medication.doseICS === '.' ) {
    return _.toInteger( medication.timesPerDayValue ) * _.toInteger( medication.puffsPerTime );
  }
  else if ( medication.timesPerDay === '.' ) {
    return _.toInteger( medication.doseICS ) * _.toInteger( medication.puffsPerTime );
  }
  else if ( medication.puffsPerTime === '' ) {
    return _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay );
  }

  return _.toInteger( medication.doseICS ) *
    _.toInteger( medication.timesPerDay ) *
    _.toInteger( medication.puffsPerTime );
};

export const patientLabaDose = ( medication ) => {
  if ( medication.doseICS === '.' ) {
    return _.toInteger( medication.timesPerDayValue ) * _.toInteger( medication.puffsPerTime );
  }
  else if ( medication.timesPerDay === '.' ) {
    return _.toInteger( medication.doseICS ) * _.toInteger( medication.puffsPerTime );
  }
  else if ( medication.puffsPerTime === '' ) {
    return _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay );
  }

  return _.toInteger( medication.doseICS ) *
    _.toInteger( medication.timesPerDay ) *
    _.toInteger( medication.puffsPerTime );
};

export const ICSDose = ( medication ) => {
  if ( medication.puffsPerTime ) {
    patientICSDose( medication );
  }
  if ( medication.timesPerDay === '1 OR 2' ) {
    return _.toInteger( medication.doseICS ) * 1;
  }

  return _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay );
};

export const LabaDose = ( medication ) => {
  if ( medication.puffsPerTime ) {
    patientLabaDose( medication );
  }
  if ( medication.timesPerDay === '1 OR 2' ) {
    return _.toInteger( medication.doseICS ) * 1;
  }

  return _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay );
};
