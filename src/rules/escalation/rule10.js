import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';

const rule10 = ( patientMedications, masterMedications ) => _
    .chain( patientMedications )
    .filter(
      _.partial( ( medicationElements, patientMedication ) => {
        if ( patientMedication.name === 'symbicort' &&
          patientMedication.function === 'controller,reliever' &&
          ( calculate.patientICSDose( patientMedication ) >= _.toInteger( patientMedication.maxGreenICS ) ) ) {
          if ( _.find( patientMedications, { chemicalType: 'ltra' } ) ) {
            return true;
          }

          return false;
        }

        return false;
      }, masterMedications ),
    )
    .thru( ( arr ) => {
      if ( _.size( arr ) ) {
        return [['Consult a respirologist'], { tag: 'e21' }];
      }

      return [];
    } )
    .value();

export default rule10;
