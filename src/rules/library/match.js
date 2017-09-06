import _ from 'lodash';

export const device = ( medications, matchMedication ) =>
  _.filter( medications, { device: matchMedication.device } );

export const timesPerDay = ( medications, matchMedication ) =>
  _.filter( medications,
      medication => medication.timesPerDay === matchMedication.timesPerDay || medication.timesPerDay === '1 OR 2' );

export const doseICS = ( medications, matchMedication ) =>
  _.filter( medications, { doseICS: matchMedication.doseICS } );

export const minimizePuffsPerTime = ( medications ) => {
  console.log( 'minimizePuffsPerTime: ', medications);
  return _.chain( medications )
    .thru( convert => _.map( convert,
      convertEach => Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } ) ) )
    .maxBy( 'doseICS' )
    .value();
};
