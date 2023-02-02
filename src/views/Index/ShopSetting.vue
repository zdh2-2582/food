<template>
    <div>
        <el-form
    ref="ruleFormRef"
    :model="form"
    :rules="rules"
    label-width="120px"
    status-icon
    >
    <el-form-item label="店铺名称" prop="name">
        <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="店铺图片" prop="file">
        <el-upload 
        class="avatar-uploader"
        :show-file-list="false">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
    </el-form-item>
    <el-form-item label="菜品项">
        <div>
            <div>
                <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="input-tag"
                size="small"
                @keyup.enter="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + 添加
            </el-button>
            </div>
            <div class="tag-container">
                <el-space>
                    <el-tag
                    v-for="tag in form.dynamictags"
                    :key="tag.title"
                    class="mx-1"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    >
                    {{ tag.title }}
                    </el-tag>
                    </el-space>
            </div>
        </div> 
    </el-form-item>
    <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" />
    </el-form-item>
    <el-form-item label="电话" prop="telphone">
        <el-input v-model="form.telphone" />
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit($refs.ruleFormRef)">更新</el-button>
    </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                form:{
                    name:'',
                    file:'',
                    dynamictags:[
                        {title:'肉类',list:[]},
                        {title:'肉类',list:[]},
                    ],
                    address:'',
                    telphone:''
                },
                rules:{
                    name:[
                    { required: true, message: '店铺名称不能为空', trigger: 'blur' }
                    ],
                    file:[
                    { required: true, message: '店铺图片不能为空', trigger: 'blur' }   
                    ],
                    address:[
                    { required: true, message: '店铺地址不能为空', trigger: 'blur' }
                    ],
                    telphone:[
                    { required: true, message: '店铺电话不能为空', trigger: 'blur' } 
                    ]
                },
                imageUrl:'https://img.tt98.com/d/file/96kaifa/20190711214421293/009.jpg',
                inputVisible:false,
                inputValue:''
            }
        },
        methods:{
            onSubmit(formEl){
                if (!formEl) return
                formEl.validate((valid, fields) => {
                    if (valid) {
                        console.log('submit!')
                    } else {
                        console.log('error submit!', fields)
                    }
                })
            },
            showInput(){
                this.inputVisible = true;
                this.$nextTick(()=>{
                    this.$refs.InputRef.focus();
                })
            },
            handleInputConfirm(){
                this.inputVisible = false;
                if(!this.inputValue){
                    
                }
            }
        }
        }
</script>

<style lang="scss" scoped>
.el-form{margin: 50px 0;width: 500px;}
.avatar-uploader{width: 178px;height: 178px;border: 1px dashed var(--el-border-color);border-radius: 15px;overflow: hidden;}
.avatar-uploader .avatar {width: 178px;height: 178px;display: block;object-fit: cover;}
.avatar-uploader .el-upload {border: 1px dashed var(--el-border-color);border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;transition: var(--el-transition-duration-fast);}
.avatar-uploader .el-upload:hover {border-color: var(--el-color-primary);}
.el-icon.avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 178px;height: 178px;text-align: center}
.input-tag{width: 100px;}
.tag-container{margin-top: 10px;}
</style>