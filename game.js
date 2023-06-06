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
  
	static changestyle(id) {
	  // const element = document.getElementById(id);
	  // element.style.display = element.style.display === 'none' ? 'block' : 'none';
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
	this.id = id;/*HTML ID of the horse*/
	this.element = document.getElementById(id);/*HTML element of the horse*/
	this.speed = Math.random()*10 + 10; /*Initiate a random speed for each horse, the greater speed, the faster horse. The value is between 10 and 20*/
	this.alpha = startAlpha;
	this.number = parseInt(id.replace(/[\D]/g, '')); /*Number of horse, number will be 1 or 2 or 3 or 4*/
	this.lap = 0; //Current lap of the horse

	this.move = function() {
		var horse = this;/*Assign horse to this object*/

		/*Use setTimeout to have the delay in moving the horse*/
		setTimeout(function(){
			const leftOffset = 10
			//Move the horse to right 1vw
			horse.alpha ++;
			if (horse.alpha < width) {
				horse.element.className = 'horse runRight';
				horse.element.style.top = (horse.number) +'vw';
				horse.element.style.left = leftOffset + horse.alpha +'vw';
				//Check if goes through the start line, if horse runs enough number of laps and has pass the start line then stop
				if (horse.lap == num_lap && horse.alpha > startAlpha) {
					horse.arrive();
					Element.changestyle(id);
					return;
				}
			} else if (horse.alpha < width + height) {
				horse.element.className = 'horse runDown';
				horse.element.style.top = (horse.number + (horse.alpha - width)) +'vw';
				horse.element.style.left = leftOffset + width +'vw';
			} else if (horse.alpha < width + height + width) {
				horse.element.className = 'horse runLeft';
				horse.element.style.top = (horse.number + height) +'vw';
				horse.element.style.left = leftOffset + (width - (horse.alpha - width - height)) +'vw';
			} else if (horse.alpha < width + height + width + height) {
				horse.element.className = 'horse runUp';
				if (horse.alpha == width + height + width) {
					horse.lap++;
				}
				horse.element.style.top = (horse.number + (height - (horse.alpha - width - height - width))) +'vw';
				horse.element.style.left = leftOffset + 'vw';
			} else horse.alpha = 0;
			horse.move();
		}, 1000/this.speed);
		/* 1000/this.speed is timeout time*/
	}

	/*Trigger the horse by run*/
	this.run = function(){
		this.element.className = 'horse runRight';
		this.move(); 
	}
	this.arrive = function(){
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
	}
	this.createArrow = function() {
		const arrow = document.createElement('div');
		arrow.className = 'arrow';
		arrow.style.width = `${this.speed}px`;
		arrow.style.transform = `translate(${this.x + 5}vw, ${this.y + 5}vh) rotate(-45deg)`;
		document.body.appendChild(arrow);
		this.arrow = arrow;
	  }
	
	  this.removeArrow = function() {
		if (this.arrow) {
		  document.body.removeChild(this.arrow);
		  this.arrow = null;
		}
	  }
}

var num_lap = 1, results = [], funds = 500, bethorse, amount;
//Start the function when the document loaded
document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('funds').innerText = currencySymbol + funds;
	Element.disable('pos');
	Element.disable('speed');

	//Event listener to the Start button
	document.getElementById('start').onclick = function(){
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
			var horse1 = new Horse('horse1');
			var horse2 = new Horse('horse2');
			var horse3 = new Horse('horse3');
			var horse4 = new Horse('horse4');
			Element.changestyle(horse1.id);
			Element.changestyle(horse2.id);
			Element.changestyle(horse3.id);
			Element.changestyle(horse4.id);

			horse1.run();
			horse2.run();
			horse3.run();
			horse4.run();
		}
	};

	document.getElementById('pos').onclick = () => {
		const horses = [horse1, horse2, horse3, horse4];
	
		horses.forEach((horse) => {
		  horse.createArrow();
		});
	
		setTimeout(() => {
		  horses.forEach((horse) => {
			horse.removeArrow();
		  });
		}, 1000);
	  };
	  document.getElementById('speed').onclick = () => {
		const horses = [horse1, horse2, horse3, horse4];
	
		horses.forEach((horse) => {
		  horse.createArrow();
		});
	
		setTimeout(() => {
		  horses.forEach((horse) => {
			horse.removeArrow();
		  });
		}, 1000);
	  };

});