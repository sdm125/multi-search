class InputGroup {
	constructor(elm = this.createInputGroupElm()) {
		this._elm = elm;
		this._searchInput = this._elm.querySelector('.search');
		this._combineListContainer = this._elm.querySelector('.combine-list-container');
		this._combineListElm = this._combineListContainer.querySelector('ul');
		Search.addSearchValue({name: this._searchInput.name, value: this.value});
		InputGroup.inputGroups.push(this);
		this.checkForSingleInputGroup();
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
		Search.updateSearchValue({name: this._searchInput.name, value: this.value});
	}

	setName(name) {
		this._searchInput.name = name;
	}

	getName() {
		return this._searchInput.name;
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
		this._combineListElm.style.display === 'none' ? this.showCombineDropDown() : this.hideCombineDropDown();
	}

	showCombineDropDown() {
		InputGroup.inputGroups.forEach(ig => ig.hideCombineDropDown());
		this._combineListElm.style.display = 'block';
	}

	hideCombineDropDown() {
		this._combineListElm.style.display = 'none';
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
		inputGroupAppend.classList.add('input-group-append');

		if (InputGroup.inputGroups.length < 1) {
			newTermInput.classList.add('single-search');
			inputGroupAppend.classList.add('hide');
		}
		else {
			newTermInput.classList.add('multi-search');
		}

		newTermInput.type = 'text';
		newTermInput.setAttribute('placeholder', 'Search');
		newTermInput.name = newTermName;
		newTermInput.classList += ' form-control input-group-lg search';

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

	showMultiSearchControls() {
		this.elm.querySelector('.input-group-append').classList.remove('hide');
		this._searchInput.classList.add('single-search');
		this._searchInput.classList.add('multi-search');
	}

	hideMultiSearchControls() {
		this.elm.querySelector('.input-group-append').classList.add('hide');
		this._searchInput.classList.remove('multi-search');
		this._searchInput.classList.add('single-search');
	}

	checkForSingleInputGroup() {
		if (InputGroup.inputGroups.length === 1) {
			InputGroup.inputGroups[0].hideMultiSearchControls();
			document.querySelector('.multi-search-controls').classList.add('hide');
		}
		else {
			InputGroup.inputGroups[0].showMultiSearchControls();
			document.querySelector('.multi-search-controls').classList.remove('hide');
		}
	}

	addEventListeners() {
		const thisInput = this;	

		this._elm.querySelector('.js-remove-from-search').addEventListener('click', () => {
			this.remove();
		});

		this._elm.querySelector('.js-combine').addEventListener('click', function(event) {
			event.stopPropagation();
			thisInput.toggleCombineDropDown();
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
