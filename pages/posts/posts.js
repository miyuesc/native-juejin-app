import {
  getCategoryList,
  getFollowsPosts,
  getCategoryPosts,
  getComprehensivePosts,
  getMinePost
} from "../../requests/posts"
import { formatTimeGap } from "../../utils/util"

const presetCategoryList = [
  {
    category_id: "comprehensive",
    category_name: "综合",
    category_url: "comprehensive",
  }
]
const userCategoryList = [
  {
    category_id: "follow",
    category_name: "关注",
    category_url: "follow",
  },
  {
    category_id: "mine",
    category_name: "我的",
    category_url: "mine",
  }
]

const emptyData = {
  data: [],
  cursor: '0',
  isLoading: false,
  refreshText: "",
  loadingText: '加载中...'
}

const tabRequestMap = {
  follow: getFollowsPosts,
  mine: getMinePost,
  comprehensive: getComprehensivePosts,
  default: getCategoryPosts,
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    postMap: {
      follow: { ...emptyData },
      mine: { ...emptyData },
      comprehensive: { ...emptyData }
    },
    hasLogin: false,
    tabIndex: 0,
    activeTab: null
  },
  // methods
  // tabs 标签栏
  async initNavTabsList() {
    let cateList = [...presetCategoryList]
    if (getApp().globalData.userInfo.hasLogin) {
      cateList.push(...userCategoryList)
    }
    try {
      const { data } = await getCategoryList()
      cateList.push(...data.map(({ category_id, category_name, category_url }) => ({ category_id, category_name, category_url })))
    } catch (e) {
      // 
    }
    this.setData({ categoryList: cateList })
  },
  // 标签栏内文章列表
  async getNavTabPosts(tabId) {
    try {
      if(!this.data.hasLogin && (tabId === 'mine' || tabId === 'follow')) {
        return;
      }
      let currentPinsObj = this.data.postMap[tabId]
      if (!currentPinsObj) {
        this.assignInstanceData(tabId, currentPinsObj = emptyData)
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      // 请求方法和参数
      let requestMethod = tabRequestMap[tabId] || tabRequestMap.default
      let requestForm = {
        cate_id: tabId,
        cursor: currentPinsObj.cursor,
        sort_type: 300
      }
      if (tabId === 'mine') {
        requestForm.sort_type = (requestForm.sort_type / 100) - 1
      }
      // 请求数据
      const { data, cursor } = await requestMethod(requestForm)
      const now = Math.floor(Date.now() / 1000)

      const newPostArr = (data || []).reduce((cur, item) => {
        let post = item
        if (item.item_type && item.item_info) {
          if (item.item_type === 14) {
            // 广告直接返回
            return cur
          }
          post = item.item_info
        }
        const postInfo = {
          title: post.article_info.title,
          article_id: post.article_info.article_id,
          cover_image: post.article_info.cover_image,
          brief_content: post.article_info.brief_content,
          time_gap: formatTimeGap(now - post.article_info.ctime),
          is_markdown: post.article_info.comment_count,
          tags: (post.tags || []).map(t => t.tag_name),

          view_count: post.article_info.view_count,
          digg_count: post.article_info.digg_count,
          comment_count: post.article_info.comment_count,
          collect_count: post.article_info.collect_count,

          author_name: post.author_user_info.user_name,
          author_job_title: post.author_user_info.job_title,
          author_company: post.author_user_info.company,
          author_avatar_large: post.author_user_info.avatar_large
        }
        cur.push(postInfo)
        return cur
      }, [])

      const postList = currentPinsObj.data.concat(newPostArr)

      this.assignInstanceData(tabId, { cursor, data: postList })

      wx.hideLoading()
    } catch (error) {
      console.error(error)
      wx.hideLoading()
      wx.showToast({
        icon: 'error',
        title: '请求失败',
        duration: 2000
      });
    }
  },
  assignInstanceData(tabId, data) {
    this.setData({
      [`postMap.${tabId}`]: {
        ...(this.data.postMap[tabId] || {}),
        ...data
      }
    })
  },

  onTabClick(event) {
    const { detail } = event;
    this.switchTab(detail.name);
  },
  switchTab(index) {
    if (this.data.tabIndex === index) {
      return;
    }
    const activeTab = this.data.categoryList[index]
    const postMap = this.data.postMap
    this.setData({
      tabIndex: index,
      activeTab: activeTab
    });
    // 如果没有数据，则加载
    if (!postMap[activeTab.category_id] || !postMap[activeTab.category_id].data || !postMap[activeTab.category_id].data.length) {
      this.getNavTabPosts(activeTab.category_id)
    }
  },

  refreshData() {
    const activeTabId = this.data.activeTab.category_id;
    this.assignInstanceData(activeTabId, { data: [], cursor: '0', isLoading: true });
    this.getNavTabPosts(activeTabId).then(() => {
      this.assignInstanceData(activeTabId, { isLoading: false })
    });
  },
  loadMore(e) {
    const { item } = e.currentTarget.dataset || e.target.dataset;
    this.getNavTabPosts(item.category_id);
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
    const userInfo = getApp().globalData.userInfo
    this.setData({
      hasLogin: userInfo.hasLogin
    })
    this.initNavTabsList().then(() => {
      const activeTab = this.data.categoryList[0]
      this.setData({
        tabIndex: 0,
        activeTab
      });
      this.getNavTabPosts(activeTab.category_id)
    })
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