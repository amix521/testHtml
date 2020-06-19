<template>
  <div>
    <input type="text" v-model="text">
    <button @click="sendMessage">发送消息</button>
    <div class="bubble">
    </div>
    <div>
      <div v-for="(data,key) in datas" :key="key">
        {{data.content}}
      </div>
    </div>
  </div>
</template>
<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
export default {
  name: 'TestStomp',
  data () {
    return {
      uid: '',
      text: '',
      datas: [],
      stompClient: null
    }
  },
  mounted () {
    if ('WebSocket' in window) {
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
  },
  methods: {
    sendMessage () {
      /** 日了狗了，这个send发送第二个参数是要发送的参数，第三个是头！！！ */
      console.log(JSON.stringify({'uid': this.uid, 'msg': this.text}))
      this.stompClient.send('/app/receive', JSON.stringify({'uid': this.uid, 'msg': this.text}), {})
    },
    initWebSocket () {
      /** 初始化连接 */
      const socket = new SockJS('http://172.168.169.35:8088/stomp')
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect({}, this.onConnected, this.onFailed)
    },
    onConnected: function (frame) {
      /** 连接后回调 */
      console.log('Connected: ' + frame)
      var topic = '/topic/what'
      this.subscribe(topic)
    },
    onFailed: function (err) {
      console.log('Failed: ' + err)
    },
    subscribe: function (topic) {
      /** 订阅频道 */
      let ss = this.stompClient.subscribe(topic, this.responseCallback, this.onFailed)
      console.log(ss)
      this.uid = ss.id
    },
    responseCallback: function (greeting) {
      /** 接收消息 */
      console.log(JSON.parse(greeting.body))
      this.datas.push(JSON.parse(greeting.body.msg))
    }
  }
}
</script>

<style scoped>
</style>
