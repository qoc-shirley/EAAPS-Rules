import _ from 'lodash';
import * as categorize from '../library/categorizeDose';
import * as get from '../library/getICSDose';
// import * as adjust from '../library/adjustICSDose';
// import * as match from '../library/match';
import * as calculate from '../library/calculateICSDose';

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
         //  const isLabaICS = _.filter( filterOrgMeds, { chemicalType: 'laba,ICS' } );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          // const isICS = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );
          const isLtra = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );
            if ( patientMedication.chemicalType === 'laba,ICS' &&
                 categorize.patientICSDose( patientMedication ) === 'low' &&
                 patientMedication.name !== 'symbicort' ) {
              if ( categorize.patientICSDose( patientMedication ) !== 'medium' ) {
                return result.push(_.chain( medicationElement )
                  .filter( ( medication ) => {
                    return medication.chemicalType === 'laba,ICS' &&
                      ( categorize.ICSDose( medication ) === 'medium' ) &&
                      ( medication.timesPerDay === patientMedication.timesPerDay ||
                        medication.timesPerDay === '1 OR 2' ) &&
                      medication.device === patientMedication.device;
                  })
                  .reduce( ( accResult, medication ) => {
                    if ( _.isNil( accResult.low ) ) {
                      accResult.low = medication;

                      return accResult;
                    }
                    else if ( calculate.ICSDose( accResult.low ) >= calculate.ICSDose( medication ) ) {
                      accResult.low = medication;

                      return accResult;
                    }

                    return accResult;
                  }, [] )
                  .thru( medication => medication.low )
                  .value(),
                );
              }

              return result.push( patientMedication );
            }

            else if ( patientMedication.chemicalType === 'ICS' &&
              !_.isEmpty( isLaba ) &&
              categorize.patientICSDose( patientMedication ) === 'low' ) {
              console.log("ICS and laba");
              const laba = _.find( isLaba, { chemicalType: 'laba' } );
              const sameChemicalLabaAndIcs = _.chain( medicationElement )
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
                if ( _.isEmpty( sameChemicalLabaAndIcs ) ) {
                  result.push( isLaba );
                }
                else if ( _.isEmpty( getDeviceIcsOrLaba ) ) {
                  result.push( isLtra );
                }

                if ( categorize.patientICSDose( patientMedication ) !== 'medium' ) {

                  return result.push( _.chain( medicationElement )
                    .filter( ( medication ) => {
                      return medication.chemicalType === 'ICS' &&
                        ( categorize.ICSDose( medication ) === 'medium' ) &&
                        ( medication.timesPerDay === patientMedication.timesPerDay ||
                          medication.timesPerDay === '1 OR 2' ) &&
                        medication.device === patientMedication.device;
                    } )
                    .reduce( ( accResult, medication ) => {
                      if ( _.isNil( accResult.low ) ) {
                        accResult.low = medication;

                        return accResult;
                      }
                      else if ( calculate.ICSDose( accResult.low ) >= calculate.ICSDose( medication ) ) {
                        accResult.low = medication;

                        return accResult;
                      }

                      return accResult;
                    }, [] )
                    .thru( medication => medication.low )
                    .value(),
                  );
                }

                return result.push( patientMedication );
              }
              const recommend = _.filter( getDeviceIcsOrLaba, ( medication ) => {
                return categorize.ICSDose( medication ) === 'medium';
              } );
              if ( _.isEmpty( recommend ) ) {

                return _.chain( medicationElement )
                  .filter( ( medication ) => {
                    return medication.chemicalType === 'ICS' &&
                      ( categorize.ICSDose( medication ) === 'medium' ) &&
                      ( medication.timesPerDay === patientMedication.timesPerDay ||
                        medication.timesPerDay === '1 OR 2' ) &&
                      ( medication.device === patientMedication.device || medication.device === laba.device );
                  } )
                  .reduce( ( accResult, medication ) => {
                    if ( _.isNil( accResult.low ) ) {
                      accResult.low = medication;

                      return accResult;
                    }
                    else if ( calculate.ICSDose( accResult.low ) >= calculate.ICSDose( medication ) ) {
                      accResult.low = medication;

                      return accResult;
                    }

                    return accResult;
                  }, [] )
                  .thru( medication => medication.low )
                  .concat( result )
                  .value();
              }

              return result.push( get.lowestICSDose( recommend ) );
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
