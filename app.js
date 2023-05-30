// app.js
App({
  // 引入`towxml3.0`解析方法
  towxml:require('/common/components/towxml/index'),
  globalData: {
    userInfo: {
      hasLogin: false
    }
  },
  onLaunch() {
    this.globalData.userInfo = wx.getStorageSync('userInfo') || { hasLogin: false }
  },
})
