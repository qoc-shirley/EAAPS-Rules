import _ from 'lodash';
import * as categorize from '../library/categorizeDose';

const isSMARTMediumOrHigh = patientMedications => _.chain( patientMedications )
  .filter( ( patientMedication ) => {
    const icsDose = categorize.patientICSDose( patientMedication );
    console.log('patientMedications: ', patientMedications);
    if ( patientMedication.name === 'symbicort' &&
      patientMedication.function === 'controller,reliever' &&
      ( icsDose === 'medium' || icsDose === 'high' ) ) {
      return true;
    }

    return false;
  } )
  .value();

const rule8 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .thru( isSMARTMediumOrHigh )
    .thru( ( smartMedHighMeds ) => {
      if ( !_.size( smartMedHighMeds ) ) {
        return [];
      }
      const recommend =
        Object.assign( smartMedHighMeds[0], { maxPuffPerTime: smartMedHighMeds[0].puffPerTime, tag: 'e19' } );

      return _.chain( masterMedications )
        .filter( { name: 'singulair' } )
        .concat( 'SMART', recommend )
        .value();
    } )
    .value();

export default rule8;
