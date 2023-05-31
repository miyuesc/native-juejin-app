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
const cardTitleMap = {
  "all_article": '文章总数',
  "all_article_display": '文章展现量',
  "all_article_view": '文章阅读数',
  "all_article_digg": '文章点赞数',
  "all_article_comment": '文章评论数',
  "all_article_collect": '文章收藏数',
  "all_column": '专栏总数',
  "all_column_follow": '专栏关注数',
  "all_follower": '粉丝总数',
  "incr_active_follower": '互动粉丝数',
  "incr_do_follower": '新增粉丝数',
  "incr_undo_follower": '取消关注数',
  "incr_follower": '净增粉丝数'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    userId: '',
    userDetailsInfo: null,
    cards: [],
    cardTitleMap,
    currentDate: ''
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
        ...this.data.userDetailsInfo,
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
      if (data.datas.all_article_collect) {
        this.setData({
          'userDetailsInfo.got_collection_count': data.datas.all_article_collect.cnt
        })
      }
      this.setData({
        currentDate: data.date,
        cards: Object.keys(data.datas).map(key => {
          const thanVal = data.datas[key].than_before
          let thanTag = 'normal'
          if (thanVal > 0) {
            thanTag = 'up'
          } else if (thanVal < 0) {
            thanTag = 'down'
          }
          return {
            key,
            thanTag,
            ...data.datas[key]
          }
        })
      })
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
      this.getCardDatas()
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