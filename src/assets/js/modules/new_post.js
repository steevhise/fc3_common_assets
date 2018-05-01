// setup
document.addEventListener("DOMContentLoaded", ()=> {

  $(".select-new-post-tags").select2();

  const OFFER = 1;
  const WANTED = 3;
  const LEND = 9;
  const BORROW = 10;

  const typeInput = $(".new_post input[name=type]").first();

  const friendCircle = $(".new_post input[name=friendsCircle]").first();

  console.log('friend circle is ', friendCircle);

  if (!typeInput.length && !friendCircle.length) {
    console.log('no type or friendCircle');
    return;
  }

  const getGroupForField = (field) => $('.new_post').find(`input[name=${field}], select[name=${field}]`).first().closest('.form-group');

  const lendButton = $('.new_post').find('button[data-value=9]').first();
  const borrowButton = $('.new_post').find('button[data-value=10]').first();

    console.log(lendButton);

  const updateFieldVisibility = () => {

    const value = typeInput.val();

    const friendVal = friendCircle[0].checked;

    // if FriendsCircle, hide town dropdown.  If town group, hide LEND and BORROW post types.
    if (friendVal === true) {
        getGroupForField('town').hide();
        //TODO: set group id to 0
        lendButton.show();
        borrowButton.show();
        console.log('friendCircle  = ', friendVal);
    } else {
        getGroupForField('town').show();
        // TODO: hide the LEND and BORROW buttons
        lendButton.hide();
        lendButton.removeClass('active');
        borrowButton.hide();
        borrowButton.removeClass('active');
        console.log('friendCircle = ', friendVal);
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
        // getGroupForField('town').hide();
        break;
      case BORROW:
        getGroupForField('images').hide();
        // getGroupForField('town').hide();
        break;
      default:
        console.warn('Unrecognized post type', value);
    }
  };

  updateFieldVisibility();
  typeInput.on('input', updateFieldVisibility);
  friendCircle.on('input', updateFieldVisibility);

});


// export a constant, placeholder
export default "NEW_POST";
