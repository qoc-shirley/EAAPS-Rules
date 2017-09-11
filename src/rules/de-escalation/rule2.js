import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule2 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
        const medicationsWithLowestDose = _.chain( _masterMedications )
          .filter( findMedication => (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2'
            )
            ||
            (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus'
            )
            ||
            (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler'
            )
            ||
            (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1'
            )
            ||
            (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'asthmanex' &&
              findMedication.device === 'twisthaler'
            )
            ||
            (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1'
            )
            ||
            (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2'
            ) )
          .filter( {
            chemicalType: patientMedication.chemicalType,
            name: patientMedication.name,
            device: patientMedication.device,
          } )
          .value();
        const noLabaLtra = _.chain( _patientMedications )
          .filter( _noMedication => _noMedication.chemicalType === 'laba' || _noMedication.chemicalType === 'ltra' )
          .isEmpty()
          .value();
        const compareLowestDoseToPatientMedication = _.chain( medicationsWithLowestDose )
          .filter( _medication => {console.log(_medication, calculate.patientICSDose( patientMedication ) > calculate.ICSDose( _medication )); return calculate.patientICSDose( patientMedication ) > calculate.ICSDose( _medication ) })
          .isEmpty()
          .value();
        // console.log('medicationsWithLowestDose: ', medicationsWithLowestDose);
        if ( patientMedication.chemicalType === 'ICS' && noLabaLtra && !compareLowestDoseToPatientMedication ) {
          // console.log('in');
          const recommend = _.chain( medicationsWithLowestDose )
            .filter( _recommendMedication => _recommendMedication.chemicalICS === patientMedication.chemicalICS &&
              _recommendMedication.device === patientMedication.device )
            .value();
          // console.log('totoalDose: ', patientMedication, recommend)
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
