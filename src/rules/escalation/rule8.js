import _ from 'lodash';
import * as categorize from '../library/categorizeDose';

const isSMARTMediumOrHigh = patientMedications => _.chain( patientMedications )
  .filter( ( patientMedication ) => {
    const icsDose = categorize.patientICSDose( patientMedication );
    const isLaac = _.some( patientMedications, { chemicalType: 'laac' } );
    // console.log('patientMedications: ', patientMedications);
    if ( patientMedication.name === 'symbicort' &&
        patientMedication.isSmart === true &&
      patientMedication.function === 'controller,reliever' &&
      ( icsDose === 'medium' || icsDose === 'high' ) && !_.some( patientMedications, { chemicalType: 'ltra' } ) &&
      !isLaac ) {
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
        .thru( singulair => Object.assign( singulair[0], { tag: 'e19' } ) )
        .concat( recommend )
        .value();
    } )
    .value();

export default rule8;
