import { postData } from "../utils/request.js"

export const defaultRequestConfig = {
	limit: 20,
	"id_type": 4,
	"sort_type": 300
}

export function getNewestPins(cursor) {
	return postData('/recommend_api/v1/short_msg/recommend', {...defaultRequestConfig, cursor})
}

export function getHotestPins(cursor) {
	return postData('/recommend_api/v1/short_msg/hot', {...defaultRequestConfig, cursor})
}

export function getFollowPins(cursor) {
	return postData('/recommend_api/v1/short_msg/follow', {...defaultRequestConfig, cursor})
}

export function getMinePins(cursor, userId) {
	return postData('/content_api/v1/short_msg/list_by_user', {...defaultRequestConfig, "user_id": userId, cursor})
}
