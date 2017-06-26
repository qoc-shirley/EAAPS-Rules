import { connect } from 'react-redux';
import App from '../../Components/App/App.jsx';
import * as actions from '../../redux/App/actions';

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  getPuffValue: (value) => dispatch( actions.getPuffValue(value) ),
  getTimesPerDayValue: (value) => dispatch( actions.getTimesPerDayValue(value) ),
  getDoseICSValue: (value) => dispatch( actions.getDoseICSValue(value) ),
  getMedicationSelection: (value) => dispatch( actions.getMedicationSelection(value) ),
  appendMedicationList: (medicationRow) => dispatch( actions.appendMedicationList(medicationRow) ),
  onPuffChange: (index, value) => dispatch( actions.onPuffChange(index,value) ),
  onTimesChange: (index, value) => dispatch( actions.onTimesChange(index, value) ),
  onDoseICSChange: (index, value) => dispatch( actions.onDoseICSChange(index, value) ),
  onMedicationSelection: (index, value) => dispatch( actions.onMedicationSelection(index, value) ),
  onDeleteRow: (index) => dispatch( actions.onDeleteRow(index) ),
  displayResult: (event) => dispatch( actions.displayResult(event) ),
} );

const RulesApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default RulesApp;
