require(['/js/config.js'],()=>{
    require(['jquery'],()=>{
        class Register{
            constructor(){
                this.user=$('#adminNo');
                this.pwd = $('#pwd');
                this.regis=$('#jq22-btn-reg');
                this.init()
                this.bindEvents();
            }
            init(){
                 $('footer').load('/html/modules/footer.html');
            }
            bindEvents(){
                this.regis.on('click',()=>{
                    if(this.user.val()==""||this.pwd.val()==""){
                        alert("账号密码不能为空请重新输入")
                    }else{
                        $.post('http://localhost/register.php',{
                            name:this.user.val(),
                            pwd:this.pwd.val(),
                        },resp=>{
                            if(resp.code==200){
                                alert(resp.body.msg+"即将跳往主页")
                                setTimeout(()=>{
                                    location.href='/index.html'
                                },2000)
                            }else{
                                alert(resp.body.msg)
                            }
                        },'json')
                    }
                })
            }
        }
        new Register();
    })
})