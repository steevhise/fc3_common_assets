// setup
document.addEventListener("DOMContentLoaded", ()=> {

  $(".select-new-post-tags").select2();

  const OFFER = 1;
  const WANTED = 3;
  const LEND = 9;
  const BORROW = 10;

  const typeInput = $(".new_post input[name=type]").first();

  const friendCircle = $(".new_post input[name=friendsCircle]").first();

  if (!typeInput.length && !friendCircle.length) {
    return;
  }

  const getField = (field) => $('.new_post').find(`input[name=${field}], select[name=${field}]`).first();
  const getGroupForField = (field) => getField(field).closest('.form-group');

  const lendButton = $('.new_post').find('button[data-value=9]').first();
  const borrowButton = $('.new_post').find('button[data-value=10]').first();
  const townMenu = getField('town');

  const updateFieldVisibility = () => {

    const value = typeInput.val();

    const friendVal = friendCircle[0].checked;

      // if FriendsCircle, hide town dropdown.  If town group, hide LEND and BORROW post types.
    if (friendVal === true) {
        //TODO: set group id to 0
        townMenu.val(0);
        getGroupForField('town').hide();
        lendButton.show();
        borrowButton.show();
    } else {
        getGroupForField('town').show();
        lendButton.hide();
        lendButton.removeClass('active');
        borrowButton.hide();
        borrowButton.removeClass('active');
    }

    switch (Number(value)) {
      case OFFER:
        getGroupForField('images').show();
        // getGroupForField('town').show();
        break;
      case WANTED:
        getGroupForField('images').hide();
        // getGroupForField('town').show();
        break;
      case LEND:
        getGroupForField('images').show();
        getGroupForField('town').hide();
        getField('town').val('');
        break;
      case BORROW:
        getGroupForField('images').hide();
        getGroupForField('town').hide();
        getField('town').val('');
        break;
      default:
    }
  };

  updateFieldVisibility();
  typeInput.on('input', updateFieldVisibility);
  friendCircle.on('input', updateFieldVisibility);

});


// export a constant, placeholder
export default "NEW_POST";
