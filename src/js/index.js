import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import PortalVue from 'portal-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "../css/index.scss";

let version = "0.1";

Vue.use(BootstrapVue);
Vue.use(PortalVue);

let app = new Vue({
    el:"#app",
    data:function () {
        let data = {
            version:version,
            cards:[1,2,3,4,5,6,7,8,9,10,11,12,13],
            selected:[],
            result:[]
        };
        return data;
    },
    computed: {
    },
    methods:{
        cardStr(num){
            switch (num){
                case 11:
                    return "J";
                case 12:
                    return "Q";
                case 13:
                    return "K";
                default:
                    return ""+num;
            }
        },
        calculation() {
            // if (this.selected.length===0){
            //     this.$bvToast.toast('你没有选择任何卡牌，无法计算', {
            //         title: '错误',
            //         variant: 'danger',//danger,warning,info,primary,secondary,default
            //         solid: true
            //     });
            //     this.calculationIng = false;
            //     return;
            // }
            this.result = calc(this.selected);
        },
        clear(){
            this.selected = [];
            this.result = [];
        },
        selectCard(card){
            this.selected.push(card);
            this.calculation();
        },
        removeCard(index){
            this.selected.splice(index,1);
            this.calculation();
        }
    }
});

function m2n(list,n){
    let result = [];
    let size = list.length;
    let zero = [];
    for(let i=0;i<size;i++){
        zero[i] = i<n;
    }
    for(;;){
        let sub = {
            left:{
                sum:0,
                list:[],
                hash:"",
            },
            right:[],
            miss:[]
        }
        let index = -1;
        let per1 = false;
        let leftCount = -1;
        for(let i=0;i<size;i++){
            if(zero[i]){
                sub.left.list.push(list[i]);
                sub.left.sum += list[i];
            }else{
                sub.miss.push(list[i]);
            }
            if(index===-1){
                if(per1 && !zero[i]){
                    zero[i] = true;
                    index = i;
                }else{
                    per1 = zero[i];
                    if(per1) leftCount++;
                }
            }
        }
        sub.left.hash = sub.left.list.join("-");
        for(let i=0;i<index;i++){
            zero[i] = i<leftCount;
        }
        result.push(sub);

        if(index===-1) break;
    }
    return result;
}

function calc(list){
    let result = [];
    let hash = {};
    for(let ln = 1,s=list.length;ln<s;ln++){
        let left = m2n(list,ln);
        for(let i=0,size=left.length;i<size;i++){
            let temp = left[i];
            for(let l=1,m=temp.miss.length;l<=m;l++){
                let right = m2n(temp.miss,l);
                for(let x=0,y=right.length;x<y;x++){
                    let rt = right[x].left;
                    if(temp.left.sum===rt.sum){
                        let h1 = temp.left.hash + "_" + rt.hash;
                        let h2 = rt.hash + "_" + temp.left.hash;
                        if(hash[h1]) continue;
                        hash[h1] = true;
                        hash[h2] = true;
                        result.push({
                            left:{
                                sum:temp.left.sum,
                                list:temp.left.list
                            },
                            right:{
                                sum:rt.sum,
                                list:rt.list
                            }
                        })
                    }
                }
            }
        }
    }
    return result.sort((a,b)=>{
        return b.left.list.length+b.right.list.length - a.left.list.length - a.right.list.length;
    });
}