import { connect } from 'react-redux';
import App from '../../Components/App/App';
// import InputField from '../../Components/InputField/InputField';

import * as actions from '../../redux/App/actions';

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  getPuffValue: (value) => dispatch( actions.getPuffValue(value) ),
  getTimesPerDayValue: (value) => dispatch( actions.getTimesPerDayValue(value) ),
  getDoseICSValue: (value) => dispatch( actions.getDoseICSValue(value) ),
  getMedicationSelection: (value) => dispatch( actions.getMedicationSelection(value) ),
  appendMedicationToStack: (medicationRow) => dispatch( actions.appendMedicationToStack(medicationRow) ),
  onPuffChange: (value) => dispatch( actions.onPuffChange(value) ),
  onTimesChange: (value) => dispatch( actions.onTimesChange(value) ),
  onDoseICSChange: (value) => dispatch( actions.onDoseICSChange(value) ),

  onSubmit: (e) => dispatch( actions.onSubmit(e.target.value) ),
  onDeleteRow: (e) => dispatch( actions.onDeleteRow(e.target.value) ),
} );

const RulesApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default RulesApp;
