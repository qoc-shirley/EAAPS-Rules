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
                ( medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' && categorize.patientICSDose( medication ) === 'low' ) )
              ) );
          const isLaac = _.chain( _patientMedications )
            .filter( { chemicalType: 'laac' } )
            .isEmpty()
            .value();
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          const isLtra = _.filter( _patientMedications, { chemicalType: 'ltra' } );
          const laba = _.find( isLaba, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' &&
               categorize.patientICSDose( patientMedication ) === 'low' &&
               patientMedication.name !== 'symbicort' && _.isEmpty( filterOrgMeds ) && isLaac ) {
            if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {
              return _.chain( _masterMedications )
                .filter( medication => medication.chemicalType === 'laba,ICS' &&
                  medication.name === patientMedication.name &&
                  !_.isEmpty( adjust.ICSDose( medication, 'medium' ) ) &&
                  ( medication.timesPerDay === patientMedication.timesPerDay ||
                    medication.timesPerDay === '1 OR 2' ) &&
                  medication.device === patientMedication.device )
                .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                .thru( _medication => result.push( _medication ) )
                .thru( _medication => Object.assign( _medication, { tag: 'e6' } ) )
                .value();
            }
            const adjustToMediumDose = adjust.ICSDose( patientMedication, 'medium' );

            return result.push( Object.assign( adjustToMediumDose, { tag: 'e6' } ) );
          }
          else if ( patientMedication.chemicalType === 'ICS' &&
            !_.isEmpty( isLaba ) &&
            categorize.patientICSDose( patientMedication ) === 'low' &&
            patientMedication.name !== 'symbicort' && isLaac ) {
            // console.log( 'laba and ICS' );
            const sameChemicalLabaAndIcs = _.chain( _masterMedications )
              .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                masterMedication.chemicalLABA === laba.chemicalLABA )
              .value();

            console.log('sameChemicalLabaAndIcs: ', sameChemicalLabaAndIcs);
            const getDeviceIcsOrLaba = _.chain( sameChemicalLabaAndIcs )
              .filter( medication => medication.device === patientMedication.device ||
                  medication.device === laba.device )
              .value();
            console.log('getDeviceIcsOrLaba: ', getDeviceIcsOrLaba);

            if ( !_.isEmpty( sameChemicalLabaAndIcs ) && _.isEmpty( getDeviceIcsOrLaba ) ) {
              console.log("empty",sameChemicalLabaAndIcs,getDeviceIcsOrLaba, isLtra)
              result.push( Object.assign( isLtra, { tag: 'e7' } ) );

              if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {
                return _.chain( _masterMedications )
                  .filter( medication => medication.chemicalType === 'ICS' &&
                    medication.name === patientMedication.name &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'medium' ) !== [] ) &&
                    medication.device === patientMedication.device )
                  .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                  .thru( _medication => Object.assign( _medication, { tag: 'e7' } ) )
                  .thru( _medication => result.push( _medication ) )
                  .value();
              }
              const adjustToMedium = adjust.ICSDose( patientMedication, 'medium' );

              return result.push( Object.assign( adjustToMedium, { tag: 'e7' } ) );
            }
            // console.log( 'test getDeviceIcsOrLaba' );
            else if ( _.isEmpty( sameChemicalLabaAndIcs ) ) {
              console.log( 'sameChemicalLabaAndIcs empty' );
              result.push( Object.assign( isLaba[0], { tag: 'e8' } ) );

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
                  .thru( _medication => Object.assign( _medication, { tag: 'e8' } ) )
                  .value();
              }
              const adjustToMedium = adjust.ICSDose( patientMedication, 'medium' );

              return result.push( Object.assign( adjustToMedium, { tag: 'e8' } ) );
            }
            console.log('asdf');

            // if ( _.isEmpty( adjust.ICSDose( patientMedication, 'medium' ) ) ) {
              return _.chain( sameChemicalLabaAndIcs )
                .filter( chooseDevice => chooseDevice.device === patientMedication.device )
                .filter( adjustMedication => !_.isEmpty( adjust.ICSDose( adjustMedication, 'medium' ) ) )
                .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                .thru( _medication => result.push( Object.assign( _medication, { tag: 'e7' } ) ) )
                .value();
            // }
            // const adjustToMedium = adjust.ICSDose( patientMedication, 'medium' );

            // return result.push( Object.assign( adjustToMedium, { tag: 'e7' } ),
              // Object.assign( isLaba[0], { tag: 'e7' } ) );
          }
          else if ( patientMedication.name === 'symbicort' && patientMedication.isSmart === false &&
              !_.some( _patientMedications, { chemicalType: 'ltra' } ) && isLaac &&
            categorize.patientICSDose( patientMedication ) === 'low' ) {
            return result.push(
              Object.assign( patientMedication, { tag: 'e9', isSmart: true } ) );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( originalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .value();

export default rule3;
