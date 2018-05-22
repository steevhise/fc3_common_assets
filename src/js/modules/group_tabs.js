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

	const path = document.location.pathname;

	if (tabRoot) {
		if (/\/town\/\w+$/.test(path)) {
			setActiveTab('#group_posts');
		} else if (/\/town\/\w+\/notices(\/\w+)?$/.test(path) ) {
			setActiveTab('#group_notices');
		} else if (/\/town\/\w+\/info$/.test(path)) {
			setActiveTab('#group_info');
		} else if (/\/town\/\w+\/contact$/.test(path)) {
			setActiveTab('#group_contact');
		}
	}

});

export default "GroupTabs";
