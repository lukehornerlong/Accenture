import java.io.*;
import java.net.*;

public class ClientHandler implements Runnable {
    //declare variables
    Socket clientSocket;
    int clientID;
    Database clientdb;

    String ClientMessage = "";
    int numTitles;
    //Constructor
    public ClientHandler (Socket socket, int clientId, Database db) {
        //complete the constructor
            clientSocket = socket;
            clientID = clientId;
            clientdb = db;
    }

    public void run() {
        System.out.println("ClientHandler started...");

        try {
            BufferedReader ifc = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter otc = new PrintWriter(clientSocket.getOutputStream(), true);

            while (true) {
                ClientMessage = ifc.readLine();
                if (ClientMessage.equals("stop")) {
                    break;
                }

                System.out.printf("Client sent the artist name %s\n", ClientMessage);

                numTitles = clientdb.getTitles(ClientMessage);
                otc.println("Number of titles: " + String.valueOf(numTitles) + " records found");
            }

            System.out.printf("Client %s has disconnected\n", clientID);

            otc.println("Connection closed, Goodbye!");

            ifc.close();
            otc.close();
            clientSocket.close();


        } catch (IOException e) {
        }
    }
}
