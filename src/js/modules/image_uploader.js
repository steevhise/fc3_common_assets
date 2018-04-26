// TODO Can refactor to use jQuery if desired; didn't because access native Web APIs
// Figured it's better to go all one style and since that forced going native, went all native. Sorry! Up for debate :)
class ImageUploader {

    constructor(form, uploadedFiles, uploadErrors, formErrors) {

        if (!form || !uploadedFiles || !uploadErrors || !formErrors) {
            throw new Error('Image Uploader couldn\'t be initialized; some required arguments were missing.');
        }

        this.form = form;
        this.uploadedFiles = uploadedFiles;
        this.uploadErrors = uploadErrors;
        this.formErrors = formErrors;
        this.filesList = [];

        // Load any detected files into filesList (in the case of editing)
        // TODO Add loading current images to init routine e.g. on edit
        // Add images via template; loop over, add to uploadList, poop in your pants
        const currentUploads = Array.from(this.uploadedFiles.children);
        if (currentUploads.length) {

            // Sync push and display ordering, which should happen by default given that images
            // are displayed before we do this i.e. set in template
            // TODO handle data-attributes in template?
            const self = this;
            currentUploads.forEach(function(up, index) {
                this.filesList.push(up.src); // fill upload queue with bunk placeholders; submit routine will check for these
                up.dataset.uploadOrder = index;
                this.displayImage(up.src, index)
            }.bind(self));

            // disable input if full
            if (currentUploads.length === 3) {
                const enabledMsg = document.querySelector('.enabled-upload');
                const disabledMsg = document.querySelector('.disabled-upload');
                const dropbox = document.querySelector('.dropbox');
                const input = document.querySelector('#images');

                images.setAttribute('disabled', 'disabled');
                enabledMsg.setAttribute('hidden', 'hidden');
                disabledMsg.removeAttribute('hidden');
                dropbox.style.backgroundColor = 'lightgray';
            }
        }
    }


    displayError(msg, container) {

        const errEl = document.createElement('p');
        const errMsg = document.createTextNode(msg);
        errEl.setAttribute('class', 'callout alert');
        errEl.appendChild(errMsg);
        container.appendChild(errEl);
    }

    // insertOrder is the index in ImageUploader.filesList at which the image was inserted
    displayImage(src, uploadOrder) {
        // Display image block w/ delete button
        // Register click listener on delete button
        const block = document.createElement('div');
        const img = document.createElement('img');
        const deleteButton = document.createElement('button');

        img.src = src;
        block.setAttribute('data-upload-order', uploadOrder);
        block.setAttribute('class', 'img-block');
        deleteButton.setAttribute('class', 'btn-default del-img');
        deleteButton.setAttribute('type', 'button'); // turn off any default behavior
        deleteButton.addEventListener('click', this.deleteUpload.bind(this)); // `this` is expected to be ImageUploader instance, bind to replace event target as this value
        deleteButton.innerHTML = 'Remove';

        block.appendChild(img);
        block.appendChild(deleteButton);
        this.uploadedFiles.appendChild(block);
    }

    deleteUpload(e) {

        // WARNING: This assumes that ImageUploader.fileList and blocks in .uploaded-files are ordered identically
        // Files will be deleted incorrectly if this assumption proves wrong... hmmm
        const imgBlock = e.currentTarget.parentNode; // parent of button clicked i.e. image block div
        const imgRow = imgBlock.parentNode;
        const delIndex = imgBlock.dataset.uploadOrder

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

        // Re-enable uploader if now less than 3 images uploaded
        if (this.filesList.length < 3) {
            const enabledMsg = document.querySelector('.enabled-upload');
            const disabledMsg = document.querySelector('.disabled-upload');
            const dropbox = document.querySelector('.dropbox');
            const input = document.querySelector('#images');

            images.removeAttribute('disabled');
            disabledMsg.setAttribute('hidden', 'hidden');
            enabledMsg.removeAttribute('hidden');
            dropbox.style.backgroundColor = 'lightcyan';
        }
    }

    handleFileInput(e) {

        const uploadErrContainer = this.uploadErrors;
        const self = this;

        // Reset error display
        while (uploadErrContainer.firstChild) {
            uploadErrContainer.removeChild(uploadErrContainer.firstChild);
        }

        // TODO Sensible way to handle this case? Error messaging?
        if (!e.target.files || !window.FileReader) {
            return;
        }

        // Should never be hit, with the input being disabled on this condition in the loop below; totally defensive
        if (this.filesList.length === 3) {
            return this.displayError('You\'ve already uploaded max allowed images', uploadErrContainer);
        }

        // Validate newly uploaded file(s)
        // If a file doesn't end up in ImageUploader.filesList, it won't be sent to the server
        const files = e.target.files;
        const filesArr = Array.from(files);

        filesArr.forEach(function(f, index) {

            if (f.type.match(/image\/(jpeg|png)/) === null) {
                return this.displayError(`We can't process images in ${f.name}'s format. Retry uploading with a jpg or png image. Sorry!`, uploadErrContainer);
            }

            if (f.size > 1048576) {
                return this.displayError(`${f.name} is too big; can't exceed 1MB`, uploadErrContainer);
            }

            // User's attempting to upload >3 images at once
            if (this.filesList.length === 3) {
                return this.displayError(`Upload for ${f.name} failed; you've already uploaded 3 images`, uploadErrContainer);
            }

            // Store each newly uploaded file because each upload attempt i.e. drag once, then drag another,
            // overwrites the input's file list
            // Disable the uploader if limit has been reached
            const numUploads = this.filesList.push(f)
            if (numUploads === 3) {
                const enabledMsg = document.querySelector('.enabled-upload');
                const disabledMsg = document.querySelector('.disabled-upload');
                const dropbox = document.querySelector('.dropbox');
                const input = document.querySelector('#images');

                images.setAttribute('disabled', 'disabled');
                enabledMsg.setAttribute('hidden', 'hidden');
                disabledMsg.removeAttribute('hidden');
                dropbox.style.backgroundColor = 'lightgray';
            }

            // Display thumbnail of successfully-uploaded image
            const reader = new FileReader();
            reader.onload = function (e) {
                // we pass the index of filesList at which the new image was inserted
                // so we can track and identify images (in case of deletion) independent of load order i.e. in-sync with filesList order
                return self.displayImage(e.target.result, numUploads - 1);
            }
            reader.readAsDataURL(f);
        }, self /* ensures instance of ImageUploader is the this value w/in callback */);

    }

    handleSubmit(e) {

        e.preventDefault();
        const body = new FormData(this.form);
        const self = this; // expected to be instance of ImageUploader

        // Reset the form validation errors
        while (this.formErrors.firstChild) {
            this.formErrors.removeChild(this.formErrors.firstChild)
        }

        // TODO Handle case of editing...hmmm.....additions to filesList WON'T be files, just placeholders denoting
        // that there's an image present.... or, possible to

        // We overwrite copied data entirely and use filesList as source of truth
        body.delete('images');
        this.filesList.forEach((file, index) => {

            if (typeof file === 'string') { // The case of a loaded image e.g. on edit, where we file filesList w/ src's of previously set images
                return;
            }

            if (index === 0) {
                return body.set('images', file, file.name);
            }

            return body.append('images', file, file.name);
        });

        // This accesses the value of the CKEDITOR Vue component, which isn't set on the FormData object
        // editor-0 is the default editor name (as configured in fc3_common_assets Editor.vue component)
        // This access is reliable ASSUMING only 1 instance per page ... sorry
        // https://docs.ckeditor.com/ckeditor4/latest/guide/dev_savedata.html
        body.set('description', CKEDITOR.instances['editor-0'].getData());

        const req = new XMLHttpRequest();
        req.open('POST', '/home/new-post');
        req.addEventListener('load', function () {

            const resp = JSON.parse(req.responseText);

            if (!resp.ok) {
                resp.errors.forEach(function (err) {
                    this.displayError(err.message, this.formErrors);
                }.bind(self));

                return window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }

            location.assign(`${location.protocol}//${location.host}/posts/${resp.postId}`);
        });

        // Network error
        req.addEventListener('error', function (err) {
            this.displayError(err.message, "We couldn't create your post due to an issue with the network. Check your internet connection and if that's all good, try back later. Sorry!");
        }.bind(self));

        req.send(body);
    }
}

// Assumes only 1 form on the page; will have to refactor to accommodate multiple, if any cases of that
document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.image-upload-form')) {
        const imageUploader = new ImageUploader(
            document.querySelector('.image-upload-form'),
            document.querySelector('.uploaded-files'),
            document.querySelector('.upload-errors-container'),
            document.querySelector('.form-errors-container')
        );

        window.ImageUpload = imageUploader; // TODO Mock ; EXPECT index in fileslist = index in uploaded children array
        // Event handlers are bound to ImageUploader, as otherwise, this would refer to the node on which the listener is registered
        document.querySelector('#images').addEventListener('change', imageUploader.handleFileInput.bind(imageUploader));
        document.querySelector('.image-upload-form').addEventListener('submit', imageUploader.handleSubmit.bind(imageUploader));
    }
});

export default ImageUploader;
