import _ from 'lodash';
import * as adjust  from '../library/adjustICSDose';
import * as categorize from '../library/categorizeDose';

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
            return _.chain( _masterMedications )
              .filter( ( medication ) => {
                return medication.chemicalType === 'laba,ICS' &&
                  medication.name === patientMedication.name &&
                  ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                  ( medication.timesPerDay === patientMedication.timesPerDay ||
                    medication.timesPerDay === '1 OR 2' ) &&
                    medication.device === patientMedication.device;
              } )
              .thru( ( convert ) => {
                return _.map( convert, ( convertEach ) => {
                  return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                } );
              } )
              .maxBy( 'doseICS' )
              .thru( _medication => result.push( _medication ) )
              .value();
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

            if ( !_.isEmpty( sameChemicalLabaAndIcs ) && _.isEmpty( getDeviceIcsOrLaba ) ) {
              // console.log("empty",sameChemicalLabaAndIcs,getDeviceIcsOrLaba)
              result.push( isLtra );

              return _.chain( _masterMedications )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'ICS' && medication.name === patientMedication.name &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                    medication.device === patientMedication.device;
                } )
                .thru( ( convert ) => {
                  return _.map( convert, ( convertEach ) => {
                    return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                  } );
                } )
                .thru( ( convert ) => {
                  return _.map( convert, ( convertEach ) => {
                    return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                  } );
                } )
                .maxBy( 'doseICS' )
                .thru( _medication => result.push( _medication ) )
                .value();
            }
            console.log('test getDeviceIcsOrLaba');
            if ( _.isEmpty( sameChemicalLabaAndIcs ) ) {
              result.push( isLaba );

              return _.chain( _masterMedications )
                .filter( ( medication ) => {
                  return medication.chemicalType === 'ICS' && medication.name === patientMedication.name &&
                    ( medication.timesPerDay === patientMedication.timesPerDay ||
                      medication.timesPerDay === '1 OR 2' ) &&
                    ( adjust.ICSDose( medication, 'lowestMedium' ) !== [] ) &&
                    ( medication.device === patientMedication.device || medication.device === laba.device );
                } )
                .thru( ( convert ) => {
                  return _.map( convert, ( convertEach ) => {
                    return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                  } );
                } )
                .maxBy( 'doseICS' )
                .thru( _medication => result.push( _medication ) )
                .value();
            }

            return _.chain( sameChemicalLabaAndIcs )
              .filter( ( chooseDevice ) => {
                return chooseDevice.device === patientMedication.device;
              } )
              .filter( ( adjustMedication ) => {
                return adjust.ICSDose( adjustMedication, 'lowestMedium' ) !== [];
              } )
              .thru( ( convert ) => {
                return _.map( convert, ( convertEach ) => {
                  return Object.assign( convertEach, { doseICS: _.toInteger( convertEach.doseICS ) } );
                } );
              } )
              .maxBy( 'doseICS' )
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
};

export default rule3;
