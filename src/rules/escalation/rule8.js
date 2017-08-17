import _ from 'lodash';
import * as categorize from '../library/categorizeDose';

const isSMARTMediumOrHigh = ( patientMedications ) => {
  return _.chain( patientMedications )
  .filter( ( patientMedication ) => {
    const icsDose = categorize.patientICSDose( patientMedication );

    if ( patientMedication.name === 'symbicort' &&
      patientMedication.function === 'controller,reliever' &&
      ( icsDose === 'medium' || icsDose === 'high' )) {
      return true;
    }

    return false;
  } )
  .value();
};

const rule8 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .thru( isSMARTMediumOrHigh )
    .thru( smartMedHighMeds => {
      if ( !_.size( smartMedHighMeds ) ) {
        return [];
      }

      return _.chain( masterMedications )
        .filter( { name: 'singulair' } )
        .concat( smartMedHighMeds )
        .value();
    })
    .value();
};

export default rule8;
