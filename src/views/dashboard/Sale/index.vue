<template>
  <el-card class="box-card" style="margin:10px 0px">
    <div slot="header" class="clearfix">
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visits"></el-tab-pane>
      </el-tabs>

      <!-- 右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          class="date"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="right">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">846,467</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>麦当劳</span>
              <span class="rvalue">745,456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>金拱门</span>
              <span class="rvalue">698,157</span>
            </li>
            <li>
              <span>4</span>
              <span>万达广场</span>
              <span class="rvalue">516,753</span>
            </li>
            <li>
              <span>5</span>
              <span>英雄联盟</span>
              <span class="rvalue">446,741</span>
            </li>
            <li>
              <span>6</span>
              <span>csGo</span>
              <span class="rvalue">395,523</span>
            </li>
            <li>
              <span>7</span>
              <span>真功夫</span>
              <span class="rvalue">123,451</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
//引入echarts
import echarts from "echarts";
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  name: "",

  data() {
    return {
      activeName: "sale",
      myCharts: null,
      //日历收集的时间
      date: []
    };
  },

  mounted() {
    //初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts);
    //配置数据
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "yellowgreen"
        }
      ]
    });

    //顶部是mounted：为什么第一次没有数据，没有数据因此不显示
  },
  computed: {
    //计算属性-标题
    title() {
      //重新设置配置项
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //本周
    setWeek() {
      const start = dayjs()
        .day(1)
        .format("YYYY-MM-DD");
      const end = dayjs()
        .day(7)
        .format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs()
        .startOf("month")
        .format("YYYY-MM-DD");
      const end = dayjs()
        .endOf("month")
        .format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本年
    setYear() {
      const start = dayjs()
        .startOf("year")
        .format("YYYY-MM-DD");
      const end = dayjs()
        .endOf("year")
        .format("YYYY-MM-DD");
      this.date = [start, end];
    }
  },
  watch: {
    title() {
      // console.log("修改配置数据");
      //重新修改图标的配置数据
      //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
      this.myCharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
            color: "yellowgreen",
          },
        ],
      });
    },
    listState(){
     this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.listState.orderFullYear,
          color: "yellowgreen",
        },
      ],
    });

    }
  },
};
</script>

<style scoped>
.clearfix {
  display: flex;
  position: relative;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 250px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>