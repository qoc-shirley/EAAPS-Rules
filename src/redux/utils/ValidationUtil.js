
let validationUtil;
class ValidationUtil {

  constructor(){
    this.validateTopicGoal = this.validateTopicGoal.bind(this);
  }

  validateTopicGoal (intent) {
    let invalid = true;

    if (typeof intent === "undefined") return invalid;

    if (intent === null) return invalid;

    // it have an -
    let dash = (intent.indexOf("-") > -1 ) ? true : false;

    console.log("ValidationUtil intent 1: ", intent, invalid);

    if (!dash) return invalid;

    console.log("ValidationUtil intent 2: ", intent, invalid);

    // does it have 2 part?
    let partCount = ( intent.split("-").length === 2 ) ? true : false;  
    if (!partCount) return invalid;

    invalid = false;

    console.log("ValidationUtil intent 3: ", intent, invalid);


    // else all good 
    return invalid;
  }

}

export default validationUtil = new ValidationUtil();