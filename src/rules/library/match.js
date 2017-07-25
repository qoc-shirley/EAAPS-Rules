import _ from 'lodash';

export const device = ( medications, matchMedication ) => {
  return _.filter( medications, { device: matchMedication.device } );
};

export const timesPerDay = ( medications, matchMedication ) => {
  return _.filter( medications, { timesPerDay: matchMedication.timesPerDay } );
};

export const doseICS = ( medications, matchMedication ) => {
  return _.filter( medications, { doseICS: matchMedication.doseICS } );
};

export const minimizePuffsPerTime = ( medications, minimizeMedicationsPuffs ) => {
  const minimize = _.filter( medications, ( medication ) => {
    return medication.doseICS > minimizeMedicationsPuffs.doseICS;
  } );
  if ( _.size( minimize ) > 1 ) {
    return _.maxBy( minimize, 'doseICS' );
  }

  return minimize;
};
