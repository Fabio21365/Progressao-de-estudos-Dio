var currentNumberWrappper = document.getElementById("currentNumber");
var currentNumber = 0;

function increment() {
    currentNumber = currentNumber +1;
    currentNumberWrappper.innerHTML = currentNumber
}

function decrement() {
    currentNumber = currentNumber -1;
    currentNumberWrappper.innerHTML = currentNumber
}

var currentNumber2Wrappper = document.getElementById("currentNumber2");
var currentNumber2 = 0;

function devide() {
    currentNumberD2 = currentNumber /2;
    currentNumber2Wrappper.innerHTML = currentNumberD2
}

function multiply() {
    currentNumberX2 = currentNumber *2;
    currentNumber2Wrappper.innerHTML = currentNumberX2
}



