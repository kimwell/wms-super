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
      path: 'staffManage',
      name: 'staffManage',
      component: resolve => require(['@/views/staffManage/index'], resolve),
      children: [{
        path: 'customer',
        name: 'customer',
        component: resolve => require(['@/views/staffManage/customer/index'], resolve),
      }, {
        path: 'merchant',
        name: 'merchant',
        component: resolve => require(['@/views/staffManage/merchant/index'], resolve),
      }]
    }, {
      path: 'processingManage',
      name: 'processingManage',
      component: resolve => require(['@/views/processingManage/index'], resolve),
      children: [{
        path: 'machining',
        name: 'machining',
        component: resolve => require(['@/views/processingManage/machining/index'], resolve),
      },{
        path: 'machiningDetail/:id/',
        name: 'machiningDetail',
        component: resolve => require(['@/views/processingManage/machining/detail/index'], resolve),
      },{
        path: 'joinDetail/:id/',
        name: 'joinDetail',
        component: resolve => require(['@/views/processingManage/machining/joinDetail/index'], resolve),
      }]
    }, {
      path: 'saleManage',
      name: 'saleManage',
      component: resolve => require(['@/views/saleManage/index'], resolve),
      children: [{
        path: 'saleOrder',
        name: 'saleOrder',
        component: resolve => require(['@/views/saleManage/saleOrder/index'], resolve),
      }]
    }, {
      path: 'financialManagement',
      name: 'financialManagement',
      component: resolve => require(['@/views/financialManagement/index'], resolve),
      children: [{
        path: 'balanceManagement',
        name: 'balanceManagement',
        component: resolve => require(['@/views/financialManagement/balanceManagement/index'], resolve),
      },{
        path: 'costSubject',
        name: 'costSubject',
        component: resolve => require(['@/views/financialManagement/costSubject/index'], resolve),
      },{
        path: 'receiptOrder',
        name: 'receiptOrder',
        component: resolve => require(['@/views/financialManagement/receiptOrder/index'], resolve),
      },{
        path: 'paymentOrder',
        name: 'paymentOrder',
        component: resolve => require(['@/views/financialManagement/paymentOrder/index'], resolve),
      },{
        path: 'addPaymentOrder',
        name: 'addPaymentOrder',
        component: resolve => require(['@/views/financialManagement/paymentOrder/add/index'], resolve),
      },{
        path: 'distributeSettlementManagement',
        name: 'distributeSettlementManagement',
        component: resolve => require(['@/views/financialManagement/distributeSettlementManagement/index'], resolve),
      },{
        path: 'supplierAmountManagement',
        name: 'supplierAmountManagement',
        component: resolve => require(['@/views/financialManagement/supplierAmountManagement/index'], resolve),
      },{
        path: 'supplierAmountAdd',
        name: 'supplierAmountAdd',
        component: resolve => require(['@/views/financialManagement/supplierAmountManagement/add/index'], resolve),
      },{
        path: 'scrapList',
        name: 'scrapList',
        component: resolve => require(['@/views/financialManagement/scrapList/index'], resolve),
      },{
        path: 'scrapDetail/:id/',
        name: 'scrapDetail',
        component: resolve => require(['@/views/financialManagement/scrapList/scrapDetail/index'], resolve),
      }]
    }, {
      path: 'dataAnalysisManagement',
      name: 'dataAnalysisManagement',
      component: resolve => require(['@/views/dataAnalysisManagement/index'], resolve),
      children: [{
        path: 'transactionData',
        name: 'transactionData',
        component: resolve => require(['@/views/dataAnalysisManagement/transactionData/index'], resolve),
      },{
        path: 'goodsSales',
        name: 'goodsSales',
        component: resolve => require(['@/views/dataAnalysisManagement/goodsSales/index'], resolve),
      },{
        path: 'hotSales',
        name: 'hotSales',
        component: resolve => require(['@/views/dataAnalysisManagement/hotSales/index'], resolve),
      },{
        path: 'InventoryStatistics',
        name: 'InventoryStatistics',
        component: resolve => require(['@/views/dataAnalysisManagement/InventoryStatistics/index'], resolve),
      }]
    },{
      path: 'stockManage',
      name: 'stockManage',
      component: resolve => require(['@/views/stockManage/index'], resolve),
      children: [{
        path: 'stockInto',
        name: 'stockInto',
        component: resolve => require(['@/views/stockManage/stockInto/index'], resolve),
      }, {
        path: 'goods',
        name: 'goods',
        component: resolve => require(['@/views/stockManage/goods/index'], resolve)
      },{
        path: 'warehouse',
        name: 'warehouse',
        component: resolve => require(['@/views/stockManage/warehouse/index'], resolve),
      },{
        path: 'stockOut',
        name: 'stockOut',
        component: resolve => require(['@/views/stockManage/stockOut/index'], resolve),
      },{
        path: 'stockCancel',
        name: 'stockCancel',
        component: resolve => require(['@/views/stockManage/stockCancel/index'], resolve),
      },{
        path: 'stockCancelDetail/:id/',
        name: 'stockCancelDetail',
        component: resolve => require(['@/views/stockManage/stockCancel/detail/index'], resolve),
      }]
    }, {
      path: 'systemManage',
      name: 'systemManage',
      component: resolve => require(['@/views/systemManage/index'], resolve),
      children: [{
        path: 'adManage',
        name: 'adManage',
        component: resolve => require(['@/views/systemManage/ad/adManage'], resolve),
      }, {
        path: 'appUnit',
        name: 'appUnit',
        component: resolve => require(['@/views/systemManage/unit/index'], resolve)
      }, {
        path: 'appData',
        name: 'appData',
        component: resolve => require(['@/views/systemManage/data/index'], resolve)
      }, {
        path: 'costManage',
        name: 'costManage',
        component: resolve => require(['@/views/systemManage/cost/index'], resolve)
      }, {
        path: 'densityManage',
        name: 'densityManage',
        component: resolve => require(['@/views/systemManage/density/index'], resolve)
      }, {
        path: 'formulaManage',
        name: 'formulaManage',
        component: resolve => require(['@/views/systemManage/formula/index'], resolve)
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
