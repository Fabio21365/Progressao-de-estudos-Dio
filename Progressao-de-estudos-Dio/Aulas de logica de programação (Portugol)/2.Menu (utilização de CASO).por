programa {
	funcao inicio() {
		escreva("1 - Abrir Netflix" + "\n" + "2 - Abrir Amazon Prime" + "\n" + "3 - Abrir HBO Go" + "\n" + "4 - Sair")
		inteiro menu = 0
		
		escreva ("\n" + "Por favor, escolha uma op��o: ")
		leia (menu)
		
		escolha (menu){
		
		caso 1:                 //Testa se o valor � igual a 1
		escreva ("Ok!" + "\n" + "Abrindo Netflix")
		pare
		
			caso 2:             //Testa se o valor � igual a 2
		escreva ("Ok!" + "\n" + "Abrindo Amazon Prime")
		pare
		
			caso 3:             //Testa se o valor � igual a 3
		escreva ("Ok!" + "\n" + "Abrindo HBO Go")
		pare
		
			caso 4:             //Testa se o valor � igual a 4
		escreva ("Ok!" + "\n" + "At� Mais!")
		pare
		
			caso contrario:             //Testa se o valor � diferente de 1, 2, 3 ou 4
		escreva ("Por favor, Selecione uma op��o de 1 a 4")
		pare
		    
		}
	}
}
