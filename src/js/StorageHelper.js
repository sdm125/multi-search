class StorageHelper {
	static saveCurrentSearches(name) {
			let filteredSavedSearchValues = Search.searchValues.filter(searchValue => {
				if (searchValue.value.trim() !== '') {
					return searchValue;
				}
			});
				
			localStorage.setItem(name, JSON.stringify(filteredSavedSearchValues));
	}
	/**
	 * Update a saved search with the current search.
	 */
	static updateSavedSearch(name) {
		document.querySelector('.update-search-modal').classList.add('hide');
		document.querySelector('.update-search-validate-modal h5').innerText = `Update ${name} with current search?`;
		document.querySelector('.update-search-validate-modal').classList.remove('hide');

		document.getElementById('update-saved-search').addEventListener('click', function(){
			ModalControls.closeModal();
			StorageHelper.saveCurrentSearches(name);
		});
	}
	 
	static validateSaveCurrentSearch(name) {
		return localStorage.getItem(name) === null ? true : false;
	}

	static getAllSavedSearches() {
		let searchNames = Object.keys(localStorage);
		return searchNames.map(name => {
			return {name: name,  values: localStorage.getItem(name)};
		});
	}

	static getAllSavedSearchesListElm(storageUtility, title, closeModal) {
		let savedSearches = StorageHelper.getAllSavedSearches();
		let savedSearchListElm = document.createElement('ul');
		let savedSearchListItemTitle = document.createElement('h5');
		let savedSearchListItem = document.createElement('li');
		
		savedSearchListItemTitle.innerText = title;
		savedSearchListItem.appendChild(savedSearchListItemTitle);
		savedSearchListItem.classList += 'list-group-item text-center';
		savedSearchListElm.appendChild(savedSearchListItem)

		savedSearches.forEach(savedSearch => {
			savedSearchListItem = document.createElement('li');
			savedSearchListItem.classList.add('list-group-item');
			savedSearchListItem.innerText = savedSearch.name;

			savedSearchListItem.addEventListener('click', () => {
				storageUtility(savedSearch.name);
				if (closeModal)	ModalControls.closeModal();
			});

			savedSearchListElm.appendChild(savedSearchListItem);
		});

		return savedSearchListElm;
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