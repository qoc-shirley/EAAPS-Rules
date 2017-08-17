import _ from 'lodash';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';

// const rule7 = ( patientMedications ) => {
//   return _.chain( patientMedications )
//     .reduce( ( result, patientMedication ) => {
//       if ( patientMedication.name === 'symbicort' &&
//         patientMedication.function === 'controller,reliever' &&
//         categorize.patientICSDose( patientMedication ) === 'low' ) {
//         if ( adjust.ICSDose( patientMedication, 'lowestMedium' ) === [] ) {
//           result.push(
//             _.max(
//               _.filter( patientMedications, ( medication ) => {
//                 return medication.name === 'symbicort' &&
//                   medication.function === 'controller,reliever' &&
//                   categorize.patientICSDose( medication ) === 'low';
//               } ),
//               'doseICS' ) );
//         }
//         else {
//           result.push( adjust.ICSDose( patientMedication, 'lowestMedium' ) );
//         }
//       }
//
//       return result;
//     }, [] )
//     .value();
// };
const rule7 = ( patientMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' &&
        patientMedication.function === 'controller,reliever' &&
        categorize.patientICSDose( patientMedication ) === 'low' ) {
        if ( adjust.ICSDose( patientMedication, 'lowestMedium' ) === [] ) {
          return _.chain(patientMedications)
            .filter((medication) => {
              return medication.name === 'symbicort' &&
                medication.function === 'controller,reliever' &&
                categorize.patientICSDose( medication ) === 'low';
            })
            .max('doseICS')
            .concat(result)
            .value();
        }
        return _.chain(patientMedication)
          .thru(med => adjust.ICSDose( med, 'lowestMedium' ))
          .concat(result)
          .value();
      }

      return result;
    }, [] )
    .value();
};

export default rule7;
