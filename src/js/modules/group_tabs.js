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
	const path = document.location.pathname;
	const ids = path.match(/\d+/g);
	const groupId = ids[0];
	const noticeId = ids[1];

	switch (path) {
		case `/town/${groupId}`:
			setActiveTab('#group_posts');
			break;
		case `/town/${groupId}/notices`:
			setActiveTab('#group_notices');
			break;
		case `/town/${groupId}/notices/${noticeId}`:
			setActiveTab('#group_notices');
			break;
		case `/town/${groupId}/contact`:
			setActiveTab('#group_contact');
			break;
		case `/town/${groupId}/info`:
			setActiveTab('#group_info');
			break;
	}
});

export default "GroupTabs";
