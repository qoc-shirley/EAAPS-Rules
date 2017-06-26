import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE,
  MEDICATION_SELECTION,
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  ON_TIMES_CHANGE,
  ON_DOSEICS_CHANGE,
  ON_MEDICATION_SELECTION,
  MEDICATION_TO_STACK,
} from './constants';

export const getPuffValue = ( puffValue ) => {
  // console.log("action PUFF_VALUE:", puffValue);
  return {
    type: PUFF_VALUE,
    data: puffValue,
  };
};

export const getTimesPerDayValue = ( timesPerDayValue ) => {
  // console.log("action TIMES_PER_DAY_VALUE: ",timesPerDayValue);
  return {
    type: TIMES_PER_DAY_VALUE,
    data: timesPerDayValue,
  };
};

export const getDoseICSValue = ( doseICSValue ) => {
  // console.log("action DOSE_ICS_VALUE: ", doseICSValue);
  return {
    type: DOSE_ICS_VALUE,
    data: doseICSValue,
  };
};

export const getMedicationSelection = ( medicationSelection ) => {
  return {
    type: MEDICATION_SELECTION,
    data: medicationSelection,
  }
};

export const appendMedicationToStack = ( medicationRow ) => {
  return {
    type: MEDICATION_TO_STACK,
    data: medicationRow,
  }
};

//OnChange Functions
export const onPuffChange = ( index, puffValueChange ) => {
  return {
    type: ON_PUFF_CHANGE,
    data: {
      index,
      puffValueChange,
    },
  }
};

export const onTimesChange = ( index, timesValueChange ) => {
  return {
    type: ON_TIMES_CHANGE,
    data: {
      index,
      timesValueChange,
    },
  }
};

export const onDoseICSChange = ( index, doseICSValueChange ) => {
  return {
    type: ON_DOSEICS_CHANGE,
    data: {
      index,
      doseICSValueChange,
    },
  }
};

export const onMedicationSelection = ( index, selectionChange ) => {
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

export const onSubmit = ( submit ) => {
  return {
    type: ON_SUBMIT,
    data: submit,
  }
};