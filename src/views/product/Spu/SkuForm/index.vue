<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" row="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attrValue.id}:${attr.id}`"
                v-for="(attrValue,index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr,index) in spuSalesAttrList"
            :key="saleAttr.id"
          >
            <el-select v-model="saleAttr.AttrIdAndValueId" placeholder="请选择">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttrValue.id}:${saleAttr.id}`"
                v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" prop="prop" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt style="weight:100px;height:100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [], //存储图片的信息
      //存储销售属性的信息
      spuSalesAttrList: [],
      //获取平台属性的信息
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0, 111
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,  111 
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ]
      },
      spu: {},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList: []
    };
  },
  methods: {
    //获取服务器数据
    async getDate(category1Id, category2Id, spu) {
      //先绑定一部分数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //获取图片的数据
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      // console.log(result);
      if (result.code == 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      let result2 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      // console.log(result2);
      if (result2.code == 200) {
        this.spuSalesAttrList = result2.data;
      }
      //获取平台属性的数据
      let result3 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      // console.log(result3);
      if (result3.code == 200) {
        this.attrInfoList = result3.data;
      }
    },
    //table表格复选框的选中事件
    handleSelectionChange(val) {
      this.imageList = val;
    },
    //更改是否是默认图片
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消按钮的点击事件
    cancel() {
      this.$emit("changeScene2", 0);
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的点击事件
    async save() {
      const { skuInfo, imageList, spuSalesAttrList, attrInfoList } = this;
      //整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [valueId, attrId] = item.attrIdAndValueId.split(":");
          pre.push({
            attrId,
            valueId
          });
        }
        return pre;
      }, []);
      //整理销售属性的数据
      skuInfo.skuSaleAttrValueList = spuSalesAttrList.reduce((pre, item) => {
        if (item.saleAttrValueId) {
          const [saleAttrValueId, saleAttrId] = item.AttrIdAndValueId.split(":");
          pre.push({
            saleAttrId,
            saleAttrValueId
          });
        }
        return pre;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName:item.imgName,
           imgUrl:item.imgUrl,
           isDefault:item.isDefault,
           spuImgId:item.id,
        };
      });
      //发请求
     let result  = await this.$API.spu.reqAddSku(skuInfo);
     if(result.code==200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit('changeScene2',0);
     }
     //清空数据
      Object.assign(this._data, this.$options.data());
    }
  }
};
</script>

<style>
</style>