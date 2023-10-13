<template>
  <div>
菜单管理
    <div>
    <div class="dev-type-main-left">
        <!--鼠标右键菜单栏 -->
        <div v-show="showRightMenu">
          <ul id="menu"
              class="right-menu">
            <li class="menu-item"
                @click="addDevHandle">
              添加下级
            </li>
          
            <li class="menu-item"
                @click="editDevHandle">
              编辑
            </li>
            <li class="menu-item"
                @click="delDevHandle">
              删除
            </li>
          </ul>
        </div>
        <el-tree :data="treeData"
                 :props="treeProps"
                 accordion
                 highlight-current
                 default-expand-all
                 node-key="id"
                 ref="vueTree"
                 @node-contextmenu="rightClick"
                 @node-click="handleNodeClick">
        </el-tree>
      </div>

  </div>
    <!-- 菜单树管理
    <el-tree :data="treeData" :props="treeProps"  @node-click="handleNodeClick" /> -->
    <el-row>
        <el-button type="primary" plain  @click="addRootMenu">添加根目录</el-button>
    </el-row>
    <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="menuForm" label-width="80px">
    <el-form-item label="菜单名称">
      <el-input v-model="menuForm.menuName">
      </el-input>
    </el-form-item>

    <el-form-item label="菜单链接">
      <el-input v-model="menuForm.menuUrl">
      </el-input>
    </el-form-item>

    <el-form-item label="菜单顺序">
      <el-input v-model="menuForm.ordered">
      </el-input>
    </el-form-item>

    <el-form-item label="菜单图标">
      <el-input  v-model="menuForm.icon">
      </el-input>
    </el-form-item>
    <!-- <el-form-item label="菜单id" v-if="flag">
      <el-input  v-model="menuForm.id">
      </el-input>
    </el-form-item> -->
    <el-form-item label="菜单pid" v-if="flag">
      <el-input  v-model="menuForm.pid"  @click="autoPid" >
      </el-input>
    </el-form-item>

    <el-form-item>
                <el-button type="primary" @click="editBrand">立即修改</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
    </el-form>
  </el-dialog>

  </div>
</template>

<script>
//import { th } from 'element-plus/es/locale';
//参考第一个的树形控件案例

export default {
  name: 'DeviceType',
 
  data() {
     name: ''
    return {
      dialogVisible:false,
      showRightMenu: false,
      operation:1,
      flag:false,
      pidInsert:'',
      treeData: [
        // {
        //   label: '系统管理',
        //   children: [
        //     {
        //       label: '用户管理',
        //       children: [
        //         {
        //           label: '部门管理',
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   label: '出入库管理',
        //   children: [
        //     {
        //       label: '出库单',
        //       children: [
        //         {
        //           label: 'Level three 2-1-1',
        //         },
        //       ],
        //     },
        //     {
        //       label: 'Level two 2-2',
        //       children: [
        //         {
        //           label: 'Level three 2-2-1',
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   label: 'Level one 3',
        //   children: [
        //     {
        //       label: 'Level two 3-1',
        //       children: [
        //         {
        //           label: 'Level three 3-1-1',
        //         },
        //       ],
        //     },
        //     {
        //       label: 'Level two 3-2',
        //       children: [
        //         {
        //           label: 'Level three 3-2-1',
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],

      treeProps: {
        children: 'children',
        label: 'label',
      },
      //JxcMenu: { id: "0", text: "材料关联", icon: "88", url: "66", order: 3 },
      menuForm:{
        menuName:'',
        menuUrl:'',
        pid:'',
        ordered:'',
        icon:'',
      }
    }

  },
  
 
  mounted() {
    //调用手动写入节点数据方法
    // let that = this;
    // this.$http.post("getJxcMenu", {}).then((res) => {
 
    //   if (res.succes) {
    //     //console.log("111111")
    //     that.treeData = res.data;
    //   } else {

    //     console.log(res)
    //   }

    // })

let that = this;
    this.$http.post("query", {}).then((res) => {
 
      if (res.succes) {
        //console.log("111111")
        that.treeData = res.data;
      } else {

        console.log(res)
      }

    })

  },
  methods: {
    // handleNodeClick(data) {
    //   console.log('Node Click', data.id, data, data.name)
    // },
    
    rightClick(event, data, node, obj) {
      this.showRightMenu = false // 先把模态框关死，目的是：第二次或者第n次右键鼠标的时候 它默认的是true
   
          this.showRightMenu = true
  

      let menu = document.querySelector('#menu')
      menu.style.left = event.clientX - 220 + 'px'
      menu.style.top = event.clientY - 5 + 'px'
      // 给整个document添加监听鼠标事件，点击任何位置执行closeRightMenu方法，及时将菜单关闭
      document.addEventListener('click', this.closeRightMenu)
      //console.log('event', event, event.clientX, event.clientY)
      //console.log('data', data)
     //console.log(node);
     //自动获取节点的id和pid
      this.menuForm.id=node.data.id
      this.menuForm.pid=node.data.pid
      console.log(node)
    
    },
    addRootMenu(){
      this.dialogVisible=true;
      this.operation=2;
      this.flag=true;
      this.menuForm.pid=0
    },
    //点击输入框自动填入pid
    // autoPid(){
    //     this.pidInsert=this.menuForm.id
    // },
    closeRightMenu() {
      this.showRightMenu = false
      // 及时关掉鼠标监听事件
      document.removeEventListener('click', this.closeRightMenu)
    },
    addDevHandle() {
      this.dialogVisible=true;
      this.operation=0;
      this.flag=true;
      this.menuForm.pid=this.menuForm.id
    },
    
    editDevHandle() {
        this.dialogVisible=true;
        this.operation=1;
        this.flag=false;
    },
    // 删除操作
    delDevHandle(done) {
      this.$confirm('确认删除？')
      .then(_=>{
          this.$http.post("queryPid",{id:this.menuForm.id}).then((res)=>{
            if (res.data.length!=0) {
              // console.log(res.data);
              alert("该菜单有子级菜单，不允许删除")
            }else{
              this.$http.post("delDevHandle",{id:this.menuForm.id}).then((res)=>{
          if(res.succes){
            console.log("删除成功");
          }
        })
            }
          })

        // if (this.menuForm.pid==0) {
        //   console.log("该菜单存在子级菜单，不允许删除");
        // }else{
        //    this.$http.post("delDevHandle",{id:this.menuForm.id}).then((res)=>{
        //   if(res.succes){
        //     console.log(res.data);
        //   }
        // })
        // }
      })
      .catch(_=>{});
    },
   

    // handleClose(done){
    //   this.$confirm('确认关闭？')
    //   .then(_=>{
    //     done();
    //   })
    //   .catch(_=>{});
    // },
    rightleNodeClick(){
      // console.log(23);
    },
    editBrand() {
      //debugger
      // console.log(this.menuForm);
      let that=this;
      if(this.operation==0||this.operation==2){
        this.$http.post("addDevHandle",this.menuForm).then((res)=>{
      if(res.succes){
        console.log(res.data);
      }
     })
      }else if(this.operation==1){
        this.$http.post("editBrand",that.menuForm).then((res) => {
 
 if (res.succes) {
   console.log("修改成功")
   //that.treeData = res.data;
    // console.log(res)
 } else {

  
 }

})
      }
               
            }
  }
}
</script>

<style scoped>
.dev-type-main-left {
    overflow: auto;
    padding: 10px;
    .right-menu {
      z-index: 1;
      position: absolute;
      height: 100px;
      width: 100px;
      position: absolute;
      border-radius: 5px;
      border: 1px solid #ccc;
      background-color: white;
      .menu-item {
      /* display: block; */
        line-height: 20px;
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
        color: #606266;
      }
      li:hover {
        background-color: #edf6ff;
        color: #606266;
      }
    }
  }
</style>
