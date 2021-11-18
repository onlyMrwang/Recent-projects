<template>
<div class="detailDialog">
  <el-dialog
    v-dialogDrag
    :visible.sync="showPersonItem"
    @close="closeDialog"
    width="1000px"
    disabled
    title="职工信息"
  >
    <div class="detailItemBox">
      <el-row :gutter="10">
        <el-col :span="8">
            <div class="left">
              <div class="label">用户头像</div>
              <div class="img">
                <img v-if="imageUrl" :src="imageUrl"/>
                <img v-else src="@/assets/images/noAvatar.png"/>
              </div>
            </div>
        </el-col>
        <el-col :span="16">
          <div class="right">
            <el-row>
              <el-col :span="5">
                <div class="label">工作编号</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.staffCode || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">姓名</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.workName || '--'}} </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <div class="label">所属组织机构</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{formatDeptName(personInfo.workOrgId)}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">是否是司机</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.ifDriver == '0' ? '是' : '否'}} </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <div class="label">邮箱</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.email || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">联系电话</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.phone || '--'}} </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <div class="label">应急角色</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.emergencyRole || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">公有账户金额(元)</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.pubAccountAmt || '--'}} </div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="5">
                <div class="label">是否私人充电</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.isPrivateRecharge == '0' ? '是' : '否'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">私家车牌</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.licensePriva || '--'}} </div>
              </el-col>
            </el-row>
              <el-row>
              <el-col :span="5">
                <div class="label">车辆型号</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.cardModel || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">车辆类型</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{Number(personInfo.cardType) > 0 ?  dictInfo.carTypeObj[personInfo.cardType] : '--'}} </div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="5">
                <div class="label">实体卡号</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.stid || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">个人虚拟卡号</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.xbid || '--'}} </div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="5">
                <div class="label">个人账户金额(元)</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.inventedAmt || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">是否开通APP账号</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.openAppAcc == '0' ? '是' : '否'}} </div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="5">
                <div class="label">APP登录账号</div>
              </el-col>
              <el-col :span="7">
                <div class="value">{{personInfo.appAcc || '--'}}</div>
              </el-col>
              <el-col :span="5">
                <div class="label">APP登录密码</div>
              </el-col>
              <el-col :span="7">
                <div class="value">******</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { getUserDetail } from '@/api/asset/employeeinfo'
import { mapGetters } from "vuex";
import { treeToList } from '@/utils/utils'
export default {
  props: {
    info: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["dictInfo", "deptList"]),
  },
  data() {
    return {
      showPersonItem: true,
      imageUrl: null,
      personInfo: {},
      show: false,
      orgList: []
    };
  },
  created() {
    // this.personInfo = this.info
    this.imageUrl = this.info.photo || null;
    this.fetchDetail()
  },
  methods: {
    async fetchDetail() {
      const rsp = await getUserDetail({workersId: this.info.workersId})
      if(rsp.code === 200) {
        this.personInfo = rsp.data
      }
    },
    closeDialog() {
      this.$emit("closeDetail");
    },
    formatDeptName(val) {
      const arr = treeToList(this.deptList).filter(item => item.id === val)
      if(arr.length > 0) {
        return arr[0].nameCN
      }else {
        return '--'
      }
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.nameCN,
        children: node.children,
      };
    },
  },
};
</script>
