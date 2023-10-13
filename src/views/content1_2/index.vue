<template>
    <div>
        这是角色管理吗？
        
        <el-card class="box-card">

            <el-row>
                <el-col :span="4">
                    角色名称
                </el-col>
                <el-col :span="14">
                    <el-input v-model="searchModel.name" placeholder="" />
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="getRoleList" :icon="Search">查询</el-button>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="openEditUI(null)" :icon="Search">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
<!-- 复制element官网上的代码过来的时候，要对其中的事件，方法等进行定义，不然不会显示，控制台也会报错 -->
            <el-table :data="roleList" style="width: 100%">
                <el-table-column prop="id" label="id" width="180" />
                <el-table-column prop="name" label="角色名称" width="180" />
                <el-table-column prop="flag" label="标识" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="openEditUI(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteRole(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogFormVisible" :title=title @close="clearForm">
            <el-form :model="roleForm" ref="roleFormRef">

                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="roleForm.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="角色标识" :label-width="formLabelWidth">
                    <el-input v-model="roleForm.flag" autocomplete="off" />
                </el-form-item>
                <el-form-item label="权限设置" prop="menuIdList" :label-width="formLabelWidth">
                    <el-tree :data="menuList" :props="menuProp" show-checkbox default-expand-all node-key="id"
                        ref="menuRef" />
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

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo" :page-sizes="[3, 5, 10, 20]" :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>


       
    </div>
</template>

<script>

export default {
    name: '',
    data() {
        return {
            operation: 0,
            roleId: '',
            menuList: [],

            menuProp: {
                children: 'children',
                label: 'label'
            },
            roleList: [],
            roleId: '',
            total: 0,
            title: '',
            dialogFormVisible: false,
            roleForm: {

            },

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
        getRoleList() {
            this.$http.post("/role/list", {
                pageNo: this.searchModel.pageNo,
                pageSize: this.searchModel.pageSize,
                name: this.searchModel.name
            }).then((res) => {
                this.roleList = res.data
                this.total=this.roleList[0].total

            })
        },
        getMenuList() {
            this.$http.post("/query").then((res) => {
                this.menuList = res.data

            })
        },
        onSubmit() {
            if (this.operation == 0) {
                let CheckedKeys = this.$refs.menuRef.getCheckedKeys();//获取到选中的节点
                let HalfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys();//获取到选中节点的父节点
                this.roleForm.menuIdList = CheckedKeys.concat(HalfCheckedKeys);

                this.dialogFormVisible = false,
                    this.$http.post("/role/addRole", {
                        name: this.roleForm.name,
                        flag: this.roleForm.flag,
                        menuIdList: this.roleForm.menuIdList,


                    }).then((res) => {

                        alert("新增成功")
                    })

            } else {
                let CheckedKeys = this.$refs.menuRef.getCheckedKeys();//获取到选中的节点
                let HalfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys();//获取到选中节点的父节点
                this.roleForm.menuIdList = CheckedKeys.concat(HalfCheckedKeys);
                this.dialogFormVisible = false,
                    this.$http.post("/role/update", {

                        menuIdList: this.roleForm.menuIdList,

                        id: this.roleId,
                        name: this.roleForm.name,
                        flag: this.roleForm.flag

                    }).then((res) => {
                        alert("修改成功")

                    })
            }

        },

        getTotal() {
            this.$http.post("/role/getTotal").then((res) => {
                this.total = res.data[0]

            })
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getRoleList();
        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getRoleList();
        },
        openEditUI(id) {

            if (id == null) {
                this.title = '新增'
                this.dialogFormVisible = true
                this.operation =0
            } else {
                this.title = '编辑'
                this.operation = 1
                this.roleId = id
                this.$http.post("/role/getById", { id: id }).then((res) => {

                    this.menuIdList = res.data.menuIdList
                    this.$refs.menuRef.setCheckedKeys(this.menuIdList);


                    this.roleForm = res.data

                })

                this.dialogFormVisible = true
            }
        },

        deleteRole(role) {
            this.$confirm(`您确认删除角色 ${role.name} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            this.$http.post("/role/delete", { id: role.id }).then((response) => {
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


            // this.$http.post("/role/delete", { id: role.id }).then((res) => {
            //     alert("删除成功")
            // })
        },
        clearForm() {
            this.roleForm = {},
                //this.$refs.userFormRef这是调用表单，后面加上的clearValidate是官网上的方法
                this.$refs.roleFormRef.clearValidate();
            this.$refs.menuRef.setCheckedKeys([]);
            // this.$refs.menuRef.setCheckedKeys([]);
        },

    },
    created() {
        this.getRoleList();//让页面加载完成之后自动生成数据
        // this.getTotal();
        this.getMenuList();
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
