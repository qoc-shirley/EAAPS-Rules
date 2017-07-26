import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';

const rule10 = ( patientMedications, masterMedications ) => {
  // const consultRespirologist =
  return _
    .chain( patientMedications )
    .filter(
      _.partial( ( medicationElements, patientMedication ) => {
        if ( patientMedication.name === 'symbicort' &&
          patientMedication.function === 'controller,reliever' &&
          ( calculate.patientICSDose( patientMedication ) >= patientMedication.maxGreenICS ) ) {
          if ( _.find( patientMedications, { chemicalType: 'ltra' } ) ) {
            return true;
          }

          return false;
        }
      }, masterMedications ),
    )
    .thru( ( arr ) => {
      if ( _.size( arr ) ) {
        return [['Consult a respirologist']];
      }

      return [];
    } )
    .value();
};

export default rule10;
