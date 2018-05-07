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
                path: 'dispatch',
                name: 'dispatch',
                component: resolve => require(['@/views/business/dispatch/index'], resolve),
                redirect: 'dispatch/treated',
                children: [{
                    path: 'treated',
                    name: 'treated',
                    component: resolve => require(['@/views/business/dispatch/treated/index'], resolve),
                }, {
                    path: 'untreated',
                    name: 'untreated',
                    component: resolve => require(['@/views/business/dispatch/untreated/index'], resolve),
                }]
            }, {
                path: 'republish',
                name: 'republish',
                component: resolve => require(['@/views/business/rePublish/index'], resolve),
            }, {
                path: 'ironBuys',
                name: 'ironBuys',
                component: resolve => require(['@/views/business/ironBuys/index'], resolve),
            },{
                path: 'order',
                name: 'order',
                component: resolve => require(['@/views/order/index'], resolve)
            }, {
                path: 'interface',
                name: 'interface',
                component: resolve => require(['@/views/interface/index'], resolve)
            }, {
                path: 'jurisdiction',
                name: 'jurisdiction',
                component: resolve => require(['@/views/jurisdiction/index'], resolve)
            }, {
                path: 'system',
                name: 'system',
                component: resolve => require(['@/views/system/index'], resolve),
                children: [{
                    path: 'dictionary',
                    name: 'dictionary',
                    component: resolve => require(['@/views/system/dictionary/index'], resolve)
                }, {
                    path: 'buyOffer',
                    name: 'buyOffer',
                    component: resolve => require(['@/views/system/buyOffer/index'], resolve)
                }, {
                    path: 'deposit',
                    name: 'deposit',
                    component: resolve => require(['@/views/system/deposit/index'], resolve)
                }]
            }, {
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
                path: 'application',
                name: 'application',
                component: resolve => require(['@/views/application/index'], resolve),
                children: [{
                    path: 'appUnit',
                    name: 'appUnit',
                    component: resolve => require(['@/views/application/unit/index'], resolve)
                }, {
                    path: 'appData',
                    name: 'appData',
                    component: resolve => require(['@/views/application/data/index'], resolve)
                }, {
                    path: 'appRelation',
                    name: 'appRelation',
                    component: resolve => require(['@/views/application/relation/index'], resolve)
                }, {
                    path: 'appSellerInfo',
                    name: 'appSellerInfo',
                    component: resolve => require(['@/views/application/sellerInfo/index'], resolve)
                }]
            }, {
                path: 'user',
                name: 'user',
                component: resolve => require(['@/views/user/index'], resolve),
                children: [{
                    name: 'role',
                    path: 'role',
                    component: resolve => require(['@/views/user/role/index'], resolve)
                }, {
                    name: 'grade',
                    path: 'grade',
                    component: resolve => require(['@/views/user/grade/index'], resolve)
                }, {
                    name: 'businessUser',
                    path: 'businessUser',
                    component: resolve => require(['@/views/user/business/index'], resolve)
                }, {
                    name: 'salesMan',
                    path: 'salesMan',
                    component: resolve => require(['@/views/user/salesMan/index'], resolve),
                    redirect: 'salesMan/salesManManagement',
                    children: [{
                        path: 'salesManBind',
                        name: 'salesManBind',
                        component: resolve => require(['@/views/user/salesMan/bind/index'], resolve)
                    },{
                        path: 'salesManManagement',
                        name: 'salesManManagement',
                        component: resolve => require(['@/views/user/salesMan/management/index'], resolve)
                    },{
                        path: 'salesManBusiness',
                        name: 'salesManBusiness',
                        component: resolve => require(['@/views/user/salesMan/business/index'], resolve)
                    },{
                        path: 'businessUse',
                        name: 'businessUse',
                        component: resolve => require(['@/views/user/salesMan/use/index'],resolve)
                    }]
                }, {
                    name: 'subaccount',
                    path: 'subaccount',
                    component: resolve => require(['@/views/user/subaccount/index'], resolve)
                }, {
                    name: 'examine',
                    path: 'examine',
                    component: resolve => require(['@/views/user/examine/index'], resolve)
                }, {
                    path: 'examineDetail/:id/:userId/:status',
                    name: 'examineDetail',
                    component: resolve => require(['@/views/user/examine/detail/index'], resolve)
                }]
            }, {
                path: 'marketing',
                name: 'marketing',
                component: resolve => require(['@/views/marketing/index'], resolve),
                children: [{
                    path: 'adManage',
                    name: 'adManage',
                    component: resolve => require(['@/views/marketing/ad/adManage'], resolve),
                }]
            }, {
                path: 'statistics',
                name: 'statistics',
                component: resolve => require(['@/views/statistics/index'], resolve),
                children: [{
                    path: 'countTransaction',
                    name: 'countTransaction',
                    component: resolve => require(['@/views/statistics/transaction/index'], resolve),
                }, {
                    path: 'countBuyer',
                    name: 'countBuyer',
                    component: resolve => require(['@/views/statistics/buyer/index'], resolve),
                }, {
                    path: 'countSeller',
                    name: 'countSeller',
                    component: resolve => require(['@/views/statistics/seller/index'], resolve),
                }, {
                    path: 'countArea',
                    name: 'countArea',
                    component: resolve => require(['@/views/statistics/area/index'], resolve),
                }, {
                    path: 'countGoods',
                    name: 'countGoods',
                    component: resolve => require(['@/views/statistics/goods/index'], resolve),
                }, {
                    path: 'countOrder',
                    name: 'countOrder',
                    component: resolve => require(['@/views/statistics/order/index'], resolve),
                    redirect: 'countOrder/orderCount',
                    children: [{
                        path: 'orderCount',
                        name: 'orderCount',
                        component: resolve => require(['@/views/statistics/order/orderCount/index'], resolve)
                    }, {
                        path: 'buyerCount',
                        name: 'buyerCount',
                        component: resolve => require(['@/views/statistics/order/buyerCount/index'], resolve)
                    }, {
                        path: 'sellerCount',
                        name: 'sellerCount',
                        component: resolve => require(['@/views/statistics/order/sellerCount/index'], resolve)
                    }, {
                        path: 'goodsCount',
                        name: 'goodsCount',
                        component: resolve => require(['@/views/statistics/order/goodsCount/index'], resolve)
                    }, {
                        path: 'areaCount',
                        name: 'areaCount',
                        component: resolve => require(['@/views/statistics/order/areaCount/index'], resolve)
                    }]
                }]
            }]
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                requireAuth: true
            },
            component: resolve => require(['@/views/login/index'], resolve),
        }
    ],
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