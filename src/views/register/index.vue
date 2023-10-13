<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">注册</div>
      <div class="form-wrapper">
        <input type="text" name="username" placeholder="用户名" class="input-item">
        <input type="password" name="password" placeholder="密码" class="input-item">
        <input type="password" name="password" placeholder="确认密码" class="input-item">
        <div class="btn">注册</div>
      </div>
      <div class="msg">
        已有账户？
        <a href="#" @click.prevent="login">登录</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {
         login(){
          //利用代码进行跳转是时候vue有提供了关键词$router
          this.$router.push("/login")//通常来说括号里面直接写path就可以了还可用name
          //this.$router.replace('/register')
          // this.$router.push({
          //   name:'a'
          // })
         }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  background-image: linear-gradient(to right, #999999, #330867);
}

.login-wrapper {
  background-color: bisque;
  width: 358px;
  height: 588px;
  border-radius: 15px;
  padding: 0 50px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
}

.input-item {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  border: 0;
  padding: 10px;
  border-bottom: 1px solid rgb(128, 125, 125);
  font-size: 15px;
  outline: none;
}

.input-item::placeholder {
  text-transform: uppercase;
}

.btn {
  text-align: center;
  padding: 10px;
  width: 100%;
  margin-top: 40px;
  background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
  color: #fff;
}

.msg {
  text-align: center;
  line-height: 88px;
}

a {
  text-decoration-line: none;
  color: #abc1ee;
}
</style>

