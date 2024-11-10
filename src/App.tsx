import React,{lazy} from "react";
import "./App.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Login from "./components/Account/Login";
import { PrivateRoute } from "./common/components/PrivateRoute";
import { AccountRoute } from "./common/components/AccountRoute";

const Home = lazy(() => import("./components/Home/Home")); 
const App_env = lazy(() => import("./components/App_env/App_env"));
const Single_table = lazy(() => import("./components/Single_table/Single_table"));
const Related_table = lazy(() => import("./components/Related_table/Related_table"));
const Sql = lazy(() => import("./components/Sql/Sql"));
const SqlView = lazy(() => import("./components/SqlView/SqlView"));

const App: React.FC = () => {
  return (
    <div className="App" id="wrapper">
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route path="/*" element={<Home/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/app_env" element={<App_env/>} />
              <Route path="/single_table" element={<Single_table/>} />
              <Route path="/related_table" element={<Related_table/>} />
              <Route path="/sql" element={<Sql/>} />
              <Route path="/sqlview" element={<SqlView/>} />
              </Route> 

            <Route element={<AccountRoute/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home/>} />
            </Route> 
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
