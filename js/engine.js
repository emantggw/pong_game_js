/*




			



							++==	+==	   ==+	===+  ++===+    |
							||__	|  \  /	 |	 __|  ||   |  __+__		 
							||		|	\/	 |	|  |  ||   |	|
							++==	|		 |	+==+  ||   |	|___

									Created at 2019/8/16
										  PONG GAME


*/
var cs = document.getElementById("can");
var home = {
	main: document.getElementById("home"),
	playbtn: document.getElementById("playbtn")
}
var dim = {
	main: document.getElementById("dim"),
	bounce: document.getElementById("show-bounce")
};
var game_over = {
	main: document.getElementById("game_over"),
	playagainbtn: document.getElementById("playagainbtn")

}

/*
Modes for modal
1==>Fadein home modal{play, about, licince}
2==>Fadeout home 
3==>Fadein gameover and fading play-again/exit
4==>Fadeout 
0==>Playing do nothing
*/



function fade(opacity, mode) {
	var op = opacity / 1000 - modal.starttime / 1000;
	if (modal.mode == 1) {
		//Fadin home
		home.main.style.display = "block";
		home.main.style.opacity = op;
		home.playbtn.onclick = function () {
			modal.mode = 2;
			newgame();//Initialization new game
		}
	}
	if (modal.mode == 2) {
		//Fadeout home
		home.main.style.opacity = 1 - op;
		if (op >= 0.8)
			home.main.style.display = "none";
	}
	if (modal.mode == 3) {
		//Gameover is triggerd here after complited fading of gameover fadein
		game_over.main.style.display = "block";
		game_over.main.style.opacity = op;
		game_over.main.style.background = "rgb(20, 100, 150)";//Hit wall color
		if (op >= 0.6) {
			game.mode = -1;//Cleanup memory stop animation
		}
		game_over.playagainbtn.onclick = function () {
			modal.mode = 4;
			newgame();
		}
	}
	if (modal.mode == 4) {
		//Fadeout home
		game_over.main.style.opacity = 1 - op;
		if (op >= 0.8)
			game_over.main.style.display = "none";
	}
	if (modal.mode == 5) {
		//Fadeout home
		if (op >= 0.5) {
			//dim.main.style.display = "none";
			op = 1 - op;
		} else {
			dim.main.style.display = "block";
		}
		dim.bounce.style.background = "rgba(209,46,46," + op + ")";
	}


}

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');


function range(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function randColor() {
	var col = [[37, 218, 218], [37, 218, 37], [37, 37, 218], [224, 224, 31], [224, 31, 224], [224, 31, 31]];
	//return 'rgb('+Math.floor(Math.random()*1000%255)+','+Math.floor(Math.random()*1000%255)+','+Math.floor(Math.random()*1000%255)+')';
	var sel = col[Math.floor(Math.random() * col.length)];
	return 'rgb(' + sel[0] + ',' + sel[1] + ',' + sel[2] + ')';
}
function rotate(ax, rd) {
	var rt = {
		x: ax.x * Math.cos(rd) - ax.y * Math.sin(rd),
		y: ax.y * Math.cos(rd) + ax.x * Math.sin(rd)
	}
	return rt;
}
function getVertices(r, sides) {
	var ang = Math.PI * 2 / sides;
	var vert = [];
	var delta = -Math.PI / 4;//To make Normal rectangle
	for (var i = 0; i < sides; i++) {
		//console.log(Math.cos(i*ang)*r);
		var pt = { x: Math.cos(i * ang + delta) * r, y: Math.sin(i * ang + delta) * r };
		vert[i] = pt;
	}
	return vert;
}
function distanceBetween(pt1, pt2) {
	return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}
function isoTo2d(iso) {
	return { x: (2 * iso.y + iso.x), y: (2 * isoy - iso.x) / 2 };
}
function twToiso(car) {
	return { x: (car.x - car.y), y: (car.x + car.y) / 2 };
}

var modal = {
	fps: 20,
	timestep: 1000 / 20,
	starttime: 0,
	isset_start_time: false,
	dur: 1000,
	lastupdate: 0,
	mode: 1
};
var game = {
	fps: 60,//Normal Frame persecond
	timestep: 1000,
	lastupdate: 0,
	mode: 0,//Ready to start,
	dev: "Emant"
};

var Level = function () {
	//Initialization
	/*
		2D, Isometric view
	If we want to feel like 3d use isometric view, which makes better your game
	but one thing consider here is that, you can just transform simple 2D to isometric there is some concepts
	offcourse even actual matrix tiles is store in 2d but the way interacting to screen is isometric
	1.
		Convert the screen display coordinate to isometric
	2.
		Use the spirtes img which is aready in diamends shape, so it can fit
	3.	If you want to use the actual core canvas to fill colors and shape of your tiles level
		you have to work hard
	Example
	you can't just translate drawrect to isometric becuase it only let you specify starting vertices(1) and width and height
	beign with top-left of the screen
	so miss 3-vertices, without them you can't translate whole rectangle 
	*/
};

Level.prototype.init = function () {
	this.view = "2d";
	//This design is based upon isometric view
	//You can't just set width and hight of tiles by hand,
	//It's depend on the number of virtual radius you have given, large r >> large width and height
	this.virtualRadius = 20;
	//Get vertices coordinate 
	this.vert = getVertices(this.virtualRadius, 4);
	//Inorder to get acurate width and height(actually both are equal) we have to measure the distance between two vertices
	//We have to calculate the distance between two points which relay on x
	//at v3 and v0 ==> or v2==>v1 we can get width
	//Same manner to get height V3 and V2 or v0 and v1 distance
	this.tilewidth = distanceBetween(this.vert[this.vert.length - 1], this.vert[0]);
	this.tileheight = distanceBetween(this.vert[0], this.vert[1]);
	this.cols = 30;
	this.rows = 15;

	//At screen center position
	//Or you can leave, and by default start with top-left of screen position
	//==>2D center-obj this.x = innerWidth/2-(this.cols/2)*this.tilewidth;
	//==>2D center-obj this.y = innerHeight/2-(this.rows/2)*this.tileheight;
	//Iso center-obj

	if (this.view == "iso") {
		this.x = innerWidth / 2 - this.tilewidth / 2 * this.rows;
		this.y = 0;
		// this.x = innerWidth/2-(this.cols/2)*this.tileheight;
		// this.y = innerHeight/2-(this.rows*0.35)*this.tileheight;
	} else {
		this.x = innerWidth / 2 - (this.cols / 2) * this.tileheight;
		this.y = innerHeight / 2 - (this.rows * 0.35) * this.tileheight;
	}

	this.tiles = [];
	this.color = randColor();
	this.racketLength = 2;

	for (var i = 0; i < this.cols; i++) {
		this.tiles[i] = [];
		for (var j = 0; j < this.rows; j++) {

			/*
			First before building the walls and hole
			you assume first there is no hole everything wall,
			then the player at initailizing game then change which part is hole
			and it's racket position as wall
			*/
			this.tiles[i][j] = 0;//Set empty first tile

			if ((i == 0 || i == this.cols - 1) && j != 0 && j != this.rows - 1) {
				//will be modifed by player(replace by racket)
				this.tiles[i][j] = 1; //Left-side and right 
			}
			if (j == 0 || j == this.rows - 1) {
				this.tiles[i][j] = 2;//Upper wall and bottom 
			}

		}
	}
};
Level.prototype.draw = function () {
	for (var i = 0; i < this.cols; i++) {
		for (var j = 0; j < this.rows; j++) {
			switch (this.tiles[i][j]) {
				case 1:
					this.drawRect(i * this.tilewidth, j * this.tileheight, "fill", this.color);
					break;
				case 2:
					this.drawRect(i * this.tilewidth, j * this.tileheight, "fill", this.color);
					break;
				default:
					this.drawRect(i * this.tilewidth, j * this.tileheight, "stroke", "grey");
			}
			//Drawing mid
			if (i == this.cols / 2) {
				this.drawLine(i * this.tilewidth, j * this.tileheight, this.color);
			}

		}
	}
};
Level.prototype.drawLine = function (i, j, color) {
	//i=i*this.tilewidth
	//j=j*this.tilewidth
	//Starting from coordinat 3==>1
	c.lineWidth = 5;
	var pos_mv = { x: this.vert[3].x + i, y: this.vert[3].y + j };
	var pos_to = { x: this.vert[2].x + i, y: this.vert[2].y + j };
	//Checking view
	pos_mv = this.view == "iso" ? twToiso(pos_mv) : pos_mv;//Moveto
	pos_to = this.view == "iso" ? twToiso(pos_to) : pos_to;//Lineto

	c.beginPath();
	c.moveTo(this.x + pos_mv.x, this.y + pos_mv.y);
	c.lineTo(this.x + pos_to.x, this.y + pos_to.y);
	c.strokeStyle = color;
	c.stroke();//By default it's stroke not fill
	c.closePath();
}
Level.prototype.drawRect = function (i, j, mode, color) {
	c.lineWidth = 0.1;
	if (this.view == "2d") {
		c.beginPath();
		c.moveTo(this.x + this.vert[3].x + i, this.y + this.vert[3].y + j);
		for (var r = 0; r < this.vert.length; r++) {
			c.lineTo(this.x + this.vert[r].x + i, this.y + this.vert[r].y + j);
		}
		if (mode == "stroke") {
			c.strokeStyle = color;
			c.stroke();
		} else {
			c.fillStyle = color;
			c.fill();
		}
		c.closePath();
	}
	if (this.view == "iso") {
		c.beginPath();
		//Isometric x
		c.moveTo(this.x + twToiso(
			{ x: this.vert[3].x + i, y: this.vert[3].y + j }).x, this.y + twToiso(
				{ x: this.vert[3].x + i, y: this.vert[3].y + j }).y);
		for (var r = 0; r < this.vert.length; r++) {
			c.lineTo(this.x + twToiso(
				{ x: this.vert[r].x + i, y: this.vert[r].y + j }).x, this.y + twToiso(
					{ x: this.vert[r].x + i, y: this.vert[r].y + j }).y);
		}
		if (mode == "stroke") {
			c.strokeStyle = color;
			c.stroke();
		} else {
			c.fillStyle = color;
			c.fill();
		}
		c.closePath();
	}

};
Level.prototype.locateRacket = function (x, y) {
	var index = y > this.rows - 3 ? 12 : y < 2 ? 2 : y;
	for (var i = 0; i < level.rows; i++) {
		switch (i) {
			case index - 1:
			case index:
			case index + 1:
				level.tiles[x][i] = 1;
				break;
			default:
				level.tiles[x][i] = -1;
		}
	}

};

var PlayerRacket = function () {
	//Initialization
};
PlayerRacket.prototype.init = function () {

	//Wall-1 left-side
	//Modifed player-racket
	this.key = 0;
	this.x = 0;//At left side
	//Take the y-position from +row and max-row-4
	this.y = range(1, level.rows - 1);
	// Fill racket-position by setting col and row 3 upto it's racketlength
	// At same time fill the wall hole by setting -1
	level.locateRacket(this.x, this.y);
};
PlayerRacket.prototype.update = function () {
	if (this.y < 2) {
		this.y = 1;
	}
	if (this.y > level.rows - 1) {
		this.y = level.rows - level.racketLength;
	}
	level.locateRacket(this.x, this.y);
};
PlayerRacket.prototype.slider = function (keyName) {
	console.log(keyName);

	//Called only when key is down
	//Check the key is down or up key ony
	//Filtering key==>38 up 40=>down

	//adapting deprecated keycode
	if (keyName == "ArrowDown") {
		this.key = 1;
	}
	if (keyName == "ArrowUp") {
		this.key = -1;
	}

	//

	//Moving the racket
	if (this.y + this.key < level.rows - level.racketLength && this.y + this.key > 0) {
		this.y += this.key;
	}
	this.key = 0;//Relasing key

};

var AIRacket = function () {
	//Ini...
}
AIRacket.prototype.init = function () {
	//Modifed by machine
	this.x = level.cols - 1;//At right side
	this.y = range(1, level.rows - 2);
	this.simy = 0;
	this.lastypos = 0;
	this.movespeed = 0.1;//You can set slow down move speed to give advantage orver to player
	this.guess = false;

	level.locateRacket(this.x, this.y);

};

AIRacket.prototype.update = function (k) {
	//Simulating the current ball to it's racket
	//And decide by how match distance should slide it's racket
	var sim_ball = { x: ball.x, y: ball.y };//SImulating ball position
	//Get current ball_speed from it's pos
	var sim_ball_speed = { vx: ball.vx, vy: ball.vy };//Simulating distance

	if (this.guess && sim_ball.x < level.cols / 2) {
		this.guess = false;

		//After bouncing to player area 
	}
	if (level.cols / 2 <= sim_ball.x && !this.guess) {
		while (Math.round(sim_ball.x) < level.cols - 1) {
			//UNtill reaches the maximum cols
			if (level.tiles[Math.round(sim_ball.x + 0.5)][Math.round(sim_ball.y)] == -1) {
				break;
			}
			//Doing normal bouncing respecting to rows
			if (Math.round(sim_ball.y) < level.rows - 1 && Math.round(sim_ball.y) > 0) {
				//Avoid some errors
				if (level.tiles[Math.round(sim_ball.x)][Math.round(sim_ball.y + 0.5)] == 2 ||
					level.tiles[Math.round(sim_ball.x)][Math.round(sim_ball.y - 0.5)] == 2) {
					sim_ball_speed.vy = -sim_ball_speed.vy;
				}
			} else {
				sim_ball_speed.vy = -sim_ball_speed.vy;
			}

			sim_ball.x += sim_ball_speed.vx;
			sim_ball.y += sim_ball_speed.vy;
		}
		this.y = Math.round(sim_ball.y);
		this.guess = true;
	}

	if (this.guess && this.simy < this.y) {
		this.simy += this.movespeed;
	}
	if (this.guess && this.simy > this.y) {
		this.simy -= this.movespeed;
	}
	if (this.guess) {
		level.locateRacket(this.x, Math.round(this.simy));
	}
};

var Ball = function () {
	//Playing object

}
Ball.prototype.init = function () {
	this.x = 3;
	this.y = 3;
	this.r = level.tileheight / 2;
	this.vx = 0.15;
	this.vy = 0.05;
	this.game_over = false;
};
Ball.prototype.update = function () {

	//Ball logic 
	//Bounce back only it's get some block

	//Rounding to the nearest decimal cols and rows
	//Check the rounded num is actually lesthan max cols and rows 
	//To avoid some overflow effect
	//Make sure bouncing max this limit

	//
	if (modal.mode != 5) {
		if (Math.round(this.x) < level.cols - 1 && Math.round(this.x) > 0) {

			if (level.tiles[Math.round(this.x + 0.5)][Math.round(this.y)] == -1) {
				//AI score
				score.match.player1++;
				modal.mode = 5;
				this.vx = -this.vx;
			}
			if (level.tiles[Math.round(this.x - 0.5)][Math.round(this.y)] == -1) {
				//You score
				score.match.player2++;
				modal.mode = 5;
				this.vx = -this.vx;
			}
			if (level.tiles[Math.round(this.x + 0.5)][Math.round(this.y)] == 1 ||
				level.tiles[Math.round(this.x - 0.5)][Math.round(this.y)] == 1) {
				//Normal circumstance

				this.vx = -this.vx;
			}
		} else {
			this.vx = -this.vx;
		}

		if (Math.round(this.y) < level.rows - 1 && Math.round(this.y) > 0) {
			//Avoid some errors
			if (level.tiles[Math.round(this.x)][Math.round(this.y + 0.5)] == 2 ||
				level.tiles[Math.round(this.x)][Math.round(this.y - 0.5)] == 2) {
				this.vy = -this.vy;
			}
		} else {
			//Anyway if greater then toggele it's effect
			this.vy = -this.vy;
		}

		//Retrive which location bounce
		this.y += this.vy;
		this.x += this.vx;
	}

	this.draw();



};
Ball.prototype.draw = function () {
	//level.drawRect(this.x*level.tilewidth, this.y*level.tileheight, level.view, "fill", "red");
	var pos = { x: this.x * level.tilewidth, y: this.y * level.tileheight };//Get the center of tile by default
	if (level.view == "iso") {
		//Convert the object 2D coordinate to isometric view
		pos = twToiso(pos);
	}

	var gr = c.createRadialGradient(level.x + pos.x, level.y + pos.y, this.r, level.x + pos.x, level.x + pos.y, this.r);
	gr.addColorStop(0.0, level.color);
	gr.addColorStop(0.3, "#CCCCCC");
	gr.addColorStop(0.1, "#3E3E3E");
	gr.addColorStop(0.6, level.color);

	c.beginPath();
	c.fillStyle = gr;
	c.arc(level.x + pos.x, level.y + pos.y, this.r, 0, Math.PI * 2);
	c.fill();
	c.closePath();
	c.beginPath();


};

//======SCORE
var Score = function () {
	//Initialization
};
Score.prototype.init = function () {
	//Player-1-score
	this.x = { player1: level.cols / 2 - 3, player2: level.cols / 2 + 1 };
	this.y = { player1: level.rows / 5, player2: level.rows / 5 };
	this.match = { player1: 0, player2: 0 };
	this.font = "bold 36pt Impact";

};
Score.prototype.draw = function () {
	var pos1 = { x: this.x.player1 * level.tilewidth, y: this.y.player1 * level.tileheight };//Get the center of tile by default
	var pos2 = { x: this.x.player2 * level.tilewidth, y: this.y.player2 * level.tileheight };//Get the center of tile by default

	if (level.view == "iso") {
		//Convert the object 2D coordinate to isometric view
		pos1 = twToiso(pos1);
		pos2 = twToiso(pos2);
	}
	c.beginPath();
	c.font = this.font;
	c.fillStyle = level.color;
	c.fillText(this.match.player1, level.x + pos1.x, level.y + pos1.y);
	c.fillText(this.match.player2, level.x + pos2.x, level.y + pos2.y);
	c.closePath();
};

//FPS
var FPS = function () {
	//Initialization
	this.init();
};
FPS.prototype.init = function () {
	// body...
	this.x = innerWidth * 0.08;
	this.y = innerHeight * 0.8;
	this.lastupdate = 0.0;
	this.current_frames = 0;
	this.fps = 0;

};
FPS.prototype.draw = function () {

	c.fillStyle = "teal";
	c.beginPath();
	c.arc(this.x, this.y, 50, 0, Math.PI * 2, false);
	c.fill();
	c.closePath();

	c.fillStyle = "white";
	c.font = "bold 25pt TimesNewRoman";
	c.beginPath();
	c.fillText("FPS", this.x - 30, this.y - 52);
	c.fillText(Math.floor(this.fps), this.x - 8 * (Math.floor(this.fps) + "").length, this.y + 10);
	c.closePath();
};
//DEV
var Dev = function () {
	//Initialization
	this.init();
};
Dev.prototype.init = function () {
	// body...
	this.x = innerWidth * 0.85;
	this.y = innerHeight * 0.8;
}
Dev.prototype.draw = function () {
	c.fillStyle = "rgba(110,110, 34, 0.2)";
	c.font = "bold 35pt Impact";
	c.beginPath();
	c.fillText(game.dev, this.x, this.y);
	c.closePath();
};




var level = new Level();
var ball = new Ball();
var player = new PlayerRacket();
var machine = new AIRacket();
var score = new Score();
var fps = new FPS();
var dev = new Dev();
window.addEventListener("keydown", function (e) {
	player.slider(e.key);
});

function newgame() {
	keycode = 2;
	game.mode = 1;//Comman Start playing
	game.lastupdate = 0;
	level.init();
	player.init();
	machine.init();
	ball.init();
	score.init();
	main(0);//Starting main;

}

function main(timestamp) {
	c.clearRect(0, 0, innerWidth, innerHeight);

	if (timestamp - game.lastupdate >= game.timestep && game.mode == 1) {
		//Ineach timestep(5sec)
		//Change random speed vy
		ball.vy = ball.vy < 0 ? -range(5, 9) * 0.01 : range(5, 9) * 0.01; //TO make difficult to guess the machine
		game.lastupdate = timestamp;
	}

	if (game.mode == 1 || game.mode == -1 || game.mode == 3) {
		/*
		========NOTE====
		Snake draw and other drawing is running under normal circemstance
		which means they running 60fps, but only update snake address by specified fps,
		so the the snake draw function keep catch it's postion till update is called. One thing here is
		as i said we only want to limit snake speed not snake drawing or level, rat, score... thats why
		i let them to draw max fps
		=========
		*/
		//Show game grahic in playing and even faild also
		ball.update();
		level.draw();
		player.update();
		machine.update();
		score.draw();
		// snake.draw();
	}


	//User interacting
	if (modal.mode != 0 && timestamp - modal.lastupdate >= modal.timestep) {
		//Welcome 
		modal.starttime = modal.isset_start_time ? modal.starttime : timestamp;//Setting start time
		modal.isset_start_time = true;//Set in each iteration to keep start time
		fade(timestamp, modal.mode);//Call the method to fade/inout whatever modal
		modal.lastupdate = timestamp;//Save the last timestamp

		if (timestamp - modal.starttime > modal.dur) {
			//The timestamp reached the duration
			//Update keys
			modal.isset_start_time = false;
			modal.mode = 0;
		}
	}

	//Calculating and displaying FPS 
	if (timestamp > fps.lastupdate + 1000) {
		//Update every seconds
		fps.fps = 0.25 * fps.current_frames + (1 - 0.25) * fps.fps;
		//Compute FPS
		//save lastupdate
		fps.lastupdate = timestamp;
		//Set current to zero
		fps.current_frames = 0
	}
	fps.current_frames++;
	fps.draw();
	dev.draw();

	if (game.mode != -1) {
		// Only when the game is playing the main animation is looping
		// Otherwise to save system terminate it
		window.requestAnimationFrame(main);
	}
}
main(0);

