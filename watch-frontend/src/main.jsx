import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import AppInitializer from "./pages/AppWrapper.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>

          <AppInitializer>
              <App />
          </AppInitializer>

      </Provider>

  </StrictMode>,
)
