 <!--Note: this file is provided by the fc3_common_assets package */-->
<template>
    <div class="ckeditor">
        <textarea :name="name" :id="id" :value="value" :types="types" :config="editorConfig" :placeholder="placeholder" ></textarea>
    </div>
</template>

<script>
    let inc = 0;
    let CKEDITOR_BASEPATH = '/ckeditor/';
    let defaultConfig = {
        toolbar: [
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'RemoveFormat' ] }
        ],
        removePlugins: 'elementspath',
        entities: false,
        height: 300
    };

export default {
    name : 'fc-editor',
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
        },
        editorConfig() {
              console.log(defaultConfig, this.config);
              console.log(Object.assign(defaultConfig, this.config));
            return Object.assign(defaultConfig, this.config);
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
                CKEDITOR.inline(this.id, this.editorConfig);
            } else {
                CKEDITOR.replace(this.id, this.editorConfig);
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
