import http from '@/utils/http.js'

const state = {}
const actions = {
    update(context,data){
        const params = new FormData()
        for(let attr in data){
            if(attr === 'dynamictags'&&Array.isArray(data[attr])){
                params.append(attr,JSON.stringify(data[attr]))
            }
            else{
                if( attr === 'file' && data[attr] !== 'origin'){
                    continue;
                }
                params.append(attr,data[attr])
            }
        }
        return http.post('/shops/update',params,{
            'Content-type':'multipart/form-data'
        })
    },
    list(context,data){
        return http.get('shops/list',data)
    }
}
const getters = {}
const mutations = {}


export default {
    namespaced:true,
    state,
    actions,
    getters,
    mutations
}