export default [{
  name: '权限管理',
  icon: 'icon-yonhu',
  children: [{
    name: '角色配置',
    router: {
      name: 'jurisdiction'
    },
  }, {
    name: '接口管理',
    router: {
      name: 'interface'
    }
  }, {
    name: '角色绑定',
    router: {
      name: 'role'
    }
  }, {
    name: '菜单管理',
    router: {
      name: 'menu'
    }
  }]
}, {
  name: '系统配置',
  icon: 'icon-xinwen',
  children: [{
    name: '网站首页广告位',
    router: {
      name: 'adManage'
    }
  }, {
    name: '计量单位配置',
    router: {
      name: 'appUnit'
    }
  }, {
    name: '分类数据配置',
    router: {
      name: 'appData'
    }
  }]
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
    child: [{
      name: '已发布',
      router: {
        name: '/news/nlist/publish'
      }
    }, {
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
}]
