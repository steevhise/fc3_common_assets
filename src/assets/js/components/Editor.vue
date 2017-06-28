<template>
    <div class="ckeditor">
        <textarea :name="name" :id="id" :value="value" :types="types" :config="config" :placeholder="placeholder" ></textarea>
    </div>
</template>

<script>
let inc = 0;
let CKEDITOR_BASEPATH = '/ckeditor/';
let defaultConfig = {
    toolbar: [
        { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
        { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
        '/',
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
        '/',
        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
        { name: 'about', items: [ 'About' ] }
    ],
    height: 300
};

export default {
    props: {
        name: {
            type: String,
            default: () => `editor-${++inc}`
        },
        value: {
            type: String
        },
        id: {
            type: String,
            default: () => `editor-${inc}`
        },
        types: {
            type: String,
            default: () => `classic`
        },
        config: {
            type: Object,
            default: () => defaultConfig
        },
        placeholder: {
            type: String
        }
    },
    computed: {
        instance() {
            return CKEDITOR.instances[this.id];
        }
    },
    beforeUpdate() {
        if (this.value !== this.instance.getData()) {
            this.instance.setData(this.value);
        }
    },
    mounted() {
        if (typeof CKEDITOR === 'undefined') {
            console.log('CKEDITOR is undefined');
        } else {
            if (this.types === 'inline') {
                CKEDITOR.inline(this.id, this.config);
            } else {
                CKEDITOR.replace(this.id, this.config);
            }
            this.instance.on('change', () => {
                let html = this.instance.getData();
                if (html !== this.value) {
                    this.$emit('input', html);
                }
            })
        }
    },
    beforeDestroy() {
        if (this.instance) {
            this.instance.focusManager.blur(true);
            this.instance.removeAllListeners();
            this.instance.destroy();
            this.instance = null;
        }
    }
};
</script>

<style>
.ckeditor::after {
    content: "";
    display: table;
    clear: both;
}
</style>