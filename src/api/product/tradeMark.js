//主要是获取品牌管理的数据的模块
import request from '@/utils/request';
//获取品牌列表接口
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//添加商品数据
// /admin/product/baseTrademark/save post 携带商品名称和logo


//修改品牌数据
// /admin/product/baseTrademark/update put 携带品牌id和品牌名称和logo
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if(tradeMark.id){
        //此时是修改品牌数据
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark });
    }else{
        //此时是添加品牌数据
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark });
    }
}

//删除品牌数据
// /admin/product/baseTrademark/remove/{id} delete

export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });