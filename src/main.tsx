import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import './index.scss';
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import locale from 'antd/locale/ru_RU';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={locale}>
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
