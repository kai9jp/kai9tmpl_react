import React, { Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { INotification } from "../../store/models/notification.interface";
import { removeNotification } from "../../store/actions/notifications.action";
import styles from "./Notification.module.css";
import { REMOVE_NOTIFICATION_SECONDS } from "../constants";

/**
 * 通知コンポーネント
 */
const Notifications: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  // Redux Store の state から通知のリストを取得
  const notifications: INotification[] = useSelector((state: IStateType) =>
    state.notifications.notifications
  );

  /**
   * 通知を閉じるための関数
   * @param id {number} 閉じる通知の ID
   */
  function closeNotification(id: number) {
    dispatch(removeNotification(id)); 
  }


  // 通知が自動で消えるように設定
  useEffect(() => {
    const timers = notifications.map(notification => 
      setTimeout(() => closeNotification(notification.id), REMOVE_NOTIFICATION_SECONDS)
    );

    // コンポーネントがアンマウントされるか、通知が更新されるときにタイマーをクリア
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]); 

  // 通知ボックス
  const notificationList = notifications.map((notification) => {
    return (
      <div className={styles.toast} key={`notification_${notification.id}`}>
        <div className={styles.toastHeader}>
          {/* ベルアイコン */}
          <i className="fas fa-fw fa-bell"></i>
          {/* 通知タイトル */}
          <strong className="mr-auto">{notification.title}</strong>
          {/* 通知日時 */}
          <small>
            {notification.date.toLocaleTimeString(navigator.language, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
          {/* 閉じるボタン */}
          <button
            type="button"
            id="toast_close_btn"
            className="ml-2 mb-1 close"
            data-dismiss="toast"
            aria-label="Close"
            onClick={() => closeNotification(notification.id)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {/* 通知本文 */}
        <div className={`${styles.toastBody} toast-body`}>{notification.text}</div>
      </div>
    );
  });

  // 通知ボックスをラッパーで包んで返す
  return (
    <div className={styles.toastWrapper}>
      {notificationList}
    </div>
  );
};

export default Notifications;
