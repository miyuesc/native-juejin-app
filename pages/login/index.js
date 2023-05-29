const app = getApp()

const pageOptions = {
  // 页面数据
  data: {
    userId: '',
    uuid: '',
    cookie: "csrf_session_id=12a90d8fdc4c9a9d14d862d1ae1d6057; _tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227221030193568564768%2522%252C%2522user_unique_id%2522%253A%25227221030193568564768%2522%252C%2522timestamp%2522%253A1681277122377%257D; passport_csrf_token=2c32e8a619e6f627c0644d59c6645354; passport_csrf_token_default=2c32e8a619e6f627c0644d59c6645354; n_mh=B7_vBc-2XU_yVz25zdKbDp0WRp0eJctI-cS0VMrYTvc; sid_guard=4138ff53f9c3ae6fd063d1bbc0eee7af%7C1681277144%7C31536000%7CThu%2C+11-Apr-2024+05%3A25%3A44+GMT; uid_tt=65a184712d40d89bce28b8a4fda65e4a; uid_tt_ss=65a184712d40d89bce28b8a4fda65e4a; sid_tt=4138ff53f9c3ae6fd063d1bbc0eee7af; sessionid=4138ff53f9c3ae6fd063d1bbc0eee7af; sessionid_ss=4138ff53f9c3ae6fd063d1bbc0eee7af; sid_ucp_v1=1.0.0-KDg5MzdiZmM3NDI1Njg1MGQ2NTc0OTVlNDdiZDdkNTA1MTlmMjdkNzcKFwjHs7DA_fWpARDYgdmhBhiwFDgCQO8HGgJsZiIgNDEzOGZmNTNmOWMzYWU2ZmQwNjNkMWJiYzBlZWU3YWY; ssid_ucp_v1=1.0.0-KDg5MzdiZmM3NDI1Njg1MGQ2NTc0OTVlNDdiZDdkNTA1MTlmMjdkNzcKFwjHs7DA_fWpARDYgdmhBhiwFDgCQO8HGgJsZiIgNDEzOGZmNTNmOWMzYWU2ZmQwNjNkMWJiYzBlZWU3YWY; store-region=cn-cq; store-region-src=uid"
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
  onShow() { },
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
