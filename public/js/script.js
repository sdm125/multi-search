(function() {
	document.addEventListener('DOMContentLoaded', () => {
		const resultLists = Array.from(document.querySelectorAll('.list-container'));
		const inputGroups = document.querySelectorAll('.input-group');
		let thisSearchTerm;
		let thisResultList;

		/**
		 * Initialize Search classes
		 */
		inputGroups.forEach(thisInputGroup => {
			thisSearchTerm = thisInputGroup.querySelector('.search').value;
			thisResultList = resultLists.filter(rl => rl.getAttribute('data-search').toLowerCase() === thisSearchTerm.toLowerCase());
			thisResultList.length ? new Search(...thisResultList, thisInputGroup) :	new Search(null, thisInputGroup) 
		});

		/**
		 * Triggers createInputGroup fn when "Add" button is clicked.
		 */
		document.getElementById('add-term').addEventListener('click', function() {
			let newInputGroup = createInputGroup();
			document.querySelector('.input-groups').appendChild(newInputGroup);
			new Search(null, newInputGroup);
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
		static searchValuesDropDown = document.createElement('ul');

		constructor(resultList, inputGroup) {
			console.log(resultList)
			this._resultList = resultList ?	new ResultList(resultList, inputGroup) : null;
			this._inputGroup = new InputGroup(inputGroup, this._resultList);
			this._value = this._inputGroup.value;
			Search.searchValues.push(this._value);
			this.addEventListeners();
		}

		populateSearchValuesDropDown() {
			let li;
			
			while (Search.searchValuesDropDown.firstChild) {
				Search.searchValuesDropDown.removeChild(Search.searchValuesDropDown.firstChild);
			}
			
			Search.searchValues.forEach(val => {
				li = document.createElement('li');
				li.innerText = val;
				Search.searchValuesDropDown.appendChild(li);
			});
		}

		addEventListeners() {
			this._inputGroup.elm.querySelector('.search').addEventListener('keyup', () => {
				Search.searchValues[Search.searchValues.indexOf(this._value)] = this._inputGroup.value;
				this._value = this._inputGroup.value;
				this.populateSearchValuesDropDown();
			});
		}
	}
  
	class ResultList {
		constructor(elm, inputGroup) {
			this._elm = elm;
			this._inputGroup = inputGroup;
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
			this._removeBtn.addEventListener('click', () => {
				this.remove();
			});
		}
	}

	class InputGroup {
		constructor(elm, resultList) {
			this._elm = elm;
			this._resultList = resultList;
			this._searchInput = this._elm.querySelector('.search');
			this._combineListContainer = this._elm.querySelector('.combine-list-container');
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
			this._elm.parentNode.removeChild(this._elm);
		}

		toggleDropDown() {
			this._combineListContainer.querySelector('ul').style.display = this._combineListContainer.querySelector('ul').style.display === 'none' ? 'block' : 'none';
		}

		addEventListeners() {
			const thisInput = this;

			this._elm.querySelector('.js-remove-from-search').addEventListener('click', () => {
				this.remove();
			});

			this._elm.querySelector('.js-combine').addEventListener('click', () => {
				this.toggleDropDown();
			});
			
			this._combineListContainer.querySelector('ul').addEventListener('click', function(e) {
				if (e.target.classList.contains('combine-item')) {
					thisInput.combine(e.target.innerText);
					thisInput.toggleDropDown();
				}
			});
		}
	}

  /**
	 * Creates search input group when "Add" button is clicked.
 	 */
 const createInputGroup = () => {
		let inputGroup = document.createElement('div'),
				inputGroupAppend = document.createElement('div'),
				newTermInput = document.createElement('input'),
				remove = document.createElement('button'),
				combine = document.createElement('button'),
				newTermIndex = document.querySelectorAll('.search').length,
				newTermName = `term${newTermIndex}`;

		inputGroup.classList += 'input-group mb-3';
		inputGroup.setAttribute('data-remove', `term${newTermIndex}`);
		inputGroupAppend.classList += 'input-group-append';

		newTermInput.type = 'text';
		newTermInput.setAttribute('placeholder', 'Search');
		newTermInput.name = newTermName;
		newTermInput.classList += 'form-control input-group-lg search';

		combine.type = 'button';
		combine.classList += 'btn btn-outline-secondary js-combine';
		combine.innerHTML = 'Combine <span>&#9660;</span>';

		remove.type = 'button';
		remove.classList += 'btn btn-outline-secondary js-remove-from-search';
		remove.innerText = 'Remove';

		inputGroup.appendChild(newTermInput);
		inputGroupAppend.appendChild(combine);
		inputGroupAppend.appendChild(remove);
		inputGroup.appendChild(inputGroupAppend);

		return inputGroup;
	}
})();
