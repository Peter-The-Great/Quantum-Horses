class Button {  
	static enabled(id, visible) {
		let status = document.getElementById(id);	//Reinitialization required for some reason.
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
	constructor(from, to, id, id_number) {
		this.from = from;
		this.to = to;
		this.id = id;
		this.id_number = id_number;
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
		this.from = Math.round(Math.random(this.to - this.from)) + this.from;
		this.to = Math.round(Math.random(this.to)) + this.to;
	}

	randomMeasure() {
		this.update();
		this.from -= Math.random() * 10;
		this.to += Math.random() * 10;
	}
	
	increase(speed) {
		this.from += speed.from;
		this.to += speed.to;
	}
}

const currencySymbol = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'EUR'
}).formatToParts(0)
  .find(part => part.type === 'currency').value;

let num_lap;

function Horse(id) {
	let status = document.getElementById(id);
	const start_alpha = 10;
	const width = 66.5;
	const height = 35;
	let length = (width * 2) + (height * 2);

	let speed_label = document.getElementById(id + "Speed");
	let number = parseInt(id.replace("horse", "")) /*Horse number*/
	let speed = new Uncertainty(10, 20); /*Initiate a random speed for each horse, the greater speed, the faster horse. The value is 
	between 10 and 20*/
	let lap = 0;

	speed.subscribe(() => {
		speed_label.innerText = "Speed for horse " + id + " is: " + speed.from + " to " + speed.to;
	});
	
	let alpha = new Uncertainty(start_alpha, start_alpha, id, number);
	let leftOffset = 11;
	let to_right = true;
	let to_down = true;

	let pos = 0;

	function arrive(numbering) {
		//Stop the horse run by change class to standRight
		this.status.className = 'horse standRight';
		this.lap = 0;//Reset the lap

		let res = 'result horse' + numbering;
		/*Show the result*/
		//results.length is the current arrive position
		document.querySelectorAll('#results .result')[results.length].className.replace("result", res); //The class of result look like: result horse1...

		//Push the horse number to results array, according the the results array, we know the order of race results
		results.push(this.number);

		//Win horse
		if (results.length == 1) {
			//If win horse is the bet horse, then add the fund
			if (this.number == bethorse) {
				funds += amount;
			}
			
			else {
				funds -= amount;
			}
			
			document.getElementById('funds').innerText = currencySymbol + funds;
		}
		
		else if (results.length == 4) {
			//All horse arrived, enable again the Start Button
			Button.enabled("start", true);
			Button.enabled("pos", false);
			Button.enabled("measure", false);
		}
	}

	alpha.subscribe(() => {
		if (to_right && alpha.from <= width) {
			status.className = 'horse runRight';
			status.style.left = leftOffset + alpha.from + "vw";
			alpha.from += 0.25;

			//Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
			if (lap >= num_lap && leftOffset + alpha.from + 40) {
				console.log("Horse " + id + " has arrived");
				arrive(id);
				return;
			}

			return;
		}

		if (to_down && alpha.to <= height) {
			to_right = false;
			status.className = 'horse runDown';
  			status.style.top = alpha.to + "vw";
			alpha.to += 0.25;
			return;
		} 
		
		if (alpha.from >= pos - leftOffset / 3) {
			to_down = false;
			status.className = 'horse runLeft';
			status.style.left = leftOffset + alpha.from + "vw";
			alpha.from -= 0.25;
			return;
		}		  

		if (alpha.to >= start_alpha - leftOffset / 3) {
			status.className = 'horse runUp';
			
			if (alpha.to == width / start_alpha - 0.15) {
				lap++;
			}

			status.style.top = alpha.to + "vw";
			alpha.to -= 0.25;

			return;
		}

		//Reset the lap
		if (alpha.from <= start_alpha) {
			to_right = true;
			to_down = true;
			alpha.from = pos;
			alpha.to = pos + leftOffset;
			return;
		}
	});

	return {
		status, status,
		alpha: alpha,

		move: function() {
			let horse = this; /*Assign horse to this object*/

			setTimeout(() => {
				//Move the horse to right 1vw
				horse.step();

				if (horse.alpha < length) {
					horse.step(); //If the horse is not arrived, then continue to move
				}
				
				else if (horse.alpha >= length) {
					horse.arrive(); //If the horse is arrive, then stop
				}

				
			}, 25);
		},

		step: function() {
			this.alpha.increase(speed);

			setInterval(() => {
				this.alpha.subscribe(() => {});
			}, 25);
		},

		/*Trigger the horse by run*/
		run: function() {
			this.status.className = 'horse runRight';
			this.move(); 
		},

		setSpeed: function(speed_) {
			speed = speed_;
		},

		measurePosition: function() {
			alpha.measure();
			speed.randomMeasure();
		},

		measureSpeed: function() {
			alpha.randomMeasure();
			speed.measure();
		},
	}
}

const horse1 = new Horse("horse1");
const horse2 = new Horse("horse2");
const horse3 = new Horse("horse3");
const horse4 = new Horse("horse4");

const horses = [horse1, horse2, horse3, horse4];
var results = [], funds = 500, bethorse, amount, random;

function setInvisibility(visibility) {
	let status = document.getElementById("measure"); //Variable have to be called status or else it throws error.

	for (const horse of Array.from(horses)) {
		if (visibility) {
			horse.status.style.display = "none";
		}

		else {
			horse.status.style.display = "inline";
		}
	}
}
