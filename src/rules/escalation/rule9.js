import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';
import medicationData from '../../medicationData/medicationData';

const rule9 = patientMedications => _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' && patientMedication.function === 'controller,reliever' &&
        ( calculate.ICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) ) &&
        _.some( patientMedications, { chemicalType: 'ltra' } ) ) {
        if ( !_.isEmpty( adjust.ICSDose( patientMedication, 'highest' ) ) ) {
          result.push( 'SMART' );
          result.push( patientMedication );
          result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
        }
        else {
          const filterMedication = _.chain( medicationData )
            .filter( {
              chemicalType: patientMedication.chemicalType,
              name: patientMedication.name,
              function: patientMedication.function,
            } )
            .filter( medication => adjust.ICSDose( medication, 'highest' ) !== [] )
            .value();
          result.push( 'SMART' );
          result.push( match.minimizePuffsPerTime( filterMedication ) );
          result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
        }
      }

      return result;
    }, [] )
    .flatten()
    .uniqBy( 'id' )
    .value();

export default rule9;
