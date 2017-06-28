import {
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  ON_TIMES_CHANGE,
  ON_DOSEICS_CHANGE,
  ON_MEDICATION_SELECTION,
  MEDICATION_TO_STACK,
  FILTERED_MEDICATIONS,
} from './constants';

export const appendMedicationList = ( medicationRow ) => {
  return {
    type: MEDICATION_TO_STACK,
    data: medicationRow,
  }
};

//OnChange Functions
export const onChangePuffValue = ( index, puffValueChange ) => {
  return {
    type: ON_PUFF_CHANGE,
    data: {
      index,
      puffValueChange,
    },
  }
};

export const onChangeTimesPerDayValue = ( index, timesValueChange ) => {
  return {
    type: ON_TIMES_CHANGE,
    data: {
      index,
      timesValueChange,
    },
  }
};

export const onChangeDoseICS = ( index, doseICSValueChange ) => {
  return {
    type: ON_DOSEICS_CHANGE,
    data: {
      index,
      doseICSValueChange,
    },
  }
};

export const onChangeMedication = ( index, selectionChange ) => {
  return {
    type: ON_MEDICATION_SELECTION,
    data: {
      index,
      selectionChange,
    },
  }
};

export const onDeleteRow = ( deleteRowIndex ) => {
  return {
    type: ON_DELETE_ROW,
    data: deleteRowIndex,
  }
};

export const displayResult = ( medication ) => {
  return {
    type: ON_SUBMIT,
    data: medication,
  }
};

export const getPatientMedications = ( medications ) => {
  return {
    type: FILTERED_MEDICATIONS,
    data: medications,
  }
};