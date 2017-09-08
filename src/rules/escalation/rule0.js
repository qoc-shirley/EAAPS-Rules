import _ from 'lodash';
import * as get from '../library/getICSDose';
import * as recommendation from '../library/rule0Helper';

const rule0 = ( patientMedications, masterMedications ) => {
  if ( _.isEmpty( patientMedications ) ) {
    const recommendations = [[recommendation.floventMedication,
      recommendation.alvescoMedication,
      recommendation.asmanexMedication,
      recommendation.diskusMedication,
      recommendation.pulmicortMedication,
      recommendation.qvarMedication,
    ]];

    return _.flattenDeep( recommendations );
  }

  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule = _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
        const noIcsOrLabaIcs = _.chain( _patientMedications )
          .filter( _medication => _medication.chemicalType === 'ICS' || _medication.chemicalType === 'laba,ICS' )
          .isEmpty()
          .value();
        if ( noIcsOrLabaIcs ) {
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
              recommendation.floventMedication,
              recommendation.alvescoMedication,
              recommendation.asmanexMedication,
              recommendation.diskusMedication,
              recommendation.pulmicortMedication,
              recommendation.qvarMedication,
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
};
export default rule0;
