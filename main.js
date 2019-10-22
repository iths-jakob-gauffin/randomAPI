//CSS-styrning
function switchBorder() {
	let switchBorderRadius = document.querySelector('.container');
	switchBorderRadius.classList.add('switch');
	switchBorderRadius.classList.remove('container');
}

function displayNone() {
	let outputDisplayNone = document.querySelector('.output');
	outputDisplayNone.style.display = 'block';
	let rightDisplayNone = document.querySelector('.right');
	rightDisplayNone.style.display = 'block';
}

//API-relaterat
let submitButton = document.querySelector('.exchangeButton');
let postListValue = document.querySelector('.right');
let selectPlace = document.querySelector('.currency');
let chosenCurrencyPlace = document.querySelector('.output');
let comparisonPlace = document.querySelector('.comparison');

function fillSecondOptionList(array) {
	let abbreviation = [];
	for (let element of array) {
		let otherOption = document.createElement('option');
		comparisonPlace.appendChild(otherOption);
		otherOption.innerHTML = threeFirstLetters(element);

		console.log('Här är elementen: ' + element);
		abbreviation.push(threeFirstLetters(element));
	}
	console.log('Abbreviation ' + abbreviation + 'med längd: ' + abbreviation.length);
}

function threeFirstLetters(input) {
	let threeFirstLetters = '';

	for (let i = 0; i < 3; i++) {
		threeFirstLetters += input[i];
	}
	return threeFirstLetters;
}

function removeBaseCurrency(array, base) {
	let arrayWithoutBase = [];
	for (currency of array) {
		if (!currency.startsWith(base)) {
			arrayWithoutBase.push(currency);
		}
	}
	return arrayWithoutBase;
}
async function getBaseCurrency(input) {
	console.log('MAKING BASE CURRENCY REQUEST');
	let response = await fetch('https://api.exchangeratesapi.io/latest?base=' + input);
	console.log('BASE CURRENCY REQUEST FINISHED');
	let responseBody = await response.json();
	let optionList = postListValue.querySelectorAll('li');
	for (let option of optionList) {
		option.remove();
	}
	console.log(Object.entries(responseBody.rates));
	let exchangeRateArray = [];
	for (let rate of Object.entries(responseBody.rates)) {
		console.log(rate[0] + ' : ' + rate[1]);
		let exchangeRate = rate[0] + ' : ' + rate[1];
		exchangeRateArray.push(exchangeRate);
	}
	console.log('Exchangerate: ' + exchangeRateArray);
	let removedBase = removeBaseCurrency(exchangeRateArray, input);
	console.log('Rem : ' + removedBase);
	let sortedExchange = sortCurrencys(removedBase);
	console.log(sortedExchange);

	for (let basedAndSorted of sortedExchange) {
		let newListElement = document.createElement('li');
		postListValue.appendChild(newListElement);
		newListElement.innerHTML = basedAndSorted;
		newListElement.className = threeFirstLetters(basedAndSorted);
	}
	fillSecondOptionList(sortedExchange);
}

async function getCurrencyName(chosenInnerHTML) {
	console.log('MAKING NAME REQUEST');
	let response = await fetch('https://openexchangerates.org/api/currencies.json');
	console.log('NAME REQUEST FINISHED');
	let responseBody = await response.json();
	let currencyName = '';
	for (currencyShortenings of Object.keys(responseBody)) {
		console.log(currencyShortenings);
		if (currencyShortenings.startsWith(chosenInnerHTML)) {
			currencyName = responseBody[currencyShortenings];
			break;
		}
	}
	chosenCurrencyPlace.innerHTML = 'Exchange rates per ' + chosenInnerHTML + ', ' + currencyName + ':';
	return currencyName;
}

function getOption() {
	selectElement = document.querySelector('.currency');
	let output = selectElement.options[selectElement.selectedIndex];
	getCurrencyName(output.innerHTML);
	let chosenCurrency = output.innerHTML;
	getBaseCurrency(chosenCurrency);
}

function sortCurrencys(unsortedKeys) {
	return unsortedKeys.sort();
}

async function getCurrencysInOptionsList(input) {
	console.log('MAKING REQUEST');
	let response = await fetch('https://api.exchangeratesapi.io/latest');
	console.log('REQUEST FINISIHED');
	let responseBody = await response.json();
	let test = Object.keys(responseBody.rates);
	let eur = 'EUR';
	test.push(eur);
	test = sortCurrencys(test);
	for (let currencyName of Object(test)) {
		let newOption = document.createElement('option');
		selectPlace.appendChild(newOption);
		newOption.innerHTML = currencyName;
	}
}

getCurrencysInOptionsList();
