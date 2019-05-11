document.addEventListener('DOMContentLoaded', () => {
  Search.initSearchControls();
  Nav.init();
  
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