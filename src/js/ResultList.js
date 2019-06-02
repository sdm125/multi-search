class ResultList {
	constructor(elm) {
		this._elm = elm;
		this._toggleSearchResultsBtn = this._elm.querySelector('.js-toggle-search-results');
		this._toggleDescriptionsBtn = this._elm.querySelector('.js-toggle-descriptions');
		this._removeBtn = this._elm.querySelector('.js-remove-from-list');
		this.addEventListeners();
		this.checkSettings();
	}

	/**
	 * Adds hide / show toggle for search results.
	 */
	toggleSearchResults() {
		if (this._toggleSearchResultsBtn.getAttribute('data-collapse') === 'show') {
			this.hideSearchResults();
		}
		else {
			this.showSearchResults();
		}
	}

	showSearchResults() {
		this._toggleSearchResultsBtn.setAttribute('data-collapse', 'show');
		this._toggleSearchResultsBtn.innerHTML = '<img src="/icons/chevron-down.svg">';
		this._elm.querySelectorAll('.result-item').forEach(el => {
			el.style.display = "block";
		});
	}

	hideSearchResults() {
		this._toggleSearchResultsBtn.setAttribute('data-collapse', 'hide');
		this._toggleSearchResultsBtn.innerHTML = '<img src="/icons/chevron-up.svg">';
		this._elm.querySelectorAll('.result-item').forEach(el => {
			el.style.display = "none";
		});
	}

	/**
	 * Adds hide / show toggle for search results descriptions.
	 */
	toggleDescriptions() {
		if (this._toggleDescriptionsBtn.getAttribute('data-descriptions') === 'hide') {
			this.showDescriptions();
		}
		else {
			this.hideDescriptions();
		}
	}

	showDescriptions() {
		this._toggleDescriptionsBtn.setAttribute('data-descriptions', 'show');
		this._toggleDescriptionsBtn.innerHTML = '<img src="/icons/toggle-right.svg">';
		this._elm.querySelectorAll('.description').forEach(function(description) {
			description.style.display = 'block';
		});
	}

	hideDescriptions() {
		this._toggleDescriptionsBtn.setAttribute('data-descriptions', 'hide');
		this._toggleDescriptionsBtn.innerHTML = '<img src="/icons/toggle-left.svg">';
		this._elm.querySelectorAll('.description').forEach(function(description) {
			description.style.display = 'none';
		});
	}

	remove() {
		this._elm.parentNode.removeChild(this._elm);
	}

	checkSettings() {
		let settings = Settings.get();
		
		for (let setting in settings) {
			if (setting === 'showDescriptions') {
				parseInt(settings[setting]) === 1 ? this.showDescriptions() : this.hideDescriptions();
			}
			else if (setting === 'collapseResults') {
				parseInt(settings[setting]) === 1 ? this.showSearchResults() : this.hideSearchResults();
			}
		}
	}

	addEventListeners() {
		this._toggleSearchResultsBtn.addEventListener('click', () => this.toggleSearchResults());
		this._toggleDescriptionsBtn.addEventListener('click', () => this.toggleDescriptions());
		this._removeBtn.addEventListener('click', () => this.remove());
	}
}