import React from 'react';
import connect from 'react-redux';
import App from '../../Components/App/App';
import * as actions from '../../redux/App/actions';

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  getPuffValue: () => dispatch( actions.getPuffValue() ),
  getTimesPerDayValue: () => dispatch( actions.getTimesPerDayValue() ),
  getDoseICSValue: () => dispatch( actions.getDoseICSValue() ),
} );

const RulesApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default RulesApp;
