public class Main {
    public static void main(String[] args) {
        Cliente nauderick = new Cliente();
        nauderick.setNome("Nauderick");


        Conta cc = new ContaCorrente(nauderick);
        cc.depositar(100);

        Conta cp = new ContaPoupanca(nauderick);
        cc.transferir(100, cp);

        cc.imprimirExtrato();
        cp.imprimirExtrato();
    }
}