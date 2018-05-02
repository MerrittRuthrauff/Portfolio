"""Server for multithreaded Dealio protocol chat application."""
from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread
import json

def accept_incoming_connections():
    """Sets up handling for incoming clients."""
    while True:
        client, client_address = SERVER.accept()
        print("%s:%s has connected." % client_address)
        #client.send(bytes("What's the dealio?! Now type your name and press enter!", "utf8"))
        addresses[client] = client_address
        Thread(target=handle_client, args=(client,)).start()


def handle_client(client):  # Takes client socket as argument.
    """Handles a single client connection and can communicate directly to single client."""
    chat_begin = client.recv(BUFSIZ).decode("utf8")
    nameJson = json.loads(chat_begin)
    name = nameJson['username']

    for x in range(0,len(userNames)):
        if userNames[x] == None:
            name = name + ":" + str(x)
            userNames[x] = name
            break

    #clientNo = 0
    #users = []
    #for x in range(0,len(userNames)):
        #if userNames[x] != None:
            #clientNo = clientNo + 1
            #users.append(userNames[x])

    #chatroom_response = '{"type": "chat-response", "id": %s, "clientNo": 0, "users": %s}' % (name[-1], users)
    chatroom_response = '{"type": "chat-response", "id": %s, "clientNo": 0, "users": []}' % name[-1]
    client.send(bytes(chatroom_response,"utf8"))
    #welcome = "What's the dealio, %s!?" % name
    #client.send(bytes(welcome, "utf8"))
    #msg = "%s has joined the chat!" % name
    #broadcast(bytes(msg, "utf8"))
    clients[client] = name

    while True:
        msg = client.recv(BUFSIZ).decode("utf8")
        message_json = json.loads(msg)
        if message_json['type'] != "chatroom-end":
            client_message = message_json['message']
            broad_message = '{"type":"chatroom-broadcast", "from":"%s", "to":[], "message":"%s", "message_length":%s}' % (name, client_message, str(len(client_message)))
            broadcast(bytes(broad_message,"utf8"))
        else:
            #client.send(bytes("{quit}", "utf8"))
            client.close()
            del clients[client]
            #broadcast(bytes("%s has left the chat." % name, "utf8"))
            userNames[int(name[-1])] = None
            break

#def broadcast(msg, prefix=""):  # prefix is for name identification.
def broadcast(msg):
    """Broadcasts a message to all the clients."""
    for sock in clients:
        sock.send(msg)
        #note: clients[sock] is the username of that socket; future private messaging implementation

clients = {}
addresses = {}
userNames = [] #for tracking unique IDs

for x in range(0,100):
    userNames.append(None) #cheap way to set up an array and use indexes as ID


HOST = ''
PORT = 8029
BUFSIZ = 1024
ADDR = (HOST, PORT)

SERVER = socket(AF_INET, SOCK_STREAM)
SERVER.bind(ADDR)



if __name__ == "__main__":
    SERVER.listen(5)
    print("Waiting for connection...")
    ACCEPT_THREAD = Thread(target=accept_incoming_connections)
    ACCEPT_THREAD.start()
    ACCEPT_THREAD.join()
    SERVER.close()