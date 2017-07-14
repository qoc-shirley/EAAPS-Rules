import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as actions from '../../../redux/App/actions';
import './styles.css';

const showRecommendations = ({
                               medication,
                               onClickClear,
                             }) => {

  const clearRecommendations = () => {
    onClickClear();
  };

  if (medication.isRuleSelectEmpty === false) {
    return (
      <div className="recommendations">
        <h4>Recommendation(s):</h4>
        {
          medication.recommendation.map(
            (recommendMedication, index) => {
              let noRecommendation = null;
              if (_.isEmpty(recommendMedication.medications)) {
                noRecommendation = <p>No recommendations</p>
              }
              return (
                <div key={index}>
                  <p><b>{recommendMedication.rule}</b></p>
                  {noRecommendation}
                  {
                    recommendMedication.medications.map(
                      (medicationElement, medicationIndex) => {
                        console.log("is it empty: ", _.isEmpty(medicationElement));
                        if (_.isArray(medicationElement) && _.size(medicationElement) > 29) {
                          return (
                            <div key={medicationIndex} className="recommendationArray">
                              <p><b>-</b></p>
                              <p className="data">ID: {medicationElement[0]}</p>
                              <p className="data">Device: {medicationElement[5]}</p>
                              <p className="data">Name: {medicationElement[7]}</p>
                              <p className="data">ChemicalLABA: {medicationElement[10]}</p>
                              <p className="data">ChemicalICS: {medicationElement[11]}</p>
                              <p className="data">Dose ICS: {medicationElement[14]}</p>
                              <p className="data">Times Per Day: {medicationElement[22]}</p>
                              <p className="data">Max Puff Per Time: {medicationElement[23]}</p>
                            </div>
                          );
                        }
                        else if (_.isArray(medicationElement) && _.size(medicationElement) < 29) {
                          return (
                            <div key={medicationIndex} className="recommendationArray">
                              <p><b>-</b></p>
                              {
                                medicationElement.medications.map(
                                  (medication, index) => {
                                    return (
                                      <p key={index}
                                         className="data"
                                      >
                                        {medication}
                                      </p>
                                    );
                                  }
                                )
                              }
                            </div>
                          );
                        }
                        else if (!_.isArray(medicationElement) && _.size(medicationElement) < 29) {
                          return (
                            <div key={medicationIndex} className="recommendationArray">
                              <p><b>-</b></p>
                              {
                                recommendMedication.medications.map(
                                  (medication, index) => {
                                    return (
                                      <p key={index}
                                         className="data"
                                      >
                                        {medication}
                                      </p>
                                    );
                                  }
                                )
                              }
                            </div>
                          );
                        }
                        else if (!_.isArray(medicationElement) && _.size(medicationElement) > 29) {
                          return (
                            <div key={medicationIndex} className="recommendationObject">
                              <p><b>-</b></p>
                              <p className="data">ID: {medicationElement.id}</p>
                              <p className="data">Device: {medicationElement.device}</p>
                              <p className="data">Name: {medicationElement.name}</p>
                              <p className="data">ChemicalLABA: {medicationElement.chemicalLABA}</p>
                              <p className="data">ChemicalICS: {medicationElement.chemicalICS}</p>
                              <p className="data">Dose ICS: {medicationElement.doseICS}</p>
                              <p className="data">Times Per Day: {medicationElement.timesPerDay}</p>
                              <p className="data">Max Puff Per
                                Time: {medicationElement.maxPuffPerTime}</p>
                            </div>
                          );
                        }
                        return (
                          <p>no Recommendations</p>
                        );
                      }
                    )
                  }
                </div>
              )
            }
          )
        }
        < input
          className="clear"
          type="submit"
          value="Clear"
          onClick={clearRecommendations}
        />
      </div>
    );
  }
  else if (medication.isRuleSelectEmpty === true) {
    return null;
  }
};

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  onClickClear: () => dispatch( actions.onClickClear() ),
} );

export default connect(mapStateToProps, mapDispatchToProps)(showRecommendations);
