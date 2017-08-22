import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';

const rule5 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, patientMedications, patientMedication ) => {
          const originalMedicationLtra = _.filter( patientMedications, { chemicalType: 'ltra' } );
          const originalMedicationLaba = _.filter( patientMedications, { chemicalType: 'laba' } );
          const filterOrgMeds = _.filter( patientMedications, ( medication ) => {
            return medication.name !== 'symbicort' &&
              (
                medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' &&
                  calculate.patientICSDose( medication ) < medication.maxGreenICS )
              );
          } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' && patientMedication.name !== 'symbicort' &&
               calculate.patientICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) &&
           !_.isEmpty( originalMedicationLtra ) ) {
            const recommendHighest = _.chain( _masterMedications )
              .filter( ( sameMedication ) => {
                return sameMedication.chemicalType === patientMedication.chemicalType &&
                  sameMedication.name === patientMedication.name &&
                  sameMedication.device === patientMedication.device;
              } )
              .filter( ( adjustToMax ) => {
                return adjust.ICSDose( adjustToMax, 'highest' );
              } )
              .thru( ( convert ) => {
                return _.map( convert, ( convertEach ) => {
                  return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                } );
              } )
              .maxBy( 'doseICS' )
              .value();
            console.log('recommendHighest: ', recommendHighest);
            result.push( originalMedicationLtra );
            if ( _.isEmpty( recommendHighest ) ) {
              return result.push( _.chain( _masterMedications )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'laba,ICS' &&
                    ( adjust.ICSDose( medication, 'highest' ) !== [] ) &&
                    medication.device === patientMedication.device;
                } )
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
                .thru( ( medication ) => {
                  return adjust.ICSDoseToMax( medication );
                } )
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
              .filter( ( masterMedication ) => {
                return masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                  _.filter( isLaba, ( medication ) => {
                    return masterMedication.chemicalLABA === medication.chemicalLABA;
                  } );
              } )
              .value();

            const isfilteredMedicationDevice = _.chain( filteredMedication )
              .filter( ( medication ) => {

                return medication.device === patientMedication.device ||
                  medication.device === laba.device;
              })
              .value();
            if ( _.isEmpty( filteredMedication ) || _.isEmpty( isfilteredMedicationDevice ) ) {
              result.push( [originalMedicationLtra, originalMedicationLaba] );

              return result.push(
                _.chain( _masterMedications )
                  .filter( ( medication ) => {
                    return medication.chemicalType === 'ICS' &&
                      medication.name === patientMedication.name &&
                      ( adjust.ICSDose( medication, 'highest' ) !== [] ) &&
                      ( medication.timesPerDay === patientMedication.timesPerDay ||
                        medication.timesPerDay === '1 OR 2' ) &&
                      ( medication.device === patientMedication.device || medication.device === laba.device );
                  } )
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
              .thru( ( convert ) => {
                return _.map( convert, ( convertEach ) => {
                  return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                } );
              } )
              .maxBy( 'doseICS' )
              .value(),
            );
            result.push( originalMedicationLtra );

            return result;
          }
          else if ( patientMedication.name === 'symbicort' && _.some( patientMedications, { chemicalType: 'ltra' } ) ) {
            result.push( ['SMART',
              _.filter(
                _masterMedications,
                {
                  name: 'symbicort',
                  function: 'controller,reliever',
                  din: patientMedication.din,
                } )],
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
};

export default rule5;
