import _ from 'lodash';
import * as getEscalation from '../../rules/escalation/rules';
import masterMedications from '../../medicationData/medicationData';

const ruleMinus1 = ( patientMedications ) => {
  if ( _.some( patientMedications, { chemicalType: 'laac' } ) ) {
    const runThroughEscalation = _.chain( [
      'rule0',
      'rule1',
      'rule2',
      'rule3',
      'rule4',
      'rule5',
      'rule6',
      'rule7',
      'rule8',
      'rule9',
      'rule10',
      'rule11'] )
      .map( ( rule ) => {
        const masterMedication = _.cloneDeep( masterMedications );
        const patientOriginalMedications = _.cloneDeep( patientMedications );
        if ( rule === 'rule6' || rule === 'rule7' || rule === 'rule9' || rule === 'rule10' ) {
          return getEscalation.rules.rule( patientOriginalMedications );
        }
        // const test = rule.replace( /['"]+/g, null );
        // console.log('rule: ', _.isString(rule));

        return getEscalation.rules.rule( patientOriginalMedications, masterMedication );
      } )
      .value();

    return _.chain( patientMedications )
      .filter( patientMedication => patientMedication.chemicalType === 'laac' )
      .concat( runThroughEscalation )
      .thru( _medication => Object.assign( _medication, { tag: 'e0' } ) )
      .value();
  }

  return [];
};

export default ruleMinus1;
