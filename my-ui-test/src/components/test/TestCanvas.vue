<template>
  <div>
    <nav class="navbar navbar-default" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">菜鸟教程</a>
        </div>
        <div>
          <ul class="nav navbar-nav">
            <li class="active">
              <a href="#">iOS</a>
            </li>
            <li>
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">SVN</a>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                Java
                <b class="caret"></b>
              </a>
              <ul class="dropdown-menu">
                <li><a href="#">jmeter</a></li>
                <li><a href="#">EJB</a></li>
                <li><a href="#">Jasper Report</a></li>
                <li class="divider"></li>
                <li><a href="#">分离的链接</a></li>
                <li class="divider"></li>
                <li><a href="#">另一个分离的链接</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container" v-show="!loginState">
      <div class="row">
        <div class="col-*-*"><input type="text" v-model="uid" plaseholder="请输入连接昵称" /></div>
        <div class="col-*-*"><button v-on:click="openSocket">connect</button></div>
      </div>
    </div>
    <div class="container" id="msgSp" v-show="loginState">
      <div class="row">
        <canvas id="myCanvas" width="800" height="600" style="background-color: white;"></canvas>
      </div>
      <div class="row">
        <div class="col-*-*"><input type="text" v-model="msgTxt" /></div>
        <div class="col-*-*"><button v-on:click="sendBtn">send</button></div>
      </div>
    </div>
  </div>
</template>

<script>
// import timerBtn from './timerBtn'

export default {
  name: 'TestCanvas',
  // 引入的组件要注册
  components: {
    // 'timerBtn': timerBtn
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      socket: null,
      $myCanvas: null,
      txtPX: 40,
      txtPY: 40,
      loginState: false,
      uid: '',
      msgTxt: ''
    }
  },
  // 加载
  mounted: function () {

  },
  // 方法
  methods: {
    openSocket (uid) {
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')
        // 实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        // 等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        // var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        var socketUrl = 'http://172.168.169.35:8088/' + uid
        socketUrl = socketUrl.replace('https', 'ws').replace('http', 'ws')
        console.log(socketUrl)
        if (this.socket != null) {
          this.socket.close()
          this.socket = null
        }
        this.socket = new WebSocket(socketUrl)
        // 打开事件
        this.socket.onopen = function () {
          console.log('websocket已打开')
          alert('已连接服务器')
          // this.socket.send("这是来自客户端的消息" + location.href + new Date());
          this.$refs.loginSp.hide()
          this.$refs.msgSp.show()
        }
        // 获得消息事件
        this.socket.onmessage = function (res) {
          console.log(res.data)
          // 发现消息进入    开始处理前端触发逻辑
          var resMsgStr = res.data
          var resMsg = this.$.parseJSON(resMsgStr)

          var comm = resMsg.comm
          var msg = resMsg.msg
          if (comm === 'draw') {
            var points = msg.split(',')
            console.log(points[0] + '-' + points[1])
            this.drowSomething(null, points[0], points[1])
          } else {
            this.drowSomething(msg, this.txtPX, this.txtPY)

            if (this.txtPY < 600) {
              this.txtPY += 40
            } else {
              this.txtPY = 40
              this.txtPX += 60
            }
          }
        }
        // 关闭事件
        this.socket.onclose = function () {
          console.log('websocket已关闭')
          alert('已断开连接')
        }
        // 发生了错误事件
        this.socket.onerror = function () {
          console.log('websocket发生了错误')
          alert('连接出现错误')
        }
      }
    },
    sendMessage (comm, msg) {
      if (typeof (this.socket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')
        console.log('{"comm":"' + comm + '","msg":"' + msg + '"}')
        this.socket.send('{"comm":"' + comm + '","msg":"' + msg + '"}')
      }
    },
    drowSomething (txt, px, py) {
      this.$myCanvas.drawText({
        text: txt == null ? 'o' : txt,
        fontFamily: 'cursive',
        fontSize: txt == null ? 5 : 20,
        x: px,
        y: py,
        fillStyle: 'lightblue',
        strokeStyle: 'blue',
        strokeWidth: 1
      })
    }
  }

}

</script>

<style scoped>
  body input[type="text"] {
    height: 40px;
  }

</style>
