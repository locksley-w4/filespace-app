import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthContextProvider";

const apiPort = 5000;
const apiURL = `http://localhost:${apiPort}/api/v1/`;

export const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((res) => res, useErrorResponse);

async function useErrorResponse(err) {
  const original_req = err.config;

  if (!original_req._retry && err.status === 401) {
    try {
      original_req._retry = true;

      const { data } = await api.post("/auth/refresh", {}, { _retry: true });

      if (!data.accessToken) {
        throw err;
      }

      localStorage.setItem("access-token", data.accessToken);
      return api(original_req);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return Promise.reject(err);
}
