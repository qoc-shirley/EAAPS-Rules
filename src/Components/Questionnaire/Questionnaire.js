import React from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
// import PropTypes from 'prop-types';
import * as actions from '../../redux/App/actions';
import './styles.css';

const Questionnaire = ( { onChangeQuestionnaireSelect, medication }) => {

  return (
    <div className="questionnaire">
      <form className= "questions" onSubmit=''>
        <h3>Asthma Control Questionnaire</h3>
        <div className="wakeUp">
          <p>On average, how many times each week have you been woken up?</p>
          <div className="selectOption">
            <label>
              <input
                type="radio"
                value="zero"
                checked={medication.wakeUp === "zero"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', 'zero' )}
              />
              0
            </label>
            <label>
              <input
                type="radio"
                value="one"
                checked={medication.wakeUp === "one"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', 'one' )}
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="two"
                checked={medication.wakeUp === "two"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', 'two' )}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="three"
                checked={medication.wakeUp === "three"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', 'three' )}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="four"
                checked={medication.wakeUp === "four"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', 'four' )}
              />
              4
            </label>
            <label>
              <input
                type="radio"
                value="more"
                checked={medication.wakeUp === "more"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', 'more' )}
              />
              4+
            </label>
          </div>
        </div>
        <div className="asthmaSymptoms">
          <p>On average, how many times each week have you had asthma symptoms?</p>
          <div className='selectOption'>
            <label>
              <input
                type="radio"
                value="zero"
                checked={medication.asthmaSymptoms === "zero"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', 'zero' )}
              />
              0
            </label>
            <label>
              <input
                type="radio"
                value="one"
                checked={medication.asthmaSymptoms === "one"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', 'one' )}
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="two"
                checked={medication.asthmaSymptoms === "two"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', 'two' )}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="three"
                checked={medication.asthmaSymptoms === "three"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', 'three' )}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="four"
                checked={medication.asthmaSymptoms === "four"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', 'four' )}
              />
              4
            </label>
            <label>
              <input
                type="radio"
                value="more"
                checked={medication.asthmaSymptoms === "more"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', 'more' )}
              />
              4+
            </label>
          </div>
        </div>
        <div className="rescuePuffer">
          <p>On average, how many times each week do you need to use a rescue puffer?</p>
          <div className="selectOption">
            <label>
              <input
                type="radio"
                value="zero"
                checked={medication.rescuePuffer === "zero"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', 'zero' )}
              />
              0
            </label>
            <label>
              <input
                type="radio"
                value="one"
                checked={medication.rescuePuffer === "one"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', 'one' )}
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="two"
                checked={medication.rescuePuffer === "two"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', 'two' )}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="three"
                checked={medication.rescuePuffer === "three"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', 'three' )}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="four"
                checked={medication.rescuePuffer === "four"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', 'four' )}
              />
              4
            </label>
            <label>
              <input
                type="radio"
                value="more"
                checked={medication.rescuePuffer === "more"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', 'more' )}
              />
              4+
            </label>
          </div>
        </div>
        <div className="missedEvent">
          <p>Have you missed, work, school, and/or other activites because of asthma (in the past 3 months)?</p>
          <div className="selectOption">
            <label>
              <input
                type="radio"
                value="no"
                checked={medication.missedEvent === "no"}
                onChange={() => onChangeQuestionnaireSelect( 'missedEvent', 'no' )}
              />
              No
            </label>
            <label>
              <input
                type="radio"
                value="yes"
                checked={medication.missedEvent === "yes"}
                onChange={() => onChangeQuestionnaireSelect( 'missedEvent', 'yes' )}
              />
              Yes
            </label>
          </div>
        </div>
        <div className="stoppedExercising">
          <p>Has there been a time when you were exercising and had to stop because of asthma symptoms (in the last 3 months)?</p>
          <div className="selectOption">
            <label>
              <input
                type="radio"
                value="no"
                checked={medication.stoppedExercising === "no"}
                onChange={() => onChangeQuestionnaireSelect( 'stoppedExercising', 'no' )}
              />
              No
            </label>
            <label>
              <input
                type="radio"
                value="yes"
                checked={medication.stoppedExercising === "yes"}
                onChange={() => onChangeQuestionnaireSelect( 'stoppedExercising', 'yes' )}
              />
              Yes
            </label>
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
