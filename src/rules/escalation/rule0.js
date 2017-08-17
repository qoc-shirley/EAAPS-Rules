import _ from 'lodash';
import * as get from '../library/getICSDose';

const rule0 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule = _.partial( ( _masterMedications, patientMedication ) => {
        if ( patientMedication.chemicalType !== 'ICS' && patientMedication.chemicalType !== 'laba,ICS' ) {
          if (
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
            if ( isLabaICSAndChemicalLABA ) {
              return result.push(_.chain( _masterMedications )
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
                  else {
                    return _.chain( _masterMedications )
                      .filter( _masterMedications, {
                        chemicalType: 'laba,ICS',
                        chemicalLABA: patientMedication.chemicalLABA,
                      } )
                      .value();
                  }
                } )
                .thru( get.lowestICSDose )
                .thru(
                  ( medication ) => {
                    return Object.assign( {}, medication,
                      { maxPuffPerTime: 1 },
                      );
                  })
                .value(),
              );
            }
            else {
              const newMedications = _.chain( _masterMedications )
                .reduce( ( recommend, medication ) => {
                  if ( medication.chemicalLABA === 'salmeterol' &&
                    medication.chemicalICS === 'fluticasone' &&
                    medication.device === 'diskus' ) {
                    recommend.push( medication );
                  }
                  if ( medication.chemicalLABA === 'salmeterol' &&
                    medication.chemicalICS === 'fluticasone' &&
                    medication.device === 'inhaler2' ) {
                    recommend.push( medication );
                  }
                  if ( medication.chemicalLABA === 'formoterol' && medication.chemicalICS === 'budesonide' ) {
                    recommend.push( medication );
                  }
                  if ( medication.chemicalLABA === 'formoterol' && medication.chemicalICS === 'mometasone' ) {
                    recommend.push( medication );
                  }

                  return recommend;
                }, [] )
                .value();

              const lowestICSDose = get.lowestICSDose( newMedications );
              result.push( Object.assign( {}, lowestICSDose, { maxPuffPerTime: 1 } ) );
            }
          }
          else {
            result.push(
              {
                id: '*',
                device: '-',
                name: 'Flovent',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '125 ug 1 Puff Bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: 'Or *',
                device: 'Discus',
                name: '-',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '100 ug 1 PUFF puff bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'Pulmicort',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '200 ug 1 PUFF bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'Asmanex',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '200 ug I PUFF od',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'Alvesco',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '200 ug I PUFF od',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'QVAR',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '100 I PUFF ug bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              );
          }
        }

        if ( patientMedication.chemicalType === 'ltra' ) {
          result.push( patientMedication );
        }
      }, masterMedications );
      rule( originalMedication );

      return result;
    }, [] )
    .flatten()
    .value();
};

export default rule0;
