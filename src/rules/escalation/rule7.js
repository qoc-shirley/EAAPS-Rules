import _ from 'lodash';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';

const rule7 = ( patientMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' &&
        patientMedication.function === 'controller,reliever' &&
        categorize.patientICSDose( patientMedication ) === 'low' ) {
        if ( adjust.ICSDose( patientMedication, 'lowestMedium' ) === [] ) {
          result.push(
            _.max(
              _.filter( patientMedications, ( medication ) => {
                return medication.name === 'symbicort' &&
                  medication.function === 'controller,reliever' &&
                  categorize.patientICSDose( medication ) === 'low';
              } ),
              'doseICS' ) );
        }
        else {
          result.push( adjust.ICSDose( patientMedication, 'lowestMedium' ) );
        }
      }

      return result;
    }, [] )
    .value();
};

export default rule7;
