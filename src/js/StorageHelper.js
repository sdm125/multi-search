class StorageHelper {
	static saveCurrentSearches(name) {
			localStorage.setItem(name, JSON.stringify(Search.searchValues));
	}

	static validateSaveCurrentSearch(name) {
		if (localStorage.getItem(name) === null) {
			return true;
		}
		else {
			return false;
		}
	}

	static getAllSavedSearches() {
		let searchNames = Object.keys(localStorage);
		let savedSearches = [];
		searchNames.forEach(name => savedSearches.push({name: name,  values: localStorage.getItem(name)}));
		return savedSearches;
	}

	static loadSavedSearch(id) {
		let searches = JSON.parse(localStorage.getItem(id));

		InputGroup.inputGroups.forEach(ip => ip.remove());

		searches.forEach(search => {
			Search.addInputGroup(search.name, search.value);
		});

		Search.updateCombineDropDown();
	}

	static getStoredSearchDropDown() {
		let li;
		let storedSearchDropDownList = document.createElement('ul');

		for (let search in localStorage) {
			if (localStorage.hasOwnProperty(search)) {
				li = document.createElement('li');
				li.setAttribute('data-search-id', search);
				li.classList.add('saved-search-item');
				li.classList.add('js-load-search');
				li.innerText = search;
				li.setAttribute('data-saved-search-id', search);
				storedSearchDropDownList.appendChild(li);
			}
		}

		return storedSearchDropDownList;
	}
}