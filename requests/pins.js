import { postData } from "../utils/request.js"

export const defaultRequestConfig = {
	limit: 40,
	"id_type": 4
}

export function getNewestPins(params) {
	return postData('/recommend_api/v1/short_msg/recommend', {...defaultRequestConfig, ...params})
}

export function getHotestPins(params) {
	return postData('/recommend_api/v1/short_msg/hot', {...defaultRequestConfig, ...params})
}

export function getFollowPins(params) {
	return postData('/recommend_api/v1/short_msg/follow', {...defaultRequestConfig, ...params})
}

export function getMinePins(params) {
	return postData('/content_api/v1/short_msg/query_list', {...defaultRequestConfig, ...params})
}

export function getPinDetails(msg_id) {
	return postData('/content_api/v1/short_msg/detail', {msg_id})
}