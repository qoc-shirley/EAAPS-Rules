import _ from 'lodash';
import * as calculate from './library/calculateICSDose';

const rule6 = ( patientMedications ) => {

  const consultRespirologist = _
    .chain( patientMedications )
    .filter( ( patientMedication ) => {
      const filterChemicalTypeLtra = _.filter( patientMedications, { chemicalType: 'ltra' } );
      const isFilteredLtraGreatermaxGreenICS = _
        .chain( filterChemicalTypeLtra )
        .filter( ( patientMedication ) => {
          if ( calculate.patientICSDose( patientMedication ) >= patientMedication.maxGreenICS ) {
            return true;
          }

          return false;
        } )
        .isEmpty()
        .value();
      if ( patientMedication.name !== 'symbicort' &&
        ( patientMedication.chemicalType === 'laba,ICS' ||
          ( patientMedication.chemicalType === 'ICS' && patientMedication.chemicalType === 'laba' )
        ) &&
        filterChemicalTypeLtra && !isFilteredLtraGreatermaxGreenICS ) {
        return true;
      }

      return false;
    } )
    .value();

  if ( !_.isEmpty( consultRespirologist ) ) {
    return consultRespirologist.concat( 'consult a respirologist' );
  }

  return [];
};

export default rule6;
