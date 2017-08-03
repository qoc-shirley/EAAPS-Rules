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
                value="0"
                checked={medication.wakeUp === "0"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', '0' )}
              />
              0
            </label>
            <label>
              <input
                type="radio"
                value="1"
                checked={medication.wakeUp === "1"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', '1' )}
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="2"
                checked={medication.wakeUp === "2"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', '2' )}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="3"
                checked={medication.wakeUp === "3"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', '3' )}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="4"
                checked={medication.wakeUp === "4"}
                onChange={() => onChangeQuestionnaireSelect( 'wakeUp', '4' )}
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
                value="0"
                checked={medication.asthmaSymptoms === "0"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', '0' )}
              />
              0
            </label>
            <label>
              <input
                type="radio"
                value="1"
                checked={medication.asthmaSymptoms === "1"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', '1' )}
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="2"
                checked={medication.asthmaSymptoms === "2"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', '2' )}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="3"
                checked={medication.asthmaSymptoms === "3"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', '3' )}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="4"
                checked={medication.asthmaSymptoms === "4"}
                onChange={() => onChangeQuestionnaireSelect( 'asthmaSymptoms', '4' )}
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
                value="0"
                checked={medication.rescuePuffer === "0"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', '0' )}
              />
              0
            </label>
            <label>
              <input
                type="radio"
                value="1"
                checked={medication.rescuePuffer === "1"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', '1' )}
              />
              1
            </label>
            <label>
              <input
                type="radio"
                value="2"
                checked={medication.rescuePuffer === "2"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', '2' )}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                value="3"
                checked={medication.rescuePuffer === "3"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', '3' )}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                value="4"
                checked={medication.rescuePuffer === "4"}
                onChange={() => onChangeQuestionnaireSelect( 'rescuePuffer', '4' )}
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
