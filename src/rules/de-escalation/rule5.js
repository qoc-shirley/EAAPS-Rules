import _ from 'lodash';
import rule3 from './rule3';

const rule5 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        const noLaba = _.chain( originalMedications )
          .filter( _medication => _medication.chemicalType === 'laba' )
          .value();

        const noLabaICS = _.chain( originalMedications )
          .filter( _medication => _medication.chemicalType === 'laba,ICS' )
          .value();

        const noLtra = _.chain( originalMedications )
          .filter( _medication => _medication.chemicalType === 'ltra' )
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
          result.push( 'statement5',
            'discontinue Ltra: ', _.concat( patientMedication, noLaba, noLabaICS ),
            'continue ltra (Rule3): ', rule3Recommendation, noLtra,
          );
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flattenDeep()
    .value();

export default rule5;
