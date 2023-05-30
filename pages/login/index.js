const app = getApp()

const pageOptions = {
  // 页面数据
  data: {
    userId: '',
    uuid: '',
    cookie: ''
  },
  // methods
  bindUserIdInput(e) {
    this.setData({
      userId: e.detail.value
    })
  },
  bindUUIdInput(e) {
    this.setData({
      uuid: e.detail.value
    })
  },
  bindCookieInput(e) {
    this.setData({
      cookie: e.detail.value
    })
  },
  submitForm() {
    const { userId, uuid, cookie } = this.data
    app.globalData.userInfo = { hasLogin: true, userId, uuid, cookie }
    wx.setStorageSync('userInfo', { hasLogin: true, userId, uuid, cookie })
    wx.navigateBack({
      delta: 0,
    })
  },
  // 页面载入时
  onLoad(e) {
  },
  // 页面准备好时
  onReady() { },
  // 页面显示时
  onShow() {
    const userInfo = wx.getStorageSync('userInfo') || { hasLogin: false }
    this.setData({ ...userInfo })
  },
  // 页面隐藏时
  onHide() { },
  // 页面卸载时
  onUnload() { },
  // 下拉页面时
  onPullDownRefresh() { },
  // 到达页面底部时
  onReachBottom() { },
  // 页面滚动时
  onPageScroll() { },
  // 分享时，注：onShareAppMessage不能为async异步函数，会导致不能及时取得返回值，使得分享设置无效
  onShareAppMessage() {
    /* const title = ''
    const path = ''
    const imageUrl = ``

    return {
      title,
      path,
      imageUrl,
    } */
  },
}

Page(pageOptions)
