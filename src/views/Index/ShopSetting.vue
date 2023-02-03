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
            :show-file-list="false"
            :http-request="handleToUpload"
          >
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
                @blur="handleInputConfirm2"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                + 添加
              </el-button>
            </div>
            <div class="tag-container">
              <el-space>
                <el-tag
                  v-for="tag, index in form.dynamictags"
                  :key="tag.title"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index)"
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
  import { ElMessage } from 'element-plus'
  import _ from 'lodash'
  
    export default {
      data(){
        return {
          form: {
            name: '',
            file: '',
            dynamictags: [
            ],
            address: '',
            telphone: '',
            username: this.$store.state.users.username
          },
          rules: {
            name: [
              { required: true, message: '店铺名称不能为空', trigger: 'blur' },
            ],
            file: [
              { required: true, message: '店铺图片不能为空', trigger: 'blur' },
            ],
            address: [
              { required: true, message: '店铺地址不能为空', trigger: 'blur' },
            ],
            telphone: [
              { required: true, message: '店铺电话不能为空', trigger: 'blur' },
            ]
          },
          imageUrl: '',
          inputVisible: false,
          inputValue: ''
        }
      },
      methods: {
        onSubmit(formEl){
          if (!formEl) return
          formEl.validate((valid, fields) => {
            if (valid) {
              //console.log('submit!')
              //console.log( this.form )
              this.$store.dispatch('shops/update', this.form).then((res)=>{
                if(res.data.errcode === 0){
                  ElMessage.success('更新店铺成功')
                  this.shopList()
                }
              })
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
          if( !this.inputValue ){
            ElMessage.error('不能为空！')
            return;
          }
          if( this.form.dynamictags.map((v)=> v.title).includes(this.inputValue) ){
            ElMessage.error('已经存在此分类！');
            return;
          }
          this.inputVisible = false;
          this.form.dynamictags.push({title: this.inputValue, list: []})
          this.inputValue = '';
        },
        handleInputConfirm2(){
          this.inputVisible = false;
        },  
        handleClose(index){
          this.form.dynamictags.splice(index, 1);
        },
        handleToUpload(options){
             
          this.form.file = options.file; 
          this.imageUrl = URL.createObjectURL(options.file)
        },
        shopList(){
          this.$store.dispatch('shops/list', {username: this.$store.state.users.username}).then((res)=>{
            if(res.data.length){
              let ret = res.data[0];
              this.form.name = ret.name;
              this.form.address = ret.address;
              this.form.telphone = ret.telphone;
              this.imageUrl = ret.fileurl;
              this.form.dynamictags = JSON.parse(ret.dynamictags);
              this.form.file = 'origin';  
              this.$store.commit('shops/updateInfos', ret);  
            }
          })
        }
      },
      created(){
        if( _.isEmpty(this.$store.state.shops.infos) ){
          this.shopList()
        }
        else{
          let ret = this.$store.state.shops.infos;
          this.form.name = ret.name;
          this.form.address = ret.address;
          this.form.telphone = ret.telphone;
          this.imageUrl = ret.fileurl;
          this.form.dynamictags = JSON.parse(ret.dynamictags);
          this.form.file = 'origin';  
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
  .el-icon.avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 178px;height: 178px;text-align: center;}
  .input-tag{width: 100px;}
  .tag-container{margin-top: 10px;}
  </style>