// 单位职责上下切换功能
// var btnPrev = document.getElementsByClassName("btn-prev")[0];
// var btnNext = document.getElementsByClassName("btn-next")[0];
// var centreContent = document.getElementsByClassName("centre-content")[0];
// var dutyContent = document.getElementsByClassName("duty-content")[0];

$(".btn-prev")[0].addEventListener("click", function(){
    $(".centre-content")[0].style.display = "block";
    $(".duty-content")[0].style.display = "none";
})
$(".btn-next")[0].addEventListener("click", function(){
    $(".centre-content")[0].style.display = "none";
    $(".duty-content")[0].style.display = "block";      
})

