<template>
    <div>
        用户管理
        <el-card class="box-card">

            <el-row>
                <el-col :span="4">
                    用户姓名
                </el-col>
                <el-col :span="14">
                    <el-input v-model="searchModel.name" placeholder="" />
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="getUserList" :icon="Search">查询</el-button>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="openEditUI(null)" :icon="Search">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card>

            <el-table :data="userList" style="width: 100%">
                <el-table-column prop="id" v-if="flag" label="id" width="180" />
                <el-table-column prop="name" label="用户名称" width="180" />
                <el-table-column prop="account" label="账号" width="180" />
                <el-table-column prop="birthday" label="出生年月" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="openEditUI(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteRole(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogFormVisible" :title=title @close="clearForm">
            <el-form :model="userForm" ref="userFormRef">

                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input v-model="userForm.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="userForm.account" autocomplete="off" />
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth">
                    <!-- <el-input v-model="userForm.birthday" type="date" required="required" autocomplete="off" /> -->
                    <el-date-picker v-model="userForm.birthday" type="date" placeholder="Pick a day" format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD">
                       
                    </el-date-picker>

                </el-form-item>
                <el-form-item label="权限设置" prop="roleIdList" :label-width="formLabelWidth">
                    <el-tree :data="roleList" :props="roleProp" show-checkbox default-expand-all node-key="id"
                        ref="userRef" />
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
import moment from 'moment'
export default {
    name: '',
    data() {
        return {
            name: 'order-list',
            props: ['value'],
            operation: 0,
            userId: '',
            roleList: [],
            flag: false,
            roleProp: {
                children: 'children',
                label: 'label'
            },
            userList: [],
            userId: '',
            total: 0,
            title: '',
            dialogFormVisible: false,
            userForm: {

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
        dateFormat(row, column) {
            console.log(row, column)
            const date = row[column.property]
            if (date === undefined) {
                return ''
            }
            // 这里的格式根据需求修改
            return moment(date).format('YYYY年-MM月-DD日 ')
        },

        getUserList() {
            this.$http.post("/user/list", {
                pageNo: this.searchModel.pageNo,
                pageSize: this.searchModel.pageSize,
                name: this.searchModel.name
            }).then((res) => {
              
                this.userList = res.data
                this.total=this.userList[0].total

            })
        },
        getRoleList() {
            this.$http.post("/user/roleList").then((res) => {
            
                this.roleList = res.data
                this.total=this.roleList[0].total
            })
        },
        onSubmit() {
            if (this.operation == 0) {
                let CheckedKeys = this.$refs.userRef.getCheckedKeys();//获取到选中的节点
                let HalfCheckedKeys = this.$refs.userRef.getHalfCheckedKeys();//获取到选中节点的父节点
                this.userForm.roleIdList = CheckedKeys.concat(HalfCheckedKeys);

                this.dialogFormVisible = false,
                    this.$http.post("/user/addUser", {
                        name: this.userForm.name,
                        account: this.userForm.account,
                        birthday: this.userForm.birthday,
                        roleIdList: this.userForm.roleIdList,


                    }).then((res) => {

                        alert("新增成功")
                    })

            } else {
                let CheckedKeys = this.$refs.userRef.getCheckedKeys();//获取到选中的节点
                let HalfCheckedKeys = this.$refs.userRef.getHalfCheckedKeys();//获取到选中节点的父节点
                this.userForm.roleIdList = CheckedKeys.concat(HalfCheckedKeys);
                this.dialogFormVisible = false,
                    this.$http.post("/user/update", {

                        roleIdList: this.userForm.roleIdList,
                        birthday: this.userForm.birthday,
                        id: this.userId,
                        name: this.userForm.name,
                        account: this.userForm.account

                    }).then((res) => {
                        alert("修改成功")

                    })
            }

        },

        getTotal() {
            this.$http.post("/user/getTotal").then((res) => {
                this.total = res.data[0]

            })
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getUserList();
        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getUserList();
        },
        openEditUI(id) {

            if (id == null) {
                this.title = '新增'
                this.dialogFormVisible = true
                this.operation = 0
            } else {
                this.title = '编辑'
                this.operation = 1
                this.userId = id

                this.$http.post("/user/getById", { id: id }).then((res) => {

                    this.userIdList = res.data.roleIdList
                    this.userForm.birthday = res.data.birthday
                    console.log(this.userForm.birthday);
                    this.$refs.userRef.setCheckedKeys(this.userIdList);


                    this.userForm = res.data



                })

                this.dialogFormVisible = true
            }
        },

        deleteRole(user) {
            this.$confirm(`您确认删除角色 ${user.name} ?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$http.post("/user/delete", { id: user.id }).then((response) => {
                        this.$message({
                            type: "success",
                            message: response.message,
                        });
                        this.getUserList();
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
            this.userForm = {},
                //this.$refs.userFormRef这是调用表单，后面加上的clearValidate是官网上的方法
                this.$refs.userFormRef.clearValidate();
            this.$refs.userRef.setCheckedKeys([]);
            // this.$refs.menuRef.setCheckedKeys([]);
        },

    },
    created() {
        this.getUserList();//让页面加载完成之后自动生成数据
        // this.getTotal();
        this.getRoleList();

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
