import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';

const rule5 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( medicationElement, medications, patientMedication ) => {
          const originalMedicationLtra = _.filter( medications, { chemicalType: 'ltra' } );
          const originalMedicationLaba = _.filter( medications, { chemicalType: 'laba' } );
          const filterOrgMeds = _.filter( medications, ( medication ) => {
            return medication.name !== 'symbicort' &&
              (
                medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' &&
                  calculate.patientICSDose( medication ) < medication.maxGreenICS )
              );
          } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' &&
               calculate.patientICSDose( patientMedication ) < patientMedication.maxGreenICS ) {
            const recommendHighest = adjust.ICSDose( patientMedication, 'highest' );
            result.push( originalMedicationLtra );
            if ( _.isEmpty( recommendHighest ) ) {
              return result.push( _.chain( medicationElement )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'laba,ICS' &&
                    ( adjust.ICSDose( medication, 'highest' ) !== [] ) &&
                    medication.device === patientMedication.device;
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
            result.push( recommendHighest );

            return result;
          }
          else if ( ( patientMedication.chemicalType === 'ICS' &&
                      calculate.patientICSDose( patientMedication ) < patientMedication.maxGreenICS ) &&
                    !_.isEmpty( isLaba )
                  ) {
            const laba = _.find(isLaba, {chemicalType: 'laba'});
            const filteredMedication = _.chain( medicationElement )
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
              result.push( originalMedicationLtra );
              result.push( originalMedicationLaba );

              return result.push(
                _.chain( medicationElement )
                  .filter( ( medication ) => {
                    return medication.chemicalType === 'ICS' &&
                      medication.name === patientMedication.name &&
                      ( adjust.ICSDose(medication, 'highest') !== [] ) &&
                      ( medication.device === patientMedication.device || medication.device === laba.device );
                  })
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
                  } )
                  .thru( medication => medication.high )
                  .value(),
              );
            }
            result.push( _.chain( isfilteredMedicationDevice )
              .maxBy( 'doseICS' )
              .value(),
            );
            result.push( originalMedicationLtra) ;

            return result;
          }
          else if ( patientMedication.name === 'symbicort' && _.some( medications, { chemicalType: 'ltra' } ) ) {
            result.push(
              _.filter(
                medicationElement,
                {
                  name: 'symbicort',
                  function: 'controller,reliever',
                  din: patientMedication.din,
                } ),
            );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( originalMedication );

      return result;
    }, [] )
    .flatten()
    .uniqBy( 'id' )
    .value();
};

export default rule5;
