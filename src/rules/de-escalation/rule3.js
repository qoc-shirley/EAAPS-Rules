import _ from 'lodash';
import rule2 from './rule2';
import * as adjust from '../library/adjustICSDose';
import * as calculate from '../library/calculateICSDose';
import * as get from '../library/getICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule3 = ( patientMedications, masterMedications, questionnaireAnswers ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, asthmaControlAnswers, patientMedication ) => {
        const check = _.chain( originalMedications )
          .filter( labaICSMedication => labaICSMedication.chemicalType === 'laba,ICS' ||
              ( labaICSMedication.chemicalType === 'laba' &&
                _.some( originalMedications, { chemicalType: 'ICS' } ) ) )
          .isEmpty()
          .value();

        const isLaba = _.filter( originalMedications, { chemicalType: 'laba' } );
        const laba = _.find( isLaba, { chemicalType: 'laba' } );

        const filterMedications = _.chain( medicationElement )
          .filter( findMedication => (
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
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1'
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
            !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'arnuity' &&
              findMedication.device === 'ellipta'
            ) || (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'breo' &&
              findMedication.device === 'ellipta'
            ) )
          .value();
        // console.log( 'filterMedications: ', filterMedications );
        const compareLowestDose = _.chain( filterMedications )
          .filter(
          {
            device: patientMedication.device,
          } )
          .value();
        // console.log( 'compareLowestDose: ', compareLowestDose );
        const notOnSMART = _.chain( originalMedications )
          .filter( { name: 'symbicort', function: 'controller,reliever' } )
          .isEmpty()
          .value();

        if ( !check ) {
          if ( !_.isEmpty( _.filter( compareLowestDose,
              _medication => calculate.patientICSDose( patientMedication ) > calculate.ICSDose( _medication ) ) ) ) {
            if ( patientMedication.chemicalType === 'ICS' ) {
              const sameChemicalLabaAndIcs = _.chain( compareLowestDose )
                .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                    masterMedication.chemicalICS === patientMedication.chemicalICS &&
                    masterMedication.chemicalLABA === laba.chemicalLABA )
                .value();
              // console.log( 'sameChemicalLabaAndIcs: ', sameChemicalLabaAndIcs );
              const fifty = _.chain( sameChemicalLabaAndIcs )
                .filter( _medication =>
                    calculate.ICSDose( _medication ) >= calculate.patientICSDose( patientMedication ) / 2 &&
                    calculate.ICSDose( _medication ) < calculate.patientICSDose( patientMedication ) )
                .filter( _medication =>
                  _medication.device === patientMedication.device || _medication.device === laba.device )
                .thru( convert => _.map( convert, convertEach => Object.assign( convertEach,
                  {
                    doseICS: _.toInteger( convertEach.doseICS ),
                    maxPuffPerTime: 1,
                  } ) ) )
                .maxBy( 'doseICS' )
                .value();
              // console.log( 'fifty: ', fifty );
              if ( _.isEmpty( sameChemicalLabaAndIcs ) && _.isEmpty( fifty ) ) {
                // de-escalation rule 2 and continue laba medication
                result.push( rule2( [patientMedication], medicationElement ) );
                result.push( isLaba );

                return result;
              }

              return result.push( fifty );
            }
            else if ( patientMedication.chemicalType === 'laba,ICS' ) {
              const sameChemicalLabaAndIcs = _.chain( compareLowestDose )
                .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                    masterMedication.chemicalICS === patientMedication.chemicalICS &&
                    masterMedication.chemicalLABA === patientMedication.chemicalLABA )
                .value();
              // console.log( 'laba,ICS sameChemicalLabaAndIcs: ', sameChemicalLabaAndIcs );

              return result.push( totalDoseReduction( patientMedication, sameChemicalLabaAndIcs ) );
            }
          }
          // console.log( 'smaller than lowest dose' );
          if ( patientMedication.chemicalType === 'ICS' || patientMedication.chemicalType === 'laba,ICS' ) {
            if ( notOnSMART ) {
              // not on smart
              if ( patientMedication.chemicalType === 'ICS' ) {
                // discontinue laba medication
                return result.push(
                  Object.assign( patientMedication,
                    {
                      maxPuffPerTime: patientMedication.puffPerTime,
                      timesPerDay: patientMedication.timesPerDayValue,
                    } ),
                );
              }
              else if ( patientMedication.chemicalType === 'laba,ICS' ) {
                // recommend medication with same chemicalICS as original Medication
                // console.log( 'laba,ICS' );
                const equalICSDose = _.chain( medicationElement )
                  .filter(
                  {
                    chemicalType: 'laba,ICS',
                    device: patientMedication.device,
                    chemicalICS: patientMedication.chemicalICS,
                  } )
                  .filter( _medication =>
                    !_.isNil( adjust.ICSDoseToOriginalMedication( _medication, patientMedication ) ) )
                  .value();
                if ( _.isEmpty( equalICSDose ) ) {
                  return result.push( _.chain( medicationElement )
                    .filter(
                    {
                      chemicalType: 'laba,ICS',
                      device: patientMedication.device,
                      chemicalICS: patientMedication.chemicalICS,
                    } )
                    .filter( nextHigherMedication =>
                      adjust.ICSHigherNext( nextHigherMedication, patientMedication ) !== [] )
                    .thru( convert => _.map( convert,
                        convertEach => Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } ) ) )
                    .maxBy( 'doseICS' )
                    .value(),
                  );
                }

                return result.push(
                  [
                    'discontinue:',
                    get.highestICSDose( equalICSDose ),
                    'OR continue:',
                    patientMedication,
                  ] );
                // has to be presented as an option
              }
            }
            // on SMART
            const questionThree = asthmaControlAnswers[0].rescuePuffer;
            if ( questionThree === '0' ) {
              // console.log( 'rescue puffer: 0' );
              const reliever = _.chain( originalMedications )
                .filter( _medication =>
                  _medication.name !== 'symbicort' && _medication.function === 'controller,reliever' )
                .isEmpty()
                .value();
              // console.log( 'reliever: ', reliever );
              if ( reliever ) {
                result.push( _.chain( medicationElement )
                  .filter( _medication =>
                    _medication.name !== 'symbicort' && _medication.function === 'controller,reliever' )
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
                .filter( _medication =>
                  !_.isNil( adjust.ICSDoseToOriginalMedication( _medication, patientMedication ) ) )
                .value();
              // console.log( 'equalICSDose: ', equalICSDose );
              if ( _.isEmpty( equalICSDose ) ) {
                // console.log( 'equalICSDose empty' );

                return result.push( _.chain( medicationElement )
                  .filter(
                  {
                    chemicalType: 'laba,ICS',
                    device: patientMedication.device,
                    chemicalICS: patientMedication.chemicalICS,
                  } )
                  .filter( nextHigherMedication =>
                    adjust.ICSHigherNext( nextHigherMedication, patientMedication ) !== [] )
                  .thru( convert => _.map( convert,
                      convertEach => Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } ) ) )
                  .maxBy( 'doseICS' )
                  .value(),
                );
              }

              return result.push(
                [
                  'discontinue:',
                  get.highestICSDose( equalICSDose ),
                  'OR continue:',
                  patientMedication,
                ] );
            }

            return result.push( [patientMedication, laba] );
          }
        }

        return result;
      }, masterMedications, patientMedications, questionnaireAnswers );
      rule( medication );

      return result;
    }, [] )
    .flatten()
    .value();

export default rule3;
