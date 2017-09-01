import _ from 'lodash';

const ruleMinus1 = patientMedications => _.chain( patientMedications )
  .filter( patientMedication => patientMedication.chemicalType === 'laac' )
  .thru( _medication => Object.assign( _medication, { tag: 'd0' } ) )
  .value();

export default ruleMinus1;
