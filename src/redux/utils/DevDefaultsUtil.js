
let devDefaultsUtil;
class DevDefaultsUtil {

  constructor(){
    this.getDefaults = this.getDefaults.bind(this);
  }

  getDefaults(username) {

        const generalDefaults = {
            pageLimit: 10
        };  

        switch(username) {
            case "manish.marathe" :
                return {
                        ...generalDefaults
                       }
            case "hakan.ancin" :
                return {
                        ...generalDefaults
                       }
            case "ivan.yu" :
                return {
                        ...generalDefaults
                       }
            case "jeff.karpala" :
                return {
                        ...generalDefaults
                       }
            case "brandon.flowers" :
                return {
                        ...generalDefaults,
                        pageLimit: 5
                       }
            default :
                return generalDefaults;
        }

    }

}

export default devDefaultsUtil = new DevDefaultsUtil();