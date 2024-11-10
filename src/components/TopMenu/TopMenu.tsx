import React from "react";
import TopMenuAccount from "./TopMenuAccount";
import styles from "./TopMenu.module.css";
import { useSelector } from "react-redux";
import { IStateType, IRootPageStateType } from "../../store/models/root.interface";
import { FcNightLandscape } from "react-icons/fc";
import Notifications from "common/components/Notification";

const TopMenu: React.FC = () => {

  const page: IRootPageStateType = useSelector((state: IStateType) => state.root.page);

  return (
    <nav className={`${styles.topbar} navbar navbar-expand navbar-light bg-custom-dark topbar mb-4 shadow fixed-top`}>

      {/* ロゴ */}
      <a className={`${styles.verticalCenter} sidebar-brand d-flex align-items-center justify-content-center`} href="index.html">
        <div className={`${styles.sidebarBrandIcon} sidebar-brand-icon icon-green rotate-n-15`}>
          <FcNightLandscape size={50} />
        </div>
      </a>

      {/* ロゴ横の文字 */}
      <div className={`${styles.kai9text} mx-3`}>Kai9 <sup>/Tmpl</sup></div>

      {/* ページの階層を表すリスト */}
      <ol className={`${styles.breadcrumb} ${styles.darkBreadcrumb} flex-grow-1 list-unstyled mb-0 d-flex align-items-center`}>
        <li className={`${styles.breadcrumbItem} pr-2`}><a href="#">{page ? page.area : null}</a></li>
        <li className={`${styles.breadcrumbItem} pl-2`}><a href="#">{page ? page.subArea : null}</a></li>
      </ol>

      <div className={`${styles.alignItemsCenterCustom} d-flex`}>
        {/* 右側のアカウント情報 */}
        <div className={`${styles.topbarDivider} d-none d-sm-block`}></div>
        <div className={`${styles.verticalCenter}`} style={{ position: "relative", top: "-10px" }}>
          <TopMenuAccount />
        </div>

        {/* 通知ボックス */}
        <div style={{ position: "absolute", top: "0px", right: "-60px", zIndex: "9999" }}>
          <Notifications />
        </div>

        
      </div>

    </nav>
  );
};

export default TopMenu;
