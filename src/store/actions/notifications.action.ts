export const ADD_NOTIFICATION: string = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION: string = "REMOVE_NOTIFICATION";
export const REMOVE_NOTIFICATION_PRE: string = "REMOVE_NOTIFICATION_PRE";


export function addNotification(title: string, text: string): IAddNotificationActionType {
    return { type: ADD_NOTIFICATION, text: text, title: title };
}

export function removeNotification(id: number): IRemoveNotificationActionType {
    return { type: REMOVE_NOTIFICATION, id: id };
}

export function removeNotification_pre(): IRemoveNotificationPreActionType {
    return { type: REMOVE_NOTIFICATION_PRE};
}

interface IAddNotificationActionType { type: string, text: string, title: string };
interface IRemoveNotificationActionType { type: string, id: number };
interface IRemoveNotificationPreActionType { type: string};
