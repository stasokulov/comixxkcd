let lastPageNumber = '';
let currentPageNumber = '';
const previousPageButton = document.querySelector('[data-js-previous_button]');
const nextPageButton = document.querySelector('[data-js-next_button]');

setListeners();
getLastPageNumber();
choosePage();

function setListeners() {
	previousPageButton.addEventListener('click', showPreviousPage);
	nextPageButton.addEventListener('click', showNextPage);
}

function getLastPageNumber() {
	getComixData()
	.then(lastPageData => {return lastPageData.num})
	.then(num => {lastPageNumber = num})
};

function choosePage() {
	// Берем хэш из url и отрезаем от него первый символ, который решетка.
	const hash = window.location.hash.slice(1);
	// Если оставшийся хэш есть и он число, то показываем страницу с номером равным хэшу. Если нет, то последнюю страницу.
	hash ?? typeof hash === 'number' ? showPage(hash) : showLastPage();
};

function showPage(pageNumber) {
	getComixData(pageNumber)
	.then(pageData => {
		console.log(pageData);
		fillPage(pageData);
		currentPageNumber >= lastPageNumber ? disableNextButton() : activateNextButton();
		setHash();
	});
};

function showLastPage() {
	showPage();
}

function getComixData(pageNumber) {
	// Прокси-сервер для обхода CORS.
	const proxy = 'https://api.allorigins.win/get';
	// Собираем url страницы комикса из неизменной части ссылки и номера страницы.
	let url;
	pageNumber ? url = `http://xkcd.com/${pageNumber}/info.0.json` : url = `http://xkcd.com/info.0.json`;
	// Склеиваем адрес прокси и url страницы комикса по правилам сервиса https://allorigins.win/
	const urlWithProxy = `${proxy}?url=${encodeURIComponent(url)}`;
	
	return fetch(urlWithProxy)
	.then(response => {
		if (response.ok) return response.json() // Этот json содержит как данные комикса, так и прокси.
		throw new Error('Что-то пошло не так')
	})
	.then(json => {return json.contents}) // Возвращаем только данные комикса.
	.then(jsonContents => {
		const pageObj = JSON.parse(jsonContents); // Преобразуем в объект.
		currentPageNumber = pageObj.num;
		return(pageObj);
	});
};

function fillPage(pageData) {
	const dateHTML = document.querySelector('.comix__date');
	const titleHTML = document.querySelector('.comix__title');
	const imgHTML = document.querySelector('.comix__img');
	const transcriptHTML = document.querySelector('.comix__transcript-text');

	const date = `${pageData.day}-${pageData.month}-${pageData.year}`

	dateHTML.innerHTML = date;
	titleHTML.innerHTML = pageData.title;
	imgHTML.src = pageData.img;
	transcriptHTML.innerHTML = pageData.transcript;
}

function showPreviousPage() {
	showPage(currentPageNumber - 1);
}

function showNextPage() {
	showPage(currentPageNumber + 1);
}

function disableNextButton() {
	nextPageButton.classList.add('comix__button_disable')
}

function activateNextButton() {
	nextPageButton.classList.remove('comix__button_disable')
}

function setHash() {
	window.location.hash = currentPageNumber;
}