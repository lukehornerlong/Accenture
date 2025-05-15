public class BingoRunner {
    public static void main(String[] args) {
        BingoController bgcontr = new BingoController();
        bgcontr.run();
        System.out.printf(Toolkit.GOODBYEMESSAGE + "%n");
    }
}
