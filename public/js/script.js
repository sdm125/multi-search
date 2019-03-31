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
			new Search(...thisResultList, thisInputGroup);	
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
				this._toggleDescriptionsBtn.innerHTML= '<img src="/icons/toggle-right.svg">';
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
				this._inputGroup.remove();
			});
		}
	}

	class InputGroup {
		constructor(elm, resultList) {
			this._elm = elm;
			this._resultList = resultList;
			this.addEventListeners();
		}

		remove() {
			this._elm.parentNode.removeChild(this._elm);
		}

		addEventListeners() {
			this._elm.querySelector('.js-remove-from-search').addEventListener('click', () => {
				this.remove();
				this._resultList.remove();
			});
		}

		get value() {
			return this._elm.querySelector('.search').value;
		}
	}

	class Search {
		static searchValues = [];

		constructor(resultList, inputGroup) {
			this._resultList = new ResultList(resultList, inputGroup);
			this._inputGroup = new InputGroup(inputGroup, this._resultList);
			this.addToValues();
		}

		addToValues() {
			Search.searchValues.push(this._inputGroup.value);
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
				addMain = document.createElement('button'),
				newTermIndex = document.querySelectorAll('.term').length,
				newTermName = `term${newTermIndex}`;

		inputGroup.classList += 'input-group mb-3';
		inputGroup.setAttribute('data-remove', `term${newTermIndex}`);
		inputGroupAppend.classList += 'input-group-append';

		newTermInput.type = 'text';
		newTermInput.setAttribute('placeholder', 'Search');
		newTermInput.name = newTermName;
		newTermInput.classList += 'form-control input-group-lg term';

		addMain.type = 'button';
		addMain.classList += 'btn btn-outline-secondary';
		addMain.innerText = 'Add Main';
		addMain.addEventListener('click', e => {
			e.preventDefault();
			let mainTerm = document.querySelector(`input[name="main"]`).value;
			let newTerm = newTermInput.value;
			if (mainTerm !== "") {
				newTermInput.value = `${mainTerm} ${newTerm}`;
			}
		});

		remove.type = 'button';
		remove.classList += 'btn btn-outline-secondary js-remove-from-search';
		remove.innerText = 'Remove';
		remove.addEventListener('click', e => {
			e.preventDefault();
			document.querySelector(`.input-group[data-remove="${newTermName}"]`).remove();
		});

		inputGroup.appendChild(newTermInput);
		inputGroupAppend.appendChild(addMain);
		inputGroupAppend.appendChild(remove);
		inputGroup.appendChild(inputGroupAppend);

		return inputGroup;
	}

	/**
	 * Triggers createInputGroup fn when "Add" button is clicked.
 	 */
	document.getElementById('add-term').addEventListener('click', function() {
		document.querySelector('.input-groups').appendChild(createInputGroup());
	});
})();
