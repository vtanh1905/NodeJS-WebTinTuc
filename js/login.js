$("#register").hide();
$("#forgot_password").hide();

$("#login_btn").click(function () {
    $("#register").hide();
    $("#forgot_password").hide();
});

$("#login_btn").click(function () {
    $("#login").show();
});

$("#register_btn").click(function () {
    $("#login").hide();
    $("#forgot_password").hide();
});
$("#register_btn").click(function () {
    $("#register").show();
});

$("#btn_forgot").click(function(){
    $("#forgot_password").show();
});
$("#btn_forgot").click(function(){
    $("#login").hide();
});


//check email
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

//check Date
function CheckDate(date) {
    var re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return re.test(date);
} 

//check UserName
function CheckUserName(str) {
    var re = /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return re.test(str);
} 

//check UserName
function CheckPassword(str) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    return re.test(str);
} 

$("#btn_fg").click(function(){
    var email = $("#fg_email").val();
    if (!validateEmail(email)) {
        //thong bao email loi
        alert("Vui lòng nhập đúng email");
    }
});

//xu phan login
$("#btn_login").click(function(){

    var username = $("#username").val();
    var password = $("#login_pass").val();
    var cb_keepMe= $("#cb_KeepMe");
    //neu la admin
    if(username === "admin" && password === "123456"){
        window.open("manager/nguoi-dung.html","_top");
        return;
    }

    if(username.length === 0 || password.length === 0){
        alert("Vui lòng nhập dữ liệu");
        return;
    }else{
        alert("Tên tài khoản hoặc password không hợp lệ");
        return;
    }
    // xu ly

});

//xu ly register
$("#btn_register").click(function(){
    var firstName   = $("#firstName").val();
    var lastName    = $("#lastName").val();
    var username    = $("#username_rg").val();
    var password    = $("#pass_rg").val();
    var email       = $("#email_rg").val();
    var confPass    = $("#confPass_rg").val();
    var iscb_agree  = $("#cb_agree").prop("checked");
    var dob         = $("#dob").val(); 

    if(firstName.length === 0 || lastName.length === 0 || username.length === 0
    || password.length === 0 || email.length === 0 || confPass.length === 0 || dob.length === 0){
        alert("Vui lòng nhập đầy đủ dữ liệu");
        return;
    }
    
    
    if (!validateEmail(email)) {
        alert("Vui lòng nhập đúng email!");
        return;
    }

    if (!CheckDate(dob)) {
        alert("Vui lòng nhập đúng định dạng ngày sinh!");
        return;
    }

    if (!CheckUserName(username)) {
        alert("Username phải từ 6 tới 20 ký tự và không có ký tự đặc biệt");
        return;
    }

    if (!CheckPassword(password)) {
        alert("Username phải từ 6 tới 20 ký tự và có ít nhất 1 chữ in hoa, chữ thường và số");
        return;
    }

    if(password != confPass){
        alert("Xac nhận mật khẩu sai!");
        return;
    }
    if(!iscb_agree){
        alert("Vui long chấp nhận các điều khoảng"); 
        return;
    }
    
    // xu ly dang ky
    alert("Đăng Ký Thành Công");
    location.reload(true);
});