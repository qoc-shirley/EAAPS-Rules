import _ from 'lodash';
// import * as get from '../library/getICSDose';

const rule3 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        const check = _.chain( originalMedications )
          .filter( ( labaICSMedication ) => {
            return labaICSMedication.chemicalType === 'laba,ICS' ||
              ( labaICSMedication.chemicalType === 'laba' && _.some( originalMedications, { chemicalType: 'ICS' } ) );
          } )
          .isEmpty()
          .value();

        const compareLowestDose = _.chain( medicationElement )
          .filter( ( findMedication ) => {
            return (
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'asthmanex' &&
              findMedication.device === 'twisthaler' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'advair' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '250'
              ) || (
              findMedication.name === 'advair' &&
              findMedication.device === 'diskus' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'symbicort' &&
              findMedication.device === 'turbuhaler' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'zenhale' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'breo' &&
              findMedication.device === 'ellipta' &&
              findMedication.doseICS === '100'
            );
          } )
          .value();

        if ( !check ) {
          if ( patientMedication.chemicalType === 'laba,ICS') {
          }
          else if ( patientMedication.chemicalType === 'ICS' ) {
          }
        }
      }, masterMedications, patientMedications );
      rule( medication );

      return result.push( rule );
    }, [] )
    .value();
};

export default rule3;
