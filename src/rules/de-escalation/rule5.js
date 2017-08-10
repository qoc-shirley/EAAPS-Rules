import _ from 'lodash';
import rule3 from './rule3';

const rule5 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        const noLaba = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba';
          } )
          .isEmpty()
          .value();

        const noLabaICS = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba,ICS';
          } )
          .isEmpty()
          .value();

        const noLtra = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'ltra';
          } )
          .isEmpty()
          .value();

        if ( patientMedication === 'ICS' && ( !noLaba || !noLabaICS ) && !noLtra ) {
          // Provide a choice to discontinue the LTRA
          result.concat( [
            'discontinue Ltra and continue ICS and laba/laba,ICS: ', _.concat( patientMedication, noLaba, noLabaICS ),
            'continue recommend: ', rule3(),
            'continue ltra: ', noLtra,
          ] );
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();
};

export default rule5;
