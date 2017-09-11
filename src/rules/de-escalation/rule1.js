import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as calculate from '../library/calculateICSDose';

// add tag to medications to determine message for UI
const rule1 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( _masterMedications, _patientMedications, _questionnaireAnswers, patientMedication ) => {
        const noLabaLtra = _.chain( _patientMedications )
          .filter( _noMedication => _noMedication.chemicalType === 'laba' || _noMedication.chemicalType === 'ltra' )
          .isEmpty()
          .value();

        const compareLowestDoseToPatientMedication =
          _.chain( _masterMedications )
            .filter( {
              chemicalType: patientMedication.chemicalType,
              name: patientMedication.name,
              device: patientMedication.device,
            } )
            .filter( findMedication => (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'flovent' &&
                findMedication.device === 'inhaler2'
              )
              ||
              (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
                findMedication.name === 'flovent' &&
                findMedication.device === 'diskus'
              )
              ||
              (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
                findMedication.name === 'pulmicort' &&
                findMedication.device === 'turbuhaler'
              )
              ||
              (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'qvar' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'asmanex' &&
                findMedication.device === 'twisthaler'
              )
              ||
              (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'alvesco' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'arnuity' &&
                findMedication.device === 'ellipta'
              ) )
            .filter( _medication => calculate.patientICSDose( patientMedication ) <= calculate.ICSDose( _medication ) )
            .isEmpty()
            .value();

        if ( patientMedication.chemicalType === 'ICS' && noLabaLtra && !compareLowestDoseToPatientMedication ) {
          const avgAsthmaSymptoms = _questionnaireAnswers[0].asthmaSymptoms;
          if ( avgAsthmaSymptoms === '0' ) {
            return result.push( 'statement1Ai',
              Object.assign( patientMedication, { maxPuffPerTime: patientMedication.puffPerTime, tag: 'd1' } ) );
          }
          else if ( avgAsthmaSymptoms === '1' || avgAsthmaSymptoms === '2' || avgAsthmaSymptoms === '3' ) {
            return result.push( 'statement1Aii',
              Object.assign( patientMedication, { maxPuffPerTime: patientMedication.puffPerTime, tag: 'd2' } ) );
          }

          return [];
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flattenDeep()
    .value();

export default rule1;
