document.addEventListener('DOMContentLoaded', () => {
  Search.initSearchControls();
  NavControls.init();

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

  if (window.location.pathname === '/' && StorageHelper.getAllSavedSearches().length > 0) {
    document.querySelector('.saved-search-list-main').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch, 'Saved Searches'));
  }

  /**
   * Register .result-list and .input-groups elements as draggable with "Move" button.
   */
  dragula([document.querySelector('.result-lists')], { 
    moves: function (el, container, handle) {
      return handle.classList.contains('js-move');
    }
  });

  dragula([document.querySelector('.input-groups')], { 
    moves: function (el, container, handle) {
      return handle.classList.contains('js-move');
    }
  });
});