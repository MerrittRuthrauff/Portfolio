/**
 * This program creates a separate thread by implementing the Runnable interface.
 *
 *
 * @author Matt & Merritt
 */


/**
 * This runs as a separate Java thread.
 *
 * This performs a summation from 1 .. upper
 */
class Collatzation implements Runnable
{
	private int startVal;

	public Collatzation(int startVal) {
		this.startVal = startVal;
	}

	public void run() {
		while (startVal != 1)
		{
			System.out.println(startVal);
			if (startVal % 2 == 0)
			{
				startVal = startVal / 2;
			}
			else
			{
				startVal = (3 * startVal) + 1;
			}
		}
		System.out.println("1");
		}
}

public class Lab4p1
{
	public static void main(String[] args) {
		if (args.length != 1) {
			System.err.println("Usage java Lab4p1 <integer>");
			System.exit(0);
		}

		if (Integer.parseInt(args[0]) < 0) {
			System.err.println(args[0] + " must be >= 0");
			System.exit(0);
		}

		// Create the shared object
		int startVal = Integer.parseInt(args[0]);

		Thread worker = new Thread(new Collatzation(startVal));
		worker.start();

	}
}
