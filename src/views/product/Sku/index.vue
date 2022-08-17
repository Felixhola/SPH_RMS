<template>
  <div>
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt style="weight:100px;height:100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量（KG）" width="100"></el-table-column>
      <el-table-column prop="price" label="价格（元）" width="100"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button
            type="success"
            size="mini"
            @click="sale(row)"
            icon="el-icon-bottom"
            v-if="row.isSale == 0"
          ></el-button>
          <el-button type="success" size="mini" @click="cancel(row)" icon="el-icon-top" v-else></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit"></el-button>
          <el-button type="info" size="mini" icon="el-icon-info" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      style="text-align: center;"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
    ></el-pagination>

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="(attr,index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right:10px"
          >{{attr.attrId}}--{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span="5">商品图片</el-col>
      <el-col :span="16">
        <el-carousel height="450px">
         <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">  
               <img :src="item.imgUrl" style="height:450px;margin:auto">
        </el-carousel-item>
    </el-carousel>
      </el-col>
    </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前第几页
      page: 1,
      //每页显示多少条
      limit: 10,
      //总共多少条
      total: 0,
      //存储sku列表
      records: [],
      //抽屉效果
      drawer: false,
      //sku详情
      skuInfo: {}
    };
  },
  mounted() {
    //
    this.getSkuList();
  },
  methods: {
    //获取Sku列表
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      // console.log(result);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //更改每页显示条数
    handleSizeChange(val) {
      this.limit = val;
      this.getSkuList();
    },
    //上架操作
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code === 200) {
        this.$message.success("上架成功");
        // row.isSale = 1;
        this.getSkuList(this.page);
      }
    },
    //下架操作
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code === 200) {
        this.$message.success("下架成功");
        // row.isSale = 0;
        this.getSkuList(this.page);
      }
    },
    //弹出开发中的信息
    edit() {
      this.$message({
        message: "正在开发中...",
        type: "info"
      });
    },
    //获取sku详情
    async getSkuInfo(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(row.id);
      // console.log(result);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    }
  }
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>