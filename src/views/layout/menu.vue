<template>
  <el-menu style="height:100%;width: 200px;" class="el-menu-vertical-demo" active-text-color="#ffd04b" background-color="#304156"
    text-color="#fff"  router unique-opened
     :collapse-transition='false'>
    <!-- subitem in list 这里面的list是testData.js里面的数据，实际上就是后端返回的数据 后端返回的数据要包括url地址 -->
    <template v-for="subitem in list" :key="subitem.id">
      <!-- 根据有没有下级，判断点击出现菜单还是打开页面 -->
      <el-sub-menu v-if="subitem.children && subitem.children.length > 0" :index="subitem.id">
        <template #title>
          <!-- <el-icon>
            <component :is="subitem.icon"></component>
          </el-icon> -->
          <span>{{ subitem.label }}</span>
        </template>
        <el-menu-item v-for="item in subitem.children" @click="changePage(item.url)" :index="item.url" :key="item.id">
          <!-- <el-icon>
            <component :is="item.icon"></component>
          </el-icon> -->
          {{ item.label }}
        </el-menu-item>
      </el-sub-menu>
      <!-- index会被当作是路由path 点击后会直接切换浏览器的地址栏 -->
      <el-menu-item v-else :index="subitem.url" @click="changePage(subitem.url)">
        <el-icon>
          <component :is="subitem.icon"></component>
        </el-icon>
        <span>{{ subitem.label }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>



export default {
  name: '',
  data() {
    return {
      defaultPage: "",//为了让页面刷新后还是打开上一次的组件
      list: []
    }
  },
  mounted() {
    //页面刷新后的加载组件 layout下的index.vue也有配置
    this.defaultPage = sessionStorage.getItem('path') || "/index/welcome";

    //查询后端菜单数据
    this.queryMenuList();
  },
  methods: {
    queryMenuList() {
      //写远程调用接口获取服务器的数据
      //此处暂时拿测试数据
      let account=this.$store.state.account
     
      this.$http.post("queryByUserId", {account:account}).then((res) => {

        if (res.succes) {
          //console.log("111111")
          this.list = res.data;
       
        } else {

         
        }

      })

      // this.list = this.$test.menuData.data;
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },

    changePage(path) {
      //点击了菜单按钮后，记录当前按钮的path值
      let t = path
      this.defaultPage = t
      sessionStorage.setItem('path', t)
    }
  }
}
</script>

<style scoped></style>
