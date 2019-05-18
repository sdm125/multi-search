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
		let savedSearchListItemName;
		let savedSearchListValuesElm;
		let savedSearchListValueElm;
		let expandSavedSearch;
		
		savedSearchListItemTitle.innerText = title;
		savedSearchListItem.appendChild(savedSearchListItemTitle);
		savedSearchListItem.classList += 'list-group-item text-center';
		savedSearchListElm.appendChild(savedSearchListItem);

		savedSearches.forEach(savedSearch => {
			savedSearchListValuesElm = document.createElement('ul');
			savedSearchListValuesElm.classList.add('list-group');
			expandSavedSearch = document.createElement('img');
			expandSavedSearch.src = 'icons/plus.svg';
			expandSavedSearch.classList.add('expand-saved-search');
			savedSearchListItem = document.createElement('li');
			savedSearchListItem.classList.add('list-group-item');
			savedSearchListItem.appendChild(expandSavedSearch);
			savedSearchListItemName = document.createTextNode(savedSearch.name);
			savedSearchListItem.appendChild(savedSearchListItemName);

			savedSearchListValuesElm.classList.add('hide');

			expandSavedSearch.addEventListener('click', function() {
				if(this.nextElementSibling.classList.contains('hide')) {
					this.nextElementSibling.classList.remove('hide');
				}
				else {
					this.nextElementSibling.classList.add('hide');
				}
			});
			
			JSON.parse(savedSearch.values).forEach(searchValue => {
				savedSearchListValueElm = document.createElement('li');
				savedSearchListValueElm.classList.add('list-group-item');
				savedSearchListValueElm.innerText = searchValue.value;
				savedSearchListValuesElm.appendChild(savedSearchListValueElm);
			});

			savedSearchListItem.addEventListener('click', function(e) {
				if (!e.target.classList.contains('expand-saved-search')) {
					storageUtility(savedSearch.name);
					if (closeModal)	ModalControls.closeModal();
				}
			});

			savedSearchListItem.appendChild(savedSearchListValuesElm);
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