import _ from 'lodash';

const control = data => _.chain( data )
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
    .thru( patientControl => patientControl )
    .value();

export default control;
