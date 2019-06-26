document.addEventListener('DOMContentLoaded', () => {
  Search.initSearchControls();
  NavControls.init();
  ModalControls.init();
  Settings.init();

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
    new InputGroup(thisInputGroup.name, thisInputGroup.value, thisInputGroup);
  });

  /**
   * Add saved search list component to home
   */
  if (window.location.pathname === '/' && StorageHelper.getAllSavedSearches().length > 0) {
    document.querySelector('.saved-search-list-main').appendChild(StorageHelper.getAllSavedSearchesListElm(StorageHelper.loadSavedSearch, 'Saved Searches', false));
  }

  /**
   * Hide combine dropdown if open and click away
   */
  document.addEventListener('click', () => {
    InputGroup.inputGroups.forEach(ip => {
      ip.hideCombineDropDown();
    });
  });

  /**
   * Prevent form submit if single search empty input
   */
  document.getElementById('search-form').addEventListener('submit', function(e) {
    let searches = document.querySelectorAll('.search');

    if (searches.length === 1 && searches[0].value === '') {
      e.preventDefault();
    }
  });

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