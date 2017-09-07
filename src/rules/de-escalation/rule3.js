import _ from 'lodash';
import rule2 from './rule2';
import * as adjust from '../library/adjustICSDose';
import * as calculate from '../library/calculateICSDose';
// import * as get from '../library/getICSDose';
import * as match from '../library/match';
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

        // const filterMedications = _.chain( medicationElement )
        //   .filter( findMedication => (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
        //       findMedication.name === 'flovent' &&
        //       findMedication.device === 'inhaler2'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
        //       findMedication.name === 'flovent' &&
        //       findMedication.device === 'diskus'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
        //       findMedication.name === 'pulmicort' &&
        //       findMedication.device === 'turbuhaler'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
        //       findMedication.name === 'qvar' &&
        //       findMedication.device === 'inhaler1'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
        //       findMedication.name === 'asthmanex' &&
        //       findMedication.device === 'twisthaler'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
        //       findMedication.name === 'alvesco' &&
        //       findMedication.device === 'inhaler1'
        //      ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 250 ) ) &&
        //       findMedication.name === 'advair' &&
        //       findMedication.device === 'inhaler2'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
        //       findMedication.name === 'advair' &&
        //       findMedication.device === 'diskus'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
        //       findMedication.name === 'symbicort' &&
        //       findMedication.device === 'turbuhaler'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
        //       findMedication.name === 'zenhale' &&
        //       findMedication.device === 'inhaler2'
        //     ) || (
        //     !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
        //       findMedication.name === 'arnuity' &&
        //       findMedication.device === 'ellipta'
        //     ) || (
        //       !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
        //       findMedication.name === 'breo' &&
        //       findMedication.device === 'ellipta'
        //     ) )
        //   .value();
        // console.log( 'filterMedications: ', filterMedications );
        const medicationsWithLowestDose =
          // _.chain( filterMedications )
          _.chain( medicationElement )
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
          .filter( {
            device: patientMedication.device,
          } )
          .value();
        // console.log( 'medicationsWithLowestDose: ', medicationsWithLowestDose );
        const notOnSMART = _.chain( originalMedications )
          .filter( { name: 'symbicort', function: 'controller,reliever' } )
          .isEmpty()
          .value();

        if ( !check ) {
          if ( !_.isEmpty( _.filter( medicationsWithLowestDose,
              _medication => calculate.patientICSDose( patientMedication ) > calculate.ICSDose( _medication ) ) ) ) {
            if ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( isLaba ) ) {
              const sameChemicalLabaAndIcs = _.chain( medicationsWithLowestDose )
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
                .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                .value();
              // console.log( 'fifty: ', fifty );
              if ( _.isEmpty( sameChemicalLabaAndIcs ) && _.isEmpty( fifty ) ) {
                // de-escalation rule 2 and continue laba medication
                const getRecommendationFromRule2 = rule2( [patientMedication], medicationElement );
                // add tag: d5
                // console.log('frome rule2');
                if ( _.isEmpty( getRecommendationFromRule2 ) ) {
                  return result.push( Object.assign( isLaba[0], { tag: 'd5' } ) );
                }
                result.push( Object.assign( getRecommendationFromRule2[0], { tag: 'd5' } ) );
                result.push( Object.assign( isLaba[0], { tag: 'd5' } ) );

                return result;
              }

              return result.push( Object.assign( fifty, { maxPuffPerTime: 1, tag: 'd4' } ) );
            }
            else if ( patientMedication.chemicalType === 'laba,ICS' ) {
              const sameChemicalLabaAndIcs = _.chain( medicationsWithLowestDose )
                .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                    masterMedication.chemicalICS === patientMedication.chemicalICS &&
                    masterMedication.chemicalLABA === patientMedication.chemicalLABA )
                .value();
              // console.log( 'laba,ICS sameChemicalLabaAndIcs: ', sameChemicalLabaAndIcs );

              // add tag: d6
              const operationTotalDoseReduction = totalDoseReduction( patientMedication, sameChemicalLabaAndIcs );

              return result.push( Object.assign( operationTotalDoseReduction, { tag: 'd6' } ) );
            }
          }
          // console.log( 'smaller than lowest dose' );
          if ( ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( isLaba ) ) ||
            patientMedication.chemicalType === 'laba,ICS' ) {
            if ( notOnSMART ) {
              // not on smart
              if ( patientMedication.chemicalType === 'ICS' ) {
                // discontinue laba medication
                // add tag: d7
                return result.push( 'statement 3 b a i And ii',
                  Object.assign( patientMedication,
                    {
                      maxPuffPerTime: patientMedication.puffPerTime,
                      timesPerDay: patientMedication.timesPerDay,
                      tag: 'd7',
                    } ),
                  Object.assign( isLaba[0], { tag: 'd7' } ),
                );
              }
              else if ( patientMedication.chemicalType === 'laba,ICS' ) {
                // recommend medication with same chemicalICS as original Medication
                // console.log( 'laba,ICS' );
                const equalICSDose = _.chain( medicationElement )
                  .filter(
                  {
                    chemicalType: 'ICS',
                    device: patientMedication.device,
                    chemicalICS: patientMedication.chemicalICS,
                  } )
                  .filter( _medication =>
                    adjust.ICSDoseToOriginalMedication( _medication, patientMedication ) !== [] &&
                    _medication.doseICS === patientMedication.doseICS )
                  .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                  .value();
                if ( _.isEmpty( equalICSDose ) ) {
                  // add tag: d8
                  return result.push( _.chain( medicationElement )
                    .filter(
                    {
                      chemicalType: 'ICS',
                      device: patientMedication.device,
                      chemicalICS: patientMedication.chemicalICS,
                    } )
                    .filter( nextHigherMedication =>
                      adjust.ICSHigherNext( nextHigherMedication, patientMedication ) !== [] )
                    .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                    .thru( _medication => Object.assign( _medication, { tag: 'd7' } ) )
                    .value(),
                  );
                }
                // const getHighestDose = get.highestICSDose( equalICSDose );

                return result.push( 'statement 3 b a i And ii',
                  // Object.assign( getHighestDose, { tag: 'd7' } ),
                  Object.assign( equalICSDose, { tag: 'd7' } ) );
                // has to be presented as an option
              }
            }
            // on SMART
            // console.log('onSmart');
            const avgUseOfRescuePuff = asthmaControlAnswers[0].rescuePuffer;
            if ( avgUseOfRescuePuff === '0' ) {
              // console.log( 'rescue puffer: 0' );
              const reliever = _.chain( originalMedications )
                .filter( _medication =>
                  _medication.name !== 'symbicort' && _medication.function === 'controller,reliever' )
                .isEmpty()
                .value();
              // console.log( 'reliever: ', reliever );
              if ( reliever ) {
                result.push( 'reliever(s):', _.chain( medicationElement )
                  .filter( _medication =>
                    _medication.name !== 'symbicort' && _medication.function === 'controller,reliever' )
                  .map( _reliever => Object.assign( _reliever, { tag: 'd8' } ) )
                  .value(),
                );
              }
              const equalICSDose = _.chain( medicationElement )
                .filter(
                {
                  chemicalType: 'ICS',
                  device: patientMedication.device,
                  chemicalICS: patientMedication.chemicalICS,
                } )
                .filter( _medication =>
                  adjust.ICSDoseToOriginalMedication( _medication, patientMedication ) !== [] &&
                  _medication.doseICS === patientMedication.doseICS )
                .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                .value();
              // console.log( 'equalICSDose: ', equalICSDose );
              if ( _.isEmpty( equalICSDose ) ) {
                // console.log( 'equalICSDose empty' );

                // add tag
                return result.push( _.chain( medicationElement )
                  .filter(
                  {
                    chemicalType: 'ICS',
                    device: patientMedication.device,
                    chemicalICS: patientMedication.chemicalICS,
                  } )
                  .filter( nextHigherMedication =>
                    adjust.ICSHigherNext( nextHigherMedication, patientMedication ) !== [] )
                  .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                  .thru( addTag => Object.assign( addTag, { tag: 'd8' } ) )
                  .value(),
                );
              }
              // const getHighestDose = get.highestICSDose( equalICSDose );

              return result.push( 'statement 3 b b1',
               //  Object.assign( getHighestDose, { tag: 'd8' } ),
                Object.assign( equalICSDose, { tag: 'd8' } ) );
            }
            else if ( avgUseOfRescuePuff === '1' || avgUseOfRescuePuff === '2' || avgUseOfRescuePuff === '3' ) {
              return result.push( 'statement 3 b b2',
                Object.assign( patientMedication, { maxPuffPerTime: patientMedication.puffPerTime, tag: 'd9' } ),
                Object.assign( isLaba[0], { tag: 'd9' } ) );
            }
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
