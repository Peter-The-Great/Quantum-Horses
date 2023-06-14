/*
Opdracht: JavaScript Game
Filename: game.html
@author: Pjotr Wisse (84669)
Date: 25/11/2020
*/
let button_start = document.getElementById("start");
let button_pos = document.getElementById("pos");
let button_speed = document.getElementById("speed");

const start = String(button_start).replace(button_start, "start");
const pos = String(button_pos).replace(button_pos, "pos");
const speed = String(button_speed).replace(button_speed, "speed");

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

function setVisibilityHorses(visibility) {
	for (const horse of horses) {
		//Button.enabled(horse.id, visibility);
		//Button.enabled(horse.id + "Speed", visibility);
	}
}

const horse1 = new Horse("horse1");
const horse2 = new Horse("horse2");
const horse3 = new Horse("horse3");
const horse4 = new Horse("horse4");

const horses = [horse1, horse2, horse3, horse4];
let results = [], funds = 500, bethorse, amount, random;

document.addEventListener("DOMContentLoaded", function() {
	Button.enabled(start, true);
	Button.enabled(pos, false);
	Button.enabled(speed, false);

	if (document.cookie !== "") {
		document.getElementById('email').value = document.cookie.split('=')[1];
		document.getElementById('password').value = document.cookie.split('=')[2];
	}

	document.getElementById('funds').innerText = currencySymbol + funds;

	document.getElementById(start).onclick = function() {
		Button.enabled(start, false);
		Button.enabled(pos, true);
		Button.enabled(speed, true);

		for (const horse of horses) {
			horse.alpha.subscribe(() => {});
		} 

		// random = execute(document.getElementById("email").value, document.getElementById("password").value,'version 1.0\nqubits 2\nprep_z q[0]\nprep_z q[1]\nH q[0]\nCNOT q[0],q[1]\nmeasure q[0]\nmeasure q[1]', 10);
		amount = parseInt(document.getElementById('amount').value);
		num_lap = parseInt(document.getElementById('num_lap').value);
		bethorse = parseInt(document.getElementById('bethorse').value);

		if (funds < amount) {
			alert('Not enough funds.');
		}

		else if (num_lap <= 0) {
			alert('Number of lap must be greater than 1.');
		}
		
		else {
			setVisibilityHorses(false);

			document.getElementById(pos).onclick = function() {
				Button.enabled(pos, false);
				Button.enabled(speed, true);

				//Show the position of the horse
				for (const horse of horses) {
					horse.measurePosition() 
				}			
			}

			document.getElementById(speed).onclick = function() {
				Button.enabled(pos, true);
				Button.enabled(speed, false);

				//Show the Speed
				for (const horse of horses) {
					horse.measureSpeed();
				}

				this.disabled = true;
			}

			const tds = document.querySelectorAll('#results .result');

			for (let i = 0; i < tds.length; i++) {
				tds[i].className = 'result'; //Reset the result.
			}

			document.getElementById('funds').innerText = funds;
			results = [];//Results array is to save the horse numbers when the race is finished.

			for (const horse of horses) {
				horse.run();
			}
		}
	};

	document.getElementById(pos).onclick = () => {
		setVisibilityHorses(true);

		for (const horse of horses) {
			horse.measurePosition();
		}
	};

	document.getElementById(speed).onclick = () => {
		setVisibilityHorses(true);

		for (const horse of horses) {
			horse.measureSpeed();
		}
	};
});

/*async function execute(email, password, code, shots) {
	const now = new Date();
	const expirationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
	document.cookie = `email=${email}; password=${password}; expires=${expirationDate.toUTCString()}; path=/`;
	const URL = 'https://api.quantum-inspire.com/';
	document.cookie = `email=${email};expires=${expirationDate.toUTCString()};path=/`;
	const call = async (url, data) => {
	  const response = await fetch(URL + url, {
		headers: {
			Authorization: `Basic ${btoa(`${email}:${password}`)}`,
			...(data === undefined ? undefined : {
				"Content-Type": "application/json"
			}),
		},
		...(data === undefined ? undefined : {
			body: JSON.stringify(data)
		}),
		method: data === undefined ? "GET" : "POST"
	  });
	  if (response.status==401) throw new Error("Wrong email or password!");
	  if (!response.ok) throw new Error();
	  return await (response.json());
	}
	const projectCreationResponse = await call("PaardenProject/", {
		name: "generatedProject",
		backend_type: "https://api.quantum-inspire.com/backendtypes/1/",
		default_number_of_shots: shots
	});
	const projectUrl = projectCreationResponse.url;
	console.log(`A project was created at: ${projectUrl}`);
	const assetCreationResponse = await call("assets/", {
		name: "generatedAsset",
		project: projectUrl,
		contentType: "text/plain",
		content: code
	});
	const assetUrl = assetCreationResponse.url;
	console.log(`An asset was created at: ${assetUrl}`);
	const jobCreationResponse = await call("jobs/", {
		name: "generatedJob",
		input: assetUrl,
		backend_type: "https://api.quantum-inspire.com/backendtypes/1/",
		number_of_shots: shots
	});
	const jobId = jobCreationResponse.id;
	console.log(`A job was created with id: ${jobId}`);
	console.log(`We now wait for completion...`);
	let status = "WAITING";
	while (status != "COMPLETE") {
		await new Promise(res => setTimeout(res, 1000));
		const jobReadResponse = await call(`jobs/${jobId}/`);
		status = jobReadResponse.status;
		console.log(`Current status: ${status}`);
	}
	const resultResponse = await call(`jobs/${jobId}/result/`);
	console.log(`Retrieving data at: ${resultResponse.raw_data_url}`);
	return await call(`${resultResponse.raw_data_url.substring(URL.length)}?format=json`);
};*/
