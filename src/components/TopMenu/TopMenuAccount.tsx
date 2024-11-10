import React, { useState, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/account.actions";
import pic from "../../assets/user_icon01.jpg";
import { IStateType } from "../../store/models/root.interface";


function TopMenuAccount(): JSX.Element {
  const dispatch: Dispatch<any> = useDispatch();
  const login_id: string = useSelector((state: IStateType) => state.account.login_id);
  const [isShow, setShow] = useState(false);

  return (

    <li className="nav-item dropdown no-arrow">
      <a className="nav-link dropdown-toggle"
        onClick={() => {
          setShow(!isShow);
        }}
        href="# "
        id="userDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="mr-2 d-none d-lg-inline small cadet">{login_id}</span>
        
        {/* 四角形の画像を指定すると〇にくり抜いてくれる */}
        {/* 画像は、ここら辺のサイトで良いのがある  https://www.ameamelog.com/cute-icon/ */}
        <img className="img-profile rounded-circle" alt=""
          // src="https://source.unsplash.com/QAB-WJcbgJk/60x60" />
          src={pic} />
      </a>

      <div className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${(isShow) ? "show" : ""}`}
        aria-labelledby="userDropdown">
        <a className="dropdown-item"
        onClick={() => dispatch(logout())}
        href="/login" 
        data-toggle="modal"
        data-target="#logoutModal">
          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
          Logout
        </a>
      </div>
    </li>
  );
};

export default TopMenuAccount;
