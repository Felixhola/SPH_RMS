<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 此处有三个模块，一个是展示spu列表，一个添加，一个是修改 -->
      <!-- 此处是展示spu列表 -->
      <div v-show="this.scene == 0">
        <el-button
          type="primary"
          style="margin-bottom:20px"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
        >添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前SPU的所有SKU列表"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除SPU"
                  slot="reference"
                  style="margin-left: 10px;"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 
      当前第几页
      总共多少条数据
      每一页多少条
      连续多少页
      @size-change="handleSizeChange"   改变每页显示条数
      @current-change="handleCurrentChange"  当前第几页改变
      layout:各个东西的各自位置
        pager-count:总共显示多少个页码  连续页码就是总共的减去两个（左右两个）-->
        <el-pagination
          style="margin-top:20px;text-align:center"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          :pager-count="7"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="prev, pager, next, jumper,->,sizes,total"
        ></el-pagination>
      </div>

      <!-- 此处是添加spu||修改SPU -->
      <SpuForm v-show="this.scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <!-- 此处是添加Sku-->
      <SkuForm v-show="this.scene == 2" ref="sku" @changeScene2="changeScene2"></SkuForm>
    </el-card>

    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      v-loading="loading"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px;" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  data() {
    return {
      //分别是分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      page: 1, //分页器当前第几页
      limit: 3, //每一页需要展示多少条数据
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], //存储的是SKU列表的数据
      loading: true
    };
  },
  methods: {
    //dialog关闭时触发的事件
    close(done) {
      this.loading = true;
      this.spuList = [];
      done();
    },
    //查看当前SPU的所有SKU列表
    async handler(row) {
      this.spu = row;
      this.dialogTableVisible = true;
      let result = await this.$API.spu.reqSkuList(row.id);
      // console.log(result);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    //添加Sku的函数
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getDate(this.category1Id, this.category2Id, row);
    },
    //删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //分页器点击每页展示多少条数据的时候触发的事件
    handleSizeChange(val) {
      this.limit = val;
      this.getSpuList();
    },
    //分页器的点击第几页的回调函数
    handleCurrentChange(val) {
      this.page = val;
      this.getSpuList(this.page);
    },
    //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取到一、二、三级分类的id  level：为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除2、3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除3级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    //获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //点击添加SPU的时候触发的事件
    addSpu() {
      this.scene = 1;
      // this.spu = {};
      // this.skuList = [];
      // this.dialogTableVisible = true;
      //通知子组件发请求---发两个
      this.$refs.spu.addSpuDate(this.category3Id);
    },
    //点击修改SKU的时候触发的事件
    updateSpu(row) {
      this.scene = 1;
      // this.spu = row;
      // this.skuList = row.skuList;
      // this.dialogTableVisible = true;
      this.$refs.spu.initSpuData(row);
    },
    //SpuForm组件中的取消按钮的点击事件
    changeScene({ scene, flag }) {
      this.scene = scene;
      //重新渲染页面
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //skuForm组件中的取消按钮的点击事件
    changeScene2(scene) {
      this.scene = scene;
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
};
</script>

<style>
</style>