import _ from 'lodash';
import * as adjust from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';
import * as match from '../library/match';

const rule4 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
      .reduce( ( result, originalMedication ) => {
        const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          const labaMedication = _.filter( _patientMedications, { chemicalType: 'laba' } );
          const labaIcsSize = _.size( _.filter( _patientMedications, { chemicalType: 'laba,ICS' } ) ) === 1;
          const icsSize = _.size( _.filter( _patientMedications, { chemicalType: 'ICS' } ) ) === 1;
          const labaSize = _.size( _.filter( _patientMedications, { chemicalType: 'laba' } ) ) === 1
          if ( ( patientMedication.chemicalType === 'laba,ICS' || ( patientMedication.chemicalType === 'ICS' &&
              !_.isEmpty( labaMedication ) ) ) &&
            patientMedication.name !== 'symbicort' &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) &&
            !_.some( _patientMedications, { chemicalType: 'ltra' } ) &&
            !_.some( _patientMedications, { chemicalType: 'laac' } ) ) {
            const LabaAndIcs = _.filter( _patientMedications, { chemicalType: 'ICS' } );
            const singulair = _.filter( _masterMedications, { name: 'singulair' } );
            if ( patientMedication.chemicalType === 'laba,ICS' && _.isEmpty( LabaAndIcs ) && labaIcsSize) {
              // console.log( 'laba,ICS' );

              return _.chain( _masterMedications )
                .filter( { name: 'singulair' } )
                .thru( _medication => result.push( [
                  Object.assign( _medication[0], { tag: 'e11' } ),
                  Object.assign( patientMedication, { tag: 'e11' } )] ) )
                .value();
            }
            else if ( patientMedication.chemicalType === 'ICS'
              && !_.isEmpty( labaMedication ) && icsSize && labaSize && !labaIcsSize ) {
              // let newMedication = null;
              console.log( 'laba and ICS: ', _.chain( _masterMedications )
                .filter( mMed => mMed.chemicalType === 'laba,ICS' &&
                  mMed.chemicalLABA === labaMedication[0].chemicalLABA &&
                  mMed.chemicalICS === patientMedication.chemicalICS &&
                  ( mMed.device === patientMedication.device || mMed.device === labaMedication[0].device ) &&
                  !_.isEmpty( adjust.ICSDoseToOriginalMedication( mMed, patientMedication ) ) ).value() );

              return _.chain( _masterMedications )
                .filter( mMed => mMed.chemicalType === 'laba,ICS' &&
                  mMed.chemicalLABA === labaMedication[0].chemicalLABA &&
                  mMed.chemicalICS === patientMedication.chemicalICS &&
                  ( mMed.device === patientMedication.device || mMed.device === labaMedication[0].device ) &&
                !_.isEmpty( adjust.ICSDoseToOriginalMedication( mMed, patientMedication ) ) )
                .thru( ( medication ) => {
                  console.log('medication: ', medication );
                  const sameChemicalIcsAndLaba = _.chain( _masterMedications )
                    .filter( mMed => mMed.chemicalType === 'laba,ICS' &&
                      mMed.chemicalLABA === labaMedication[0].chemicalLABA &&
                      mMed.chemicalICS === patientMedication.chemicalICS )
                    .thru( _mMed => adjust.ICSDoseToOriginalMedication( _mMed, patientMedication ) )
                    .thru( _mMed => match.minimizePuffsPerTime( _mMed ) )
                    .value();

                  if ( _.isEmpty( medication ) ) {
                    console.log('empty everything: ', patientMedication);
                    return Object.assign( patientMedication, { tag: 'e10' } );
                  }
                  else if ( !_.isEmpty( sameChemicalIcsAndLaba ) ) {
                    console.log('empty device');
                    return Object.assign( sameChemicalIcsAndLaba, { tag: 'e11' } );
                  }
                  console.log('can match device and chemical');
                  if ( !_.chain( medication ).filter( { device: patientMedication.device } ).isEmpty().value() ) {
                    return _.chain( medication )
                      .filter( { device: patientMedication.device } )
                      .value();
                  }

                  return _.chain( medication )
                    .filter( { device: labaMedication[0].device } )
                    .thru( _mMed => Object.assign( _mMed, { tag: 'e11' } ) )
                    .value();
                //   if ( medication.chemicalType !== 'laba,ICS' &&
                //     ( ( medication.chemicalLABA !== labaMedication[0].chemicalLABA &&
                //         medication.chemicalICS !== patientMedication.chemicalICS ) ||
                //       ( medication.device !== patientMedication.device &&
                //         medication.device !== labaMedication[0].device )
                //     )
                //   ) {
                //     console.log('no match wih any');
                //     return _.concat( accResult,
                //       Object.assign( patientMedication, { tag: 'e10' } ) );
                //   }
                //
                //   const adjustToOrgIcsDose = adjust.ICSDoseToOriginalMedication( medication, patientMedication );
                //   if ( medication.chemicalType === 'laba,ICS' &&
                //     medication.chemicalLABA === labaMedication[0].chemicalLABA &&
                //     medication.chemicalICS === patientMedication.chemicalICS &&
                //     ( medication.device === patientMedication.device || medication.device === labaMedication[0].device )
                //     && ( _.isNil( newMedication ) ||
                //       ( !_.isEmpty( adjustToOrgIcsDose ) &&
                //         _.toInteger( newMedication.doseICS ) < _.toInteger( adjustToOrgIcsDose.doseICS ) ) )
                //   ) {
                //     console.log('match device and chemical');
                //     newMedication = adjustToOrgIcsDose;
                //
                //     return _.concat( accResult,
                //       Object.assign( newMedication, { tag: 'e11' } ) );
                //   }
                //
                //   else if ( medication.chemicalType === 'laba,ICS' &&
                //     medication.chemicalLABA === labaMedication[0].chemicalLABA &&
                //     medication.chemicalICS === patientMedication.chemicalICS &&
                //     ( _.isNil( newMedication ) ||
                //       ( !_.isEmpty( adjustToOrgIcsDose ) &&
                //         _.toInteger( newMedication.doseICS ) < _.toInteger( adjustToOrgIcsDose.doseICS ) ) )
                //   ) {
                //     console.log('only match chemical');
                //     newMedication = adjustToOrgIcsDose;
                //
                //     return _.concat( accResult,
                //       Object.assign( newMedication, { tag: 'e11' } ) );
                //   }
                //
                //   return accResult;
                }, [] )
                .thru( _mMed => {
                  console.log('_mMed: ', _mMed);
                  if ( !_.isArray( _mMed ) ) {
                    return match.minimizePuffsPerTime( [_mMed] );
                  }

                  return match.minimizePuffsPerTime( _mMed );
                  } )
                .thru( ( _medication ) => {
                  if ( _medication.chemicalType === 'ICS' ) {
                    return result.push( _medication,
                      Object.assign( singulair[0], { tag: '' } ),
                      Object.assign( labaMedication[0], { tag: '' } ) );
                  }

                  return result.push( _medication,
                    Object.assign( singulair[0], { tag: ''} ) );
                  } )
                .value();
            }
          }

          if ( patientMedication.name === 'symbicort' && patientMedication.isSmart === false &&
            ( categorize.patientICSDose( patientMedication ) === 'medium' ||
            categorize.patientICSDose( patientMedication ) === 'high' ) &&
            !_.some( _patientMedications, { chemicalType: 'ltra' } ) &&
            !_.some( _patientMedications, { chemicalType: 'laac' } ) &&
            _.size( _.filter( _patientMedications, { name: 'symbicort', isSmart: false } ) ) === 1 ) {
            // multiple triggers causes the tag to be e19 but should be fixed when we fix the multiple trigger problem
            return result.push(
              Object.assign( patientMedication, { tag: 'e12', isSmart: true } ) );
          }

          return result;
        }, masterMedications, patientMedications );
        rule( originalMedication );

        return result;
      }, [] )
    .flattenDeep()
    .uniqBy( 'id' )
    .value();

export default rule4;
