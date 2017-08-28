import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';

const rule1 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, patientOriginalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, patientMedication ) => {
          const newMedications = _.filter( _masterMedications, { chemicalType: 'laba,ICS' } );
          if ( patientMedication.chemicalType === 'ltra' ) {
            result.push( patientMedication );

            return result;
          }
          else if ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( newMedications ) ) {
            const chemicalICSMedications = _.chain( newMedications )
              .filter( { chemicalICS: patientMedication.chemicalICS } )
              .value();
            // console.log('chemicalICSMedications: ', chemicalICSMedications);
            const equal = _.chain( chemicalICSMedications )
              .filter( medication =>
                // console.log('getEqual: ',  adjust.ICSDoseToOriginalMedication( medication, patientMedication ));
                 !_.isEmpty( adjust.ICSDoseToOriginalMedication( medication, patientMedication ) ) )
              .value();
            // console.log('equal: ', equal);
            if ( !_.isEmpty( chemicalICSMedications ) ) {
              let toMax = [];
              let toNext = [];
              let checkNewMedication;
              if ( !_.isEmpty( equal ) ) {
                checkNewMedication = _.chain( equal )
                  .filter( { device: patientMedication.device } )
                  .reduce( ( accResult, medication ) => {
                    if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                      // console.log('newMedAdjust: ', newMedAdjust);
                      if ( _.isEmpty( toMax ) ||
                        ( toMax.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        toMax = newMedAdjust;

                        return accResult;
                      }
                    }
                    else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                      if ( _.isEmpty( toNext ) ||
                        ( toNext.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        // ICS DOSE is same but doseICS is greater than the one stored
                        toNext = newMedAdjust;

                        return accResult;
                      }

                      return accResult;
                    }

                    return medication;
                  }, [] )
                  .thru( medication => medication )
                  .value();
                if ( _.isEmpty( checkNewMedication ) ) {
                  checkNewMedication = _.chain( equal )
                    .reduce( ( accResult, medication ) => {
                      if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                        const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                        if ( _.isEmpty( toMax ) ||
                          ( toMax.doseICS < newMedAdjust.doseICS &&
                            calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                          toMax = newMedAdjust;

                          return accResult;
                        }
                      }
                      else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                        const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                        if ( _.isEmpty( toNext ) ||
                          ( toNext.doseICS < newMedAdjust.doseICS &&
                            calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                          // ICS DOSE is same but doseICS is greater than the one stored
                          toNext = newMedAdjust;

                          return accResult;
                        }

                        return accResult;
                      }

                      return medication;
                    }, [] )
                    .thru( medication => medication )
                    .value();
                }
              }
              else if ( _.isEmpty( equal ) ) {
                // console.log('empty');
                checkNewMedication = _.chain( chemicalICSMedications )
                  .filter( { device: patientMedication.device } )
                  .reduce( ( accResult, medication ) => {
                    // console.log( 'patientMedication newMedication: ', patientMedication, medication );
                    if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                      if ( _.isEmpty( toMax ) ||
                        ( toMax.doseICS < newMedAdjust.doseICS &&
                        calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        toMax = newMedAdjust;

                        return accResult;
                      }
                    }
                    else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                      if ( _.isEmpty( toNext ) ||
                        ( toNext.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        // ICS DOSE is same but doseICS is greater than the one stored
                        toNext = newMedAdjust;

                        return accResult;
                      }

                      return accResult;
                    }

                    return medication;
                  }, [] )
                  .thru( medication => medication )
                  .value();
              }

              return result.push( [checkNewMedication, toMax, toNext] );
            }

            result.push(
                _.chain( _masterMedications )
                  .filter( medication => (
                      medication.chemicalLABA === 'salmeterol' &&
                      medication.chemicalICS === 'fluticasone' &&
                      medication.device === 'diskus'
                    ) || (
                      medication.chemicalLABA === 'salmeterol' &&
                      medication.chemicalICS === 'fluticasone' &&
                      medication.device === 'inhaler2'
                    ) || (
                      medication.chemicalLABA === 'formoterol' &&
                      medication.chemicalICS === 'budesonide'
                    ) || (
                      medication.chemicalLABA === 'formoterol' &&
                      medication.chemicalICS === 'mometasone'
                    ) )
                  .reduce( ( accMedicationCategory, medication ) => {
                    const category = categorize.ICSDose( medication );

                    if ( _.isNil( accMedicationCategory[category] ) ) {
                      if ( category === 'excessive' ) {
                        // eslint-disable-next-line no-param-reassign
                        accMedicationCategory[category] = adjust.ICSDose( medication, 'highest' );
                      }
                      // eslint-disable-next-line no-param-reassign
                      accMedicationCategory[category] = Object.assign( medication, { maxPuffPerTime: 1 } );
                    }

                    else if ( category === 'excessive' &&
                        calculate.ICSDose( accMedicationCategory[category] ) <= calculate.ICSDose( medication ) ) {
                      // eslint-disable-next-line no-param-reassign
                      accMedicationCategory[category] = adjust.ICSDose( medication, 'highest' );
                    }
                    else if ( calculate.ICSDose( accMedicationCategory[category] ) >
                        calculate.ICSDose( medication ) ) {
                      // eslint-disable-next-line no-param-reassign
                      accMedicationCategory[category] = Object.assign( medication, { maxPuffPerTime: 1 } );
                        // console.log('categories: ', accMedicationCategory);
                    }

                    return accMedicationCategory;
                  }, {} )
                  .thru( list => list[categorize.patientICSDose( patientMedication )] || [] )
                  .value(),
              );
          }

          return result;
        }, masterMedications );

      rule( patientOriginalMedication );

      return result;
    }, [] )
    .flatten()
    .value();
export default rule1;
