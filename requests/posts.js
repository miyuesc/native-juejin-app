import { getData, postData } from "../utils/request.js"

export const defaultRequestConfig = {
    "limit": 30,
    "id_type": 2
}

// sort_type: 300 - 最新排序, 200 - 默认推荐排序
// cate_id: 分类 id
// cursor: 当前锚点元素id

export function getCategoryList() {
    return getData('/tag_api/v1/query_category_briefs')
}

export function getFollowsPosts(params) {
    return postData('/recommend_api/v1/article/recommend_follow_feed', { ...defaultRequestConfig, ...params })
}

export function getCategoryPosts(params) {
    return postData('/recommend_api/v1/article/recommend_cate_feed', { ...defaultRequestConfig, ...params })
}

export function getComprehensivePosts(params) {
    return postData('/recommend_api/v1/article/recommend_all_feed', { ...defaultRequestConfig, ...params })
}

export function getMinePost(params) {
    const app = getApp()
    const user_id = app.globalData.userInfo.user_id
    return postData('/content_api/v1/article/query_list', { ...defaultRequestConfig, ...params, user_id })
}
