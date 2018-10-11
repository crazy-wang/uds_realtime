<!--鼠标划入划出动画-->
<template>
  <div class="demo">
    <div class="demo-block" @mouseover="big" @mouseout="small" ref="demoBlock1">
      <span>demo内容</span>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      // 只改变元素宽高，内部的文字内容不会更着变化；用transform变形来实现，这样整体都能实现。
      big(e) {
        console.log(this.$refs.demoBlock1.offsetWidth)
        // this.$refs.demoBlock1.style.width = 120 + 'px'
        // this.$refs.demoBlock1.style.height = 120 + 'px'
        this.$refs.demoBlock1.style.WebkitTransform="scale(1.2)"
        this.$refs.demoBlock1.style.boxShadow="10px 10px 5px #ccc"
      },
      small() {
        // this.$refs.demoBlock1.style.width = 100 + 'px'
        // this.$refs.demoBlock1.style.height = 100 + 'px'
        this.$refs.demoBlock1.style.WebkitTransform="scale(1)"
        this.$refs.demoBlock1.style.boxShadow=""
      }
    }
  }
</script>

<style lang="scss" scoped>
  .demo {
    .demo-block {
      width: 100px;
      height: 100px;
      margin: 20px auto;
      border: 1px solid #000;
      text-align: center;
      span {
        font-size: 15px;
        display: inline-block;
        color: #f00;
      }
    }
  }
</style>
