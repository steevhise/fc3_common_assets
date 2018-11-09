// TODO Can refactor to use jQuery if desired; didn't because access native Web APIs
// Figured it's better to go all one style and since that forced going native, went all native. Sorry! Up for debate :)

// UI based on: https://scotch.io/tutorials/how-to-handle-file-uploads-in-vue-2#file-upload-service

// WARNING
// - Assumes only 1 form on the page; will have to refactor to accommodate multiple, if any cases of that
// - Assumes form will post to current page (uses window.location in XHR); totally easy to reconfigure

/***** INSTRUCTIONS FOR ADDING TO A PAGE ****/
/*
    Given the page has 1 and only 1 form element
    1. Include partial somewhere in page's form
    2. Add image-upload-form to form element's class attribute (see constructor call at bottom of file)
    3. Add a div somewhere near the top of the page with the form-errors-container class
*/
class ImageUploader {

    constructor({ imageForm, uploadedFilesContainer, uploadLimit = 3, uploadErrors, formErrors, requestType }) {

        if (!imageForm || !uploadedFilesContainer || !uploadErrors || !formErrors || !requestType) {
            throw new Error('Image Uploader couldn\'t be initialized; some required arguments were missing.');
        }

        let postId;
        if (requestType === 'post') {
            postId = location.pathname.match(/post\/(\d+)/)[1];
        }

        const UPLOAD_API_ENDPOINTS = {
            newPost: 'images/post',
            // DEPENDS ON POST ID BEING PRESENT IN URL OF PAGE ON WHICH EXISTING POST UPDATE FORM IS SET
            post: `images/post/${postId}`,
            user: 'images/user'
        };

        this.form = imageForm;
        this.uploadedFilesContainer = uploadedFilesContainer;
        this.uploadLimit = uploadLimit;
        this.uploadErrors = uploadErrors;
        this.formErrors = formErrors;
        this.filesList = [];
        this.submitEndpoint = UPLOAD_API_ENDPOINTS[requestType];
        // We do this to allow removing listeners (which we do for every request type except new posts)
        // Removing event listeners requires the inputting the same function as used to add the listener
        // This config gives us an easy reference to that input
        this.listeners = {
            fileInput: this.handleFileInput.bind(this),
            submit: this.handleSubmit.bind(this),
            newPostSubmit: this.handleNewPostSubmit.bind(this)
        };

        // Event handlers are bound to ImageUploader, as otherwise, this would refer to the node on which the listener is registered
        document.querySelector('#images').addEventListener('change', this.listeners.fileInput);
        document.querySelector('.image-upload-form').addEventListener('submit', requestType === 'newPost' ? this.listeners.newPostSubmit : this.listeners.submit);

        // Load any detected files into filesList (in the case of editing)
        const currentUploads = Array.from(this.uploadedFilesContainer.children);

        if (currentUploads.length) {

            this.deletedImages = [];

            // Sync push and display ordering, which should happen by default given that images
            // are displayed before we do this i.e. set in template
            // WARNING This expects any view that loads in images e.g. edit post to markup those image blocks
            // like we do when we manually create them in displayImage
            const self = this;
            currentUploads.forEach(function(imgBlock) {
                const img = imgBlock.querySelector('img');
                const deleteButton = imgBlock.querySelector('.del-img');

                self.filesList.push({ file: img.src, rotation: 0 }); // fill upload queue with bunk placeholders; submit routine will check for these
                deleteButton.addEventListener('click', self.deleteUpload.bind(self)); // `this` is expected to be ImageUploader instance, bind to replace event target as this value

                const rotateClockwiseButton = imgBlock.querySelector('.rotate-clockwise');
                const rotateCounterClockwiseButton = imgBlock.querySelector('.rotate-counterclockwise');

                rotateClockwiseButton.addEventListener('click', (e) => {

                    e.preventDefault();
                    // NOTE Called here so reflective of state of elements at call time, not init time; is that right / necessary?
                    const uploadOrder = imgBlock.dataset.uploadOrder;
                    self.rotateImage(90, uploadOrder);
                });
                rotateCounterClockwiseButton.addEventListener('click', (e) => {

                    e.preventDefault();

                    const uploadOrder = imgBlock.dataset.uploadOrder;
                    self.rotateImage(-90, uploadOrder);
                });
            });

            // disable input if full
            if (currentUploads.length === this.uploadLimit) {
                const input = document.querySelector('#images');
                const enabledMsg = document.querySelector('.enabled-upload');
                const disabledMsg = document.querySelector('.disabled-upload');
                const dropbox = document.querySelector('.dropbox');

                input.setAttribute('disabled', 'disabled');
                enabledMsg.setAttribute('hidden', 'hidden');
                disabledMsg.removeAttribute('hidden');
                dropbox.style.backgroundColor = 'lightgray';
            }
        }

        const constraintsEl = document.querySelector('.image-uploader-rules');
        const constraintsText = document.createTextNode(`Up to ${this.uploadLimit} image${this.uploadLimit > 1 ? 's' : ''} allowed. Only jpg/jpegs and pngs.
            Images larger than 1MB will be scaled down for faster upload`);
        constraintsEl.appendChild(constraintsText);
    }


    displayError(msg, container) {

        const errEl = document.createElement('p');
        const errMsg = document.createTextNode(msg);
        errEl.setAttribute('class', 'callout alert');
        errEl.appendChild(errMsg);
        container.appendChild(errEl);
    }

    // uploadOrder is the index in ImageUploader.filesList at which the image was inserted
    displayImage(src, uploadOrder) {
        // Display image block w/ delete button
        // Register click listener on delete button
        const self = this;
        const block = document.createElement('div');
        const img = document.createElement('img');
        const deleteButton = document.createElement('button');
        const rotateClockwiseButton = document.createElement('button');
        const rotateCounterClockwiseButton = document.createElement('button');
        const rotationContainer = document.createElement('div');

        img.src = src;
        block.setAttribute('data-upload-order', uploadOrder);
        block.setAttribute('class', 'img-block');
        deleteButton.setAttribute('class', 'btn-default del-img');
        deleteButton.setAttribute('type', 'button'); // turn off any default behavior
        deleteButton.addEventListener('click', this.deleteUpload.bind(this)); // `this` is expected to be ImageUploader instance, bind to replace event target as this value
        deleteButton.innerHTML = 'Remove';


        rotateClockwiseButton.setAttribute('class', 'btn-default rotate-clockwise');
        rotateCounterClockwiseButton.setAttribute('class', 'btn-default rotate-counterclockwise');
        rotateClockwiseButton.appendChild(document.createTextNode('Clockwise'));
        rotateCounterClockwiseButton.appendChild(document.createTextNode('Counter-clockwise'));
        rotateClockwiseButton.addEventListener('click', (e) => {

            e.preventDefault();
            // NOTE Called here so reflective of state of elements at call time, not init time; is that right / necessary?
            const uploadOrder = block.dataset.uploadOrder;
            self.rotateImage(90, uploadOrder);
        });
        rotateCounterClockwiseButton.addEventListener('click', (e) => {

            e.preventDefault();

            const uploadOrder = block.dataset.uploadOrder;
            self.rotateImage(-90, uploadOrder);
        });
        rotationContainer.setAttribute('class', 'rotate-buttons');
        rotationContainer.appendChild(rotateCounterClockwiseButton);
        rotationContainer.appendChild(rotateClockwiseButton);

        block.appendChild(img);
        block.appendChild(rotationContainer);
        block.appendChild(deleteButton);
        this.uploadedFilesContainer.appendChild(block);
    }

    deleteUpload(e) {

        e.preventDefault();

        // WARNING: This assumes that ImageUploader.fileList and blocks in .uploaded-files are ordered identically
        // Files will be deleted incorrectly if this assumption proves wrong... hmmm
        const imgBlock = e.currentTarget.parentNode; // parent of button clicked i.e. image block div
        const imgRow = imgBlock.parentNode;
        const delIndex = imgBlock.dataset.uploadOrder;


        // Case of a pre-existing image i.e. where item in queue is a string
        // Later used to diff images in db w/ images sent back from edit form
        if (typeof this.filesList[delIndex].file === 'string'){
            // regex is likely overkill; just searching for a sequence of digits should be fine, just felt afraid of potential false positives??? :)
            this.deletedImages.push(this.filesList[delIndex].file.match(/(images|user)\/(\d+)\/?/)[2]);
        }

        // Remove the image from the upload queue
        this.filesList.splice(delIndex, 1);

        // Remove the image block from the UI
        imgBlock.parentNode.removeChild(imgBlock);

        // Sync tracked positions w/ filesList array
        Array.from(imgRow.children).forEach((block) => {
            if (block.dataset.uploadOrder < delIndex) {
                return;
            }
            block.dataset.uploadOrder--;
        });

        // Re-enable uploader if now less than set limit # of images uploaded
        if (this.filesList.length < this.uploadLimit) {
            const enabledMsg = document.querySelector('.enabled-upload');
            const disabledMsg = document.querySelector('.disabled-upload');
            const dropbox = document.querySelector('.dropbox');
            const input = document.querySelector('#images');

            input.removeAttribute('disabled');
            disabledMsg.setAttribute('hidden', 'hidden');
            enabledMsg.removeAttribute('hidden');
            dropbox.style.backgroundColor = 'lightcyan';
        }
    }

    handleFileInput(e) {

        e.preventDefault();

        const uploadErrContainer = this.uploadErrors;
        const self = this;

        // Reset error display
        while (uploadErrContainer.firstChild) {
            uploadErrContainer.removeChild(uploadErrContainer.firstChild);
        }

        // TODO Sensible way to handle this case? Error messaging?
        // TODO Move higher up the call chain? If no HTML5 APIs detected, bail on init, disable files input and display message
        if (!e.target.files || !window.FileReader) {
            console.error('Current browser doesn\'t support the native FileReader API, which the image uploader depends on');
            return;
        }

        // Should never be hit, with the input being disabled on this condition in the loop below; totally defensive
        if (this.filesList.length === this.uploadLimit) {
            return this.displayError('You\'ve already uploaded max allowed images', uploadErrContainer);
        }

        // Validate newly uploaded file(s)
        // If a file doesn't end up in ImageUploader.filesList, it won't be sent to the server
        const files = e.target.files;
        const filesArr = Array.from(files);

        filesArr.forEach(function(f) {

            if (f.type.match(/image\/(jpeg|png)/) === null) {
                return this.displayError(`We can't process ${f.name} because it's a ${f.type}. Retry uploading with a jpg or png image. Sorry!`, uploadErrContainer);
            }

            // User's attempting to upload > uploadLimit images at once
            if (this.filesList.length === this.uploadLimit) {
                return this.displayError(`Upload for ${f.name} failed; you've already uploaded ${this.uploadLimit} images`, uploadErrContainer);
            }

            // Store each newly uploaded file because each upload attempt i.e. drag once, then drag another, overwrites the input's file list
            const numUploads = this.filesList.push({ file: f, rotation: 0 });

            // Disable the uploader if limit has been reached
            if (numUploads === this.uploadLimit) {
                const input = document.querySelector('#images');
                const enabledMsg = document.querySelector('.enabled-upload');
                const disabledMsg = document.querySelector('.disabled-upload');
                const dropbox = document.querySelector('.dropbox');

                input.setAttribute('disabled', 'disabled');
                enabledMsg.setAttribute('hidden', 'hidden');
                disabledMsg.removeAttribute('hidden');
                dropbox.style.backgroundColor = 'lightgray';
            }

            // Display thumbnail of successfully-uploaded image
            const reader = new FileReader();
            reader.onload = function (e) {
                // we pass the index of filesList at which the new image was inserted
                // so we can track and identify images (in case of deletion) independent of load order i.e. in-sync with filesList order
                const dataURL = e.target.result;
                self.displayImage(dataURL, numUploads - 1);

                // Resize images larger than our 1MB / image limit
                // NOTE We resize just the file stored in ImageUploader.filesList i.e. the image we send to the server
                // This doesn't care about the preview image rendered via displayImage; we don't care about that because it's just a preview
                if (f.size > 1048576) {
                    self.resizeImage(dataURL, f, numUploads - 1);
                }
            };
            reader.readAsDataURL(f);
        }, self /* ensures instance of ImageUploader is the `this` value w/in callback */);

    }

    handleNewPostSubmit(e) {

        e.preventDefault();
        const self = this; // expected to be instance of ImageUploader

        // Reset the form validation errors
        while (this.formErrors.firstChild) {
            this.formErrors.removeChild(this.formErrors.firstChild)
        }

        // Get all form data except images
        const body = new FormData(self.form);
        body.delete('images');

        // TODO Do something more abstract / intelligent here
        // This accesses the value of the CKEDITOR Vue component, which isn't set on the FormData object
        // editor-0 is the default editor name (as configured in fc3_common_assets Editor.vue component)
        // This access is reliable ASSUMING only 1 instance per page ... sorry
        // https://docs.ckeditor.com/ckeditor4/latest/guide/dev_savedata.html
        /* eslint-disable no-undef */
        if (CKEDITOR.instances['editor-0']) {
            body.set('description', CKEDITOR.instances['editor-0'].getData());
        }
        /* eslint-enable no-undef */

        // Get image-only form data
        const imgUploadBody = new FormData;
        imgUploadBody.set('type', body.get('type'));

        this.filesList.forEach(({ file }, index) => {

            if (typeof file === 'string') { // The case of a loaded image e.g. on edit, where we fill filesList w/ src's of previously set images
                return;
            }

            if (index === 0) {
                return imgUploadBody.set('images', file, file.name);
            }

            return imgUploadBody.append('images', file, file.name);
        });

        imgUploadBody.set('rotations', JSON.stringify(this.filesList.map(({ file, rotation }) => {

            // Setting id allows reliable lookup of img on backend
            // Object is used for updating uploaded images in place
            if (typeof file === 'string') {
                return {
                    rotation: rotation,
                    imageId: file.match(/(images|user)\/(\d+)\/?/)[2]
                };
            }

            return rotation;
        })));

        const newPostReq = new XMLHttpRequest();

        newPostReq.open('POST', `${location.origin}/home/new-post`);
        newPostReq.addEventListener('load', function () {

            if (newPostReq.status !== 200) {

                const resp = JSON.parse(newPostReq.responseText);
                const errors = [].concat(Array.isArray(resp.errors) ? resp.errors : resp);
                errors.forEach((e) => {
                    self.displayError(e.message, self.formErrors);
                    $('[data-loading].is-loading').removeClass('is-loading');
                });

                return window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }

            const { postId } = JSON.parse(newPostReq.responseText);
            const imgUploadReq = new XMLHttpRequest();
            imgUploadReq.open('POST', `${location.origin}/api/${self.submitEndpoint}/${postId}`);
            imgUploadReq.addEventListener('load', function () {

                if (imgUploadReq.status !== 200) {

                    const resp = JSON.parse(imgUploadReq.responseText);
                    const errors = [].concat(Array.isArray(resp.errors) ? resp.errors : resp);
                    errors.forEach((e) => {
                        self.displayError(e.message, self.formErrors);
                        $('[data-loading].is-loading').removeClass('is-loading');
                    });

                    return window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                }

                // ON SUCCESS, REDIRECT TO /posts/postId
                location.assign(`${location.origin}/posts/${postId}`);
            });

            imgUploadReq.addEventListener('error', function (err) {
                self.displayError(err.message, "We couldn't create your post due to an issue with the network. Check your internet connection and if that's all good, try back later. Sorry!");
                $('[data-loading].is-loading').removeClass('is-loading');

                return window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }.bind(self));

            // SUBMIT IMAGES TO POST IMG ROUTE
            imgUploadReq.send(imgUploadBody);
        });
        // Network error
        newPostReq.addEventListener('error', function (err) {
            self.displayError(err.message, "We couldn't create your post due to an issue with the network. Check your internet connection and if that's all good, try back later. Sorry!");
            $('[data-loading].is-loading').removeClass('is-loading');

            return window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }.bind(self));

        // SUBMIT TO ROUTE, RECEIVE BACK POST ID
        newPostReq.send(body);
    }

    handleSubmit(e) {

        e.preventDefault();
        const self = this; // expected to be instance of ImageUploader

        const body = new FormData();

        // Reset the form validation errors
        while (this.formErrors.firstChild) {
            this.formErrors.removeChild(this.formErrors.firstChild)
        }

        // On edit form, send back ids of any previously set images that were deleted
        if (this.deletedImages && this.deletedImages.length) {
            // Server expects ids to be numbers, not strings
            body.set('deletedImages', JSON.stringify(this.deletedImages.map((id) => Number(id))));
        }

        this.filesList.forEach(({ file }, index) => {

            if (typeof file === 'string') { // The case of a loaded image e.g. on edit, where we fill filesList w/ src's of previously set images
                return;
            }

            if (index === 0) {
                return body.set('images', file, file.name);
            }

            return body.append('images', file, file.name);
        });

        body.set('rotations', JSON.stringify(this.filesList.map(({ file, rotation }) => {

            // Setting id allows reliable lookup of img on backend
            // Object is used for updating uploaded images in place
            if (typeof file === 'string') {
                return {
                    rotation: rotation,
                    imageId: file.match(/(images|user)\/(\d+)\/?/)[2]
                };
            }

            return rotation;
        })));

        const req = new XMLHttpRequest();
        // TODO Make more easily configurable
        req.open('POST', `${location.origin}/api/${self.submitEndpoint}`);
        req.addEventListener('load', function () {

            if (req.status !== 200) {

                const resp = JSON.parse(req.responseText);
                const errors = [].concat(Array.isArray(resp.errors) ? resp.errors : resp);
                errors.forEach((e) => {
                    self.displayError(e.message, self.formErrors);
                    $('[data-loading].is-loading').removeClass('is-loading');
                });

                return window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }

            // On successfully uploading images, submit the rest of the form data to our non-API route
            document.querySelector('.image-upload-form').removeEventListener('submit', self.listeners.submit);
            // Excludes images from form submission to non-API route
            document.querySelector('.image-upload-form input[name=images]').remove();

            // Sorry, sucks; accounts for different submit buttons across forms
            document.querySelector('.image-upload-form input[type=submit], .image-upload-form button[type=submit]').click();
        });

        // Network error
        req.addEventListener('error', function (err) {
            self.displayError(err.message, "We couldn't create your post due to an issue with the network. Check your internet connection and if that's all good, try back later. Sorry!");
            $('[data-loading].is-loading').removeClass('is-loading');

            return window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }.bind(self));

        req.send(body);
    }

    // Adapted from Steev's work on legacy (for reference: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/ )
    // Cuts down images larger than 1MB to an acceptable size
    resizeImage(dataURL, file, uploadOrder) {

        const self = this; // expected to be active ImageUploader instance

        const tempImg = new Image();
        tempImg.src = dataURL;
        tempImg.addEventListener('load', function() {

            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 600;
            let tempW = tempImg.width;
            let tempH = tempImg.height;

            // Scale image to MAX dimensions according to its original aspect ratio
            if (tempW > tempH) {
                if (tempW > MAX_WIDTH) {
                   tempH *= MAX_WIDTH / tempW;
                   tempW = MAX_WIDTH;
                }
            } else {
                if (tempH > MAX_HEIGHT) {
                   tempW *= MAX_HEIGHT / tempH;
                   tempH = MAX_HEIGHT;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = tempW;
            canvas.height = tempH;

            const ctx = canvas.getContext('2d');
            // Proportionally resize image on canvas
            ctx.drawImage(tempImg, 0, 0, tempW, tempH);

            canvas.toBlob(function(blob) {

                const resizedFile = new File([blob], file.name, { type: file.type });

                // replace file in filesList w/ new file, ensuring resized file,
                // not originally-sized (too large) file is sent to the server
                self.filesList.splice(uploadOrder, 1, { file: resizedFile, rotation: 0 });
            }, file.type);
        })
    }

    rotateImage(rotation, uploadOrder) {

        // track rotation
        const currentRotation = this.filesList[uploadOrder].rotation;
        const isFull = Math.abs(rotation % 360);
        this.filesList[uploadOrder].rotation = isFull !== 0 ? currentRotation + rotation : 0;
        document.querySelector('[data-upload-order="' + uploadOrder + '"]').querySelector('img').style.transform = `rotate(${currentRotation + rotation}deg)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.image-upload-form')) {

        try {
            // image uploader MUST be registered on a form element enclosing the uploader element
            const imageForm = document.querySelector('form.image-upload-form');
            new ImageUploader({
                imageForm,
                uploadedFilesContainer: document.querySelector('.uploaded-files'),
                uploadLimit: imageForm.dataset.uploadLimit && Number.parseInt(imageForm.dataset.uploadLimit, 10),
                uploadErrors: document.querySelector('.upload-errors-container'),
                formErrors: document.querySelector('.form-errors-container'),
                requestType: imageForm.dataset.requestType
            });
        } catch (error) {
            console.warn('Image Uploader not intialized'); // eslint-disable-line no-console
        }
    }
});

export default ImageUploader;
