document.addEventListener("DOMContentLoaded", () => {

    let input = $('#profile-pic-upload');
    let preview = $('#profile-upload-preview');

    if (input.length && preview.length) {

        // Get the raw DOM element for input b/c we need to mess w/ files API
        input.change(() => preview.attr('src', window.URL.createObjectURL(input[0].files[0])));
    }
});

// export a constant, placeholder
export default "PROFILE_IMAGE_UPLOAD";
