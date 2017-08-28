import _ from 'lodash';
import * as calculate from './calculateICSDose';

export const lowestICSDose = newMedications => _.chain( newMedications )
      .minBy( newMedications,
      medication => calculate.ICSDose( medication ),
    )
    .value();

export const highestICSDose = newMedications => _.chain( newMedications )
    .maxBy(
      medication => calculate.ICSDose( medication ),
    )
    .value();
