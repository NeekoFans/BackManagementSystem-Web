
import axios from "axios";
import store from '../store'
// 使用element-plus ElMessage做消息提醒
import { ElMessage } from 'element-plus'

//1. 创建新的axios实例，
const service = axios.create({
  // 公共接口 开发环境还是线上环境也可以用api 公共地址，所有的请求都要跟它拼接，/api最后会被替换掉，在vite.config.js里
  baseURL: "/api",//baseURL作用：当我们在其它地方发起请求之后，url地址会被解析到这里，将/api和地址拼接到一起
  // 超时时间 单位是ms，这里设置了5s的超时时间
  timeout: 5000,//后端挂了，5s之后会报错
});
// 2.请求拦截器：所有的请求在发起之前都会执行下面的代码
service.interceptors.request.use(
  (config) => {
    //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.token = token; //如果要求携带在请求头中
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 3.响应拦截器：前端接收到后端传过来数据之后要做的事情
service.interceptors.response.use(
  (response) => {
    //接收到响应数据并成功后的一些共有的处理，关闭loading等
    //console.log(response);
    if (response && response.data) {
      const res = response.data;
      // if (res.code != 200) {//所有的后端的数据返回到前端的时候都是统一的数据结构，0是失败，200是成功
      //   ElMessage({//以EL开头的都是elementplus的消息弹出框
      //     message: res.msg ? res.msg : "接口有异常",
      //     type: 'error',
      //   })

      // }
      store.commit("setRes",res)
      return response.data
      
    }
    return response;
  },
  (error) => {
    /***** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      let msg = "";
      switch (error.response.status) {
        case 400:
          msg = "错误请求";
          break;
        case 401:
          msg = "未授权，请重新登录";
          break;
        case 403:
          msg = "拒绝访问";
          break;
        case 404:
          msg = "请求错误,未找到该资源";
          //window.location.href = "/NotFound"
          break;
        case 405:
          msg = "请求方法未允许";
          break;
        case 408:
          msg = "请求超时";
          break;
        case 500:
          msg = "服务器端出错";
          break;
        case 501:
          msg = "网络未实现";
          break;
        case 502:
          msg = "网络错误";
          break;
        case 503:
          msg = "服务不可用";
          break;
        case 504:
          msg = "网络超时";
          break;
        case 505:
          msg = "http版本不支持该请求";
          break;
        default:
          msg = `连接错误`;
      }
      ElMessage.error(msg);
      if (error.response.status == 401) {
        store.dispatch("logout")
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes("timeout")) {
        ElMessage.error("服务器响应超时，请刷新当前页");
      }
      else if (error.message) {
        ElMessage.error(error.message);
      } else {
        ElMessage.error("连接服务器失败");
      }

    }
    /***** 处理结束 *****/
    //如果不需要错误处理，以上的处理过程都可省略
    return Promise.resolve(error.response);
  }
);
//4.导出
export default service;

