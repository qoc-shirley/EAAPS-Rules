import _ from 'lodash';
import * as calculate from './library/calculateICSDose';

const rule6 = ( patientMedications ) => {

  // const consultRespirologist = _
  return _
    .chain( patientMedications )
    .filter( ( patientMedication ) => {
      const filterChemicalTypeLtra = _.filter( patientMedications, { chemicalType: 'ltra' } );
      const filterChemicalTypeLaba = _.filter( patientMedications, { chemicalType: 'laba' } );

      // const isFilteredLtraGreatermaxGreenICS = _
      //   .chain( filterChemicalTypeLtra )
      //   .filter( ( patientMedication ) => {
      //     if ( calculate.patientICSDose( patientMedication ) >= patientMedication.maxGreenICS ) {
      //       return true;
      //     }
			//
      //     return false;
      //   } )
      //   .isEmpty()
      //   .value();
      if ( patientMedication.name !== 'symbicort' &&
        ( patientMedication.chemicalType === 'laba,ICS' ||
        ( !_.isEmpty( filterChemicalTypeLaba ) && patientMedication.chemicalType === 'ICS' )
        ) &&
        calculate.patientICSDose( patientMedication ) >= patientMedication.maxGreenICS &&
        !_.isEmpty( filterChemicalTypeLtra ) ) {
        return true;
      }

      return false;
    } )
    .thru( ( arr ) => {
      if ( _.size( arr ) ) {
        return [['Consult a respirologist']];
      }

      return [];
    } )
    .value();

  // if ( !_.isEmpty( consultRespirologist ) ) {
  //   return consultRespirologist.concat( 'consult a respirologist' );
  // }
	//
  // return [];
};

export default rule6;
