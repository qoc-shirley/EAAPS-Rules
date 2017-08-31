import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

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
            const category = categorize.patientICSDose( patientMedication );

            return result.push( _.chain( _masterMedications )
              .reduce( ( accNewMedications, medication ) => {
                if ( medication.chemicalLABA === 'salmeterol' &&
                  medication.chemicalICS === 'fluticasone' &&
                  medication.device === 'diskus' ) {
                  accNewMedications.diskus.push( medication );
                }
                else if ( medication.chemicalLABA === 'salmeterol' &&
                  medication.chemicalICS === 'fluticasone' &&
                  medication.device === 'inhaler2' ) {
                  accNewMedications.inhaler2Advair.push( medication );
                }
                else if ( medication.chemicalLABA === 'formoterol' &&
                  medication.chemicalICS === 'budesonide' ) {
                  accNewMedications.inhaler2Zenhale.push( medication );
                }
                else if ( medication.chemicalLABA === 'formoterol' &&
                  medication.chemicalICS === 'mometasone' ) {
                  accNewMedications.symbicort.push( medication );
                }

                return accNewMedications;
              }, { diskus: [], inhaler2Advair: [], inhaler2Zenhale: [], symbicort: [] } )
              .map( ( _newMedications ) => {
                console.log('newMedications: ', _newMedications );
                if ( category === 'excessive' ) {
                  const findLowestOrHighestMedication = _.chain( _newMedications )
                    .filter( _medication => categorize.ICSDose( _medication ) === category &&
                      adjust.ICSDose( _medication, 'highest' ) !== [] )
                    .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                    .value();
                  if ( _.isEmpty( findLowestOrHighestMedication ) ) {
                    return _.chain( _newMedications )
                      .filter( _medication => adjust.ICSDose( _medication, 'highest' ) !== [] )
                      .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                      .value();
                  }
                }
                const findLowestOrHighestMedication = _.chain( _newMedications )
                  .filter( _medication => categorize.ICSDose( _medication ) === category &&
                    adjust.ICSDose( _medication, category ) !== [] )
                  .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                  .value();
                if ( _.isEmpty( findLowestOrHighestMedication ) ) {
                  return _.chain( _newMedications )
                    .filter( _medication => adjust.ICSDose( _medication, category ) !== [] )
                    .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                    .value();
                }

                return findLowestOrHighestMedication;
              } )
              .value(),
            );
          }

          return result;
        }, masterMedications );

      rule( patientOriginalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .value();
export default rule1;
