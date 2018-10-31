document.addEventListener('DOMContentLoaded', () => {
	$('.fab').on('click', function() {
		$(this).toggleClass('open');
		$(this).find('.text').toggleClass('open');
		$('.option').toggleClass('open');
		$('.close').toggleClass('open');
	});
});
export default 'FAB';