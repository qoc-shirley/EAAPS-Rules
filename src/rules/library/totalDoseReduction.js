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
      .thru( ( medication ) => {
        return adjust.checkDoseReduction(
          medication,
          'betweenFiftyAndFullDose',
          calculate.patientICSDose( patientMedication ),
        );
      } )
      .thru( get.lowestICSDose )
      .value();
    if ( _.isEmpty( betweenFiftyAndFullDose ) ) {
      return _.chain( filteredMedications )
        .thru( ( medication ) => {
          if ( medication.timesPerDay === '1 OR 2' ) {
            if ( calculate.ICSDose( medication ) >= calculate.ICSDose( patientMedication ) / 2 &&
              calculate.ICSDose( medication ) < calculate.ICSDose( patientMedication )
            ) {
              return medication;
            }
            else if ( calculate.ICSDose( medication ) * 2 >= calculate.ICSDose( patientMedication ) / 2 &&
              calculate.ICSDose( medication ) * 2 < calculate.ICSDose( patientMedication ) ) {
              return medication;
            }
          }

          return adjust.checkDoseReduction(
            medication,
            'betweenFiftyAndFullDose',
            calculate.patientICSDose( patientMedication ),
          );
        } )
        .thru( get.lowestICSDose )
        .value();
    }

    return betweenFiftyAndFullDose;
  }

  return exactlyFifty;
};

export default totalDoseReduction;
