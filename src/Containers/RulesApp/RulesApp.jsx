import { connect } from 'react-redux';
import App from '../../Components/App/App.jsx';
import * as actions from '../../redux/App/actions';

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  appendMedicationList: (medicationRow) => dispatch( actions.appendMedicationList(medicationRow) ),
  onChangePuffValue: (index, value) => dispatch( actions.onChangePuffValue(index,value) ),
  onChangeTimesPerDayValue: (index, value) => dispatch( actions.onChangeTimesPerDayValue(index, value) ),
  onChangeDoseICS: (index, value) => dispatch( actions.onChangeDoseICS(index, value) ),
  onChangeMedication: (index, value) => dispatch( actions.onChangeMedication(index, value) ),
  onDeleteRow: (index) => dispatch( actions.onDeleteRow(index) ),
  displayResult: (event) => dispatch( actions.displayResult(event) ),
  getPatientMedications: (medications) => dispatch( actions.getPatientMedications(medications) ),
} );

const RulesApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default RulesApp;
