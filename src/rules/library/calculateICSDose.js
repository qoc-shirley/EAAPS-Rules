import _ from 'lodash';

export const patientICSDose = ( medication ) => {
  if ( medication.doseICS === '.' ) {
    return _.toInteger( medication.timesPerDayValue ) * _.toInteger( medication.puffPerTime );
  }
  else if ( medication.timesPerDay === '.' ) {
    return _.toInteger( medication.doseICS ) * _.toInteger( medication.puffPerTime );
  }
  else if ( medication.puffPerTime === '' ) {
    return _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay );
  }

  return _.toInteger( medication.doseICS ) *
    _.toInteger( medication.timesPerDay ) *
    _.toInteger( medication.puffPerTime );
};

export const ICSDose = ( medication ) => {
  if ( medication.puffPerTime ) {
    patientICSDose( medication );
  }
  if ( medication.timesPerDay === '1 OR 2' ) {
    return _.toInteger( medication.doseICS ) * 1;
  }

  return _.toInteger( medication.doseICS ) * _.toInteger( medication.timesPerDay );
};
