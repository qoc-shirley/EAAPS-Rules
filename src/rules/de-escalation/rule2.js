import _ from 'lodash';
import * as get from '../library/getICSDose';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule2 = ( patientMedications, masterMedications ) => {
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
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
                findMedication.name === 'alvesco' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
                findMedication.name === 'arnuity' &&
                findMedication.device === 'inhaler2'
              );
          } )
          .value();

        const compareLowestDose = _.chain( filterMedications )
          .thru( get.lowestICSDose )
          .value();
        const noLabaLtra = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba' || medication.chemicalType === 'ltra';
          } )
          .isEmpty()
          .value();

        if ( patientMedication.chemicalType === 'ICS' &&
          noLabaLtra &&
          calculate.patientICSDose( patientMedication ) > calculate.ICSDose( compareLowestDose ) ) {
          const recommend = _.chain( medicationElement )
            .filter( ( medication ) => {
              return medication.chemicalICS === patientMedication.chemicalICS &&
                medication.device === patientMedication.device;
            } )
            .value();

          result.push( totalDoseReduction( patientMedication, recommend ) );
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();
};

export default rule2;
