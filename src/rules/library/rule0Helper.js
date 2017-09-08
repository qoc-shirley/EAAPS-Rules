import _ from 'lodash';
import masterMedications from '../../medicationData/medicationData';

export const floventMedication = _.chain( masterMedications )
  .filter( { name: 'flovent', doseICS: '125' } )
  .thru( changeOne =>
    _.map( changeOne, changeOneEach => Object.assign( changeOneEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
  .value();
export const diskusMedication = _.chain( masterMedications )
  .filter( { device: 'diskus', doseICS: '100' } )
  .thru( changeTwo =>
    _.map( changeTwo, changeTwoEach => Object.assign( changeTwoEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
  .value();
export const pulmicortMedication = _.chain( masterMedications )
  .filter( { name: 'pulmicort', doseICS: '200' } )
  .thru( changeThree =>
    _.map( changeThree, changeThreeEach =>
      Object.assign( changeThreeEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
  .value();
export const asmanexMedication = _.chain( masterMedications )
  .filter( { name: 'asmanex', doseICS: '200' } )
  .thru( changeFour =>
    _.map( changeFour, changeFourEach =>
      Object.assign( changeFourEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
  .value();
export const alvescoMedication = _.chain( masterMedications )
  .filter( { name: 'alvesco', doseICS: '200' } )
  .thru( changeFive =>
    _.map( changeFive, changeFiveEach =>
      Object.assign( changeFiveEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
  .value();
export const qvarMedication = _.chain( masterMedications )
  .filter( { name: 'qvar', doseICS: '100' } )
  .thru( changeSix =>
    _.map( changeSix, changeSixEach => Object.assign( changeSixEach, { maxPuffPerTime: 1, tag: 'e1' } ) ) )
  .value();