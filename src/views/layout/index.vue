<template>
    <el-container class="layout-container-demo" style="height: 100%">
      <el-aside width="200px">
      <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px"
                ><setting
              /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item @click="Logout">Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>{{this.$store.state.account}}</span>
          </div>
        </el-header>
  
        <el-main>
          <el-scrollbar>
                  <router-view/>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { Menu as IconMenu, Male, Setting } from '@element-plus/icons-vue'
  import VueContextMenu from 'vue-contextmenu'
  import router from '../../router'
  import Menu from './menu.vue'

  const item = {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  }
  const tableData = ref(Array.from({ length: 20 }).fill(item))
  interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data);
  console.log(EventTarget);
  
}
const Logout = () => {
  //匿名函数里面不能用this
  router.push("/login")
  
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        
      },
      {
        label: 'Level two 1-1',
        
      },
      {
        label: 'Level two 1-1',
        
      },
      {
        label: 'Level two 1-1',
        
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
      
      },
      {
        label: 'Level two 2-2',
        
      },
      {
        label: 'Level two 2-2',
        
      },
      {
        label: 'Level two 2-2',
        
      },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}


  </script>

  <style scoped>

.layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
  }
  .layout-container-demo .el-menu {
    border-right: none;
  }
  .layout-container-demo .el-main {
    padding: 0;
  }
  .layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
.classTree{
  text-align: center;
}
  </style>
  