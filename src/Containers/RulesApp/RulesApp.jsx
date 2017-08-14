import { connect } from 'react-redux';
import App from '../../Components/App/App';
import * as actions from '../../redux/App/actions';

const mapStateToProps = state => ( {
  medication: state.medication,
} );

const mapDispatchToProps = dispatch => ( {
  appendMedicationList: medicationRow => dispatch( actions.appendMedicationList( medicationRow ) ),
  onChangePuffValue: ( index, value ) => dispatch( actions.onChangePuffValue( index, value ) ),
  onChangeTimesPerDayValue: ( index, value ) => dispatch( actions.onChangeTimesPerDayValue( index, value ) ),
  onChangeDoseICS: ( index, value ) => dispatch( actions.onChangeDoseICS( index, value ) ),
  onChangeChemicalICS: ( index, value ) => dispatch( actions.onChangeChemicalICS( index, value ) ),
  onChangeChemical: ( index, value ) => dispatch( actions.onChangeChemical( index, value ) ),
  onChangeDeviceName: ( index, value ) => dispatch( actions.onChangeDeviceName( index, value ) ),
  onChangeMedicationName: ( index, value ) => dispatch( actions.onChangeMedicationName( index, value ) ),
  onDeleteRow: index => dispatch( actions.onDeleteRow( index ) ),
  displayResult: event => dispatch( actions.displayResult( event ) ),
  getPatientMedications: medications => dispatch( actions.getPatientMedications( medications ) ),
  saveRecommendation: ( rule, medications ) => dispatch( actions.saveRecommendation( rule, medications ) ),
  onClickClear: () => dispatch( actions.onClickClear() ),
  onChangeQuestionnaireSelect: ( question, option ) => dispatch( actions.onChangeQuestionnaireSelect( question, option ) ),
} );

const RulesApp = connect( mapStateToProps, mapDispatchToProps )( App );

export default RulesApp;

