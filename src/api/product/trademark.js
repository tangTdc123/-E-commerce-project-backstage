import request from '../../utils/request';
export const reqgetTradeMark = (page,limit)=>request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    method:'get'
})

export const reqUpdateTradeMark = (data)=>request({
    url:`/admin/product/baseTrademark/update`,
    data,
    method:'put'
})


export const reqAddTradeMark = (data)=>request({
    url:`/admin/product/baseTrademark/save`,
    data,
    method:'post'
})

export const reqDeleteTradeMark = (id)=>request({
    url:`/admin/product/baseTrademark/remove/${id}`,
    method:'delete'
})