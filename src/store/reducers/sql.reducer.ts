import { ISqlState,IActionBase } from "../models/root.interface";
import { ADD_SQL, CHANGE_SQL_PENDING_EDIT, EDIT_SQL, REMOVE_SQL,
    CLEAR_SQL_PENDING_EDIT, SET_SQL_MODIFICATION_STATE,SET_SQL_ALL_COUNT,
    CLEAR_SQL,
    ADD_SQL_HISTORY,CLEAR_SQL_HISTORY} from "../actions/sql.action";
import { ISql, SqlModificationStatus } from "../models/sql.interface";

const initialState: ISqlState = {
    Sqls: [],
    selectedSql: null,
    modificationState: SqlModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    SqlHistorys: [],
};

function sqlReducer(state: ISqlState = initialState, action: IActionBase): ISqlState {
    switch (action.type) {
        case SET_SQL_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_SQL: {
            let sqls: ISql[] = state.Sqls;
            sqls = [];
            return { ...state, Sqls: sqls };
        }
        case ADD_SQL: {
            // let maxId: number = Math.max.apply(Math, state.Sqls.map(function(o) { return o.sql_id; }));
            // action.sql.id = maxId + 1;
            return { ...state, Sqls: [...state.Sqls, action.sql]};
        }
        case EDIT_SQL: {
            const foundIndex: number = state.Sqls.findIndex(pr => pr.sql_pk === action.sql.sql_pk);
            let sqls: ISql[] = state.Sqls;
            sqls[foundIndex] = action.sql;
            return { ...state, Sqls: sqls };
        }
        case REMOVE_SQL: {
            return { ...state, Sqls: state.Sqls.filter(pr => pr.sql_pk !== action.sql_pk) };
        }
        case CHANGE_SQL_PENDING_EDIT: {
            return { ...state, selectedSql: action.sql };
        }
        case CLEAR_SQL_PENDING_EDIT: {
            return { ...state, selectedSql: null };
        }
        case SET_SQL_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_SQL_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.SqlHistorys.map(function(o) { return o.sql_id; }));
            // action.sql.id = maxId + 1;
            return { ...state, SqlHistorys: [...state.SqlHistorys, action.sql]};
        }
        case CLEAR_SQL_HISTORY: {
            let SqlHistorys: ISql[] = state.SqlHistorys;
            SqlHistorys = [];
            return { ...state, SqlHistorys: SqlHistorys };
        }


        default:
            return state;
    }
}

export default sqlReducer;
