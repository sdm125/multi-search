class Nav {
	static showModal(type) {
		let modalToShow = document.querySelector(`.${type}-search-modal`)
		
		document.querySelector('.modal-container').classList.remove('hide');
		document.querySelectorAll('.modal-dialog-window').forEach(modalDialogWindow => {
			if (modalDialogWindow !== modalToShow) {
				modalDialogWindow.classList.add('hide');
			}
		});

		if (modalToShow.classList.contains('hide')) {
			modalToShow.classList.remove('hide');
		}
	}

	static closeModal() {
		document.querySelector('.modal-container').classList.add('hide');
		document.querySelector('.save-search-modal .validation-msg').innerText = '';
		document.querySelector('.save-search-modal input[name="currentSearchName"]').value = '';
		
		Array.from(document.querySelector('.update-search-modal .saved-search-list').children).forEach(saveSearchListItem => {
			saveSearchListItem.remove();
		});

		Array.from(document.querySelector('.load-search-modal .saved-search-list').children).forEach(saveSearchListItem => {
			saveSearchListItem.remove();
		})
	}

	static openNav() {
		document.querySelector('.modal-container').classList.remove('hide');
		let navToggleBtn = document.querySelector('.nav-toggle');
		navToggleBtn.setAttribute('data-toggle', 'open');
		navToggleBtn.src = '/icons/x.svg';
		document.querySelector('.pop-out-menu').classList.add('active');
	}

	static closeNav(hideModal) {
		let navToggleBtn = document.querySelector('.nav-toggle');
		hideModal && document.querySelector('.modal-container').classList.add('hide');
		navToggleBtn.setAttribute('data-toggle', 'closed');
		navToggleBtn.src = '/icons/menu.svg';
		document.querySelector('.pop-out-menu').classList.remove('active');
	}
	
	static init() {
		/**
		 * Nav toggle
		 */
		document.querySelector('.nav-toggle').addEventListener('click', function() {
			this.getAttribute('data-toggle') === 'closed' ? Nav.openNav() : Nav.closeNav(true);
		});

		/**
		 * Open save current search modal
		 */
		document.getElementById('open-save-modal').addEventListener('click', () => {
			Nav.closeNav();
			Nav.showModal('save');
		});

		/**
		 * Save current search to local storage
		 */
		document.getElementById('save-current-search').addEventListener('click', function() {
			var saveCurrentSearchName = this.previousElementSibling.previousElementSibling.value;
			if (StorageHelper.validateSaveCurrentSearch(saveCurrentSearchName)) {
				StorageHelper.saveCurrentSearches(saveCurrentSearchName);
				Nav.closeModal();
			}
			else {
				document.querySelector('.save-search-modal .validation-msg').innerText = `There is already a search saved as "${saveCurrentSearchName}". Please try a different name.`;
			}
		});

		/**
		 * Open update saved search modal. Select saved search from list. Sets update button data-update-search attribute for update-search-validate-modal.
		 */
		document.getElementById('open-update-modal').addEventListener('click', () => {
			Nav.closeNav();
			Nav.showModal('update');

			if (localStorage.length > 0) {
				document.querySelector('.update-search-modal .saved-searches').classList.remove('hide');
				document.querySelector('.update-search-modal .no-saved-searches').classList.add('hide');

				StorageHelper.getAllSavedSearches().forEach(savedSearch => {
					let savedSearchListItem = document.createElement('li');

					savedSearchListItem.addEventListener('click', function(){
						document.querySelector('.update-search-modal').classList.add('hide');
						document.querySelector('.update-search-validate-modal').classList.remove('hide');
						document.querySelector('.update-search-validate-modal #update-saved-search').setAttribute('data-update-search-name', this.innerText);
						document.querySelector('.update-search-validate-modal h5').innerText = `Update saved search "${this.innerText}" with current search?`;
					});
					
					savedSearchListItem.innerText = savedSearch.name;
					document.querySelector('.saved-search-list').appendChild(savedSearchListItem);
				});
			}
			else {
				document.querySelector('.update-search-modal .saved-searches').classList.add('hide');
				document.querySelector('.update-search-modal .no-saved-searches').classList.remove('hide');
			}
		});

		/**
		 * Update a saved search with the current search. data-update-search-name attribute set by update-search-modal li on click.
		 */
		document.getElementById('update-saved-search').addEventListener('click', function(){
			Nav.closeModal();
			StorageHelper.saveCurrentSearches(this.getAttribute('data-update-search-name'));
		});

		/**
		 * Load saved searches from local storage.
		 */
		document.getElementById('open-load-modal').addEventListener('click', function(e) {
			Nav.closeNav();
			Nav.showModal('load');

			if (localStorage.length > 0) {
				document.querySelector('.load-search-modal .saved-searches').classList.remove('hide');
				document.querySelector('.load-search-modal .no-saved-searches').classList.add('hide');

				StorageHelper.getAllSavedSearches().forEach(savedSearch => {
					let savedSearchListItem = document.createElement('li');

					savedSearchListItem.addEventListener('click', function(){
						StorageHelper.loadSavedSearch(savedSearch.name);
						Nav.closeModal();
					});
					
					savedSearchListItem.innerText = savedSearch.name;
					document.querySelector('.load-search-modal .saved-search-list').appendChild(savedSearchListItem);
				});
			}
			else {
				document.querySelector('.load-search-modal .saved-searches').classList.add('hide');
				document.querySelector('.load-search-modal .no-saved-searches').classList.remove('hide');
			}
		});
		
		/**
		 * Cancel/close modal dialog window
		 */
		document.querySelectorAll('.cancel-modal').forEach(cancelModal => {
			cancelModal.addEventListener('click', () => {
				Nav.closeModal();
				document.querySelectorAll('.modal-dialog-window').forEach(modalDialogWindow => {
					if (!modalDialogWindow.classList.contains('hide')) modalDialogWindow.classList.add('hide');
				});
			});
		});
	}
}