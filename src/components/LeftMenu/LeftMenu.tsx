import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiFillDashboard } from "react-icons/ai";
import { FcNightLandscape } from "react-icons/fc";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import {AUT_NUM_NORMAL,AUT_NUM_ADMIN,AUT_NUM_READ_ONLY} from "../../common/constants";
import styles from './LeftMenu.module.css';  

const LeftMenu: React.FC = () => {

    const account: IAccount = useSelector((state: IStateType) => state.account);
    
    // ローカルストレージから初期状態を読み込み
    const getInitialState = (key: string, defaultValue: boolean) => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    };

    let [leftMenuVisibility, setLeftMenuVisibility] = useState(getInitialState('leftMenuVisibility', false));
    let [generalMenuVisibility, setGeneralMenuVisibility] = useState(getInitialState('generalMenuVisibility', true));  
    let [adminMenuVisibility, setAdminMenuVisibility] = useState(getInitialState('adminMenuVisibility', false));  

    // メニュー開閉のトグル関数
    function toggleMenu(menuVisibility: boolean, setMenuVisibility: React.Dispatch<React.SetStateAction<boolean>>, storageKey: string) {
        const newVisibility = !menuVisibility;
        setMenuVisibility(newVisibility);
        localStorage.setItem(storageKey, JSON.stringify(newVisibility));
    }

    useEffect(() => {
        localStorage.setItem('leftMenuVisibility', JSON.stringify(leftMenuVisibility));
    }, [leftMenuVisibility]);

    return (
        <Fragment>
            <div className="toggle-area">
                <button className="btn btn-primary toggle-button" onClick={() => setLeftMenuVisibility(!leftMenuVisibility)}>
                    <FcNightLandscape size={50}/> 
                </button>
            </div>

            <ul className={`${styles.menuContainer} navbar-nav bg-gradient-primary-green sidebar sidebar-dark accordion ${leftMenuVisibility ? '' : styles.collapsed}`}
                id="collapseMenu">

                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon icon-green rotate-n-15">
                    <FcNightLandscape size={50}/> 
                    </div>
                    <div className="sidebar-brand-text mx-3">Kai9 <sup>Opas</sup></div>
                </a>

                <hr className="sidebar-divider my-0" />

                <li className={`nav-item ${styles.navItem}`}>
                    <Link className={`nav-link ${styles.navLink}`} to="Home">
                    <i>
                        <AiFillDashboard size={30}/> 
                    </i> 
                    <span>ダッシュボード</span>
                    </Link>
                </li>
    
                <hr className="sidebar-divider" />

                {/* 一般メニュー */}
                <div  className={`${styles.largeText} sidebar-heading`} onClick={() => toggleMenu(generalMenuVisibility, setGeneralMenuVisibility, 'generalMenuVisibility')} style={{ cursor: 'pointer' }}>
                    一般メニュー　
                    <span className="menu-toggle-icon">
                        <i className={generalMenuVisibility ? "fas fa-square-minus" : "fas fa-square-plus"}></i>
                    </span>
                </div>

                <div className={generalMenuVisibility ? styles.expanded : styles.collapsed}>
                    <li className={`nav-item ${styles.navItem}`}>
                        <Link className={`nav-link ${styles.navLink}`} to="/single_table">
                            <i className="fas fa-fw fa-user"></i>
                            <span>シングル表</span>
                        </Link>
                    </li>

                    <li className={`nav-item ${styles.navItem}`}>
                        <Link className={`nav-link ${styles.navLink}`} to="/related_table">
                            <i className="fas fa-fw fa-code-branch"></i>
                            <span>関連表</span>
                        </Link>
                    </li>

                    <li className={`nav-item ${styles.navItem}`}>
                        <Link className={`nav-link ${styles.navLink}`} to="/sqlview">
                            <i className="fas fa-table-list"></i>
                            <span>SQLビューア</span>
                        </Link>
                    </li>
                </div>

                <hr className="sidebar-divider" />

                {/* 管理者メニュー */}
                <div  className={`${styles.largeText} sidebar-heading`} onClick={() => toggleMenu(adminMenuVisibility, setAdminMenuVisibility, 'adminMenuVisibility')} style={{ cursor: 'pointer' }}>
                    {account.authority_lv == AUT_NUM_ADMIN ? "管理者メニュー　" : "管理者メニュー(読取専用)　"}
                    <span className="menu-toggle-icon">
                        <i className={adminMenuVisibility ? "fas fa-square-minus" : "fas fa-square-plus"}></i>
                    </span>
               </div>

                <div className={adminMenuVisibility ? styles.expanded : styles.collapsed}>
                    <li className={`nav-item ${styles.navItem}`}>
                        <Link className={`nav-link ${styles.navLink}`} to="/sql">
                            <i className="fas fa-database"></i>
                            <span>SQL</span>
                        </Link>
                    </li>

                    <li className={`nav-item ${styles.navItem}`}>
                        <Link className={`nav-link ${styles.navLink}`} to="/app_env">
                            <i className="fas fa-fw fa-user"></i>
                            <span>環境設定</span>
                        </Link>
                    </li>
                </div>

                <hr className="sidebar-divider d-none d-md-block" />
            </ul>
        </Fragment>
    );
};

export default LeftMenu;
