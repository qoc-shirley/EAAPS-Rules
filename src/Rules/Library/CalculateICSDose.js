export const ICSDose = (medication) => {
  return medication.doseICS * medication.timesPerDay;
};

export const patientICSDose = (medication) => {
  return medication.doseICS * medication.timesPerDay * medication.puffPerTime;
};