import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE,
  MEDICATION_SELECTION,
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  MEDICATION_TO_STACK,
} from './constants';

let stackId = 0;

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

export const getMedicationToStack = ( medicationRow ) => {
  return {
    type: MEDICATION_TO_STACK,
    data: {
      id: stackId++,
      medicationRow
    },
  }
};

export const onPuffChange = ( valueChange ) => {
  return {
    type: ON_PUFF_CHANGE,
    data: valueChange,
  }
};

export const onSubmit = ( event ) => {
  return {
    type: ON_SUBMIT,
    data: event,
  }
};

export const onDeleteRow = ( event ) => {
  return {
    type: ON_DELETE_ROW,
    data: event,
  }
};

/*export const onAddRow = ( event ) => {
  return {
    type: ON_ADD_ROW,
    data: event,
  }
};

export const onPuffChange = ( event ) => {
  return {
    type: ON_PUFF_CHANGE,
    data: event,
  }
};

export const onTimesChange = ( event ) => {
  return {
    type: ON_TIMES_CHANGE,
    data: event,
  }
};

export const onDoseICSChange = ( event ) => {
  return {
    type: ON_DOSEICS_CHANGE,
    data: event,
  }
};

export const onMedicationSelection = ( event ) => {
  return {
    type: ON_MEDICATION_SELECTION,
    data: event,
  }
};*/