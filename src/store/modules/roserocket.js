import { handleActions } from 'redux-actions'
import * as service from '../../services/axiocall'


// defines action types
const SET_NICKNAME = 'SET_NICKNAME'
const MAKE_BATTLE_ROOM = 'MAKE_BATTLE_ROOM'
const SET_GUEST_HOST = 'SET_GUEST_HOST'


// Action creators
export const setIamGuest = ( tf ) => dispatch => {

    dispatch({ 
        type: SET_GUEST_HOST,
        payload : tf
    })
}

export const makeRoomAndWait = (battleName, level ) => dispatch => {

    dispatch({ 
        type: MAKE_BATTLE_ROOM,
        payload : { battleName, level }
    })
}

export const setNickname = (nickname) => dispatch => {

    dispatch({ 
        type: SET_NICKNAME,
        payload : nickname
    })
}

// defines init state
const initialState = {
    nickname : null,
    battleName : null,
    level : 1,
    onBattle : false,
    guest : false,
}



// Reducers

export default handleActions({


    [SET_GUEST_HOST] : (state, action) => {
        
        return {
            ...state,
            guest : action.payload
        }
    },


    [MAKE_BATTLE_ROOM] : (state, action) => {
        
        return {
            ...state,
            battleName : action.payload.battleName,
            level : action.payload.level,
        }
    },


    [SET_NICKNAME] : (state, action) => {
        
        return {
            ...state,
            nickname : action.payload
        }
    },

}, initialState)