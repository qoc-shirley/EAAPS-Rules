import _ from 'lodash';
import * as get from '../library/getICSDose';
import * as calculate from '../library/calculateICSDose';

const rule3 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        const check = _.chain( originalMedications )
          .filter( ( labaICSMedication ) => {
            return ( labaICSMedication.chemicalType === 'laba,ICS' ||
              ( labaICSMedication.chemicalType === 'laba' &&
                _.some( originalMedications, { chemicalType: 'ICS' } ) ) ) &&
                !_.some( originalMedications, { chemicalType: 'ICS' } );
          } )
          .isEmpty()
          .value();

        const isLaba = _.filter( check,  { chemicalType: 'laba' } )
        const laba = _.find( isLaba, { chemicalType: 'laba' } );

        const compareLowestDose = _.chain( medicationElement )
          .filter( ( findMedication ) => {
            return (
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'asthmanex' &&
              findMedication.device === 'twisthaler' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'advair' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '250'
              ) || (
              findMedication.name === 'advair' &&
              findMedication.device === 'diskus' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'symbicort' &&
              findMedication.device === 'turbuhaler' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'zenhale' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '200'
              ) || (
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '100'
              ) || (
              findMedication.name === 'breo' &&
              findMedication.device === 'ellipta' &&
              findMedication.doseICS === '100'
            );
          } )
          .thru( get.lowestICSDose )
          .value();

        const onSMART = _.chain( originalMedications )
          .filter( { name: 'symbicort', function: 'controller,reliever' } )
          .isEmpty()
          .value();

        if ( !check ) {
          if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( compareLowestDose ) ) {
            if ( patientMedication.chemicalType === 'ICS' ) {
              const sameChemicalLabaAndIcs = _.chain( medicationElement )
                .filter( ( masterMedication ) => {
                  return masterMedication.chemicalType === 'laba,ICS' &&
                    masterMedication.chemicalICS === patientMedication.chemicalICS &&
                    _.filter( isLaba, ( medication ) => {
                      return masterMedication.chemicalLABA === medication.chemicalLABA;
                    } );
                } )
                .value();
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
              }

              return result.push( fifty );
            }
            else if ( patientMedication.chemicalType === 'laba,ICS' ) {
              if ( onSMART ) {
                // not on smart
              }
            }
          }
          if ( onSMART ) {
            // not on smart
          }
        }
      }, masterMedications, patientMedications );
      rule( medication );

      return result.push( rule );
    }, [] )
    .value();
};

export default rule3;