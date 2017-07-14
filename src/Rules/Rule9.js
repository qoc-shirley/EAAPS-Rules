import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
import * as adjust from './Library/AdjustICSDose';

const rule9 = (patientMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
      if (patientMedication.name === "symbicort" && patientMedication.function === "controller,reliever" &&
        ( calculate.ICSDose(patientMedication) < patientMedication.maxGreenICS ) &&
        _.some(patientMedications, {chemicalType: "ltra"})) {
        console.log("hello");
        if (_.isEmpty(adjust.ICSDose(patientMedication, "highest"))) {
          console.log("a");
          result.push(patientMedication);
          result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
        }
        else {
          console.log("b");
          result.push(adjust.ICSDose(patientMedication, "highest"));
          result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
        }
      }
      result = _.flatten(result);
      result = _.uniqBy(result, "id");
      return result;
    }, [])
    .value();
};

export default rule9;