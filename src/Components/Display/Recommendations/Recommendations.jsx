import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../../redux/App/actions';
import './styles.css';

const showRecommendations = ( {
                               medication, onClickClear,
                              } ) => {

  const clearRecommendations = () => {
    onClickClear();
  };

  if ( medication.isRuleSelectEmpty === false ) {
    return (
      <div className="recommendations">
        <h3>Recommendation(s)</h3>
        <div className="header">
          <p className="title" />
          <p className="title">Id</p>
          <p className="title">Device</p>
          <p className="title">Name</p>
          <p className="title">ChemicalLABA</p>
          <p className="title">ChemicalICS</p>
          <p className="title">Dose ICS</p>
          <p className="title">Max Puff Per Time</p>
          <p className="title">Times Per Day</p>
        </div>
        {
          medication.recommendation.map(
            ( recommendMedication, index ) => {
              let noRecommendation = null;
              if ( _.isEmpty( recommendMedication.medications ) ) {
                noRecommendation = <p>No recommendations</p>;
              }

              return (
                <div key={index} className="contents">
                  <p id="rule">{recommendMedication.rule}</p>
                  {noRecommendation}
                  {
                    recommendMedication.medications.map(
                      ( medicationElement, medicationIndex ) => {
                        if ( _.isString( medicationElement ) ) {
                          return ( <p key={medicationIndex}>{medicationElement}</p> );
                        }
                        else if ( _.isArray( medicationElement ) && _.size( medicationElement ) > 29 ) {
                          return (
                            <div key={medicationIndex} className="recommendationArray">
                              <p className="data" />
                              <p className="data">{medicationElement[0]}</p>
                              <p className="data">{medicationElement[5]}</p>
                              <p className="data">{medicationElement[7]}</p>
                              <p className="data">{medicationElement[10]}</p>
                              <p className="data">{medicationElement[11]}</p>
                              <p className="data">{medicationElement[14]}</p>
                              <p className="data">{medicationElement[22]}</p>
                              <p className="data">{medicationElement[23]}</p>
                            </div>
                          );
                        }
                        else if ( _.isArray( medicationElement ) && _.size( medicationElement ) < 5 ) {
                          return (
                            <div key={medicationIndex} className="recommendationArray">
                              <p> </p>
                              {
                                medicationElement.map( ( recommend, rIndex)  => {
                                  return <p key={rIndex} className="data">{recommend}</p>;
                                } )
                              }
                            </div>
                          );
                        }
                        else if ( !_.isArray( medicationElement ) && _.size( medicationElement ) < 29 ) {
                          return (
                            <div key={medicationIndex} className="recommendationObject">
                              <p className="data" />
                              <p className="data">{medicationElement.id}</p>
                              <p className="data">{medicationElement.device}</p>
                              <p className="data">{medicationElement.name}</p>
                              <p className="data">{medicationElement.chemicalLABA}</p>
                              <p className="data">{medicationElement.chemicalICS}</p>
                              <p className="data">{medicationElement.doseICS}</p>
                              <p className="data">{medicationElement.maxPuffPerTime}</p>
                              <p className="data">{medicationElement.timesPerDay}</p>
                            </div>
                          );
                        }
                        else if ( !_.isArray( medicationElement ) && _.size( medicationElement ) > 29 ) {
                          return (
                            <div key={medicationIndex} className="recommendationObject">
                              <p className="data" />
                              <p className="data">{medicationElement.id}</p>
                              <p className="data">{medicationElement.device}</p>
                              <p className="data">{medicationElement.name}</p>
                              <p className="data">{medicationElement.chemicalLABA}</p>
                              <p className="data">{medicationElement.chemicalICS}</p>
                              <p className="data">{medicationElement.doseICS}</p>
                              <p className="data">{medicationElement.maxPuffPerTime}</p>
                              <p className="data">{medicationElement.timesPerDay}</p>
                            </div>
                          );
                        }

                        return (
                          <p key={medicationIndex}>no Recommendations</p>
                        );
                      },
                    )
                  }
                </div>
              );
            },
          )
        }
        <input
          className="clear"
          type="submit"
          value="Clear"
          onClick={clearRecommendations}
        />
      </div>
    );
  }
  else if ( medication.isRuleSelectEmpty === true ) {
    return null;
  }
};

const mapStateToProps = state => ( {
  medication: state.medication,
} );

const mapDispatchToProps = dispatch => ( {
  onClickClear: () => dispatch( actions.onClickClear() ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( showRecommendations );
