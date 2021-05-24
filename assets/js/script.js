var searchButton = document.querySelector(".btn");
var input = document.querySelector(".form-control");
var result = document.querySelector("result");

var searchFun = function(event){
    event.preventDefault();
    var userInput=input.value;
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=34a53d9037f69833f5d3bd462bcecce3")
    .then( function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        // result.removeClass("hide");
    });
};
searchButton.addEventListener("click", searchFun)