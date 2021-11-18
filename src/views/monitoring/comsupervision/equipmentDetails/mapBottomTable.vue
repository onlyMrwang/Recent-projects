   <!--<div class="tableBox">-->
   <!--<div class="tableBox">-->
                    <!--<div class="title"  @click="topClick" style="width: 100%;text-align: center">-->
                        <!--<i :class="clickIcon"></i>-->
                        <!--<div class="tieltImg">-->
                            <!--<img src="../../../assets/monitoring/type/shaixuan.svg" alt="" @click="dialogClick">-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="tables" v-if="mapTypes==2">-->
                        <!--<el-table-->
                                <!--:data="treeData"-->
                                <!--:header-cell-style="tableHeaderStyle"-->
                                <!--border-->
                                <!--style="width: 100%"-->
                        <!--&gt;-->
                            <!--<el-table-column-->
                                    <!--fixed-->
                                    <!--prop="chargGroupName"-->
                                    <!--label="充电网点"-->
                                    <!--width="160"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="deviceNo"-->
                                    <!--label="充电机器人编号"-->
                                    <!--width="180"-->
                                    <!--align="center"-->
                                    <!--fixed-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="deviceName"-->
                                    <!--label="充电机器人名称"-->
                                    <!--width="180"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="poleNo"-->
                                    <!--label="对应设备编号"-->
                                    <!--width="180"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="alarmType"-->
                                    <!--label="告警类型"-->
                                    <!--width="120"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                                <!--<template slot-scope="scope">-->
                                    <!--{{dictInfo.alarmType[scope.row.alarmType]}}-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="severitys"-->
                                    <!--label="告警级别"-->
                                    <!--width="200"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                                <!--<template slot-scope="scope">-->
                                    <!--<div style="color: #fff;">-->
                                        <!--{{ scope.row.severitys }}-->
                                    <!--</div>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="alarmTitle"-->
                                    <!--label="告警标题"-->
                                    <!--width="180"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                            <!--</el-table-column>-->
                            <!--<el-table-column-->
                                    <!--prop="count"-->
                                    <!--label="告警计数(次)"-->
                                    <!--width="120"-->
                                    <!--align="center"-->
                                    <!--show-overflow-tooltip-->
                            <!--&gt;-->
                            <!--</el-table-column>-->

                        <!--</el-table>-->
                    <!--</div>-->
                <!--</div>-->