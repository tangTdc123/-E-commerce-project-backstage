import request from '../../utils/request';

export const reqCategory1List = ()=>request({
    url:`/admin/product/getCategory1/`,
    method:'get'
})

export const reqCategory2List = (id)=>request({
    url:`/admin/product/getCategory2/${id}`,
    method:'get'
})

export const reqCategory3List = (id)=>request({
    url:`/admin/product/getCategory3/${id}`,
    method:'get'
})

export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method:'get'
})

export const reqAddAttr = (data)=>request({
    url:`/admin/product/saveAttrInfo/`,
    method:'post',
    data,
})

