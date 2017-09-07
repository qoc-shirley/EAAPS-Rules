import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';

const totalDoseReduction = ( patientMedication, filteredMedications ) => {
  console.log('in totalDose: ', patientMedication, filteredMedications);
  let exactlyFiftyWithPatientMedication = adjust.checkDoseReduction(
    patientMedication,
    'exactlyFifty',
    calculate.patientICSDose( patientMedication ),
  );
  console.log('50 of patient: ',exactlyFiftyWithPatientMedication )
  let exactlyFifty;
  // if ( _.isEmpty( exactlyFiftyWithPatientMedication ) ) {
  //   exactlyFifty = _.chain(filteredMedications)
  //     .thru(medication => adjust.checkDoseReduction(
  //       medication,
  //       'exactlyFifty',
  //       calculate.patientICSDose(patientMedication),
  //     ))
  //     .filter(medication => medication.device === patientMedication.device)
  //     .value();
  //   exactlyFiftyWithPatientMedication = exactlyFifty;
  // }

  if ( _.isEmpty( exactlyFiftyWithPatientMedication ) ) {
    // adjust timesPerDay/DoseICS and prioritize puffsPerTime
    console.log('ex fif empty');
    const betweenFiftyAndFullDose = adjust.checkDoseReduction(
          patientMedication,
          'betweenFiftyAndFullDose',
          calculate.patientICSDose( patientMedication ),
        );
      // _.chain( filteredMedications )
      // .filter( medication => adjust.checkDoseReduction(
      //     patientMedication,
      //     'betweenFiftyAndFullDose',
      //     calculate.patientICSDose( patientMedication ),
      //   ) !== [] )
      // .minBy( minMedication => _.toInteger( minMedication.doseICS ) *
      //     _.toInteger( minMedication.timesPerDay ) *
      //     _.toInteger( minMedication.maxPuffPerTime ) )
      // .value();
    console.log('betweenFiftyAndFullDose: ', betweenFiftyAndFullDose);

    if ( _.isEmpty( betweenFiftyAndFullDose ) ) {
      console.log('betweenfifty')
      return _.chain( filteredMedications )
        .filter( ( medication ) => {
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
          console.log('asdfd: ', adjust.checkDoseReduction(
            medication,
            'betweenFiftyAndFullDose',
            calculate.patientICSDose( patientMedication ),
          ), medication);

          return adjust.checkDoseReduction(
            medication,
            'betweenFiftyAndFullDose',
            calculate.patientICSDose( patientMedication ) !== [],
          );
        } )
        .minBy( minMedication => _.toInteger( minMedication.doseICS ) *
            _.toInteger( minMedication.timesPerDay ) *
            _.toInteger( minMedication.maxPuffPerTime ) )
        .value();
    }

    return betweenFiftyAndFullDose;
  }

  return exactlyFiftyWithPatientMedication;
};

export default totalDoseReduction;
