/*
Opdracht: JavaScript Game
Filename: game.html
@author: Pjotr Wisse (84669)
Date: 25/11/2020
*/
class Element {
	static disable(id) {
	  const element = document.getElementById(id);
	  element.disabled = !element.disabled;
	}
  
	static setZichtbaar(id, zichtbaar) {
		const element = document.getElementById(id);
		console.log(id);
		if (zichtbaar) {
			element.style.display = 'block';
		}
		else
			element.style.display = 'none';
	}
}

class MetOnzekerheid {
	constructor(van, tot) {
		this.van = van;
		this.tot = tot;
		this.listeners = [];
	}
	meet() {
		notify();
		return this.tot = this.van = Math.random(this.tot - this.van) + this.van;
	}
	beetjeWillekeurig() {
		this.van -= Math.random() * 10;
		this.tot += Math.random() * 10;
	}
	subscribe(listener) {
		this.listeners.push(listener);
		this.notify();
	}
	notify() {
		for (const listener of this.listeners)
			listener();
	}
	verhoog(snelheid) {
		this.van += snelheid.van;
		this.tot += snelheid.tot;
	}
}

const currencySymbol = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'EUR'
}).formatToParts(0)
  .find(part => part.type === 'currency').value;

//Zichtbaarwordt willekeurig opschuiven plus 3
//Onzekerheids marge.
//Toon de snelheid.
//Onzekerheid groot pijltje.
//Onzekerheid klein pijltje.

const startAlpha = 10; 
const width = 65;
const height = 25;
const lengte = width * 2 + height * 2;

/*Create a Javascript Object for a horse with 3 parameters: HTML ID, position x and y*/
function Horse(id){
	let number = parseInt(id.replace(/[\D]/g, '')); /*Number of horse, number will be 1 or 2 or 3 or 4*/

	let element = document.getElementById(id);/*HTML element of the horse*/
	let snelheidsLabel = document.getElementById("horse" + number + "Snelheid");

	
	let speed = new MetOnzekerheid(10, 20); /*Initiate a random speed for each horse, the greater speed, the faster horse. The value is between 10 and 20*/
	speed.subscribe(() => {
		snelheidsLabel.innerText = "Snelheid van horse " + id + " is: " + speed.van + " tot " + speed.tot;
	});
	let alpha = new MetOnzekerheid(startAlpha, startAlpha);
	alpha.subscribe(() => {
		if (this.alpha < width) {
			this.element.className = 'horse runRight';
			this.element.style.top = (this.number) +'vw';
			this.element.style.left = leftOffset + this.alpha +'vw';
			//Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
			if (this.lap == num_lap && this.alpha > startAlpha) {
				this.arrive();
				Element.changestyle(id);
				return;
			}
		} else if (this.alpha < width + height) {
			this.element.className = 'horse runDown';
			this.element.style.top = (this.number + (this.alpha - width)) +'vw';
			this.element.style.left = leftOffset + width +'vw';
		} else if (this.alpha < width + height + width) {
			this.element.className = 'horse runLeft';
			this.element.style.top = (this.number + height) +'vw';
			this.element.style.left = leftOffset + (width - (this.alpha - width - height)) +'vw';
		} else if (this.alpha < width + height + width + height) {
			this.element.className = 'horse runUp';
			if (this.alpha == width + height + width) {
				this.lap++;
			}
			this.element.style.top = (this.number + (height - (this.alpha - width - height - width))) +'vw';
			this.element.style.left = leftOffset + 'vw';
		} else this.alpha = 0;
	});
	let lap = 0; //Current lap of the horse

	return {
		id: id,
		move: function() {
			var horse = this;/*Assign horse to this object*/

			/*Use setTimeout to have the delay in moving the horse*/
			setTimeout(function(){
				const leftOffset = 10
				//Move the horse to right 1vw
				horse.zetStap();
				horse.move();
			}, 100);
		},

		zetStap: function() {
			this.alpha.verhoog(this.speed);	
		},

		/*Trigger the horse by run*/
		run: function(){
			this.element.className = 'horse runRight';
			this.move(); 
		},
		arrive: function(){
			//Stop the horse run by change class to standRight
			this.element.className = 'horse standRight';
			this.lap = 0;//Reset the lap

			/*Show the result*/
			var tds = document.querySelectorAll('#results .result');//Get all table cell to display the result
			//results.length is the current arrive position
			tds[results.length].className = 'result horse'+this.number;//The class of result look like: result horse1...

			//Push the horse number to results array, according the the results array, we know the order of race results
			results.push(this.number);

			//Win horse
			if (results.length == 1){
				//If win horse is the bet horse, then add the fund
				if (this.number == bethorse){
					funds += amount;
				}else{
					funds -= amount;
				}
				document.getElementById('funds').innerText = currencySymbol + funds;
			}else if (results.length == 4){
				//All horse arrived, enable again the Start Button
				Element.disable('start');
				Element.disable('pos');
				Element.disable('speed');
			}
		},
		setSpeed: function (speed_) {
			speed = speed_;
		},
		meetPositie: function() {
			alpha.meet();
			speed.beetjeWillekeurig();

		},
		meetSnelheid: function() {
			alpha.beetjeWillekeurig();
			speed.meet();
		},
	}
}

function setZichtbaarhiedHorses(zichtbaaar) {
	for (const horse of horses) {
		Element.setZichtbaar(horse.id, zichtbaaar);
		Element.setZichtbaar(horse.snelheidsLabel.id, zichtbaaar);
	}
	
}

var horse1 = new Horse('horse1');
var horse2 = new Horse('horse2');
var horse3 = new Horse('horse3');
var horse4 = new Horse('horse4');
var horses = [horse1, horse2, horse3, horse4];

var num_lap = 1, results = [], funds = 500, bethorse, amount, random;
//Start the function when the document loaded
document.addEventListener("DOMContentLoaded", function(event) {
	if(document.cookie !== ""){
		document.getElementById('email').value = document.cookie.split('=')[1];
		document.getElementById('password').value = document.cookie.split('=')[2];
	}
	document.getElementById('funds').innerText = currencySymbol + funds;
	Element.disable('pos');
	Element.disable('speed');

	//Event listener to the Start button
	document.getElementById('start').onclick = function(){
		// random = execute(document.getElementById("email").value, document.getElementById("password").value,'version 1.0\nqubits 2\nprep_z q[0]\nprep_z q[1]\nH q[0]\nCNOT q[0],q[1]\nmeasure q[0]\nmeasure q[1]', 10);
		amount = parseInt(document.getElementById('amount').value);
		num_lap = parseInt(document.getElementById('num_lap').value);
		bethorse = parseInt(document.getElementById('bethorse').value);

		if (funds < amount){
			alert('Not enough funds.');
		}
		else if (num_lap <= 0){
			alert('Number of lap must be greater than 1.');
		}else{

			/*Started the game*/
			this.disabled = true;/*Disable the start button*/
			setZichtbaarhiedHorses(false);
			Element.disable('pos');
			Element.disable('speed');
			document.getElementById('pos').onclick = function(){
				//Show the position

			}
			document.getElementById('speed').onclick = function(){
				//Show the Speed
			}
			var tds = document.querySelectorAll('#results .result');//Get all cells of result table.
			for (var i = 0; i < tds.length; i++) {
				tds[i].className = 'result';//Reset the result.
			}
			document.getElementById('funds').innerText = funds;
			results = [];//Results array is to save the horse numbers when the race is finished.
			

			horse1.run();
			horse2.run();
			horse3.run();
			horse4.run();
		}
	};

	document.getElementById('pos').onclick = () => {
		setZichtbaarhiedHorses(true);
		for (const horse of horses)
			horse.meetPositie();
	  };
	  document.getElementById('speed').onclick = () => {
		setZichtbaarhiedHorses(true);
		for (const horse of horses)
			horse.meetSnelheid();
	};
}
);

async function execute(email, password, code, shots) {
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
	const projectCreationResponse = await call("projects/", {
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
};