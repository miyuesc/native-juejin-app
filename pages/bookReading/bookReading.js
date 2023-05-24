import { getBookSection } from "../../requests/books"
import { formatTimeStep } from "../../utils/util"

const app = getApp()

// pages/bookReading.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    panelVisible: false,
    bookSections: [],
    currentSectionId: '',
    currentSectionIndex: 0,
    currentSectionContent: null
  },
  // methods
  async getScetionDetails(sectionId) {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      if (this.data.bookSections && this.data.bookSections.length) {
        let idx = 0
        if (sectionId !== '0') {
          idx = this.data.bookSections.findIndex(d => d.section_id === sectionId)
        }
        const { data } = await getBookSection(sectionId)
        wx.setNavigationBarTitle({ title: data.section.draft_title })

        const mdObj = app.towxml(data.section.markdown_show, 'markdown', {
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

        this.setData({
          currentSectionId: sectionId,
          // currentSectionContent: formatRichText(data.section.content),
          currentSectionContent: mdObj,
          currentSectionIndex: idx
        })
      } else {
        throw new Error('empty sections')
      }
    } catch (e) {
      console.log(e)
      this.setData({
        bookSections: [],
        currentSectionIndex: 0,
        currentSectionContent: '',
        currentSectionId: ''
      })
    } finally {
      await wx.hideLoading()
      await wx.pageScrollTo({ scrollTop: 0 })
    }
  },
  nextSection() {
    const { currentSectionIndex, bookSections } = this.data;
    if (currentSectionIndex < bookSections.length - 1) {
      const nextSectionId = bookSections[currentSectionIndex + 1].section_id
      this.getScetionDetails(nextSectionId)
    } else {
      wx.showToast({
        title: '已经是最后一章',
        icon: 'info'
      })
    }
  },
  lastSection() {
    if (this.data.currentSectionIndex > 0) {
      const nextSectionId = this.data.bookSections[this.data.currentSectionIndex - 1].section_id
      this.getScetionDetails(nextSectionId)
    } else {
      wx.showToast({
        title: '已经是第一章',
        icon: 'info'
      })
    }
  },

  showTocPanel() {
    this.setData({ panelVisible: true })
  },
  closePanel() {
    this.setData({ panelVisible: false })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      eventChannel.on('continueReading', (data) => {
        const bookSections = (data.sections || []).map(section => {
          section.readingTime = formatTimeStep(section.read_time)
          return section
        })
        console.log(data, bookSections)
        this.setData({ bookSections }, () => this.getScetionDetails(data.currentSectionId))

      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})