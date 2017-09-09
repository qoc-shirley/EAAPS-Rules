import _ from 'lodash';
import * as getDescalation from '../../rules/escalation/rules';
import masterMedications from '../../medicationData/medicationData';

const ruleMinus1 = ( patientMedications, asthmaControlAnswers ) => {
  if ( _.some( patientMedications, { chemicalType: 'laac' } ) ) {
    const runThroughEscalationRules = _.chain( {
      rule1: getDescalation.rules.rule1,
      rule2: getDescalation.rules.rule2,
      rule3: getDescalation.rules.rule3,
      rule4: getDescalation.rules.rule4,
      rule5: getDescalation.rules.rule5,
    } )
      .map( ( rule ) => {
        const masterMedication = _.cloneDeep( masterMedications );
        const asthmaControlAnswer = _.cloneDeep( asthmaControlAnswers );
        const patientOriginalMedications = _.cloneDeep( patientMedications );
        if ( rule === 'rule2' || rule === 'rule3' ) {
          return rule( patientOriginalMedications, masterMedication);
        }

        return rule( patientOriginalMedications, masterMedication, asthmaControlAnswer );
      } )
      .flattenDeep()
      .value();

    return _.chain( patientMedications )
      .filter( patientMedication => patientMedication.chemicalType === 'laac' )
      .concat( runThroughEscalationRules )
      .thru( _medication => Object.assign( _medication, { tag: 'd0' } ) )
      .value();
  }

  return [];
};

export default ruleMinus1;
