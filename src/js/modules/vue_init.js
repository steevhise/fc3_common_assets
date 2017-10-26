import Vue from 'vue';
import VueCustomElement from 'vue-custom-element';
import { EventBus } from '../components/EventBus';

// common components
import Test from '../components/Test.vue';
import Editor from '../components/Editor.vue';
import FormButton from '../components/FormButton.vue';
import Form from '../components/Form.vue';
import Callout from '../components/Callout.vue';

Vue.use(VueCustomElement);

export class ComponentRegistry {
	constructor() {
		this._components = [];
		this.bus = EventBus;
	}
	registerElement(name, element) {
		Vue.customElement(name, element);
		this._components.push({name,element})
	};
}

export const ComponentLib = new ComponentRegistry();
ComponentLib.registerElement('fc-test', Test);
ComponentLib.registerElement('fc-formbutton', FormButton);
ComponentLib.registerElement('fc-form', Form);
ComponentLib.registerElement('fc-callout', Callout);
ComponentLib.registerElement('fc-editor', Editor);