import java.io.*;
import java.net.*;
import com.google.gson.*;
import java.util.*;

/**
 * This thread is responsible for reading server's input and printing it
 * to the console.
 * It runs in an infinite loop until the client disconnects from the server.
 */
public class ReadThread extends Thread {
    private BufferedReader reader;
    private Socket socket;
    private ChatClient client;
    Gson camelCaseGson = new Gson();
    Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_DASHES).create();
    GsonBuilder builder = new GsonBuilder();

    public ReadThread(Socket socket, ChatClient client) {
        this.socket = socket;
        this.client = client;

        try {
            InputStream input = socket.getInputStream();
            reader = new BufferedReader(new InputStreamReader(input));
        } catch (IOException ex) {
            System.out.println("Error getting input stream: " + ex.getMessage());
            ex.printStackTrace();
        }
    }

    public void run() {
        while (true) {
            try {
                String response = reader.readLine();
                System.out.println("\n" + response);
                try {
                    if (response.contains("{")) {
                        Map o = builder.create().fromJson(response, Map.class);
                        if(o.get("type").equals("chatroom-broadcast")){
                            chatroom_broadcast receivedSend = new chatroom_broadcast();
                            receivedSend = gson.fromJson(response, chatroom_broadcast.class);
                            System.out.println(receivedSend.getfrom()+ ": " + receivedSend.getmessage());
                        }
                    }
                } catch (java.lang.IllegalStateException ex) {
                }
                // prints the username after displaying the server's message
                if (client.getUserName() != null) {
                    System.out.print("[" + client.getUserName() + "]: ");
                }
            } catch (IOException ex) {
                System.out.println("Error reading from server: " + ex.getMessage());
                ex.printStackTrace();
                break;
            }
        }
    }
}