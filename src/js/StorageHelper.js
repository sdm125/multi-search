class StorageHelper {
	static saveCurrentSearches(name) {
		let filteredSavedSearchValues = Search.searchValues.filter(searchValue => {
			return searchValue.value !== '';
		});

		localStorage.setItem(name, JSON.stringify(filteredSavedSearchValues));

		if (window.location.pathname === '/') {
			if (document.querySelector('.saved-search-list-main-wrapper').classList.contains('hide')) {
				document.querySelector('.saved-search-list-main-wrapper').classList.remove('hide');
			}
			if (document.querySelector('.saved-search-list-main ul')) {
				document.querySelector('.saved-search-list-main ul').remove();
			}
			document.querySelector('.saved-search-list-main').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch, 'Saved Searches', false));
		}
	}

	/**
	 * Update a saved search with the current search.
	 */
	static updateSavedSearch(name) {
		document.querySelector('.update-search-modal').classList.add('hide');
		document.querySelector('.update-search-validate-modal h5').innerText = `Update ${name} with current search?`;
		document.querySelector('.update-search-validate-modal').classList.remove('hide');

		document.getElementById('update-saved-search').addEventListener('click', () => {
			ModalControls.closeModal();
			StorageHelper.saveCurrentSearches(name);
		});

		if (window.location.pathname === '/') {
			document.querySelector('.saved-search-list-main ul').remove();
			document.querySelector('.saved-search-list-main').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch, 'Saved Searches', false));
		}
	}

	static validateSaveCurrentSearch(name) {
		return localStorage.getItem(name) === null ? true : false;
	}

	static getAllSavedSearches() {
		let searchNames = Object.keys(localStorage);
		return searchNames.filter(name => name !== 'settings').map(name => {
			return {name: name,  values: localStorage.getItem(name)};
		});
	}

	static getAllSavedSearchesListElm(storageUtility, title, closeModal) {
		let savedSearches = this.getAllSavedSearches();
		let savedSearchListElm = document.createElement('ul');
		let savedSearchListItemTitle = document.createElement('h5');
		let savedSearchListItem = document.createElement('li');
		let savedSearchListItemName;
		let savedSearchListValuesElm;
		let savedSearchListValueElm;
		let expandSavedSearch;
		let deleteSavedSearch;
		
		savedSearchListItemTitle.innerText = title;
		savedSearchListItemTitle.classList.add('mb-0');
		savedSearchListItem.appendChild(savedSearchListItemTitle);
		savedSearchListItem.classList += 'list-group-item text-center';
		savedSearchListElm.appendChild(savedSearchListItem);

		savedSearches.forEach(savedSearch => {
			savedSearchListValuesElm = document.createElement('ul');
			savedSearchListValuesElm.classList.add('list-group');

			expandSavedSearch = document.createElement('img');
			expandSavedSearch.src = 'icons/plus.svg';
			expandSavedSearch.classList.add('expand-saved-search');

			deleteSavedSearch = document.createElement('img');
			deleteSavedSearch.src = 'icons/trash-2.svg';
			deleteSavedSearch.classList += 'float-right open-delete-modal';
			deleteSavedSearch.setAttribute('data-search-name', savedSearch.name);

			savedSearchListItem = document.createElement('li');
			savedSearchListItem.classList.add('list-group-item');
			savedSearchListItem.classList.add('clearfix');
			savedSearchListItem.appendChild(expandSavedSearch);
			savedSearchListItemName = document.createTextNode(savedSearch.name);
			savedSearchListItem.appendChild(savedSearchListItemName);
			savedSearchListItem.appendChild(deleteSavedSearch);

			savedSearchListValuesElm.classList.add('hide');

			expandSavedSearch.addEventListener('click', function() {
				if(this.nextElementSibling.nextElementSibling.classList.contains('hide')) {
					this.nextElementSibling.nextElementSibling.classList.remove('hide');
				}
				else {
					this.nextElementSibling.nextElementSibling.classList.add('hide');
				}
			});

			deleteSavedSearch.addEventListener('click', function() {
				ModalControls.showModal('delete');
				document.querySelector('.delete-search-modal h5').innerText = `Are you sure you want to delete ${savedSearch.name}?`;
				document.querySelector('#delete-saved-search').addEventListener('click', () => {
					StorageHelper.deleteSavedSearch(savedSearch.name);
					ModalControls.closeModal();
					this.closest('li').remove();

					if (document.querySelector('.saved-search-list-main')) {
						if (window.location.pathname === '/') {
							document.querySelector('.saved-search-list-main ul').remove();
							document.querySelector('.saved-search-list-main').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch, 'Saved Searches', false));
						}

						// Hide saved save list div from index if there are no saved searches
						if (StorageHelper.getAllSavedSearches().length === 0) {
							document.querySelector('.saved-search-list-main-wrapper').classList.add('hide');
						}
					}
				});
			});
			
			JSON.parse(savedSearch.values).forEach(searchValue => {
				savedSearchListValueElm = document.createElement('li');
				savedSearchListValueElm.classList.add('list-group-item');
				savedSearchListValueElm.innerText = searchValue.value;
				savedSearchListValuesElm.appendChild(savedSearchListValueElm);
			});

			savedSearchListItem.addEventListener('click', function(e) {
				if (!e.target.classList.contains('expand-saved-search') && !e.target.classList.contains('open-delete-modal')) {
					storageUtility(savedSearch.name);
					if (closeModal) ModalControls.closeModal();
				}
			});

			savedSearchListItem.appendChild(savedSearchListValuesElm);
			savedSearchListElm.appendChild(savedSearchListItem);
		});

		return savedSearchListElm;
	}

	static loadSavedSearch(id) {
		let searchValues = JSON.parse(localStorage.getItem(id));
		InputGroup.inputGroups.forEach(ip => ip.remove());
		
		searchValues.forEach(search => {
			Search.addInputGroup(search.name, search.value);
		});

		Search.updateCombineDropDown();
	}

	static deleteSavedSearch(name) {
		localStorage.removeItem(name);
	}

	static getStoredSearchDropDown() {
		let li;
		let storedSearchDropDownList = document.createElement('ul');

		for (let search in localStorage) {
			if (localStorage.hasOwnProperty(search) && search != 'settings') {
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

	static deleteAllSavedSearches() {
		for (let search in localStorage) {
			if (localStorage.hasOwnProperty(search) && search != 'settings') {
				localStorage.removeItem(search)
			}
		}
	}
}