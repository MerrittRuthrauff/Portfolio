// Main game engine file, will control game state, keys, enemies and player
// Ideia for later: Many loops do the same thing, could just use them at the same time
// Actually use unit testing

/* 
	Little reminder:
	'=' is for receiving
	'==' kinda like
	'===' the exact same thing
*/

/*
	Making the screen onResize should help a little, look that up later
*/
function Game() 
{
 
 	// Set the initial config.
	this.config = //controls the game settings 
	{
		bombRate: 0.05,
        bombMinVelocity: 50,
        bombMaxVelocity: 50,
        invaderInitialVelocity: 25,
        invaderAcceleration: 0,
        invaderDropDistance: 20,
        rocketVelocity: 120,
        rocketMaxFireRate: 2,
        gameWidth: 400,
        gameHeight: 300,
        fps: 50,
        debugMode: false,
        invaderRanks: 5,
        invaderFiles: 10,
        shipSpeed: 120,
        levelDifficultyMultiplier: 0.2,
        pointsPerInvader: 5

	};
	 
	var problembox = document.getElementById("problemtxt");
	var resultbox = document.getElementById("responsetxt");

	// All state is in the variables below.
	this.lives = 5; //Amount of times player can be hit
	this.width = 0; //
	this.height = 0; //
	this.gameBound = {left: 0, top: 0, right: 0, bottom: 0};
	this.intervalId = 0;
    this.score = 0;
    this.level = 1;
    this.difficulty = 1;

    // Problem variables
    this.firstNumber = 1;
    this.secondNumber = 1;
    this.symbol = "+";
    this.solution = 2;

    problembox.value = "1 + 1"; //firstNumber + " " + symbol + " " + secondNumber;

	//  The state stack.
	this.stateStack = []; // Gamestates will go into this stack
	 
	//  Input/output
	this.pressedKeys = {}; // Stack for the keys being pressed
	this.gameCanvas =  null; // Canvas to render the game
}

//  Initialises the Game with a canvas.
Game.prototype.initialise = function(gameCanvas) 
{
 
    //  Set the game canvas.
    this.gameCanvas = gameCanvas; //stores the game in the canvas
 
    //  Set the game width and height.
    this.width = gameCanvas.width; // Set the game width
    this.height = gameCanvas.height; // Set the game height
 
    //  Set the state game bounds. As in the screen the game will actually happen.
    this.gameBounds = //Bounds are set using the gameCanvas width and height
    {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

//  Returns the current state.
Game.prototype.currentState = function() 
{
	//Returns whatever is in the top of the stateStack, if there's nothing, returns a null
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null; 
} //--------------------------------->SE ISSO AQUI FODER O ROLE JA SABE ONDE TA<-----------------------------------------------------------------------------------------

Game.prototype.moveToState = function(state) //Move function for anything that wants to move in-game
{ 	/* moveToState replaces the top of the state stack with a new state - 
		and states can know when they're entering or leaving */
 
    //  Are we already in a state?
    if(this.currentState()) //Checks if game already has a state
    {
 
        //  Before we pop the current state, see if the 
        //  state has a leave function. If it does we can call it.
        if(this.currentState().leave)  //check if the state object has a function called 'leave'
        {
           this.currentState().leave(game); // If it does, call it.
        }									// That is, state objects can choose to be notified if they're about to exit
        this.stateStack.pop(); //If in a state, pop it from the state stack.
    }
    
    //  If there's an enter function for the new state, call it.
    if(state.enter)  
    {
        state.enter(game); //states can choose to be notified if they're about to be entered ~~OH MY~~
    }
 
    //  Set the current state.
    this.stateStack.push(state); //push new state onto the stack
}; 

Game.prototype.pushState = function(state) 
{	/* same principals as the moveToState function*/
 
    //  If there's an enter function for the new state, call it.
    if(state.enter) //Uses the enter function if the state has it
    {
        state.enter(game); //Uses the enter function
    }
    //  Set the current state.
    this.stateStack.push(state); //pushes the state to the top of the stack
};
 
Game.prototype.popState = function() 
{ /* same principals as the moveToState function*/
 
    //  Leave and pop the state.
    if(this.currentState())  // Chacks if the game already has a state
    {
        if(this.currentState().leave) //checks if the state object has a leave function
        {
            this.currentState().leave(game); // If it does, calls it
        }
 
        //  Set the current state.
        this.stateStack.pop(); //if the game ahs a state, popsit from the stack
    }
}; 

// THE MAIN GAME LOOP
function gameLoop(game) 
{
    var currentState = game.currentState(); //First, get the current game state.
    if(currentState) //If it has a currentState
    {
 
        //  Delta t is the time to update/draw.
        var dt = 1 / game.config.fps; /*Now work out how much time is in one 'tick' of the loop.
        								ex. This is one over the FPS - if we loop ten times per second,
        								  each tick is 100 milliseconds.*/
 
        //  Get the drawing context.
        var ctx = game.gameCanvas.getContext("2d"); //http://www.w3schools.com/tags/ref_canvas.asp
		
        //  Update (as in call the function) if we have an update function. 
        // Also draw if we have a draw function.
        if(currentState.update) //If there is a function called 'update' in the state
        {
            currentState.update(game, dt); //call it, passing the game object and the amount of time 
            							//  that's passed.
        }
        if(currentState.draw) //If there's a function called 'draw' in the state,
        {
            currentState.draw(game, dt, ctx); //all it, passing the game object, 
            							//the amount of time that's passed and the drawing context.
        }
    }
} 

//  Start the Game.
Game.prototype.start = function() 
{
 
    //  start the game by moving into a new instance of the 'WelcomeState' class
    this.moveToState(new WelcomeState()); // Move into the 'welcome' state.
 
    //  Set the game variables for a game start. No it's not redundant with the first time you set it on config
    this.lives = 5;
    this.config.debugMode = /debug=true/.test(window.location.href); // Avoiding getting fucky
 
    //  Start the game loop.
    var game = this; //Gives the game this function to start the loop

    // Set a timer to call the gameLoop based on the FPS config setting
    this.intervalId = setInterval(function () { gameLoop(game);}, 1000 / this.config.fps);
 	/*'Slightly' harder than the background one*/
}; 

/* -----------------------------------------Welcome State------------------------------------------------ */

function WelcomeState()  // Creates a class for the state
{
 	//Won't have anything here, PROTOTYPE TIME~~
} 

WelcomeState.prototype.draw = function(game, dt, ctx)  //receives the game state, the elapsed time and the drawing context
{
 
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
 
 	// Writes out "Hamath the Game"
 	// I have no ideia how to style/CSS, like, for reals
    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("The Hamath Game", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
 
    ctx.fillText("Press 'Enter' to start.", game.width / 2, game.height/2); 
};

WelcomeState.prototype.keyDown = function(game, keyCode) 
{
    if(keyCode == 13) //ENTER KEY CODE IS 13, SPACE IS 32 
    {
        // Enter starts the game.
        game.moveToState(new LevelIntroState(game.level)); // if the keycode is ENTER, we move to the LevelIntroState.
    }
};

// Keep track of each key that is pressed in an object, so that if the user pressed multiple keys,
// states can look at the game.pressedKeys object and see what is pressed

//  Inform the game a key is pressed.
/* THIS IS MORE COMPLICATED THAN EVENT HANDLING IN JAVA*/
Game.prototype.keyDown = function(keyCode) 
{
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown) 
    {
        this.currentState().keyDown(this, keyCode);
    }
};
 
//  Inform the game a key is released.
Game.prototype.keyUp = function(keyCode) 
{
    delete this.pressedKeys[keyCode]; //The 'delete' keyword can be used to remove a property from an object
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp) 
    {
        this.currentState().keyUp(this, keyCode);
    }
};

//-----------------------------------------------------------------------------------------------------------
/* The Game Over State - or the Willy state as I call it.*/

function GameOverState() 
{

}

GameOverState.prototype.update = function(game, dt) 
{

};

GameOverState.prototype.draw = function(game, dt, ctx) 
{

    // Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
    // Writes the stuff in the screen
    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Game Over!", game.width / 2, game.height/2 - 40); 
    ctx.font="16px Arial";
    ctx.fillText("You scored " + game.score + " and got to level " + game.level, game.width / 2, game.height/2);
    ctx.font="16px Arial";
    ctx.fillText("Press 'Space' to play again.", game.width / 2, game.height/2 + 40);   
};

GameOverState.prototype.keyDown = function(game, keyCode) 
{
    if(keyCode == 13) /*space*/ 
    {
        //  Enter restarts the game.
        game.lives = 1;
        game.score = 0;
        game.level = 1;
        game.moveToState(new LevelIntroState(1));
    }
};

/*  ---------------------------------------------------------------------------------------------------------
    Level Intro State
 
    The Level Intro state shows a 'Level X' message and a countdown for the level.
*/

function LevelIntroState(level) 
{
    this.level = level; //Has a state of it's own. Gets the current level.
    this.countdownMessage = "3"; // IT'S THE FINAL COUNTDOOOOOOOWWWWWWNNNNNN
} 

LevelIntroState.prototype.draw = function(game, dt, ctx) //needs game, time elapsed (delta), and context
{
 
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
 	// Thank you based internet gods for provinding me with CSS, cause I know nothing of it.
    ctx.font="36px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle"; 
    ctx.textAlign="center"; 
    ctx.fillText("Level " + this.level, game.width / 2, game.height/2);
    ctx.font="24px Arial";
    ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);
    // Shows a message saying 'Ready in X' with X being the countdown message

}; 

/*
Update is called in the loop like Draw, but it doesn't draw anything - it updates the state of the game.
We could do this in draw, but draw should just faithfully render the current state untouched. 
Why is this? Well we could actually call draw and update at different frequencies 
- for example if drawing is expensive we can call it ten times less often than update - 
but still have the state of the system be updated at more regular intervals.
*/

LevelIntroState.prototype.update = function(game, dt)  //Updates the game state NOT the canvas drawing
{
 
    //  Update the countdown.
    if(this.countdown === undefined) //Why is this 3 equals? Dunno, gets all fucky with only two
    {								//If we don't have a countdown number, set it to three (seconds)
        this.countdown = 3; // countdown from 3 secs
    }
    this.countdown -= dt; //Now remove the time that's passed (dt is in seconds). 
 
    if(this.countdown < 2) //Every time the countdown number gets below 2 
    { 
        this.countdownMessage = "2"; // update the countdown message
    }
    if(this.countdown < 1) //Every time the countdown number gets below 1
    { 
        this.countdownMessage = "1"; // update the countdown message
    } 
    if(this.countdown <= 0) //When it gets to zero (or less, but if it's less, we done fucked up somewhere)
    {
        //  Move to the next level, popping this state.
        //(Play State - the actual game, passing the level we've been told we're counting down for)
        game.moveToState(new PlayState(game.config, this.level));
    }
 
}; 

/* ---------------------------------------------------------------------------------*/
/* SHIT IS ABOUT TO GET REAL, HERE IS THE ~MAIN~ PART OF THE GAME - The Play State */

//  Create a PlayState with the game config and the level you are on.
function PlayState(config, level) 
{
    this.config = config;
    this.level = level;
 
    //  Game state.
    this.invaderCurrentVelocity =  10; //enemy speed, will grow with level
    this.invaderCurrentDropDistance =  0; // how far they've moved downwards when they hit the edge of the screen
    this.invadersAreDropping =  false; //a flag for whether they're dropping
    this.lastRocketTime = null; //a time for when the last rocket was fired (so we can limit the number of rockets per second)
 
    //  Game entities.
    this.ship = null; //create a hero
    this.invaders = []; //create a set of the invaders
    this.rockets = []; //create a set of rockets (they'll just be for show)
    this.bombs = []; //create a set of bombs (might not use this one)
}

/*
  The ship has a position and that's about it. Used for colision detecting.
*/
function Ship(x, y) //x and y are the position it's going to
{
    this.x = x; //gives the ship the x position that came in the parameters
    this.y = y; //gives the ship the y position that came in the parameters
    this.width = 20; //width of the ship (should find a way to scale it with the canvas size)
    this.height = 16; //height of the ship (should find a way to scale it with the canvas size)
}
 
/*
    Fired by the ship, they've got a position and velocity. PROBABLY USELESS LATER
*/
function Rocket(x, y, velocity) 
{
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}
 
/*
    Dropped by invaders, they've got position and velocity. There ain't much to comment here....
*/
function Bomb(x, y, velocity) 
{
    this.x = x; // The x position
    this.y = y;	// The y position
    this.velocity = velocity; //The velocity it travels the screen
}
 
/*
    Enemies have position, type, rank/file and that's about it. 
*/
 
function Invader(x, y, rank, file, type) 
{
    this.x = x; // The x position
    this.y = y; // The y position
    this.rank = rank; // Row position on the grid
    this.file = file; // Collum position on the grid
    this.type = type; //Enemy type (MIGHT USE IT LATER)
    this.width = 18; //Enemy width size (should find a way to scale it with the canvas size)
    this.height = 14; //Enemy height size (should find a way to scale it with the canvas size)
} 

PlayState.prototype.enter = function(game) // Enter State, this is called when we start each level
{
 
    // Create the ship at the bottom middle of the game bounds
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom); 

    // Set the ship speed for this level, as well as invader params.
    // Makes sure things like the invader speed and bomb speed gets a bit faster each level.
	var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
	this.shipSpeed = this.config.shipSpeed; //Ship speed shoud not change, or even move at all (I think)
	this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity); //Enemy speed grows every level
	this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate); //So does the volume of shots (I mean, won't make a difference but LOOKS COOL BRUH)
	this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity); // Also grows the speed of the shots
	this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity); // CAUSE SPECIAL EFFECTS ARE THE 

	//  Create the invaders.
    var ranks = this.config.invaderRanks; //Rank of the invader (row)
    var files = this.config.invaderFiles; //File of the invader (column)
    var invaders = []; // Stack of the invaders
    for(var rank = 0; rank < ranks; rank++) //This controls the distance between invaders
    {
        for(var file = 0; file < files; file++) 
        {
            invaders.push(new Invader(
                (game.width / 2) + ((files/2 - file) * 200 / files),
                (game.gameBounds.top + rank * 20),
                rank, file, 'Invader'));
        }
    }
    this.invaders = invaders;
    // Speed controllers for the invaders
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
    // NextVelocity - we use that when we move them downwards 
    //and need to decide where to move them afterwards
    this.invaderNextVelocity = null; //
};

 PlayState.prototype.update = function(game, dt) 
 {
    
    /*  Will 'fire' the rocket/attack on the enemy when enter is hit */
    if(game.pressedKeys[13]) 
    {
    	//window.alert("Enter pressed");
        //this.fireRocket(); //most likely useless 
    }
 
    /*  Keep the ship in bounds. ANTI-FUCKY CODE RIGHT HERE BRUH*/
    if(this.ship.x < game.gameBounds.left) 
    {
        this.ship.x = game.gameBounds.left;
    }
    if(this.ship.x > game.gameBounds.right) 
    {
        this.ship.x = game.gameBounds.right;
    }

    //  Move each bomb downwards, until it's out of bounds.
    for(var i=0; i<this.bombs.length; i++) 
    {
        var bomb = this.bombs[i]; // Gets a particular bomb in the array, based on i
        bomb.y += dt * bomb.velocity; // Moves that bomb downwards
 
        //  If the bomb has gone off the screen remove it.
        /* splice can both add and/or remove items from an array*/
        /* Syntax: .splice(<position>, <remove>, <item_to_add>, <item_to_add>, ...), returns the removed item(s) */
        if(bomb.y > this.height) 
        {
            this.bombs.splice(i--, 1);
        }
    }
 
    //  Move each rocket, probably not going to use this... 
    // (UNLESS I CAN FIGURE HOW TO DO HOMING ROCKETS IN CASE OF RIGHT ANSWER)
    // (I MEAN MAKING IT ALWAYS HIT SHOULD BE EASY, MAKING IT NO LOOK LIKE CRAP ON THE OTHER HAND...)
    // (I SHOULD REALLY GET SOME SLEEP)
    // (CAPS LOCK IS THE CRUISE CONTROL FOR COOL)
    // (GERUDO VALEY > BOLERO OF FIRE > ZELDA'S LUBALLY)
    // (SO I GOT SIDE TRACKED HERE...)
    for(i=0; i<this.rockets.length; i++) 
    {
        var rocket = this.rockets[i];
        rocket.y -= dt * rocket.velocity;
 
        //  If the rocket has gone off the screen remove it.
        if(rocket.y < 0) 
        {
            this.rockets.splice(i--, 1);
        }
    }

    //  Move the invaders
    var hitLeft = false, hitRight = false, hitBottom = false; // Used for checking bounds collision
    for(i=0; i<this.invaders.length; i++) // Let's go trough all the enemies alive here
    {
        var invader = this.invaders[i]; // Selects a particular enemy

        var newx = invader.x + this.invaderVelocity.x * dt; //Get's the future x position by the current x position + x velocity * delta (time)
        var newy = invader.y + this.invaderVelocity.y * dt; //Get's the future y position by the current y position + y velocity * delta (time)

        if(hitLeft === false && newx < game.gameBounds.left) //checking to see if we've hit the left bound
        {
            hitLeft = true; // It did
        }
        else if(hitRight === false && newx > game.gameBounds.right) //checking to see if we've hit the right bound
        {
            hitRight = true; // It did
        }
        else if(hitBottom === false && newy > game.gameBounds.bottom) //checking to see if we've hit the bottom bound
        {
            hitBottom = true; // It did
        }
 
        if(!hitLeft && !hitRight && !hitBottom) // If the enemy didn't hit any bounds
        {
            invader.x = newx; // Now actually moves the enemy to the calculated x position
            invader.y = newy; // Now actually moves the enemy to the calculated y position
        }
    }

    //  Update invader velocities.
    if(this.invadersAreDropping) // If the invaders are actually moving (Uses the Flag setup in PlayState config)
    {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;

        if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) 
        {
        	// Speed goes up as the distance grows closer, increasing panic levels for dem kidz
            this.invadersAreDropping = false;
            this.invaderVelocity = this.invaderNextVelocity;
            this.invaderCurrentDropDistance = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft) 
    {
        this.invaderCurrentVelocity += this.config.invaderAcceleration; // Gets the current velocity for the enemy
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity }; // Stops horizontal movement, starts vertical movement
        this.invadersAreDropping = true; // Sets the flag so we know the enemies are moving
        this.invaderNextVelocity = {x: this.invaderCurrentVelocity , y:0}; // Stops vertical movement, re-starts horizontal movement on the oposite direction
    }
    //  If we've hit the right, move down then left.
    if(hitRight) 
    {
        this.invaderCurrentVelocity += this.config.invaderAcceleration; // Gets the current velocity for the enemy
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity }; // Stops horizontal movement, starts vertical movement
        this.invadersAreDropping = true; // Sets the flag so we know the enemies are moving
        this.invaderNextVelocity = {x: -this.invaderCurrentVelocity , y:0}; // Stops vertical movement, re-starts horizontal movement on the oposite direction
    }
    //  If we've hit the bottom, loses one life.
    if(hitBottom) 
    {
        this.lives -= 1;
    } 

    
    //  Check for right answers. This really needs ajusting.
    // var resultbox = document.getElementById("responsetxt");

    for(i=0; i<this.invaders.length; i++) // Goes trough every enemy
			{ 
		        var invader = this.invaders[i]; // Uses the particular enemy for checking based on i
		        var bang = false; //BEST VARIABLE NAME EVER OR WHAT?
		        var redo = false; //for making another problem
		 	
		 		/* If it goes too fucky, you know where it happened, HERE
		        for(var j=0; j<this.rockets.length; j++)
		        {
		            var rocket = this.rockets[j];
		 
		           
		           	if(rocket.x >= (invader.x - invader.width/2) && rocket.x <= (invader.x + invader.width/2) &&
		                rocket.y >= (invader.y - invader.height/2) && rocket.y <= (invader.y + invader.height/2)) 
		            {
		                
		                //  Remove the rocket, set 'bang' so we don't process
		                //  this rocket again.
		                this.rockets.splice(j--, 1);
		                bang = true;
		                game.score += this.config.pointsPerInvader;
		                break;
		            }
		        } */

		        

		        if(game.pressedKeys[13]) //THIS WILL BE THE TEST FOR RESULTS AND STUFF.I THINK.
		        {
		        	response =  document.getElementById("responsetxt").value;  //by id

		        	if( response == game.solution)
		        	{

		        	bang = true; //bang is when the answer is correct
		            game.score += this.config.pointsPerInvader; //adds points when enemy is unalived
		            
		            //break;
		        	}
		        	document.getElementById("responsetxt").value = "";
		        }

		        if(bang) 
		        {
		            this.invaders.splice(i--, 1); //removes the enemy from the stack
		            //break;
		        }
		        //break;
		    }

  //-----------------------------------------Effects only-----------------------------------------------
    //  Find all of the front rank invaders.
    var frontRankInvaders = {};
    for(var i=0; i<this.invaders.length; i++) 
    {
        var invader = this.invaders[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) 
        {
            frontRankInvaders[invader.file] = invader;
        }
    }
 
    //  Give each front rank invader a chance to drop a bomb.
    //  Game settings make it so that the rate of bomb drops increases with each level
    for(var i=0; i<this.config.invaderFiles; i++) 
    {
        var invader = frontRankInvaders[i];
        if(!invader) continue;
        var chance = this.bombRate * dt;
        if(chance > Math.random()) 
        {
            //  Fire!
            this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2,
                this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
        }
    } 
  //------------------------------------------------END------------------------------------------------

 //  Check for invader/ship collisions.
    for(var i=0; i<this.invaders.length; i++) 
    {
        var invader = this.invaders[i]; //Test per enemy

        // Since we are drawing on canvas with simple shapes, we are only using their bounds to see hit
        // Might be changeable to just reaching bottom and does damage, test later
        // This is a big but simple if clause.

        if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) && 
            (invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
            (invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
            (invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) 
        {
            // Loses a life per colision (as in, enemy ship reached bottom)
            game.lives = 0;
            //game.sounds.playSound('explosion'); //sounds make it fucky
        }
    }

    //  Check for failure
    if(game.lives <= 0) //If you have no lifes left, you ded
    {
        game.moveToState(new GameOverState());
    }
 
    //  Check for victory
    if(this.invaders.length === 0)  //Is our game infinite? Maybe, if I feel like it.
    {
        game.score += this.level * 50; // We have to have leaderboards right?
        game.level += 1; // Moves to next level
        game.moveToState(new LevelIntroState(game.level)); //TO THE NEXT ONE, TILL THE END OF TIME...or lifes...
    }
}; 

 PlayState.prototype.fireRocket = function() 
 { /* MIGHT BE USABLE IF I CAN MAKE THEM HOMING IN CASE OF RIGHT ANSWER
    //  If we have no last rocket time, or the last rocket time 
    //  is older than the max rocket rate, we can fire.
    
    if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate))
    {   
        //  Add a rocket.
        this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
        this.lastRocketTime = (new Date()).valueOf();
    }
    */
};

PlayState.prototype.draw = function(game, dt, ctx) 
{ 
	// Just looping through the game entities and drawing primitives
	// Still looking for a way to chage them to either images or just numbers in the equasion
	// Or going with the ideia of having the problem on the left and the answer box on the right
 
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);
    
    //  Draw ship.
    // Let's change it to an actual image later ok?
    ctx.fillStyle = '#999999';
    ctx.fillRect(this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);
 
    //  Draw our pesky little enmies.
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.invaders.length; i++) 
    {
        var invader = this.invaders[i];
        ctx.fillRect(invader.x - invader.width/2, invader.y - invader.height/2, invader.width, invader.height);
    }
 
    //  Draw bombs, you know, graphics makes the game. Not.
    ctx.fillStyle = '#ff5555';
    for(var i=0; i<this.bombs.length; i++) 
    {
        var bomb = this.bombs[i];
        ctx.fillRect(bomb.x - 2, bomb.y - 2, 4, 4);
    }
 
    //  Draw rockets if I ever manage to make them homing.
    ctx.fillStyle = '#ff0000';
    for(var i=0; i<this.rockets.length; i++) 
    {
        var rocket = this.rockets[i];
        ctx.fillRect(rocket.x, rocket.y - 2, 1, 4);
    }
 
}; 


PlayState.prototype.keyDown = function(game, keyCode) //Makes it that the playstate receives the key pressed and calls the pause state by pushing it to the game stack. MIGHT BE USABLE TO SEND RESULTS (with fiddling)
{

    if(keyCode == 80) 
    {
        //  Push the pause state.
        game.pushState(new PauseState());
    }
};

// Game over state incoming.
// Need HTML textboxes cause I can't think of another solution...

function PauseState() 
{
	// "It's not an online real time game, so it actually pauses, Mom"
}

PauseState.prototype.keyDown = function(game, keyCode) 
{

    if(keyCode == 80) // Key code for p
    {
        //  Pop the pause state.
        game.popState();
    }
};

PauseState.prototype.draw = function(game, dt, ctx) 
{

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="14px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillText("Paused", game.width / 2, game.height/2);
    return;
};

/* THIS SHOULD BE IN ANOTHER FILE WHEN I LEARN HOW TO (same excuse as always) */
/* -------------------------------------------------------------------------------------------------------------------- */

/* Random math generator for the Hamath Game*/
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
