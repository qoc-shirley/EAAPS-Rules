import _ from 'lodash';
import rule2 from './rule2';
import * as adjust from '../library/adjustICSDose';
import * as get from '../library/getICSDose';
import * as calculate from '../library/calculateICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule3 = ( patientMedications, masterMedications, questionnaireAnswers ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        const check = _.chain( originalMedications )
          .filter( ( labaICSMedication ) => {
            return ( labaICSMedication.chemicalType === 'laba,ICS' ||
              ( labaICSMedication.chemicalType === 'laba' &&
                _.some( originalMedications, { chemicalType: 'ICS' } ) ) ) &&
                !_.some( originalMedications, { chemicalType: 'ICS' } );
          } )
          .isEmpty()
          .value();

        const isLaba = _.filter( check, { chemicalType: 'laba' } );
        const laba = _.find( isLaba, { chemicalType: 'laba' } );

        // const compareLowestDose = _.chain( medicationElement )
        //   .filter( ( findMedication ) => {
        //     return (
        //       findMedication.name === 'flovent' &&
        //       findMedication.device === 'inhaler2' &&
        //       findMedication.doseICS === '100'
        //       ) || (
        //       findMedication.name === 'flovent' &&
        //       findMedication.device === 'diskus' &&
        //       findMedication.doseICS === '200'
        //       ) || (
        //       findMedication.name === 'pulmicort' &&
        //       findMedication.device === 'turbuhaler' &&
        //       findMedication.doseICS === '200'
        //       ) || (
        //       findMedication.name === 'qvar' &&
        //       findMedication.device === 'inhaler1' &&
        //       findMedication.doseICS === '100'
        //       ) || (
        //       findMedication.name === 'asthmanex' &&
        //       findMedication.device === 'twisthaler' &&
        //       findMedication.doseICS === '100'
        //       ) || (
        //       findMedication.name === 'alvesco' &&
        //       findMedication.device === 'inhaler1' &&
        //       findMedication.doseICS === '200'
        //       ) || (
        //       findMedication.name === 'advair' &&
        //       findMedication.device === 'inhaler2' &&
        //       findMedication.doseICS === '250'
        //       ) || (
        //       findMedication.name === 'advair' &&
        //       findMedication.device === 'diskus' &&
        //       findMedication.doseICS === '200'
        //       ) || (
        //       findMedication.name === 'symbicort' &&
        //       findMedication.device === 'turbuhaler' &&
        //       findMedication.doseICS === '200'
        //       ) || (
        //       findMedication.name === 'zenhale' &&
        //       findMedication.device === 'inhaler2' &&
        //       findMedication.doseICS === '200'
        //       ) || (
        //       findMedication.name === 'arnuity' &&
        //       findMedication.device === 'inhaler2' &&
        //       findMedication.doseICS === '100'
        //       ) || (
        //       findMedication.name === 'breo' &&
        //       findMedication.device === 'ellipta' &&
        //       findMedication.doseICS === '100'
        //     );
        //   } )
        //   .thru( get.lowestICSDose )
        //   .value();

        const filterMedications = _.chain( medicationElement )
          .filter( ( findMedication ) => {
            return (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
              findMedication.name === 'asthmanex' &&
              findMedication.device === 'twisthaler'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 250 ) ) &&
              findMedication.name === 'advair' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'advair' &&
              findMedication.device === 'diskus'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'symbicort' &&
              findMedication.device === 'turbuhaler'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'zenhale' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 200 ) ) &&
              findMedication.name === 'zenhale' &&
              findMedication.device === 'inhaler2'
            )|| (
              !_.isNil( adjust.ICSDoseToOriginalMedication( findMedication, 100 ) ) &&
              findMedication.name === 'breo' &&
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

        const onSMART = _.chain( originalMedications )
          .filter( { name: 'symbicort', function: 'controller,reliever' } )
          .isEmpty()
          .value();

        if ( !check ) {
          if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( compareLowestDose ) ) {
            const sameChemicalLabaAndIcs = _.chain( medicationElement )
              .filter( ( masterMedication ) => {
                return masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                  _.filter( isLaba, ( medication ) => {
                    return masterMedication.chemicalLABA === medication.chemicalLABA;
                  } );
              } )
              .value();

            if ( patientMedication.chemicalType === 'ICS' ) {
              const fifty = _.chain( sameChemicalLabaAndIcs )
                .filter( ( medication ) => {
                  return calculate.ICSDose( medication ) >= calculate.patientICSDose( patientMedication ) / 2 &&
                    calculate.ICSDose( medication ) < calculate.patientICSDose( patientMedication );
                } )
                .filter( ( medication ) => {
                  return medication.device === patientMedication.device || medication.device === laba.device;
                } )
                .thru( get.highestICSDose )
                .value();

              if ( _.isEmpty( sameChemicalLabaAndIcs ) && _.isEmpty( fifty ) ) {
                // de-escalation rule 2 and continue laba medication
                return result.concat( [rule2( patientMedication ), isLaba] );
              }

              return result.push( fifty );
            }
            else if ( patientMedication.chemicalType === 'laba,ICS' ) {
              return result.push( totalDoseReduction( patientMedication, sameChemicalLabaAndIcs ) );
            }
          }
          if ( onSMART ) {
            // not on smart
            const patientChoice = 'discontinue';
            // const patientChoice = 'continue';
            if ( patientChoice === 'discontinue' ) {
              if ( patientMedication.chemicalType === 'ICS' ) {
                // discontinue laba medication
                return result.push( patientMedication ); // and laba?
              }
              else if ( patientMedication.chemicalType === 'laba,ICS' ) {
                // recommend medication with same chemicalICS as original Medication
              }
            }
          }
          // not on SMART
          const questionThree = asthmaControlAnswers.rescuePuffer;
          if ( questionThree === '0' ) {

          }
          else if ( questionThree === '1' || questionThree === '2' || questionThree === '3' ) {
            return result.push( patientMedication ); // and laba?
          }
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers);
      rule( medication );

      return result.push( rule );
    }, [] )
    .value();
};

export default rule3;
