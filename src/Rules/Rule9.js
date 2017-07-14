import _ from 'lodash';
import * as calculate from './Library/CalculateICSDose';
import * as adjust from './Library/AdjustICSDose';

const rule9 = (patientMedications) => {
  return _.chain(patientMedications)
    .reduce((result, patientMedication) => {
    console.log("asdfasf");
      if (patientMedication.name === "symbicort" && patientMedication.controller === "controller,reliever" &&
        ( calculate.ICSDose(patientMedication) < patientMedication.maxGreenICS ) &&
        _.some(patientMedications, {chemicalType: "ltra"})) {
        console.log("hello");
        if (_.isEmpty(adjust.ICSDose(patientMedication, "highest"))) {
          console.log("a");
          result.push(
            _.max(
              _.filter(patientMedications, (medication) => {
                return medication.name === "symbicort" &&
                  medication.controller === "controller,reliever" &&
                  (calculate.ICSDose(medication) < medication.maxGreenICS)
              }),
              'doseICS'));
          result.push(patientMedications);
          result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
        }
        else {
          console.log("a");
          result.push(patientMedications);
          result.push(adjust.ICSDose(patientMedication, "highest"));
          result.push(_.filter(patientMedications, {chemicalType: "ltra"}));
        }
      }
      return result;
    }, [])
    .value();
};

export default rule9;