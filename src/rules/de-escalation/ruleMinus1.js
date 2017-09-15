import _ from 'lodash';
import * as getDescalation from '../../rules/de-escalation/rules';
import masterMedications from '../../medicationData/medicationData';

const ruleMinus1 = ( patientMedications, asthmaControlAnswers ) => {
  if ( _.some( patientMedications, { chemicalType: 'laac' } ) ) {
    const filterOutLaac = _.chain( patientMedications )
      .filter( medication => medication.chemicalType !== 'laac' )
      .value();
    const runThroughDeEscalationRules = _.chain( {
      rule1: getDescalation.rules.rule1,
      rule2: getDescalation.rules.rule2,
      rule3: getDescalation.rules.rule3,
      rule4: getDescalation.rules.rule4,
      rule5: getDescalation.rules.rule5,
    } )
      .map( ( rule ) => {
        const masterMedication = _.cloneDeep( masterMedications );
        const asthmaControlAnswer = _.cloneDeep( asthmaControlAnswers );
        const patientOriginalMedications = _.cloneDeep( filterOutLaac );
        if ( rule === 'rule2' ) {
          return rule( patientOriginalMedications, masterMedication );
        }

        return rule( patientOriginalMedications, masterMedication, asthmaControlAnswer );
      } )
      .flattenDeep()
      .value();

    return _.chain( patientMedications )
      .filter( patientMedication => patientMedication.chemicalType === 'laac' )
      .concat( runThroughDeEscalationRules )
      .value();
  }

  return [];
};

export default ruleMinus1;
