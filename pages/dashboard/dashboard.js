import { getCardDatas, getCreatorPosts, getUserDetails, getWeeklyCardDatas } from "../../requests/dashboard";
import { formatTime } from '../../utils/util'

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

const weeklyCardDatas = [
  "incr_article_display",
  "incr_article_view",
  "incr_article_digg",
  "incr_article_comment",
  "incr_article_collect",
  "incr_column_follow",
  "incr_active_follower",
  "incr_undo_follower",
  "incr_follower"
]
const wekklyCardTitleMap = {
  "incr_article_display": '展现数',
  "incr_article_view": '阅读数',
  "incr_article_digg": '点赞数',
  "incr_article_comment": '评论数',
  "incr_article_collect": '收藏数',
  "incr_column_follow": '专栏关注数',
  "incr_active_follower": '活跃粉丝数',
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
    yesterdayCards: [],
    weeklyCards: [],
    cardTitleMap,
    wekklyCardTitleMap,
    currentDate: '',
    activeName: '1',

    posts: [],
    postsTopTabs: [{
      name: '阅读榜',
      id: 'viewTop'
    }, {
      name: '点赞榜',
      id: 'diggTop'
    }, {
      name: '评论榜',
      id: 'commentTop'
    }, {
      name: '收藏榜',
      id: 'collectTop'
    }],
    postsTop: {
      viewTop: [],
      diggTop: [],
      commentTop: [],
      collectTop: []
    }
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
        power: data.power,

        post_article_count: data.post_article_count
      }
    })

    this.getCardDatas()
    this.getWeeklyCardDatas()
    this.getPostsData()
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
      const yesterdayCards = []
      for (const key of cardDatas) {
        const thanVal = data.datas[key].than_before
        let thanTag = 'normal'
        if (thanVal > 0) {
          thanTag = 'up'
        } else if (thanVal < 0) {
          thanTag = 'down'
        }
        yesterdayCards.push({
          key,
          thanTag,
          ...data.datas[key]
        })
      }
      
      this.setData({ currentDate: data.date, yesterdayCards })
    } catch (error) {
      console.error(error)
    }
  },
  async getWeeklyCardDatas() {
    try {
      const { data: {datas} } = await getWeeklyCardDatas(weeklyCardDatas, this.data.userId)
      const weeklyCards = []
      for (const key of weeklyCardDatas) {
        weeklyCards.push({
          label: wekklyCardTitleMap[key],
          value: (datas[key] || []).reduce((total, item) => (total += item.cnt), 0)
        })
      }
      this.setData({ weeklyCards })
      
    } catch (error) {
      console.error(error)
    }
  },

  onCollapsChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  // 文章数据
  async getPostsData() {
    try {
      // 有最大 20 条的限制，所以只能遍历查询
      const total = this.data.userDetailsInfo.post_article_count
      const posts = []
      for (let page_no = 1; page_no <= Math.ceil(total / 20); page_no++) {
        const { data } = await getCreatorPosts(page_no)
        for (let post of data) {
          posts.push({
            title: post.article_info.title,
            article_id: post.article_id,
            display_count: post.article_info.display_count,
            view_count: post.article_info.view_count,
            digg_count: post.article_info.digg_count,
            collect_count: post.article_info.collect_count,
            comment_count: post.article_info.comment_count,

            create_time: post.article_info.ctime,
            category_name: post.category.category_name
          })
        }
      }

      let viewTop = posts.sort((a, b) => b.view_count - a.view_count).slice(0, 10);
      let diggTop = posts.sort((a, b) => b.digg_count - a.digg_count).slice(0, 10);
      let commentTop = posts.sort((a, b) => b.comment_count - a.comment_count).slice(0, 10);
      let collectTop = posts.sort((a, b) => b.collect_count - a.collect_count).slice(0, 10);

      this.setData({ postsTop: { viewTop, diggTop, commentTop, collectTop }, posts })
    } catch (error) {
      console.error(error)
    }
  },


  pageToPostDetails(e) {
    const { post } = e.currentTarget.dataset || e.target.dataset;
    console.log(post)
    wx.navigateTo({
      url: '../postReading/postReading',
      success(res) {
        res.eventChannel.emit('continueReading', post)
      }
    })
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