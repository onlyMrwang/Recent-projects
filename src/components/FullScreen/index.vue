<template>
  <div>
    <!-- <i class="el-icon-full-screen" :title="isFullscreen ? '退出全屏' : '全屏'" style="color: #fff;cursor: pointer;" @click="click"/> -->
    <img src="@/assets/icons/fullScreen.png" :title="isFullscreen ? '退出全屏' : '全屏'" style="color: #fff;cursor: pointer;" @click="click"/>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
img {
  width: 14px;
  height: 12px;
}
</style>
