export const baseAliyun = 'http://tbxoss.oss-cn-hangzhou.aliyuncs.com/';

// WebSocket链接
let host = window.location.host;

export let ws = '';
let commHost = ''
export let exportExcel = ''
if (process.env.NODE_ENV == 'development') {
  ws = 'ws://192.168.0.251:7397';
  commHost = 'http://192.168.0.251:7070'
  exportExcel = 'http://192.168.0.164:8080/export.jsp'
} else {
  ws = 'ws://192.168.0.251:7397';
  exportExcel = 'http://' + host + ':8080/export.jsp'
}

export const uploadApi = commHost + '/common/fileUpload/images';

// export const exportExcel ='http://'+ host + ':8080/export.jsp'
// export const exportExcel = commHost + '/export.jsp'


/**
 * 登录
 * path: /login/userLogin
 * method: POST
 * params: {
 *      mobile: String
 *      password: String
 * }
 */
export const login = '/login/userLogin';

/**
 * 获取所有角色列表
 */
export const findRoleList = '/login/findRoleList';

/**
 * 获取所有角色列表
 */
export const findRoleListByModel = '/login/findRoleListByModel';



/**
 * 获取用户信息
 */
export const getUser = '/api/user/findCurrentUser';

/**
 * 地址选择省，市，区
 */
export const findAdress = ''

export const findProvince = '/api/query/findProvince'

export const findCity = '/api/query/findCity'

export const findArea = '/api/query/findArea'

export const findDistrict = '/api/query/findDistrict'


// *********************************权限管理*********************************
/**
 * 查询权限列表
 * path: /sys/auth/role/findAll
 * method: POST
 * params: 
 */
export const getAllRoles = '/sys/auth/role/findAll'

/**
 * 添加角色
 * path: /sys/auth/role/save
 * method: POST
 * params: {
 *      name: 角色名称,
 *      id:  角色编号
 * }
 */
export const addRole = '/sys/auth/role/save'

/**
 * 编辑角色
 * path: /sys/auth/role/update
 * method: POST
 * params: {
 *      name: 角色名称,
 *      id:  角色编号
 * }
 */
export const editRole = '/sys/auth/role/update'

/**
 * 删除角色
 */
export const delRole = '/sys/auth/role/delRole'
/**
 * 按角色编号查询子角色
 * path: /sys/auth/role/findById
 * method: POST
 * params: {
 *      roleId:   角色编号
 * }
 */
export const getRolesById = '/sys/auth/role/findById'

/**
 * 角色接口查询
 * path: /sys/auth/interface/findRoleInterfaceByid
 * method: POST
 * params: {
 *      roleId:   角色编号
 * }
 */
export const getInterfaceById = '/sys/auth/interface/findRoleInterfaceByid'

/**
 * 角色绑定接口
 * path: /sys/auth/interface/saveRoleInterface
 * method: POST
 * params: {
 *      jsonObject: 包含roleId:角色编号，interfaceGroupList:分组接口列表
 * }
 */
export const roleBlindInterface = '/sys/auth/interface/saveRoleInterface'


// *********************************接口管理*********************************
/**
 * 添加单个接口
 * path: /sys/auth/interface/save
 * method: POST
 * params: {
 *      name:  名称
 *      url:    接口地址
 *      methodType: 接口类型 0,1,2,3,4
 * }
 */
export const addInterface = '/sys/auth/interface/save'

/**
 * 删除单个接口
 * path: /sys/auth/interface/delInterface
 * method: POST
 * params: {
 *      id:  接口id
 * }
 */
export const delInterface = '/sys/auth/interface/delInterface'

/**
 * 获取接口列表
 * path: /sys/auth/interface/findGroupAll
 * method: POST
 * params: null
 */
export const getInterfaceList = '/sys/auth/interface/findGroupAll'

/**
 * 添加、修改接口分组信息
 * path: /sys/auth/group/save
 * method: POST
 * parmas: {
 *      name: 分组名
 *      id:   修改时传入
 * }
 */
export const addInterfaceGroup = '/sys/auth/group/save'

/**
 * 删除接口分组
 * path: 
 * method: POST
 * params: {
 *      groupId : 分组ID
 * }
 */
export const delInterfaceGroup = '/sys/auth/group/delGroup'

/**
 * 接口绑定分组
 * path: /sys/auth/interface/saveGroup
 * method: POST
 * params: {
 *      jsonObject :  分组列表字符串
 * }
 */
export const interfaceBlindGroup = '/sys/auth/interface/saveGroup'



// *********************************应用管理*********************************
/**
 * 添加基础计量单位
 * path: /sys/unit/saveUnit
 * method: POST
 * params: {
 *      type:   
 *      cName: 
 *      eName:
 * }
 */
export const addUnit = '/sys/unit/saveUnit'

/**
 * 更新计量单位，用于修改，删除
 * path: /sys/unit/updateUnit
 * method: POST
 * params{
 *      id:
 *      type:   
 *      cName: 
 *      eName:
 *      status:  
 * }
 */
export const updateUnit = '/sys/unit/updateUnit'

/**
 * 查询基础计量单位列表
 * path: /sys/unit/queryUnitPage
 * method: POST
 * params: {
 *      currentPage,
 *      pageSize
 * }
 */
export const getAllUnits = '/sys/unit/queryUnitPage'

export const G_getAllUnits = '/api/query/queryUnitList'

/**
 * 查询品类计量单位信息
 * path: /sys/ironAndUnit/fingIronAndUnitPage
 * method: POST
 * params: {
 *      currentPage,
 *      pageSize   
 * }
 */
export const getAllIronUnit = '/sys/ironAndUnit/findIronAndUnitPage'

/**
 * 更新计量单位品类信息
 * path: /sys/ironAndUnit/updateIronAndUnit
 * method: POST
 * params: {
 *      id: 
 *      ironId: 
 *      ironName:  
 * }
 */
export const updateIronUnit = '/sys/ironAndUnit/updateIronAndUnit'

// -----------------------------------品类---------------------------------

/**
 * 添加品类信息
 * path: /sys/ironTypes/saveIronTypes
 * method: POST
 * params: {
 *      name:
 *      notice:
 * }
 */
export const addType = '/sys/ironType/saveIronType'

/**
 * 更新品类信息
 * path: /sys/ironTypes/updateIronTypes
 * method: POST
 * params: {
 *      id:
 *      name:
 *      notice:
 *      status:
 * }
 */
export const updateType = '/sys/ironType/modifyIronTypeSort'


/**
 * 查询品类信息
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const getTypes = '/sys/ironType/findIronTypeList'

/**
 * 删除品类信息
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const deleteIronType = '/sys/ironType/deleteIronType'


export const G_getTypes = '/sys/ironType/findAllIronType'

// -----------------------------------表面---------------------------------
/**
 * 添加表面信息
 * path: /sys/surface/saveSurface
 * method: POST
 * params: {
 *      name:
 *      notice:
 * }
 */
export const addSurface = '/sys/surface/saveSurface'

/**
 * 更新表面信息
 * path: /sys/surface/updateSurFace
 * method: POST
 * params: {
 *      id:
 *      name:
 *      notice:
 *      status:
 * }
 */
export const updateSurFace = '/sys/surface/modifySurfaceSort'


/**
 * 查询表面信息
 * path: /sys/surface/findSurfacePage
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const getSurFaces = '/sys/surface/findSurfaceList'


/**
 * 查询表面信息
 * path: /sys/surface/findSurfacePage
 * method: POST
 * params: {
 *      id
 * }
 */
export const deleteSurface = '/sys/surface/deleteSurface'



export const G_getSurFaces = '/api/query/findSurFace'

// -----------------------------------材质---------------------------------
/**
 * 添加材质信息
 * path: /sys/materials/saveMaterials
 * method: POST
 * params: {
 *      name:
 *      notice:
 * }
 */
export const addMaterials = '/sys/materials/saveMaterials'

/**
 * 更新材质信息
 * path: /sys/materials/updateMaterials
 * method: POST
 * params: {
 *      id:
 *      name:
 *      notice:
 *      status:
 * }
 */
export const updateMaterials = '/sys/material/modifyMaterialSort'


/**
 * 查询材质信息
 * path: /sys/materials//findMaterialsPage
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const getMaterials = '/sys/material/findMaterialList'


/**
 * 删除材质信息
 * path: /sys/materials//findMaterialsPage
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const deleteMaterial = '/sys/material/deleteMaterial'



// -----------------------------------产地---------------------------------
/**
 * 添加产地信息
 * path: /sys/proPlaces/saveProPlaces
 * method: POST
 * params: {
 *      name:
 *      notice:
 * }
 */
export const addProPlaces = '/sys/proplace/saveProPlace'

/**
 * 更新产地信息
 * path: /sys/proPlaces/updateProPlaces
 * method: POST
 * params: {
 *      id:
 *      name:
 *      notice:
 *      status:
 * }
 */
export const updateProPlaces = '/sys/proplace/modifyProPlaceSort'


/**
 * 查询产地信息
 * path: /sys/proPlaces/findProPlacesPage
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const getProPlaces = '/sys/proplace/findProPlaceList'

/**
 * 删除产地信息
 * path: /sys/proplace/deleteProPlace
 * method: POST
 * params: {
 *      id
 *      
 * }
 */
export const deleteProPlace = '/sys/proplace/deleteProPlace'



/**
 * 查询所有品类
 */
export const findAllIronType = '/sys/ironType/findAllIronType'

/**
* 查询所有表面
*/
export const findAllSurface = '/sys/surface/findAllSurface'

/**
* 查询所有材质
*/
export const findAllMaterial = '/sys/material/findAllMaterial'

/**
* 查询所有产地
*/
export const findAllProPlace = '/sys/proplace/findAllProPlace'

// -----------------------------------仓库---------------------------------
/**
 * 添加产地信息
 * path: /sys/storeHouse/saveStoreHouse
 * method: POST
 * params: {
 *      name:
 *      notice:
 * }
 */
export const saveStoreHouse = '/sys/storeHouse/saveStoreHouse'

/**
 * 更新擦库信息
 * path: /sys/storeHouse/updateStoreHouse
 * method: POST
 * params: {
 *      id:
 *      name:
 *      notice:
 *      status:
 * }
 */
export const updateStoreHouse = '/sys/storeHouse/updateStoreHouse'

/**
 * 删除仓库信息
 * path: /sys/storeHouse/updateStoreHouse
 * method: POST
 * params: {
 *      id:
 *      name:
 *      notice:
 *      status:
 * }
 */

export const deleteStoreHouse = '/sys/storeHouse/deleteStoreHouse'


/**
 * 查询仓库信息
 * path: /sys/storeHouse/findStoreHousePage
 * method: POST
 * params: {
 *      currentPage
 *      pageSize
 * }
 */
export const getHouse = '/sys/storeHouse/findStoreHousePage'

/**
 * 查询所有仓库信息
 * path: /api/query/findStoreHouse
 * method: POST
 */
export const getStroeHouse = '/api/query/findStoreHouse'




// *********************************用户管理*********************************
/**
 * 添加、编辑用户
 * path: /sys/auth/user/bindUserRole
 * method: POST
 * params: {
 *      jsonObject: {
 *          id: '',//编辑用
 *          name
 *          password
 *          mobile
 *          realName
 *          roleList: [{
 *              roleId
 *              flag
 *          }]
 *      }//json字符串
 * }
 */
export const createUser = '/sys/auth/user/bindUserRoles'

/**
 * 获取用户列表
 * path: /sys/auth/user/findRoleList
 * method: POST
 * params: {
 *      currentPage,
 *      pageSize 
 * }
 */
export const userList = '/sys/auth/user/findRoleList'

/**
 * 查询用户信息
 * path: /sys/auth/user/findRole
 * method: POST
 * params: {
 *      id: 不传为所有角色
 * }
 */
export const getUserInfo = '/sys/auth/user/findRole'

/**
 * 获取角色列表
 * path: /sys/auth/user/findRole
 * method: POST
 * params: {
 *      id:  不传为所有角色
 * }
 */
export const getRoleList = '/sys/auth/user/findRole'


/*
 * 专员管理查询
 * path:/sys/saleman/findSalemanBind
 */
export const getSalemanBind = '/sys/saleman/findSalemanBind'

/*
 * 超管查询专员信息
 * path:/sys/saleman/findSalemanBind
 */
export const findSalemanInfos = '/sys/saleman/findSalemanInfo'



// *********************************广告位管理*********************************
/**
 * 查询所有广告
 * path: /sys/ad/findAll
 * method: POST
 * params: 
 */
export const allAd = '/sys/ad/findAll';

/**
 * 添加广告位分组
 * path: /sys/ad/saveAdGroup
 * method: POST
 * params: {
 *      groupName: String 分组名
 *      adNums: Number  初始广告位个数  
 *      width: Number   初始广告位宽度
 *      height: Number   初始广告位高度
 *      previewImg:  String   效果图
 *      defaultImg:  String   默认背景图    
 * }
 */
export const addAdGroup = '/sys/ad/saveAdGroup';

/**
 * 删除广告分组
 * path: /sys/ad/delAdGroup
 * method: POST
 * params: {
 *      groupId: 分组ID
 * }
 */
export const delAdGroup = '/sys/ad/delAdGroup';

/**
 * 获取单个广告分组信息
 * path: /sys/ad/findAdByGroupId
 * method: POST
 * params: {
 *      groupId: 分组ID
 * }
 */
export const getAdGroup = '/sys/ad/findAdByGroupId';


/**
 * 更新广告位分组
 * path: /sys/ad/updateAdGroup
 * method: POST
 * params: jsonObject String
 */
export const updateGroup = '/sys/ad/updateAdGroup';
/**
 * 编辑广告分组信息
 * method: POST
 * params: {
 *      id:  groupId     分组id
 *      groupName: String 分组名
 *      adNums: Number  初始广告位个数  
 *      width: Number   初始广告位宽度
 *      height: Number   初始广告位高度
 *      previewImg:  String   效果图
 *      defaultImg:  String   默认背景图    
 * }
 */
export const editGroup = '/sys/ad/editAdGroup';

/**
 * 单个广告位数据获取
 * path:/sys/ad/findAdByGroupId
 * method:POST
 * params:groupId
 */
export const adList = '/sys/ad/findAdByGroupId';

/**
 * 删除单个广告位
 * path: /sys/ad/delAdInfo
 * method: POST
 * params: {
 *      id: 广告位id
 *      groupId:  分组ID 
 * }
 */
export const removeAd = '/sys/ad/delAdInfo';

/**
 * 添加单个广告位
 * path: /sys/ad/saveAd
 * method: POST
 * params: {
 *      groupId: 分组ID
 * }
 */
export const addAd = '/sys/ad/saveAd';


// -----------------------------------新闻管理---------------------------------
/**
 * 查询所有文章类型
 */
export const findAllArticleType = '/api/query/findAllArticleType'

/**
 * 分页查询文章类型
 */
export const findArticleTypePage = '/sys/articleType/findArticleTypePage'

/**
 * 删除文章类型
 */
export const removeArticleType = '/sys/articleType/removeArticleType'

/**
 * 保存更新文章类型
 */
export const saveAndUpadteArticleType = '/sys/articleType/saveAndUpadteArticleType'

/**
 * 新闻保存修改
 */
export const saveAndUpdateIndustryNew = '/sys/indutryNew/saveAndUpdateIndustryNew'

/**
 * 新闻超管查询列表
 */
export const findArticleList = '/sys/indutryNew/findArticleList'

/**
 * 新闻超管删除
 */
export const articleRemove = '/sys/indutryNew/articleRemove'

/**
 * 新闻超管查询详细信息
 */
export const findArticleInfo = '/sys/indutryNew/findArticleInfo'

/**
 * 新闻超管取消置顶
 */
export const articleZero = '/sys/indutryNew/articleZero'

/**
 * 新闻超管置顶
 */
export const articleRise = '/sys/indutryNew/articleRise'



// -----------------------------------菜单管理---------------------------------

/**
 * 查询所有菜单
 * 
 */
export const findMenuList = '/sys/auth/menu/findList'

/**
 * 新增菜单
 * 
 */
export const saveMenu = '/sys/auth/menu/save'

/**
 * 删除菜单
 * 
 */
export const deleteMenu = '/sys/auth/menu/deleteMenu'

/**
 * 角色菜单绑定
 * 
 */
export const bindMenuToRole = '/sys/auth/menu/bindMenuToRole'

/**
 * 根据角色编号查找菜单列表
 * 
 */
export const findBindMenuList = '/sys/auth/menu/findBindList'

/**
 * 商户-远程查询接单吧商户
 * 
 */
export const getRemoteBusinessInfo = '/sys/auth/business/getRemoteBusinessInfo'

/**
 * 保存SAAS商户信息
 * 
 */
export const saveBusinessInfo = '/sys/auth/business/saveBusinessInfo'

/**
 * 分页查询SAAS商户信息
 * 
 */
export const findBusinessList = '/sys/auth/business/findBusinessList'

/**
 * 分页查询SAAS商户信息
 * 
 */
export const delBusiness = '/sys/auth/business/delBusiness'


/**
 * 商户绑定用户
 * 
 */

export const  bindAccount= '/sys/auth/business/bindAccount'

/**
 * 编辑商户绑定用户
 * 
 */

export const  bindAccountUpdate= '/sys/auth/business/bindAccountUpdate'

/**
 * 商户-根据商户编号查找帐号
 * 
 */

export const  findCompanyUserList= '/sys/auth/business/findCompanyUserList'


// -----------------------------------密度---------------------------------
/**
 * 查询材质密度
 */
export const findDensityList = '/sys/density/findDensityList'

/**
 * 保存材质密度
 */
export const saveDensity = '/sys/density/saveDensity'

/**
 * 删除材质密度
 */
export const deleteDensity = '/sys/density/deleteDensity'

/**
 * 编辑材质密度
 */
export const updateDensity = '/sys/density/updateDensity'


// -----------------------------------费用管理---------------------------------
/**
 * 查询费用
 */
export const findSaleCostList = '/sys/saleCost/findSaleCostList'

/**
 * 保存费用
 */
export const saveSaleCost = '/sys/saleCost/saveSaleCost'

/**
 * 更新费用
 */
export const updateSaleCost = '/sys/saleCost/updateSaleCost'

/**
 * 删除费用
 */
export const delSaleCost = '/sys/saleCost/delSaleCost'


// -----------------------------------商户基础信息---------------------------------
/**
 * 超管查询商户基础信息
 */
export const findDataList= '/sys/ironType/findList'


/**
 * 超管保存商户基础信息
 */
export const saveBaseData= '/sys/ironType/save'


// -----------------------------------商户基础信息---------------------------------
/**
 * 修改计算公式
 */
export const updateFormula= '/sys/formula/update'


/**
 * 查询计算公式
 */
export const findFormula= '/sys/formula/list'


// -----------------------------------客户管理---------------------------------


/**
 * 户分页查询
 */
export const findCustomer= '/sys/customer/page'


/**
 * 保存客户
 */
export const saveCustomer= '/sys/customer/save'


/**
 * 删除客户
 */
export const deleteCustomer= '/sys/customer/delete'

/**
 * 汉字转拼音首字母
 */
export const characterToSpell= '/api/spell/characterToSpell'


// -----------------------------------入库单管理---------------------------------


/**
 * 入库单列表查询
 */
export const findStorageInList= '/sys/storageIn/findStorageInList'


/**
 * 入库单列表查询
 */
export const storageIn= '/sys/storageIn/storageIn'



/**
 * 入库单查询
 */
export const findStorageIn= '/sys/storageIn/findStorageIn'
// -----------------------------------货品管理---------------------------------


/**
 * 分页查询货品
 */
export const findCargoInfoList= '/sys/cargoInfo/page'

/**
 * 查询货品详情
 */
export const cargoInfoDetails= '/sys/cargoInfo/detail'


/**
 * 分页查询货品
 */
export const findCargoInfo= '/sys/cargo/page'


// -----------------------------------仓库管理---------------------------------

/**
 * 分页仓库管理
 */
export const findWareHouse= '/sys/wareHouse/page'


/**
 * 仓库删除
 */
export const deleteWareHouse= '/sys/wareHouse/delete'



/**
 * 仓库保存
 */
export const saveWareHouse= '/sys/wareHouse/save'

/**
 * 查询平台库管人员
 */
export const findSysKG= '/common/role/findSysKG'


// -----------------------------------加工单---------------------------------
/**
 * 加工单分页查询
 */
export const findProcessTicketList= '/sys/processTicket/findProcessTicketList'


/**
 * 查询仓库
 */
export const findAWareHouse= '/sys/wareHouse/list'

/**
 * 加工单详情查询
 */
export const findProcess= '/sys/processTicket/findProcess'

/**
 * 加工单加工
 */
export const saveProcess= '/sys/processTicket/process'


export const cargoInfoDetail= '/common/cargoInfo/detail'
/*
*加工单入库
*/
export const saveProcessIn= '/sys/processTicket/processIn'

/*
*查询银行名称
*/
export const bankName= '/api/bankCard/bankName'


// -----------------------------------销售单---------------------------------

/*
*销售单列表查询
*/
export const findSaleTicketList= '/sys/saleTicketBg/findSaleTicketList'

/*
*销售单查询
*/
export const findSaleTicket= '/sys/saleTicketBg/findSaleTicket'

// -----------------------------------出库单管理---------------------------------

/*
*出库单列表查询
*/
export const findOutBoundList= '/sys/saleTicketBg/findOutBoundList'

/*
*出库单查询
*/
export const findOunBound= '/sys/saleTicketBg/findOunBound'

/*
*出库单出库
*/
export const saleTicketOut= '/sys/saleTicketBg/saleTicketOut'


// -----------------------------------财务管理---------------------------------

/*
*查询费用科目列表
*/
export const findFeeTypeList= '/sys/feeType/findFeeTypeList'

/*
*保存费用科目
*/
export const saveFeeType= '/sys/feeType/saveFeeType'

/*
*更新费用科目名称
*/
export const updateFeeType= '/sys/feeType/updateFeeType'

/*
*更新费用科目名称
*/
export const deleteFeeType= '/sys/feeType/deleteFeeType'


/*
*修改费用科目状态
*/
export const modifyFeeType= '/sys/feeType/modifyFeeType'


/*
*查询所有费用科目
*/
export const findFeeType= '/sys/feeType/findFeeType'



/*
*客户账户列表分页查询
*/
export const customerAccountPage= '/sys/customerAccount/page'


/*
*客户交易记录
*/
export const customerAccountHistory= '/common/customerAccount/history'

/*
*查询供应商账户列表
*/
export const buserAccountPage= '/sys/buserAccount/page'


/*
*供应商交易记录
*/
export const buserAccountHistory= '/common/buserAccount/history'



/*
*收款单列表
*/
export const receiptOrderPage= '/sys/receiptOrder/page'


/*
*新增收款单
*/
export const receiptOrderIn= '/sys/receiptOrder/in'



/*
*取消收款单
*/
export const receiptOrderCancel= '/sys/receiptOrder/cancel'


/*
*客户名称提示
*/
export const findCustomerList= '/sys/customer/find'


/*
*客户名称提示
*/
export const findbankCards= '/common/customer/bankCards'


/*
* 公司账号
*/
export const findPlatBankCard = '/common/bankCard/findPlatBankCard'



/*
* 付款单列表
*/
export const paymentOrderPage = '/sys/paymentOrder/page'


/*
* 取消付款单
*/
export const paymentOrderCancel = '/sys/paymentOrder/cancel'


/*
* 新增付款单
*/
export const paymentOrderOut = '/sys/paymentOrder/out'

/*
* 财务查询待分配供应商列表
*/
export const distributionPage = '/sys/distribution/page'

/*
* 选择结算客户
*/
export const chooseSettleCustomer ='/sys/paymentOrder/chooseSettleCustomer'


/*
* 查询供应商账户详情
*/
export const buserAccountDetail ='/common/buserAccount/detail'


/*
* 客户分配/结算金额列表
*/
export const distributeSettlementPage ='/sys/distributeSettlement/page'


/*
* 查询客户可分配余额
*/
export const customerAccountFind ='/sys/customerAccount/find'


/*
* 财务查询待分配供应商列表
*/
export const distributionPages ='/sys/distribution/page'

/*
* 财务分配金额给供应商
*/
export const doDistribute ='/sys/distribution/doDistribute'


/*
* 财务分配金额给供应商
*/
export const distributeSettleLog ='/sys/distribution/distributeSettleLog'

/*
* 付款单列表
*/
export const cancelPaymentPage ='/sys/cancelTicketBg/payment/page'


/*
* 收款单列表
*/
export const cancelReceiptPage ='/sys/cancelTicketBg/receipt/page'

// -----------------------------------数据分析---------------------------------

/*
*交易数据汇总
*/
export const saleStatics = '/sys/saleTicketStaticsBg/saleStatics'

/*
*货品销售统计
*/
export const cargoStatics = '/sys/saleTicketStaticsBg/cargoStatics'

/*
*热门销售统计
*/
export const hotStatics = '/sys/saleTicketStaticsBg/hotStatics'


/*
*库存货品统计
*/
export const wareStatics = '/sys/saleTicketStaticsBg/wareStatics'


/*
*超管作废单列表
*/
export const findCancelTicketList = '/sys/cancelTicketBg/findCancelTicketList'


/*
*超管作废单详情
*/
export const findCancelTicket = '/sys/cancelTicketBg/findCancelTicket'

/*
*超管作废单确认入库
*/
export const cancelTicketIn = '/sys/cancelTicketBg/cancelTicketIn'


/*
*供应商银行卡
*/
export const getCompanyCard = '/sys/buserInfoBg/getCompanyCard'


/*
*新增付款单
*/
export const cancelTicketBgPayment = '/sys/cancelTicketBg/payment'

/*
*新增收款单
*/
export const cancelTicketBgReceipt = '/sys/cancelTicketBg/receipt'

/*
*取消付款单
*/
export const paymentCancel = '/sys/cancelTicketBg/payment/cancel'

/*
*取消收款单
*/
export const receiptCancel = '/sys/cancelTicketBg/receipt/cancel'


/*
*销售单打印
*/
export const saleTicketPrint = '/sys/saleTicketBg/saleTicketPrint'

/*
*加工单打印
*/
export const processPrint = '/sys/processTicket/processPrint'

/*
*入库单打印
*/
export const storageInPrint = '/sys/storageIn/storageInPrint'

/*
*菜单提醒
*/
export const messagePrompt = '/sys/buserInfoBg/messagePrompt'