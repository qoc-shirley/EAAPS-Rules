import _ from 'lodash';
import rule1 from './rule1';
import rule2 from './rule2';

const rule4 = ( patientMedications, masterMedications, questionnaireAnswers ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        const noLaba = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba';
          } )
          .isEmpty()
          .value();
        const isLtra = _.chain( originalMedications )
          .filter( { chemicalType: 'ltra' } )
          .value();

        if ( patientMedication.chemicalType === 'ICS' && noLaba && !_.isEmpty( isLtra ) ) {
          // Provide a choice to discontinue the LTRA
          console.log('rules continue ICS: ',
            rule2( [patientMedication], medicationElement ));
          result.push( [
            'discontinue ltra and continue ICS: ', patientMedication,
            'continue ICS: ', rule1( [patientMedication], medicationElement, asthmaControlAnswers ) ||
            rule2( [patientMedication], medicationElement ),
            'continue ltra: ', isLtra[0],
          ] );
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flatten()
    .value();
};

export default rule4;
