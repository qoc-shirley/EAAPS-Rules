import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as calculate from '../library/calculateICSDose';

// add tag to medications to determine message for UI
const rule1 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        // const filterMedications = _.chain( medicationElement )
        //   .filter( findMedication => (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'flovent' &&
        //         findMedication.device === 'inhaler2'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
        //         findMedication.name === 'flovent' &&
        //         findMedication.device === 'diskus'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
        //         findMedication.name === 'pulmicort' &&
        //         findMedication.device === 'turbuhaler'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'qvar' &&
        //         findMedication.device === 'inhaler1'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'asthmanex' &&
        //         findMedication.device === 'twisthaler'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'alvesco' &&
        //         findMedication.device === 'inhaler1'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'arnuity' &&
        //         findMedication.device === 'ellipta'
        //       ) )
        //   .value();

        // const medicationsWithLowestDose =
        //   _.chain( medicationElement )
        //     .filter( findMedication => (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'flovent' &&
        //         findMedication.device === 'inhaler2'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
        //         findMedication.name === 'flovent' &&
        //         findMedication.device === 'diskus'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
        //         findMedication.name === 'pulmicort' &&
        //         findMedication.device === 'turbuhaler'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'qvar' &&
        //         findMedication.device === 'inhaler1'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'asthmanex' &&
        //         findMedication.device === 'twisthaler'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'alvesco' &&
        //         findMedication.device === 'inhaler1'
        //       )
        //       ||
        //       (
        //         !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
        //         findMedication.name === 'arnuity' &&
        //         findMedication.device === 'ellipta'
        //       ) )
        //   .filter(
        //   {
        //     chemicalType: patientMedication.chemicalType,
        //     name: patientMedication.name,
        //     device: patientMedication.device,
        //   } )
        //   .value();

        const noLabaLtra = _.chain( originalMedications )
          .filter( _noMedication => _noMedication.chemicalType === 'laba' || _noMedication.chemicalType === 'ltra' )
          .isEmpty()
          .value();

        const compareLowestDoseToPatientMedication =
          _.chain( medicationElement )
            .filter( findMedication => (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
                findMedication.name === 'flovent' &&
                findMedication.device === 'inhaler2'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
                findMedication.name === 'flovent' &&
                findMedication.device === 'diskus'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
                findMedication.name === 'pulmicort' &&
                findMedication.device === 'turbuhaler'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
                findMedication.name === 'qvar' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
                findMedication.name === 'asthmanex' &&
                findMedication.device === 'twisthaler'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
                findMedication.name === 'alvesco' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
                findMedication.name === 'arnuity' &&
                findMedication.device === 'ellipta'
              ) )
            .filter( {
              chemicalType: patientMedication.chemicalType,
              name: patientMedication.name,
              device: patientMedication.device,
              } )
            .filter( _medication => {console.log('medications: ', _medication );  return calculate.patientICSDose( patientMedication ) <= calculate.ICSDose( _medication ) } )
            .isEmpty()
            .value();
        console.log( 'compareLowestDoseToPatientMedication: ', compareLowestDoseToPatientMedication);

        if ( patientMedication.chemicalType === 'ICS' && noLabaLtra && !compareLowestDoseToPatientMedication ) {
          const avgAsthmaSymptoms = asthmaControlAnswers[0].asthmaSymptoms;
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
