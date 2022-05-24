<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-tabs class="tab" v-model="tabName">
          <el-tab-pane label="销售额" name="first"></el-tab-pane>
          <el-tab-pane label="访问量" name="second"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            style="width: 250px; margin: 0 20px"
            type="daterange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div>
              <h3>{{ title }}</h3>
              <ul>
                <li>
                  <span class="rindex">1</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
                <li>
                  <span class="rindex">2</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
                <li>
                  <span class="rindex">3</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
                <li>
                  <span>4</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
                <li>
                  <span>5</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
                <li>
                  <span>6</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
                <li>
                  <span>7</span><span>肯德基</span
                  ><span class="rvalue">32131232</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
import * as echarts from "echarts";
export default {
  data() {
    return {
      tabName: "first",
      mycharts: {},
      date: [],
    };
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");

      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");

      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");

      this.date = [start, end];
    },
  },
  computed: {
    title() {
      return this.tabName == "first" ? "门店销售趋势" : "门店访问量趋势";
    },
  },
  watch: {
    title() {
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
      });
      if (this.tabName == "first") {
        this.mycharts.setOption({
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130, 110, 98, 167, 123, 44],
            },
          ],
        });
      } else {
        this.mycharts.setOption({
          series: [
            {
              data: [120, 150, 150, 130, 70, 110, 120, 110, 98, 167, 123, 44],
            },
          ],
        });
      }
    },
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",
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
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "7月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],

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
          color: "yellowgreen",
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [120, 200, 150, 80, 70, 110, 130, 110, 98, 167, 123, 44],
        },
      ],
    });
  },
};
</script>

<style>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0 10px;
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
ul li span {
  margin: 0 10px;
}

.rindex {
  float: left;
  width: 20px;
  height: 18px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
</style>