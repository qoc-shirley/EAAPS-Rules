import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';

const rule6 = patientMedications => _
    .chain( patientMedications )
    .filter( ( patientMedication ) => {
      const filterChemicalTypeLtra = _.filter( patientMedications, { chemicalType: 'ltra' } );
      const filterChemicalTypeLaba = _.filter( patientMedications, { chemicalType: 'laba' } );
      const isLaac = _.some( patientMedications, { chemicalType: 'laac' } );

      if ( patientMedication.name !== 'symbicort' &&
        ( patientMedication.chemicalType === 'laba,ICS' ||
        ( !_.isEmpty( filterChemicalTypeLaba ) && patientMedication.chemicalType === 'ICS' )
        ) &&
        calculate.patientICSDose( patientMedication ) >= _.toInteger( patientMedication.maxGreenICS ) &&
        !_.isEmpty( filterChemicalTypeLtra ) && !isLaac ) {
        return true;
      }

      return false;
    } )
    .thru( ( arr ) => {
      if ( _.size( arr ) ) {
        return [['Consult a respirologist'], { tag: 'e17' }];
      }

      return [];
    } )
    .value();

export default rule6;
