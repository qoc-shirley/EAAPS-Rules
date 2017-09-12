import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule2 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
        const noLabaLtra = _.chain( _patientMedications )
          .filter( _noMedication => _noMedication.chemicalType === 'laba' || _noMedication.chemicalType === 'ltra' )
          .isEmpty()
          .value();

        const compareLowestDoseToPatientMedication = _.chain( _masterMedications )
          .filter( {
            chemicalType: patientMedication.chemicalType,
            name: patientMedication.name,
            device: patientMedication.device,
          } )
          .filter( findMedication => (
              // adjust.ICSDoseToDose - returns medication that has an ICS DOSE of 100
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2'
            )
            ||
            (
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus'
            )
            ||
            (
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler'
            )
            ||
            (
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1'
            )
            ||
            (
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'asmanex' &&
              findMedication.device === 'twisthaler'
            )
            ||
            (
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1'
            )
            ||
            (
              !_.isEmpty( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2'
            ) )
          .filter( _medication => calculate.patientICSDose( patientMedication ) > calculate.ICSDose( _medication ) )
          .isEmpty()
          .value();

        // console.log('in: ',medicationsWithLowestDose, compareLowestDoseToPatientMedication );
        if ( patientMedication.chemicalType === 'ICS' && noLabaLtra && !compareLowestDoseToPatientMedication ) {
          const recommend = _.chain( _masterMedications )
            .filter( _recommendMedication => _recommendMedication.chemicalICS === patientMedication.chemicalICS &&
              _recommendMedication.device === patientMedication.device )
            .value();

          // totalDoseReduction - either reducing the patientMedication by half or adjusting it to be between half the
          // patientMedication dose to it's full dose
          const operationTotalDoseReduction = totalDoseReduction( patientMedication, recommend );
          result.push( Object.assign( operationTotalDoseReduction, { tag: 'd3' } ) );
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();

export default rule2;
