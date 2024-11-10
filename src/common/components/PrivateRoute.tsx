import { Outlet } from "react-router";
import React ,{useState,Suspense,Dispatch,useEffect,useRef } from "react";
import Login from "../../components/Account/Login";
import axios from 'axios';
import {API_URL,AUTO_LOGOUT_SECONDS} from "../../common/constants";
import Notifications from "../../common/components/Notification";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import TopMenu from "../../components/TopMenu/TopMenu";
// import "../../styles/sb-admin-2.css";
import { IAccount } from "../../store/models/account.interface";
import { IAutoLogOff } from "../../store/models/autologoff.interface";
import { useSelector, useDispatch } from "react-redux";
import { IStateType} from "../../store/models/root.interface";
import { login,logout } from "../../store/actions/account.actions";
import { setIsSetTimer,setIsAutoLogOff } from "../../store/actions/autologoff.actions";
import { Location, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2';
import ErrorBoundary from './ErrorBoundary'
import { APP_TITLE } from "../../non_common/config";


export function PrivateRoute(): JSX.Element {  

    const dispatch: Dispatch<any> = useDispatch();

    const [loadingComplete, setLoadingComplete] = useState(false);

    //useSelectorする事で、account情報に変更が入った場合、再読み込みされる(認証切れになったらログイン画面が出る)
    const account: IAccount = useSelector((state: IStateType) => state.account);
    const autologoff: IAutoLogOff = useSelector((state: IStateType) => state.autologoff);

    //残り時間経過管理用
    const [remainingTime, setRemainingTime] = useState(AUTO_LOGOUT_SECONDS);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    //ページ遷移時に処理するカスタムフック
    //https://koredana.info/blog/reactjs-client-routing-change-event/
    const useLocationChange = (callback: (location: Location) => void) => {
        const refCallback = useRef<undefined | ((location: Location) => void)>()
        const location = useLocation()
      
        useEffect(() => {
          refCallback.current = callback
        }, [callback])
      
        // ロケーションに変更があったときに処理実行
        useEffect(() => {
          if (refCallback.current) {
            refCallback.current(location)
          }
        }, [location])
      }


    //バックエンドにJWTを送り認可チェックを行う(有効なトークンで認証済かを判定)
    const AuthFunc = async (): Promise<void> => {
        const utl1 = API_URL+'/api/check-auth';
        await axios.post(utl1, {}, {withCredentials: true})
        .then(function (response) {
            // 送信成功時の処理
    
            if (response.data.return_code!==200){
                //エラー等で弾かれた場合はエラー表示して抜ける
                if (response.data.return_code==2){
                    //トークンが無効な場合、ログオフ状態にする
                    setLoadingComplete(true);
                    dispatch(logout());
                }else{
                    //トークン認証以外ではエラーメッセージを表示する
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                        })
                }
                return;
            }
  
            setLoadingComplete(true);
            dispatch(login(
                response.data.user_id,
                response.data.modify_count,
                response.data.login_id,
                response.data.default_g_id,
                response.data.authority_lv
                ));
            })
        .catch(function (error) {
            // 送信失敗時の処理
    
            Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
            })
        });
      
    };
    
    //認証チェック(ログインIDが変わった場合)
    useEffect(() => {
        (!autologoff.IsAutoLogoff || (account.login_id !=="" ) )? AuthFunc():"";
        (account.login_id !== "")? dispatch(setIsAutoLogOff(false)):"";

        //一定時間経過で自動ログオフ
        if (!autologoff.IsSetTimer){
            dispatch(setIsSetTimer(true));
            setTimer();
            setEvents(resetTimer);
        }
    },[account.login_id]);
    
    //認証チェック(URLが変わった場合)
    useLocationChange(() => {
        AuthFunc();
    });

    //ブラウザのタブに表示するタイトルを設定
    useEffect(() => {
        document.title = APP_TITLE;
    },[]);

    //残り時間を減らすタイマーを設定
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, []);
    

    //一定時間経過で自動ログオフ
    //https://qiita.com/shigakin/items/5f0ab0c96a0b8f739a32
    const events = ['keydown', 'mousemove', 'click'];
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    // タイマー設定
    function setTimer() {
        timeoutIdRef.current = setTimeout(() => {
            dispatch(setIsAutoLogOff(true));
            dispatch(logout());
        }, AUTO_LOGOUT_SECONDS * 1000);
    }
    
    function resetTimer() {
        if (account.login_id !== "") {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            setTimer();
            setRemainingTime(AUTO_LOGOUT_SECONDS);
        }
    }
    // イベント設定
    function setEvents(func: EventListenerOrEventListenerObject) {
        events.forEach(event => {
            window.addEventListener(event, func, false);
        });
    }

    function clearEvents(func: EventListenerOrEventListenerObject) {
        events.forEach(event => {
            window.removeEventListener(event, func, false);
        });
    }
    
    useEffect(() => {
        setEvents(resetTimer);
    
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            clearEvents(resetTimer);
        };
    }, [account.login_id, dispatch]);    

    //残り時間を画面に表示するためのコンポーネント
    const RemainingTimeDisplay = () => {
        return (
            <div style={{ position: "absolute", top: 88, left: 140, backgroundColor: "white", padding: "5px", borderRadius: "5px", fontSize: "10px", zIndex: 9000 }}>
                残り: {remainingTime} 秒
            </div>
        );
    };
        
    //<Outlet /> でメニューを共通化
    //https://zenn.dev/monicle/articles/react-router-v6-suspense-idiom
    if(loadingComplete){    
        // 認証済 で IDが入っていればOK
        // if (authenticated && account.login_id !== ""){
        if (account.login_id !== "" && account.user_id && account.user_id !== 0){
                return (
            <>
                <div className="app-grid-container">
                    <LeftMenu />
                    {account.login_id === "z" && <RemainingTimeDisplay />}
                    <ErrorBoundary>
                    <div id="content-wrapper" className="d-flex flex-column" style={{position: "relative"}}>
                        <div id="content">
                            {/* トップメニューは絶対位置で浮かせているので、その分を埋めるエレメントを生成 */}
                            {/* TopMenu内のtopbarのcssで4.375remが定義されている */}
                            <div style={{height:"4.375rem"}}>
                                <TopMenu />
                            </div>
                            <div className="container-fluid" style={{height:"calc(100% - 4.375rem)", overflowX: "auto"}}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Outlet />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                    </ErrorBoundary>
                </div>                
            </>
            );
            // return <Route {...rest} children />
        }else{
            return <Login />
        }
    }else{
        //ログイン画面が出てしまわないように、認可チェック前の場合は「Loading...」を表示させる
        return ( <div> Loading... </div>);

    }
}