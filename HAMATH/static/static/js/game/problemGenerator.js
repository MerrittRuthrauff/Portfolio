/* Random math generator for the Hammath Game*/
/* It should return an array of 4 things: first number, the second number and the type of equation type (symbol) and the result*/

function problemGenerator(difficulty)
{
	var firstNumber;
	var secondNumber;
	var symbol;
	var symbolChoice;
	var solution;
	var returnArray;

	if (difficulty === 1)
	{
		firstNumber = Math.floor((Math.random() * 10) + 1);
		secondNumber = Math.floor((Math.random() * 10) + 1);

		returnArray = sum(firstNumber,secondNumber);
		solution = returnArray[0];
		symbol = returnArray[1];
	}

	if (difficulty === 2)
	{
		firstNumber = Math.floor((Math.random() * 100) + 1);
		secondNumber = Math.floor((Math.random() * 100) + 1);
		symbolChoice = Math.floor((Math.random() * 2) + 1);

		if (symbolChoice == 1)
		{
			returnArray = sum(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 2)
		{	
				while (secondNumber > firstNumber)
				{
					secondNumber = Math.floor((Math.random() * 100) + 1);	
				}
			returnArray = sub(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		else 
		{
			window.confirm("Yeah, you screwed up the normal one");
		}
	}

	if (difficulty === 3)
	{
		firstNumber = Math.floor((Math.random() * 10) + 1);
		secondNumber = Math.floor((Math.random() * 10) + 1);

		symbolChoice = Math.floor((Math.random() * 4) + 1);

		if (symbolChoice == 1)
		{
			returnArray = sum(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 2)
		{	
				while (secondNumber > firstNumber)
				{
					secondNumber = Math.floor((Math.random() * 100) + 1);	
				}
			returnArray = sub(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 3)
		{
			returnArray = mul(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 4)
		{
			while (secondNumber > firstNumber && (secondNumber % firstNumber === 0))
			{
					secondNumber = Math.floor((Math.random() * 100) + 1);	
			}
			returnArray = div(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		
		}
		
		else 
		{
			window.confirm("Yeah, you screwed up the hard one");
		}
	}

	if (difficulty === 4)
	{
		firstNumber = Math.floor((Math.random() * 100) + 1);
		secondNumber = Math.floor((Math.random() * 100) + 1);

		symbolChoice = Math.floor((Math.random() * 4) + 1);

		if (symbolChoice == 1)
		{
			returnArray = sum(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 2)
		{	
				while (secondNumber > firstNumber)
				{
					secondNumber = Math.floor((Math.random() * 100) + 1);	
				}
			returnArray = sub(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 3)
		{
			returnArray = mul(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		}
		if (symbolChoice == 4)
		{
			while (secondNumber > firstNumber && (secondNumber % firstNumber === 0))
			{
					secondNumber = Math.floor((Math.random() * 100) + 1);	
			}
			returnArray = div(firstNumber,secondNumber);
			solution = returnArray[0];
			symbol = returnArray[1];
		
		}
		else 
		{
			window.confirm("Yeah, you screwed up the hardest one");
		}
		
	}

	/*returnArray[0] = firstNumber;
	returnArray[0] =  secondNumber;
	returnArray[0] = symbol;
	returnArray[0] = result;

	return returnArray;*/ //if the one down there doest work

	return [firstNumber, secondNumber, symbol, result];
}

function sum (fn, sn)
{
	var symbol ="+";
	var res = fn + sn;
	return [res, symbol];
}

function sub (fn, sn)
{
	var symbol = "-";
	var res = fn - sn;	
	return [res, symbol];
}

function mul (fn, sn)
{
	var symbol ="*";
	var res = fn * sn;
	return [res, symbol];
}

function div (fn, sn)
{
	var symbol ="/";
	var res = (fn/sn);
	return [res, symbol];
}
