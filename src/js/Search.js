class Search {
	static initSearchControls() {
		const resultLists = document.querySelector('.result-lists');

		/**
		 * Triggers createInputGroup fn when "Add" button is clicked.
		 */
		document.getElementById('add-input-group').addEventListener('click', () => {
			this.addInputGroup();
		});

		/**
		 * Reset, remove all input groups.
		 */
		document.getElementById('reset').addEventListener('click', () => {
			InputGroup.inputGroups.forEach(ip => ip.remove());
			Search.searchValues.length = 0;
			this.addInputGroup();
		});

		/**
		 * Toggles result lists as a row or column.
		 */
		document.querySelectorAll('.toggle-list-orientation').forEach(toggleOrientation => {
			toggleOrientation.addEventListener('click', function() {
				if (parseInt(this.getAttribute('data-value')) === 0) {
					document.querySelector('input[name="orientation"]').value = 'column';
					resultLists.classList.add('flex-column');
					resultLists.classList.add('col-lg-8');
					resultLists.classList.add('ml-auto');
					resultLists.classList.add('mr-auto');
					resultLists.classList.remove('flex-row');
				}
				else if (parseInt(this.getAttribute('data-value')) === 1) {
					document.querySelector('input[name="orientation"]').value = 'row';
					resultLists.classList.add('flex-row');
					resultLists.classList.remove('ml-auto');
					resultLists.classList.remove('mr-auto');
					resultLists.classList.remove('col-lg-8');
					resultLists.classList.remove('flex-column');
				}
			});
		});
	}

	static addInputGroup(name, value) {
		let newInputGroup = new InputGroup(name, value);
		name && newInputGroup.setName(name);
		value && newInputGroup.setValue(value);
		document.querySelector('.input-groups').appendChild(newInputGroup.elm);

		if (InputGroup.inputGroups.length > 1) {
			if (document.querySelector('.single-search')) {
				document.querySelector('.single-search').classList.remove('single-search');
			}
		}
	};

	static getSearchValue(val) {
		return this.searchValues.filter(sv => sv.name === val);
	}

	static addSearchValue(nameVal) {
		Search.searchValues.push(nameVal);
		if (Search.searchValues.length === 5) {
			document.querySelector('#add-input-group').style.display = 'none';
		}
	}

	static updateSearchValue(nameVal) {
		Search.searchValues.forEach(search => {
			if (search.name === nameVal.name) {
				search.value = nameVal.value;
			}
		});
	}

	static removeSearchValue(name) {
		Search.searchValues = Search.searchValues.filter(sv => sv.name !== name)

		if (Search.searchValues.length < 6 && document.querySelector('#add-input-group').style.display === 'none') {
			document.querySelector('#add-input-group').style.display = 'inline';
		}

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
		combineDropDownList.classList.add('combine-list');
		combineDropDownList.style.display = 'none';
		Search.searchValues.forEach(nameVal => {
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
