import _ from 'lodash';
import * as get from '../library/getICSDose';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';

const totalDoseReduction = ( patientMedication, filteredMedications ) => {
  const exactlyFifty = _.chain( filteredMedications )
    .thru( ( medication ) => {
      return adjust.checkDoseReduction(
        medication,
        'exactlyFifty',
        calculate.patientICSDose( patientMedication ),
      );
    } )
    .filter( ( medication ) => {
      return medication.device === patientMedication.device;
    } )
    .value();

  if ( _.isEmpty( exactlyFifty ) ) {
    // adjust timesPerDay/DoseICS and prioritize puffsPerTime
    const betweenFiftyAndFullDose = _.chain( filteredMedications )
      .filter( ( medication ) => {
        return adjust.checkDoseReduction(
          medication,
          'betweenFiftyAndFullDose',
          calculate.patientICSDose( patientMedication ),
        ) !== [];
      } )
      .thru( get.lowestICSDose )
      .thru(
        ( medication ) => {
          return Object.assign( {}, medication,
            { maxPuffPerTime: 1 },
          );
        } )
      .value();

    if ( _.isEmpty( betweenFiftyAndFullDose ) ) {
      return _.chain( filteredMedications )
        .thru( ( medication ) => {
          if ( medication.timesPerDay === '1 OR 2' ) {
            if ( calculate.ICSDose( medication ) >= calculate.patientICSDose( patientMedication ) / 2 &&
              calculate.ICSDose( medication ) < calculate.patientICSDose( patientMedication )
            ) {
              return Object.assign( medication, { timesPerDay: 1 } );
            }
            else if ( calculate.ICSDose( medication ) * 2 >= calculate.patientICSDose( patientMedication ) / 2 &&
              calculate.ICSDose( medication ) * 2 < calculate.patientICSDose( patientMedication ) ) {
              return Object.assign( medication, { timesPerDay: 2 } );
            }
          }

          return adjust.checkDoseReduction(
            medication,
            'betweenFiftyAndFullDose',
            calculate.patientICSDose( patientMedication ),
          );
        } )
        .thru( get.lowestICSDose )
        .thru(
          ( medication ) => {
            return Object.assign( {}, medication,
              { maxPuffPerTime: 1 },
            );
          } )
        .value();
    }

    return Object.assign( betweenFiftyAndFullDose, { maxPuffPerTime: 1 } );
  }

  return Object.assign( exactlyFifty, { maxPuffPerTime: 1 } );
};

export default totalDoseReduction;
