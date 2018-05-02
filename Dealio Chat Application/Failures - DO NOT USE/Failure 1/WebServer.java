
/**
 * This is the separate thread that services each
 * incoming echo client request.
 *
 * @author Colman Lloyd (modified from code provided by professor Greg Gagne)
 */

import java.net.*;
import java.io.*;
import java.util.*;
import java.text.*;
import java.util.concurrent.*;

public class WebServer implements Runnable {
	//variables to use in the server
	public static final int BUFFER_SIZE = 256;
	public static final int DEFAULT_PORT = 8029;
	private static final Executor exec = Executors.newCachedThreadPool();
    private Socket client;
    //private Configuration configuration;
    byte[] buffer = new byte[BUFFER_SIZE];
	BufferedReader inputReader;
	OutputStream outputStream;
	InputStream streamFile;
	File requestedFile;
	Calendar calendar;
	PrintWriter logger;
	String requestLine;
	String resource;
	String fileName;
	String contentLength;
	String contentType;
	String logDate;
	String logStatus;
	String statusHeader;
	String dateHeader;
	String serverName;
	String completeHeader;
	String logEvent;
	int numBytes;
	
	int count = 0;
	//modified from client file; works with configuration
 	public WebServer(Socket client) {
		this.client = client;
		//this.configuration = configuration;
	} 


	public static void main(String[] args) throws IOException {
		ServerSocket sock = null;
		//Configuration configuration = null;

/* 		if (args.length != 1) { //if an incorrect amount of args are provided
			System.err.println("ERROR!!! Proper Usage: java HttpHeader <web server> [document name]");
			System.exit(0);
		} */

		System.out.println("Powering up...");
		try {
			// establish the socket
			sock = new ServerSocket(DEFAULT_PORT);
			sock.accept();
			System.out.println("Now serving dank memes on port " + DEFAULT_PORT +"\n");
			while (true) {
				/**
				 * now listen for connections
				 * and service the connection in a separate thread.
				 */
				/* String location = args[0];
				try {
					configuration = new Configuration(location);
				} catch (ConfigurationException e) {
					System.err.println(e);
				}
 */
				Runnable task = new WebServer(sock.accept());
				exec.execute(task);
			}
		} catch (IOException ioe) {
		} finally {
			if (sock != null)
				sock.close();
		}
	}

	/**
	 * This method runs in a separate thread.
	 */
	public void run() {
		try {
			inputReader = new BufferedReader(new InputStreamReader(client.getInputStream()));
			outputStream = new BufferedOutputStream(client.getOutputStream());

			// we just want the first line
			while((requestLine = inputReader.readLine()) != null) {
				if (requestLine.length() == 0) break;
				//System.out.println(requestLine);
				outputStream.wr
			}
			//requestLine = inputReader.readLine(); 

			/* If we don't read a GET, just ignore it and close the socket */
			/* if (requestLine == null || !requestLine.substring(0, 3).equals("GET")) {
				client.close();
				return;
			} */
			
			/**
             * now parse the resource
             */
			//System.out.println(requestLine);

            

		} catch (IOException ioe) {
			System.err.println(ioe);
		}
	}

	/**
     * Finds the first occurrence of the character c 
     * beginning at the specified position in String s.
     * Returns the index of the character c.
     */
    public int findChar(char c, int pos, String s) {
        int index = pos;

        while (s.charAt(pos) != c && index < s.length())
            pos++;

        return pos;
    }
	
	public String getContentType(String s) { //returns the file type to the header variable
        String type;

		if (s.contains("html")) //based on filetype of request, create proper content-type
		type = "Content-Type: " + "text/html" + "\r\n";
	else if (s.contains("gif"))
		type = "Content-Type: " + "image/gif" + "\r\n";
	else if (s.contains("jpg") || s.contains("jpeg"))
		type = "Content-Type: " + "image/jpeg" + "\r\n";
	else if (s.contains("png"))
		type = "Content-Type: " + "image/png" + "\r\n";
	else
		type = "Content-Type: " + "text/plain" + "\r\n";

        return type;
    }
}
