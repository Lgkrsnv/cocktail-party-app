const goForm = document.querySelector("#goForm");
//router.put("/:idparty/:idguest"
if (goForm) {
  goForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const food = e.target.food.value;
    const ingredient = e.target.ingredient.value;
    const username = e.target.dataset.username

    const response = await fetch(`/parties/${e.target.dataset.partyid}/${e.target.dataset.userid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        food,
        ingredient,
        username
      }),
    })
    const result = await response.json()
    console.log(result);
    if (result.status === 'all good') {
      const guestList = document.querySelector('#guestList');
      const li = document.createElement('li');
      li.innerText = `${result.guestname} принесет ${result.ingredient} и ${result.food}`;
      guestList.append(li);
      goForm.remove();
    } else if (result.status === 'food already in the list') {
      const leftDiv = document.querySelector('#leftDiv');
      const error = document.createElement('div');
      error.innerHTML = `
      <div class="alert alert-danger" role="alert">
      Такой продукт уже в списке, выберите другой :)
      </div>
    `
      leftDiv.appendChild(error);
    } else {
      const leftDiv = document.querySelector('#leftDiv');
      const error = document.createElement('div');
      error.innerHTML = `
      <div class="alert alert-danger" role="alert">
      Произошла ошибка!
      </div>
    `
      leftDiv.appendChild(error);
    }

  })
}
