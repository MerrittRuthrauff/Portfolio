 
import java.io.*;
import java.net.*;
import com.google.gson.*;
import java.util.*;
 
/**
 * This thread is responsible for reading user's input and send it
 * to the server.
 * It runs in an infinite loop until the user types '!quit' to quit.
 */
public class WriteThread extends Thread {
    private PrintWriter writer;
    private Socket socket;
    private ChatClient client;
    Gson camelCaseGson = new Gson();
    Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_DASHES).create();
    GsonBuilder builder = new GsonBuilder();
 
    public WriteThread(Socket socket, ChatClient client) {
        this.socket = socket;
        this.client = client;
 
        try {
            OutputStream output = socket.getOutputStream();
            writer = new PrintWriter(output, true);
        } catch (IOException ex) {
            System.out.println("Error getting output stream: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
 
    public void run() {
        Gson camelCaseGson = new Gson();
        Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_DASHES).create();
        
        Console console = System.console();
 
        String userName = console.readLine("\nEnter your name: ");//Need to figure out chat begin
        
        client.setUserName(userName);
        writer.println(userName);

        chatroom_begin newChat = new chatroom_begin();
        newChat.setLen(userName.length());
        newChat.setUserName(userName);
        writer.println(gson.toJson(newChat));
        
        String text;
        


        do {
            //text = console.readLine("[" + userName + "]: ");
            text = console.readLine("[" + userName + "]: ");
            chatroom_send sendChat = new chatroom_send();

            sendChat.setfrom(userName);
            sendChat.setmessage(text);
            sendChat.setmessagelen(text.length());
            writer.println(gson.toJson(sendChat));
            //writer.println(text);
 
        } while (!text.equals("!quit"));
 
        try {
            socket.close();
        } catch (IOException ex) {
 
            System.out.println("Error writing to server: " + ex.getMessage());
        }
    }
}