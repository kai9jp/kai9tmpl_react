export const SET_AUTO_LOGOFF_TIMER: string = "SET_AUTO_LOGOFF_TIMER";
export const SET_IS_AUTO_LOGOFF: string = "SET_IS_AUTO_LOGOFF";

export function setIsSetTimer(IsSetTimer:boolean): ISetIsSetTimerActionType {
    return { type: SET_AUTO_LOGOFF_TIMER,IsSetTimer:IsSetTimer};
 }
 
 export function setIsAutoLogOff(IsAutoLogoff:boolean): ISetIsAutoLogoffActionType {
    return { type: SET_IS_AUTO_LOGOFF,IsAutoLogoff:IsAutoLogoff};
 }
 
 interface ISetIsSetTimerActionType { type: string,IsSetTimer:boolean };
 interface ISetIsAutoLogoffActionType { type: string,IsAutoLogoff:boolean };
