//Fun��o do Algoritmo: Calcular m�dia e exibir resultado final
//Por F�bio Ferreira

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
		
		//Define o que ser� feito caso a m�dia das notas seja maior ou igual a 7
		
		escreva("A m�dia das notas de "+ aluno + " � : "+ media)
		
		se (media >=7 ) {
		    escreva ("\n" + "Parab�ns, voc� foi APROVADO!!!")
		    
		    //Define o que ser� feito caso a m�dia das notas seja menor que 7 
		    
	        } senao {
	    escreva ("\n" +"Voc� n�o foi aprovado") 
	}
  }
}