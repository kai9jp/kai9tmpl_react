import { IRelated_tableState,IActionBase } from "../models/root.interface";
import { ADD_RELATED_TABLE, CHANGE_RELATED_TABLE_PENDING_EDIT, EDIT_RELATED_TABLE, REMOVE_RELATED_TABLE,
    CLEAR_RELATED_TABLE_PENDING_EDIT, SET_RELATED_TABLE_MODIFICATION_STATE,SET_RELATED_TABLE_ALL_COUNT,
    CLEAR_RELATED_TABLE,
    ADD_RELATED_TABLE_HISTORY,CLEAR_RELATED_TABLE_HISTORY} from "../actions/related_table.action";
import { IRelated_table, Related_tableModificationStatus } from "../models/related_table.interface";

const initialState: IRelated_tableState = {
    Related_tables: [],
    selectedRelated_table: null,
    modificationState: Related_tableModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    Related_tableHistorys: [],
};

function related_tableReducer(state: IRelated_tableState = initialState, action: IActionBase): IRelated_tableState {
    switch (action.type) {
        case SET_RELATED_TABLE_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_RELATED_TABLE: {
            let related_tables: IRelated_table[] = state.Related_tables;
            related_tables = [];
            return { ...state, Related_tables: related_tables };
        }
        case ADD_RELATED_TABLE: {
            // let maxId: number = Math.max.apply(Math, state.Related_tables.map(function(o) { return o.related_table_id; }));
            // action.related_table.id = maxId + 1;
            return { ...state, Related_tables: [...state.Related_tables, action.related_table]};
        }
        case EDIT_RELATED_TABLE: {
            const foundIndex: number = state.Related_tables.findIndex(pr => pr.related_pk === action.related_table.related_pk);
            let related_tables: IRelated_table[] = state.Related_tables;
            related_tables[foundIndex] = action.related_table;
            return { ...state, Related_tables: related_tables };
        }
        case REMOVE_RELATED_TABLE: {
            return { ...state, Related_tables: state.Related_tables.filter(pr => pr.related_pk !== action.related_pk) };
        }
        case CHANGE_RELATED_TABLE_PENDING_EDIT: {
            return { ...state, selectedRelated_table: action.related_table };
        }
        case CLEAR_RELATED_TABLE_PENDING_EDIT: {
            return { ...state, selectedRelated_table: null };
        }
        case SET_RELATED_TABLE_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_RELATED_TABLE_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.Related_tableHistorys.map(function(o) { return o.related_table_id; }));
            // action.related_table.id = maxId + 1;
            return { ...state, Related_tableHistorys: [...state.Related_tableHistorys, action.related_table]};
        }
        case CLEAR_RELATED_TABLE_HISTORY: {
            let Related_tableHistorys: IRelated_table[] = state.Related_tableHistorys;
            Related_tableHistorys = [];
            return { ...state, Related_tableHistorys: Related_tableHistorys };
        }


        default:
            return state;
    }
}

export default related_tableReducer;
