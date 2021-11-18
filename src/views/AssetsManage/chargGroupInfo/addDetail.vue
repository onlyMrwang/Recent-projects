<template>
    <div class="chargGroupInfo">
        <el-form
            ref="dialogform"
            :model="dialogForm"
            :rules="rules"
            size="medium"
            label-width="150px"
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="充电网点编码 : " prop="recSiteNum">
                        <el-input v-model="dialogForm.recSiteNum" disabled  />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="充电网点名称 : " prop="chargGroupName">
                        <el-input v-model.trim="dialogForm.chargGroupName" :disabled="listTypes"  placeholder="请输入充电网点名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8" >
                    <div class="orgList">
                    <el-form-item label="归属组织机构 : " prop="orgId" :show-message="dialogForm.orgId ? false : true">
                        <treeselect
                            :disabled="listTypes"
                            v-model="dialogForm.orgId"
                            :default-expand-level="1"
                            :options="deptList"
                            :normalizer="normalizer"
                            placeholder="选择归属组织机构"
                        />
                    </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="地市 : " prop="areaId">
                        <el-select
                                :disabled="listTypes || listType === 3"
                                v-model="dialogForm.areaId"
                                @change="areaFn"
                                placeholder="请选择地市"
                                :clearable="true"
                        >
                            <el-option
                                v-for="item in cityList"
                                :key="item.areaCode"
                                :label="item.areaName"
                                :value="item.areaCode"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="片区 : " prop="area">
                        <el-select v-model="dialogForm.area" :clearable="true"  :disabled="listTypes || listType === 3"
                        :placeholder="dialogForm.areaId ? '请选择片区' : '请先选择地市'">
                            <el-option
                                v-for="item in areaList"
                                :key="item.areaCode"
                                :label="item.areaName"
                                :value="item.areaCode"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址 : " prop="address">
                        <el-input v-model.trim="dialogForm.address" :disabled="listTypes"  placeholder="请输入地址"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="经度 : " prop="longitude">
                        <el-input v-model.trim="dialogForm.longitude" :disabled="listTypes"  placeholder="请输入经度"/>
                    </el-form-item >
                </el-col>
                <el-col :span="8">
                    <el-form-item label="纬度 : " prop="latitude">
                        <el-input v-model.trim="dialogForm.latitude" :disabled="listTypes"  placeholder="请输入纬度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="负责人 : " prop="chargePerson">
                        <el-input v-model.trim="dialogForm.chargePerson" :disabled="listTypes"  placeholder="请输入负责人"/>
                    </el-form-item >
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系电话 : " prop="phone">
                        <el-input v-model.trim="dialogForm.phone" :disabled="listTypes"  placeholder="请输入联系电话"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <div class="orgList">
                    <el-form-item label="运维组织机构 : " prop="ywInstitution">
                        <treeselect
                                :disabled="listTypes"
                                v-model="dialogForm.ywInstitution"
                                :default-expand-level="1"
                                :options="deptOptions"
                                placeholder="选择运维组织机构"
                        />
                    </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="站点类型 : " prop="chargGroupNature">
                        <el-select
                                :disabled="listTypes || listType === 3"
                                v-model="dialogForm.chargGroupNature"
                                placeholder="请选择站点类型"
                                :clearable="true">
                            <el-option
                                    v-for="item in chargeAttribute"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item
                    >
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="支付方式 : " prop="paymentMeth">
                        <el-select multiple v-model="dialogForm.paymentMeth" :clearable="true" :disabled="listTypes" placeholder="请选择支付方式">
                            <el-option
                                    v-for="item in dictInfo.paymentMeth"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否启用网点监控 : " prop="ifUseMonitor">
                        <el-radio-group v-model="dialogForm.ifUseMonitor" :disabled="listTypes">
                            <el-radio  label="1">是</el-radio>
                            <el-radio  label="0">否 </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8" >
                    <el-form-item label="运营启动日期 : " prop="operateStartTime">
                        <el-date-picker
                            :disabled="listTypes"
                            class="input-width"
                            v-model="dialogForm.operateStartTime"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="年/月/日"
                        >
                        </el-date-picker>
                    </el-form-item >
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="装机容量(kW) : " prop="disCapBranch">
                        <el-input-number :min="0" :controls="false" v-model.trim="dialogForm.disCapBranch" :disabled="listTypes"  placeholder="请输入装机容量"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="配电容量(kW) : " prop="disCapTotal">
                        <el-input-number :min="0" :controls="false" v-model.trim="dialogForm.disCapTotal" :disabled="listTypes"  placeholder="请输入配电容量"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否有人值守 : " prop="ifOnDuty">
                        <el-radio-group v-model="dialogForm.ifOnDuty" :disabled="listTypes">
                            <el-radio  label="1">是</el-radio>
                            <el-radio  label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="是否24小时营业 : " prop="ifPeopDoBus">
                        <el-radio-group v-model="dialogForm.ifPeopDoBus" @change="changeifPeopDoBus" :disabled="listTypes">
                            <el-radio  label="1">是</el-radio>
                            <el-radio  label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="8" >
                    <el-form-item label="开放类型 : " prop="openRange">
                        <el-select v-model="dialogForm.openRange" :clearable="true"   :disabled="listTypes || listType === 3" placeholder="请选择开放范围">
                            <el-option
                                    v-for="item in openRange"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="8" v-if="dialogForm.ifPeopDoBus == '0'"> -->
                <el-col :span="8">
                    <el-form-item label="营业时间" prop="doBusTime">
                      <div class="newBox">
                          <el-time-select
                               :disabled="dialogForm.ifPeopDoBus == '1'"
                                placeholder="起始时间"
                                v-model="dialogForm.doBusTime"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:30',
                                    end: '24:00'
                                }"
                            >
                          </el-time-select>
                          <el-time-select
                            placeholder="结束时间"
                            :disabled="dialogForm.ifPeopDoBus == '1'"
                            v-model="dialogForm.doBusEndTime"
                            :picker-options="{ start: '00:00',
                                    step: '00:30',
                                    end: '24:00', minTime: dialogForm.doBusTime}">
                            </el-time-select>
                      </div>

                       <!-- <el-time-picker
                            is-range
                            style="width: 200px"
                            v-model="value1"
                            range-separator="-"
                            start-placeholder="开始"
                            end-placeholder="结束"
                            placeholder="请选择营业时间">
                        </el-time-picker> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注 : ">
                        <el-input
                            placeholder="请输入备注"
                            :disabled="listTypes"
                            type="textarea"
                            maxlength="255"
                            :rows="2"
                            class="textarea"
                            v-model.trim="dialogForm.remarks"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span  slot="footer" class="dialog-footer">
        <el-button v-if="!listTypes" size="mini" type="primary" :loading="loadingBtn" @click="addchargGroupInfo">确 定</el-button >
            <el-button size="mini" @click="closeView">取 消</el-button>
      </span>
    </div>
</template>

<script>
import { getAreaId, addchargGroupInfo, editchargGroupInfo } from "@/api/asset/charggroupinfo";
import { getAllOrgOfCompany } from '@/api/common'
import { mapGetters } from 'vuex'
    export default {
        data() {

            var Phone = (rule, value, callback) => {
                var str = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (value) {
                    if (!str.test(value)) {
                        callback(new Error("手机号格式不正确"));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };

              var checkLat = (rule, val, callback) => {
                var latreg = /^[\-\+]?((0|([1-8]\d?))(\.\d{1,7})?|90(\.0{1,7})?)$/;
                if(!latreg.test(val)){
                    // callback(new Error("纬度整数部分为0-90,小数部分为0到7位"));
                    callback(new Error("纬度格式不正确"));
                }else {
                     callback();
                }
            }

           var checkLong = (rule, val, callback) =>{
           var longrg = /^[\-\+]?(0(\.\d{1,8})?|([1-9](\d)?)(\.\d{1,7})?|1[0-7]\d{1}(\.\d{1,7})?|180(([.][0]{1,7})?))$/;
                if(!longrg.test(val)){
                    // callback(new Error("经度整数部分为0-180,小数部分为0到7位!"));
                    callback(new Error("经度格式不正确"));
                }else {
                   callback();
                }
            }
            return {
                dialogForm: {},
                deptOptions: [],//组织机构树
                cityList: [],//地市
                areaList: [],//片区
                chargeAttribute: [],//充电网点属性
                openRange: [],//开发范围
                listTypes: true,//开发范围
                value1: [],
                loadingBtn: false,
                // 表单校验
                rules: {
                    chargGroupName: [{required: true, message: "请输入充电网点名称", trigger: "blur"},],
                    orgId: [{required: true, message: "请输入归属组织机构", trigger: "blur"},],
                    areaId: [{required: true, message: "请输入地市", trigger: "blur"}],
                    area: [{required: true, message: "请输入片区", trigger: "blur"}],
                    address: [{required: true, message: "请输入地址", trigger: "blur"}],
                    chargePerson: [{required: true, message: "请输入负责人", trigger: "blur"}],
                    chargGroupNature: [{required: true, message: "请选择充电网点属性", trigger: "change"}],
                    paymentMeth: [{required: true, message: "请选择支付方式", trigger: "change"}],
                    ifUseMonitor: [{required: true, message: "请选择是否启用网点监控", trigger: "change"}],
                    operateStartTime: [{required: true, message: "请输入运营启动日期", trigger: "blur"}],
                    // disCapBranch: [{required: true, message: "请输入装机容量", trigger: "blur"}],
                    // disCapTotal: [{required: true, message: "请输入配电容量", trigger: "blur"}],
                    ifPeopDoBus: [{required: true, message: "请选择是否24小时营业", trigger: "change"}],
                    openRange: [{required: true, message: "请选择开放范围", trigger: "change"}],
                    doBusTime: [{required: true, message: "请选择营业时间", trigger: "change"}],

                    longitude:  [{required: true, message: "请输入充电设备经度", trigger: "blur"},
                                 { validator: checkLong, trigger: "blur"}],
                    latitude:  [{required: true, message: "请输入充电设备纬度", trigger: "blur"},
                    { validator: checkLat, trigger: "blur"}],
                    phone: [
                        {required: true, message: "请输入联系电话", trigger: "blur"},
                    { validator: Phone, trigger: "blur", message: "联系电话格式不正确"}],
                },
            }
        },
        props: {
            areaIds: {
                type: Array,
                required: true
            },
            chargeAttributes: {
                type: Array,
                required: true
            },
            dialogForms: {
                type: Object,
                required: true
            },
            listType: {
                required: true
            },
        },
        computed: {
            ...mapGetters(['dictInfo', 'deptList'])
        },
        created() {
            this.fetchOrgList()
            this.cityList = this.areaIds;
            this.chargeAttribute = this.dictInfo.chargGroupNature
            this.openRange = this.dictInfo.openRange;
            this.dialogForm = this.dialogForms;
            if(this.listType !== 1) {
                this.dialogForm.paymentMeth = this.dialogForm.paymentMeth ? this.dialogForm.paymentMeth.split(',') : []
            }else {
               this.dialogForm.paymentMeth = [] 
            }
            this.listTypes = this.listType === 2 ? true : false;
           
            if(this.dialogForm.areaId) {
                this.fetchAreaList(this.dialogForm.areaId)
            }
            if(!this.dialogForm.disCapBranch) {
                this.dialogForm.disCapBranch = undefined
            }
            if(!this.dialogForm.disCapTotal) {
                this.dialogForm.disCapTotal = undefined
            }
            if(this.listType === 1) {
                this.dialogForm.ifOnDuty = '0'
            }
        },
        methods: {
            async fetchOrgList() {
                const rsp = await getAllOrgOfCompany()
                if(rsp.code === 200) {
                    this.deptOptions = rsp.data
                }
            },
            closeView(){
                this.$emit('closeView', 2)
            },
            changeifPeopDoBus(val) {
                if(val == '1') {
                    this.dialogForm.doBusTime = '00:00'
                    this.dialogForm.doBusEndTime = '24:00'
                }else {
                    this.dialogForm.doBusTime = null
                    this.dialogForm.doBusEndTime = null
                }
            },
            addchargGroupInfo() {
                this.$refs.dialogform.validate(async (valid) => {
                    if (valid) {
                        this.loadingBtn = true
                        this.dialogForm.paymentMeth = Array.isArray(this.dialogForm.paymentMeth) ? this.dialogForm.paymentMeth.join(',') : this.dialogForm.paymentMeth
                        if(!this.dialogForm.doBusEndTime) {
                            this.$message({
                                type: 'warning',
                                message: '请选择营业结束时间'
                            })
                            this.loadingBtn = false
                            return
                        }
                        if (this.listType === 3) {
                            // 修改网点信息
                            const res = await editchargGroupInfo(this.dialogForm);
                            if(res.code==200){
                                this.msgSuccess(res.message);
                                this.$emit('closeView', 1)
                                this.loadingBtn = false
                            }else {
                                if(this.dialogForm.paymentMeth == '0' || this.dialogForm.paymentMeth) {
                                     this.dialogForm.paymentMeth = this.dialogForm.paymentMeth.split(',')
                                }
                                this.loadingBtn = false
                            }
                        } else {
                            // 新增网点信息
                            const res = await addchargGroupInfo(this.dialogForm);
                            if (res.code === 200) {
                                this.msgSuccess(res.message);
                                this.$emit('closeView', 1)
                                this.loadingBtn = false
                            }else {
                                 if(this.dialogForm.paymentMeth == '0' || this.dialogForm.paymentMeth) {
                                     this.dialogForm.paymentMeth = this.dialogForm.paymentMeth.split(',')
                                }
                                this.loadingBtn = false
                            }
                        }
                    } 
                });
            },
            // form地市选择完成后获得片区的方法
            async areaFn(code) {
                this.areaList = []
                this.dialogForm.area = null
                if(code) {
                const res = await getAreaId({relationCode: code});
                if(res.code === 200) {
                   this.areaList = res.data.result;
                }
              }
            },
            async fetchAreaList(val) {
              const res = await getAreaId({relationCode: val});
                if(res.code === 200) {
                   this.areaList = res.data.result;
                }
            },
            /** 转换部门数据结构 */
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
    }
</script>
<style  lang="scss">
    .chargGroupInfo{
        .newBox{
            .el-date-editor,.el-input__inner{
                width: 115px !important;
            }
        }

    }
</style>
<style scoped>
    .textarea{
        width: 100%;
    }
    .dialog-footer{
        width: 100%;
        text-align: center;
        display: inline-block;
        margin-bottom: 30px;
    }
</style>