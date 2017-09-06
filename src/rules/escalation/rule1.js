import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const rule1 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, patientOriginalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          const newMedications = _.filter( _masterMedications, { chemicalType: 'laba,ICS' } );
          const onlyICS = _.chain( _patientMedications )
            .filter( _medication =>
              _medication.chemicalType === 'ltra' ||
              _medication.chemicalType === 'laba' ||
              _medication.chemicalType === 'saba' ||
              _medication.chemicalType === 'laac',
            )
            .isEmpty()
            .value();
          if ( patientMedication.chemicalType === 'ltra' && _.some( _patientMedications, { chemicalType: 'ICS' } ) ) {
            // is there supposed to be a seperate message for case ltra? or will it go under 1 ii?
            result.push( Object.assign( patientMedication, { tag: '' } ) );

            return result;
          }
          else if ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( newMedications ) && onlyICS ) {
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
                      console.log('newMedAdjust greater: ', newMedAdjust);
                      if ( _.isEmpty( toMax ) ||
                        ( toMax.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        toMax = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }
                    }
                    else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                      console.log('newMedAdjust greater: ', newMedAdjust);
                      if ( _.isEmpty( toNext ) ||
                        ( toNext.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        // ICS DOSE is same but doseICS is greater than the one stored
                        toNext = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }

                      return accResult;
                    }

                    return medication;
                  }, [] )
                  .thru( _medication => Object.assign( _medication, { tag: 'e4' } ) )
                  .value();
                console.log( 'toMax: ', toMax );
                if ( _.isEmpty( checkNewMedication ) ) {
                  console.log('checkNewMedication is empty)');
                  checkNewMedication = _.chain( equal )
                    .reduce( ( accResult, medication ) => {
                      if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                        const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                        if ( _.isEmpty( toMax ) ||
                          ( toMax.doseICS < newMedAdjust.doseICS &&
                            calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                          toMax = Object.assign( newMedAdjust, { tag: 'e4' } );

                          return accResult;
                        }
                      }
                      else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                        const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                        if ( _.isEmpty( toNext ) ||
                          ( toNext.doseICS < newMedAdjust.doseICS &&
                            calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                          // ICS DOSE is same but doseICS is greater than the one stored
                          toNext = Object.assign( newMedAdjust, { tag: 'e4' } );

                          return accResult;
                        }

                        return accResult;
                      }

                      return medication;
                    }, [] )
                    .thru( _medication => Object.assign( _medication, { tag: 'e4' } ) )
                    .value();
                }
              }
              else if ( _.isEmpty( equal ) ) {
                console.log(' equal empty');
                checkNewMedication = _.chain( chemicalICSMedications )
                  .filter( { device: patientMedication.device } )
                  .reduce( ( accResult, medication ) => {
                    // console.log( 'patientMedication newMedication: ', patientMedication, medication );
                    if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                      if ( _.isEmpty( toMax ) ||
                        ( toMax.doseICS < newMedAdjust.doseICS &&
                        calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        toMax = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }
                    }
                    else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                      if ( _.isEmpty( toNext ) ||
                        ( toNext.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        // ICS DOSE is same but doseICS is greater than the one stored
                        toNext = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }

                      return accResult;
                    }

                    return medication;
                  }, [] )
                  .thru( _medication => Object.assign( _medication, { tag: 'e4' } ) )
                  .value();
              }
              const minimization = match.minimizePuffsPerTime( [checkNewMedication, toMax, toNext] );

              return result.push( minimization );
            }
            const category = categorize.patientICSDose( patientMedication );

            return result.push( _.chain( _masterMedications )
              .reduce( ( accNewMedications, medication ) => {
                if ( medication.chemicalLABA === 'salmeterol' &&
                  medication.chemicalICS === 'fluticasone' &&
                  medication.device === 'diskus' ) {
                  accNewMedications.diskus.push( Object.assign( medication, { tag: 'e5' } ) );
                }
                else if ( medication.chemicalLABA === 'salmeterol' &&
                  medication.chemicalICS === 'fluticasone' &&
                  medication.device === 'inhaler2' ) {
                  accNewMedications.inhaler2Advair.push( Object.assign( medication, { tag: 'e5' } ) );
                }
                else if ( medication.chemicalLABA === 'formoterol' &&
                  medication.chemicalICS === 'budesonide' ) {
                  accNewMedications.inhaler2Zenhale.push( Object.assign( medication, { tag: 'e5' } ) );
                }
                else if ( medication.chemicalLABA === 'formoterol' &&
                  medication.chemicalICS === 'mometasone' ) {
                  accNewMedications.symbicort.push( Object.assign( medication, { tag: 'e5' } ) );
                }

                return accNewMedications;
              }, { diskus: [], inhaler2Advair: [], inhaler2Zenhale: [], symbicort: [] } )
              .map( ( _newMedications ) => {
                // console.log('newMedications: ', _newMedications );
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
        }, masterMedications, patientMedications );

      rule( patientOriginalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .value();
export default rule1;
