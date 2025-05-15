import java.io.*;
import java.net.*;

public class Server {

    public static void main(String args[]) throws IOException {
        int cID = 1;

        ServerSocket socketServer = new ServerSocket(Credentials.PORT);
        System.out.println("Server is running" );

        Database db = new Database();
        if (db.establishDBConnection()) { // Successful connection
            System.out.println("Server is now connected to DB");

            while (true) {
                Socket socketClient = socketServer.accept();
                ClientHandler clientH = new ClientHandler(socketClient, cID, db);

                System.out.printf("Client %s connected with IP %s\n",
                        cID,
                        socketClient.getInetAddress().getHostAddress());

                cID = cID + 1;
                new Thread(clientH).start();
            }
        } else { // Unsuccessful
            System.out.println("DB connection fail, stopping.");
        }
    }
}

