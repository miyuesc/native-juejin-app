import { getCategoryList, getFollowsPosts, getCategoryPosts, getComprehensivePosts } from "../../requests/posts"
import { formatTimeStep } from "../../utils/util"



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
  mine: getFollowsPosts,
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
    tabIndex: 0,
    activeTab: {}
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
      cateList.push(...data)
    } catch (e) {
      // 
    }
    this.setData({ categoryList: cateList })
  },
  // 标签栏内文章列表
  async getNavTabPosts(tabId) {
    try {
      let currentPinsObj = this.data.postMap[tabId]
      if (!currentPinsObj) {
        this.assignPinsData(tabId, currentPinsObj = emptyData)
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
      // 请求数据
      const { data, cursor } = await requestMethod(requestForm)
      const now = Math.floor(Date.now() / 1000)
      
      const newPostArr =  (data || []).reduce((cur, item) => {
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
          cover_image: post.article_info.cover_image,
          brief_content: post.article_info.brief_content,
          time_gap: formatTimeStep(post.article_info.ctime - now),
          is_markdown: post.article_info.comment_count,
          tags: (post.tags || []).map(t => t.tag_name),

          view_count: post.article_info.comment_count,
          digg_count: post.article_info.comment_count,
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

      this.assignPinsData(tabId, { cursor, data: postList })

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
  assignPinsData(tabId, data) {
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
    console.log(postMap[activeTab.category_id], !postMap[activeTab.category_id])
    if (!postMap[activeTab.category_id] || !postMap[activeTab.category_id].data || !postMap[activeTab.category_id].data.length) {
      this.getNavTabPosts(activeTab.category_id)
    }
  },

  refreshData() {},
  loadMore() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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