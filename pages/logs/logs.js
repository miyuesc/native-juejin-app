// logs.js
import { formatTime } from '../../utils/util.js'

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
