 
import java.io.*;
import java.net.*;
import java.util.*;
import com.google.gson.*;
import java.io.IOException;
import java.io.StringReader;
 
/**
 * This thread handles connection for each connected client, so the server
 * can handle multiple clients at the same time.
 */
public class UserThread extends Thread {
    private Socket socket;
    private ChatServer server;
    private PrintWriter writer;
    private String userName;
    Gson camelCaseGson = new Gson();
    Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_DASHES).create();
    GsonBuilder builder = new GsonBuilder();
 
    public UserThread(Socket socket, ChatServer server) {
        this.socket = socket;
        this.server = server;
    }
 
    public void run() {
        try {
            InputStream input = socket.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));
 
            OutputStream output = socket.getOutputStream();
            writer = new PrintWriter(output, true);
 
            printUsers();
 
            String inputName = reader.readLine();
            userName = server.addUserName(inputName);
            
        
            
            String serverMessage = "New user connected: " + userName;
            server.broadcast(serverMessage, this);
 
            String clientMessage;
 
            do {
                clientMessage = reader.readLine();
                serverMessage = clientMessage;

                if (serverMessage.contains("{")) {
                    Map o = builder.create().fromJson(serverMessage, Map.class);
                    if(o.get("type").equals("chatroom-send")){
                        chatroom_send receivedSend = new chatroom_send();
                        receivedSend = gson.fromJson(serverMessage, chatroom_send.class);
                        chatroom_broadcast chatBroad = new chatroom_broadcast();
                        chatBroad.set_message_length(receivedSend.getmessagelen());
                        chatBroad.setfrom(receivedSend.getfrom());
                        chatBroad.setmessage(receivedSend.getmessage());
                        chatBroad.setto(receivedSend.getto());
                        server.broadcast(gson.toJson(chatBroad), this);
                    } else {

                server.broadcast(serverMessage, this);
                }
            }
 
            } while (!clientMessage.equals("!quit"));
 
            server.removeUser(userName, this);
            socket.close();
 
            serverMessage = userName + " is a quitter.  QUITTER!";
            server.broadcast(serverMessage, this);
 
        } catch (IOException ex) {
            System.out.println("Error in UserThread: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
 
    /**
     * Sends a list of online users to the newly connected user.
     */
    void printUsers() {
        if (server.hasUsers()) {
            writer.println("Connected users: " + server.getUserNames());
        } else {
            writer.println("No other users connected");
        }
    }
 
    /**
     * Sends a message to the client.
     */
    void sendMessage(String message) {
        writer.println(message);
    }

    String getUserName() {
        return this.userName;
    }
}