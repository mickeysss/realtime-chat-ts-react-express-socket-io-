import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {StoreContextProvider} from "./helpers/StoreContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <StoreContextProvider>
            <App/>
        </StoreContextProvider>
    </BrowserRouter>
);
