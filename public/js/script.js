(function() {
	// Add click handling to inputs rendered server side
	(function() {
		let thisInput, mainTerm, newTerm;
		document.querySelectorAll('.input-group').forEach(elm => {
			thisInput = elm.querySelector('input[type="text"]');
			elm.querySelector('.js-add-main').addEventListener('click', e => {
				e.preventDefault();
				mainTerm = document.querySelector(`input[name="main"]`).value;
				newTerm = thisInput.value;
				if (mainTerm !== "") {
					thisInput.value = `${mainTerm} ${newTerm}`;
				}
			});
	
			elm.querySelector('.js-remove').addEventListener('click', function(e) {
				elm.remove();
			});
		});	
	})();

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

	function findParent(child, parentClass) {
		if (child.parentElement.classList.contains(parentClass)) {
			return child.parentElement;
		}
		return findParent(child.parentElement, parentClass);
	}

	document.getElementById('add-term').addEventListener('click', function() {
		document.querySelector('.search-terms').appendChild(createInputGroup());
	});

	document.querySelectorAll('.js-collapse').forEach(function(elm) {
		elm.addEventListener('click', function() {
			parentElm = findParent(this, 'result-list');
			if (this.getAttribute('data-collapse') === 'show') {
				this.setAttribute('data-collapse', 'hide');
				this.innerText = 'Expand';
				parentElm.querySelectorAll('.result-item').forEach(function(el) {
					el.style.display = "none";
				});
			}
			else {
				this.setAttribute('data-collapse', 'show');
				this.innerText = 'Collapse';
				parentElm.querySelectorAll('.result-item').forEach(function(el) {
					el.style.display = "block";
				});
			}
		});
	});

	(function() {
		var parentElm;
		document.querySelectorAll('.js-toggle-descriptions').forEach(function(elm) {
			elm.addEventListener('click', function() {
				parentElm = findParent(this, 'result-list');
				if (this.getAttribute('data-descriptions') === 'hide') {
					this.setAttribute('data-descriptions', 'show');
					this.innerText = '-';
					parentElm.querySelectorAll('.description').forEach(function(description) {
						description.style.display = 'block';
					});
				}
				else {
					this.setAttribute('data-descriptions', 'hide');
					this.innerText = '+';
					parentElm.querySelectorAll('.description').forEach(function(description) {
						description.style.display = 'none';
					});
				}
			});
		});
	})();

	dragula([document.querySelector('.result-lists')],  { 
		moves: function (el, container, handle) {
			return handle.classList.contains('js-move');
		}
  });
})();
