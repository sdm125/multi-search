(function() {
	document.addEventListener('DOMContentLoaded', () => {
		Search.initSearchControls();

		/**
		 * Initialize ResultList classes
		 */
		document.querySelectorAll('.list-container').forEach(thisResultList => {
			new ResultList(thisResultList);
		});

		/**
		 * Initialize InputGroup classes
		 */
		document.querySelectorAll('.input-group').forEach(thisInputGroup => {
			new InputGroup(thisInputGroup);
		});

		/**
		 * Register .result-list and .input-groups elements as draggable with "Move" button.
		 */
		dragula([document.querySelector('.result-lists')],  { 
			moves: function (el, container, handle) {
				return handle.classList.contains('js-move');
			}
		});

		dragula([document.querySelector('.input-groups')],  { 
			moves: function (el, container, handle) {
				return handle.classList.contains('js-move');
			}
		});
	});

	class Search {
		static initSearchControls() {
			const resultLists = document.querySelector('.result-lists');

			/**
			 * Triggers createInputGroup fn when "Add" button is clicked.
			 */
			document.getElementById('add-input-group').addEventListener('click', function() {
				Search.addInputGroup();
			});

			/**
			 * Reset, remove all input groups.
			 */
			document.getElementById('reset').addEventListener('click', () => {
				InputGroup.inputGroups.forEach(ip => ip.remove());
				Search.addInputGroup();
			});

			/**
			 * Save current searches to local storage.
			 */
			document.getElementById('save').addEventListener('click', () => {
				storageHelper.saveCurrentSearches();
				console.log(localStorage)
			});

	
			/**
			 * Toggle saved searches dropdown.
			 */
			document.getElementById('load').addEventListener('click', function() {
				if (this.getAttribute('data-toggle-saved-search-list') === 'closed') {
					document.getElementById('saved-search-container').appendChild(storageHelper.getStoredSearchDropDown());
					this.setAttribute('data-toggle-saved-search-list', 'opened');
				}
				else {
					document.querySelector('#saved-search-container ul').remove();
					this.setAttribute('data-toggle-saved-search-list', 'closed');
				}
			});

			/**
			 * Load saved searches from local storage.
			 */
			document.getElementById('saved-search-container').addEventListener('click', function(e) {
				if (e.target.classList.contains('js-load-search')) {
					storageHelper.loadSavedSearch(e.target.getAttribute('data-search-id'));
					document.querySelector('#saved-search-container ul').remove();
					document.getElementById('load').setAttribute('data-toggle-saved-search-list', 'closed');
				}
			});
	
			/**
			 * Toggles result lists as a row or column.
			 */
			document.querySelectorAll('.js-toggle-list-orientation').forEach(toggleOrientation => {
				toggleOrientation.addEventListener('click', function() {
					if (this.value === 'row') {
						resultLists.classList.add('flex-row');
						resultLists.classList.remove('flex-column');
					}
					else if (this.value === 'column') {
						resultLists.classList.add('flex-column');
						resultLists.classList.remove('flex-row');
					}
				});
			});
		}

		static addInputGroup(name, value) {
			let newInputGroup = new InputGroup();
			name && newInputGroup.setName(name);
			value && newInputGroup.setValue(value);
			document.querySelector('.input-groups').appendChild(newInputGroup.elm);
		};

		static getSearchValues() {
			return Search.searchValues;
		}

		static getSearchValue(val) {
			return Search.searchValues.filter(sv => sv.name === val);
		}

		static addSearchValue(nameVal) {
			Search.searchValues.push(nameVal);
		}

		static updateSearchValue(nameVal) {
			Search.searchValues.forEach(search => {
				if (search.name === nameVal.name) {
					search.value = nameVal.value;
				}
			});
		}

		static removeSearchValue(name) {
			Search.searchValues.forEach((val, i) => {
				if (val.name = name) {
					Search.searchValues.splice(i, 1);
				}
			});
			Search.updateCombineDropDown();
		}

		static updateCombineDropDown() {
			InputGroup.inputGroups.forEach(ig => {
				ig.updateCombineDropDown(Search.getCombineDropDown());
			});
		}

		static getCombineDropDown() {
			let li;
			let combineDropDownList = document.createElement('ul');

			Search.getSearchValues().forEach(nameVal => {
				if (nameVal.value) {
					li = document.createElement('li');
					li.classList.add('combine-item');
					li.innerText = nameVal.value;
					li.setAttribute('data-search-term', nameVal.value);
					combineDropDownList.appendChild(li);
				}
			});

			return combineDropDownList;
		}
	}

	/*
	 * Static Search values
	 */
	Search.searchValues = [];

	class InputGroup {
		constructor(elm = this.createInputGroupElm()) {
			this._elm = elm;
			this._searchInput = this._elm.querySelector('.search');
			this._combineListContainer = this._elm.querySelector('.combine-list-container');
			this._combineListElm = this._combineListContainer.querySelector('ul');
			Search.addSearchValue({name: this._searchInput.name, value: this.value});
			InputGroup.inputGroups.push(this);
			this.addEventListeners();
		}

		get elm() {
			return this._elm;
		}

		get value() {
			return this._searchInput.value;
		}

		setValue(val) {
			this._searchInput.value = val;
		}

		setName(name) {
			this._searchInput.name = name;
		}

		combine(event) {
			if (event.target.classList.contains('combine-item')) {
				this._searchInput.value = `${this.value} ${event.target.getAttribute('data-search-term')}`;
				this.toggleCombineDropDown();
			}
		}

		remove() {
			Search.removeSearchValue(this._searchInput.name);
			InputGroup.inputGroups = InputGroup.inputGroups.filter(ip => ip !== this);
			this._elm.remove();
		}

		toggleCombineDropDown() {
			this._combineListElm.style.display = this._combineListElm.style.display === 'none' ? 'block' : 'none';
		}

		updateCombineDropDown(updatedCombineDropDownList) {
			const thisInput = this;

			this._combineListElm && this._combineListElm.remove();
			this._combineListElm = updatedCombineDropDownList;
			this._combineListContainer.appendChild(this._combineListElm);

			this._combineListElm.addEventListener('click', function(event) {
				thisInput.combine(event);
			});
		}

		/**
		 * Creates search input group element.
		 */
		createInputGroupElm() {
			let inputGroupElm = document.createElement('div'),
					inputGroupAppend = document.createElement('div'),
					newTermInput = document.createElement('input'),
					remove = document.createElement('button'),
					combineListContainer = document.createElement('div'),
					combineList = document.createElement('ul'),
					combine = document.createElement('button'),
					move = document.createElement('button'),
					newTermIndex = document.querySelectorAll('.search').length,
					newTermName = `term${newTermIndex}`;

			inputGroupElm.classList += 'input-group mb-3';
			inputGroupElm.setAttribute('data-remove', `term${newTermIndex}`);
			inputGroupAppend.classList += 'input-group-append';

			newTermInput.type = 'text';
			newTermInput.setAttribute('placeholder', 'Search');
			newTermInput.name = newTermName;
			newTermInput.classList += 'form-control input-group-lg search';

			combine.type = 'button';
			combine.classList += 'btn btn-outline-secondary js-combine combine-btn';
			combine.innerHTML = '<img src="/icons/plus-circle.svg">';

			combineList = Search.getCombineDropDown();

			combineListContainer.classList.add('combine-list-container');
			combineListContainer.appendChild(combine);
			combineListContainer.appendChild(combineList);

			remove.type = 'button';
			remove.classList += 'btn btn-outline-secondary js-remove-from-search remove-from-search-btn';
			remove.innerHTML = '<img src="/icons/trash-2.svg">';

			move.type = 'button';
			move.classList += 'btn btn-outline-secondary move-search';
			move.innerHTML = '<img class="js-move" src="/icons/move.svg">';

			inputGroupElm.appendChild(newTermInput);
			inputGroupAppend.appendChild(combineListContainer);
			inputGroupAppend.appendChild(remove);
			inputGroupAppend.appendChild(move);
			inputGroupElm.appendChild(inputGroupAppend);

			return inputGroupElm;
		}

		addEventListeners() {
			const thisInput = this;

			this._elm.querySelector('.js-remove-from-search').addEventListener('click', () => {
				this.remove();
			});

			this._elm.querySelector('.js-combine').addEventListener('click', () => {
				this.toggleCombineDropDown();
			});

			this._searchInput.addEventListener('keyup', () => {
				if (Search.getSearchValue(this._searchInput.name).length) {
					Search.updateSearchValue({name: this._searchInput.name, value: this.value});
				}
				else {
					Search.addSearchValue({name: this._searchInput.name, value: this.value});
				}
				Search.updateCombineDropDown();
			});
			
			this._combineListElm.addEventListener('click', function(event) {
				thisInput.combine(event);
			});
		}
	}

	/*
	 * Static InputGroup values
	 */
	InputGroup.inputGroups = [];

	class ResultList {
		constructor(elm) {
			this._elm = elm;
			this._toggleSearchResultsBtn = this._elm.querySelector('.js-toggle-search-results');
			this._toggleDescriptionsBtn = this._elm.querySelector('.js-toggle-descriptions');
			this._removeBtn = this._elm.querySelector('.js-remove-from-list');
			this.addEventListeners();
		}

		/**
		 * Adds hide / show toggle for search results.
		 */
		toggleSearchResults() {
			if (this._toggleSearchResultsBtn.getAttribute('data-collapse') === 'show') {
				this._toggleSearchResultsBtn.setAttribute('data-collapse', 'hide');
				this._toggleSearchResultsBtn.innerHTML = '<img src="/icons/chevron-up.svg">';
				this._elm.querySelectorAll('.result-item').forEach(el => {
					el.style.display = "none";
				});
			}
			else {
				this._toggleSearchResultsBtn.setAttribute('data-collapse', 'show');
				this._toggleSearchResultsBtn.innerHTML = '<img src="/icons/chevron-down.svg">';
				this._elm.querySelectorAll('.result-item').forEach(el => {
					el.style.display = "block";
				});
			}
		}

		/**
		 * Adds hide / show toggle for search results descriptions.
		 */
		toggleDescriptions() {
			if (this._toggleDescriptionsBtn.getAttribute('data-descriptions') === 'hide') {
				this._toggleDescriptionsBtn.setAttribute('data-descriptions', 'show');
				this._toggleDescriptionsBtn.innerHTML = '<img src="/icons/toggle-right.svg">';
				this._elm.querySelectorAll('.description').forEach(function(description) {
					description.style.display = 'block';
				});
			}
			else {
				this._toggleDescriptionsBtn.setAttribute('data-descriptions', 'hide');
				this._toggleDescriptionsBtn.innerHTML = '<img src="/icons/toggle-left.svg">';
				this._elm.querySelectorAll('.description').forEach(function(description) {
					description.style.display = 'none';
				});
			}
		}

		remove() {
			this._elm.parentNode.removeChild(this._elm);
		}

		addEventListeners() {
			this._toggleSearchResultsBtn.addEventListener('click', () => this.toggleSearchResults());
			this._toggleDescriptionsBtn.addEventListener('click', () => this.toggleDescriptions());
			this._removeBtn.addEventListener('click', () => this.remove());
		}
	}

	class storageHelper {
		static saveCurrentSearches() {
			localStorage.setItem(storageHelper.generateID(), JSON.stringify(Search.searchValues));
		}

		static generateID() {
			return Math.random().toString(20).replace(/0./, '_');
		}

		static loadSavedSearch(id) {
			let searches = JSON.parse(localStorage.getItem(id));

			InputGroup.inputGroups.forEach(ip => ip.remove());

			searches.forEach(search => {
				Search.addInputGroup(search.name, search.value);
			});
		}

		static getStoredSearchDropDown() {
			let li;
			let storedSearchDropDownList = document.createElement('ul');

			for (let search in localStorage) {
				if (localStorage.hasOwnProperty(search)) {
					li = document.createElement('li');
					li.setAttribute('data-search-id', search)
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
})();
