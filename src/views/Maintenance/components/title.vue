<template>
  <div class="top">
    <div>
      <span class="spanicon"></span>
      <span class="title">{{ titleName }}</span>
      <div class="boxline" :style="{ width: width + '%' }">
        <span class="line"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toptitle',
  props: {
    titleName: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 92
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.top {
  line-height: 20px;
}
.title {
  width: 20px;
  color: skyblue;
}
.boxline {
  float: right;
  background: skyblue;
  height: 1px;
  // width: 92%;
  margin-top: 10px;
}
.spanicon {
  width: 13px;
  height: 13px;
  display: inline-block;
  background: #018196;
  transform: rotate(45deg);
  margin: 0 5px;
}
</style>
