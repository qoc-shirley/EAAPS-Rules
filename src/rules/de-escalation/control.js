import _ from 'lodash';

const control = ( data ) => {
  const isGood = _.chain( data )
    .thru( ( questionData ) => {
      if ( questionData[0].wakeUp !== '0' &&
        questionData[0].asthmaSymptoms !== '0' &&
        questionData[0].rescuePuffer !== '0' &&
        questionData[0].missedEvent !== 'no' &&
        questionData[0].stoppedExercising !== 'no' ) {
        return 'good control';
      }
      return 'not good control';
    } )
    .thru( control => control )
    .value();
  console.log("control: ", isGood);
  return isGood;
};

export default control;
