import _ from 'lodash';
import * as calculate from './CalculateICSDose';

export const lowestICSDose = (newMedications) => {
  console.log("lowestICSDose");
  return (_.minBy(newMedications,
      (medication) => {
        console.log("asdfa:", calculate.ICSDose(medication));
        return calculate.ICSDose(medication);
      }
    )
  );
};

export const highestICSDose = (newMedications) => {
  return _.chain(newMedications)
    .maxBy(
      (medication) => {
        return calculate.ICSDose(medication);
      }
    )
    .value();
};
