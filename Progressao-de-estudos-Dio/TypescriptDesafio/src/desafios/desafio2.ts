enum Profissao{
    Atriz,
    Padeiro
}

interface Pessoa {
    nome: string,
    idade: number,
    profissao: Profissao
}


let pessoa1: Pessoa = {
    nome : "maria",
    idade : 29,
    profissao : Profissao.Atriz
}

let pessoa2: Pessoa ={
    nome : "Roberto",
    idade : 19,
    profissao : Profissao.Padeiro
}

let pessoa3: Pessoa = {
    nome: "laura",
    idade: 32,
    profissao: Profissao.Atriz
};

let pessoa4: Pessoa = {
    nome : "carlos",
    idade : 19,
    profissao : Profissao.Padeiro
}

function desafio2(){
    console.log("Desafio 2:");
    console.log(pessoa1);
    console.log(pessoa2);
    console.log(pessoa3);
    console.log(pessoa4);
}

(document.getElementById('desafio-2') as HTMLButtonElement).addEventListener('click', desafio2);