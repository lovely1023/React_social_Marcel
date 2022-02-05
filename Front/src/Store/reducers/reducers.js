import { 
    SAVE_AUTH_INFO
} from '../constants';
const initialState = {
    authInfo:{
        user:{},
        token:''
    }
};
const tokenReducer = (state = initialState, action) => {
    // console.log(action, "action = = = = = = === = = = = === = = = = =")

    switch(action.type) {
        case SAVE_AUTH_INFO:
        return {
            ...state,
            authInfo: action.payload
        };
        default:
        return state;
    }
}

export default tokenReducer;