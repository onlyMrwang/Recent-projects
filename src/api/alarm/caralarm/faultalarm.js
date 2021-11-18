//车辆告警知识库
import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/app/alarm/knowledge-config/getCarKnowledgeConfig',
    method: 'get',
    params: query
  })
}
// 修改告警知识库
export function stopWledgeConfig(query) {
  return request({
    url: '/app/alarm/knowledge-config/updateKnowledgeConfigById',
    method: 'put',
    data: query
  })
}