(function() {
	document.addEventListener('DOMContentLoaded', () => {
		initSearchBtns();
		initResultListControls();
	});

 	/**
	 * Add click handling to buttons rendered server side.
 	 */
	const initSearchBtns = () => {
		let thisInput;
		let mainTerm;
		let newTerm;

		let addMain = e => {
			e.preventDefault();
			mainTerm = document.querySelector(`input[name="main"]`).value;
			newTerm = thisInput.value;
			thisInput.value = mainTerm !== "" ? `${mainTerm} ${newTerm}` : newTerm;
		};

		document.querySelectorAll('.input-group').forEach(elm => {
			thisInput = elm.querySelector('input[type="text"]');
			elm.querySelector('.js-add-main').addEventListener('click', e => {
				addMain(e);
			});
	
			elm.querySelector('.js-remove').addEventListener('click', () => {
				elm.remove();
			});
		});
	};

	/**
	 * Adds hide / show toggle for search results.
 	 */
	const toggleSearchResults = (resultList, toggleElm) => {
		if (toggleElm.getAttribute('data-collapse') === 'show') {
			toggleElm.setAttribute('data-collapse', 'hide');
			toggleElm.innerText = 'Expand';
			resultList.querySelectorAll('.result-item').forEach(el => {
				el.style.display = "none";
			});
		}
		else {
			toggleElm.setAttribute('data-collapse', 'show');
			toggleElm.innerText = 'Collapse';
			resultList.querySelectorAll('.result-item').forEach(el => {
				el.style.display = "block";
			});
		}
	};

	/**
	 * Adds hide / show toggle for search results descriptions.
 	 */
	const toggleDescriptions = (toggleElm, resultList) => {
		toggleElm.addEventListener('click', function() {
			if (this.getAttribute('data-descriptions') === 'hide') {
				this.setAttribute('data-descriptions', 'show');
				this.innerText = '-';
				resultList.querySelectorAll('.description').forEach(function(description) {
					description.style.display = 'block';
				});
			}
			else {
				this.setAttribute('data-descriptions', 'hide');
				this.innerText = '+';
				resultList.querySelectorAll('.description').forEach(function(description) {
					description.style.display = 'none';
				});
			}
		});
	};

	/**
	 * Applies events listeners to search result list controls.
 	 */
	const initResultListControls = () => {
		const resultLists = document.querySelectorAll('.result-list');
		resultLists.forEach(list => {
			list.querySelector('.js-toggle-search-results').addEventListener('click', function() {
				toggleSearchResults(list, this);
			});
			list.querySelectorAll('.js-toggle-descriptions').forEach(toggleElm => toggleDescriptions(toggleElm, list));
		});
	};

	/**
	 * Creates another search input group when "Add" button is clicked.
 	 */
	function createInputGroup() {
		var inputGroup = document.createElement('div'),
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
			var mainTerm = document.querySelector(`input[name="main"]`).value;
			var newTerm = newTermInput.value;
			if (mainTerm !== "") {
				newTermInput.value = `${mainTerm} ${newTerm}`;
			}
		});

		remove.type = 'button';
		remove.classList += 'btn btn-outline-secondary js-remove';
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
		document.querySelector('.search-terms').appendChild(createInputGroup());
	});

	/**
	 * Registers .result-list elements as draggable with "Move" button.
 	 */
	dragula([document.querySelector('.result-lists')],  { 
		moves: function (el, container, handle) {
			return handle.classList.contains('js-move');
		}
  });
})();
