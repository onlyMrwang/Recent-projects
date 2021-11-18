<template>
  <div class="errPage-container">
    <div class="pageBox">
      <div class="left">
         <h1 class="text-jumbo text-ginormous">
          401错误!
        </h1>
        <h2>您没有访问权限！</h2>
        <h6>对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面</h6>
        <router-link to="/airweb">
             <span>回首页</span> 
            </router-link>
      </div>
      <div class="right">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </div>
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date()
    }
  },
  created() {
    this.$store.commit('settings/changeTopMenuIndex', null)
    this.$store.commit('settings/changeSiderMenuIndex', null)
    this.$store.commit('settings/changeRestMenu', [])
  },
  methods: {
    back() {
      this.$router.push({ path: '/airweb' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    margin: -12px;
    background-color: #fff;
    height: calc(100vh - 56px);
    position: relative;
    .pageBox {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
    }
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
     a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
  }
</style>
