// setup
document.addEventListener("DOMContentLoaded", ()=> {

  $(".select-new-post-tags").select2();

  const OFFER = 1;
  const WANTED = 3;
  const LEND = 9;
  const BORROW = 10;

  const typeInput = $(".new_post input[name=type]").first();

  if (!typeInput.length) {
    return;
  }

  const getGroupForField = (field) => $('.new_post').find(`input[name=${field}], select[name=${field}]`).first().closest('.form-group');

  const updateFieldVisibility = () => {

    const value = typeInput.val();

    switch (Number(value)) {
      case OFFER:
        getGroupForField('images').show();
        getGroupForField('town').show();
        break;
      case WANTED:
        getGroupForField('images').hide();
        getGroupForField('town').show();
        break;
      case LEND:
        getGroupForField('images').show();
        getGroupForField('town').hide();
        break;
      case BORROW:
        getGroupForField('images').hide();
        getGroupForField('town').hide();
        break;
      default:
        console.warn('Unrecognized post type', value);
    }
  };

  updateFieldVisibility();
  typeInput.on('input', updateFieldVisibility);
});


// export a constant, placeholder
export default "NEW_POST";
