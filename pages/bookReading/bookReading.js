import { getBookSection } from "../../requests/books"
import { formatRichText } from "../../utils/util"
import richTextStyles from "../../common/config/richTextStyles"

// pages/bookReading.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bookSections: [],
    currentSectionId: '',
    currentSectionIndex: 0,
    currentSectionContent: '',
    richTextStyles
  },
  // methods
  async getScetionDetails(sectionId) {
    try {
      console.log('get', this.data.bookSections.length)
      if (this.data.bookSections && this.data.bookSections.length) {
        console.log('request', this.data.bookSections.length)
        let idx = 0
        if (sectionId !== '0') {
          idx = this.data.bookSections.findIndex(d => d.section_id === sectionId)
        }
        const { data } = await getBookSection(sectionId)
        wx.setNavigationBarTitle({ title: data.section.draft_title })
        this.setData({
          currentSectionId: sectionId,
          currentSectionContent: formatRichText(data.section.content),
          currentSectionIndex: idx
        })
      } else {
        throw new Error('empty sections')
      }
    } catch (e) {
      this.setData({
        bookSections: [],
        currentSectionIndex: 0,
        currentSectionContent: '',
        currentSectionId: ''
      })
    }
  },
  nextSection() {
    const { currentSectionIndex, bookSections } = this.data;
    console.log('nextSection', currentSectionIndex, bookSections.length)
    if (currentSectionIndex > bookSections.length - 1) {
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
    console.log('lastSection')
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('continueReading', (data) => {
      console.log(data)
      this.setData({
        bookSections: data.sections
      })
      this.getScetionDetails(data.currentSectionId)
    })
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