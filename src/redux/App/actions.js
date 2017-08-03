import {
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  ON_TIMES_CHANGE,
  ON_DOSEICS_CHANGE,
  DEVICE,
  MEDICATION_TO_STACK,
  FILTERED_MEDICATIONS,
  RECOMMENDATION,
  CLEAR,
  ON_CHEMICALLABA_SELECTION,
  ON_CHEMICALICS_SELECTION,
  MEDICATION_NAME,
  ON_QUESTIONNAIRE_OPTION,
} from './constants';

export const appendMedicationList = ( medicationRow ) => {
  return {
    type: MEDICATION_TO_STACK,
    data: medicationRow,
  };
};

// OnChange Functions
export const onChangeDeviceName = ( index, device ) => {
  return {
    type: DEVICE,
    data: {
      index,
      device,
    },
  };
};

export const onChangeMedicationName = ( index, medicationName ) => {
  return {
    type: MEDICATION_NAME,
    data: {
      index,
      medicationName,
    },
  };
};

export const onChangePuffValue = ( index, puffValueChange ) => {
  return {
    type: ON_PUFF_CHANGE,
    data: {
      index,
      puffValueChange,
    },
  };
};

export const onChangeTimesPerDayValue = ( index, timesValueChange ) => {
  return {
    type: ON_TIMES_CHANGE,
    data: {
      index,
      timesValueChange,
    },
  };
};

export const onChangeDoseICS = ( index, doseICSValueChange ) => {
  return {
    type: ON_DOSEICS_CHANGE,
    data: {
      index,
      doseICSValueChange,
    },
  };
};

export const onChangeChemicalICS = ( index, chemicalICS ) => {
  return {
    type: ON_CHEMICALICS_SELECTION,
    data: {
      index,
      chemicalICS,
    },
  };
};

export const onChangeChemicalLABA = ( index, chemicalLABA ) => {
  return {
    type: ON_CHEMICALLABA_SELECTION,
    data: {
      index,
      chemicalLABA,
    },
  };
};

export const onDeleteRow = ( deleteRowIndex ) => {
  return {
    type: ON_DELETE_ROW,
    data: deleteRowIndex,
  };
};

export const displayResult = ( medication ) => {
  return {
    type: ON_SUBMIT,
    data: medication,
  };
};

export const getPatientMedications = ( medications ) => {
  return {
    type: FILTERED_MEDICATIONS,
    data: medications,
  };
};

export const saveRecommendation = ( rule, medications ) => {
  return {
    type: RECOMMENDATION,
    data: {
      rule,
      medications,
    },
  };
};

export const onClickClear = () => {
  return {
    type: CLEAR,
  };
};

export const onChangeQuestionnaireSelect = ( question, option ) => {
  return {
    type: ON_QUESTIONNAIRE_OPTION,
    data: {
      question,
      option,
    },
  };
};