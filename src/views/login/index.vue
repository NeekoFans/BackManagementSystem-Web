<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">登录</div>
      <div class="form-wrapper">
        <input v-model="account" type="text" name="username" placeholder="用户名" class="input-item">
        <input v-model="password" type="password" name="password" placeholder="密码" class="input-item">
        <div class="btn" @click.prevent="login">登录</div>
      </div>
      <div class="msg">
        没有账户?
        <a href="#" @click.prevent="register">注册</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
       account:"",
       password:"",
       id:"",
       JxcMenu:{id:"0",text:"材料关联",icon:"88",url:"66",order:3}
    }
  },
  mounted () {

  },
  methods: {

     login(){
      
      this.$http.post("login",{account:this.account,password:this.password}).then((cs)=>{ 
        if(cs.code==200){
          localStorage.setItem("token",cs.account)
          this.$store.commit("setAccount",cs.account)
           this.$router.replace("/main")
        }

      })
      // this.$http.post("getJxcMenu",{text:this.JxcMenu.text,url:this.JxcMenu.url,icon:this.JxcMenu.icon,order:this.JxcMenu.order,id:this.account}).then((cs)=>{ 
      //  this.$store.commit("setUser",cs);

      // })
      //     this.$router.push("/main")
          
          let token="aaa"
          localStorage.setItem("token",token)
         },
         register(){
          this.$router.push("/register")
         },
        
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

