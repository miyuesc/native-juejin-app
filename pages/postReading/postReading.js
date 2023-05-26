// pages/postReading/postReading.js
import { getPageHtml } from "../../utils/request"
import { getPostContentString } from "../../utils/util"

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSectionContent: null,
    currentSectionContentStr: '',
    currentSectionUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      eventChannel.on('continueReading', (post) => {
        wx.setNavigationBarTitle({ title: post.title })
        getPageHtml(`https://juejin.cn/post/${post.article_id}`).then((res) => {

          const currentSectionContent = app.towxml(getPostContentString(res.data), 'html', {
            events: {
              tap(ev) {
                const { data } = ev.currentTarget.dataset
                const { tag, attrs } = data || {}
                if (tag === 'img') {
                  wx.previewImage({
                    urls: (currentSectionContent._images || []).map(img => img.src),
                    current: attrs.src
                  })
                  return;
                }
                if (tag === 'navigator') {
                  wx.setClipboardData({
                    data: attrs.href,
                    success: () =>
                      wx.showToast({ title: '链接已复制' })
                  })
                }
              }
            }
          })

          this.setData({
            currentSectionContent
          })
        }).finally(() => wx.hideLoading())
      })
    } else {
      wx.navigateBack({
        delta: 0,
      })
    }
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