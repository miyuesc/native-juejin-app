// app.js
App({
  // 引入`towxml3.0`解析方法
  towxml:require('/towxml/index'),
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: {
      hasLogin: true,
      user_id: '747323639208391',
      uuid: '7215848128545064463'
    }
  }
})
