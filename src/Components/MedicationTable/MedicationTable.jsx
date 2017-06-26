import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
import * as actions from '../../redux/App/actions';
import './styles.css';

const MedicationTable = (
  {
    appendMedicationList,
    availableMedications,
    doseICSValue,
    medicationList,
    onChangeDoseICS,
    onChangeMedication,
    onChangePuffValue,
    onChangeTimesPerDayValue,
    onClickDeleteMedication,
    onSubmitMedications,
    puffValue,
    timesPerDayValue,
  } ) => {

  const headerElements = ["Puff/Time", "Times/Day", "DoseICS", "Select Medication", ""];

  const renderAddRow = () => {
    const initalInputValues =
      {
        doseICSValue: '',
        availableMedications: '',
        puffValue: '',
        timesPerDayValue: '',
      };
    appendMedicationList(initalInputValues);
  };

  const deleteRow = (index) => {
    onClickDeleteMedication(index);
  };

  const displayRowContents = () => {
    return(
      medicationList.map( (rowFields, index) => (
        <div key={index} className="row">
          <InputField
            fieldName="puff"
            value={puffValue}
            onChangeInputField={ (event) => onChangePuffValue(index, event.target.value) }
          />
          <InputField
            fieldName="times"
            value={timesPerDayValue}
            onChangeInputField={ (event) => onChangeTimesPerDayValue(index, event.target.value) }
          />
          <InputField
            fieldName="doseICS"
            value={doseICSValue}
            onChangeInputField={ (event) => onChangeDoseICS(index, event.target.value) }
          />
          <select
            className="row__select" onChange={ (event) => onChangeMedication(index, event.target.value) }
            defaultValue={availableMedications}
          >
            {/*get it from external list*/}
            <option>ChemicalLABA-ChemicalICS-ChemicalOther</option>
              <option>formoterol-.-. </option>
              <option>salmeterol-fluticasone-.</option>
              <option>.-fluticasone-.</option>
              <option>salmeterol-.-.</option>
              <option>.-.-salbutamol</option>
              <option>.-.-tiotropium</option>
              <option>.-ciclesonide-.</option>
              <option>.-beclomethasone-.</option>
              <option>.-.-ipratropium</option>
              <option>formoterol-mometasone-.</option>
              <option>.-.-zafirlukast</option>
              <option>.-.-montelukast</option>
              <option>.-.-terbutaline</option>
              <option>.-budesonide-.</option>
              <option>formoterol-budesonide-.</option>
              <option>.-mometasone-.</option>
        </select>
        <button
          className="button_deleteRow"
          onClick={ () => deleteRow(index) }
        >
          Delete Row
        </button>
      </div>
    )));
  };
 return (
   <div className="medication-table" onSubmit={onSubmitMedications}>
     <div className="header">
       <ul>
        <Row>
          {headerElements}
        </Row>
       </ul>
     </div>

     <div className="main">
        <ul>
          {displayRowContents()}
        </ul>
     </div>
     <button
       className="button__addRow"
       onClick={renderAddRow}
     >
       Add Row
     </button>
   </div>
 );
};

MedicationTable.propTypes = {
  puffValue: PropTypes.string,
  timesPerDayValue: PropTypes.string,
  doseICSValue: PropTypes.string,
  patientMedications: PropTypes.string,
  onDelEvent: PropTypes.func,
  onSelection: PropTypes.func,
  puffOnChange: PropTypes.func,
  timesOnChange: PropTypes.func,
  doseICSOnChange: PropTypes.func,
  onSubmit: PropTypes.func,
  appendMedicationList: PropTypes.func.isRequired,
};

MedicationTable.defaultProps = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
};

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  appendMedicationList: (medicationRow) => dispatch( actions.appendMedicationList(medicationRow) ),
  onChangePuffValue: (index, value) => dispatch( actions.onChangePuffValue(index, value) ),
  onChangeTimesPerDayValue: (index, value) => dispatch( actions.onChangeTimesPerDayValue(index, value) ),
  onChangeDoseICS: (index, value) => dispatch( actions.onChangeDoseICS(index, value) ),
  onChangeMedication: (index, value) => dispatch( actions.onChangeMedication(index, value) ),
  onDeleteRow: (index) => dispatch( actions.onDeleteRow(index) ),
} );

export default connect(mapStateToProps, mapDispatchToProps)(MedicationTable);