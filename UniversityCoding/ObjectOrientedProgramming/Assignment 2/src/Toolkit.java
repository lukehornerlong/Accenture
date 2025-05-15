import java.util.Scanner;

public class Toolkit {
    private static final Scanner stdIn = new Scanner(System.in);

    public static final String GOODBYEMESSAGE = "Thank you for playing";

    public static String getInputForMessage(String message) {

        System.out.println(message);

        return stdIn.nextLine();
    }

    public static String printArray(String[] array) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= array.length - 1; i++) {

            if (i != 0) {
                sb.append(", ");
                sb.append(array[i]);
            } else {
                sb.append(array[i]);
            }
        }

        return sb.toString();
    }
}
