<template>
  <div>
    库存汇总
    <el-card class="box-card">

      <el-row>
        <el-col :span="4">
          产品名称
        </el-col>
        <el-col :span="14">
          <el-input v-model="searchModel.name" placeholder="" />
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getTypeList" :icon="Search">查询</el-button>
        </el-col>

      </el-row>

    </el-card>

    <el-card>
      <el-button type="success" v-if="flag1" @click="addGoods">
        <el-icon style="vertical-align: middle">
          <Plus />
        </el-icon>
        <span style="vertical-align: middle">采购入库</span>
      </el-button>

      <el-button type="success" v-if="flag2" @click="sellGoods">
        <el-icon>
          <Minus />
        </el-icon>
        <span style="vertical-align: middle">销售出库</span>
      </el-button>
      <el-table ref="multipleTableRef" :data="typeList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column property="name" label="产品" width="120" />
        <el-table-column property="total" label="库存" width="120" />
      </el-table>
    </el-card>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[3, 5, 10, 20]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="totalList">
    </el-pagination>

    <el-dialog v-model="dialogFormVisible" :title=title @close="clearForm">
      <el-form :model="addForm" ref="roleFormRef">

        <el-form-item label="产品类别" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" :value="addForm.type" disabled autocomplete="off" />
          <div style="display: flex; align-items: center">
            <el-button type="success" v-if="flag3" @click="openTypeList">

              <span style="vertical-align: middle">选择类别</span>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item :label=priceTitle :label-width="formLabelWidth">
          <el-input v-model="addForm.price" autocomplete="off" />
        </el-form-item>
        <el-form-item :label=quantityTitle :label-width="formLabelWidth">
          <el-input v-model="addForm.quantity" autocomplete="off" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click=onSubmit>
            提交审核
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogFormVisible1" :title=title @close="clearForm1">
      <el-tree :data="treeData" :props="treeProps" show-checkbox="true" check-strictly="true" accordion highlight-current
        default-expand-all node-key="id" @check="currentChecked" @check-change="checkChange" ref="menuRef">
      </el-tree>
      <!-- <el-input v-model="addForm.type" autocomplete="off" /> -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取消</el-button>
          <el-button type="primary" @click=onSubmit1>
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: '',
  data() {
    return {
      operation:'',
      priceTitle:'',
      quantityTitle:'',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      userInfo: '',
      typeName: '',
      flag1: true,
      flag2: true,
      searchModel: {
        pageNo: 1,
        pageSize: 3,
        name: ''
      },
      addForm: {},
      typeList: [],
      treeData: [],
      treeProps: {
        // children: "children",
        // label: "label",
        disabled: function (data, node) {//带子级的节点不能选中
          if (data.children && data.children.length > 0) {
            return true
          } else {
            return false
          }
        }
      },
      totalList: 0,
    }
  },
  mounted() {

  },
  methods: {
    getTotal() {
     
      console.log(111);
      this.$http.post("/type/getTotal").then((res) => {
        this.total = res.data[0]

      })
    },
    getTypeList() {
      this.userInfo = this.$store.state.account
      if (this.userInfo == 'user001') {
        this.flag1 = false
        this.flag2 = false
      } else if (this.userInfo == 'user002') {
        this.flag1 = false
        this.flag2 = true
      } else if (this.userInfo == 'user003') {
        this.flag1 = true
        this.flag2 = false
      } else {
        this.flag1 = true
        this.flag2 = true
      }
      this.$http.post("/type/list", {
        pageNo: this.searchModel.pageNo,
        pageSize: this.searchModel.pageSize,
        name: this.searchModel.name
      }).then((res) => {
          //  this.getTotal()
        this.typeList = res.data
        if (res.data.length!=0) {
          this.totalList=this.typeList[0].totalList
        }else{
          this.total=0
        }
      


      })
    },
    handleSelectionChange() {},
    addGoods() {
      this.flag3=true,
      this.operation=1
      this.priceTitle="采购单价"
      this.quantityTitle="采购数量"
      this.dialogFormVisible = true
    },
    sellGoods() {
      this.operation=2
      this.flag3=true,
      this.priceTitle="销售单价"
      this.quantityTitle="销售数量"
      this.dialogFormVisible = true
      
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getTypeList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getTypeList();
    },
    openTypeList() {
      this.dialogFormVisible1 = true
      this.$http.post("queryType", {}).then((res) => {
        if (res.succes) {
          //console.log("111111")
          this.treeData = res.data;
        } else {
        
        }

      })
    },
    currentChecked(nodeObj, SelectedObj) {
      this.addForm.type = SelectedObj.checkedNodes[0].label
      this.addForm.typeId=SelectedObj.checkedNodes[0].id
        //console.log(SelectedObj.checkedNodes[0])  // 这是选中的节点数组  
    },
    checkChange(item, node, self) {
      if (node == true) {
        this.editCheckId = item.id;
        this.$refs.menuRef.setCheckedKeys([item.id])
      } else {
        if (this.editCheckId == item.id) {
          this.$refs.menuRef.setCheckedKeys([item.id])
        }
      }
    },
    onSubmit1(){
       this.dialogFormVisible1 = false
    },
    onSubmit() {
      this.dialogFormVisible = false
      if (this.operation==2&&(this.addForm.price>100000||this.addForm.quantity>100000)) {
        alert("销售数量或单价不能大于100000，请重新输入")
        return
      }
      if (this.operation==1) {
          this.$http.post("/type/addForm", {
             typeId:this.addForm.typeId,
             price:this.addForm.price,
             number:this.addForm.quantity,
             creater:this.userInfo
      }).then((res) => {
       console.log(res);

      })
      }else{
        this.$http.post("/type/sellForm", {
             typeId:this.addForm.typeId,
             price:this.addForm.price,
             number:this.addForm.quantity,
             creater:this.userInfo
      }).then((res) => {
       console.log(res);

      })
      }
    
    },
    clearForm() {
            this.addForm = {}
                //this.$refs.userFormRef这是调用表单，后面加上的clearValidate是官网上的方法
                // this.$refs.roleFormRef.clearValidate();
            
            // this.$refs.menuRef.setCheckedKeys([]);
        },
        clearForm1(){
          this.$refs.menuRef.setCheckedKeys([]);
        }

  },
  created() {
    this.getTypeList();//让页面加载完成之后自动生成数据
    // this.getTotal();

  }
}
</script>

<style scoped>
.el-scrollbar__wrap--hidden-default {
  padding: 10px;
}

.el-card {
  margin-bottom: 10px;
}
</style>
