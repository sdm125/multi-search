class ModalControls {
  static showModal(type) {
		this.hideAllModals();

		let modalToShow = document.querySelector(`.${type}-search-modal`);
		
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
		
		Array.from(document.querySelector('.update-search-modal .saved-searches').children).forEach(saveSearchListItem => {
			saveSearchListItem.remove();
		});

		Array.from(document.querySelector('.load-search-modal .saved-searches').children).forEach(saveSearchListItem => {
			saveSearchListItem.remove();
		});
		
		this.hideAllModals();
	}
	
	static hideAllModals() {
		document.querySelectorAll('.modal-dialog-window').forEach(modalDialogWindow => {
			if (!modalDialogWindow.classList.contains('hide')) {
				modalDialogWindow.classList.add('hide');
			}
		});
	}
  
  static init() {
    /**
		 * Close nav or modal when click modal container.
		 */
		document.querySelector('.modal-container').addEventListener('click', function(e) {
			if (e.target.classList.contains('modal-container')) {
				NavControls.closeNav();
				ModalControls.closeModal();
			}
		});

		/**
		 * Open save current search modal
		 */
		document.getElementById('open-save-modal').addEventListener('click', () => {
			NavControls.closeNav();
			this.showModal('save');
		});

		/**
		 * Save current search to local storage
		 */
		document.getElementById('save-current-search').addEventListener('click', function() {
			let saveCurrentSearchName = this.previousElementSibling.previousElementSibling.value;
			if (StorageHelper.validateSaveCurrentSearch(saveCurrentSearchName)) {
				StorageHelper.saveCurrentSearches(saveCurrentSearchName);
				ModalControls.closeModal();
			}
			else {
				document.querySelector('.save-search-modal .validation-msg').innerText = `There is already a search saved as "${saveCurrentSearchName}". Please try a different name.`;
			}
		});

		/**
		 * Open update saved search modal. Select saved search from list. Sets update button data-update-search attribute for update-search-validate-modal.
		 */
		document.getElementById('open-update-modal').addEventListener('click', () => {
			NavControls.closeNav();
			this.showModal('update');

			if (localStorage.length > 0) {
				document.querySelector('.update-search-modal .saved-searches').classList.remove('hide');
				document.querySelector('.update-search-modal .no-saved-searches').classList.add('hide');

				document.querySelector('.update-search-modal .saved-searches').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.updateSavedSearch, 'Update Saved Search', false));
			}
			else {
				document.querySelector('.update-search-modal .saved-searches').classList.add('hide');
				document.querySelector('.update-search-modal .no-saved-searches').classList.remove('hide');
			}
		});

		/**
		 * Load saved searches from local storage.
		 */
		document.getElementById('open-load-modal').addEventListener('click', function(e) {
			NavControls.closeNav();
			ModalControls.showModal('load');

			if (localStorage.length > 0) {
				document.querySelector('.load-search-modal .saved-searches').classList.remove('hide');
				document.querySelector('.load-search-modal .no-saved-searches').classList.add('hide');

				document.querySelector('.load-search-modal .saved-searches').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch, 'Load Saved Search', true));
			}
			else {
				document.querySelector('.load-search-modal .saved-searches').classList.add('hide');
				document.querySelector('.load-search-modal .no-saved-searches').classList.remove('hide');
			}
		});

		document.getElementById('open-settings-modal').addEventListener('click', function() {
			NavControls.closeNav();
			ModalControls.showModal('settings');
			let settings = Settings.get();
			for(let setting in settings) {
				document.querySelectorAll(`img[data-setting="${setting}"]`).forEach(settingBtn => {
					if (settingBtn.getAttribute('data-value') === settings[setting]) {
						if (settingBtn.classList.contains('hide')) {
							settingBtn.classList.remove('hide');
						}
					}
					else {
						settingBtn.classList.add('hide');
					}
				})
			}
		});

		document.querySelectorAll('.js-settings-btn').forEach(settingsBtn => {
			let settingUpdate = {};
			settingsBtn.addEventListener('click', () => {
				if (settingsBtn.nextElementSibling) {
					settingUpdate[settingsBtn.getAttribute('data-setting')] = settingsBtn.getAttribute('data-value');
					Settings.update(settingUpdate);
					
					settingsBtn.nextElementSibling.classList.remove('hide');
					settingsBtn.classList.add('hide');
				}
				else if (settingsBtn.previousElementSibling) {
					settingUpdate[settingsBtn.getAttribute('data-setting')] = settingsBtn.getAttribute('data-value');
					Settings.update(settingUpdate);
					
					settingsBtn.previousElementSibling.classList.remove('hide');
					settingsBtn.classList.add('hide');
				}
			});
		});
		/**
			* Delete all searches from settings modal
			*/
		document.querySelector('.js-delete-all-searches').addEventListener('click', () => {
			ModalControls.showModal('delete');
			document.querySelector('.delete-search-modal h5').innerText = `Are you sure you want to delete all saved searches?`;
			document.querySelector('#delete-saved-search').addEventListener('click', () => {
				StorageHelper.deleteAllSavedSearches();
				this.closeModal();
			});
		});
		
		/**
		 * Cancel/close modal dialog window
		 */
		document.querySelectorAll('.cancel-modal').forEach(cancelModal => {
			cancelModal.addEventListener('click', () => {
				this.closeModal();
			});
		});
  }
}