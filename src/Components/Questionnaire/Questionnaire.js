import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './styles.css';

const Questionnaire = ( ) => {
/*
“On average, patient is woken up by asthma symptoms at night 1 or more nights
each week”
AND/OR
“On average, patient has asthma symptoms 1 or more days each week” OR
“On average, patient has asthma symptoms 4 or more days each week”
AND/OR
“On average, patient uses a rescue puffer 4 or more times each week”
AND/OR
“Patient has missed work, school, and/or other activities because of asthma (in the
past 3 months)”
AND/OR
“There has been a time when the patient was exercising and had to stop because of
asthma symptoms (in the past 3 months)”
 */

  return (
    <div>
      <div className='wakeUp'>
        <p>On average, how many times each week have you been woken up?</p>
      </div>
      <div className='asthmaSymptoms'>
        <p>On average, how many times each week have you had asthma symptoms?</p>
      </div>
      <div className='rescuePuffer'>
        <p>On average, how many times each week do you need to use a rescue puffer?</p>
      </div>
      <div className='missedEvent'>
        <p>Have you missed, work, school, and/or other activites because of asthma (in the past 3 months)?</p>
      </div>
      <div className='wakeUp'>
        <p>Has there been a time when you were exercising and had to stop because of asthma symptoms (in the last 3 months)?</p>
      </div>
    </div>
  );
};

export default Questionnaire;
