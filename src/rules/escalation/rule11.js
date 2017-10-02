import _ from 'lodash';

const getLabaICSAndICS = ( patientMedications ) => {
  return _.chain( patientMedications )
    .filter( pMed => pMed.chemicalType === 'ICS' || pMed.chemicalType === 'laba,ICS' )
    .flatten()
    .value();
};

const rule11 = ( patientMedications, _masterMedications ) => {
  let newMedication = [];
  let filteredPatientMedications = getLabaICSAndICS( patientMedications );

  if ( _.find( filteredPatientMedications, { chemicalType: 'ICS' } ) &&
    _.find( filteredPatientMedications, { chemicalType: 'laba,ICS' } ) &&
  !_.some( patientMedications, { chemicalType: 'laac' } ) &&
    !_.some( patientMedications, { chemicalType: 'ltra' } ) &&
      !_.some( patientMedications, { chemicalType: 'laba' } )
  ) {
    newMedication = _.filter( _masterMedications, { name: 'singulair' } );
  }
  else {
    filteredPatientMedications = [];
  }

  return _.concat( _.chain( newMedication )
      .map( _medication => Object.assign( _medication, { tag: 'e22' } ) )
    .value(),
    _.chain( filteredPatientMedications )
      .map( _medication => Object.assign( _medication, { tag: 'e22' } ) )
      .value() );
};

export default rule11;
