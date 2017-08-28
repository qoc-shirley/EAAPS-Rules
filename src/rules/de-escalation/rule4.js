import _ from 'lodash';
import rule1 from './rule1';
import rule2 from './rule2';

const rule4 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        const noLaba = _.chain( originalMedications )
          .filter( _medication => _medication.chemicalType === 'laba' )
          .isEmpty()
          .value();
        const isLtra = _.chain( originalMedications )
          .filter( { chemicalType: 'ltra' } )
          .value();

        if ( patientMedication.chemicalType === 'ICS' && noLaba && !_.isEmpty( isLtra ) ) {
          // Provide a choice to discontinue the LTRA
          let rule1Recommendation = rule1( [patientMedication], medicationElement, asthmaControlAnswers );
          let rule2Recommendation = rule2( [patientMedication], medicationElement );
          if ( _.isEmpty( rule1Recommendation ) ) {
            rule1Recommendation = 'no Recommendations';
          }
          if ( _.isEmpty( rule2Recommendation ) ) {
            rule2Recommendation = 'no Recommendations';
          }
          // console.log(rule1( [patientMedication], medicationElement, asthmaControlAnswers ));
          result.push( [
            'discontinue ltra: ', patientMedication,
            'continue ltra : ', isLtra[0],
            'Rule1: ', rule1Recommendation,
            'Rule2: ', rule2Recommendation,
          ] );
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flattenDeep()
    .value();

export default rule4;
