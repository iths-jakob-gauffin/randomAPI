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

function getOption() {
	selectElement = document.querySelector('.currency');
	let output = selectElement.options[selectElement.selectedIndex];
	getCurrencyName(output.innerHTML);
	let chosenCurrency = output.innerHTML;
	getBaseCurrency(chosenCurrency);
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
	}

	// let newP = document.createElement('p');
	// postListValue.appendChild(newP);
	// newP.innerHTML = exchangerate;

	// let stringifyObject = responseBody;
	// let stringifyResponseBody = JSON.stringify(stringifyObject);
	// for (let orderedResult of sortCurrencys(splitStringify(stringifyResponseBody, input))) {
	// 	let newP = document.createElement('p');
	// 	postListValue.appendChild(newP);
	// 	newP.innerHTML = orderedResult;
	// }
}

// function splitStringify(string, input) {
// 	let arr = [];
// 	let delim = ',';
// 	let temp = '';
// 	let i = 0;

// 	let quotationRemove = string.replace(/" /g, ' ');
// 	let quotationRemove2 = quotationRemove.replace(/"/g, ' ');
// 	let quotationRemove3 = quotationRemove2.replace(/ :/g, ' : ');
// 	let curlyBracketsRemove = quotationRemove3.replace(/}/g, ' ');
// 	let replacedString = curlyBracketsRemove.replace(/{ rates : {/g, '');

// 	for (i; i < replacedString.length - 34; i++) {
// 		if (replacedString[i] != delim) {
// 			temp += replacedString[i];
// 		} else {
// 			arr.push(temp);
// 			temp = '';
// 		}
// 	}
// 	let sortedAndBaseRemoved = removeBaseCurrency(arr, input);

// 	return sortedAndBaseRemoved;
// }

function removeBaseCurrency(array, base) {
	let arrayWithoutBase = [];
	for (currency of array) {
		if (!currency.startsWith(base)) {
			arrayWithoutBase.push(currency);
		}
	}
	return arrayWithoutBase;
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
