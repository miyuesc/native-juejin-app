import * as echarts from '../../../ec-canvas/echarts';
import { jpowerGrowth } from '../../../requests/dashboard';

const app = getApp();

function setOption(chart, series, xAxis) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    colors: ['#9655ed', ],
    legend: {
      data: series.map(s => s.name)
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 20,
      top: 60,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        },
        data: xAxis
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: series
  };
  chart.setOption(option);
}


const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {},
  // 组件数据
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    chart: null,
    isLoaded: false,
    isDisposed: false
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    async getChartData() {
      const {data} = await jpowerGrowth()

      this.jpowerData = data || [];

      const xAxis = [];
      const increase = []; // 净增
      const violation = []; // 违规
      const creativity = []; // 创作
      const quality = []; // 优质推荐
      const impact = []; // 影响力（点赞收藏评论）


      this.jpowerData.forEach((item) => {
        xAxis.unshift(new Date(item.date * 1000).toLocaleDateString());
        increase.unshift(item.jpower);
        violation.unshift(item.violation);
        creativity.unshift(item.creativity);
        quality.unshift(item.quality);
        impact.unshift(item.impact);
      })

      const series = [
        {
          name: '掘力值增长',
          type: 'bar',
          data: increase
        }, {
          name: '创作行为',
          type: 'line',
          data: creativity
        }, {
          name: '优质推荐',
          type: 'line',
          data: quality
        }, {
          name: '影响力',
          type: 'line',
          data: impact
        }, {
          name: '违规扣减',
          type: 'line',
          data: violation
        }
      ]

      this.init(series, xAxis)
    },
    // 点击按钮后初始化图表
    init (series, xAxis) {
      if(!this.ecComponent) {
        this.ecComponent = this.selectComponent('#jpower-chart');
      }
      this.ecComponent.init((canvas, width, height, dpr) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        setOption(chart, series, xAxis);
  
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;
  
        this.setData({
          isLoaded: true,
          isDisposed: false
        });
  
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    },
  
    dispose () {
      if (this.chart) {
        this.chart.dispose();
      }
  
      this.setData({
        isDisposed: true
      });
    }
  },
  // 组件生命周期
  lifetimes: {
    created() {},
    attached() {
      // 获取组件
      this.ecComponent = this.selectComponent('#jpower-chart');
      this.getChartData()
    },
    moved() {},
    detached() {},
  },
  definitionFilter() {},
  // 页面生命周期
  pageLifetimes: {
  },
}

Component(componentOptions)
