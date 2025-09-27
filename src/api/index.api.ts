import axios from "axios";
import { MicrobioApi } from "./microbio.api.ts";

export const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  auth: {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  },
});

export const microbioApi = new MicrobioApi(apiAxios);
