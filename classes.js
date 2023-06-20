class Button {  
	static enabled(id, visible) {
		let status = document.getElementById(id); //Reinitialization required for some reason.
		status.disabled = !visible;
		
		if (status.disabled) {
			status.setAttribute("disabled", visible);
		}
		
		else {
			status.removeAttribute("disabled");
		}
	}
}

class Uncertainty {
	listeners = [];

	constructor(from, to) {
		this.from = from;
		this.to = to;
	}

	update() {
		for (const listener of this.listeners) {
			listener();
		}
	}

	subscribe(set_listener) {
		this.listeners.push(set_listener);
		this.update();
	}
	
	measure() {
		this.update();
		this.from = parseFloat((Math.random() * 0.4).toFixed(2) + this.from)
		this.to = parseFloat((Math.random() * 0.4).toFixed(2) + this.from)
	}
}

const currencySymbol = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'EUR'
}).formatToParts(0)
  .find(part => part.type === 'currency').value;
  
let num_lap = 1;
  
function Horse(id, x, y) {
	this.status = document.getElementById(id);
	this.number = parseInt(id.replace("horse", "")) /*Horse number*/

	this.originX = x;
	this.originY = y;
	this.x = x;
	this.y = y;
	
	this.lap = 0;
	this.stop_horse = null;

	let speed_label = document.getElementById(id + "Speed");
	const uncertainty = new Uncertainty(0.1, 0.3);
	this.speed = (uncertainty.from + uncertainty.to) / 2;
	this.random_speed = Math.random();

	let on_measure = false;

	document.getElementById('measure').addEventListener('click', function() {
		on_measure = true;
	});

	document.getElementById('pos').addEventListener('click', function() {
		uncertainty.measure();
		this.speed = (uncertainty.from + uncertainty.to) / 2;
	});

	uncertainty.subscribe(() => {
		speed_label.innerText = "Speed for " + id + " is: " + uncertainty.from + " to " + uncertainty.to;
	});

	this.moveRight = function() {
		let horse = this;

		this.stop_horse = setTimeout(function() {
			if (on_measure) {
				uncertainty.measure();
				on_measure = false;
				horse.speed = (uncertainty.from + uncertainty.to) / 2;
			}

			else {
				horse.x += horse.speed;
			}

			horse.status.style.left = horse.x + 'vw';

			if (horse.lap == num_lap && horse.x > horse.originX + 6) {
				horse.arrive();
			}
			
			else {
				if (horse.x < 82.5 - horse.number * 2.5) {
					horse.moveRight();
				}
				
				else {
					horse.status.className = 'horse runDown';
					horse.moveDown();
				}
			}
		}, 16.67) //60 fps
	}

	this.moveDown = function() {
		let horse = this;

		this.stop_horse = setTimeout(function() {
			if (on_measure) {
				uncertainty.measure();
				on_measure = false;
				horse.speed = (uncertainty.from + uncertainty.to) / 2;
			}

			else {
				horse.y += horse.speed;
			}

			horse.status.style.top = horse.y + 'vh';

			if (horse.y < horse.originY + 65) {
				horse.moveDown();
			}
			
			else {
				horse.status.className = 'horse runLeft';
				horse.moveLeft();
			}
		}, 16.67) //60 fps
	}
	
	this.moveLeft = function() {
		let horse = this;

		this.stop_horse = setTimeout(function() {
			if (on_measure) {
				uncertainty.measure();
				on_measure = false;
				horse.speed = (uncertainty.from + uncertainty.to) / 2;
			}

			else {
				horse.x -= horse.speed;
			}

			horse.status.style.left = horse.x + 'vw';

			if (horse.x > 12.5 - horse.number * 2.5) {
				horse.moveLeft();
			}
			
			else {
				horse.status.className = 'horse runUp';
				horse.moveUp();
			}
		}, 16.67) //60 fps
	}

	this.moveUp = function() {
		let horse = this;

		this.stop_horse = setTimeout(function() {
			if (on_measure) {
				uncertainty.measure();
				on_measure = false;
				horse.speed = (uncertainty.from + uncertainty.to) / 2;
			}

			else {
				horse.y -= horse.speed;
			}

			horse.status.style.top = horse.y + 'vh';

			if (horse.y > horse.originY) {
				horse.moveUp();
			}
			
			else {
				horse.status.className = 'horse runRight';
				horse.lap++;
				horse.moveRight();
			}
		}, 16.67) //60 fps
	}

	this.run = function() {
		this.status.className = 'horse runRight';
		this.moveRight();
	}

	this.stop = function() {
		clearTimeout(this.stop_horse);
	}

	this.arrive = function() {
		//Stop the horse run by change class to standRight
		this.status.className = 'horse standRight';
		this.lap = 0;//Reset the lap

		/*Show the result*/
		var tds = document.querySelectorAll('#results .result');//Get all table cell to display the result
		//results.length is the current arrive position
		tds[results.length].className = 'result horse'+this.number;//The class of result look like: result horse1...

		//Push the horse number to results array, according the the results array, we know the order of race results
		results.push(this.number);

		if (results.length == 1) {
			if (this.number == bethorse) {
				funds += amount;
			}
			
			else {
				funds -= amount;
			}

			document.getElementById('funds').innerText = currencySymbol + funds;
		}
		
		else if (results.length == 4) {
			Button.enabled('start', true);
			Button.enabled('pos', false);
			Button.enabled('measure', false);
			setInvisibility(false);
		}
	}

	this.measurePosition = function() {
		uncertainty.measure();
	}
}

const horse1 = new Horse('horse1', 20, 4);
const horse2 = new Horse('horse2', 20, 8);
const horse3 = new Horse('horse3', 20, 12);
const horse4 = new Horse('horse4', 20, 16);

const horses = [horse1, horse2, horse3, horse4];
let results = [], funds = 500, bethorse, amount, random;

function setInvisibility(visibility) {
	let status = document.getElementById("measure"); //Variable have to be called status or else it throws error.

	for (const horse of Array.from(horses)) {
		if (visibility) {
			horse.status.style.display = "none"; //none
		}

		else {
			horse.status.style.display = "inline";
		}
	}
}
