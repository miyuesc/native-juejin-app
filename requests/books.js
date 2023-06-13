import { postData } from "../utils/request.js"

export function getBooksList() {
	return postData('/booklet_api/v1/booklet/bookletshelflist', {})
}

export function getBookDetails(booklet_id) {
	return postData('/booklet_api/v1/booklet/get', {booklet_id})
}

export function getBookSection(section_id) {
	return postData('/booklet_api/v1/section/get', {section_id})
}
