import React, { useState, FormEvent, Dispatch } from "react";
import { OnChangeModel } from "../../non_common/types/Form.types";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/actions/account.actions";
import TextInput from "../../common/components/TextInput";
import axios from 'axios';
import {API_URL,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import { IStateType, INotificationState } from "../../store/models/root.interface";
import { authenticateUser } from "../../common/comUtil";

const Login: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);

  const [formState, setFormState] = useState({
    login_id: { error: "", value: "" },
    password: { error: "", value: "" },
    auth_error: "",
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  async function submit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if(isFormInvalid()) { return; }

    //APIで認証
    try {
      const response = await authenticateUser(API_URL, formState);
      if (response){
        dispatch(login(
            response.data.user_id,      //responseで戻さないので、ここではnull。login_id以外は、この後のcheck-authで処理している
            response.data.modify_count,
            formState.login_id.value,
            response.data.default_g_id,
            response.data.authority_lv
            ));

          dispatch(addNotification("ようこそ", `ユーザ： ${formState.login_id.value}`));
          //10秒後に消す
          setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);
        }
    } catch (err: any) {
      setFormState({ ...formState,auth_error: err.message});
    }
  }

  function isFormInvalid() {
    return (formState.login_id.error || formState.password.error
      || !formState.login_id.value || !formState.password.value);
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid() as boolean;
    return isError ? "disabled" : "";
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">ようこそ!</h1>
                      {/*formState.auth_error で 認証エラー画面を表示 */}
                      <h1 className="h6 text-red-900 mb-4">{formState.auth_error}</h1>  
                                             
                    </div>
                    <form className="user" onSubmit={submit}>
                      <div className="form-group">

                        <TextInput id="input_email"
                          field="login_id"
                          value={formState.login_id.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          inputMode="numeric"
                          isImeDisble={true}
                          label="ログインID"
                          placeholder="Login ID" />
                      </div>
                      <div className="form-group">
                        <TextInput id="input_password"
                          field="password"
                          value={formState.password.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="password"
                          label="パスワード"
                          placeholder="Password" />
                      </div>
                      <button
                        className={`btn btn-primary btn-user btn-block ${getDisabledClass()}`}
                        id="logon_button"
                        type="submit"
                      >
                        Sign in
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
