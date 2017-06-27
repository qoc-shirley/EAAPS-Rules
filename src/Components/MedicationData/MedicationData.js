import _ from 'lodash';
import masterMedication from './masterMedications';

const header = _.filter(masterMedication, (item, index) => {
  return index === 0
});
const data = _.filter(masterMedication, (item, index) => {
  return index !== 0
});

const masterMedications = _.chain(data)
//map data to header element
  .map((dataVal) => {
    return _.chain(header)
    //gets first element of array
      .head()
      .filter( (headerVal) => {
        return headerVal !== ""
      })
      //	(headerVal) => !headerVal

      //acc array to iterate over
      //headVal the function that is called per iteration
      //index is the initual value
      //=> sets the header element to the corresponding index in the data array. It is put into array and returned
      .reduce((acc, headerVal, index) => {
        acc[headerVal] = dataVal[index];
        return acc;
      }, {})
      //_.chain is a wrapper instance. .value() unwraps the result of the sequences made
      .value();
  })
  .value();

export default masterMedications;