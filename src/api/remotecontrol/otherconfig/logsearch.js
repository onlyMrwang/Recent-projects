import request from '@/utils/request'

// 查询日志
export function seachLogs(query) {
  return request({
    url: '/app/remotectrl/getJournalList/'+query.pageNum+"/"+query.pageSize,
    method: 'get',
    params: query
  })
}