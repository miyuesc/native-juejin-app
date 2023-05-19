// pages/books/books.js
import {
  getBooksList
} from "../../requests/books.js"

const buyTypeMap = {
  1: '已购',
  2: '免费',
  4: '借阅'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksList: []
  },

  // methods
  async getBooks() {
    try {
      const { data } = await getBooksList()
      console.log(data)
      this.setData({ booksList: data.map(this.getBookInfo) })
    } catch (e) {
      this.setData({ booksList: [] })
    }
  },

  getBookInfo(item) {
    const borrowingExpireTime = item.reading_progress.valid_end_time;
    return {
      bookId: item.base_info.booklet_id,
      bookImage: item.base_info.cover_img,
      bookName: item.base_info.title,
      bookSummary: item.base_info.summary,
      bookAuthor: item.user_info.user_name,
      bookAuthorIcon: item.user_info.avatar_large,
      bookAuthorCompany: item.user_info.company,
      bookAuthorJobTitle: item.user_info.job_title,

      isBuy: item.is_buy,
      isNew: item.is_new,

      statusLabel: buyTypeMap[item.reading_progress.buy_type],
      totalSectionNum: 20,
      currentSectionId: item.reading_progress.last_section_id,
      readingProgress: item.reading_progress.reading_progress,
      borrowingExpireTime: borrowingExpireTime === 0 ? '' : new Date(borrowingExpireTime * 1000).toLocaleDateString()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBooks()
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
    this.setData({ booksList: [] });
    this.getBooks().then(wx.stopPullDownRefresh)
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