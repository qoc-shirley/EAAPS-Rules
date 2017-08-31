import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';
import * as match from '../library/match';

const rule3 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          const filterOrgMeds = _.filter( _patientMedications, medication => medication.name !== 'symbicort' &&
              (
                ( medication.chemicalType === 'laba,ICS' && categorize.patientICSDose( medication ) === 'low' ) ||
                ( medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' && categorize.patientICSDose( medication ) === 'low' ) )
              ) );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          const isLtra = _.filter( filterOrgMeds, { chemicalType: 'ICS' } );
          const laba = _.find( isLaba, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' &&
               categorize.patientICSDose( patientMedication ) === 'low' &&
               patientMedication.name !== 'symbicort' ) {
            if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {

              return _.chain( _masterMedications )
                .filter( medication => medication.chemicalType === 'laba,ICS' &&
                  medication.name === patientMedication.name &&
                  ( adjust.ICSDose( medication, 'medium' ) !== [] ) &&
                  ( medication.timesPerDay === patientMedication.timesPerDay ||
                    medication.timesPerDay === '1 OR 2' ) &&
                  medication.device === patientMedication.device )
                .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                .thru( _medication => result.push( _medication ) )
                .value();
            }

            return result.push( adjust.ICSDose( patientMedication, 'medium' ) );
          }
          else if ( patientMedication.chemicalType === 'ICS' &&
            !_.isEmpty( isLaba ) &&
            categorize.patientICSDose( patientMedication ) === 'low' &&
            patientMedication.name !== 'symbicort' ) {
            // console.log( 'laba and ICS' );
            const sameChemicalLabaAndIcs = _.chain( _masterMedications )
              .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                  _.filter( isLaba, medication => masterMedication.chemicalLABA === medication.chemicalLABA ) )
              .value();

            const getDeviceIcsOrLaba = _.chain( sameChemicalLabaAndIcs )
              .filter( medication => medication.device === patientMedication.device ||
                  medication.device === laba.device )
              .value();

            if ( !_.isEmpty( sameChemicalLabaAndIcs ) && _.isEmpty( getDeviceIcsOrLaba ) ) {
              // console.log("empty",sameChemicalLabaAndIcs,getDeviceIcsOrLaba)
              result.push( isLtra );

              if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {
                return _.chain( _masterMedications )
                  .filter( medication => medication.chemicalType === 'ICS' &&
                    medication.name === patientMedication.name &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'medium' ) !== [] ) &&
                    medication.device === patientMedication.device )
                  .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                  .thru( _medication => result.push( _medication ) )
                  .value();
              }

              return result.push( adjust.ICSDose( patientMedication, 'medium' ) );
            }
            // console.log( 'test getDeviceIcsOrLaba' );
            if ( _.isEmpty( sameChemicalLabaAndIcs ) ) {
              result.push( isLaba );

              if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {
                return _.chain( _masterMedications )
                  .filter( medication => medication.chemicalType === 'ICS' &&
                    medication.name === patientMedication.name &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'medium' ) !== [] ) &&
                    ( medication.device === patientMedication.device || medication.device === laba.device ) )
                  .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                  .thru( _medication => result.push( _medication ) )
                  .value();
              }

              return result.push( adjust.ICSDose( patientMedication, 'medium' ) );
            }

            return _.chain( sameChemicalLabaAndIcs )
              .filter( chooseDevice => chooseDevice.device === patientMedication.device )
              .filter( adjustMedication => adjust.ICSDose( adjustMedication, 'medium' ) !== [] )
              .thru( _medication => match.minimizePuffsPerTime( _medication ) )
              .value();
          }
          else if ( patientMedication.name === 'symbicort' &&
            categorize.patientICSDose( patientMedication ) === 'low' ) {
            return result.push( ['SMART',
              Object.assign( patientMedication, { maxPuffPerTime: patientMedication.puffPerTime } )] );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( originalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .value();

export default rule3;
