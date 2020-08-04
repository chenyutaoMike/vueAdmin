import axios from 'axios';
import { getToken, getUserName } from './app';
import { Message } from 'element-ui';

const BASEURL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API : '/devapi';
const service = axios.create({
  baseURL: BASEURL,
  timeout: 10000
});


// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 后台需要前端这边传相关的参数(在请求头添加参数)
  // Tokey
  // userId
  // config.headers['Tokey'] = 'xxx';
  // 最终目的是在请求头添加参数
  config.headers['Tokey'] = getToken();
  config.headers['UserName'] = getUserName();

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const data = response.data;
  if (data.resCode !== 0) {
    Message.error(data.message)
    return Promise.reject(data)
  } else {
    return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service;