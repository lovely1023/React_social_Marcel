import { 
    SAVE_AUTH_INFO
} from '../constants';

export function saveAuthInfo(user,token) {
    // console.log("recall", cart)
    if( token== "undefined" || typeof token =="undefined"){
        token = false
    }
    
    return {
        type: SAVE_AUTH_INFO,
        payload: {user,token}
    }
}