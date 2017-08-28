import _ from 'lodash';

export const device = ( medications, matchMedication ) =>
  _.filter( medications, { device: matchMedication.device } );

export const timesPerDay = ( medications, matchMedication ) =>
  _.filter( medications,
      medication => medication.timesPerDay === matchMedication.timesPerDay || medication.timesPerDay === '1 OR 2' );

export const doseICS = ( medications, matchMedication ) =>
  _.filter( medications, { doseICS: matchMedication.doseICS } );

export const minimizePuffsPerTime = ( medications, minimizeMedicationsPuffs ) => {
  const minimize = _.filter( medications, medication => medication.doseICS < minimizeMedicationsPuffs.doseICS );
  if ( _.size( minimize ) > 1 ) {
    return _.maxBy( minimize, 'doseICS' );
  }

  return minimize;
};
