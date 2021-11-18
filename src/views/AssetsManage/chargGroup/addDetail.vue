<template>
    <div>
        <el-form
            ref="dialogform"
            :model="dialogForm"
            :rules="rules"
            size="medium"
            label-width="170px"
        >
            <el-row>
                <el-col :span="8">
                    <el-form-item label="充电设备编号 : " prop="assetsNum">
                        <el-input v-model="dialogForm.assetsNum" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="充电设备名称 : " prop="chargName">
                        <el-input v-model.trim="dialogForm.chargName" placeholder="请输入充电设备名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <div class="orgList">
                    <el-form-item label="所属组织机构 : " prop="orgId" :show-message="!dialogForm.orgId">
                        <treeselect
                                v-model="dialogForm.orgId"
                                :options="deptLists"
                                :clearable="false"
                                :default-expand-level="2"
                                :normalizer="normalizer"
                                placeholder="选择所属组织机构"
                        />
                    </el-form-item>
                    </div> 
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="所属充电网点 : " prop="chargGroupName">
                        <el-select v-model="dialogForm.chargGroupName" :clearable="true" filterable @change="changeFn"
                                   placeholder="请选择所属充电网点">
                            <el-option
                                    v-for="item in chargGroupName"
                                    :key="item.chargGroupCode"
                                    :label="item.chargGroupName"
                                    :value="item.chargGroupName"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="充电网点编号 : " prop="chargGroupCode">
                        <el-input v-model="dialogForm.chargGroupCode" disabled placeholder="与充电网点自动填充"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8"
                >
                    <el-form-item label="充电设备类型 : " prop="chargEquipType">
                        <el-select
                            v-model="dialogForm.chargEquipType"
                            placeholder="请选择充电设备类型"
                            :clearable="true"
                            filterable
                            :disabled="listType === 2"
                        >
                            <el-option
                                    v-for="item in arrayBoxs.chargEquipType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="充电设备厂家 : " prop="factoryId">
                        <el-select v-model="dialogForm.factoryId" :disabled="listType === 2" :clearable="true" filterable
                         placeholder="请选择充电设备厂家">
                            <el-option
                                    v-for="item in manuList"
                                    :key="item.facturerId"
                                    :label="item.facturerName"
                                    :value="item.facturerId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="设备额定功率(kW) : " prop="ratedPow">
                          <!-- <span slot="label">
                               设备额定功率(kW)
                                <el-tooltip placement="top">
                                    <div slot="content"></div>
                                    <i class="el-icon-question"></i> 
                                </el-tooltip> :
                            </span>
                        <el-input-number :controls="false" :min="0" v-model="dialogForm.ratedPow" placeholder="请输入设备额定功率"/> -->
                         <el-select
                                v-model="dialogForm.ratedPow"
                                placeholder="请选择设备额定功率"
                                :clearable="true"
                                filterable
                                :disabled="listType === 2"
                        >
                            <el-option
                                v-for="item in dictInfo.ratedPow"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label"
                            >
                            </el-option>
                        </el-select>
                   
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="设备开通时间 : " prop="equipOpenTime">
                        <el-date-picker
                                class="input-width"
                                v-model="dialogForm.equipOpenTime"
                                type="date"
                                placeholder="年/月/日"
                        >
                        </el-date-picker>
                    </el-form-item
                    >
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="是否监控展示 : " prop="ifMonDisp">
                        <el-select
                                v-model="dialogForm.ifMonDisp"
                                placeholder="请选择是否监控展示"
                                :clearable="true"
                        >
                            <el-option
                                    v-for="item in status"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="Number(item.value)"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="充电设备型号 : " prop="equiModel">
                        <el-input v-model.trim="dialogForm.equiModel" placeholder="请输入充电设备型号"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8"
                >
                    <el-form-item label="生产时间 : " prop="producTime">
                        <el-date-picker
                                class="input-width"
                                v-model="dialogForm.producTime"
                                type="date"
                                placeholder="年/月/日"
                        >
                        </el-date-picker>
                    </el-form-item
                    >
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="出厂编号 : " prop="factoryNum">
                        <el-input v-model.trim="dialogForm.factoryNum" placeholder="请输入出厂编号"/>
                    </el-form-item>
                </el-col>
            <el-col :span="8">
              <el-form-item label="充电设备经度 : " prop="chargLongit">
                        <el-input v-model.trim="dialogForm.chargLongit" placeholder="请输入充电设备经度"/>
                    </el-form-item>
                </el-col> 
                <el-col :span="8">
                    <el-form-item label="充电设备纬度 : " prop="chargLatit">
                        <el-input v-model.trim="dialogForm.chargLatit" placeholder="请输入充电设备纬度"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="上传后台软件版本号 : " prop="backVersion">
                        <el-input v-model.trim="dialogForm.backVersion" placeholder="请输入上传后台软件版本号"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="安装方式 : " prop="installMeth">
                        <el-select v-model="dialogForm.installMeth" :clearable="true" placeholder="请选择安装方式">
                            <el-option
                                    v-for="item in arrayBoxs.installMeth"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合作伙伴 : " prop="coopPartner">
                        <el-select v-model="dialogForm.coopPartner" :clearable="true" placeholder="请选择合作伙伴">
                            <el-option
                                    v-for="item in arrayBoxs.coopPartner"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item
                    >
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="充电业务流程类型 : " prop="operFlow">
                        <el-select v-model="dialogForm.operFlow" :clearable="true" placeholder="请选择充电业务流程类型">
                            <el-option
                                    v-for="item in arrayBoxs.operFlow"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="身份认证方式 : " prop="idenAuthen">
                        <el-select v-model="dialogForm.idenAuthen" placeholder="请输入身份认证方式"  :clearable="true">
                            <el-option
                                    v-for="item in arrayBoxs.idenAuthen"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                    <el-form-item label="充电接口数量 : " prop="chargInterNum">
                        <el-input v-model="dialogForm.chargInterNum" disabled/>
                    </el-form-item>
                </el-col> --> 
                 <el-col :span="8">
                    <el-form-item label="支持车型 : " prop="carModel">
                        <el-input v-model.trim="dialogForm.carModel"  placeholder="请输入支持车型"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="额定电流上限(A) : " prop="currentTop">
                        <el-input-number :controls="false" :min="0"  placeholder="请输入额定电流上限" v-model.trim="dialogForm.currentTop"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="额定电流下限(A) : " prop="currentFloor">
                        <el-input-number :controls="false" :min="0" placeholder="请输入额定电流下限" v-model.trim="dialogForm.currentFloor"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="额定电压上限(V) : " prop="voltageTop">
                        <el-input-number :controls="false" :min="0" :precision="0" placeholder="请输入额定电压上限"  v-model.trim="dialogForm.voltageTop"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="额定电压下限(V) : " prop="voltageFloor">
                       <el-input-number :controls="false" :min="0" :precision="0" placeholder="请输入额定电压下限"  v-model.trim="dialogForm.voltageFloor"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="厂家软件版本号 : " prop="revision">
                        <el-input v-model.trim="dialogForm.revision" placeholder="请输入厂家软件版本号"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="后台通讯协议版本 : " prop="protVersion">
                        <el-select
                                v-model="dialogForm.protVersion"
                                clearable
                                placeholder="请选择通讯协议版本"
                        >
                            <el-option
                                    v-for="item in arrayBoxs.protType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主控板版本号 : " prop="marstVersion">
                        <el-input v-model.trim="dialogForm.marstVersion" placeholder="请输入主控板版本号"/>
                    </el-form-item>
                </el-col>
              
                <el-col :span="8">
                    <el-form-item label="备注 : " prop="remarks">
                        <el-input v-model.trim="dialogForm.remarks"  placeholder="请输入备注"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="addList">
                <div>
                    <div class="title" style="text-align: right;padding-right: 8px;margin-bottom: 20px;">
                        <el-button @click="addList" type="primary" icon="el-icon-plus" v-if="listType!=3&&dialogForm.rechargeGuns.length<4">新增</el-button>
                    </div>
                </div>
                <div class="listContent" v-for="(item,index) in dialogForm.rechargeGuns" :key="index"
                     style="border:1px solid #ddd;border-radius: 10px;padding: 20px 10px;margin-bottom: 20px;">
                    <div style="margin-bottom: 10px;display: flex;justify-content: space-between;align-items: center">
                        <div style="font-size: 16px">充电枪0{{index+1}}参数配置</div>
                        <div v-if="listType !=3 && index !== 0"><el-button type="danger" size="mini" plain icon="el-icon-delete" title="删除" @click="todeleteGun(item,index)"></el-button></div>
                    </div>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="接口通讯协议版本 : " :rules="rules.comProtocolVersioin"  :prop="'rechargeGuns.' + index + '.comProtocolVersioin'">
                                <el-select v-model="item.comProtocolVersioin" :clearable="true"
                                 placeholder="请选择接口通讯协议版本">
                                    <el-option
                                            v-for="item in dictInfo.protocolOne"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="Number(item.value)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="接口服务类型 " :rules="rules.apiServiceType1"  :prop="'rechargeGuns.' + index + '.apiServiceType1'">
                                <el-select
                                        v-model="item.apiServiceType1"
                                        placeholder="请选择接口服务类型"
                                        :clearable="true"
                                >
                                    <el-option
                                            v-for="item in dictInfo.serviceTypeOne"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="Number(item.value)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="接口标准 : " :rules="rules.apiStandard1" :prop="'rechargeGuns.' + index + '.apiStandard1'">
                                <el-select
                                        v-model="item.apiStandard1"
                                        placeholder="请选择接口标准"
                                        :clearable="true"
                                >
                                    <el-option
                                            v-for="item in dictInfo.serviceStandOne"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="Number(item.value)"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="充电接口输出功率(kW): " :rules="rules.chaargeApiOutPower1" :prop="'rechargeGuns.' + index + '.chaargeApiOutPower1'">
                                <el-input-number :controls="false" :min="0" placeholder="请输入充电接口输出功率" v-model.trim="item.chaargeApiOutPower1"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="最大输出电压范围(V): " :rules="rules.outVoltageMaxRange1" :prop="'rechargeGuns.' + index + '.outVoltageMaxRange1'">
                                <el-input-number :controls="false" :min="0" placeholder="请输入最大输出电压范围" v-model.trim="item.outVoltageMaxRange1"/>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8" v-if="listType !=3 ">
                            <div class="clearList" style="text-align: right;padding-right: 25px;">
                                <el-button @click="todeleteGun(item,index)">删除</el-button>
                            </div>
                        </el-col> -->
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="最大输出电流(A): " :rules="rules.maxOutFlow1" :prop="'rechargeGuns.' + index + '.maxOutFlow1'">
                                 <el-input-number :controls="false" :min="0" placeholder="请输入最大输出电流"  v-model.trim="item.maxOutFlow1"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="最小输出电压范围(V): " :rules="rules.outVoltageMinRange1" :prop="'rechargeGuns.' + index + '.outVoltageMinRange1'">
                                 <el-input-number :controls="false" :min="0" placeholder="请输入最小输出电压范围"  v-model.trim="item.outVoltageMinRange1"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="submitFn" :loading="showLoading" v-if="listType!=3">确 定</el-button>
            <el-button size="mini" @click="closeView">取 消</el-button>
      </span>
    </div>
</template>

<script>
    import {addChargGroup, editChargGroup, getValidGunNum } from "@/api/asset/charggroup";
    import { getOrganization} from "@/api/asset/charggroupinfo";
    import { getChargManu } from '@/api/alarm/faultalarmBase'
    import { mapGetters } from 'vuex'
    export default {
         props:{
            chargGroupName:{//所属网点
                type:Array,
                required:true
            },
            listFrom:{
                type:Object,
                required:true

            },
            arrayBoxs:{
                type:Object,
                required:true
            },
            listType:{
                type:Number,
                required:true
            },
            clearable:{
                required:true
            },
        },
        data(){
   
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
                // 表单校验
                rules: {
                    chargName: [{required: true, message: "请输入充电设备名称", trigger: "blur"}],
                    orgId: [{required: true, message: "请选择所属组织机构"}],
                    chargGroupName: [{required: true, message: "请选择所属充电网点", trigger: "change"}],
                    chargGroupCode: [{required: true, message: "请输入充电网点编号"}],
                    chargEquipType: [{required: true, message: "请选择充电设备类型", trigger: "change"}],
                    factoryId: [{required: true, message: "请选择充电设备厂家", trigger: "change"}],
                    ratedPow: [{required: true, message: "请选择设备额定功率", trigger: "change"}],
                    equipOpenTime: [{required: true, message: "请输入设备开通时间", trigger: "blur"}],
                    ifMonDisp: [{required: true, message: "请选择是否监控展示", trigger: "change"}],
                    equiModel: [{required: true, message: "请输入充电设备型号", trigger: "blur"}],
                    // producTime: [{required: true, message: "请选择生产时间", trigger: "change"}],
                    factoryNum: [{required: true, message: "请输入出厂编号", trigger: "blur"}],
                    backVersion: [{required: true, message: "请输入上传后台软件版本号", trigger: "blur"}],
                    currentTop: [{required: true, message: "请输入额定电流上限", trigger: "blur"},],
                    currentFloor: [{required: true, message: "请输入额定电流下限", trigger: "blur"},],
                    voltageTop: [{required: true, message: "请输入额定电压上限", trigger: "blur"}, ],
                    voltageFloor: [{required: true, message: "请输入额定电压下限", trigger: "blur"},],
                    coopPartner: [{required: true, message: "请选择合作伙伴", trigger: "change"}],
                    operFlow: [{required: true, message: "请选择充电业务流程类型", trigger: "change"}],
                    idenAuthen: [{required: true, message: "请选择身份认证方式", trigger: "change"}],
                    // revision: [{required: true, message: "请输入厂家软件版本号", trigger: "blur"}],
                    protVersion: [{required: true, message: "请选择后台通讯协议版本", trigger: "change"}],
                    marstVersion: [{required: true, message: "请输入主控板版本号", trigger: "blur"}],
                    // carModel: [{required: true, message: "请输入支持车型", trigger: "blur"}],
                    chargLongit: [{required: true, message: "请输入充电设备经度", trigger: "blur"},
                                 { validator: checkLong, trigger: "blur"}],
                    chargLatit: [{required: true, message: "请输入充电设备纬度", trigger: "blur"},
                    { validator: checkLat, trigger: "blur"}],

                    // 枪
                    comProtocolVersioin: [{required: true, message: "请选择接口通讯协议版本", trigger: "change"}],
                    apiServiceType1: [{required: true, message: "请选择接口服务类型", trigger: "change"}],
                    apiStandard1: [{required: true, message: "请选择接口标准", trigger: "change"}],
                    chaargeApiOutPower1: [{required: true, message: "请输入充电接口输出功率", trigger: "blur"}],
                    outVoltageMaxRange1: [{required: true, message: "请输入最大输出电压范围", trigger: "blur"}],
                    maxOutFlow1: [{required: true, message: "请输入最大输出电流", trigger: "blur"}],
                    outVoltageMinRange1: [{required: true, message: "请输入最小输出电压范围", trigger: "blur"}],
                },
                // 弹出框的表单数据
                dialogForm: {
                    chargRganState: null,
                    orgId: null,
                    chargName: null,
                    chargGroupName: null,
                    chargGroupCode: null,
                    chargEquipType: null,
                    chargManu: null,
                    ratedPow: null,
                    equipOpenTime: null,
                    ifMonDisp: null,
                    equiModel: null,
                    producTime: null,
                    factoryId: null,
                    assetsNum: null,
                    chargLongit: null,
                    chargLatit: null,
                    installMeth: null,
                    coopPartner: null,
                    operFlow: null,
                    idenAuthen: null,
                    chargInterNum: null,
                    currentTop: null,
                    currentFloor: null,
                    voltageTop: null,
                    voltageFloor: null,
                    revision: null,
                    protVersion: null,
                    marstVersion: null,
                    backVersion: null,
                    remarks: null,
                    serviceTypeOne: null,
                    serviceStandOne: null,
                    chaargeApiOutPower1: null,
                    outVoltageMaxRange1: null,
                    outVoltageMinRange1: null,
                    maxOutFlow1: null,
                    comProtocolVersioin: null,
                    serviceTypeTwo: null,
                    serviceStandTwo: null,
                    outPowerTwo: null,
                    outVoltaMaxTwo: null,
                    outVoltaMinTwo: null,
                    curreMaxTwo: null,
                    protocolTwo: null,
                    rechargeGuns: [],
                },
                deptLists: [],
                // 状态数据
                status: [
                    {
                        value: "0",
                        label: "是",
                    },
                    {
                        value: "1",
                        label: "否",
                    },
                ],
                showLoading: false,
                manuList: [], // 充电设备厂家列表
            }
        },
        computed: {
            ...mapGetters(['dictInfo'])
        },
        created() {
            this.dialogForm = this.listFrom
            if(!this.dialogForm.ratedPow) {
               this.dialogForm.ratedPow = undefined
            }
            if(this.listType === 1 && !this.dialogForm.currentTop) {
                this.dialogForm.currentTop = undefined
            }
            if(this.listType === 1 && !this.dialogForm.currentFloor) {
                this.dialogForm.currentFloor = undefined
            }
            if(this.listType === 1 && !this.dialogForm.voltageTop) {
                this.dialogForm.voltageTop = undefined
            }
            if(this.listType === 1 && !this.dialogForm.voltageFloor) {
                this.dialogForm.voltageFloor = undefined
            }
            if(this.listType === 1) {
                this.dialogForm.equipOpenTime = new Date()
                this.addList()
            }
            this.fetchDeptlist()
            this.fetchManuList()
        },
        methods:{
            async fetchDeptlist() {
                const rsp = await getOrganization()
                if(rsp.code === 200) {
                    this.deptLists = rsp.data;  
                }
            },
            async fetchManuList() {
                const rsp = await getChargManu({type: 1})
                if(rsp.code === 200) {
                    this.manuList = rsp.data
                }
            },
            // 新增/修改网点
            submitFn() {
                this.showLoading = true
                this.$refs.dialogform.validate(async (valid) => {
                    if (valid) {
                        if(this.dialogForm.currentTop < this.dialogForm.currentFloor) {
                            this.$message({
                                type: 'warning',
                                message: '额定电流上限不能低于额定电流下限'
                            })
                            this.showLoading = false
                            return
                        }
                         if(this.dialogForm.voltageTop < this.dialogForm.voltageFloor) {
                            this.$message({
                                type: 'warning',
                                message: '额定电压上限不能低于额定电压下限'
                            })
                            this.showLoading = false
                            return
                        }
                        if (this.dialogForm.assetsNum) {
                            // 修改网点信息
                            const res = await editChargGroup(this.dialogForm);
                            if(res.code==200){
                                this.closeView()
                                this.msgSuccess(res.message);
                            }
                             this.showLoading = false
                        } else {
                            // 新增网点信息
                            const res = await addChargGroup(this.dialogForm);
                            if(res.code==200){
                                this.closeView()
                                this.msgSuccess(res.message);
                            }
                            this.showLoading = false
                        }
                        this.addDialogShow = false;
                    } else {
                        this.showLoading = false
                        // return this.msgError("请填写必填信息");
                    }
                });
            },
            /** 转换部门数据结构 */
            normalizer(node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                return {
                    id: node.id,
                    label: node.label,
                    children: node.children,
                };
            },

            async todeleteGun(item ,index) {
                if(item?.deviceId) {
                    const data = {
                        chargId: item.deviceId,
                        gunNum: item.gunNum
                    }
                    const rsp = await getValidGunNum(data)
                    if(rsp.code === 200) {
                       if(rsp.data === 0) {
                          this.dialogForm.rechargeGuns.splice(index,1)
                       }else {
                          this.$message({
                              type: 'warning',
                              message: '该充电枪已绑定充电机器人,不能删除'
                          }) 
                       }
                    }
                }else {
                   this.dialogForm.rechargeGuns.splice(index,1)
                }   
            },
            // 充电网点改变自动填充网点编码事件
             changeFn(row) {
                const arr = this.chargGroupName.filter(item => item.chargGroupName === row)
                this.dialogForm.chargGroupId = arr[0].chargGroupId
                this.dialogForm.chargGroupCode = arr[0].recSiteNum          
            },
            //往数组添加新的对象
            addList() {
                this.dialogForm.rechargeGuns.push({})
            },
            // 关闭弹出框事件
            closeView() {
                this.$emit('closeView')
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "@/assets/styles/global.scss";
    .dialog-footer{
        width: 100%;
        text-align: center;
        display: inline-block;
        margin-bottom: 30px;
    }
</style>