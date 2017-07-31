import _ from 'lodash';
import * as categorize from '../library/categorizeDose';
import * as get from '../library/getICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const minimizePuffsPerTime = ( medications, minimizeMedicationsPuffs ) => {
  const minimize = _.filter( medications, ( medication ) => {
    return medication.doseICS > minimizeMedicationsPuffs.doseICS;
  } );
  if ( _.isEmpty( minimize ) ) {
    return null;
  }
  else if ( _.size( minimize ) > 1 ) {
    return _.maxBy( minimize, 'doseICS' );
  }

  return minimize;
};

const rule3 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( medicationElement, medications, patientMedication ) => {
          const filterOrgMeds = _.filter( medications, ( medication ) => {
            return medication.name !== 'symbicort' &&
              (
                ( medication.chemicalType === 'laba,ICS' && categorize.patientICSDose( medication ) === 'low' ) ||
                medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' && categorize.patientICSDose( medication ) === 'low' )
              );
          } );
          // console.log("filterOrgMeds: ", filterOrgMeds);
          const isLabaICS = _.filter( filterOrgMeds, { chemicalType: 'laba,ICS' } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          const isICS = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );
          if ( !_.isEmpty( isLabaICS ) || ( !_.isEmpty( isLaba ) && !_.isEmpty( isICS ) ) ) {
            if ( patientMedication.chemicalType === 'laba,ICS' ) {

              const tryTimesPerDay = match.timesPerDay(isLabaICS, patientMedication);

              if (!_.isEmpty(tryTimesPerDay)) {
                // console.log("tryTimes");
                const tryDoseICS = match.doseICS(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryDoseICS)) {
                  // console.log("tryDose");
                  result.push(tryDoseICS);
                }
                const tryMinimizePuffs = match.minimizePuffsPerTime(tryTimesPerDay, patientMedication);
                if (!_.isEmpty(tryMinimizePuffs)) {
                  // console.log("tryPuffs");
                  result.push(tryMinimizePuffs);
                }
                result.push(tryTimesPerDay);
              }
              result.push(isLabaICS);
            }

            else if ( patientMedication.chemicalType === 'laba' && !_.isEmpty( isICS ) ) {
              // console.log("laba and ICS");
              // const filteredMedication = _.filter( medicationElement, ( masterMedication ) => {
              //   return masterMedication.chemicalType === 'laba,ICS' &&
              //     ( _.filter( isLaba, ( medication ) => {
              //       return masterMedication.chemicalLABA === medication.chemicalLABA;
              //     } ) && _.filter( isICS, ( medication ) => {
              //       return masterMedication.chemicalICS === medication.chemicalICS;
              //     } )
              //     );
              // } );
              //  // console.log("FilteredNewMedicaiton: ", filteredMedication);
              //
              // if ( !_.isEmpty( filteredMedication ) ) {
              //   // console.log("filteredMedication: ", filteredMedication);
              //
              //   const getDeviceIcsOrLaba = _.filter( filteredMedication, ( medication ) => {
              //     return ( medication.device === isLaba.device ) || ( medication.device === isICS.device );
              //   } );
              //   const getICSDevice = _.filter( filteredMedication, ( medication ) => {
              //     return medication.device === isICS.device;
              //   } );
              //   const getLabaDevice = _.filter( filteredMedication, ( medication ) => {
              //     return medication.device === isLaba.device;
              //   } );

              const sameChemicalLabaAndIcs = _.chain( medicationElement )
                .filter( ( masterMedication ) => {
                  return masterMedication.chemicalType === 'laba,ICS' &&
                    ( _.chain( isLaba )
                        .filter( ( medication ) => {
                          return masterMedication.chemicalLABA === medication.chemicalLABA;
                        } )
                    ) &&
                    ( _.chain( isICS )
                        .filter( ( medication ) => {
                          return masterMedication.chemicalICS === medication.chemicalICS;
                        } )
                    );
                } )
                .value();

              const getDeviceIcsOrLaba = _.chain( sameChemicalLabaAndIcs )
                .reduce( ( accResult, medication ) => {
                  if ( medication.device === patientMedication.device ) {
                    accResult.laba = medication;
                  }

                  accResult.ics = _.chain( isICS )
                    .filter( ( icsMedication ) => {
                      return medication.device === icsMedication.device;
                    } );

                  return accResult;
                }, [] )
                .value();

              if ( !_.isEmpty( getDeviceIcsOrLaba ) && !_.isEmpty( sameChemicalLabaAndIcs ) ) {
                // console.log("match device?");
                if ( !_.isEmpty( getDeviceIcsOrLaba.ics ) && _.size( getDeviceIcsOrLaba.ics ) >= 2 ) {
                  // console.log("match ics device");
                  const tryMinimizePuffs =
                    match.minimizePuffsPerTime( getDeviceIcsOrLaba.ics, get.lowestICSDose( isICS ) );
                  if ( !_.isEmpty( tryMinimizePuffs ) ) {
                    result.push( get.lowestICSDose( tryMinimizePuffs ) );
                  }
                  result.push( getDeviceIcsOrLaba.ics );
                }
                else {
                  // console.log("match laba device");
                  if ( _.size( getDeviceIcsOrLaba.laba ) === 1 ) {
                    result.push( getDeviceIcsOrLaba.laba );
                  }
                  const tryMinimizePuffs = match.minimizePuffsPerTime( getDeviceIcsOrLaba.laba, patientMedication );
                  if ( !_.isEmpty( tryMinimizePuffs ) ) {
                    result.push( get.lowestICSDose( tryMinimizePuffs ) );
                  }
                }
              }
              else {
                result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                const increaseOriginalMedication = adjust.ICSDose( isICS, 'lowestMedium' );
                if ( _.size( increaseOriginalMedication ) === 1 ) {
                  result.push( increaseOriginalMedication );

                  return result;
                }

                return _.chain( increaseOriginalMedication )
                      .thru( match.device( get.lowestICSDose( isICS ) ) )
                      .thru( match.doseICS( get.lowestICSDose( isICS ) ) )
                      .thru( match.timesPerDay( get.lowestICSDose( isICS ) ) )
                      .thru( minimizePuffsPerTime( get.lowestICSDose( isICS ) ) )
                      .value() ||
                _.chain( increaseOriginalMedication )
                    .thru( match.device( get.lowestICSDose( isICS ) ) )
                    .thru( match.doseICS( get.lowestICSDose( isICS ) ) )
                    .thru( match.timesPerDay( get.lowestICSDose( isICS ) ) )
                    .value() ||
                _.chain( increaseOriginalMedication )
                    .thru( match.device( get.lowestICSDose( isICS ) ) )
                    .thru( match.doseICS( get.lowestICSDose( isICS ) ) )
                    .value() ||
                _.chain( increaseOriginalMedication )
                  .thru( match.device( get.lowestICSDose( isICS ) ) )
                  .value() || isICS;
                // if ( !_.isEmpty( increaseOriginalMedication ) ) {
                  //   const tryICSDevice = match.device( increaseOriginalMedication, getICSDevice );
                  //   if ( !_.isEmpty( tryICSDevice ) ) {
                  //     const tryDoseICS = match.doseICS( tryICSDevice, getICSDevice );
                  //     if ( !_.isEmpty( tryDoseICS ) ) {
                  //       const tryTimesPerDay = match.timesPerDay( tryDoseICS, getICSDevice );
                  //       if ( !_.isEmpty( tryTimesPerDay ) ) {
                  //         const tryMinimize = match.minimizePuffsPerTime( tryTimesPerDay, getICSDevice );
                  //         if ( !_.isEmpty( tryMinimize ) ) {
                  //           result.push( tryMinimize );
                  //           // what is there is no ltra in original medications?
                  //           result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                  //         }
                  //         result.push( tryTimesPerDay );
                  //         result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                  //       }
                  //       result.push( tryDoseICS );
                  //       result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                  //     }
                  //     result.push( tryICSDevice );
                  //     result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                  //   }
                  //   result.push( increaseOriginalMedication );
                  //   result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                  // }
              }
            }
            else {
              result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              const increaseOriginalMedication = adjust.ICSDose( isICS, 'lowestMedium' );
              if ( _.size( increaseOriginalMedication ) === 1 ) {
                result.push( increaseOriginalMedication );

                return result;
              }

              return _.chain( increaseOriginalMedication )
                  .thru( match.device( get.lowestICSDose( isICS ) ) )
                  .thru( match.doseICS( get.lowestICSDose( isICS ) ) )
                  .thru( match.timesPerDay( get.lowestICSDose( isICS ) ) )
                  .thru( minimizePuffsPerTime( get.lowestICSDose( isICS ) ) )
                  .value() ||
                _.chain( increaseOriginalMedication )
                  .thru( match.device( get.lowestICSDose( isICS ) ) )
                  .thru( match.doseICS( get.lowestICSDose( isICS ) ) )
                  .thru( match.timesPerDay( get.lowestICSDose( isICS ) ) )
                  .value() ||
                _.chain( increaseOriginalMedication )
                  .thru( match.device( get.lowestICSDose( isICS ) ) )
                  .thru( match.doseICS( get.lowestICSDose( isICS ) ) )
                  .value() ||
                _.chain( increaseOriginalMedication )
                  .thru( match.device( get.lowestICSDose( isICS ) ) )
                  .value() ||
                    isICS;
              // const increaseOriginalMedication = adjust.ICSDose( isICS, 'lowestMedium' );
              // if ( !_.isEmpty( increaseOriginalMedication ) ) {
              //   const tryICSDevice = match.device( increaseOriginalMedication, isICS );
              //   if ( !_.isEmpty( tryICSDevice ) ) {
              //     const tryDoseICS = match.doseICS( tryICSDevice, isICS );
              //     if ( !_.isEmpty( tryDoseICS ) ) {
              //       const tryTimesPerDay = match.timesPerDay( tryDoseICS, isICS );
              //       if ( !_.isEmpty( tryTimesPerDay ) ) {
              //         const tryMinimize = match.minimizePuffsPerTime( tryTimesPerDay, isICS );
              //         if ( !_.isEmpty( tryMinimize ) ) {
              //           result.push( tryMinimize );
              //           // what is there is no laba in original medications?
              //           result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              //         }
              //         result.push( tryTimesPerDay );
              //         result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              //       }
              //       result.push( tryDoseICS );
              //       result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              //     }
              //     result.push( tryICSDevice );
              //     result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              //   }
              //   result.push( increaseOriginalMedication );
              //   result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              // }
            }
          }
          else if ( patientMedication.name === 'symbicort' &&
            categorize.patientICSDose( patientMedication ) === 'low' ) {
            result.push( _.filter( medicationElement, {
              name: 'symbicort',
              function: 'controller,reliever',
              din: patientMedication.din,
            } ) );
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

export default rule3;
