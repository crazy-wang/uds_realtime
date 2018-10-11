<template>
  <div class="real-time">
    <!--<div class="top-title">-->
      <!--<span>{{topTitle}} Active Device User Realtime Data</span>-->
    <!--</div>-->
    <!--<div class="new-flag">-->
      <!--<span :class="{activeSpan: flagState === 1}" @click="clickFlag(1)">Total</span>-->
      <!--<span :class="{activeSpan: flagState === 2}" @click="clickFlag(2)">Vantage</span>-->
      <!--<span :class="{activeSpan: flagState === 3}" @click="clickFlag(3)">IMC Plugins</span>-->
    <!--</div>-->
    <div class="main-content">
      <div class="flag-btn">
        <span :class="{active: flagState === 0}" @click="clickFlag(0)">All</span>
        <span :class="{active: flagState === 1}" @click="clickFlag(1)">Lenovo WIFI Security</span>
        <span :class="{active: flagState === 2}" @click="clickFlag(2)">Warranty</span>
        <span :class="{active: flagState === 3}" @click="clickFlag(3)">System Update</span>
        <span :class="{active: flagState === 4}" @click="clickFlag(4)">Health & Support</span>
        <span :class="{active: flagState === 5}" @click="clickFlag(5)">Hardware Settings</span>
        <span :class="{active: flagState === 6}" @click="clickFlag(6)">Preferences Menu</span>
      </div>
      <div class="left-echart">
        <div class="real-num">
          <div>
            <p style="font: normal 20px SansSerif">Right Now</p>
            <h1 style="margin: 12px 0;">{{realNum}}</h1>
            <span style="color: #999;">Active Users</span>
          </div>
        </div>
        <div class="main-content-title">
          <span class="btn-title">{{mainContentTips}}</span>
          <span class="btn-group">
            <span class="realtime-btn" :class="{'light-height': btnState === 1}" @click="setStateBtn(1)">Realtime</span>
            <span class="history-btn" :class="{'light-height': btnState === 2}" @click="setStateBtn(2)">History</span>
          </span>
        </div>
        <div class="main-content-echart">
          <div id="realtimeEchart" v-show="btnState === 1"></div>
          <div id="historyEchart" v-show="btnState === 2"></div>
        </div>
      </div>
      <div class="right-echart">
        <div id="wordMapEchart"></div>
        <!--<h2 style="text-align: center">Top10</h2>-->
        <template v-if="topTen">
          <div class="top-ten">
            <div class="tag-block" v-for="(item, index) in topTen.slice(0, 5)">
              <span>{{item.name}}</span>
              <p>{{item.value}}</p>
            </div>
          </div>
          <div class="top-ten">
            <div class="tag-block" v-for="(item, index) in topTen.slice(5, 10)">
              <span>{{item.name}}</span>
              <p>{{item.value}}</p>
            </div>
          </div>
        </template>
        <div style="color: #ccc; text-align: center" v-if="showTop10">No Data ...</div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'echarts/map/js/world'
  export default {
    name: 'Index',
    data() {
      return {
        flagState: 0,
        btnState: 1,
        topTitle: 'Vantage',
        realNum: null,
        mainContentTips: 'Active Users Per 15 Seconds',
        realTimer: null,
        historyTimer: null,
        mapTimer: null,
        paramsAppKey: 'HDT6WC2Y8850',
        paramsAppKeyHistory: 'HDT6WC2Y8850_HISTORY',
        paramsAppKeyMap: 'HDT6WC2Y8850',
        echartsObj: {
          realtimeDom: null,
          historyDom: null,
          wordMapDom: null
        },
        realtimeEchartData: {
          // value: [10, 23, 43, 12, 23, 44, 34, 54, 19, 86, 45, 64, 35, 67, 99, 45, 102, 45, 65, 34,10, 23, 43, 12, 23, 44, 34, 54, 19, 70]
          value: []
        },
        historyEchartData: {
          yesterday: [],
          history: []
        },
        wordMapEchartData: [],
        topTen: [],
        showTop10: false,
        mapTitle: 'Vantage',
      }
    },
    created() {
      this.initRealTimeEchartData()
      this.loadHistoryEchartData()
      this.loadMapDataFromServer()
    },
    mounted() {
      this.echartsObj.realtimeDom = this.echarts.init(document.getElementById('realtimeEchart'), null, {renderer: 'svg'})
      this.echartsObj.historyDom = this.echarts.init(document.getElementById('historyEchart'), null, {renderer: 'svg'})
      this.echartsObj.wordMapDom = this.echarts.init(document.getElementById('wordMapEchart'), null, {renderer: 'svg'})
      window.onresize = (() => {
        this.resizeEchartsDom()
      })
    },
    methods: {
      resizeEchartsDom() {
        this.echartsObj.realtimeDom.resize()
        this.echartsObj.historyDom.resize()
        this.echartsObj.wordMapDom.resize()
      },
      // 实时
      async initRealTimeEchartData(appkey = 'HDT6WC2Y8850') {
        let params = {
          appkey,
          count: 30
        }
        let resData = await this.axios.post('http://chicago.realtime.lenovo.com/pcsd-row/redis/getAppInfo', params)
        // console.log('哈哈')
        // console.log(resData)
        this.realtimeEchartData.value = resData.data.data.map((item) => item.cau)
        // console.log('更新前的')
        // console.log(this.realtimeEchartData.value)
        // realNum 数组长度为30，取最后一个
        this.realNum = this.comdify(String(this.realtimeEchartData.value[29]))
        this.showRealTimeEchart()
      },
      async addRealTimeEchartData(appkey = 'HDT6WC2Y8850') {
        let params = {
          appkey,
          count: 1
        }
        let addData = await this.axios.post('http://chicago.realtime.lenovo.com/pcsd-row/redis/getAppInfo', params)
        let lastNum = addData.data.data[0].cau
        this.realNum = this.comdify(String(lastNum))
        this.realtimeEchartData.value.push(lastNum)
        this.realtimeEchartData.value.shift()
        // console.log('更新后的')
        // console.log(this.realtimeEchartData.value)
        this.showRealTimeEchart()
      },
      // 历史
      async loadHistoryEchartData(appkey = 'HDT6WC2Y8850_HISTORY') {
        let params = {
          appkey,
          count: 48
        }
        let resData = await this.axios.post('http://chicago.realtime.lenovo.com/pcsd-row/redis/getAppHistoryInfo', params)
        // console.log('历史接口')
        // console.log(resData)
        let resYesterdayData = resData.data.data[0]
        let resHistoryData = resData.data.data[1]
        this.historyEchartData.yesterday = resYesterdayData.data.map((item) => item.cau)
        this.historyEchartData.history = resHistoryData.data.map((item) => item.cau)
        // console.log('这是history的数据')
        // console.log(this.historyEchartData.yesterday)
        // 加载Echarts
        this.showHistoryEchart()
      },
      showRealTimeEchart() {
        clearTimeout(this.realTimer)
        let option = {
          color: ['#6981c5'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['-435sec', '-420sec', '-405sec', '-390sec', '-375sec', '-360sec', '-345sec', '-330sec', '-315sec', '-300sec', '-285sec', '-270sec', '-255sec', '-240sec', '-225sec', '-210sec', '-195sec', '-180sec', '-165sec', '-150sec', '-135sec', '-120sec', '-105sec', '-90sec', '-75sec', '-60sec', '-45sec', '-30sec', '-15sec', '0sec'],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0, // 强制显示所有标签
                rotate: 45
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              min: function(value) {
                // return value.min - 20;
                return value.min > 20 ? value.min - 20 : 0
              }
            }
          ],
          series: [
            {
              name: 'Active Users',
              type: 'bar',
              // barWidth: '60%',
              data: this.realtimeEchartData.value,
              // label: {
              //   show: true,
              //   position: top,
              // },
              itemStyle: {
                label: {
                  normal: {
                    show: true,
                  }
                }
              }
            }
          ]
        }
        this.echartsObj.realtimeDom.setOption(option)
        this.realTimer = setTimeout(() => {
          // let lastNum = Math.random()*100
          // this.realtimeEchartData.value.push(lastNum)
          // this.realtimeEchartData.value.shift()
          this.addRealTimeEchartData(this.paramsAppKey)
          // this.showRealTimeEchart()
        }, 15000)
      },
      showHistoryEchart() {
        clearTimeout(this.historyTimer)
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['Yesterday','Today']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'Yesterday',
              type:'line',
              stack: 'yesterday',
              data:this.historyEchartData.yesterday,
              smooth: true,
              itemStyle: {
                color: '#6981c5'
              },
              lineStyle: {
                color: '#6981c5'
              }
            },
            {
              name:'Today',
              type:'line',
              stack: 'history',
              data:this.historyEchartData.history,
              smooth: true,
              itemStyle: {
                color: '#b1db6f'
              },
              lineStyle: {
                color: '#b1db6f'
              }
            }
          ]
        };
        this.echartsObj.historyDom.setOption(option)
        this.historyTimer = setTimeout(() => {
          this.loadHistoryEchartData(this.paramsAppKeyHistory)
        },1800000)
      },
      setStateBtn(value) {
        this.btnState = value
        if (value === 1) {
          this.mainContentTips = 'Active Users Per 15 Seconds'
          // alert(1)
          setTimeout(() => {
            this.echartsObj.realtimeDom.resize()
          }, 200)
        } else if (value === 2) {
          this.mainContentTips = 'Active users Over Time'
          // alert(2)
          setTimeout(() => {
            this.echartsObj.historyDom.resize()
          }, 200)
        }
      },
      clickFlag(flag) {
        this.btnState = 1
        this.mainContentTips = 'Active Users Per 15 Seconds'
        switch (flag) {
          case 0:
            this.flagState = 0
            this.paramsAppKey = 'HDT6WC2Y8850'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
          case 1:
            this.flagState = 1
            this.paramsAppKey = 'HDT6WC2Y8850_Lenovo WIFI Security'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_Lenovo WIFI Security_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850_Lenovo WIFI Security'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
          case 2:
            this.flagState = 2
            // this.paramsAppKey = 'HDT6WC2Y8850'
            // this.paramsAppKeyHistory = 'HDT6WC2Y8850_HISTORY'
            // this.paramsAppKeyMap = 'HDT6WC2Y8850'
            this.paramsAppKey = 'HDT6WC2Y8850_Warranty'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_Warranty_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850_Warranty'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
          case 3:
            this.flagState = 3
            this.paramsAppKey = 'HDT6WC2Y8850_System Update'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_System Update_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850_System Update'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
          case 4:
            this.flagState = 4
            this.paramsAppKey = 'HDT6WC2Y8850_Health & Support'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_Health & Support_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850_Health & Support'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
          case 5:
            this.flagState = 5
            this.paramsAppKey = 'HDT6WC2Y8850_Hardware Settings'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_Hardware Settings_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850_Hardware Settings'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
          case 6:
            this.flagState = 6
            this.paramsAppKey = 'HDT6WC2Y8850_Preferences Menu'
            this.paramsAppKeyHistory = 'HDT6WC2Y8850_Preferences Menu_HISTORY'
            this.paramsAppKeyMap = 'HDT6WC2Y8850_Preferences Menu'
            this.initRealTimeEchartData(this.paramsAppKey)
            this.loadHistoryEchartData(this.paramsAppKeyHistory)
            this.loadMapDataFromServer(this.paramsAppKeyMap)
            break
        }
      },
      // 地图
      showWordMapEchart() {
        clearTimeout(this.mapTimer)
        let option = {
          title : {
            text: 'Where is the Active User',
            textStyle: {
              fontWeight: 'normal',
              fontFamily: 'sansSerif',
              fontSize: 20
            },
            // subtext: 'Lenovo CBI',
            // sublink : 'https://cbitest.lenovo.com',
            x:'center',
            // y:'top'
            top: 20
          },
          tooltip: {},
          // tooltip : {
          //   trigger: 'item',
          //   formatter : function (params) {
          //     var value = (params.value + '').split('.');
          //     value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
          //       + '.' + value[1];
          //     return params.seriesName + '<br/>' + params.name + ' : ' + value;
          //   }
          // },

          // dataRange: {
          //   min: 0,
          //   max: 1000000,
          //   text:['High','Low'],
          //   realtime: false,
          //   calculable : true,
          //   color: ['orangered','yellow','lightskyblue']
          // },
          visualMap: {
            min: 0,
            max: 100,
            text:['High','Low'],
            realtime: false,// 拖拽时，是否实时更新图表
            calculable: true,
            inRange: {
              color: ['#ccc','#6981c5']
            }
          },
          series : [
            {
              name: this.mapTitle,
              type: 'map',
              mapType: 'world',
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: true,
                }
              },
              // roam: true, // 是否开启鼠标缩放和平移漫游
              // mapLocation: {
              //   y : 60
              // },
              data:this.wordMapEchartData
            }
          ]
        };
        this.echartsObj.wordMapDom.setOption(option)
        this.mapTimer = setTimeout(() => {
          this.loadMapDataFromServer(this.paramsAppKeyMap)
        }, 15000)
      },
      async loadMapDataFromServer(appkey = 'HDT6WC2Y8850') {
        let params = {
          appkey
        }
        let resData = await this.axios.post('http://chicago.realtime.lenovo.com/pcsd-row/redis/getAppInfoByCountry', params)
        let mapData = resData.data.data
        this.wordMapEchartData = mapData
        if (this.wordMapEchartData.length === 0) {
          this.showTop10 = true
          this.topTen = null
        } else {
          this. showTop10 = false
          let topTenData = this.wordMapEchartData.slice(0, 10)
          this.topTen = topTenData.map(item => {
            return {
              name: item.name,
              value: this.comdify(String(item.value))
            }
          })
          // console.log(this.topTen)
        }
        this.showWordMapEchart()
      },
      // 千分位处理
      comdify(n) {
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        var n1 = n.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
          return s1.replace(re, "$&,") + s2
        })
        return n1
      },
    }
  }
</script>

<style scoped lang="scss">
  $height200: 200px;
  .real-time {
    .top-title {
      height: 50px;
      background-color: #e5e5e5;
      span {
        line-height: 50px;
        margin-left: 50px;
      }
    }
    .new-flag {
      padding-left: 50px;
      padding-top: 10px;
      span {
        display: inline-block;
        width: 100px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #898c94;
        border-radius: 5px;
        text-align: center;
        margin-right: 5px;
        font-size: 14px;
        cursor: pointer;
      }
      .activeSpan {
        background: #898c94;
        color: #fff;
      }
    }
    .middle-flag {
      width: 100%;
      height: $height200;
      .real-num {
        width: 33%;
        overflow: hidden;
        margin: 0 auto;
        /*background: #f00;*/
        height: $height200;
        div {
          transform:translate(30%, 20px)
        }
      }
      .flag {
        width: 66%;
        /*background: #090;*/
        height: $height200;
        display: flex;
        justify-content: space-around;
        div {
          margin-top: 40px;
          cursor: pointer;
        }
        p {
          padding: 0;
          margin: 24px 0;
          /*font-size: 14px;*/
          color: #666;
        }
        .p-light-height {
          color: #111;
          font-weight: bold;
        }
      }
    }
    .main-content {
      padding: 0 10px;
      .flag-btn {
        margin-left: 40px;
        span {
          display: inline-block;
          width: 180px;
          padding: 5px;
          text-align: center;
          border: 1px solid #898c94;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 2px 2px 1px #888888;
          cursor: pointer;
          margin-right: 5px;
        }
        span.active {
          background-color: #898c94;
          color: #fff;
        }
      }
      .left-echart {
        float: left;
        width: 48%;
        display: inline-block;
        .real-num {
          padding-left: 40px;
          margin-bottom: 50px;
          position: relative;
          top: 30px;
        }
        .main-content-title {
          /*background: #ff0;*/
          padding-top: 40px;
          height: 30px;
          .btn-title {
            margin-left: 50px;
            line-height: 30px;
            font: normal 20px SansSerif;
          }
          .btn-group {
            float: right;
            span {
              display: inline-block;
              width: 80px;
              height: 25px;
              line-height: 25px;
              padding-left: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              margin-right: 10px;
              cursor: pointer;
            }
            .light-height {
              color: #fff;
              background: #898c94;
            }
          }
        }
        .main-content-echart {
          margin-top: 10px;
          #realtimeEchart, #historyEchart {
            width: 100%;
            height: 400px;
          }
        }
      }
      .right-echart {
        width: 48%;
        display: inline-block;
        #wordMapEchart {
          width: 100%;
          height: 500px;
        }
        .top-ten {
          margin-top: 20px;
          /*width: 60vw;*/
          width: 100%;
          display: flex;
          justify-content: space-around;
          .tag-block {
            /*width: 10vw;*/
            width: 8vw;
            text-align: center;
            border-radius: 5px;
            background: #6981c5;
            color: #fff;
            padding: 5px;
            font-size: 14px;
            span {
              display: inline-block;
            }
            p {
              margin: 0;
              padding: 0;
            }
          }
        }
      }
    }
  }
</style>
