import _ from 'lodash';
import * as categorize from './library/categorizeDose';

const rule8 = ( patientMedications, masterMedications ) => {
  const isSMARTMediumOrHigh = _.chain( patientMedications )
    .filter( ( patientMedication ) => {
      if ( patientMedication.name === 'symbicort' &&
        patientMedication.function === 'controller,reliever' &&
        ( categorize.patientICSDose( patientMedication ) === 'medium' ||
        categorize.patientICSDose( patientMedication ) === 'high' ) ) {
        return true;
      }

      return false;
    } )
    .value();

  if ( !_.isEmpty( isSMARTMediumOrHigh ) ) {
    return isSMARTMediumOrHigh.concat( _.filter( masterMedications, { name: 'singulair' } ) );
  }

  return [];
};

export default rule8;
