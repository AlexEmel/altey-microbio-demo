import { TRootState, useAppDispatch } from "@/store/store.ts";
import { Store } from "@reduxjs/toolkit";
import axios from "axios";
import { MicrobioApi } from "./microbio.api.ts";

type AppStore = Store<TRootState>;

export const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  auth: {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  },
});

let appStore: AppStore;
export let appDispatch: ReturnType<typeof useAppDispatch>;

export const appInjectStore = (store: AppStore) => {
  appStore = store;
  appDispatch = store.dispatch;
};

export const microbioApi = new MicrobioApi(apiAxios);
