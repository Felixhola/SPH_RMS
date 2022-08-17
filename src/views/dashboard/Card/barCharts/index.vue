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
        type: "category"
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44,33,22,8],
          color: "cyan",
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      //提示信息
        tooltip: {
           
        },
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