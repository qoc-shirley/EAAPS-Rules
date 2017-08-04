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
          const discontinue = true;
          if ( discontinue ) {
            return result.push( patientMedication );
          }

          return rule1() || rule2();
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result.push( rule );
    }, [] )
    .value();
};

export default rule4;
