import { postData } from "../utils/request.js"

export function getBooksList() {
	return postData('/booklet_api/v1/booklet/bookletshelflist', {}, {aid: 2608, uuid: '7215848128545064463', splider: 0})
}

export function getBookDetails(booklet_id) {
	return postData('/booklet_api/v1/booklet/get', {booklet_id})
}

export function getBookSection(section_id) {
	return postData('/booklet_api/v1/booklet/bookletshelflist', {section_id})
}
