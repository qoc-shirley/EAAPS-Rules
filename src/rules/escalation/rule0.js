import _ from 'lodash';
import * as get from '../library/getICSDose';

const rule0 = ( patientMedications, masterMedications ) => {
  const recommendationOne = _.chain( masterMedications )
    .filter( { name: 'flovent', doseICS: '125' } )
    .thru( changeOne =>
      _.map( changeOne, changeOneEach => Object.assign( changeOneEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationTwo = _.chain( masterMedications )
    .filter( { device: 'diskus', doseICS: '100' } )
    .thru( changeTwo =>
      _.map( changeTwo, changeTwoEach => Object.assign( changeTwoEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationThree = _.chain( masterMedications )
    .filter( { name: 'pulmicort', doseICS: '200' } )
    .thru( changeThree =>
      _.map( changeThree, changeThreeEach =>
        Object.assign( changeThreeEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationFour = _.chain( masterMedications )
    .filter( { name: 'asmanex', doseICS: '200' } )
    .thru( changeFour =>
      _.map( changeFour, changeFourEach =>
        Object.assign( changeFourEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationFive = _.chain( masterMedications )
    .filter( { name: 'alvesco', doseICS: '200' } )
    .thru( changeFive =>
      _.map( changeFive, changeFiveEach =>
        Object.assign( changeFiveEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationSix = _.chain( masterMedications )
    .thru( changeSix =>
      _.map( changeSix, changeSixEach => Object.assign( changeSixEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
    .filter( { name: 'qvar', doseICS: '100' } )
    .value();
  if ( _.isEmpty( patientMedications ) ) {
    const recommendations = [[recommendationOne,
      recommendationTwo,
      recommendationThree,
      recommendationFour,
      recommendationFive,
      recommendationSix,
    ]];

    return _.flattenDeep( recommendations );
  }

    return _.chain( patientMedications )
      .reduce( ( result, originalMedication ) => {
        const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          const noIcsOrLabaIcs = _.chain( _patientMedications )
            .filter( _medication => _medication === 'ICS' || _medication === 'laba,ICS' )
            .isEmpty()
            .value();
          if ( noIcsOrLabaIcs ) {
            if ( patientMedication.chemicalType === 'ltra' ) {
              console.log('ltra  medication: ', patientMedication);
              result.push( patientMedication );
            }
            else if (
              ( patientMedication.chemicalType === 'laba' )
              && ( _.some( _masterMedications, { chemicalType: 'laba,ICS' } ) )
            ) {
              console.log('laba medication: ', patientMedication);
              const isLabaICSAndChemicalLABA = _.chain( _masterMedications )
                .filter( {
                  chemicalType: 'laba,ICS',
                  chemicalLABA: patientMedication.chemicalLABA,
                } )
                .isEmpty()
                .value();
              if ( patientMedication.chemicalType === 'laba' && !isLabaICSAndChemicalLABA ) {
                return result.push( _.chain( _masterMedications )
                  .filter( {
                    chemicalType: 'laba,ICS',
                    chemicalLABA: patientMedication.chemicalLABA,
                    device: patientMedication.device,
                  } )
                  .thru( ( results ) => {
                    if ( !_.isEmpty( results ) ) {
                      return _.chain( _masterMedications )
                        .filter( {
                          chemicalType: 'laba,ICS',
                          chemicalLABA: patientMedication.chemicalLABA,
                          device: patientMedication.device,
                        } )
                        .value();
                    }

                    return _.chain( _masterMedications )
                      .filter( {
                        chemicalType: 'laba,ICS',
                        chemicalLABA: patientMedication.chemicalLABA,
                      } )
                      .value();
                  } )
                  .thru( get.lowestICSDose )
                  .thru(
                    medication => Object.assign( {}, medication,
                      { maxPuffPerTime: 1, tag: 'e2' },
                    ) )
                  .value(),
                );
              }

              return _.chain( _masterMedications )
                .reduce( ( accNewMedications, medication ) => {
                  if ( medication.chemicalLABA === 'salmeterol' &&
                    medication.chemicalICS === 'fluticasone' &&
                    medication.device === 'diskus' ) {
                    accNewMedications.diskus.push( medication );
                  }
                  else if ( medication.chemicalLABA === 'salmeterol' &&
                    medication.chemicalICS === 'fluticasone' &&
                    medication.device === 'inhaler2' ) {
                    accNewMedications.inhaler2Advair.push( medication );
                  }
                  else if ( medication.chemicalLABA === 'formoterol' &&
                    medication.chemicalICS === 'budesonide' ) {
                    accNewMedications.inhaler2Zenhale.push( medication );
                  }
                  else if ( medication.chemicalLABA === 'formoterol' &&
                    medication.chemicalICS === 'mometasone' ) {
                    accNewMedications.symbicort.push( medication );
                  }

                  return accNewMedications;
                }, { diskus: [], inhaler2Advair: [], inhaler2Zenhale: [], symbicort: [] } )
                .map( ( _medications ) => {
                  return get.lowestICSDose( _medications );
                } )
                .map( _medication => Object.assign( _medication, { maxPuffPerTime: 1, tag: 'e3' } ) )
                .thru( addToRecommendation => result.push( addToRecommendation ) )
                .value();
            }
            else {
              result.push( 'Options: ',
                recommendationOne,
                recommendationTwo,
                recommendationThree,
                recommendationFour,
                recommendationFive,
                recommendationSix,
              );
            }
          }

          return result;
        }, masterMedications, patientMedications );
        rule( originalMedication );

        return result;
      }, [] )
      .flatten()
      .value();
  }
export default rule0;
