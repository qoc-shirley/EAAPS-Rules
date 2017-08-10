import _ from 'lodash';
import rule1 from './rule1';
import rule2 from './rule2';

const rule4 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        const noLaba = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba';
          } )
          .isEmpty()
          .value();
        const isLtra = _.chain( originalMedications )
          .filter( { chemicalType: 'ltra' } )
          .value();

        if ( patientMedication === 'ICS' && noLaba && !_.isEmpty( isLtra ) ) {
          // Provide a choice to discontinue the LTRA
          result.concat( [
            'discontinue ltra and continue ICS: ', patientMedication,
            'continue ICS: ', rule1() || rule2(),
            'continue ltra: ', isLtra,
          ] );
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();
};

export default rule4;
