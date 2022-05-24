import request from '../../utils/request';

export const reqSpuList = (page,limit,category3Id) => request({
    url:`/admin/product/${page}/${limit}`,
    method:'get',
    params:{category3Id}
})

export const reqSpu = (spuid) => request({
    url:`/admin/product/getSpuById/${spuid}`,
    method:'get',
})


export const reqTradeMarkList = () => request({
    url:`/admin/product/baseTrademark/getTrademarkList`,
    method:'get',
})

export const reqSpuImageList = (spuid) => request({
    url:`/admin/product/spuImageList/${spuid}`,
    method:'get',
})


export const reqBaseSaleAttrList = () => request({
    url:`/admin/product/baseSaleAttrList`,
    method:'get',
})

export const reqAddOrUpdateSpu = (data) => {
    if(data.id){
        return request({
            url:'/admin/product/updateSpuInfo',
            method:'post',
            data,
        })
    }else{
        return request({
            url:'/admin/product/saveSpuInfo',
            method:'post',
            data,
        })
    }
}

export const reqDeleteSpu = (spuId)=>request({
    url:`/admin/product/deleteSpu/${spuId}`,
    method:'delete'
})



export const reqSpuSaleAttrList = (spuId) => request({
    url:`/admin/product/spuSaleAttrList/${spuId}`,
    method:'get'
})

export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method:'get'
})

export const reqsaveSkuInfo = (data) => request({
    url:`/admin/product/saveSkuInfo/`,
    method:'post',
    data
})

export const reqSkuList = (spuid) => request({
    url:`/admin/product/findBySpuId/${spuid}`,
    method:'get',
})