import _ from 'lodash';
import * as calculate from './calculateICSDose';

export const lowestICSDose = (newMedications) => {
  return _.chain(newMedications)
      .minBy(newMedications,
      (medication) => {
        return calculate.ICSDose(medication);
      }
    )
    .value();
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
