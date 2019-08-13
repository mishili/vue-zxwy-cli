<template>
  <div id="homeContent">
    <el-row>
      <el-col :span="24">
        <div class="header">Echart图例使用</div>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :md="8" :sm="12">
        <div class="main">
          <div class="border-container">
            <div style="height:100%" ref="chart1"></div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
      </el-col>
      <el-col :md="16" :sm="12">
        <div class="main">
          <div class="border-container">
            <div style="height:100%" ref="chart2"></div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
      </el-col>
      <el-col :md="16" :sm="12">
        <div class="main">
          <div class="border-container">
            <div style="height:100%" ref="chart3"></div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
      </el-col>
      <el-col :md="8" :sm="12">
        <div class="main">
          <div class="border-container">
            <div style="height:100%" ref="chart4"></div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echartsLiquidfill from "echarts-liquidfill"; //水晶图
import "echarts/map/js/china"; //引入中国地图依赖
export default {
  data() {
    return {};
  },
  methods: {
    initCharts1() {
      let value = 0.48;
      let data = [value, value, value, value, value];
      let option = {
        // backgroundColor: "#fff",
        graphic: [
          {
            type: "group",
            left: "center",
            bottom: 10,
            children: [
              {
                type: "text",
                z: 100,
                left: "10",
                top: "middle",
                style: {
                  fill: "#fff",
                  text: "磁盘剩余空间：",
                  font: "16px Microsoft YaHei"
                }
              },
              {
                type: "text",
                z: 100,
                left: "120",
                top: "middle",
                style: {
                  fill: "#fff",
                  text: "128G",
                  font: "24px Microsoft YaHei"
                }
              }
            ]
          }
        ],
        series: [
          {
            type: "liquidFill",
            radius: "70%",
            center: ["50%", "40%"],
            data: data,
            backgroundStyle: {
              borderWidth: 5,
              borderColor: "#1daaeb",
              color: "#fff"
            },
            label: {
              normal: {
                formatter: (value * 100).toFixed(2) + "%",
                textStyle: {
                  fontSize: 20
                }
              }
            }
          }
        ]
      };
      let _this = this;
      _this.myChart1 = _this.$echarts.init(_this.$refs.chart1);
      _this.myChart1.setOption(option);
    },
    initCharts2() {
      let _this = this;
      _this.myChart2 = _this.$echarts.init(_this.$refs.chart2);
      let geoCoordMap = {
        上海: [121.4648, 31.2891],
        东莞: [113.8953, 22.901],
        东营: [118.7073, 37.5513],
        中山: [113.4229, 22.478],
        临汾: [111.4783, 36.1615],
        临沂: [118.3118, 35.2936],
        丹东: [124.541, 40.4242],
        丽水: [119.5642, 28.1854],
        乌鲁木齐: [87.9236, 43.5883],
        佛山: [112.8955, 23.1097],
        保定: [115.0488, 39.0948],
        兰州: [103.5901, 36.3043],
        包头: [110.3467, 41.4899],
        北京: [116.4551, 40.2539],
        北海: [109.314, 21.6211],
        南京: [118.8062, 31.9208],
        南宁: [108.479, 23.1152],
        南昌: [116.0046, 28.6633],
        南通: [121.1023, 32.1625],
        厦门: [118.1689, 24.6478],
        台州: [121.1353, 28.6688],
        合肥: [117.29, 32.0581],
        呼和浩特: [111.4124, 40.4901],
        咸阳: [108.4131, 34.8706],
        哈尔滨: [127.9688, 45.368],
        唐山: [118.4766, 39.6826],
        嘉兴: [120.9155, 30.6354],
        大同: [113.7854, 39.8035],
        大连: [122.2229, 39.4409],
        天津: [117.4219, 39.4189],
        太原: [112.3352, 37.9413],
        威海: [121.9482, 37.1393],
        宁波: [121.5967, 29.6466],
        宝鸡: [107.1826, 34.3433],
        宿迁: [118.5535, 33.7775],
        常州: [119.4543, 31.5582],
        广州: [113.5107, 23.2196],
        廊坊: [116.521, 39.0509],
        延安: [109.1052, 36.4252],
        张家口: [115.1477, 40.8527],
        徐州: [117.5208, 34.3268],
        德州: [116.6858, 37.2107],
        惠州: [114.6204, 23.1647],
        成都: [103.9526, 30.7617],
        扬州: [119.4653, 32.8162],
        承德: [117.5757, 41.4075],
        拉萨: [91.1865, 30.1465],
        无锡: [120.3442, 31.5527],
        日照: [119.2786, 35.5023],
        昆明: [102.9199, 25.4663],
        杭州: [119.5313, 29.8773],
        枣庄: [117.323, 34.8926],
        柳州: [109.3799, 24.9774],
        株洲: [113.5327, 27.0319],
        武汉: [114.3896, 30.6628],
        汕头: [117.1692, 23.3405],
        江门: [112.6318, 22.1484],
        沈阳: [123.1238, 42.1216],
        沧州: [116.8286, 38.2104],
        河源: [114.917, 23.9722],
        泉州: [118.3228, 25.1147],
        泰安: [117.0264, 36.0516],
        泰州: [120.0586, 32.5525],
        济南: [117.1582, 36.8701],
        济宁: [116.8286, 35.3375],
        海口: [110.3893, 19.8516],
        淄博: [118.0371, 36.6064],
        淮安: [118.927, 33.4039],
        深圳: [114.5435, 22.5439],
        清远: [112.9175, 24.3292],
        温州: [120.498, 27.8119],
        渭南: [109.7864, 35.0299],
        湖州: [119.8608, 30.7782],
        湘潭: [112.5439, 27.7075],
        滨州: [117.8174, 37.4963],
        潍坊: [119.0918, 36.524],
        烟台: [120.7397, 37.5128],
        玉溪: [101.9312, 23.8898],
        珠海: [113.7305, 22.1155],
        盐城: [120.2234, 33.5577],
        盘锦: [121.9482, 41.0449],
        石家庄: [114.4995, 38.1006],
        福州: [119.4543, 25.9222],
        秦皇岛: [119.2126, 40.0232],
        绍兴: [120.564, 29.7565],
        聊城: [115.9167, 36.4032],
        肇庆: [112.1265, 23.5822],
        舟山: [122.2559, 30.2234],
        苏州: [120.6519, 31.3989],
        莱芜: [117.6526, 36.2714],
        菏泽: [115.6201, 35.2057],
        营口: [122.4316, 40.4297],
        葫芦岛: [120.1575, 40.578],
        衡水: [115.8838, 37.7161],
        衢州: [118.6853, 28.8666],
        西宁: [101.4038, 36.8207],
        西安: [109.1162, 34.2004],
        贵阳: [106.6992, 26.7682],
        连云港: [119.1248, 34.552],
        邢台: [114.8071, 37.2821],
        邯郸: [114.4775, 36.535],
        郑州: [113.4668, 34.6234],
        鄂尔多斯: [108.9734, 39.2487],
        重庆: [107.7539, 30.1904],
        金华: [120.0037, 29.1028],
        铜川: [109.0393, 35.1947],
        银川: [106.3586, 38.1775],
        镇江: [119.4763, 31.9702],
        长春: [125.8154, 44.2584],
        长沙: [113.0823, 28.2568],
        长治: [112.8625, 36.4746],
        阳泉: [113.4778, 38.0951],
        青岛: [120.4651, 36.3373],
        韶关: [113.7964, 24.7028]
      };
      let XAData = [
        [{ name: "西安" }, { name: "北京", value: 100 }],
        [{ name: "西安" }, { name: "上海", value: 100 }],
        [{ name: "西安" }, { name: "广州", value: 100 }],
        [{ name: "西安" }, { name: "西宁", value: 100 }],
        [{ name: "西安" }, { name: "银川", value: 100 }]
      ];
      let XNData = [
        [{ name: "西宁" }, { name: "北京", value: 100 }],
        [{ name: "西宁" }, { name: "上海", value: 100 }],
        [{ name: "西宁" }, { name: "广州", value: 100 }],
        [{ name: "西宁" }, { name: "西安", value: 100 }],
        [{ name: "西宁" }, { name: "银川", value: 100 }]
      ];
      let YCData = [
        [{ name: "银川" }, { name: "北京", value: 100 }],
        [{ name: "银川" }, { name: "广州", value: 100 }],
        [{ name: "银川" }, { name: "上海", value: 100 }],
        [{ name: "银川" }, { name: "西安", value: 100 }],
        [{ name: "银川" }, { name: "西宁", value: 100 }]
      ];
      let planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
      //let planePath = 'arrow';
      let convertData = function(data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i];

          let fromCoord = geoCoordMap[dataItem[0].name];
          let toCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
              value: dataItem[1].value
            });
          }
        }
        return res;
      };
      let color = ["#a6c84c", "#ffa022", "#46bee9"]; //航线的颜色
      let series = [];
      [["西安", XAData], ["西宁", XNData], ["银川", YCData]].forEach(function(
        item,
        i
      ) {
        series.push(
          {
            name: item[0] + " Top3",
            type: "lines",
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: "red", //arrow箭头的颜色
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0] + " Top3",
            type: "lines",
            zlevel: 2,
            symbol: ["none", "arrow"],
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0] + " Top3",
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke"
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },
            symbolSize: function(val) {
              return val[2] / 8;
            },
            itemStyle: {
              normal: {
                color: color[i]
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            data: item[1].map(function(dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              };
            })
          }
        );
      });
      let option = {
        // backgroundColor: "#000",
        title: {
          text: "模拟航线",
          subtext: "数据纯属虚构",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params, ticket, callback) {
            if (params.seriesType == "effectScatter") {
              return "线路：" + params.data.name + "" + params.data.value[2];
            } else if (params.seriesType == "lines") {
              return (
                params.data.fromName +
                ">" +
                params.data.toName +
                "<br />" +
                params.data.value
              );
            } else {
              return params.name;
            }
          }
        },
        legend: {
          orient: "vertical",
          top: "bottom",
          left: "right",
          data: ["西安 Top3", "西宁 Top3", "银川 Top3"],
          textStyle: {
            color: "#fff"
          },
          selectedMode: "multiple"
        },
        geo: {
          map: "china",
          label: {
            emphasis: {
              show: true,
              color: "#fff"
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "#00186E",
              borderColor: "#195BB9",
              borderWidth: 1
            },
            emphasis: {
              areaColor: "#2B91B7"
            }
          }
        },
        series: series
      };
      _this.myChart2.setOption(option);
    },
    initCharts3() {
      let _this = this;
      _this.myChart3 = _this.$echarts.init(_this.$refs.chart3);
      let charts = {
        unit: "Kbps",
        names: ["出口", "入口"],
        lineX: [
          "2018-11-11 17:01",
          "2018-11-11 17:02",
          "2018-11-11 17:03",
          "2018-11-11 17:04",
          "2018-11-11 17:05",
          "2018-11-11 17:06",
          "2018-11-11 17:07",
          "2018-11-11 17:08",
          "2018-11-11 17:09",
          "2018-11-11 17:10",
          "2018-11-11 17:11",
          "2018-11-11 17:12",
          "2018-11-11 17:13",
          "2018-11-11 17:14",
          "2018-11-11 17:15",
          "2018-11-11 17:16",
          "2018-11-11 17:17",
          "2018-11-11 17:18",
          "2018-11-11 17:19",
          "2018-11-11 17:20"
        ],
        value: [
          [
            451,
            352,
            303,
            534,
            95,
            236,
            217,
            328,
            159,
            151,
            231,
            192,
            453,
            524,
            165,
            236,
            527,
            328,
            129,
            530
          ],
          [
            360,
            545,
            80,
            192,
            330,
            580,
            192,
            80,
            250,
            453,
            352,
            28,
            625,
            345,
            65,
            325,
            468,
            108,
            253,
            98
          ]
        ]
      };
      let color = ["rgba(23, 255, 243", "rgba(225,22,97"];
      let lineY = [];

      for (let i = 0; i < charts.names.length; i++) {
        let x = i;
        if (x > color.length - 1) {
          x = color.length - 1;
        }
        let data = {
          name: charts.names[i],
          type: "line",
          color: color[x] + ")",
          smooth: true,
          areaStyle: {
            normal: {
              color: new _this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: color[x] + ", 0.3)"
                  },
                  {
                    offset: 0.8,
                    color: color[x] + ", 0)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10
            }
          },
          symbol: "circle",
          symbolSize: 5,
          data: charts.value[i]
        };
        lineY.push(data);
      }

      lineY[0].markLine = {
        silent: true,
        data: [
          {
            yAxis: 5
          },
          {
            yAxis: 100
          },
          {
            yAxis: 200
          },
          {
            yAxis: 300
          },
          {
            yAxis: 400
          }
        ]
      };
      let option = {
        // backgroundColor: "#1b2735",
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: charts.names,
          textStyle: {
            fontSize: 12,
            color: "rgb(0,253,255,0.6)"
          },
          right: "4%"
        },
        grid: {
          top: "14%",
          left: "4%",
          right: "4%",
          bottom: "12%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: charts.lineX,
          axisLabel: {
            textStyle: {
              color: "rgb(0,253,255,0.6)"
            },
            formatter: function(params) {
              return params.split(" ")[0] + "\n" + params.split(" ")[1];
            }
          }
        },
        yAxis: {
          name: charts.unit,
          type: "value",
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "rgb(0,253,255,0.6)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgb(23,255,243,0.3)"
            }
          },
          axisLine: {
            lineStyle: {
              color: "rgb(0,253,255,0.6)"
            }
          }
        },
        series: lineY
      };
      setInterval(() => {
        _this.myChart3.setOption({
          legend: {
            selected: {
              出口: false,
              入口: false
            }
          }
        });
        _this.myChart3.setOption({
          legend: {
            selected: {
              出口: true,
              入口: true
            }
          }
        });
      }, 10000);
      _this.myChart3.setOption(option);
    },
    initCharts4() {
      let _this = this;
      _this.myChart4 = _this.$echarts.init(_this.$refs.chart4);
      let option = {
        // backgroundColor: "#041F34",
        series: [
          {
            type: "pie",
            zlevel: 1,
            silent: true,
            radius: ["90%", "90%"],
            hoverAnimation: false,
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: _pie1()
          },
          {
            type: "pie",
            zlevel: 2,
            silent: true,
            radius: ["95%", "98%"],
            startAngle: -65,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: _pie2()
          },
          {
            name: "",
            type: "gauge",
            splitNumber: 10, //刻度数量
            min: 0,
            max: 100,
            radius: "80%", //图表尺寸
            center: ["50%", "50%"],
            axisLine: {
              show: true,
              lineStyle: {
                width: 0,
                shadowBlur: 0,
                color: [[1, "#fff"]]
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: "auto",
                width: 2
              },
              length: 20,
              splitNumber: 5
            },
            splitLine: {
              show: true,
              length: 22,
              lineStyle: {
                color: "auto"
              }
            },
            axisLabel: {
              show: false
            },
            pointer: {
              //仪表盘指针
              show: 0
            },
            detail: {
              show: 0
            }
          },
          {
            name: "统计",
            type: "gauge",
            splitNumber: 10, //刻度数量
            min: 0,
            max: 100,
            radius: "80%", //图表尺寸
            center: ["50%", "50%"],
            axisLine: {
              show: true,
              lineStyle: {
                width: 0,
                shadowBlur: 0,
                color: [
                  [0.05, "#cf3"],
                  [0.1, "#9f3"],
                  [0.15, "#6f3"],
                  [0.2, "#3f3"],
                  [0.25, "#3f6"],
                  [0.3, "#3f9"],
                  [0.35, "#3fc"],
                  [0.4, "#3ff"],
                  [0.45, "#3cf"],
                  [0.5, "#39f"],
                  [0.55, "#36f"],
                  [0.6, "#33f"],
                  [0.65, "#63f"],
                  [0.7, "#93f"],
                  [0.75, "#c3f"],
                  [0.8, "#f3f"],
                  [0.85, "#f3c"],
                  [0.9, "#f39"],
                  [0.95, "#f36"],
                  [1, "#fff"]
                ]
              }
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: "auto",
                width: 2
              },
              length: 20,
              splitNumber: 5
            },
            splitLine: {
              show: true,
              length: 22,
              lineStyle: {
                color: "auto"
              }
            },
            axisLabel: {
              show: false
            },
            pointer: {
              //仪表盘指针
              show: 0,
              length: "70%",
              width: 2
            },
            detail: {
              borderColor: "#fff",
              shadowColor: "#fff", //默认透明
              shadowBlur: 2,
              offsetCenter: [0, "0%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: "#fff",
                fontSize: 30
              },
              formatter: "{value}"
            },
            data: [
              {
                name: "",
                value: 14
              }
            ]
          },
          {
            name: "中间环形图",
            type: "pie",
            radius: ["25%", "40%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: "#80ADD2",
                borderColor: "#3D4268"
              }
            },
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [25, 25, 25, 25, 25, 25]
          },
          {
            type: "pie",
            zlevel: 2,
            silent: true,
            radius: ["0%", "65%"],
            hoverAnimation: false,
            // animation:false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      };
      function _pie1() {
        let dataArr = [];
        for (let i = 0; i < 8; i++) {
          dataArr.push({
            name: (i + 1).toString(),
            value: 20,
            itemStyle: {
              normal: {
                color: "rgba(88,142,197,0.4)",
                borderWidth: 0,
                borderColor: "rgba(0,0,0,0)"
              }
            }
          });
        }
        return dataArr;
      }
      function _pie2() {
        let dataArr = [];
        for (let i = 0; i < 8; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 25,
              itemStyle: {
                normal: {
                  color: "rgba(88,142,197,0.5)",
                  borderWidth: 0,
                  borderColor: "rgba(0,0,0,0)"
                }
              }
            });
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 20,
              itemStyle: {
                normal: {
                  color: "rgba(0,0,0,0)",
                  borderWidth: 0,
                  borderColor: "rgba(0,0,0,0)"
                }
              }
            });
          }
        }
        return dataArr;
      }
      function _pieData(data) {
        let _data = data;
        let dataArr = [];
        for (let i = 0; i < 5; i++) {
          if (i === 2) {
            let dt = data[0].unit ? 25 : Number(data[0].value);
            dataArr.push({
              name: (i + 1).toString(),
              value: dt,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [
                    {
                      offset: 0,
                      color: "rgb(147,187,216)"
                    },
                    {
                      offset: 1,
                      color: "#588ec5"
                    }
                  ]),
                  borderWidth: 0,
                  borderColor: "rgba(0,0,0,0.4)"
                }
              }
            });
          } else {
            let dta = data[0].unit ? 25 : (1 - Number(data[0].value)) / 4;
            dataArr.push({
              name: (i + 1).toString(),
              value: dta,
              itemStyle: {
                normal: {
                  color: "rgba(0,0,0,0)",
                  borderWidth: 0,
                  borderColor: "rgba(0,0,0,0)"
                }
              }
            });
          }
        }
        return dataArr;
      }
      _this.myChart4.setOption(option);
    },
    init() {
      let _this = this;; //因为箭头函数会改变this指向，指向windows。所以先把this保存
      setTimeout(() => {
        window.onresize = function() {
          _this.myChart1.resize();
          _this.myChart2.resize();
          _this.myChart3.resize();
          _this.myChart4.resize();
        };
      }, 20);
    }
  },
  mounted() {
    this.initCharts1();
    this.initCharts2();
    this.initCharts3();
    this.initCharts4();
    this.init(); //让echarts窗口自适应
  }
};
</script>

<style lang="scss" scoped>
$border-color: #54dcf2;
#homeContent {
  background: #040f3c;
  .header {
    height: 80px;
    position: relative;
    padding-top: 13px;
    font-size: 36px;
    color: #0ff;
    text-align: center;
    background: url("../../assets/home_bg.png") top center no-repeat;
  }
  .main {
    padding: 10px;
  }
  .border-container {
    position: relative;
    margin-top: 15px;
    padding: 10px;
    border: 1px solid $border-color;
    height: 330px;
    span {
      &.border-span {
        display: block;
        position: absolute;
        width: 35px;
        height: 35px;
      }
      &.top-left {
        top: -4px;
        left: -4px;
        border-top: 3px solid $border-color;
        border-left: 3px solid $border-color;
      }
      &.top-right {
        top: -4px;
        right: -4px;
        border-top: 3px solid $border-color;
        border-right: 3px solid $border-color;
      }
      &.bottom-left {
        bottom: -4px;
        left: -4px;
        border-bottom: 3px solid $border-color;
        border-left: 3px solid $border-color;
      }
      &.bottom-right {
        bottom: -4px;
        right: -4px;
        border-bottom: 3px solid $border-color;
        border-right: 3px solid $border-color;
      }
    }
  }
}
</style>
