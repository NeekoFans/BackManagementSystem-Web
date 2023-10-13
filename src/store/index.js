import { createStore } from "vuex";
import createPersistedstate from 'vuex-persistedstate'
const store=createStore({
    state:{
    account:"admin",
    append:"",
    res:"",
    msg:"",
    list:[],
    user:{}
    },
    mutations:{
        setAccount(state,payload){
            state.account=payload
        },
        setAppend(state,payload){
            state.append=payload
        },
        setRes(state,payload){
            state.res=payload
        },
        setMsg(state,payload){
            state.msg=payload
        },
        setUser(state,payload){
            state.user=payload
        },
        toggleMenu (state) {//切换汉堡按钮的伸缩状态值
            state.siderType = !state.siderType
          },
    },
    actions:{
        logout ({ commit }) {
            //为了清空state状态
            commit("setToken", "")
            commit("setPhotoUrl", "")
            //清除本地存储的数据
            localStorage.clear();
            sessionStorage.clear();
            //弹到登录页
            router.replace("/login")
          }
    },
    getters:{},
    plugins:[
        createPersistedstate({
             key:"vuex",
        })
    ]
})
export default store