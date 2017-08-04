import _ from 'lodash';
// import * as get from '../library/getICSDose';
// import * as calculate from '../library/calculateICSDose';
// import * as adjust from '../library/adjustICSDose';

const rule2 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {

      }, masterMedications, patientMedications );
      rule( medication );

      return result.push( rule );
    }, [] )
    .value();
};

export default rule2;
