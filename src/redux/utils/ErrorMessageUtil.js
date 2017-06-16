import { displayWarningRequestMessage } from "../state/actions/actions_app"
import { getLanguage } from "../state/constants/getLanguage";

const lang = getLanguage();

/*

Confluence API & Status Code

https://247inc.atlassian.net/wiki/display/APT/Status+and+Error+Codes
https://247inc.atlassian.net/wiki/display/APT/APIs

Fetch Tutorial on Error Handling 

this error handler is based off this example but instead of throwing an error, I want redux to display the error in a notification 
https://www.tjvantoll.com/2015/09/13/fetch-and-errors/

*/

let errorMessageUtil;
class ErrorMessageUtil {

  constructor(){
    this.handleErrors = this.handleErrors.bind(this);
    this.getErrorMessage = this.getErrorMessage.bind(this);
    this.dispatchError = this.dispatchError.bind(this);
  }

  getErrorMessage(status) {

    //if ( response.statusText) return response.statusText;
    console.log("ErrorMessageUtil getErrorMessage status: ", status);

    switch(Number(status)){ 
      case 503 :
        return lang.ERROR_SERVER_503; // elastic search not available
      case 500 :
        return lang.ERROR_SERVER_500; // server_error
      case 400 :
        return lang.ERROR_SERVER_400;  // bad_request
      case 401 :
        return lang.ERROR_SERVER_401;  // unauthorized  
      case 404 :
        return lang.ERROR_SERVER_404;  // not_found  
      case 405 :
        return lang.ERROR_SERVER_405; // not_allowed - ie: Post instead of Get
      case 406 :
        return lang.ERROR_SERVER_406; // not_acceptable - may happen on file upload
      case 409 :
        return lang.ERROR_SERVER_409; // conflict - ie: deleting an intent being used
      case 503 :
      case 429 :
        return lang.ERROR_SERVER_TOO_MANY;  //too_many_requests
      default :
        return lang.ERROR_SERVER_UNKNOWN;
    }
  }

  handleErrors ( response ){

    console.log("ErrorMessageUtil handleErrors response: ", response);

    if ( !response.ok ) {
      throw response.status;
    } else {
      return response;
    } 
  }

  dispatchError(error, dispatch, serverErrorAction ){
      
      console.log("ErrorMessageUtil dispatchError error: ", error);  
      let errorNum = Number(error);
      if(errorNum === 401) {
          window.location.href = '/saml/login';
          return false;
      }
      const serverMessage = this.getErrorMessage(error); 

      console.log("ErrorMessageUtil dispatchError serverMessage: ", serverMessage);
      
      if (Number(error) === 409) dispatch(displayWarningRequestMessage(serverMessage));
      else dispatch(serverErrorAction(serverMessage)); 
  }

}

export default errorMessageUtil = new ErrorMessageUtil();
