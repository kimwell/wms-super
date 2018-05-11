import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'
import VueLocalStorage from 'vue-ls';

Vue.use(VueLocalStorage);
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: {},
        authorization: undefined,
        loginId: undefined,
        pushData: '',
        menuData: []
    },
    getters: {
        roleId: state => {
            //写死的超管id,后期修改为从state user中获取
            return '297e89536343f6d8016343f6ef650000'
        },
        loginId: state => {
            //写死的超管id,后期修改为从state user中获取
            return state.loginId
        },
        authorization: state => {
            //写死的超管id,后期修改为从state user中获取
            return state.authorization
        },
        pushData: state => {
            return state.pushData
        },
        menuData: state => {
            return state.menuData
        },
        user: state => {
            return state.user
        }
    },
    mutations: {
        [types.LOGIN]: (state, payload) => {
            Vue.ls.set('authorization_bg', payload.authorization);
            Vue.ls.set('loginId_bg', payload.loginId);
            state.authorization = payload.authorization;
            state.loginId = payload.loginId;
        },
        [types.LOGOUT]: (state) => {
            Vue.ls.remove('authorization_bg');
            Vue.ls.remove('loginId_bg');
            state.authorization = undefined;
            state.loginId = undefined;
        },
        // 消息推送commit
        [types.UPDATE_PUSH_MSG]: (state, payload) => {
            state.pushData = payload;
        },
        [types.MENU_DATA]: (state, payload) => {
            state.menuData = payload;
        },
        [types.USER]: (state, payload) => {
            state.user = payload;
        }
    }
})