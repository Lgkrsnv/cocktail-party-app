const getAvatarForm = document.querySelector('#getAvatarForm');

if (getAvatarForm) {
  getAvatarForm.addEventListener('click', async (e) => {
    const username = e.target.dataset.username;
    console.log(username);
    const response = await fetch(`/profile/form/${username}`);
    const result = await response.text();
    console.log(result);
    const avatarFormDiv = document.querySelector('#avatarFormDiv');
    avatarFormDiv.innerHTML = result;
  })
}

