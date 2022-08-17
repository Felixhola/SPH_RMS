<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :value="tm.id"
            :label="tm.tmName"
            v-for="(tm,index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- action:图片上传地址,list-type:文件列表的类型,file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] preview:预览。remove：删除-->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect,index) in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left:20px"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="width: 100%;margin-top:20px" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >{{tag.saleAttrValueName}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index,1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      //图片的地址
      dialogImageUrl: "",
      //是否显示预览图片（对话框是否显示）
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ]
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片信息
      saleAttrList: [], //存储销售属性信息
      attrIdAndAttrName: "" //存储还未选择的销售属性id
    };
  },
  methods: {
    //取消按钮
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清理数据
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的函数
    addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.Name,
          imgUrl: item.response ? item.response.data : item.url
        };
      });
      //发请求
      this.$API.spu.reqAddOrUpdateSpu(this.spu).then(res => {
        if (res.code == 200) {
          this.$message.success("保存成功");
          this.$emit("changeScene", {
            scene: 0,
            flag: this.spu.id ? "修改" : "添加"
          });
          Object.assign(this._data, this.$options.data());
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // handleInputConfirm1() {
    //     this.$refs['saveTagInput'].focus();
    // },
    //添加属性值的时候，input失焦的时候触发的事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      //如果没有输入值，则不添加
      if (inputValue.trim() === "") {
        this.$message.error("属性值不能为空");
        return;
      }
      //输入的值不能和已有的值重复
      const result = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName !== inputValue;
      });
      if (!result) {
        this.$message.error("属性值不能重复");
        return;
      }
      //整理好数据push进去
      let newSalesAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue
      };
      row.spuSaleAttrValueList.push(newSalesAttrValue);
      //重新切换为button
      row.inputVisible = false;
    },
    //添加销售属性的属性值
    showInput(row) {
      //当点击添加按钮的时候，将inputVisible（input和button的互相切换，true为input）设置为true，并且将inputValue设置为空
      //此时需要响应式添加，所以使用vue的set方法
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //添加销售属性的方法
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newAttr);
      this.attrIdAndAttrName = "";
    },
    //图片上传成功的回调函数
    handleSuccess(response, file, fileList) {
      // console.log(response);
      // console.log(file);
      // console.log(fileList);
      this.spuImageList = fileList;
    },
    //删除图片的方法
    handleRemove(file, fileList) {
      //file:是要删除的图片的信息，fileList:是所有图片的信息
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    //预览图片的回调函数
    handlePictureCardPreview(file) {
      //url是图片的地址
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //发请求
    async initSpuData(spu) {
      //发送请求获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //发送请求获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //发送请求获取spu图片信息
      let spuImagesResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImagesResult.code == 200) {
        let listArr = spuImagesResult.data;
        listArr.forEach(item => {
          item.url = item.imgUrl;
          item.name = item.imgName;
        });
        this.spuImageList = listArr;
      }
      //发送请求获取销售属性信息
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    //当点击添加Spu按钮的时候发送的请求
    async addSpuDate(category3Id) {
      //保存发送来的category3Id
      this.spu.category3Id = category3Id;
      //发送请求获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //发送请求获取销售属性信息
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    }
  },
  computed: {
    //计算属性
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(saleAttr => {
          return item.name != saleAttr.saleAttrName;
        });
      });
      return result;
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>