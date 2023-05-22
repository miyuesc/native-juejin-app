import { getBookDetails } from "../../requests/books"
import { formatRichText } from "../../utils/util"

const bookDetails = {
  sections: null,
  currentSectionId: '0',

}

const pageOptions = {
  // 页面数据
  data: {
    isFirstOnShow: true, // 是否为首次执行onShow
    introduction: '', // 介绍详情
    bookTitle: '',
  },
  // methods
  async getBookDetails(bookId) {
    try {
      const { data } = await getBookDetails(bookId)
      console.log(data)
      this.setData({ introduction: formatRichText(data.introduction.content) })
      bookDetails.sections = data.sections
      bookDetails.currentSectionId = data.booklet.reading_progress.last_section_id
    } catch (e) {
      this.setData({ introduction: '' })
    }
  },
  goToContinueReading() {
    wx.navigateTo({
      url: '../bookReading/bookReading',
      success(res) {
        res.eventChannel.emit('continueReading', bookDetails)
      }
    })
  },

  // 页面载入时
  onLoad(qurey) {
    if (qurey && qurey.bookId) {
      this.getBookDetails(qurey.bookId)
    }
  },
  // 页面初始化
  init(e) { },
  // 页面准备好时
  onReady() { },
  // 页面显示时
  onShow() {
    console.log('onShow')
    const { isFirstOnShow } = this.data

    if (isFirstOnShow) {
      // 首次执行时
      this.setData({
        isFirstOnShow: false,
      })
      return
    }
  },
  // 页面隐藏时
  onHide() { },
  // 页面卸载时
  onUnload() { },
  // 下拉页面时
  onPullDownRefresh() { },
  // 到达页面底部时
  onReachBottom() { },
  // 页面滚动时
  onPageScroll() { },
  // 分享时，注：onShareAppMessage不能为async异步函数，会导致不能及时取得返回值，使得分享设置无效
  onShareAppMessage() {
    /* const title = ''
    const path = ''
    const imageUrl = ``

    return {
      title,
      path,
      imageUrl,
    } */
  },
}

Page(pageOptions)
