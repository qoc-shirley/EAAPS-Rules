import _ from 'lodash';
import * as get from '../library/getICSDose';

const rule0 = ( patientMedications, masterMedications ) => {
  const recommendationOne = _.chain( masterMedications )
    .filter( { name: 'flovent', doseICS: '125' } )
    .thru( changeOne =>
      _.map( changeOne, changeOneEach => Object.assign( changeOneEach, { puffsPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationTwo = _.chain( masterMedications )
    .filter( { device: 'diskus', doseICS: '100' } )
    .thru( changeTwo =>
      _.map( changeTwo, changeTwoEach => Object.assign( changeTwoEach, { puffsPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationThree = _.chain( masterMedications )
    .filter( { name: 'pulmicort', doseICS: '200' } )
    .thru( changeThree =>
      _.map( changeThree, changeThreeEach =>
        Object.assign( changeThreeEach, { puffsPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationFour = _.chain( masterMedications )
    .filter( { name: 'asmanex', doseICS: '200' } )
    .thru( changeFour =>
      _.map( changeFour, changeFourEach =>
        Object.assign( changeFourEach, { puffsPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationFive = _.chain( masterMedications )
    .filter( { name: 'alvesco', doseICS: '200' } )
    .thru( changeFive =>
      _.map( changeFive, changeFiveEach =>
        Object.assign( changeFiveEach, { puffsPerTime: 1, tag: 'e1' } ) ) )
    .value();
  const recommendationSix = _.chain( masterMedications )
    .filter( { name: 'qvar', doseICS: '100' } )
    .thru( changeSix =>
      _.map( changeSix, changeSixEach => Object.assign( changeSixEach, { puffsPerTime: 1, tag: 'e1' } ) ) )
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
        const noIcsOrLabaIcsOrLaac = _.chain( _patientMedications )
          .filter( _medication =>
            _medication.chemicalType === 'ICS' ||
            _medication.chemicalType === 'laba,ICS' ||
            _medication.chemicalType === 'laac' )
          .isEmpty()
          .value();
        if ( noIcsOrLabaIcsOrLaac ) {
          if ( patientMedication.chemicalType === 'ltra' ) {
            result.push( Object.assign( patientMedication, { tag: 'e2' } ) );
          }
          else if (
            ( patientMedication.chemicalType === 'laba' )
            && ( _.some( _masterMedications, { chemicalType: 'laba,ICS' } ) )
          ) {
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
                    { puffsPerTime: 1, tag: 'e2' },
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
              .map( _medication => Object.assign( _medication, { puffsPerTime: 1, tag: 'e3' } ) )
              .thru( addToRecommendation => result.push( addToRecommendation ) )
              .value();
          }

          return result.push( 'Options: ',
            recommendationOne,
            recommendationTwo,
            recommendationThree,
            recommendationFour,
            recommendationFive,
            recommendationSix,
          );
        }

        return result;
      }, masterMedications, patientMedications );
      rule( originalMedication );

      return result;
    }, [] )
    .flatten()
    .value();
};
export default rule0;
