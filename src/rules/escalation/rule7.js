import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';
import masterMedications from '../../medicationData/medicationData';

const rule7 = ( patientMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' &&
        patientMedication.function === 'controller,reliever' &&
        categorize.patientICSDose( patientMedication ) === 'low' ) {
        if ( adjust.ICSDose( patientMedication, 'lowestMedium' ) === [] ) {
          console.log("not same doseICS");
          return _.chain( masterMedications )
            .filter( ( medication ) => {
              return medication.name === 'symbicort' &&
                medication.function === 'controller,reliever' &&
                categorize.patientICSDose( medication ) === 'low';
            } )
            .max( 'doseICS' )
            .thru( _med => adjust.ICSDose( _med, 'lowestMedium' ) )
            .concat( result )
            .value();
        }

        console.log( 'same doseICS: ', patientMedication, adjust.ICSDose( patientMedication, 'lowestMedium' ) );
        return _.chain( patientMedication )
          .thru( med => adjust.ICSDose( med, 'lowestMedium' ) )
          .concat( result )
          .value();
      }

      return result;
    }, [] )
    .value();
};

export default rule7;
