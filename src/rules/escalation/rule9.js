import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const rule9 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
      if ( patientMedication.name === 'symbicort' && patientMedication.function === 'controller,reliever' &&
          patientMedication.isSmart === true &&
        ( calculate.patientICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) ) &&
        _.some( patientMedications, { chemicalType: 'ltra' } ) &&
        !_.some( patientMedications, { chemicalType: 'laac' } ) ) {
        const ltra = _.filter( patientMedications, { chemicalType: 'ltra' } );
        if ( !_.isEmpty( adjust.ICSDose( patientMedication, 'highest' ) ) ) {
          result.push( Object.assign( patientMedication, { tag: 'e20' } ) );
          result.push( Object.assign( ltra[0], { tag: 'e20' } ) );
        }
        else {
          const filterMedication = _.chain( masterMedications )
            .filter( {
              chemicalType: patientMedication.chemicalType,
              name: patientMedication.name,
              function: patientMedication.function,
            } )
            .filter( medication => adjust.ICSDose( medication, 'highest' ) !== [] )
            .thru( _medication => match.minimizePuffsPerTime( _medication ) )
            .value();
          result.push( Object.assign( filterMedication, { tag: 'e20' } ),
            Object.assign( ltra[0], { tag: 'e20' } ));
        }
      }

      return result;
    }, [] )
    .flatten()
    .uniqBy( 'id' )
    .value();

export default rule9;
