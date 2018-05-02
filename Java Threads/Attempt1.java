/**
 * Summation program using exectuors/callable/futures
 */

import java.util.concurrent.*;
import java.util.*;

class Collatzation implements Callable<List<Integer>>
{
    private int startVal;

    public Collatzation(int startVal) {
        this.startVal = startVal;
    }

    public List<Integer> call() {
      List<Integer> myList = new ArrayList<Integer>();
      while (startVal != 1)
      {
        myList.add(startVal);
        if (startVal % 2 == 0)
        {
          startVal = startVal / 2;
        }
        else
        {
          startVal = (3 * startVal) + 1;
        }
      }
      myList.add(1);


        return myList;
    }
}


public class Attempt1
{
    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: java Attempt1 <integer>");
            System.exit(0);
        }
        else {
            int upper = Integer.parseInt(args[0]);

            ExecutorService pool = Executors.newSingleThreadExecutor();
            Future<List<Integer>> result = pool.submit(new Collatzation(upper));

            try {
              List<Integer> newList = result.get();
              for(int i = 0; i < newList.size(); i++)
                System.out.println(newList.get(i));
            }
            catch (InterruptedException | ExecutionException ie) { }

            // Notice the difference if shutdown() is invoked.

            pool.shutdown();
        }
    }
}
