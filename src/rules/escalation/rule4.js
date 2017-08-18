import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';

const rule4 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
      .reduce( ( result, originalMedication ) => {
        const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          if ( ( patientMedication.chemicalType === 'laba,ICS' || ( patientMedication.chemicalType === 'ICS' &&
              !_.isEmpty( _.filter( _patientMedications, { chemicalType: 'laba' } ) ) ) ) &&
            patientMedication.name !== 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {
            const singulair = _.filter( _masterMedications, { name: 'singulair' } );
            if ( patientMedication.chemicalType === 'laba,ICS' ) {
              console.log( 'laba,ICS' );

              return _.chain( _masterMedications )
                .filter( { name: 'singulair' } )
                .thru( _medication => result.push( [_medication, patientMedication] ) )
                .value();
            }
            console.log( 'laba and ICS' );

            let newMedication = null;
            return _.chain( _masterMedications )
              .reduce( ( accResult, medication ) => {
                const laba = _.chain( _patientMedications )
                  .find( { chemicalType: 'laba' } )
                  .value();
                if ( medication.chemicalType !== 'laba,ICS' &&
                  ( ( medication.chemicalLABA !== laba.chemicalLABA &&
                      medication.chemicalICS !== patientMedication.chemicalICS ) ||
                    ( medication.device !== patientMedication.device &&
                      medication.device !== laba.device )
                  )
                ) {
                  return _.concat( accResult, patientMedication );
                }

                const adjustToOrgIcsDose = adjust.ICSDoseToOriginalMedication( medication, patientMedication );
                console.log( 'adjustToOrgIcsDose: ', adjustToOrgIcsDose );
                if ( medication.chemicalType === 'laba,ICS' &&
                     medication.chemicalLABA === laba.chemicalLABA &&
                     medication.chemicalICS === patientMedication.chemicalICS &&
                  ( medication.device === patientMedication.device || medication.device === laba.device )
                  && ( _.isNil( newMedication ) ||
                    ( !_.isEmpty( adjustToOrgIcsDose ) &&
                      _.toInteger( newMedication.doseICS ) < _.toInteger( adjustToOrgIcsDose.doseICS ) ) )
                   ) {
                  newMedication = adjustToOrgIcsDose;

                  return _.concat( accResult, newMedication );
                }

                else if ( medication.chemicalType === 'laba,ICS' &&
                          medication.chemicalLABA === laba.chemicalLABA &&
                          medication.chemicalICS === patientMedication.chemicalICS &&
                        ( _.isNil(newMedication ) ||
                          ( !_.isEmpty( adjustToOrgIcsDose ) &&
                          _.toInteger(newMedication.doseICS ) < _.toInteger( adjustToOrgIcsDose.doseICS ) ) )
                        ) {
                  newMedication = adjustToOrgIcsDose;

                  return _.concat( accResult, newMedication );
                }

                return accResult;
              }, [] )
              .uniqBy( 'id' )
              .thru( _medication => result.push( [_medication, singulair] ) )
              .value();
          }

          if ( patientMedication.name === 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {
            return result.push( ['SMART',
              _.filter( _masterMedications,
                { name: 'symbicort', function: 'controller,reliever', din: patientMedication.din } )] );
          }

          return result;
        }, masterMedications, patientMedications );
        rule( originalMedication );

        return result;
      }, [] )
    .flattenDeep()
    .value();

export default rule4;
