define(['jquery','utils'],()=>{
    class Header{
        constructor(){
            this.logoBtn = $('.logBtn');;
            this.headerNum = $('.headerNum');
            this.logNowCon=$('.logNowCon')//登录页面
            this.logNow = $('.logNowCon .logNow')
            this.close=$('.close');
            this.logOut =$('.logOut')
            this.welc =$('.welc');
            this.fix =$('.fix')
            this.bindEvents()
        }
        bindEvents(){
            $(this.logoBtn).on('click',(e)=>{
                if(!document.cookie){
                    e.preventDefault();
                    $(this.logNowCon).css({
                        display:"block",
                        position:"fixed",
                        zIndex:6,
                        color:'red',
                        width:$(document).innerWidth(),
                        height:$(document).innerHeight(),
                        background:'rgba(0,0,0,60%)',
                        left:0,
                        top:0,
                        
                    })
                    $(this.logNow).css({
                        position:"fixed",
                        left:0,
                        right:0,
                        top:0,
                        bottom:0,
                        margin:'auto',
                        opacity:1,
                    })
                    $(this.close).css({
                        position:'absolute',
                        top:4,
                        right:6
                    })
                }else{
                    if($(e.target).parents('.gwc')){
                        location.href='/html/cart.html'
                    }
                    utils.setCookie(document.cookie.split('=')[0],document.cookie.split('=')[1],{
                        expires: -7, 
                        path: '/'
                    })
                    window.location.reload();
                    
                }

            })
            $(this.close).on('click',()=>{
                $(this.logNowCon).css({
                    display:'none'
                })
            })
        }
        init(){
            $.get('/api/ps/product/getProduct',{
                skuId:"02618cee722f17bcf4bb"
            },resp=>{

            },'json')
            setTimeout(()=>{
                this.logNow=$('.logNowCon .logNow');
            },500)
            if(!document.cookie){
                this.fix.text("登录")
                this.welc.text(`盛趣游戏商城欢迎您`);
            this.headerNum.text(0);

            }else{
                this.fix.text("退出")
               this.welc.text(`${document.cookie.split('=')[0]}欢迎您`);
            this.headerNum.text(localStorage.getItem('numSum'));

            }
            
        }
    }
    return Header;
})