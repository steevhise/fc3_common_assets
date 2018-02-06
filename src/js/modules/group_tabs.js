/**
* Note: this file is provided by the fc3_common_assets package
 */
document.addEventListener("DOMContentLoaded", ()=> {
	// define tabRoot to ensure strict scoping
	const tabRoot = $('#g-example-tabs');

	let setActiveTab = function (elm) {
		$(elm).attr('aria-selected', 'true');
		$(elm).closest('li').addClass('is-active');
	};

	// strip off group id from path
	var path = document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/"));

	switch (path) {
		case '/town':
			setActiveTab('#group_posts');
			break;
		case '/town/guidelines':
			setActiveTab('#group_guidelines');
			break;
		case '/town/announcements':
			setActiveTab('#group_announcements');
			break;
		case '/town/contact':
			setActiveTab('#group_contact');
			break;
		case '/town/info':
			setActiveTab('#group_info');
			break;
	}
});

export default "GroupTabs";
