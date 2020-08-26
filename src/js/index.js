// const { src } = require("gulp")
require(['./config'],()=>{
    require(['header','template','log','swiper','jquery','utils'],(header,template,log,Swiper)=>{
        class Index{
            constructor(){
                this.logNowCon=$('.logNowCon'),
                this.init()
            }
            banner(){
                var mySwiper = new Swiper ('.swiper-container', {

                    loop: true, // 循环模式选项
                    autoplay: {
                        delay: 1500,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                        },
                    // 如果需要分页器
                    pagination: {
                      el: '.swiper-pagination',
                      clickable :true,
                    },
                    
                    // 如果需要前进后退按钮
                    navigation: {
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    },
                    
                    // 如果需要滚动条
                    scrollbar: {
                      el: '.swiper-scrollbar',
                    },
                  }) 
                  for(var i=0;i<mySwiper.pagination.bullets.length;i++){
                    mySwiper.pagination.bullets[i].onmouseover=function(){
                      this.click();
                    };
                    mySwiper.el.onmouseover = function(){ //鼠标放上暂停轮播
                        mySwiper.autoplay.stop();
                      }
                      mySwiper.el.onmouseleave = function(){
                        mySwiper.autoplay.start();
                      }
                   
                  } 
                  
            }
            init(){
                $('header').load('/html/modules/header.html');
                setTimeout(()=>{
                    if(document.cookie){
                        new header().init();
                    }else(new header())
                    new log()
                },100)
                $(this.logNowCon).load("/html/modules/log.html")
                $('footer').load('/html/modules/footer.html');
                        $.get('api/cs/merchant/basicInfo',{
                            merchantId:1,_:1598233838182
                        },resp=>{
                            const html = template('titleTemplate',{
                                list:resp.data.merchantInfo.merchantIndexColumnList,
                            })
                            $('.product').html(html)
                        })
                        $.get('/api/ps/product/list',{
                            merchantId:1,page:1,pageSize:40,_:1598079825951
                             },resp=>{
                                const data1 = template('dataTemplate',{
                                    list:resp.data.productList.slice(0,12),
                                })
                                const data2 = template('dataTemplate',{
                                    list:resp.data.productList.slice(12,16),
                                })
                                const data3 = template('dataTemplate',{
                                    list:resp.data.productList.slice(16,20),
                                })
                                const data4 = template('dataTemplate',{
                                    list:resp.data.productList.slice(20,24),
                                })
                                $('.construction').eq(0).html(data1);
                                $('.construction').eq(1).html(data2);
                                $('.construction').eq(2).html(data3);
                                $('.construction').eq(3).html(data4);
                         })
                         $.get('libs/json/banner.json',resp=>{
                                const srcUrl=template('swiperSlideTemplate',{
                                    list:resp,
                                })
                                $('.swiper-wrapper').html(srcUrl)
                         },'json')
                         setTimeout(()=>{
                             this.banner();
                         },500)
            }
        }
        new Index()
    })
})