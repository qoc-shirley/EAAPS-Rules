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
        const ltra = _.chain( patientMedications )
          .filter( patientMedications, { chemicalType: 'ltra' } )
          .thru( _medication => Object.assign( _medication, { tag: 'e20' } ) )
          .value();
        if ( !_.isEmpty( adjust.ICSDose( patientMedication, 'highest' ) ) ) {
          result.push( 'SMART' );
          result.push( Object.assign( patientMedication, { tag: 'e20' } ) );
          result.push( ltra );
        }
        else {
          const filterMedication = _.chain( medicationData )
            .filter( {
              chemicalType: patientMedication.chemicalType,
              name: patientMedication.name,
              function: patientMedication.function,
            } )
            .filter( medication => adjust.ICSDose( medication, 'highest' ) !== [] )
            .thru( _medication => match.minimizePuffsPerTime( _medication ) )
            .value();
          result.push( 'SMART', Object.assign( filterMedication, { tag: 'e20' } ),
            ltra );
        }
      }

      return result;
    }, [] )
    .flatten()
    .uniqBy( 'id' )
    .value();

export default rule9;
