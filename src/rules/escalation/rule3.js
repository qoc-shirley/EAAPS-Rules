import _ from 'lodash';
import * as categorize from '../library/categorizeDose';
import * as get from '../library/getICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';
const rule3 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( medicationElement, medications, patientMedication ) => {
          const filterOrgMeds = _.filter( medications, ( medication ) => {
            return medication.name !== 'symbicort' &&
              (
                ( medication.chemicalType === 'laba,ICS' && categorize.patientICSDose( medication ) === 'low' ) ||
                ( medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' && categorize.patientICSDose( medication ) === 'low' ) )
              );
          } );
          const isLabaICS = _.filter( filterOrgMeds, { chemicalType: 'laba,ICS' } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          const isICS = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );
          if ( !_.isEmpty( isLabaICS ) || ( !_.isEmpty( isLaba ) && !_.isEmpty( isICS ) ) ) {
            if ( patientMedication.chemicalType === 'laba,ICS' ) {
              const tryTimesPerDay = match.timesPerDay( isLabaICS, patientMedication );

              if ( !_.isEmpty( tryTimesPerDay ) ) {
                const tryDoseICS = match.doseICS( tryTimesPerDay, patientMedication );
                if ( !_.isEmpty( tryDoseICS ) ) {
                  const tryMinimizePuffs = match.minimizePuffsPerTime( tryTimesPerDay, patientMedication );
                  if ( !_.isEmpty( tryMinimizePuffs ) ) {
                    return result.push( tryMinimizePuffs );
                  }

                  return result.push( tryDoseICS );
                }

                return result.push( tryTimesPerDay );
              }

              return result.push( isLabaICS );
            }

            else if ( patientMedication.chemicalType === 'ICS' &&
              !_.isEmpty( isLaba ) &&
              categorize.patientICSDose( patientMedication ) === 'low' ) {
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
                if ( !_.isEmpty( getDeviceIcsOrLaba.ics ) && _.size( getDeviceIcsOrLaba.ics ) >= 2 ) {
                  const tryMinimizePuffs =
                    match.minimizePuffsPerTime( getDeviceIcsOrLaba.ics, patientMedication );
                  if ( !_.isEmpty( tryMinimizePuffs ) ) {
                    return result.push( get.lowestICSDose( tryMinimizePuffs ) );
                  }

                  return result.push( getDeviceIcsOrLaba.ics );
                }
                if ( _.size( getDeviceIcsOrLaba.laba ) === 1 ) {
                  return result.push( getDeviceIcsOrLaba.laba );
                }
                const tryMinimizePuffs =
                  match.minimizePuffsPerTime( getDeviceIcsOrLaba.laba, get.lowestICSDose( isLaba ) );
                if ( !_.isEmpty( tryMinimizePuffs ) ) {
                  return result.push( get.highestICSDose( tryMinimizePuffs ) );
                }
              }
              else {
                result.push( _.filter( patientMedications, { chemicalType: 'ltra' } ) );
                const increaseOriginalMedication = adjust.ICSDose( isICS, 'lowestMedium' );
                if ( _.size( increaseOriginalMedication ) === 1 ) {
                  result.push( increaseOriginalMedication );

                  return result;
                }
                const matchDevice = match.device( increaseOriginalMedication, patientMedication );
                const tryTimesPerDay = match.timesPerDay( matchDevice, patientMedication );

                if ( !_.isEmpty( tryTimesPerDay ) ) {
                  const tryDoseICS = match.doseICS( tryTimesPerDay, patientMedication );
                  if ( !_.isEmpty( tryDoseICS ) ) {
                    const tryMinimizePuffs = match.minimizePuffsPerTime( tryTimesPerDay, patientMedication );
                    if ( !_.isEmpty( tryMinimizePuffs ) ) {
                      return result.push( tryMinimizePuffs );
                    }

                    return result.push( tryDoseICS );
                  }

                  return result.push( tryTimesPerDay );
                }

                return result.push( patientMedication );
              }
            }
            else {
              result.push( _.filter( patientMedications, { chemicalType: 'laba' } ) );
              const increaseOriginalMedication = adjust.ICSDose( isICS, 'lowestMedium' );
              if ( _.size( increaseOriginalMedication ) === 1 ) {
                result.push( increaseOriginalMedication );

                return result;
              }
              const matchDevice = match.device( increaseOriginalMedication, patientMedication );
              const tryTimesPerDay = match.timesPerDay( matchDevice, patientMedication );

              if ( !_.isEmpty( tryTimesPerDay ) ) {
                const tryDoseICS = match.doseICS( tryTimesPerDay, patientMedication );
                if ( !_.isEmpty( tryDoseICS ) ) {
                  const tryMinimizePuffs = match.minimizePuffsPerTime( tryTimesPerDay, patientMedication );
                  if ( !_.isEmpty( tryMinimizePuffs ) ) {
                    return result.push( tryMinimizePuffs );
                  }

                  return result.push( tryDoseICS );
                }

                return result.push( tryTimesPerDay );
              }

              return result.push( patientMedication );
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
    .value();
};

export default rule3;
