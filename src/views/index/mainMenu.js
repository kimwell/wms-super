export default [{
        name: '业务管理',
        icon: 'icon-yewu',
        children: [{
                name: '现货求购管理',
                router: {
                    name: 'ironBuys'
                }
            },
            {
                name: '代客发布求购',
                router: {
                    name: 'republish'
                }
            }, {
                name: '求购调度管理',
                router: {
                    name: 'dispatch'
                },
                child:[{
                    name: '需要处理的任务',
                    router: {
                        name: '/dispatch/treated'
                    }
                },{
                    name: '已处理的任务',
                    router: {
                        name: '/dispatch/untreated'
                    }
                }]
            }
        ]
    }, {
        name: '订单管理',
        icon: 'icon-dingdan',
        children: [{
            name: '订单管理',
            router: {
                name: 'order'
            }
        }]
    },
    {
        name: '营销',
        icon: 'icon-weixinyingxiaohuodong',
        children: [{
            name: '网站首页广告位',
            router: {
                name: 'adManage'
            }
        }]
    },
    {
        name: '权限',
        icon: 'icon-moban',
        children: [{
            name: '角色配置',
            router: {
                name: 'jurisdiction'
            }
        }]
    },
    {
        name: '接口',
        icon: 'icon-jiekou',
        children: [{
            name: '接口管理',
            router: {
                name: 'interface'
            }
        }]
    },
    {
        name: '用户管理',
        icon: 'icon-yonhu',
        children: [{
            name: '角色绑定',
            router: {
                name: 'role'
            }
        }, {
            name: '商家求购等级',
            router: {
                name: 'grade'
            }
        }, {
            name: '商家用户管理',
            router: {
                name: 'businessUser'
            }
        }, {
            name: '平台专员管理',
            router: {
                name: 'salesMan'
            },
            child:[{
                name: '专员管理查询',
                router: {
                    name: '/user/salesMan/salesManManagement'
                }
            },{
                name: '专员绑定管理',
                router: {
                    name: '/user/salesMan/salesManBind'
                }
            },{
                name: '专员负责商户',
                router: {
                    name: '/user/salesMan/salesManBusiness'
                }
            },{
                name: '商户使用分析',
                router: {
                    name: '/user/salesMan/businessUse'
                }
            }]
        }, {
            name: '商家子账号管理',
            router: {
                name: 'subaccount'
            }
        }, {
            name: '商家用户审核',
            router: {
                name: 'examine'
            }
        }]
    },
    {
        name: '应用',
        icon: 'icon-app',
        children: [{
                name: '计量单位配置',
                router: {
                    name: 'appUnit'
                }
            }, {
                name: '分类数据配置',
                router: {
                    name: 'appData'
                }
            }, {
                name: '关联配置管理',
                router: {
                    name: 'appRelation'
                }
            },
            {
                name: '卖家基础信息管理',
                router: {
                    name: 'appSellerInfo'
                }
            }
        ]
    }, {
        name: '新闻管理',
        icon: 'icon-xinwen',
        children: [{
            name: '新建新闻内容',
            router: {
                name: 'nadd',
                params: {
                    id: 0,
                    type: 'add'
                }
            }
        }, {
            name: '新闻内容管理',
            router: {
                name: 'nlist'
            },
            child:[{
                name: '已发布',
                router: {
                    name: '/news/nlist/publish'
                }
            },{
                name: '草稿箱',
                router: {
                    name: '/news/nlist/drafts'
                }
            }]
        }, {
            name: '新闻中心配置',
            router: {
                name: 'nconfig'
            }
        }]
    }, {
        name: '数据统计',
        icon: 'icon-iconset0358',
        children: [{
                name: '平台数据分析',
                router: {
                    name: 'countTransaction'
                }
            }, {
                name: '买家数据分析',
                router: {
                    name: 'countBuyer'
                }
            }, {
                name: '卖家数据分析',
                router: {
                    name: 'countSeller'
                }
            }, {
                name: '热门地区分析',
                router: {
                    name: 'countArea'
                }
            }, {
                name: '货品数据分析',
                router: {
                    name: 'countGoods'
                }
            },
            // {
            //   name: '订单数据统计分析',
            //   router: {
            //     name: 'countOrder'
            //   }
            // }
        ]
    },
    {
        name: '系统配置',
        icon: 'icon-xitong',
        children: [{
            name: '求购报价配置',
            router: {
                name: 'buyOffer'
            }
        }, {
            name: '数据字典',
            router: {
                name: 'dictionary'
            }
        }, {
            name: '商家保证金配置',
            router: {
                name: 'deposit'
            }
        }]
    }
]