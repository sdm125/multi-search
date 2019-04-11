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
		 * Registers .result-list elements as draggable with "Move" button.
		 */
		dragula([document.querySelector('.result-lists')],  { 
			moves: function (el, container, handle) {
				return handle.classList.contains('js-move');
			}
		});
	});

	class Search {
		static searchValues = [];
		static dropDown = document.createElement('ul');

		static initSearchControls() {
			const resultLists = document.querySelector('.result-lists');
	
			/**
			 * Triggers createInputGroup fn when "Add" button is clicked.
			 */
			document.getElementById('add-input-group').addEventListener('click', function() {
				let newInputGroup = new InputGroup();
				document.querySelector('.input-groups').appendChild(newInputGroup.elm);
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
			for (let i = 0, found = false; i < Search.searchValues.length && !found; i++) {
				if (Search.searchValues[i].name === nameVal.name) {
					Search.searchValues[i].value = nameVal.value;
					found = !found;
				}
			}
		}

		static removeSearchValue(name) {
			for (let i = 0, found = false; i < Search.searchValues.length && !found; i++) {
				if (Search.searchValues[i].name === name) {
					Search.searchValues.forEach((val, i) => {
						if (val.name = name) {
							Search.searchValues.splice(i, 1);
						}
					})
					found = !found;
				}
			}
			Search.updateCombineDropDown();
		}

		static updateCombineDropDown() {
			let li;
			let updatedCombineDropDownList = document.createElement('ul');

			Search.getSearchValues().forEach(nameVal => {
				if (nameVal.value) {
					li = document.createElement('li');
					li.innerText = nameVal.value;
					li.setAttribute('data-search-term', nameVal.value);
					updatedCombineDropDownList.appendChild(li);
				}
			});

			InputGroup.InputGroups.forEach(ig => {
				ig.updateCombineDropDown(updatedCombineDropDownList);
			});
		}
	}
  
	class InputGroup {
		static InputGroups = [];

		constructor(elm = this.createInputGroupElm()) {
			this._elm = elm;
			this._searchInput = this._elm.querySelector('.search');
			this._combineListContainer = this._elm.querySelector('.combine-list-container');
			this._combineListElm = this._combineListContainer.querySelector('ul');
			Search.addSearchValue({name: this._searchInput.name, value: this.value});
			InputGroup.InputGroups.push(this);
			this.addEventListeners();
		}

		get elm() {
			return this._elm;
		}

		get value() {
			return this._searchInput.value;
		}

		combine(val) {
			this._searchInput.value = `${this.value} ${val}`;
		}

		remove() {
			Search.removeSearchValue(this._searchInput.name);
			this._elm.parentNode.removeChild(this._elm);
		}

		toggleCombineDropDown() {
			if (this._combineListContainer.querySelector('ul')) {
				this._combineListContainer.querySelector('ul').style.display = this._combineListContainer.querySelector('ul').style.display === 'none' ? 'block' : 'none';
			}
			else {
				Search.updateCombineDropDown();
			}
		}

		updateCombineDropDown(updatedCombineDropDownList) {
			this._combineListElm && this._combineListElm.remove();
			this._combineListElm = updatedCombineDropDownList;
			this._combineListContainer.appendChild(this._combineListElm);
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
			combine.innerHTML = 'Combine <span>&#9660;</span>';

			combineListContainer.classList.add('combine-list-container');
			combineListContainer.appendChild(combine);
			combineListContainer.appendChild(combineList);

			remove.type = 'button';
			remove.classList += 'btn btn-outline-secondary js-remove-from-search';
			remove.innerText = 'Remove';

			inputGroupElm.appendChild(newTermInput);
			inputGroupAppend.appendChild(combineListContainer);
			inputGroupAppend.appendChild(remove);
			inputGroupElm.appendChild(inputGroupAppend);

			return inputGroupElm;
		}

		addEventListeners() {
			const thisInput = this;

			this._elm.querySelector('.js-remove-from-search').addEventListener('click', () => {
				this.remove();
			});

			this._elm.querySelector('.js-combine').addEventListener('click', () => {
				!this._combineListContainer.querySelector('ul') && Search.updateCombineDropDown();
				this.toggleCombineDropDown();
			});

			this._searchInput.addEventListener('keyup', () => {
				if (Search.getSearchValue(this._searchInput.name)) {
					Search.updateSearchValue({name: this._searchInput.name, value: this.value});
				}
				else {
					Search.addSearchValue({name: this._searchInput.name, value: this.value});
				}
				Search.updateCombineDropDown();
				console.log(Search.getSearchValues())
			});
			
			this._combineListContainer.querySelector('ul').addEventListener('click', function(e) {
				if (e.target.classList.contains('combine-item')) {
					thisInput.combine(e.target.getAttribute('data-search-term'));
					thisInput.toggleCombineDropDown();
				}
			});
		}
	}

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
})();
