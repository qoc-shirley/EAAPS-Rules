import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';

const totalDoseReduction = ( patientMedication, filteredMedications ) => {
  // console.log('in totalDose: ', patientMedication, filteredMedications);
  const exactlyFiftyWithPatientMedication = adjust.checkDoseReduction(
    patientMedication,
    'exactlyFifty',
    patientMedication,
  );
  // console.log('50 of patient: ',exactlyFiftyWithPatientMedication )

  if ( _.isEmpty( exactlyFiftyWithPatientMedication ) ) {
    // adjust timesPerDay/DoseICS and prioritize puffsPerTime
    // console.log('ex fif empty');
    let betweenFiftyAndFullDose = adjust.checkDoseReduction(
          patientMedication,
          'betweenFiftyAndFullDose',
          patientMedication,
        );
   // console.log('betweenFiftyAndFullDose 1: ', betweenFiftyAndFullDose);

    if ( _.isEmpty( betweenFiftyAndFullDose ) ) {
      console.log('betweenfifty')
      betweenFiftyAndFullDose = _.chain( filteredMedications )
        .filter( ( mMed ) => {

          // if ( mMed.timesPerDay.toString() === '1,2' ) {
          if ( mMed.timesPerDay === '1 OR 2' ) {
            if ( calculate.ICSDose( mMed ) >= calculate.patientICSDose( patientMedication ) / 2 &&
              calculate.ICSDose( mMed ) < calculate.patientICSDose( patientMedication )
            ) {

              // return Object.assign( medication, { timesPerDay: [1] } );
              return Object.assign( mMed, { timesPerDay: 1 } );
            }
            else if ( calculate.ICSDose( mMed ) * 2 >= calculate.patientICSDose( patientMedication ) / 2 &&
              calculate.ICSDose( mMed ) * 2 < calculate.patientICSDose( patientMedication ) ) {
              return Object.assign( mMed, { timesPerDay: 2 } );
            }
          }
          console.log('asdf');

          return !_.isEmpty( adjust.checkDoseReduction(
            mMed,
            'betweenFiftyAndFullDose',
            patientMedication,
          ) );
        } )
        .minBy( minMedication =>  _.toInteger( minMedication.doseICS ) *
            _.toInteger( minMedication.timesPerDay ) *
            _.toInteger( minMedication.puffsPerTime ) )
        .value();
      if ( _.isEmpty( betweenFiftyAndFullDose ) ) {
        console.log('between1and 50');
        const betweenOneAndFifty = _.chain( filteredMedications )
          .filter( ( mMed ) => {

            // if ( mMed.timesPerDay.toString() === '1,2' ) {
            if ( mMed.timesPerDay === '1 OR 2' ) {
              if ( calculate.ICSDose( mMed ) >= calculate.patientICSDose( patientMedication ) / 2 &&
                calculate.ICSDose( mMed ) < calculate.patientICSDose( patientMedication )
              ) {

                // return Object.assign( medication, { timesPerDay: [1] } );
                return Object.assign( mMed, { timesPerDay: 1 } );
              }
              else if ( calculate.ICSDose( mMed ) * 2 >= calculate.patientICSDose( patientMedication ) / 2 &&
                calculate.ICSDose( mMed ) * 2 < calculate.patientICSDose( patientMedication ) ) {
                return Object.assign( mMed, { timesPerDay: 2 } );
              }
            }
            // console.log('asdf');

            return !_.isEmpty( adjust.checkDoseReduction(
              mMed,
              'betweenOneAndFifty',
              patientMedication,
            ) );
          } )
          .minBy( minMedication =>  _.toInteger( minMedication.doseICS ) *
            _.toInteger( minMedication.timesPerDay ) *
            _.toInteger( minMedication.puffsPerTime ) )
          .value();
        if ( _.isEmpty( betweenOneAndFifty ) ) {
          // console.log('everythhing empty');
          return [];
        }

        return betweenOneAndFifty;
      }

      return betweenFiftyAndFullDose;
    }

    return betweenFiftyAndFullDose;
  }

  return exactlyFiftyWithPatientMedication;
};

export default totalDoseReduction;
