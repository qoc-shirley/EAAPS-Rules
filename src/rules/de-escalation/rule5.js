import _ from 'lodash';
import rule3 from './rule3';

const rule5 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( _masterMedications, _patientMedications, _questionnaireAnswers, patientMedication ) => {
        const noLaba = _.chain( _patientMedications )
          .filter( _medication => _medication.chemicalType === 'laba' )
          .value();

        const noLtra = _.chain( _patientMedications )
          .filter( _medication => _medication.chemicalType === 'ltra' )
          .value();

        if (
            ( patientMedication.chemicalType === 'laba,ICS' ||
              ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( noLaba ) ) )
          && !_.isEmpty( noLtra ) && !_.some( _patientMedications, { chemicalType: 'laac' } )) {
          // Provide a choice to discontinue the LTRA
          const patientMedicationClone = _.cloneDeep( patientMedication );
          let rule3Recommendation =
            rule3( _.concat( patientMedicationClone, noLaba ), _masterMedications, _questionnaireAnswers );
          if ( _.isEmpty( rule3Recommendation ) ) {
            rule3Recommendation = 'No recommendation';
          }
          if ( !_.isEmpty( noLaba ) ) {
            return result.push( 'statement5',
              'discontinue Ltra: ',
              Object.assign( patientMedication, { tag: 'd11' } ),
              Object.assign( noLaba[0], { tag: 'd11' } ),
              'continue ltra (Rule3): ',
              Object.assign( rule3Recommendation, { tag: 'd11' } ),
              Object.assign( noLtra[0], { tag: 'd11' } ),
            );
          }
          result.push( 'statement5',
            'discontinue Ltra: ',
            Object.assign( patientMedication, { tag: 'd11' } ),
            'continue ltra (Rule3): ',
            Object.assign( rule3Recommendation, { tag: 'd11' } ),
            Object.assign( noLtra[0], { tag: 'd11' } ),
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
