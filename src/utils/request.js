import axios from 'axios'
import { Message, Loading } from 'element-ui';

let reqConfig
let loading

//内存中正在请求的数量
let loadingNum=0;
function startLoading() {    
    if(loadingNum==0){
        loading = Loading.service({
          lock: false,
          text: '加载中...',
          background: 'transparent',  
        })
    }
    //请求数量加1
    loadingNum++;
}
function endLoading() {
    //请求数量减1
    loadingNum--
    if(loadingNum<=0){
        loading.close()
    }
}
const errorHandle = status => {
  // 判断状态码
  switch (status) {
    case 500:
      Message({
        message: '找不到此服务，可能是在路上~',
        type: 'error',
        duration: 3 * 1000
      });
      break;
    case 502:
        Message({
          message: '网关错误',
          type: 'error',
          duration: 3 * 1000
        });
        break;
    case 503:
      Message({
        message: '服务不可用，服务器暂时过载或维护',
        type: 'error',
        duration: 3 * 1000
      });
      break;
    case 404:
      Message({
        message: '发出的请求针对的是不存在的记录，服务器没有进行操作',
        type: 'error',
        duration: 3 * 1000
      });
      break;
    default:
      Message({
        message: '网络错误',
        type: 'error',
        duration: 3 * 1000
      });
  }

  return { data: '' }
}


const request = axios.create({
  // baseURL: '',
  timeout: 30*1000,
  withCredentials: true
});

// request拦截器
request.interceptors.request.use(
  config => { 
    reqConfig = config;
    if(config.url !== '/common/captchaImage' && config.url !== '/common/getPublicKey?' && config.url !== '/common/login') {
      config.headers['Authorization'] = localStorage.getItem('token') 
    }
    if(config.showLoading === true || config.showLoading === undefined) {
       startLoading();
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?';
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof(value) !== "undefined") {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + "=";
              url += subPart + encodeURIComponent(value[key]) + "&";
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
  return config
  },
  error => {
    Promise.reject(error)
  }
);

// response 拦截器
request.interceptors.response.use(
  // 请求成功
  res => {
    if(loading) {
      endLoading();
    }
    if(res.data.code === 200) {
      return res.data
    }else if (res.data.code === 401) {
      Message({
        message: '认证失败，重新登录',
        type: 'warning',
        duration: 3 * 1000
      });
      location.href= '/airweb/login'
    }else if(res.data.code && res.data.code !== 60001){
      Message({
        message: res.data.message || res.data.msg || '操作失败',
        type: 'error',
        duration: 3 * 1000
      });
    }
    if (reqConfig.method === 'put') {
      return Promise.resolve(res);
    }
    return res.data
  },
  err => {
    if(loading) {
      endLoading();
    }
    const { response } = err;
    if (response) {
      errorHandle(response.status, response.data);
      return Promise.reject(response.data);
    }
    return { data: '' };
  }
);

export default request;
