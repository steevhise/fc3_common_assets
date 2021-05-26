const fabHandler = () => {
	$('.fab').on('click', function() {
		$(this).toggleClass('open');
		$(this).find('.text').toggleClass('open');
		$('.option').toggleClass('open');
		$('.close').toggleClass('open');
	});
}
document.addEventListener('DOMContentLoaded', fabHandler);
document.addEventListener('post-modal-loaded', fabHandler);
export default 'FAB';
