import {
  getNewestPins,
  getHotestPins,
  getFollowPins,
  getMinePins
} from "../../requests/pins.js"
import { convertTimeToHumanReadable } from "../../utils/util.js"

const app = getApp()

const emptyData = {
  data: [],
  cursor: '0',
  isLoading: false,
  refreshText: "",
  loadingText: '加载中...'
}

const tabRequestMap = {
  newest: getNewestPins,
  hotest: getHotestPins,
  follow: getFollowPins,
  mine: getMinePins,
}

const searchParamsMap = {
  newest: { cursor: '0', "sort_type": 300 },
  hotest: { cursor: '0', "sort_type": 200 },
  follow: {},
  mine: { 'user_id': app.globalData.userInfo.user_id, "sort_type": 4 },
}

// pages/pins.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBars: [{
      name: '最新',
      id: 'newest'
    }, {
      name: '热门',
      id: 'hotest'
    }, {
      name: '关注',
      id: 'follow'
    }, {
      name: '我的',
      id: 'mine'
    }],
    hasLogin: false,
    pinsListMap: {
      newest: {
        ...emptyData
      },
      hotest: {
        ...emptyData
      },
      follow: {
        ...emptyData
      },
      mine: {
        ...emptyData
      },
    },
    tabIndex: 0,
    activeTab: null
  },

  async getPinsData(tabId) {
    try {
      if(!this.data.hasLogin && (tabId === 'mine' || tabId === 'follow')) {
        return;
      }
      const currentPinsObj = this.data.pinsListMap[tabId]
      if (!currentPinsObj) {
        return
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      const {
        data,
        cursor
      } = await tabRequestMap[tabId]({ ...searchParamsMap[tabId], cursor: currentPinsObj.cursor });

      const dataArr = (data || []).map(pinItem => {
        return {
          userId: pinItem['author_user_info']['user_id'],
          userName: pinItem['author_user_info']['user_name'],
          userIcon: pinItem['author_user_info']['avatar_large'],
          userJobTitle: pinItem['author_user_info']['job_title'],
          userCompany: pinItem['author_user_info']['company'],

          pinId: pinItem['msg_Info']['msg_id'],
          pinContent: pinItem['msg_Info']['content'],
          pinImagesList: pinItem['msg_Info']['pic_list'],
          pinTime: convertTimeToHumanReadable(pinItem['msg_Info']['ctime'] * 1000),
          pinCommentCount: pinItem['msg_Info']['comment_count'],
          pinDiggCount: pinItem['msg_Info']['digg_count'],

          hotCommentId: pinItem['hot_comment']['comment_id'],
          hotCommentBody: pinItem['hot_comment']?.comment_info?.comment_content,

          topicTitle: pinItem['topic']['title'],
          topicIcon: pinItem['topic']['icon'],
          topicId: pinItem['topic']['topic_id'],
        }
      })
      const pinsList = currentPinsObj.data.concat(dataArr)

      this.assignPinsData(tabId, { cursor, data: pinsList })
      wx.hideLoading()

    } catch (e) {
      console.error(e)
      wx.hideLoading()
      wx.showToast({
        icon: 'error',
        title: '请求失败',
        duration: 2000
      });
    } finally {
      // this.assignPinsData(tabId, { isLoading: false })
    }
  },
  loadMore(e) {
    const { item } = e.currentTarget.dataset || e.target.dataset;
    this.getPinsData(item.id);
  },
  assignPinsData(tabId, data) {
    this.setData({
      pinsListMap: {
        ...this.data.pinsListMap,
        [tabId]: {
          ...this.data.pinsListMap[tabId],
          ...data
        }
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
    const activeTab = this.data.tabBars[index]
    const pinsListMap = this.data.pinsListMap
    this.setData({
      tabIndex: index,
      activeTab: activeTab
    });
    // 如果没有数据，则加载
    if (!pinsListMap[activeTab.id].data || !pinsListMap[activeTab.id].data.length) {
      this.getPinsData(activeTab.id)
    }
  },

  refreshData() {
    const activeTabId = this.data.activeTab.id;
    this.assignPinsData(activeTabId, { data: [], cursor: '0', isLoading: true });
    this.getPinsData(activeTabId).then(() => {
      wx.stopPullDownRefresh();
      this.assignPinsData(activeTabId, { isLoading: false })
    });
  },

  previewImage(event) {
    const { imagesList } = event.currentTarget.dataset || event.target.dataset
    wx.previewImage({
      urls: imagesList
    })
  },

  pageToPinDetail(event) {
    const { pinDetail } = event.currentTarget.dataset || event.target.dataset
    console.log(pinDetail)
    wx.navigateTo({
      url: `../pinDetails/pinDetails?msg_id=${pinDetail.pinId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
    const tabIndex = this.data.tabIndex || 0
    const activeTab = this.data.activeTab || this.data.tabBars[0]
    this.setData({
      hasLogin: userInfo.hasLogin,
      tabIndex: tabIndex,
      activeTab: activeTab
    });
    this.getPinsData(activeTab.id);
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
    this.refreshData()
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