import _ from 'lodash';
import masterMedications from '../../medicationData/medicationData';

// const getLabaICSAndICS = ( patientMedications ) => {
//   const result = [];
//
//   return _.chain( patientMedications )
//     .filter(
//       _.partial( ( medicationElements, patientMedication ) => {
//         if ( patientMedication.chemicalType === 'ICS' ) {
//           result.push( patientMedication );
//         }
//         else if ( patientMedication.chemicalType === 'laba,ICS' ) {
//           result.push( patientMedication );
//         }
//       }, masterMedications ) )
//     .concat( result )
//     .flatten()
//     .value();
// };
const getLabaICSAndICS = ( patientMedications ) => {
  return _.chain( patientMedications )
    .filter(
      _.partial( ( medicationElements, patientMedication ) => {
        return patientMedication.chemicalType === 'ICS' ||
          patientMedication.chemicalType === 'laba,ICS';
      }, masterMedications ) )
    .value();
};

const rule11 = ( patientMedications, masterMedications ) => {
  let newMedication = [];
  let filteredPatientMedications = getLabaICSAndICS( patientMedications );

  if ( _.find( filteredPatientMedications, { chemicalType: 'ICS' } ) &&
    _.find( filteredPatientMedications, { chemicalType: 'laba,ICS' } ) ) {
    newMedication = _.filter( masterMedications, { name: 'singulair' } );
  }
  else {
    filteredPatientMedications = [];
  }

  return _.concat( newMedication, filteredPatientMedications );
};

//
// const rule11 = ( patientMedications, masterMedications ) => {
//   return _.chain(patientMedications)
//     .thru(getLabaICSAndICS) //why do thru twice? how to check if both ICS and laba,ICS exists?
//     .thru((medications) => {
//       if (_.size(medications)) {
//         return _.chain(masterMedications)
//           .filter({ name: 'singulair' })
//           .concat(medications)
//           .value();
//       }
//
//       return medications;
//     })
//     .value();

export default rule11;
