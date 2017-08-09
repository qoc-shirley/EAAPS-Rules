import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';

const rule1 = ( patientMedications, masterMedications, questionnaireAnswers ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        const filterMedications = _.chain( medicationElement )
          .filter( ( findMedication ) => {
            return (
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
              );
          } )
          .value();

        const compareLowestDose = _.chain( filterMedications )
          .filter(
          {
            chemicalType: patientMedication.chemicalType,
            name: patientMedication.name,
            device: patientMedication.device,
          } )
          .value();

        const questionTwo = questionnaireAnswers.asthmaSymptoms;
        if ( questionTwo === '0' ) {

        }
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();
};

export default rule1;
