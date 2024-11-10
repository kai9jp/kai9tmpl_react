import React from "react";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./styles/sb-admin-2.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
//自作は「my.css」へ
import "./styles/my.css";
import {Provider} from "react-redux";
import store from "./store/store";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if ( container ) {
    const root = createRoot(container);
    root.render(<Provider store={store}><App /></Provider>);
}

serviceWorker.unregister();
