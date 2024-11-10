import { IApp_envState,IActionBase } from "../models/root.interface";
import { SET_SINGLE_RECORD, 
    SET_SINGLE_RECORD_MODIFICATION_STATE,SET_SINGLE_RECORD_ALL_COUNT,
    ADD_SINGLE_RECORD_HISTORY,CLEAR_SINGLE_RECORD_HISTORY} from "../actions/app_env.action";
import { IApp_env, App_envModificationStatus } from "../models/app_env.interface";

const initialState: IApp_envState = {
    App_env: null,
    modificationState: App_envModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    App_envHistorys: []
};

function App_envReducer(state: IApp_envState = initialState, action: IActionBase): IApp_envState {
    switch (action.type) {
        case SET_SINGLE_RECORD_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case SET_SINGLE_RECORD: {
            return { ...state, App_env: action.app_env};
        }
        case SET_SINGLE_RECORD_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_SINGLE_RECORD_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.App_envHistorys.map(function(o) { return o.App_env_id; }));
            // action.App_env.id = maxId + 1;
            return { ...state, App_envHistorys: [...state.App_envHistorys, action.app_env]};
        }
        case CLEAR_SINGLE_RECORD_HISTORY: {
            let App_envHistorys: IApp_env[] = state.App_envHistorys;
            App_envHistorys = [];
            return { ...state, App_envHistorys: App_envHistorys };
        }


        default:
            return state;
    }
}

export default App_envReducer;
