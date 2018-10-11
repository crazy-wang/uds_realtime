<template>
  <div class="btnRoute">
    <div class="top-title">
      <span class="logo">Vantage Realtime Data</span>
      <div class="nav">
         <span class="btn" style="margin-left: 50px;">
          <router-link to="/device_user">Device User</router-link>
         </span>
         <span class="btn">
          <router-link to="/registered_user">Registered User</router-link>
         </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        state: 1,
      }
    },
    methods: {
      // showPage(num) {
      //   this.state = num
      //   // if ()
      // }
    }
  }
</script>
<style lang="scss" scoped >
  .btnRoute {
    /*padding-left: 50px;*/
    /*padding-top: 10px;*/
    padding: 0 0 5px 0px;
    .top-title {
      height: 50px;
      /*background-color: #e5e5e5;*/
      background-color: #373d41;
      /*text-align: center;*/
      margin-bottom: 5px;
      span.logo {
        color: #fff;
        line-height: 50px;
        margin-left: 40px;
        font-weight: bold;
        font-size: 18px;
      }
      .nav {
        float: right;
        .btn {
          display: inline-block;
          width: 150px;
          height: 50px;
          line-height: 50px;
          /*border: 1px solid #898c94;*/
          border-radius: 5px;
          text-align: center;
          margin-right: 5px;
          font-size: 14px;
          cursor: pointer;
          a {
            display: block;
            text-decoration: none;
            color: #fff;
          }
        }
        /*.activeSpan {*/
        /*background: #898c94;*/
        /*color: #fff;*/
        /*}*/
        .router-link-active {
          /*background: #898c94;*/
          color: #6981c5!important;
          /*color: #ffd04b!important;*/
          font-weight: bold;
        }
      }
    }
  }
</style>
