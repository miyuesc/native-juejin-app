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
const searchParamsMap = {
  newest: { cursor: '0', "sort_type": 300 },
  hotest: { cursor: '0', "sort_type": 200 },
  follow: {},
  mine: { 'user_id': '747323639208391' },
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
    scrollInto: "",
    newsList: [],
    tabIndex: 0,
    activeTab: {},
    show: false,
    activeImg: '',

    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0,  //两指距离
      scale: 1,  //缩放倍数
    }
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

          topicTitle: pinItem['topic']['title'],
          topicIcon: pinItem['topic']['icon'],
          topicId: pinItem['topic']['topic_id'],
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

  onTabClick(event) {
    const { detail } = event;
    console.log('click', detail)
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
      activeTab: activeTab,
      scrollInto: activeTab.id
    });
    // 如果没有数据，则加载
    if (!pinsListMap[activeTab.id].data || !pinsListMap[activeTab.id].data.length) {
      this.getPinsData(activeTab.id)
    }
  },

  previewImage(event) {
    console.log('preview', event)
    const { dataset } = event.currentTarget || event.target
    this.setData({
      show: true,
      activeImg: dataset.img,
      stv: {
        offsetX: 0,
        offsetY: 0,
        zoom: false, //是否缩放状态
        distance: 0,  //两指距离
        scale: 1,  //缩放倍数
      }
    })
  },

  onClickHide() {
    this.setData({
      show: false
    })
  },

  // 触摸开始
  touchstartCallback(e) {
    console.log('touchstartCallback');
    console.log(e);

    if (e.touches.length === 1) {
      let { clientX, clientY } = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'stv.distance': distance,
        'stv.zoom': true, //缩放状态
      })
    }
  },
  // 触摸移动中
  touchmoveCallback(e) {
    //console.log('touchmoveCallback');
    //console.log(e);

    if (e.touches.length === 1) {
      // 单指移动
      if (this.data.stv.zoom) {
        // 缩放状态，不处理单指
        return;
      }
      let { clientX, clientY } = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let { stv } = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      this.setData({
        stv: stv
      });
    } else {
      // 双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      let distanceDiff = distance - this.data.stv.distance;
      let newScale = this.data.stv.scale + 0.005 * distanceDiff;

      this.setData({
        'stv.distance': distance,
        'stv.scale': newScale,
      })
    }
  },
  // 触摸结束
  touchendCallback(e) {
    console.log('touchendCallback');
    console.log(e);

    if (e.touches.length === 0) {
      this.setData({
        'stv.zoom': false, //重置缩放状态
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
    const activeTabId = this.data.activeTab.id;
    console.log('reload', activeTabId)
    this.assignPinsData(activeTabId, { data: [], cursor: '0' });
    this.getPinsData(activeTabId).then(() => wx.stopPullDownRefresh());
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