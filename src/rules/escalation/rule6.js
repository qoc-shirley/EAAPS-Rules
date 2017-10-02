import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';

const rule6 = patientMedications => _
    .chain( patientMedications )
    .filter( ( patientMedication ) => {
      const filterChemicalTypeLtra = _.filter( patientMedications, { chemicalType: 'ltra' } );
      const filterChemicalTypeLaba = _.filter( patientMedications, { chemicalType: 'laba' } );
      const isLaac = _.some( patientMedications, { chemicalType: 'laac' } );
      const labaIcsSize = _.size( _.filter( patientMedications, { chemicalType: 'laba,ICS' } ) ) === 1;
      const icsSize = _.size( _.filter( patientMedications, { chemicalType: 'ICS' } ) ) === 1;
      const labaSize = _.size( _.filter( patientMedications, { chemicalType: 'laba' } ) ) === 1;

      if ( patientMedication.name !== 'symbicort' &&
        ( ( patientMedication.chemicalType === 'laba,ICS' && labaIcsSize && !icsSize && !labaSize ) ||
        ( !_.isEmpty( filterChemicalTypeLaba ) && patientMedication.chemicalType === 'ICS' &&
          icsSize && labaSize && labaIcsSize )
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
