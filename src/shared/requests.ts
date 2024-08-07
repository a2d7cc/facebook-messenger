import axios, {InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Credentials} from './auth/models';
import {IP_ADDRESS} from '@env';

export const baseUrl = `http://${IP_ADDRESS ?? '10.0.2.2'}:4000`;

axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

const _retrieveConfigCredentials = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  try {
    const credentials = await AsyncStorage.getItem('credentials');

    if (credentials !== null) {
      const {token} = JSON.parse(credentials) as Credentials;
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log(error);
  }

  return config;
};

const getConfigWithHeaders = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  config.headers['content-type'] = 'application/json';
  // config.headers['Content-Type'] = 'application/json';
  return _retrieveConfigCredentials(config);
};

axios.interceptors.request.use(
  config => getConfigWithHeaders(config),
  error => {
    return Promise.reject(error);
  },
);

export const {get, post, put, delete: del} = axios;
