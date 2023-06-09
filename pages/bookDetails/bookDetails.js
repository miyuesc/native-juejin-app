import { getBookDetails } from "../../requests/books"

const bookDetails = {
  sections: null,
  currentSectionId: '0',
}

const app = getApp();

const pageOptions = {
  // 页面数据
  data: {
    introduction: {}, // 介绍详情
    bookTitle: '',
  },
  // methods
  async getBookDetails(bookId) {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      const { data } = await getBookDetails(bookId)

      wx.setNavigationBarTitle({ title: data.booklet.base_info.title })

      // this.setData({ introduction: formatRichText(data.introduction.content) })
      const mdObj = app.towxml(data.introduction.markdown_show, 'markdown', {
        events: {
          tap(ev) {
            const { data } = ev.currentTarget.dataset
            const { tag, attrs } = data || {}
            if (tag === 'img') {
              wx.previewImage({
                urls: (mdObj._images || []).map(img => img.src),
                current: attrs.src
              })
              return;
            }
            if (tag === 'navigator') {
              wx.setClipboardData({
                data: attrs.href,
                success: () =>
                  wx.showToast({ title: '链接已复制' })
              })
            }
          }
        }
      })

      this.setData({ introduction: mdObj })

      let currentSectionId = data.booklet.reading_progress.last_section_id
      if (currentSectionId === '0') {
        currentSectionId = data.sections[0].section_id || '0'
      }

      bookDetails.sections = data.sections
      bookDetails.currentSectionId = currentSectionId
    } catch (e) {
      this.setData({ introduction: '' })
    } finally {
      await wx.pageScrollTo({ scrollTop: 0 })
      await wx.hideLoading()
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
    } else {
      bookDetails.sections = null
      bookDetails.currentSectionId = '0'
    }
  },
  // 页面初始化
  init(e) { },
  // 页面准备好时
  onReady() { },
  // 页面显示时
  onShow() { },
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
