import _ from 'lodash';
import * as adjust  from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';
import * as get from '../library/getICSDose';

const rule3 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          const filterOrgMeds = _.filter( _patientMedications, ( medication ) => {
            return medication.name !== 'symbicort' &&
              (
                ( medication.chemicalType === 'laba,ICS' && categorize.patientICSDose( medication ) === 'low' ) ||
                ( medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' && categorize.patientICSDose( medication ) === 'low' ) )
              );
          } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          const isLtra = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );
          const laba = _.find( isLaba, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' &&
               categorize.patientICSDose( patientMedication ) === 'low' &&
               patientMedication.name !== 'symbicort' ) {
            if ( categorize.patientICSDose( patientMedication ) !== 'medium' ) {
              return _.chain( _masterMedications )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'laba,ICS' &&
                    ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                      medication.device === patientMedication.device;
                } )
                .minBy( ( minMedication ) => {
                  if ( minMedication.timesPerDay === '1 OR 2' && patientMedication.timesPerDay === '1' ) {
                    return minMedication.doseICS * minMedication.maxPuffPerTime;
                  }
                  else if ( minMedication.timesPerDay === '1 OR 2' && patientMedication.timesPerDay === '2' ) {
                    return minMedication.doseICS * minMedication.maxPuffPerTime * 2;
                  }

                  return minMedication.doseICS * minMedication.timesPerDay * minMedication.maxPuffPerTime;
                } )
                .thru( _medication => result.push( _medication ) )
                .value();
            }

            return result.push( patientMedication );
          }

          else if ( patientMedication.chemicalType === 'ICS' &&
            !_.isEmpty( isLaba ) &&
            categorize.patientICSDose( patientMedication ) === 'low' &&
            patientMedication.name !== 'symbicort' ) {
            const sameChemicalLabaAndIcs = _.chain( _masterMedications )
              .filter( ( masterMedication ) => {
                return masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                  _.filter( isLaba, ( medication ) => {
                    return masterMedication.chemicalLABA === medication.chemicalLABA;
                  } );
              } )
              .value();

            const getDeviceIcsOrLaba = _.chain( sameChemicalLabaAndIcs )
              .filter( ( medication ) => {

                return medication.device === patientMedication.device ||
                  medication.device === laba.device;
              } )
              .value();

            if ( _.isEmpty( sameChemicalLabaAndIcs ) || _.isEmpty( getDeviceIcsOrLaba ) ) {
              // console.log("empty",sameChemicalLabaAndIcs,getDeviceIcsOrLaba)
              if ( _.isEmpty( sameChemicalLabaAndIcs ) ) {
                result.push( isLaba );
              }
              else if ( _.isEmpty( getDeviceIcsOrLaba ) ) {
                result.push( isLtra );
              }

              if ( categorize.patientICSDose( patientMedication ) !== 'medium' ) {

                return _.chain( _masterMedications )
                  .filter( ( medication ) => {
                    return medication.chemicalType === 'ICS' &&
                      ( medication.timesPerDay === patientMedication.timesPerDay ||
                        medication.timesPerDay === '1 OR 2' ) &&
                      ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                      ( medication.device === patientMedication.device || medication.device === laba.device );
                  } )
                  .maxBy( 'doseICS' )
                  // .minBy( ( minMedication ) => {
                  //   if ( minMedication.timesPerDay === '1 OR 2' && patientMedication.timesPerDay === '1' ) {
                  //     return minMedication.doseICS * minMedication.maxPuffPerTime;
                  //   }
                  //   else if ( minMedication.timesPerDay === '1 OR 2' && patientMedication.timesPerDay === '2' ) {
                  //     return minMedication.doseICS * minMedication.maxPuffPerTime * 2;
                  //   }
                  //
                  //   return minMedication.doseICS * minMedication.timesPerDay * minMedication.maxPuffPerTime;
                  // } )
                  .thru( _medication => result.push( _medication ) )
                  .value();
              }

              return result.push( patientMedication );
            }
            console.log('test getDeviceIcsOrLaba');
            const recommend = _.filter( getDeviceIcsOrLaba, ( medication ) => {
              return categorize.ICSDose( medication ) === 'medium';
            } );
            if ( _.isEmpty( [] ) ) {
              console.log('recommend: ', _.chain( sameChemicalLabaAndIcs )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'ICS' &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                    ( medication.device === patientMedication.device || medication.device === laba.device );
                } )
                .value());

              return _.chain( sameChemicalLabaAndIcs )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'ICS' &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                    ( medication.device === patientMedication.device || medication.device === laba.device );
                } )
                .maxBy( 'doseICS' )
                // .minBy( ( minMedication ) => {
                //   if ( minMedication.timesPerDay === '1 OR 2' && patientMedication.timesPerDay === '1' ) {
                //     return minMedication.doseICS * minMedication.maxPuffPerTime;
                //   }
                //   else if ( minMedication.timesPerDay === '1 OR 2' && patientMedication.timesPerDay === '2' ) {
                //     return minMedication.doseICS * minMedication.maxPuffPerTime * 2;
                //   }
                //
                //   return minMedication.doseICS * minMedication.timesPerDay * minMedication.maxPuffPerTime;
                // } )
                .thru( _medication => result.push( _medication ) )
                .value();
            }
            const lowest = get.lowestICSDose( recommend );

            return result.push( Object.assign( {}, lowest, { maxPuffPerTime: 1 } ) );
          }
          else if ( patientMedication.name === 'symbicort' &&
            categorize.patientICSDose( patientMedication ) === 'low' ) {
            return result.push( ['SMART', _.filter( _masterMedications, {
              name: 'symbicort',
              function: 'controller,reliever',
              din: patientMedication.din,
            } )] );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( originalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .value();
};

export default rule3;
