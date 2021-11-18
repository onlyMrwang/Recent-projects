<template>
  <el-dialog
    v-dialogDrag
    title="账户开通"
    :visible.sync="showOpen"
    width="30%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="closeBox"
  >
    <div class="openBox">
      <div class="item">
        <div class="label">组织机构:</div>
        <div class="value">{{ groupName }}</div>
      </div>
      <div class="item">
        <div class="label">账户用途:</div>
        <div class="value">
          <el-select
            v-model="accUse"
            placeholder="请选择账户用途"
            @change="changeAccUse"
          >
            <el-option label="公有" :value="0"></el-option>
            <el-option label="私用" :value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="label">账户类型:</div>
        <div class="value" v-if="accUse === 1">
          <el-select v-model="accType" disabled placeholder="请选择账户类型">
            <el-option label="私有" :value="3"></el-option>
          </el-select>
        </div>
        <div class="value" v-else>
          <el-select v-model="accType" placeholder="请选择账户类型">
            <el-option label="共享" :value="0"></el-option>
            <el-option label="配额" :value="2"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="submitOpen">确 定</el-button>
      <el-button style="margin-left: 10px" @click="closeBox">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAccount } from '@/api/financial/account'
import { mapGetters } from 'vuex'
export default {
  props: {
    groupId: {
      type: String,
      default: null,
    },
    groupName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showOpen: true,
      accUse: null,
      accType: null,
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    changeAccUse(value) {
      this.accUse = value;
      if (value === 1) {
        this.accType = 3;
      } else {
        this.accType = null;
      }
    },
    submitOpen() {
        if(this.accUse !== 0 && this.accUse !== 1) {
            this.$message({
                type: 'warning',
                message: '请选择账户用途',
            })
        }else if(this.accType !== 0 && this.accType !== 2 && this.accType !== 3) {
            this.$message({
                type: 'warning',
                message: '请选择账户类型',
            })
        }else {
           this.toAddAccount()
        }
    },
   async toAddAccount() {
     let data = {
       accType: this.accType,
       accUse: this.accUse,
       enterpriseId: this.userInfo.tenantId,
       orgId: this.groupId,
       orgName: this.groupName,
       oprUser: this.userInfo.userName
     }
     const rsp = await addAccount(data)
     if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '账户开通成功'
        })
       this.$emit('sucOpenAccount')
     }
    },
    closeBox() {
        this.$emit('closeOpenBox')
    },
  }
}
</script>

<style lang="scss" scoped>
.openBox {
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label {
      color: #999;
      font-size: 14px;
      margin-right: 25px;
      &::before {
          content: '*';
          color: red;
          margin-right: 3px;
      }
    }
    .value {
      flex: 1;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
