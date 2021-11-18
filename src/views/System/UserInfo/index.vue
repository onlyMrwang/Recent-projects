<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="img" v-if="img !== ''" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <!-- <svg-icon icon-class="user" name="user" /> -->
                用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="user" name="fullName" /> -->
                用户昵称
                <div class="pull-right">{{ user.fullName }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="phone" name="phone" /> -->
                手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="email" name="email" /> -->
                用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="tree" name="deptGroup" /> -->
                所属部门
                <div class="pull-right">{{ deptGroup }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="peoples" name="roleGroup" /> -->
                所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="peoples" name="custGroup" /> -->
                所属用户定制
                <div class="pull-right">{{ custGroup }}</div>
              </li>
              <li class="list-group-item">
                <!-- <svg-icon icon-class="date" name="createTime" /> -->
                创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './profile/userAvatar'
import userInfo from './profile/userInfo'
import resetPwd from './profile/resetPwd'
import { getUserProfile } from '@/api/system/user'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      deptGroup: {},
      custGroup: {},
      activeTab: 'userinfo',
      img: ''
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data
        this.$nextTick(() => {
          this.img = this.user.image
        })
        this.roleGroup = response.roleGroup
        this.deptGroup = response.deptGroup
        this.custGroup = response.custGroup
      })
    }
  }
}
</script>
