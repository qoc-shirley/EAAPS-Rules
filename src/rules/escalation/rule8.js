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
  // const isSMARTMediumOrHigh = _.chain( patientMedications )
  //   .filter( ( patientMedication ) => {
  //     if ( patientMedication.name === 'symbicort' &&
  //       patientMedication.function === 'controller,reliever' &&
  //       ( categorize.patientICSDose( patientMedication ) === 'medium' ||
  //       categorize.patientICSDose( patientMedication ) === 'high' ) ) {
  //       return true;
  //     }
  //
  //     return false;
  //   } )
  //   .value();

  if ( !_.isEmpty( isSMARTMediumOrHigh ) ) {
    return isSMARTMediumOrHigh.concat( _.filter( masterMedications, { name: 'singulair' } ) );
  }

  return [];
};

// const rule8 = ( patientMedications, masterMedications ) => {
//   return _.chain(patientMedications)
//     .thru(isSMARTMediumOrHigh) //why are there 2 thru
//     .thru(smartMedHighMeds => {
//       if (!_.size(smartMedHighMeds)) {
//         return [];
//       }
//
//       return _.chain(masterMedications)
//         .filter({ name: 'singulair' })
//         .concat(smartMedHighMeds)
//         .value();
//     })
//     .value();
// };

export default rule8;
