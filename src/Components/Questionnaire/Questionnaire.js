import React from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
// import PropTypes from 'prop-types';
import * as actions from '../../redux/App/actions';
import './styles.css';

const Questionnaire = ( ) => {
/*

              checked={this.state.selectedOption === 'option2'}
              onChange={this.handleOptionChange}/>
 */
  const options = ( question ) => {
    return (
      <div className="options">
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
  const yesNo = ( question ) => {
    return (
      <div className="options">
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
    <div className="questionnaire">
      <form className= "questions" onSubmit=''>
        <h3>Asthma Control Questionnaire</h3>
        <div className="wakeUp">
          <p>On average, how many times each week have you been woken up?</p>
          <div className="selectOption">
            {options('wakeUp')}
          </div>
        </div>
        <div className="asthmaSymptoms">
          <p>On average, how many times each week have you had asthma symptoms?</p>
          <div className='selectOption'>
            {options('asthmaSymptoms')}
          </div>
        </div>
        <div className="rescuePuffer">
          <p>On average, how many times each week do you need to use a rescue puffer?</p>
          <div className="selectOption">
            {options('rescuePuffer')}
          </div>
        </div>
        <div className="missedEvent">
          <p>Have you missed, work, school, and/or other activites because of asthma (in the past 3 months)?</p>
          <div className="selectOption">
            {yesNo('missedEvent')}
          </div>
        </div>
        <div className="stoppedExercising">
          <p>Has there been a time when you were exercising and had to stop because of asthma symptoms (in the last 3 months)?</p>
          <div className="selectOption">
            {yesNo('stoppedExercising')}
          </div>
        </div>
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
};

const mapStateToProps = state => ( {
  medication: state.medication,
} );

const mapDispatchToProps = dispatch => ( {
  onChangeQuestionnaireSelect: ( question, option ) => dispatch( actions.onChangeQuestionnaireSelect( question, option ) ),

} );

export default connect( mapStateToProps, mapDispatchToProps )( Questionnaire );
