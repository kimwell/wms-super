import Vue from 'vue';
import iView from 'iview'
import Router from 'vue-router';
import store from '@/store/store'
import * as types from '@/store/types'
import VueLocalStorage from 'vue-ls';
import {
  resolve
} from 'path';

Vue.use(VueLocalStorage);
Vue.use(Router);


// 页面刷新时，重新赋值token
if (Vue.ls.get('authorization_bg')) {
  store.commit(types.LOGIN, {
    authorization: Vue.ls.get('authorization_bg'),
    loginId: Vue.ls.get('loginId_bg')
  })
}

const router = new Router({
  mode: 'history',
  base: '/bg/',
  routes: [{
    path: '/',
    name: '/',
    component: resolve => require(['@/views/index/index'], resolve),
    children: [{
      path: 'news',
      name: 'news',
      component: resolve => require(['@/views/news/index'], resolve),
      children: [{
        path: 'nadd/:id/:type',
        name: 'nadd',
        component: resolve => require(['@/views/news/nadd/index'], resolve)
      }, {
        path: 'nlist',
        name: 'nlist',
        redirect: 'nlist/publish',
        component: resolve => require(['@/views/news/nlist/index'], resolve),
        meta: {
          requireAuth: true
        },
        children: [{
          path: 'publish',
          name: 'publish',
          component: resolve => require(['@/views/news/nlist/publish/index'], resolve),
          meta: {
            requireAuth: true
          }
        }, {
          path: 'drafts',
          name: 'drafts',
          component: resolve => require(['@/views/news/nlist/drafts/index'], resolve),
          meta: {
            requireAuth: true
          }
        }]
      }, {
        path: 'nconfig',
        name: 'nconfig',
        component: resolve => require(['@/views/news/nconfig/index'], resolve)
      }]
    }, {
      path: 'staff',
      name: 'staff',
      component: resolve => require(['@/views/staff/index'], resolve),
      children: [{
        path: 'customer',
        name: 'customer',
        component: resolve => require(['@/views/staff/customer/index'], resolve),
      }, {
        path: 'merchant',
        name: 'merchant',
        component: resolve => require(['@/views/staff/merchant/index'], resolve),
      }]
    }, {
      path: 'stock',
      name: 'stock',
      component: resolve => require(['@/views/stock/index'], resolve),
      children: [{
        path: 'stockInto',
        name: 'stockInto',
        component: resolve => require(['@/views/stock/stockInto/index'], resolve),
      }, {
        path: 'goods',
        name: 'goods',
        component: resolve => require(['@/views/stock/goods/index'], resolve),
        redirect: 'goods/goodsManage',
        children: [{
          path: 'goodsManage',
          name: 'goodsManage',
          component: resolve => require(['@/views/stock/goods/manage/index'], resolve),
        }, {
          path: 'skuManage',
          name: 'skuManage',
          component: resolve => require(['@/views/stock/goods/sku/index'], resolve),
        }]
      }]
    }, {
      path: 'system',
      name: 'system',
      component: resolve => require(['@/views/system/index'], resolve),
      children: [{
        path: 'adManage',
        name: 'adManage',
        component: resolve => require(['@/views/system/ad/adManage'], resolve),
      }, {
        path: 'appUnit',
        name: 'appUnit',
        component: resolve => require(['@/views/system/unit/index'], resolve)
      }, {
        path: 'appData',
        name: 'appData',
        component: resolve => require(['@/views/system/data/index'], resolve)
      }, {
        path: 'costManage',
        name: 'costManage',
        component: resolve => require(['@/views/system/cost/index'], resolve)
      }, {
        path: 'densityManage',
        name: 'densityManage',
        component: resolve => require(['@/views/system/density/index'], resolve)
      }, {
        path: 'formulaManage',
        name: 'formulaManage',
        component: resolve => require(['@/views/system/formula/index'], resolve)
      }]
    }, {
      path: 'authority',
      name: 'authority',
      component: resolve => require(['@/views/authority/index'], resolve),
      children: [{
        path: 'interface',
        name: 'interface',
        component: resolve => require(['@/views/authority/interface/index'], resolve),
      }, {
        path: 'role',
        name: 'role',
        component: resolve => require(['@/views/authority/role/index'], resolve)
      }, {
        path: 'jurisdiction',
        name: 'jurisdiction',
        component: resolve => require(['@/views/authority/jurisdiction/index'], resolve)
      }, {
        path: 'menu',
        name: 'menu',
        component: resolve => require(['@/views/authority/menu/index'], resolve)
      }, {
        path: 'BindMenu',
        name: 'BindMenu',
        component: resolve => require(['@/views/authority/bindMenu/index'], resolve)
      }, {
        path: 'account',
        name: 'account',
        component: resolve => require(['@/views/authority/account/index'], resolve)
      }]
    }]
  }, {
    path: '/login',
    name: 'login',
    meta: {
      requireAuth: true
    },
    component: resolve => require(['@/views/login/index'], resolve),
  }],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    next();
  } else {
    if (store.state.authorization) {
      next();
    } else {
      iView.Modal.error({
        content: '登录过期，请重新登录。',
        onOk() {
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        }
      })
    }
  }
})

router.afterEach((to, from, next) => {

});

export default router;
