import _ from 'lodash';
import * as calculate from './library/calculateICSDose';
import * as categorize from './library/categorizeDose';

const rule4 = ( patientMedications, masterMedications ) => {
  const result = [];

  return _.chain( patientMedications )
    .filter(
      // _.reduce((result) => {
      _.partial( ( medicationElement, patientMedication ) => {
        if ( patientMedication.chemicalType === 'ICS' &&
          patientMedication.name !== 'symbicort' &&
          ( categorize.patientICSDose( patientMedication ) === 'medium' ||
          categorize.patientICSDose( patientMedication ) === 'high' ) &&
          ( !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba' } ) ) ) ) {
          if ( !_.isEmpty( _.filter( patientMedications, { chemicalType: 'laba, ICS' } ) ) ) {
            result.push( patientMedication );
            result.push( _.filter( medicationElement, { name: 'singulair' } ) );
          }
          const getLABAAndICS = _.filter( patientMedications,
            ( medication ) => {
              return medication.chemicalType === 'laba' || medication.chemicalType === 'ICS';
            } );
          if ( !_.isEmpty( getLABAAndICS ) ) {
            const filteredMedication = _.filter( medicationElement,
              {
                chemicalType: 'laba,ICS',
                chemicalABA: patientMedication.chemicalLABA,
                chemicalICS: patientMedication.chemicalICS,
              } );
            // same as rule 3 and 5 chemical LABA and chemicalICS clarification
            if ( !_.isEmpty( filteredMedication ) ) {
              if ( !_.isEmpty( _.filter( filteredMedication, { device: patientMedication.device } ) ) ) {
                // console.log("device");
                if ( !_.isEmpty( _.filter( filteredMedication, ( medication ) => {
                  return medication.device === patientMedication.device &&
                      calculate.ICSDose( medication ) === calculate.patientICSDose( patientMedication );
                } ) ) ) {
                  result.push( _.max(
                    _.filter( filteredMedication, { device: patientMedication.device } ), 'doseICS' ) );
                }
                else {
                  result.push( _.filter( filteredMedication, ( medication ) => {
                    return medication.device === patientMedication.device &&
                      calculate.ICSDose( medication ) === calculate.patientICSDose( patientMedication );
                  } ) );
                }
                result.push( patientMedication );
                result.push( _.filter( medicationElement, { name: 'singulair' } ) );
              }
              else {
                result.push( patientMedication );
                result.push( _.filter( medicationElement, { name: 'singulair' } ) );
              }
            }
            else {
              result.push( patientMedication );
              result.push( _.filter( medicationElement, { name: 'singulair' } ) );
            }
          }
        }
        if ( patientMedication.name === 'symbicort' &&
          ( categorize.patientICSDose( patientMedication ) === 'medium' ||
          categorize.patientICSDose( patientMedication ) === 'high' ) ) {
          result.push( _.filter( medicationElement, { name: 'symbicort', din: patientMedication.din } ) );
        }
      }, masterMedications ),
      // return result;
      // }, [])
    )
    .concat( result )
    .value();
};

export default rule4;
