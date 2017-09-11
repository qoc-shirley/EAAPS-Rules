import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';
import * as match from '../library/match';
import masterMedications from '../../medicationData/medicationData';

const rule7 = patientMedications => _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' && patientMedication.isSmart === true &&
        patientMedication.function === 'controller,reliever' &&
        categorize.patientICSDose( patientMedication ) === 'low' ) {
        if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {
          return _.chain( masterMedications )
            .filter( medication => medication.name === 'symbicort' &&
                medication.function === 'controller,reliever' &&
                categorize.patientICSDose( medication ) === 'low' )
            .thru( _medication => match.minimizePuffsPerTime( _medication ) )
            .thru( _med => adjust.ICSDose( _med, 'medium' ) )
            .thru( addTag => Object.assign( addTag, { tag: 'e18' } ) )
            .concat( result )
            .value();
        }

        return _.chain( patientMedication )
          .thru( med => adjust.ICSDose( med, 'medium' ) )
          .thru( addTag => Object.assign( addTag, { tag: 'e18' } ) )
          .concat( result )
          .value();
      }

      return result;
    }, [] )
    .value();

export default rule7;
