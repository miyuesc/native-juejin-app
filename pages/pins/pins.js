import {
  getNewestPins,
  getHotestPins,
  getFollowPins,
  getMinePins
} from "../../requests/pins.js"
import { convertTimeToHumanReadable } from "../../utils/util.js"

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

// pages/pins.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    scrollInto: "",
    newsList: [],
    tabIndex: 0,
    activeTab: {},
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
  },

  async getPinsData(tabId) {
    try {
      const currentPinsObj = this.data.pinsListMap[tabId]
      console.log(tabId, currentPinsObj)
      if (!currentPinsObj || currentPinsObj.isLoading) {
        return
      }
      this.assignPinsData(tabId, { isLoading: true })
      const {
        data,
        cursor
      } = await tabRequestMap[tabId](currentPinsObj.cursor, '747323639208391');

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
          pinMommentCount: pinItem['msg_Info']['momment_count'],
          pinDiggCount: pinItem['msg_Info']['digg_count']
        }
      })
      const pinsList = currentPinsObj.data.concat(dataArr)

      this.assignPinsData(tabId, { cursor, data: pinsList })

    } catch (e) {
      console.error(e)
      wx.showToast({
        icon: 'error',
        title: '请求失败',
        duration: 2000
      });
    } finally {
      this.assignPinsData(tabId, { isLoading: false })
    }
  },
  loadMore(e) {
    console.log(e.currentTarget.dataset)
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

  ontabtap(e) {
    const { idx } = e.currentTarget.dataset || e.target.dataset;
    this.switchTab(idx);
  },
  ontabchange(e) {
    const idx = e.target.current || e.detail.current;
    this.switchTab(idx);
  },
  switchTab(index) {
    if (this.data.tabIndex === index) {
      return;
    }
    const activeTab = this.data.tabBars[index]
    const pinsListMap = this.data.pinsListMap
    this.setData({
      tabIndex: index,
      activeTab: activeTab,
      scrollInto: activeTab.id
    });
    // 如果没有数据，则加载
    if (!pinsListMap[activeTab.id].data || !pinsListMap[activeTab.id].data.length) {
      this.getPinsData(activeTab.id)
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      tabIndex: 0,
      activeTab: this.data.tabBars[0],
      scrollInto: this.data.tabBars[0].id
    });
    this.getPinsData(this.data.tabBars[0].id);
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