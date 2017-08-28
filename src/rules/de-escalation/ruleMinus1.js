import _ from 'lodash';

const ruleMinus1 = patientMedications => _.chain( patientMedications )
    .filter( patientMedication => patientMedication.chemicalType === 'laac' )
    .value();

export default ruleMinus1;
