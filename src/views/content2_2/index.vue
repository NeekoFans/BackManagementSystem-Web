<template>
  <div>
    单据审核
    <el-card class="box-card">
      <el-row>
        <el-col :span="2">
          产品名称
        </el-col>
        <el-col :span="10">
          <el-input v-model="searchModel.name" placeholder="" />
        </el-col>
        <el-col :span="9">
          订单类型
          <select v-model="orderType.type">
            <option value=0>全部</option>
            <option value=1>入库</option>
            <option value=2>出库</option>
          </select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getOrderList" :icon="Search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table ref="multipleTableRef" :data="orderList" style="width: 100% ">
        <el-table-column type="selection" width="55" />
        <el-table-column property="id" v-if="false" label="id" width="120" />
        <el-table-column property="typeId" v-if="false" label="typeId" width="120" />
        <el-table-column property="name" label="产品" width="120" />
        <el-table-column property="number" label="数量" width="80" />
        <el-table-column property="price" label="单价" width="80" />
        <el-table-column property="createDate" label="申请时间" width="200" />
        <el-table-column property="status" label="状态" width="60">
          <!-- 下面是插槽的应用，要会用 -->
          <template #default="scope">
            <template v-if="scope.row.status == 1">
              在途
            </template>
            <template v-else-if="scope.row.status == 2">
              驳回
            </template>
            <template v-else-if="scope.row.status == 3">
              结束
            </template>
          </template>
        </el-table-column>
        <el-table-column property="orderType" label="单据类型" width="100">
          <template #default="scope">
            <template v-if="scope.row.orderType == 1">
              入库
            </template>
            <template v-else-if="scope.row.orderType == 2">
              出库
            </template>
          </template>

        </el-table-column>

        <el-table-column property="creater" label="申请人" width="100" />
        <el-table-column label="操作">
          <template #default="scope">

            <el-button size="small" v-if="scope.row.status == 1" @click="openEditUI(scope.row)">通过</el-button>
            <el-button size="small" v-if="scope.row.status == 1" type="danger"
              @click="deleteOrder(scope.row)">驳回</el-button>


          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination v-model:current-page="searchModel.pageNo" v-model:page-size="searchModel.pageSize"
      :page-sizes="[3, 5, 10, 20]" :small="small" :disabled="disabled" :background="background"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    
      <el-dialog v-model="dialogFormVisible" title="驳回原因" @close="clearForm">
            <el-form :model="orderForm" ref="roleFormRef">
                <el-form-item label="驳回原因" :label-width="formLabelWidth">
                    <el-input type="text" v-model="orderForm.reason" autocomplete="off" />
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

  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      total: '',
      orderId: '',
      dialogFormVisible: false,
      reason:'',
      typeId:1,
      orderType:1,
      orderForm: {},
      orderList: [],
      orderType: { type: 0 },
      searchModel: {
        pageNo: 1,
        pageSize: 3,
        name: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    getOrderList() {

      this.$http.post("/order/reviewList", {
        pageNo: this.searchModel.pageNo,
        pageSize: this.searchModel.pageSize,
        name: this.searchModel.name,
        orderType: this.orderType.type
      }).then((res) => {
        //执行查询总数的方法，不推荐，正确的做法应该是在执行reviewList的时候一次性查出来，一个返回*一个返回count(*)where是一样的
        //  this.getTotal()
        this.orderList = res.data
        if (res.data.length!=0) {
           this.total=this.orderList[0].total
        }else{
          this.total=0
        }


      })

    },
    getTotal() {
      this.$http.post("/order/reviewTotal", { orderType: this.orderType.type }).then((res) => {
        console.log(res.data);
        this.total = res.data[0]

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
    openEditUI(order) {
      //判断是入库单还是出库单
      if (order.orderType == 1) {
        //判断库存表是否存在
        this.$http.post("/product/selectByTypeId", { typeId: order.typeId }).then((res) => {
          //如果库存表不存在
          if (res.data.length != 0) {
            //库存表新增一条数据
            this.$http.post("/product/addTotal", { total: order.number, typeId: order.typeId }).then((res) => {
              //判断是否新增成功
              if (res.succes) {
                //修改入库订单状态为结束
                this.$http.post("/order/editBytypeId", { typeId: order.typeId }).then((res) => {
                  if (res.succes) {

                  }
                });
                //  this.$http.post("/order/deleteBytypeId",{typeId:order.typeId}).then((res)=>{

                // });

              }
            })
          } else {
            //如果库存表存在，在库存表总数中加上新增的数量
            this.$http.post("/product/addProduct", { total: order.number, typeId: order.typeId }).then((res) => {
              //修改入库订单状态为结束
              if (res.succes) {
                this.$http.post("/order/editBytypeId", { typeId: order.typeId }).then((res) => {
                  if (res.succes) {

                  }
                });
                //  this.$http.post("/order/deleteBytypeId",{typeId:order.typeId}).then((res)=>{

                // });

              }
            })

          }
        })
      } else {
        //出库单 判断该产品是否存在
        this.$http.post("/product/selectByTypeId", { typeId: order.typeId }).then((res) => {
          //如果该产品存在
          if (res.data.length != 0) {
            this.$http.post("/product/differenceByTotal", { total: order.number, typeId: order.typeId }).then((resquence) => {
              //如果库存表的数量小于出库数量
              if (resquence.data < 0) {
                this.$http.post("/order/refuseBytypeId", { typeId: order.typeId }).then((res) => {
                  if (res.succes) {
                    this.$store.commit("setMsg", res.message)
                  }
                });
                //如果库存表的数量等于出库数量
              } else if (resquence.data == 0) {
                //删除库存表的该条数据
                this.$http.post("/product/deleteBytypeId", { typeId: order.typeId }).then((res) => {
                  //修改出库订单状态为结束
                  if (res.succes) {
                    this.$http.post("/order/editOutBytypeId", { typeId: order.typeId }).then((res) => {
                      if (res.succes) {

                      }
                    });


                  }
                });
                //如果库存表的数量大于出库数量
              } else {
                //在库存表总数中减去出库的数量
                this.$http.post("/product/deleteTotal", { total: order.number, typeId: order.typeId }).then((res) => {
                  //如果是否减少成功
                  if (res.succes) {
                    //修改出库订单状态为结束
                    this.$http.post("/order/editOutBytypeId", { typeId: order.typeId }).then((res) => {
                      if (res.succes) {

                      }
                    });
                    //  this.$http.post("/order/deleteBytypeId",{typeId:order.typeId}).then((res)=>{

                    // });

                  }
                })

              }




            })
          } else {
            //如果该产品不存在
            this.$http.post("/order/refuseBytypeId", { typeId: order.typeId }).then((res) => {
              if (res.succes) {
                this.$store.commit("setMsg", res.message)
              }
            });

          }
        })
      }

    },
    onSubmit() {
      this.dialogFormVisible=false

   this.$http.post("/order/endByTypeId", { typeId:this.typeId,orderType:this.orderType,reason:this.orderForm.reason }).then((res) => {
                 if (res.succes) {
                    console.log(res.data);
                    console.log(this.orderForm.reason);
                 }
                });
    },
    deleteOrder(order) {
      this.dialogFormVisible=true
      this.typeId=order.typeId
      this.orderType=order.orderType
    },

    clearForm() {
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
