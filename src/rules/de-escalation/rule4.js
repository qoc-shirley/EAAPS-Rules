import _ from 'lodash';
import rule1 from './rule1';
import rule2 from './rule2';

const rule4 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( _masterMedications, _patientMedications, _questionnaireAnswers, patientMedication ) => {
        const noLaba = _.chain( _patientMedications )
          .filter( _medication => _medication.chemicalType === 'laba' )
          .isEmpty()
          .value();
        const isLtra = _.chain( _patientMedications )
          .filter( { chemicalType: 'ltra' } )
          .value();

        if ( patientMedication.chemicalType === 'ICS' && noLaba && !_.isEmpty( isLtra ) &&
          !_.some( _patientMedications, { chemicalType: 'laac' } ) ) {
          // Provide a choice to discontinue the LTRA
          const patientMedicationClone1 = _.cloneDeep( patientMedication );
          const patientMedicationClone2 = _.cloneDeep( patientMedication );
          let rule1Recommendation = rule1( [patientMedicationClone1], _masterMedications, _questionnaireAnswers );
          let rule2Recommendation = rule2( [patientMedicationClone2], _masterMedications );
          if ( _.isEmpty( rule1Recommendation ) ) {
            rule1Recommendation = 'no Recommendations';
          }
          if ( _.isEmpty( rule2Recommendation ) ) {
            rule2Recommendation = 'no Recommendations';
          }
          // console.log(rule1( [patientMedication], _masterMedications, _questionnaireAnswers ));
          // change result when pushing to CDSS
          result.push( 'statement4',
            'discontinue ltra: ', Object.assign( isLtra[0], { tag: 'd10' } ),
            Object.assign( patientMedication, { tag: 'd10', maxPuffPerTime: patientMedication.puffPerTime } ),
            'continue ltra : ', Object.assign( isLtra[0], { tag: 'd10' } ),
            'Rule1: ', Object.assign( rule1Recommendation, { tag: 'd10' } ),
            'Rule2: ', Object.assign( rule2Recommendation, { tag: 'd10' } ),
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
