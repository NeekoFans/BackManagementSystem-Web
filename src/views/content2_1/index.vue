<template>
  <div>
    销售
    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          产品名称
        </el-col>
        <el-col :span="14">
          <el-input v-model="searchModel.name" placeholder="" />
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getOrderList" :icon="Search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table ref="multipleTableRef" :data="orderList" style="width: 100%" >
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" v-if="false" label="id"  width="120" />
        <el-table-column property="reason" v-if="false" label="原因"  width="120" />
        <el-table-column property="name" label="产品" width="120" />
        <el-table-column property="number" label="数量" width="80" />
        <el-table-column property="price" label="单价" width="80" />
        <el-table-column property="createDate" label="申请时间" width="200" />
        <el-table-column property="status" label="状态" width="120" >
          <template #default="scope">
            <template  v-if="scope.row.status==1">
             在途
        </template>
        <template  v-else-if="scope.row.status==2">
             驳回
        </template>
        <template  v-else-if="scope.row.status==3">
             结束
        </template>
          </template>

        </el-table-column>
        <el-table-column label="操作">
                    <template #default="scope">
                      
                        <el-button size="small"  v-if="scope.row.status==2"  @click="openEditUI(scope.row)" >修改</el-button>
                        <el-button size="small" type="danger"  @click="deleteOrder(scope.row)">撤销</el-button>
                        <el-popover
                          placement="top-start"
                         
                          :width="200"
                          trigger="hover"
                          :content=scope.row.reason
                        >
                          <template #reference>
                            <el-button  v-if="scope.row.status==2" class="m-2">查看原因</el-button>
                          </template>
                        </el-popover>
                        <!-- <el-button size="small" v-if="flag1"  type="primary" @click="reason(scope.row)">查看原因</el-button> -->
                    </template>
                </el-table-column>
      </el-table>      
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title=title @close="clearForm">
            <el-form :model="orderForm" ref="roleFormRef">

                <el-form-item label="单价" :label-width="formLabelWidth">
                    <el-input v-model="orderForm.price" autocomplete="off" />
                </el-form-item>
                <el-form-item label="数量" :label-width="formLabelWidth">
                    <el-input v-model="orderForm.number" autocomplete="off" />
                </el-form-item>
               
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click=onSubmit>
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    <el-pagination
      v-model:current-page="searchModel.pageNo"
      v-model:page-size="searchModel.pageSize"
      :page-sizes="[3, 5, 10, 20]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
<!-- 
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[3, 5, 10, 20]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination> -->

  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      total:'',
      content:'',
      title:'',
      orderId:'',
      dialogFormVisible:false,
      orderForm:{},
      orderList:[],
      searchModel:{
        pageNo: 1,
        pageSize: 3,
        name: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    getTotal() {
      this.$http.post("/order/getSellTotal").then((res) => {
        this.total = res.data[0]

      })
    },
    getOrderList(){
      this.$http.post("/order/list", {
        pageNo: this.searchModel.pageNo,
        pageSize: this.searchModel.pageSize,
        name: this.searchModel.name,
        inputInfo:2
      }).then((res) => {

        this.orderList = res.data

        if (res.data.length!=0) {
           this.total=this.orderList[0].total
        }else{
          this.total=0
        }
       
       
      

      })
      },
      handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getOrderList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getOrderList();
    },
    openEditUI(orderForm){
      this.title = orderForm.name
      this.orderId=orderForm.id
                this.$http.post("/order/getById", { id: orderForm.id }).then((res) => {


                    this.orderForm = res.data

                })

                this.dialogFormVisible = true
    },
    onSubmit(){
      this.dialogFormVisible = false,
                    this.$http.post("/order/update", {
                        id:this.orderId,
                        status:1,
                        price: this.orderForm.price,
                        number: this.orderForm.number

                    }).then((res) => {
                        alert("修改成功")

                    })
    },
    deleteOrder(order){
      this.$confirm(`您确认删除产品 ${order.name} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            this.$http.post("/order/delete", { id: order.id }).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.getRoleList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

    },
    reason(){
      this.roleForm = {}
    },
    clearForm(){
     this.orderForm={}
    },
  },
  created() {
    this.getOrderList();//让页面加载完成之后自动生成数据
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
