import { ComponentLib } from '@freecycle/fc3_common_assets/src/js/modules';

//components
import Modal from '../components/Modal.vue';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';

ComponentLib.registerElement('fc-modal', Modal);
ComponentLib.registerElement('fc-login', Login);
ComponentLib.registerElement('fc-signup', Signup);