//Função do Algoritmo: Calcular média e exibir resultado final
//Por Fábio Ferreira

programa {
	funcao inicio() {
		real nota1,nota2,nota3,nota4,media
		cadeia aluno
		
		escreva("Digite aqui o nome do aluno: ")
		leia(aluno)
		escreva("Digite a primeira nota: ")
		leia(nota1)
		escreva("Digite a segunda nota: ")
		leia(nota2)
		escreva("Digite a terceira nota: ")
		leia(nota3)
		escreva("Digite a quarta nota: ")
		leia(nota4)
		
		media = ((nota1+nota2+nota3+nota4)/4)
		
		//Define o que será feito caso a média das notas seja maior ou igual a 7
		
		escreva("A média das notas de "+ aluno + " é : "+ media)
		
		se (media >=7 ) {
		    escreva ("\n" + "Parabéns, você foi APROVADO!!!")
		    
		    //Define o que será feito caso a média das notas seja menor que 7 
		    
	        } senao {
	    escreva ("\n" +"Você não foi aprovado") 
	}
  }
}