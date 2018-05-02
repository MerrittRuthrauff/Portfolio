#sudo apt install python3-tk 

"""Script for simple Tkinter GUI chat client."""
from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread
import tkinter
import json



def receive():
    """Handles receiving of messages from server broadcast."""
    while True:
        try:
            msg = client_socket.recv(BUFSIZ).decode("utf8")
            message_json = json.loads(msg)
        
            if message_json['type'] == "chat-response": #server accepts
                ID = message_json['id']
            elif message_json['type'] == "chatroom-broadcast": #broadcast from server
                msg_list.insert(tkinter.END, message_json['from'] + " - " + message_json['message'])
        except OSError:  # Possibly client has left the chat.
            break

def startChat():
    msg = '{"type":"chatroom-begin","username":"%s","len":%s}' % (NAME, str(len(NAME))) #sets up name with server
    client_socket.send(bytes(msg, "utf8"))

def send(event=None):  # sends message to server; event is passed by binders.
    """Handles sending of messages."""
    typed_msg = my_msg.get()
    if typed_msg != '{quit}':
        msg = '{"type":"chatroom-send", "from":"%s", "to": [], "message": "%s", "message-length":%s}' % (NAME, typed_msg, str(len(typed_msg)))
    else:
        msg = '{"type":"chatroom-end", "id":%s}' % str(ID)
        
    my_msg.set("")  # Clears input field back to blankness.
    client_socket.send(bytes(msg, "utf8"))
        
    if typed_msg == '{quit}':
        client_socket.close()
        top.quit()


def on_closing(event=None):
    """This function is to be called when the window is closed, sends chatroom-end"""
    my_msg.set('{quit}')
    send()

top = tkinter.Tk()
top.title("Dealie-Ealio")

messages_frame = tkinter.Frame(top)
my_msg = tkinter.StringVar()  # For the messages to be sent in send method.
my_msg.set("")
scrollbar = tkinter.Scrollbar(messages_frame)  #scrollbar to look back in convo
# The Following will contain the messages.
msg_list = tkinter.Listbox(messages_frame, height=15, width=50, yscrollcommand=scrollbar.set)
scrollbar.pack(side=tkinter.RIGHT, fill=tkinter.Y)
msg_list.pack(side=tkinter.LEFT, fill=tkinter.BOTH)
msg_list.pack()
messages_frame.pack()

entry_field = tkinter.Entry(top, textvariable=my_msg)
entry_field.bind("<Return>", send)
entry_field.pack()
send_button = tkinter.Button(top, text="Send", command=send)
send_button.pack()

top.protocol("WM_DELETE_WINDOW", on_closing)

HOST = input('Enter host IP: ')
PORT = input('Enter port: ')
NAME = input('Enter name: ')
ID = -2 #can't get rest of code to modify these variables

if not PORT:
    PORT = 8029
else:
    PORT = int(PORT)

BUFSIZ = 1024
ADDR = (HOST, PORT)

client_socket = socket(AF_INET, SOCK_STREAM)
client_socket.connect(ADDR)

receive_thread = Thread(target=receive)
receive_thread.start()
startChat()
tkinter.mainloop()  # Starts GUI.