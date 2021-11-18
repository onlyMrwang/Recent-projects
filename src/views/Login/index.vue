<template>
  <div class="login">
    <div class="loginLt">
      <div clss="imgContent">
        <div class="imgList list1"><img src="../../assets/login/icon01.png" alt=""></div>
        <div class="imgList list2"><img src="../../assets/login/icon02.png" alt=""></div>
        <div class="imgList list3"><img src="../../assets/login/icon03.png" alt=""></div>
        <div class="imgList list4"><img src="../../assets/login/icon04.png" alt=""></div>
        <div class="imgList list5"><img src="../../assets/login/icon05.png" alt=""></div>
        <div class="imgList list6"><img src="../../assets/login/icon06.png" alt=""></div>
        <div class="imgList list7"><img src="../../assets/login/icon07.png" alt=""></div>
      </div>
    </div>
    <div class="loginRt">
     <div class="loginContent">
       <div class="logoContent">
         <img src="../../assets/login/logo.png" alt="">
       </div>
       <h3>智慧机坪综合监控管理系统</h3>
       <div class="loginbBox">
         <el-form ref="loginForm" size="small" :model="loginForm" :rules="loginRules">
           <el-form-item prop="username">
             <el-input v-model.trim="loginForm.username" type="text" auto-complete="off" placeholder="账号">
             </el-input>
           </el-form-item>
           <el-form-item prop="password">
             <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter.native="handleLogin"
             >
             </el-input>
           </el-form-item>
           <el-form-item prop="code">
             <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 60%;height: 36px;"
                @keyup.enter.native="handleLogin"
             >
             </el-input>
             <div class="login-code">
               <img :src="codeUrl" @click="getCode" class="login-code-img"/>
             </div>
           </el-form-item>
           <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
           <el-form-item style="width:100%;">
             <el-button
                     :loading="loading"
                     size="medium"
                     type="primary"
                     style="width:100%;font-size: 14px"
                     @click.native.prevent="handleLogin"
             >
              <span>{{loading ? '登录中...' : '立即登录'}}</span> 
             </el-button>
             <!--<div class="registered">新用户请 <span>注册</span></div>-->
           </el-form-item>
         </el-form>
       </div>
     </div>
    </div>

  </div>
</template>

<script>
import { getCodeImg, getPublicKey, login } from "@/api/common";
import { encrypt } from '@/utils/utils'

export default {
  name: "Login",
  data() {
    return {
      publicKey: "",
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      password: null,
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "账号不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    getPublicKey().then(res=>{
      if(res.code === 200) {
        this.publicKey = res.msg;
      }
    })
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        if(res.code === 200) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid; 
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.password = this.loginForm.password
          this.loginForm.password = encrypt(this.loginForm.password, this.publicKey)
          login(this.loginForm).then(rsp => {
              if(rsp.code === 200) {
                 localStorage.setItem('token', rsp.token)
                 this.$router.push({ path: "/airweb" }).catch(()=>{});
              }else {
                 this.loading = false;
                 this.loginForm.password = this.password
                 this.getCode();
              }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .login{
    .el-input,.el-input__inner{
      width: 100% ;
      height: 36px;
      font-size: 16px;
    }
      button{
        height: 36px;
        font-size: 23px;
        background-color: rgb(0,163,178);
      }
    input{
      border: 1px solid #f5f5f5;
    }
  }
</style>
<style lang="scss" scoped>
  .login {
    position: fixed;
    height: 100%;
    width: 100%;
    top:0;
    left: 0;
    background-image: url("../../assets/login/loginBg.jpg");
    background-size: 100% 100%;
    display: flex;
  }
  .login>div{
    flex: 1;
  }
  .loginLt{
    height: 100%;
  }
  .loginRt{
    max-width: 35%;
    height: 100%;
    position: relative;
    background-color: rgba(255,255,255,0.7);
    min-width: 550px;
  }
  .loginContent{
    position: absolute;
    top: 20%;
    width: 100%;
    height: 100%;
  }
  .logoContent{
    width: 100%;
    height:60px;
    text-align: center;
    margin-bottom: 20px;
  }
  .logoContent img{
    width: 60px;
    height: 60px;
  }
  h3{
    font-size: 26px;
    text-align: center;
    letter-spacing:3px;
    margin-bottom: 56px;
    color:#05606e;
  }
  .loginbBox{
    width: 50%;
    margin-left: 25%;
  }
.login-code {
  height: 36px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-code-img {
  height: 36px;
}



  .imgContent{
    position: relative;
  }
  .imgList{
    position: absolute;
  }
  .imgList,.imgList img{
    width: 60px;
    height:60px;
  }
  .list1{
    top: 29%;
    left: 16%;
    animation:shadow 3s infinite alternate;
    -webkit-animation:heart 3s infinite alternate;
  }
  .list2{
    top: 37%;
    left: 32%;
    animation:shadow 3s infinite alternate;
    -webkit-animation:heart 3s infinite alternate;
  }
  .list3{
    top: 60%;
    left: 33%;
    animation:shadow 2s infinite alternate;
    -webkit-animation:heart 2s infinite alternate;
  }
  .list4{
    top: 76%;
    left: 18.5%;
    animation:shadow 1s infinite alternate;
    -webkit-animation:heart 1s infinite alternate;
  }
  .list5{
    top: 58%;
    left: 5%;
    animation:shadow 2s infinite alternate;
    -webkit-animation:heart 2s infinite alternate;
  }
  .list6{
    top: 47%;
    left: 38%;
    animation:shadow 3s infinite alternate;
    -webkit-animation:heart 3s infinite alternate;
  }
  .list7{
    top: 38%;
    left: 2%;
    animation:shadow 2s infinite alternate;
    -webkit-animation:heart 2s infinite alternate;
  }

//用transform就流畅了
@keyframes heart{
  from{transform:translate(0,-20px)}
  to{transform:translate(0,0)}
}
.registered{
  width: 100%;
  text-align: center;
}
.registered span{
  color:rgb(17,167,180);
  cursor: pointer;
}
</style>
