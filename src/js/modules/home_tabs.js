/**
* Note: this file is provided by the fc3_common_assets package
 */
document.addEventListener("DOMContentLoaded", ()=> {
	// define tabRoot to ensure strict scoping
	const tabRoot = $('#h-example-tabs');

	let setActiveTab = function (elm) {
		$(elm).attr('aria-selected', 'true');
		$(elm).closest('li').addClass('is-active');
	};

	switch (document.location.pathname) {
		case '/home/dashboard':
			setActiveTab('#dashboard');
			break;
		case '/home/my-replies':
			setActiveTab('#my-replies');
			break;
		case '/home/my-posts':
			setActiveTab('#my-posts');
			break;
		case '/home/my-friends':
			setActiveTab('#my-friends');
			break;
		case '/home/my-friends/find': // TODO Refactor to be more flexible if more sub-pages added
			setActiveTab('#my-friends');
			break;
		case '/home/my-towns':
			setActiveTab('#my-groups');
			break;

	}

});

export default "HomeTabs";
