import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
const Login = () => import('../views/Login.vue')
const Index = () => import('../views/Index.vue')
const ShopSetting = () => import('../views/Index/ShopSetting.vue')
const OrderList = () => import('../views/Index/OrderList.vue')
const Home = () => import('../views/Index/Home.vue')
const ShopFood = () => import('../views/Index/ShopFood.vue')


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'index',
        component: Index,
        redirect:'/home',
        meta:{
          auth:true
        },
        children:[
          {
            path: 'home',
            name: 'home',
            component: Home,
            meta:{
              breadcrumb:['首页']
            }
          },
          {
            path: 'shop/setting',
            name: 'shopSetting',
            component: ShopSetting,
            meta:{
              breadcrumb:['店铺管理','店铺设置']
            }
          },
          {
            path: 'shop/food',
            name: 'shopFood',
            component: ShopFood,
            meta:{
              breadcrumb:['店铺管理','菜品设置']
            }
          },
          {
            path: 'order/list',
            name: 'orderList',
            component: OrderList,
            meta:{
              breadcrumb:['订单管理','订单列表']
            }
          },
        ]
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
        meta:{
          auth:false
        },
      },
    ]
  })
  router.beforeEach((to,from,next)=>{
    //console.log(store.state.users.token);
    if(to.meta.auth){
      store.dispatch('users/info').then((res)=>{
        if(res.data.errcode === 0){
          store.commit('users/updateUsername',res.data.username)
         next()
        }
        else{
         next('/login')
        }
       })
    }
    else{
      next()
    }
  })
  export default router
