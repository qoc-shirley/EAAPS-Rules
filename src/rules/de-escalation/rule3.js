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

        const filterMedications = _.chain( medicationElement )
          .filter( ( findMedication ) => {
            return (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'asthmanex' &&
              findMedication.device === 'twisthaler'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 250 ) ) &&
              findMedication.name === 'advair' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'advair' &&
              findMedication.device === 'diskus'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'symbicort' &&
              findMedication.device === 'turbuhaler'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'zenhale' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'zenhale' &&
              findMedication.device === 'inhaler2'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
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

        const notOnSMART = _.chain( originalMedications )
          .filter( { name: 'symbicort', function: 'controller,reliever' } )
          .isEmpty()
          .value();

        if ( !check ) {
          if ( !_.isEmpty( _.filter( compareLowestDose,
              ( medication ) => {
                return calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication );
              } ) ) ) {
            const sameChemicalLabaAndIcs = _.chain( compareLowestDose )
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
                return result.push( [rule2( patientMedication ), isLaba] );
              }

              return result.push( fifty );
            }
            else if ( patientMedication.chemicalType === 'laba,ICS' ) {
              return result.push( totalDoseReduction( patientMedication, sameChemicalLabaAndIcs ) );
            }
          }
          if ( notOnSMART ) {
            // not on smart
            if ( patientMedication.chemicalType === 'ICS' ) {
              // discontinue laba medication
              return result.push( patientMedication );
            }
            else if ( patientMedication.chemicalType === 'laba,ICS' ) {
              // recommend medication with same chemicalICS as original Medication
              const equalICSDose = _.chain( medicationElement )
                .filter(
                {
                  chemicalType: 'laba,ICS',
                  device: patientMedication.device,
                  chemicalICS: patientMedication.chemicalICS,
                } )
                .filter( ( medication ) => {
                  return !_.isNil( adjust.ICSDoseToOriginalMedication( medication, patientMedication ) );
                } )
               .value();
              if ( _.isEmpty( equalICSDose ) ) {
                return result.push( _.chain( medicationElement )
                  .filter(
                  {
                    chemicalType: 'laba,ICS',
                    device: patientMedication.device,
                    chemicalICS: patientMedication.chemicalICS,
                  } )
                  .maxBy( 'doseICS' )
                  .value(),
                );
              }

              return result.push( ['discontinue:', equalICSDose, 'OR continue:', patientMedication] );

            }
          }
          // not on SMART
          const questionThree = asthmaControlAnswers[0].rescuePuffer;
          if ( questionThree === '0' ) {
            const reliever = _.chain( originalMedications )
              .filter( ( medication ) => {
                return medication.name !== 'symbicort' && medication.function === 'controller,reliever';
              } )
              .isEmpty()
              .value();
            if ( reliever ) {
              result.push( _.chain( medicationElement )
                  .filter( ( medication ) => {
                    return medication.name !== 'symbicort' && medication.function === 'controller,reliever';
                  } )
                .value(),
                );
            }
            const equalICSDose = _.chain( medicationElement )
              .filter(
              {
                chemicalType: 'laba,ICS',
                device: patientMedication.device,
                chemicalICS: patientMedication.chemicalICS,
              } )
              .filter( ( medication ) => {
                return !_.isNil( adjust.ICSDoseToOriginalMedication( medication, patientMedication ) );
              } )
              .value();
            if ( _.isEmpty( equalICSDose ) ) {
              return result.push( _.chain( medicationElement )
                .filter(
                {
                  chemicalType: 'laba,ICS',
                  device: patientMedication.device,
                  chemicalICS: patientMedication.chemicalICS,
                } )
                .maxBy( 'doseICS' )
                .value(),
              );
            }

            return result.push( ['discontinue:', equalICSDose, 'OR continue:', patientMedication] );
          }
          // and laba?

          return result.push( patientMedication );
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flatten()
    .value();
};

export default rule3;
