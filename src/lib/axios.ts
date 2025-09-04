import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://brain-sync-api.vercel.app/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    return Promise.reject(error);
  }
);
