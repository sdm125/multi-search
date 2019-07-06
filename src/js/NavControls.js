class NavControls {
	static openNav() {
		let navToggleBtn = document.querySelector('.nav-toggle');
		document.querySelector('.modal-container').classList.remove('hide');
		navToggleBtn.setAttribute('data-toggle', 'open');
		navToggleBtn.src = '/icons/x.svg';
		document.querySelector('.menu').classList.add('active');
	}

	static closeNav(hideModal) {
		let navToggleBtn = document.querySelector('.nav-toggle');
		if (hideModal) document.querySelector('.modal-container').classList.add('hide');
		navToggleBtn.setAttribute('data-toggle', 'closed');
		navToggleBtn.src = '/icons/menu.svg';
		document.querySelector('.menu').classList.remove('active');
	}
	
	static init() {
		/**
		 * Nav toggle
		 */
		document.querySelector('.nav-toggle').addEventListener('click', function() {
			this.getAttribute('data-toggle') === 'closed' ? NavControls.openNav() : NavControls.closeNav(true);
		});
	}
}