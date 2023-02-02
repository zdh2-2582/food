<template>
    <div>
    <div id="particle-wave" ref="particle"></div>
    <el-form :model="form" :rules="rules" label-width="70px" ref="ruleFormRef" status-icon>
        <el-form-item label="手机号" prop="username">
        <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="验证码" prop="yzm">
        <el-row>
            <el-col :span="16">
            <el-input class="yzm" v-model="form.yzm" />
            </el-col>
            <el-col :span="8">
            <el-button @click="sendYzm" :disabled="yzmDisabled">{{yzmText}}</el-button>
            </el-col>
        </el-row>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="onSubmit($refs.ruleFormRef)">登录</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
    import ParticleWave from 'particle-wave'
    import { ElMessage } from 'element-plus'

    export default {
    data(){
        return {
        form: {
            username: '',
            yzm: ''
        },
        rules: {
            username: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
            ],
            yzm: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }, 
            { min: 4, max: 4, message: '请输入正确的验证码', trigger: 'blur' }, 
            { type: 'number', message: '请输入正确的验证码', trigger: 'blur', transform:(value)=>Number(value)}
            ]
        },
        yzmText: '发送验证码',
        yzmDisabled: false
        }
    },
    methods: {
        onSubmit(formEl){
        if (!formEl) return
        formEl.validate((valid, fields) => {
            if (valid) {
            console.log('submit!')
            this.$store.dispatch('users/login', this.form).then((res)=>{
                //console.log(res.data)
                if( res.data.errcode === 0 ){  // 登录成功
                ElMessage.success('登录成功')
                this.$store.commit('users/updateToken', res.data.token)
                this.$router.push('/')   // 编程式路由跳转
                }
                else{   // 登录失败
                ElMessage.error('登录错误')
                }
            })
            } else {
            console.log('error submit!', fields)
            }
        })
        },
        sendYzm(){
        if( !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.form.username) ){
            ElMessage.error('请输入正确手机号')
            return;
        }
        // 请求后端接口，拿到对应手机号的验证码
        this.$store.dispatch('users/yzm', { username: this.form.username }).then((res)=>{
            let count = 10;
            console.log(res.data)
            this.yzmDisabled = true;
            this.yzmText = `剩余${count}秒`;
            let timer = setInterval(()=>{
            count--;
            this.yzmText = `剩余${count}秒`;
            if( count === 0 ){
                clearInterval(timer)
                this.yzmDisabled = false;
                this.yzmText = '再次发送验证码'
            }
            }, 1000)
        })
        }
    },
    mounted(){
        const pointSize = 4
        const pw = new ParticleWave(this.$refs.particle, {
        uniforms: {
            size: { type: 'float', value: pointSize },
            field: { type: 'vec3', value: [0, 0, 0] },
            speed: { type: 'float', value: 7 }
        },
        onResize (w, h, dpi) {
            const position = []
            const color = []
            const width = 400 * (w / h)
            const depth = 500
            const height = 7
            const distance = 9
            for (let x = 0; x < width; x += distance) {
            for (let z = 0; z < depth; z += distance) {
                position.push(-width / 2 + x, -30, -depth / 2 + z)
                color.push(0, 1 - (x / width) * 1, 0.5 + x / width * 0.5, z / depth)
            }
            }
            if (this.uniforms) {
            this.uniforms.field = [width, height, depth]
            this.uniforms.size = (h / 400) * pointSize * dpi
            }
            if (this.buffers) {
            this.buffers.position = position
            this.buffers.color = color
            }
        }
        })
    }
    }
</script>

<style lang="scss" scoped>
.el-form{width: 500px;margin: 0 auto;position: relative;top: 100px;background: #fff;padding: 50px;border-radius: 10px;}
.el-row{width: 100%;}
.el-button{width: 100%;}
.yzm{width: calc(100% - 20px);}
.login-background{background: linear-gradient(-180deg, #dcf2e6 0%, #ffffff 100%);width: 100vw;height: 100vh; /**宽高100%是为了图片铺满屏幕 */z-index: -1;position: absolute;}
#particle-wave{width: 100vw;height: 100vh;overflow: hidden;position: absolute;left: 0;top: 0;z-index: -1;background-color: #1E1D46;}
</style>