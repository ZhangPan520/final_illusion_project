require(['./config'],()=>{
    require(['template','header','log','jquery'],(template,Header,log)=>{
        class Cart{
            constructor(){
                this.empty=$('.empty');
                this.table =$('table');
                this.seAll=$('#seAll');
                this.btnAll = $('tbody input');
                this.isChecked = false;
                this.delAll=$('#deleteAll');
                this.del =$('.del');
                this.bindEvents();
                this.sub = $('.sub');
                this.add=$('.add');
                this.num = $('.num');
                this.hasNum=$('.hasNum');
                this.hasSum=$('.hasSum');
                this.init()
            }
            init(){
                
                $.get('/api/ps/product/list',{
                    merchantId:1,page:1,pageSize:40,_:1598079825951
                },rest=>{
                })
                $('header').load('/html/modules/header.html');
                $('footer').load('/html/modules/footer.html');
                $('')
                setTimeout(function(){
                    new Header().init();
                    new log();
                },100)
                this.loadProduct();
            }
            bindEvents(){
                this.delAll.on('click',()=>{
                   new Promise((resolve)=>{
                    $.get('http://localhost/deleteAll.php','jsonp')
                    resolve();
                   }).then(()=>{
                       this.loadProduct();
                   })
                });
                this.table.on('click','tbody input',(e)=>{
                        if(!$(e.target).attr('checked')){
                            $(e.target).attr('checked','checked') 
                        }else{
                            $(e.target).removeAttr('checked');
                        }
                        this.pay()
                })
                this.table.on('click','strong',(e)=>{
                    $.get('http://localhost/delete.php',{
                        id:$(e.target).parents('tr').attr("id"),
                    },resp=>{
                        if(resp.code==200){
                            alert(resp.body.msg);
                        }else{
                            alert(resp.body.msg)
                        }
                    },"json")
                    var num = Number(localStorage.getItem('numSum'))-Number($(e.target).parents('tr').find('.num').text());
                    localStorage.setItem('numSum',num);
                    new Header().init();
                    $(e.target).parents('tr').remove();
                    if($('tbody tr').length==0){
                        this.empty.css({
                            display:'block',
                        })
                        this.table.css({
                            display:'none'
                        })
                    }
                })
                this.seAll.on('click',()=>{
                    if(!this.isChecked){
                        for(var i =0;i<this.btnAll.length;i++){
                            this.btnAll[i].checked=true;
                        }
                        this.isChecked=true;
                        console.log('1')
                    }else{
                        {
                            for(var i =0;i<this.btnAll.length;i++){
                                this.btnAll[i].checked=false;
                            }
                            this.isChecked=false;
                            console.log('2')
                        }
                    }
                    this.pay();
                })
            }
            loadProduct(){
                new Promise((resolve,reject)=>{
                    $.get('http://localhost/select.php',{},resp=>{
                    if(resp.body.list.length==0){
                        this.empty.css({
                            display:'block',
                        })
                        this.table.css({
                            display:'none'
                        });
                        resolve(resp);
                    }else{
                        this.empty.css({
                            display:'none',
                        })
                        this.table.css({
                            display:'block'
                        })
                        const html = template('productTemplate',{
                            list:resp.body.list
                        })
                        $('tbody').html(html)
                        resolve(resp);
                    }
                },'json')
                }).then((resp)=>{
                    var list = resp.body.list;
                    var numSum=0;
                    list.forEach(function(item){
                        numSum+=Number(item.num);
                    })
                    localStorage.setItem("numSum",numSum);
                    console.log(numSum)
                    this.btnAll=$('tbody input');
                    this.sub = $('.sub');
                    this.add=$('.add');
                    this.num = $('.num');
                    this.compute();
                })
            }
            compute(){
                var currentThis = this;
                this.table.on('mouseenter','tr',(e)=>{
                    if($(e.target).parents('tr').find('.num').text()>1){
                        $(e.target).parents('tr').find('.sub').css({
                            cursor:"default"
                        })
                        $(e.target).parents('tr').find('.sub').removeAttr("disabled")
                    }
                })
                this.add.on('click',function(){
                    var number = Number($(this).parents('tr').find('.num').text())+1;
                    var priceSum =number*Number($(this).parents('tr').find('.productPrice').text())
                    $(this).parents('tr').find('.sub').removeAttr("disabled");
                    $(this).parents('tr').find('.sub').css({
                        cursor:"default"
                    })
                    $(this).parents('tr').find('.num').text(number);
                    $(this).parents('tr').children('.priceSum').text(priceSum)
                    currentThis.pay();
                    $.get('http://localhost/update.php',{
                        id:Number($(this).parents('tr').attr('id')),
                        num:number,
                        sum:priceSum
                    },resp=>{
                    })
                    var numSum = +localStorage.getItem('numSum');
                    numSum++;
                    localStorage.setItem('numSum',numSum)
                    new Header().init()
                })
                this.sub.on('click',function(){
                    var number = Number($(this).parents('tr').find('.num').text())-1;
                    var priceSum =number*Number($(this).parents('tr').find('.productPrice').text())
                     if(number ==1){
                        $(this).parents('tr').find('.sub').attr("disabled","disabled");
                        $(this).parents('tr').find('.sub').css({
                              cursor:"not-allowed"
                          })
                     }
                     var numSum = +localStorage.getItem('numSum');
                     numSum--;
                     localStorage.setItem('numSum',numSum)
                     
                     $(this).parents('tr').find('.num').text(number);
                    $(this).parents('tr').children('.priceSum').text(priceSum)
                     currentThis.pay()
                     new Header().init();
                    $.get('http://localhost/update.php',{
                        id:$(this).parents('tr').attr('id'),
                        num:Number(number),
                        sum:Number(priceSum),
                    })
                 })
            }
            pay(){
                var hasNum=0;
                var hasSum=0;
                for(var i=0;i<this.btnAll.length;i++){
                    if(this.btnAll[i].checked){
                      hasNum+= Number($(this.btnAll[i]).parents('tr').find('.num').text())
                      hasSum+=Number($(this.btnAll[i]).parents('tr').find('.priceSum').text())
                    }
                }
                $(this.hasNum).text(hasNum);
                $(this.hasSum).text(hasSum.toFixed(2))
            }
        }
        new Cart()
    })
})