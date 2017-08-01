import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';

const rule4 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
      .reduce( ( result, medication ) => {
        const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
          if ( ( patientMedication.chemicalType === 'laba,ICS' ||  patientMedication.chemicalType === 'ICS' ) &&
            patientMedication.name !== 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) &&
            ( !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba' } ) ) ) ) {

            result.push( _.chain( originalMedications )
              .filter( { chemicalType: 'laba,ICS' } )
              .concat( patientMedication )
              .concat(
                _.chain( medicationElement )
                .filter( { name: 'singular' } )
                .value(),
              )
              .value(),
            );

            result.push( _
              .chain( medicationElement )
              .reduce( ( accResult, medication ) => {
                const laba = _.chain( originalMedications )
                  .find( { chemicalType: 'laba' } )
                  .value();
                if ( medication.name === 'singulair' ) {
                  accResult.push( medication );
                }

                if ( medication.chemicalType !== 'laba,ICS' &&
                  medication.chemicalLABA !== patientMedication.chemicalLABA &&
                  medication.chemicalICS !== patientMedication.chemicalICS &&
                  ( medication.device !== patientMedication.device &&
                    medication.device !== laba.device
                  ) &&
                  calculate.ICSDose( medication ) !== calculate.patientICSDose( patientMedication )
                ) {
                  accResult.push( patientMedication );

                  return accResult;
                }

                if ( medication.chemicalType !== 'laba,ICS' &&
                     medication.chemicalLABA !== patientMedication.chemicalLABA &&
                     medication.chemicalICS !== patientMedication.chemicalICS &&
                     medication.device === patientMedication.device && ( _.isNil( accResult.new ) ||
                     calculate.ICSDose( accResult.new ) <= calculate.ICSDose( medication ) )
                   ) {
                  accResult.new = medication;

                  return accResult;
                }
                else if ( medication.chemicalType !== 'laba,ICS' &&
                          medication.chemicalLABA !== patientMedication.chemicalLABA &&
                          medication.chemicalICS !== patientMedication.chemicalICS &&
                          medication.device === laba.device && ( _.isNil( accResult.new ) ||
                          calculate.ICSDose( accResult.new ) <= calculate.ICSDose( medication ) )
                        ) {
                  accResult.new = medication;

                  return accResult;
                }

                return accResult;
              }, [] )
              .thru( ( medication ) => {
                return medication.new[0] || medication;
              } )
              .value(),
            );

            // if ( !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba, ICS' } ) ) ) {
            //   result.push( patientMedication );
            //   result.push( _.filter( medicationElement, { name: 'singulair' } ) );
            // }
            // const getLABAAndICS = _.filter( patientMedications,
            //   ( medication ) => {
            //     return medication.chemicalType === 'laba' || medication.chemicalType === 'ICS';
            //   } );
            // if ( !_.isEmpty( getLABAAndICS ) ) {
            //   const filteredMedication = _.filter( medicationElement,
            //     {
            //       chemicalType: 'laba,ICS',
            //       chemicalABA: patientMedication.chemicalLABA,
            //       chemicalICS: patientMedication.chemicalICS,
            //     } );
            //   // same as rule 3 and 5 chemical LABA and chemicalICS clarification
            //   if ( !_.isEmpty( filteredMedication ) ) {
            //     if ( !_.isEmpty( _.filter( filteredMedication, { device: patientMedication.device } ) ) ) {
            //       // console.log("device");
            //       if ( !_.isEmpty( _.filter( filteredMedication, ( medication ) => {
            //         return medication.device === patientMedication.device &&
            //            calculate.ICSDose( medication ) === calculate.patientICSDose( patientMedication );
            //       } ) ) ) {
            //         result.push( _.max(
            //           _.filter( filteredMedication, { device: patientMedication.device } ), 'doseICS' ) );
            //       }
            //       else {
            //         result.push( _.filter( filteredMedication, ( medication ) => {
            //           return medication.device === patientMedication.device &&
            //             calculate.ICSDose( medication ) === calculate.patientICSDose( patientMedication );
            //         } ) );
            //       }
            //       result.push( patientMedication );
            //       result.push( _.filter( medicationElement, { name: 'singulair' } ) );
            //     }
            //     else {
            //       result.push( patientMedication );
            //       result.push( _.filter( medicationElement, { name: 'singulair' } ) );
            //     }
            //   }
            //   else {
            //     result.push( patientMedication );
            //     result.push( _.filter( medicationElement, { name: 'singulair' } ) );
            //   }
            // }
          }
          if ( patientMedication.name === 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) ) {
            result.push( _.filter( medicationElement, { name: 'symbicort', din: patientMedication.din } ) );
          }
        }, masterMedications, patientMedications );
        rule( medication );

        return result;
      }, [] )
    .value();
};

export default rule4;
