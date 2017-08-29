/* eslint-disable no-param-reassign */
import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const rule5 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          // console.log('master medications: ', _masterMedications);
          const originalMedicationLtra = _.filter( _patientMedications, { chemicalType: 'ltra' } );
          const originalMedicationLaba = _.filter( _patientMedications, { chemicalType: 'laba' } );
          const filterOrgMeds = _.filter( _patientMedications, medication => medication.name !== 'symbicort' &&
              (
                medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' &&
                  calculate.patientICSDose( medication ) < _.toInteger( medication.maxGreenICS ) )
              ) );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' && patientMedication.name !== 'symbicort' &&
               calculate.patientICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) &&
           !_.isEmpty( originalMedicationLtra ) ) {
            const recommendHighest = _.chain( _masterMedications )
              .filter( sameMedication => sameMedication.chemicalType === patientMedication.chemicalType &&
                  sameMedication.name === patientMedication.name &&
                  sameMedication.device === patientMedication.device )
              .filter( adjustToMax =>
                 adjust.ICSDose( adjustToMax, 'highest' ) !== [] )
              .thru( _medication => match.minimizePuffsPerTime( _medication ) )
              .value();
            // console.log('recommendHighest: ', recommendHighest);
            result.push( originalMedicationLtra );
            if ( _.isEmpty( recommendHighest ) ) {
              return result.push( _.chain( _masterMedications )
                .filter( medication => medication.chemicalType === 'laba,ICS' &&
                    ( adjust.ICSDose( medication, 'highest' ) !== [] ) &&
                    medication.device === patientMedication.device )
                .reduce( ( accResult, medication ) => {
                  if ( _.isNil( accResult.high ) ) {
                    return Object.assign(
                      accResult,
                      {
                        high: medication,
                      },
                    );
                  }
                  else if ( accResult.high.doseICS <= medication.doseICS ) {
                    return Object.assign(
                      accResult,
                      {
                        high: medication,
                      },
                    );
                  }

                  return accResult;
                }, [] )
                .thru( medication => medication.high )
                .thru( medication => adjust.ICSDose( medication, 'highest' ) )
                .value(),
              );
            }
            result.push( recommendHighest );

            return result;
          }
          else if ( ( patientMedication.chemicalType === 'ICS' &&
                      calculate.patientICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) ) &&
                    !_.isEmpty( isLaba ) && !_.isEmpty( originalMedicationLtra )
                  ) {
            const laba = _.find( isLaba, { chemicalType: 'laba' } );
            const filteredMedication = _.chain( _masterMedications )
              .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                  _.filter( isLaba, medication => masterMedication.chemicalLABA === medication.chemicalLABA ) )
              .value();

            const isfilteredMedicationDevice = _.chain( filteredMedication )
              .filter( medication => medication.device === patientMedication.device ||
                  medication.device === laba.device )
              .value();
            if ( _.isEmpty( filteredMedication ) || _.isEmpty( isfilteredMedicationDevice ) ) {
              result.push( [originalMedicationLtra, originalMedicationLaba] );

              return result.push(
                _.chain( _masterMedications )
                  .filter( medication => medication.chemicalType === 'ICS' &&
                      medication.name === patientMedication.name &&
                      ( adjust.ICSDose( medication, 'highest' ) !== [] ) &&
                      ( medication.timesPerDay === patientMedication.timesPerDay ||
                        medication.timesPerDay === '1 OR 2' ) &&
                      ( medication.device === patientMedication.device || medication.device === laba.device ) )
                  .reduce( ( accResult, medication ) => {
                    if ( _.isNil( accResult.high ) ) {
                      accResult.high = medication;

                      return accResult;
                    }
                    else if ( accResult.high.doseICS <= medication.doseICS ) {
                      accResult.high = medication;

                      return accResult;
                    }

                    return accResult;
                  }, [] )
                  .thru( medication => medication.high )
                  .value(),
              );
            }
            result.push( _.chain( isfilteredMedicationDevice )
              .thru( _medication => match.minimizePuffsPerTime( _medication ) )
              .value(),
            );
            result.push( originalMedicationLtra );

            return result;
          }
          else if ( patientMedication.name === 'symbicort' &&
            _.some( _patientMedications, { chemicalType: 'ltra' } ) ) {
            result.push( ['SMART',
                Object.assign( patientMedication, { maxPuffPerTime: patientMedication.puffPerTime } )],
            );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( originalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .uniqBy( 'id' )
    .value();

export default rule5;
