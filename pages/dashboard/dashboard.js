import { getCardDatas, getUserDetails } from "../../requests/dashboard";

// pages/dashboard/dashboard.js
const app = getApp();

const cardDatas = [
  "all_article",
  "all_article_display",
  "all_article_view",
  "all_article_digg",
  "all_article_comment",
  "all_article_collect",
  "all_column",
  "all_column_follow",
  "all_follower",
  "incr_active_follower",
  "incr_do_follower",
  "incr_undo_follower",
  "incr_follower"
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    userId: '',
    userDetailsInfo: null
  },
  // methods
  nvaiToLogin() {
    wx.navigateTo({
      url: '../login/index',
    })
  },
  // 用户基础信息
  async getUserDetails() {
    const { data } = await getUserDetails()
    this.setData({
      userDetailsInfo: {
        user_name: data.user_name,
        avatar_large: data.avatar_large,
        company: data.company,
        job_title: data.job_title,
        description: data.description,

        level: data.level,
        vip_level: data.user_growth_info.vip_level,

        got_view_count: data.got_view_count,
        got_digg_count: data.got_digg_count,
        follower_count: data.follower_count,
        followee_count: data.followee_count,
        power: data.power
      }
    })
  },
  // 卡片数据
  async getCardDatas() {
    try {
      const { data } = await getCardDatas(cardDatas, this.data.userId)
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    const { hasLogin, userId } = app.globalData.userInfo
    this.setData({
      hasLogin,
      userId
    })
    if (hasLogin) {
      this.getUserDetails()
    }
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