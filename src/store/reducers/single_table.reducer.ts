import { ISingle_tableState,IActionBase } from "../models/root.interface";
import { ADD_SINGLE_TABLE, CHANGE_SINGLE_TABLE_PENDING_EDIT, EDIT_SINGLE_TABLE, REMOVE_SINGLE_TABLE,
    CLEAR_SINGLE_TABLE_PENDING_EDIT, SET_SINGLE_TABLE_MODIFICATION_STATE,SET_SINGLE_TABLE_ALL_COUNT,
    CLEAR_SINGLE_TABLE,
    ADD_SINGLE_TABLE_HISTORY,CLEAR_SINGLE_TABLE_HISTORY} from "../actions/single_table.action";
import { ISingle_table, Single_tableModificationStatus } from "../models/single_table.interface";

const initialState: ISingle_tableState = {
    Single_tables: [],
    selectedSingle_table: null,
    modificationState: Single_tableModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    Single_tableHistorys: [],
};

function single_tableReducer(state: ISingle_tableState = initialState, action: IActionBase): ISingle_tableState {
    switch (action.type) {
        case SET_SINGLE_TABLE_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_SINGLE_TABLE: {
            let single_tables: ISingle_table[] = state.Single_tables;
            single_tables = [];
            return { ...state, Single_tables: single_tables };
        }
        case ADD_SINGLE_TABLE: {
            // let maxId: number = Math.max.apply(Math, state.Single_tables.map(function(o) { return o.single_table_id; }));
            // action.single_table.id = maxId + 1;
            return { ...state, Single_tables: [...state.Single_tables, action.single_table]};
        }
        case EDIT_SINGLE_TABLE: {
            const foundIndex: number = state.Single_tables.findIndex(pr => pr.s_pk === action.single_table.s_pk);
            let single_tables: ISingle_table[] = state.Single_tables;
            single_tables[foundIndex] = action.single_table;
            return { ...state, Single_tables: single_tables };
        }
        case REMOVE_SINGLE_TABLE: {
            return { ...state, Single_tables: state.Single_tables.filter(pr => pr.s_pk !== action.s_pk) };
        }
        case CHANGE_SINGLE_TABLE_PENDING_EDIT: {
            return { ...state, selectedSingle_table: action.single_table };
        }
        case CLEAR_SINGLE_TABLE_PENDING_EDIT: {
            return { ...state, selectedSingle_table: null };
        }
        case SET_SINGLE_TABLE_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_SINGLE_TABLE_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.Single_tableHistorys.map(function(o) { return o.single_table_id; }));
            // action.single_table.id = maxId + 1;
            return { ...state, Single_tableHistorys: [...state.Single_tableHistorys, action.single_table]};
        }
        case CLEAR_SINGLE_TABLE_HISTORY: {
            let Single_tableHistorys: ISingle_table[] = state.Single_tableHistorys;
            Single_tableHistorys = [];
            return { ...state, Single_tableHistorys: Single_tableHistorys };
        }


        default:
            return state;
    }
}

export default single_tableReducer;
