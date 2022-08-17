<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import echarts from "echarts";
export default {
  name: "",

  data() {
    return {};
  },

  mounted() {
    let myChart = echarts.init(this.$refs.charts);
    myChart.setOption({
      xAxis: {
        show: false,
        //设置最大值和最小值
        max: 100,
        min: 0
      },
      yAxis: {
        show: false,
        type: "category"
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          //宽度
          barWidth: 10,
          //展示背景颜色
          showBackground: true,
          //背景颜色
          barBackgroundColor: {
            color: "#eee"
          },
          //文本
          label: {
            show: true,
            position: "right",
            formatter: "|"
          }
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    });
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>