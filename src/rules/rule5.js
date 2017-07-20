import _ from 'lodash';
import * as calculate from './library/calculateICSDose';
import * as categorize from './library/categorizeDose';
import * as get from './library/getICSDose';
import * as adjust from './library/adjustICSDose';
import * as match from './library/match';

const rule5 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, patientMedication ) => {
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
          const findLtra = _.find( medications, { chemicalType: 'ltra' } );
          const isLabaICS = _.filter( filterOrgMeds, { chemicalType: 'laba,ICS' } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          const isICS = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );

          if ( (!_.isEmpty( isLabaICS ) || ( !_.isEmpty( isLaba ) && !_.isEmpty( isICS ) )) &&
            !_.isEmpty( findLtra ) &&
            calculate.patientICSDose( findLtra ) < findLtra.maxGreenICS ) {

            if ( !_.isEmpty( isLabaICS ) ) {
              // const tryOriginalDevice
              // const tryMatchDoseICS = match.doseICS(isLabaICS );
              const recommendHighest = adjust.ICSDose( isLabaICS, 'highest' );
              if ( !_.isEmpty( recommendHighest ) ) {
                if ( _.size( recommendHighest ) > 2 ) {
                  const tryMinimize =
                    match.minimizePuffsPerTime( recommendHighest, get.lowestICSDose( recommendHighest ) );
                  result.push( tryMinimize );
                  // any ltra? or all ltra in orgMeds
                  result.push( findLtra );
                }
                result.push( recommendHighest );
                result.push( findLtra );
              }
            }
            else if ( !_.isEmpty( isICS ) && !_.isEmpty( isLaba ) ) {
              // console.log("laba and ICS");
              const filteredMedication = _.filter( medicationElement, ( masterMedication ) => {
                return masterMedication.chemicalType === 'laba,ICS' &&
                  ( _.filter( isLaba, ( medication ) => {
                    return masterMedication.chemicalLABA === medication.chemicalLABA;
                  } ) && _.filter( isICS, ( medication ) => {
                    return masterMedication.chemicalICS === medication.chemicalICS;
                  } )
                  );
              } );
              const highestDose = _.filter( filteredMedication, ( medication ) => {
                return ( adjust.ICSDose( medication, 'highest' ) !== [] );
              } );
              if ( !_.isEmpty( highestDose ) ) {
                const getDeviceIcsOrLaba = _.filter( filteredMedication, ( medication ) => {
                  return medication.device === isLaba.device || medication.device === isICS.device;
                } );
                const getICSDevice = _.filter( filteredMedication, ( medication ) => {
                  return medication.device === isICS.device;
                } );
                const getLabaDevice = _.filter( filteredMedication, ( medication ) => {
                  return medication.device === isLaba.device;
                } );
                if ( !_.isEmpty( getDeviceIcsOrLaba ) ) {
                  if ( !_.isEmpty( getICSDevice ) ) {
                    const tryMinimizePuffs =
                      match.minimizePuffsPerTime( highestDose, get.lowestICSDose( getICSDevice ) );
                    if ( !_.isEmpty( tryMinimizePuffs ) ) {
                      result.push( get.lowestICSDose( tryMinimizePuffs ) );
                      result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                    }
                    result.push( get.lowestICSDose( getICSDevice ) );
                    result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                  }
                  result.push( get.lowestICSDose( getLabaDevice ) );
                  result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                }
              }
              else {
                const highestICSDose = _.filter( filteredMedication, ( medication ) => {
                  return ( adjust.ICSDose( medication, 'highest' ) !== [] );
                } );
                if ( !_.isEmpty( highestICSDose ) ) {
                  const matchICSDevice = match.device( highestICSDose, get.lowestICSDose( isICS ) );
                  result.push( matchICSDevice );
                  result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                  result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                }
                else {
                  const tryTimesPerDay = match.timesPerDay( filteredMedication, get.lowestICSDose( isICS ) );
                  if ( !_.isEmpty( tryTimesPerDay ) ) {
                    const tryMinimize = match.minimizePuffsPerTime( tryTimesPerDay, get.lowestICSDose( isICS ) );
                    if ( !_.isEmpty( tryMinimize ) ) {
                      result.push( tryMinimize );
                      result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                      result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                    }
                    else {
                      result.push( tryTimesPerDay );
                      result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                      result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                    }
                  }
                  else {
                    result.push( get.highestICSDose( highestICSDose ) );
                    result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                    result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                  }
                }
              }
            }
            else {
              const highestICSDose = _.filter( isICS, ( medication ) => {
                return adjust.ICSDose( medication, 'highest' ) !== [];
              } );
              if ( !_.isEmpty( highestICSDose ) ) {
                const matchICSDevice = match.device( highestICSDose, get.lowestICSDose( isICS ) );
                result.push( matchICSDevice );
                result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                result.push( _.filter( medications, { chemicalType: 'laba' } ) );
              }
              else {
                const tryTimesPerDay = match.timesPerDay( highestICSDose, get.lowestICSDose( isICS ) );
                if ( !_.isEmpty( tryTimesPerDay ) ) {
                  const tryMinimize = match.minimizePuffsPerTime( tryTimesPerDay, get.lowestICSDose( isICS ) );
                  if ( !_.isEmpty( tryMinimize ) ) {
                    result.push( tryMinimize );
                    result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                    result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                  }
                  else {
                    result.push( tryTimesPerDay );
                    result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                    result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                  }
                }
                else {
                  result.push( get.highestICSDose( highestICSDose ) );
                  result.push( _.filter( medications, { chemicalType: 'ltra' } ) );
                  result.push( _.filter( medications, { chemicalType: 'laba' } ) );
                }
              }
            }
          }

          if ( patientMedication.name === 'symbicort' && _.some( patientMedication, { chemicalType: 'ltra' } ) ) {
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

      rule( patientMedication );
      result = _.flatten( result );
      result = _.uniqBy( result, 'id' );

      return result;
    }, [] )
    .value();
};

export default rule5;
