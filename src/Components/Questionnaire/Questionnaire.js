import React from 'react';
// import _ from 'lodash';
// import PropTypes from 'prop-types';
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

              checked={this.state.selectedOption === 'option2'}
              onChange={this.handleOptionChange}/>
 */
  const options = () => {
    return (
      <div>
        <label>
          <input
            type="radio"
            value="one"
          />
          None
        </label>
        <label>
          <input
            type="radio"
            value="one"
          />
          1
        </label>
        <label>
          <input
            type="radio"
            value="two"
          />
          2
        </label>
        <label>
          <input
            type="radio"
            value="three"
          />
          3
        </label>
        <label>
          <input
            type="radio"
            value="four"
          />
          4
        </label>
        <label>
          <input
            type="radio"
            value="more"
          />
          4+
        </label>
      </div>
    );
  }
  const yesNo = () => {
    return (
      <div>
        <label>
          <input
            type="radio"
            value="no"
          />
          No
        </label>
        <label>
          <input
            type="radio"
            value="yes"
          />
          Yes
        </label>
      </div>
    );
  }

  return (
    <div>
      <h3>Asthma Control Questionnaire</h3>
      <form onSubmit=''>
        <div className='wakeUp'>
          <p>On average, how many times each week have you been woken up?</p>
          <div className='options'>
            {options()}
          </div>
        </div>
        <div className='asthmaSymptoms'>
          <p>On average, how many times each week have you had asthma symptoms?</p>
          <div className='options'>
            {options()}
          </div>
        </div>
        <div className='rescuePuffer'>
          <p>On average, how many times each week do you need to use a rescue puffer?</p>
          {options()}
        </div>
        <div className='missedEvent'>
          <p>Have you missed, work, school, and/or other activites because of asthma (in the past 3 months)?</p>
          {yesNo()}
        </div>
        <div className='wakeUp'>
          <p>Has there been a time when you were exercising and had to stop because of asthma symptoms (in the last 3 months)?</p>
          {yesNo()}
        </div>
        <button className='buttom' type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Questionnaire;
