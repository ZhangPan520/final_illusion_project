define(['jquery'],()=>{
    class Log{
        constructor(){
            this.user=$('.user');
            this.pwd=$('.pwd');
            this.log_Btn=$('.log_Btn')
            this.bindEvents()
        }
        bindEvents(){
            this.log_Btn.on('click',()=>{
                if(this.user.val()==""||this.pwd.val()==""){
                    alert("账号密码不能为空请重新输入")
                }else{
                    $.post('http://localhost/login.php',{
                        name:this.user.val(),
                        pwd:this.pwd.val(),
                    },resp=>{
                        if(resp.code==200){
                            utils.setCookie(this.user.val(),this.pwd.val(),{
                                expires: 7, 
                                path: '/'
                            })
                            alert(resp.body.msg)
                            window.location.reload()
                        }else{
                            alert(resp.body.msg)
                        }
                    },'json')
                }
            })
        }
    }
    return Log;
})