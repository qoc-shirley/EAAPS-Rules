import _ from 'lodash';
import rule3 from './rule3';

const rule5 = ( patientMedications, masterMedications, questionnaireAnswers ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        const noLaba = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba';
          } )
          .value();

        const noLabaICS = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba,ICS';
          } )
          .value();

        const noLtra = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'ltra';
          } )
          .value();

        if (
            ( patientMedication.chemicalType === 'laba,ICS' ||
              ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( noLaba ) ) )
          && !_.isEmpty( noLtra ) ) {
          // Provide a choice to discontinue the LTRA
          let rule3Recommendation =
            rule3( _.concat( patientMedication, noLaba ), medicationElement, asthmaControlAnswers );
          if ( _.isEmpty( rule3Recommendation ) ) {
            rule3Recommendation = 'No recommendation';
          }
          result.push( [
            'discontinue Ltra and continue ICS and laba/laba,ICS: ', _.concat( patientMedication, noLaba, noLabaICS ),
            'continue recommend: ', rule3Recommendation,
            'continue ltra: ', noLtra,
          ] );
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flattenDeep()
    .value();
};

export default rule5;
