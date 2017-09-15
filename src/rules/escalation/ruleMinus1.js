import _ from 'lodash';
import * as getEscalation from '../../rules/escalation/rules';
import masterMedications from '../../medicationData/medicationData';

const ruleMinus1 = ( patientMedications ) => {
  if ( _.some( patientMedications, { chemicalType: 'laac' } ) ) {
    const filterOutLaac = _.chain( patientMedications )
      .filter( medication => medication.chemicalType !== 'laac' )
      .value();

    const runThroughEscalationRules = _.chain( {
      rule0: getEscalation.rules.rule0,
      rule1: getEscalation.rules.rule1,
      rule3: getEscalation.rules.rule3,
      rule4: getEscalation.rules.rule4,
      rule5: getEscalation.rules.rule5,
      rule6: getEscalation.rules.rule6,
      rule7: getEscalation.rules.rule7,
      rule8: getEscalation.rules.rule8,
      rule9: getEscalation.rules.rule9,
      rule10: getEscalation.rules.rule10,
      rule11: getEscalation.rules.rule11 } )
      .map( ( rule ) => {
        const masterMedication = _.cloneDeep( masterMedications );
        const patientOriginalMedications = _.cloneDeep( filterOutLaac );
        if ( rule === 'rule6' || rule === 'rule7' || rule === 'rule9' || rule === 'rule10' ) {
          return rule( patientOriginalMedications );
        }

        return rule( patientOriginalMedications, masterMedication );
      } )
      .flattenDeep()
      .value();

    return _.chain( patientMedications )
      .filter( patientMedication => patientMedication.chemicalType === 'laac' )
      .concat( runThroughEscalationRules )
      .value();
  }

  return [];
};

export default ruleMinus1;
