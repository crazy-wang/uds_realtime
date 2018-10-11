<template>
  <div class="word-map">
    <div class="app-key">
      <span class="title">appkey</span>
      <div>
        <span @click="loadFlag('APPKEYTOTAL')">TOTAL</span>
        <span @click="loadFlag('HDT6WC2Y8850')">Tangram</span>
        <span @click="loadFlag('JCI32DET5030')">IMC Plugins</span>
      </div>
    </div>
    <div id="wordMapEchart" style="width: 60%; height: 600px;"></div>
    <h2 style="width: 60vw; text-align: center">Top10</h2>
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
    <div class="top-ten" style="color: #ccc;" v-if="showTop10">No Data ...</div>
  </div>
</template>

<script>
  import 'echarts/map/js/world'
  export default {
    data() {
      return {
        echartsObj: {
          wordMapDom: null
        },
        wordMapEchartData: [],
        topTen: [],
        showTop10: false,
        mapTitle: 'TOTAL'
      }
    },
    created() {
      this.loadMapDataFromServer()
    },
    mounted() {
      this.echartsObj.wordMapDom = this.echarts.init(document.getElementById('wordMapEchart'), null, {renderer: 'svg'})
    },
    methods: {
      showWordMapEchart() {
        let option = {
          title : {
            text: this.mapTitle,
            subtext: 'Lenovo CBI',
            sublink : 'https://cbitest.lenovo.com',
            x:'center',
            y:'top'
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
            max: 1000,
            text:['High','Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['lightskyblue','yellow', 'orangered']
            }
          },
          series : [
            {
              name: 'World Population (2010)',
              type: 'map',
              mapType: 'world',
              // roam: true, // 是否开启鼠标缩放和平移漫游
              mapLocation: {
                y : 60
              },
              itemStyle:{
                // normal:{label:{show:true}},
                emphasis:{label:{show:true}}
              },
              data:this.wordMapEchartData
            }
          ]
        };
        this.echartsObj.wordMapDom.setOption(option)
      },
      async loadMapDataFromServer(appkey = 'APPKEYTOTAL') {
        let params = {
          appkey
        }
        let resData = await this.axios.post('http://chicago.realtime.lenovo.com/pcsd-row/redis/getAppInfoByCountry', params)
        console.log('hah')
        let mapData = resData.data.data
        this.wordMapEchartData = mapData
        if (this.wordMapEchartData.length === 0) {
          this. showTop10 = true
        } else {
          this. showTop10 = false
          this.topTen = this.wordMapEchartData.slice(0, 10)
          console.log(this.topTen)
        }
        this.showWordMapEchart()
      },
      loadFlag(appkey) {
        if (appkey === 'APPKEYTOTAL') {
          this.mapTitle = 'TOTAL'
        }
        if (appkey === 'HDT6WC2Y8850') {
          this.mapTitle = 'Tangram'
        }
        if (appkey === 'JCI32DET5030') {
          this.mapTitle = 'IMC Plugins'
        }
        this.loadMapDataFromServer(appkey)
      }
    }
  }
</script>

<style scoped lang="scss">
.word-map {
  .app-key {
    .title {
      padding: 5px;
      margin-top: 10px;
      float: left;
    }
    div {
      padding: 5px;
      span {
        display: inline-block;
        border: 1px solid #ccc;
        /*width: 50px;*/
        padding: 5px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .top-ten {
    margin-top: 20px;
    width: 60vw;
    display: flex;
    justify-content: space-around;
    .tag-block {
      width: 10vw;
      text-align: center;
      border-radius: 5px;
      background: #6981c5;
      color: #fff;
      padding: 5px;
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
</style>
