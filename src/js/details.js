require(['./config'],()=>{
    require(['header','jquery'],(header)=>{
        class Details{
            constructor(){
                this.dataApi=null;
                this.zoom = $('.zoom');
                this.bigImg = $('.bigImg');
                this.img = $('.img');
                this.sub = $('.sub');
                this.add=$('.add');
                this.addCart=$('.addCart')
                this.num = $('.num');
                this.buyNow=$('.buyNow')
                $('header').load('/html/modules/header.html');
                $('footer').load('/html/modules/footer.html')
                this.init();
                this.bindEvents();
                this.compute()
            }
            bindEvents(){
                this.img.on('mouseenter',(e)=>{
                    this.toggoleDisplay("block");
                })
                this.img.on('mouseleave',()=>{
                    this.toggoleDisplay("none")
                })
                this.img.on('mousemove',(e)=>{
                    this.move(e)
                })
                this.addCart.on('click',()=>{
                    this.addCartJs()
                })
                this.buyNow.on('click',()=>{
                    alert("此功能还没完善，试试点击购物车吧")
                })
            }
            init(){
                $.get('/api/ps/product/list',{
                    merchantId:1,page:1,pageSize:40,_:1598079825951
                },(resp)=>{
                    const data = resp.data.productList
                    console.log(data)
                    const id = location.search.slice(4)
                    var current = data.filter(function(item){
                        return item.productId == id;
                    })
                    this.dataApi = current[0];
                    console
                    $('.productName').html(current[0].product.description);
                    $('.price i').html(current[0].price);
                    $('.img img').attr('src',current[0].product.picUrl);
                    $('.smallImg img').attr('src',current[0].product.picUrl);
                    $('.msgShow').html(current[0].product.productContent)
                    $('.bigImg').css({
                        backgroundImage:`url(${current[0].product.picUrl})`
                    })
                })
                setTimeout(()=>{
                    new header().init();
                },100)
            }
            move (e) {
                var left = e.clientX - this.img.offset().left - this.zoom.width() / 2
                var top = e.clientY - this.img.offset().top - this.zoom.height() / 2
                if (left < 0) left = 0
                if (top < 0) top = 0
                if (left > this.img.width() - this.zoom.width()) {
                  left = this.img.width() - this.zoom.width()
                }
                if (top > this.img.height() - this.zoom.height()) {
                  top = this.img.height() - this.zoom.height()
                }
                this.zoom.css({
                    left:left,
                    top:top,
                })
                this.bigImg.css({
                    backgroundPositionX:-2*left,
                    backgroundPositionY:-2*top,
                })
              }
            toggoleDisplay(display){
                this.bigImg.css({
                    display:display,
                });
                this.zoom.css({
                    display:display,
                })
            }
            addCartJs(){
                $.get("http://localhost/add.php",{
                            name:this.dataApi.product.description,
                            msg:this.dataApi.product.appId,
                            img:this.dataApi.product.picUrl,
                            price:Number(this.dataApi.price)/100,
                            num:Number(this.num.text()),
                            sum:Number(this.num.text())*Number(this.dataApi.price)/100,
                        },resp=>{
                            if(resp.code==200){
                                alert(resp.body.msg)
                            }else if(resp.code==205){
                                console.log(resp)
                            }
                        },'json')
                        console.log("NE")
                    var num = Number(localStorage.getItem('numSum'))+Number($('.num').text());
                    localStorage.setItem('numSum',num);
                    new header().init();
            }
            compute(){
                this.add.on('click',()=>{
                    this.num.text(Number(this.num.text())+1);
                    this.sub.removeAttr("disabled");
                    this.sub.css({
                        cursor:"default"
                    })
                })
                this.sub.on('click',()=>{
                    var number = Number(this.num.text())-1;
                     if(number ==1){
                          this.sub.attr("disabled","disabled");
                          this.sub.css({
                              cursor:"not-allowed"
                          })
                     }
                     this.num.text(number);
                 })
            }
        }
        new Details();
    })
})