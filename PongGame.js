var canvas;
	var canvasContent;
	var ballX = 50;			//Starting Position
	var ballY = 50;
	var ballSpeedX = 10; 	//Ball's Default X Directional Speed
	var ballSpeedY = 5; 	//Ball's Default Y Directional Speed
	//LEFT
	var leftPaddleX = 10;	//Player 1 X 		← →
	var leftPaddleY = 200; 	//Player 1 Y  		↑ ↓
	//RIGHT
	var rightPaddleX = 765;
	var rightPaddleY = 200;
	//SCORE
	var player1Score = 0;
	var player2Score = 0;

	var showingWinScreen = false;
	const PADDLE_WIDTH = 25;
	const PADDLE_HEIGHT = 100;
	const BALL_RADIUS = 10;
	const SCORE_LIMIT = 5;
	//When the Window is done loading
	window.onload = function(){
		canvas = document.getElementById('gameCanvas');
		canvasContent = canvas.getContext('2d');
		
		//Setting Game time
		var framesPerSecond = 30;
		setInterval(function()
			{	//Move and Draw at every frame 
				drawEverything();
				moveEverything();
				computerMovement();
			}, 1000 / framesPerSecond);

		//GetMouse Position to move Paddle 	NOTE - Inline Function
		canvas.addEventListener('mousemove', function(evt){
				var mousePos = calculateMousePos(evt);
				leftPaddleY = mousePos.y-(PADDLE_HEIGHT/2);
				//rightPaddleY = mousePos.y-(PADDLE_HEIGHT/2);
			});
		//Mousedown - Reset score/game if at at game over screen aka showingWinScreen
		canvas.addEventListener('mousedown', handleMouseClick);
	};

	//Gets Mouse position relative to canvas
	function calculateMousePos(evt){
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		var mouseX = evt.clientX - rect.left - root.scrollLeft;
		var mouseY = evt.clientY - rect.top - root.scrollTop;
		return{
			x:mouseX,
			y:mouseY
		};
	}
	//Reset Score Game with Mouse *Click*
	function handleMouseClick(evt){

		if (showingWinScreen == true){
			player1Score = 0;
			player2Score = 0;
			showingWinScreen = false;
		}

	}

	//Reset Ball after a player scores
	function ballReset(){
		if(player1Score >= SCORE_LIMIT || player2Score >= SCORE_LIMIT){
			showingWinScreen = true;
		}
		ballX = canvas.width/2;		//Set ballX to CENTER screen 
		ballY = canvas.height/2;	//Set ballY to CENTER screen
		ballSpeedY = 1;
		ballSpeedX = -ballSpeedX;	//Flip Direction
	}

	//Redraw 'Everything' including Canvas every timeInterval
	function drawEverything(){
		console.log("x: " + ballX + "y: " + ballY);
		//Draw Objects via Helper Functions
		
		//Check if GameOver
		if(showingWinScreen){
			if(player1Score >= SCORE_LIMIT){
				canvasContent.fillText("Player 1 WINNER!",200,100);
			} else if (player2Score >= SCORE_LIMIT){
				canvasContent.fillText("COM WINNER!",550,100);
			}
			canvasContent.fillStyle = 'white';
			canvasContent.fillText("Click to Continue",375,300);
			return;
		}
		
		//Black Canvas Background
		colorRect(0,0,canvas.width, canvas.height, 'black');
		drawNet();
		//Creating Player 1 (Left Side)
		//Rect(x, y, xWidth, yHeight)
		colorRect(leftPaddleX, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'red'); 

		//Creating Player 2 (Right Side)
		colorRect(rightPaddleX, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'red');

		//Creating Ball Object
		//Cir(x, y, radius)
		colorCircle(ballX, ballY, BALL_RADIUS, 'white'); 

		//Score
		canvasContent.fillText("Player 1",60, 25);
		canvasContent.fillText(player1Score, 60, 50);
		canvasContent.fillText("COM", 700, 25);
		canvasContent.fillText(player2Score, 700, 50);
	}

	//Draw Dashed Net (at center) Helper Function
	function drawNet(){
		for(var i=0; i<canvas.height; i+=40){
			colorRect(canvas.width/2-1, i, 2, 20, 'white');
		}
	}

	//Draw Rectangle Helper Function
	function colorRect(x, y, width, height, drawColor){
		canvasContent.fillStyle = drawColor;
		canvasContent.fillRect(x, y, width, height);
	}		

	//Draw Circle Helper Function
	function colorCircle (centerX, centerY, radius, drawColor){
		canvasContent.fillStyle = drawColor;
		canvasContent.beginPath();
		canvasContent.arc(centerX,centerY,radius, 0,Math.PI*2, true);
		canvasContent.fill();
	}

	//Compuer AI Movement
	function computerMovement(){
		var rightPaddleYCenter = rightPaddleY + (PADDLE_HEIGHT/2);

		//If rightPaddle is higher than the ball, move down, else move up
		//If rightPaddle is within an appropiate Y range (20), no need to move
		if(rightPaddleYCenter < ballY - 25) {
			rightPaddleY += 8;
		} else if(rightPaddleYCenter > ballY + 25){
			rightPaddleY -= 7;
		}

	}
	//Move Functions
	function moveEverything(){
		ballX += ballSpeedX;	//Move Ball  ← →
		ballY += ballSpeedY;	//Move Ball  ↑ ↓

		//If ball reaches LEFT, Switch Directions
		if (ballX <= leftPaddleX + PADDLE_WIDTH + 3){
			///If ballY is between the top and bottom of the Paddle
			if (ballY > leftPaddleY && ballY < leftPaddleY + PADDLE_HEIGHT){	
				ballSpeedX = -ballSpeedX;

				var deltaY = ballY - (leftPaddleY + PADDLE_HEIGHT/2);	//Get the Difference of the ball and the CENTER of Paddle
				ballSpeedY = deltaY * 0.4;		
				//Balls Verticle Angle = Difference * 0.4
				//EX Ball Hits dead center, speedY = 0 * 0.4. 
				//speedY = 0: Ball will change direction but not angle.
				//Ball hits near bottom of Paddle, speed = 50 * 0.4
				//speedY = 20: Ball will aim down 20;
			} else if(ballX < 10){
				player2Score++;
				ballReset();	//Theres a chance for a bug where the ball is bounced back and forth inbetween the PADDLE_WIDTH
			}
		}

		//IF the ball reaches RIGHT, Switch Directions
		if (ballX > rightPaddleX + 3){
			//If the ballY is between the Top and Bottom of the Paddle
			if (ballY > rightPaddleY && ballY < rightPaddleY + PADDLE_HEIGHT){	
				ballSpeedX = -ballSpeedX;	//Switch Direction
				var deltaY = ballY - (rightPaddleY + PADDLE_HEIGHT/2);
				ballSpeedY = deltaY * 0.4;
			} else if(ballX > canvas.width){
				player1Score++;
				ballReset();
			}
		}

		//If ball reaches TOP, Switch Directions
		if (ballY < 0){
			ballSpeedY = -ballSpeedY;
		}

		//if ball reaches BOTTOM, Switch Directions
		if (ballY > canvas.height){
			ballSpeedY =- ballSpeedY;
		}
	}
