interface Employee {
    code: number,
    name: string
};

const pedro: Employee = {
    code : 10,
    name :'Pedro'
}

function desafio1() {
    console.log("Desafio 1:");
    console.log(pedro);
}


let desafio1Button = document.getElementById('desafio-1') as HTMLButtonElement;

desafio1Button?.addEventListener('click', desafio1);