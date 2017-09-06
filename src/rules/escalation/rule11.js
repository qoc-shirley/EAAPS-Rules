import _ from 'lodash';
import masterMedications from '../../medicationData/medicationData';

const getLabaICSAndICS = ( patientMedications ) => {
  const result = [];

  return _.chain( patientMedications )
    .filter(
      _.partial( ( medicationElements, patientMedication ) => {
        if ( patientMedication.chemicalType === 'ICS' ) {
          result.push( patientMedication );
        }
        else if ( patientMedication.chemicalType === 'laba,ICS' ) {
          result.push( patientMedication );
        }
      }, masterMedications ) )
    .concat( result )
    .flatten()
    .value();
};

const rule11 = ( patientMedications, _masterMedications ) => {
  let newMedication = [];
  let filteredPatientMedications = getLabaICSAndICS( patientMedications );

  if ( _.find( filteredPatientMedications, { chemicalType: 'ICS' } ) &&
    _.find( filteredPatientMedications, { chemicalType: 'laba,ICS' } ) ) {
    newMedication = _.filter( _masterMedications, { name: 'singulair' } );
  }
  else {
    filteredPatientMedications = [];
  }

  return _.concat( Object.assign( newMedication[0], { tag: 'e22' } ),
    _.chain( filteredPatientMedications )
      .map( _medication => Object.assign( _medication, { tag: 'e22' } ) )
      .value());
};

export default rule11;
