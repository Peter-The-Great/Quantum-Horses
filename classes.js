class Button {  
	static enabled(status, visible) {
	status = document.getElementById(status);	//Reinitialization required for some reason.
	  if (status.disabled == true) {
			status.disabled = visible;
	  }
		else {
			console.log(status.disabled);
			status.disabled = visible;
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
		this.from = Math.random(this.to - this.from) + this.from;
		this.to = Math.random(this.to) + this.to;
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
	const width = 65;
	const height = 25;
	let length = (width * 2) + (height * 2);

	let speed_label = document.getElementById(id + "Speed");
	let id_number = parseInt(id.replace("horse", "")) /*Horse number*/
	let speed = new Uncertainty(10, 20); /*Initiate a random speed for each horse, the greater speed, the faster horse. The value is 
	between 10 and 20*/
	let lap = 0; //Current lap of the horse

	speed.subscribe(() => {
		speed_label.innerText = "Speed for horse " + id + " is: " + speed.from + " to " + speed.to;
	});
	
	let alpha = new Uncertainty(start_alpha, start_alpha, id, id_number);
	let leftOffset = 8;

	alpha.subscribe(() => {
		//To right
		if (alpha.from < width) {
			status.className = 'horse runRight';
			status.style.left = leftOffset + alpha.from + 'vw';
			alpha.from += 0.3;

			//Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
			if (lap == num_lap && alpha > start_alpha) {
				this.arrive();
				return;
			}
		} 
		
		//To down
		else if (alpha.from > width) {
			status.className = 'horse runDown';
			status.style.top = alpha.to + 'vw';
			alpha.to += 0.3;

			console.log(alpha.to);
		} 
		
		//To left
		else if (alpha.from > width) {
			status.className = 'horse runLeft';
			status.style.left = (leftOffset + alpha.from) + 'vw';
			alpha.from -= 0.3;
		} 
		
		//To up
		else if (alpha.from < leftOffset) {
			status.className = 'horse runUp';
	
			if (alpha.from == width + height + width) {
				lap++;
			}

			status.style.top = (this.id_number + (height - (alpha.from - width - height - width))) + 'vw';
			alpha.to -= 0.3;
		} 
	
		else {
			this.alpha = 0;
			//alpha.from += 1;
			console.log(alpha.from);
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
			}, 100);
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

		arrive: function() {
			//Stop the horse run by change class to standRight
			this.status.className = 'horse standRight';
			this.lap = 0;//Reset the lap

			/*Show the result*/
			let tds = document.querySelectorAll('#results .result');//Get all table cell to display the result
			//results.length is the current arrive position
			tds[results.length].className = 'result horse'+this.number;//The class of result look like: result horse1...

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
			}
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
let results = [], funds = 500, bethorse, amount, random;

function setVisibilityHorses(visibility) {
	for (const horse of horses) {
		horse.status.style.visibility = visibility;
	}
}