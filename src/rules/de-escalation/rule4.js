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
          //change result when pushing to CDSS
          result.push( 'statement4',
            'discontinue ltra: ', Object.assign( isLtra[0], { tag: 'd10' } ),
            'continue ltra : ', Object.assign( isLtra[0], { tag: 'd10' } ),
            'Rule1: ', Object.assign( rule1Recommendation[1], { tag: 'd10' } ),
            'Rule2: ', Object.assign( rule2Recommendation[0], { tag: 'd10' } ),
          );
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flattenDeep()
    .value();

export default rule4;
