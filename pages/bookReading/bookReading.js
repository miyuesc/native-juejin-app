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
    currentSectionContent: '',
    richTextStyles
  },
  // methods
  async getScetionDetails(sectionId) {
    try {
      const { data } = await getBookSection(sectionId)
      this.setData({ currentSectionContent: formatRichText(data.section.content) })
    } catch (e) {
      this.setData({
        bookSections: [],
        currentSectionContent: '',
        currentSectionId: ''
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
        bookSections: data.sections,
        currentSectionId: data.currentSectionId
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