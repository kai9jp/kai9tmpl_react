import { RouteProps } from "react-router";
import React,{lazy} from "react";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import Login from "../../components/Account/Login";

const Home = lazy(() => import("../../components/Home/Home")); 
  

export function AccountRoute({ children, ...rest }: RouteProps): JSX.Element {

    const account: IAccount = useSelector((state: IStateType) => state.account);

    if (account.login_id){
        document.location = "/home";
        return <Home />
    }else{
        return <Login />
    }
}