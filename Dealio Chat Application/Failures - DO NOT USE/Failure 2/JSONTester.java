import com.google.gson.*;
import java.io.IOException;
import java.io.StringReader;
import java.util.*;
//

public class JSONTester {
    public static void main(String[] args) {
        String jsonString = "{\"name\":\"Mahesh\", \"age\":21}";
        String testy = "{\"name\":\"Bugger\", \"age\":69}";
        String userNameInput = "Winston";
        String sender = "{\"type\":\"chatroom-send\",\"from\":\"Colman\",\"to\":[],\"message\":\"Hello\",\"message-length\":5}";
        

        //GsonBuilder builder = new GsonBuilder(); 
        //builder.setPrettyPrinting(); 
        Gson camelCaseGson = new Gson();//new GsonBuilder().create();
        Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_DASHES).create();
        Student student = gson.fromJson(jsonString, Student.class);
        
        GsonBuilder builder = new GsonBuilder();
        Map o = builder.create().fromJson(sender, Map.class);
        System.out.println(o);
        if(o.get("type").equals("chatroom-send")){
            chatroom_send sendy = gson.fromJson(sender, chatroom_send.class);
            System.out.println(sendy.getmessage());
        }
        System.out.println(o.get("type"));

        chatroom_begin newChat = new chatroom_begin();
        newChat.setUserName(userNameInput);
        newChat.setLen(userNameInput.length());
        System.out.println(gson.toJson(newChat));
        System.out.println(student);

        chatroom_send sendChat = new chatroom_send();
        System.out.println(gson.toJson(sendChat));

        chat_response chatResponse = new chat_response();
        System.out.println(camelCaseGson.toJson(chatResponse));
        jsonString = gson.toJson(student);
        try {
            Student student2 = gson.fromJson(testy, Student.class);
            String json = gson.toJson(student2);

            System.out.println(json);
        } catch (com.google.gson.JsonSyntaxException e) {
            System.out.println("Malformed JSON Exception");
        }
    }
}

class Student {
    private String name;
    private int age;

    public Student() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String toString() {
        return "Student [ name: " + name + ", age: " + age + " ]";
    }
}

class chatroom_begin {
    //{ type: “chatroom-begin”, username: “(Username selected by the user)”, len: (length of username) }
    private String type = "chatroom-begin";
    private String username;
    private int len;

    public chatroom_begin() {
    }

    public String getType() {
        return type;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }

    public int getLen() {
        return len;
    }

    public void setLen(int len) {
        this.len = len;
    }
}

class chatroom_send {
    //{type: “chatroom-send”, from: (userID), to: [(list of recipient id’s)], message: (message sent by user), message-length: (length of message)}   
    private String type = "chatroom-send";
    private String from;
    private String[] to = new String[0];
    private String message;
    private int messageLength;

    public chatroom_send() {
    }

    public String getType() {
        return type;
    }

    public String getfrom() {
        return from;
    }

    public void setfrom(String from) {
        this.from = from;
    }

    public String[] getto() {
        return to;
    }

    public void setto(String[] to) {
        this.to = to;
    }

    public String getmessage() {
        return message;
    }

    public void setmessage(String message) {
        this.message = message;
    }

    public int getmessagelen() {
        return messageLength;
    }

    public void setmessagelen(int messageLength) {
        this.messageLength = messageLength;
    }
}

class chat_response {
    //{type: “chat-response”, id: (id assigned), clientNo: (number of clients in chatroom), users: [(array of users)]}      
    private String type = "chat-response";
    private String id;
    private int clientNo;
    private String[] users;

    public chat_response() {
    }

    public String getType() {
        return type;
    }

    public String getid() {
        return id;
    }

    public void setid(String id) {
        this.id = id;
    }

    public int getclientNo() {
        return clientNo;
    }

    public void setclientNo(int clientNo) {
        this.clientNo = clientNo;
    }

    public String[] getusers() {
        return users;
    }

    public void setusers(String[] users) {
        this.users = users;
    }
}

class chatroom_broadcast {
    //{type: “chatroom-broadcast”, from: (“username:id”), to: [(list of recipient id’s)], message: (message sent by user), message_length: (length of message)}      
    private String type = "chatroom-broadcast";
    private String from;
    private String[] to = new String[0];
    private String message;
    private int message_length;

    public chatroom_broadcast() {
    }

    public String getType() {
        return type;
    }

    public String getfrom() {
        return from;
    }

    public void setfrom(String from) {
        this.from = from;
    }

    public String[] getto() {
        return to;
    }

    public void setto(String[] to) {
        this.to = to;
    }

    public String getmessage() {
        return message;
    }

    public void setmessage(String message) {
        this.message = message;
    }

    public int get_message_length() {
        return message_length;
    }

    public void set_message_length(int message_length) {
        this.message_length = message_length;
    }
}

class chatroom_end {
    //{ type:”chatroom-end”, id: (Unique id of the user) }
    private String type = "chatroom-end";
    private String id;

    public chatroom_end() {
    }

    public String getType() {
        return type;
    }

    public String getid() {
        return id;
    }

    public void setid(String id) {
        this.id = id;
    }
}

class chatroom_error {
    //{type: “chatroom-error”, type_of_error: (error type specified above), id: (id of user)}
    private String type = "chatroom-error";
    private String type_of_error;
    private String id;

    public chatroom_error() {
    }

    public String getType() {
        return type;
    }

    public String get_type_of_error() {
        return type_of_error;
    }

    public void set_type_of_error(String type_of_error) {
        this.type_of_error = type_of_error;
    }

    public String getid() {
        return id;
    }

    public void setid(String id) {
        this.id = id;
    }
}

class chatroom_update {
    //{type: “chatroom-update”, type_of_update: (update type specified above), id: (id of user)}
    private String type = "chatroom-update";
    private String type_of_update;
    private String id;

    public chatroom_update() {
    }

    public String getType() {
        return type;
    }

    public String get_type_of_update() {
        return type_of_update;
    }

    public void set_type_of_update(String type_of_update) {
        this.type_of_update = type_of_update;
    }

    public String getid() {
        return id;
    }

    public void setid(String id) {
        this.id = id;
    }
}