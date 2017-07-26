import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const rule9 = ( patientMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' && patientMedication.function === 'controller,reliever' &&
        ( calculate.ICSDose( patientMedication ) < patientMedication.maxGreenICS ) &&
        _.some( patientMedications, { chemicalType: 'ltra' } ) ) {
        if ( !_.isEmpty( adjust.ICSDose( patientMedication, 'highest' ) ) ) {
          result.push( patientMedication );
          result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
        }
        else {
          const filterMedication = _.filter( patientMedications, { chemicalType: patientMedication.chemicalType } );
          result.push( match.minimizePuffsPerTime( filterMedication, patientMedication ) );
          result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
        }
      }

      return result;
    }, [] )
    .flatten()
    .uniqBy( 'id' )
    .value();
};

export default rule9;
