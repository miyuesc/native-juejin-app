import { getData, postData } from "../utils/request.js"

export function getUserDetails() {
  return getData('/user_api/v1/user/get', {
    user_id: getApp().globalData.userInfo.userId,
    not_self: 1,
    need_badge: 1
  })
}

export function jpowerGrowth() {
  return postData('/growth_api/v1/user_growth/author_jpower_detail', {
    "cursor": "0",
    "limit": 30
  })
}

export function getCardDatas(datas, user_id) {
  return postData('/content_api/v1/author_center/data/card', {
    datas, user_id
  })
}

export function getCreatorPosts(page_no) {
  return postData('/content_api/v1/article/list_by_user', {
    audit_status: null,
    keyword: '',
    page_size: 20,
    page_no
  })
}