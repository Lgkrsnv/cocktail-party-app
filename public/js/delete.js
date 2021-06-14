const deleteBtn = document.querySelector('#deleteBtn');

if (deleteBtn) {
  deleteBtn.addEventListener('click', async (e) => {
    console.log('delete!!');
    e.preventDefault();
    const partyid = e.target.dataset.partyid;
    console.log(partyid);
    const response = await fetch(`/parties/${partyid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partyid
      }),
    })
    const result = await response.json();
    console.log(result);
    if (result.status === 'deleted') {
      window.location = '/'
    } else {
      const partiesShow = document.querySelector('#partiesShow');
      const error = document.createElement('div');
      error.innerHTML = `
      <div class="alert alert-danger" role="alert">
      Произошла ошибка!
    </div>
    `
    partiesShow.appendChild(error);
    }
  })
}
