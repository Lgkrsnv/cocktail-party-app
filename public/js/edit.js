const editForm = document.querySelector('#editForm');
const chooseCocktail = document.querySelector('#chooseCocktail');
const chooseRandomCocktail = document.querySelector('#chooseRandomCocktail');
const chooseTopCocktail = document.querySelector('#chooseTopCocktail')



if (chooseCocktail) {
  chooseCocktail.addEventListener('click', async (e) => {
    const response = await fetch('/cocktails/form');
    const result = await response.text();
    const chooseDiv = document.querySelector('#chooseDiv');
    chooseDiv.innerHTML = result;
    const chooseCocktailForm = document.querySelector("#chooseCocktailForm");
    if (chooseCocktailForm) {
      chooseCocktailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const checkboxes = document.querySelectorAll("#chooseCocktailForm input");
        const selectedIngr = Array.from(checkboxes).filter(i => i.checked).map(i => i.name);
        console.log(selectedIngr);
        const res = await fetch('/cocktails/form', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedIngr
          }),
        })
        const getDrinksCardHTML = await res.text();
        chooseCocktailForm.remove();
        chooseDiv.innerHTML += getDrinksCardHTML;
        const makeChoiceBtn = document.querySelectorAll('.makeChoiceBtn');
        if (makeChoiceBtn) {
          for (let i = 0; i < makeChoiceBtn.length; i++) {
            makeChoiceBtn[i].addEventListener('click', async (e) => {
              console.log(e.target);
              const cocktailid = e.target.id;
              const cocktailname = e.target.dataset.cocktailname;
              console.log(cocktailid, cocktailname);

              editForm.cocktail.value = cocktailname;
              editForm.cocktail.dataset.cocktailid = cocktailid;
              editForm.cocktailReal.value = cocktailname;
              editForm.querySelector("#cocktailid").value = cocktailid;


            })
          }
        }


      })
    }
  })
}


if (chooseRandomCocktail) {
  chooseRandomCocktail.addEventListener('click', async (e) => {
    const response = await fetch('/cocktails/random');
    const result = await response.json();
    console.log(result.result.drinks[0].strDrink);
    const drinkObj = result.result.drinks[0];
    const chooseDiv = document.querySelector('#chooseDiv');
    const divContent = `
    <div class="card" style="width: 25rem;">
      <img src="${drinkObj.strDrinkThumb}" id="cardImg" class="card-img-top" alt="${drinkObj.strDrink} photo">
      <div class="card-body">
        <h5 class="card-title">${drinkObj.strDrink}</h5>
        <ul id='ingredients'>
        </ul>
        <p class="card-text">${drinkObj.strAlcoholic}<br> ${drinkObj.strGlass}</p>
        <p class="card-text">Category - ${drinkObj.strCategory}</p>
        <p class="card-text">${drinkObj.strInstructions}</p>
        <a href="#" class="btn btn-primary" id="makeChoiceBtn">I choose this cocktail</a>
      </div>
    </div>
    `;
    chooseDiv.innerHTML = divContent;
    const ingredients = chooseDiv.querySelector('#ingredients');
    for (let i = 1; drinkObj[`strIngredient${i}`] !== null && drinkObj[`strIngredient${i}`] !== ""; i++) {
      console.log(drinkObj[`strIngredient${i}`]);
      let li = document.createElement('li');
      li.innerText = drinkObj[`strIngredient${i}`];
      if (drinkObj[`strMeasure${i}`] !== null && drinkObj[`strMeasure${i}`] !== '') {
        li.innerText += " - " + drinkObj[`strMeasure${i}`];
        ingredients.appendChild(li);
      }
    }
    const makeChoiceBtn = chooseDiv.querySelector('#makeChoiceBtn');
    if (makeChoiceBtn) {
      makeChoiceBtn.addEventListener('click', async (e) => {
        const editForm = document.querySelector("#editForm");
        console.log(editForm);
        editForm.cocktail.value = drinkObj.strDrink;
        editForm.cocktail.dataset.cocktailid = drinkObj.idDrink;
        editForm.cocktailReal.value = drinkObj.strDrink;
        editForm.querySelector("#cocktailid").value = drinkObj.idDrink;
        console.log(editForm.cocktail);

      })
    }
  })
}


if (chooseTopCocktail) {
  chooseTopCocktail.addEventListener('click', async (e) => {
    const response = await fetch('/cocktails/top');
    const result = await response.json();
    console.log(result.result.drinks);
    const drinkObjArr = result.result.drinks;
    const chooseDiv = document.querySelector('#chooseDiv');
    const randonNum = Math.floor(Math.random() * 20);
    const randomDrink = drinkObjArr[randonNum];
    const divContent = `
      <div class="card" style="width: 25rem;">
        <img src="${randomDrink.strDrinkThumb}" id="cardImg" class="card-img-top" alt="${randomDrink.strDrink} photo">
        <div class="card-body">
          <h5 class="card-title">${randomDrink.strDrink}</h5>
          <ul id='ingredients'>
          </ul>
          <p class="card-text">${randomDrink.strAlcoholic}<br> ${randomDrink.strGlass}</p>
          <p class="card-text">Category - ${randomDrink.strCategory}</p>
          <p class="card-text">${randomDrink.strInstructions}</p>
          <a href="#" class="btn btn-primary" id="makeChoiceBtn">I choose this cocktail</a>
        </div>
      </div>
      `;


    chooseDiv.innerHTML = divContent;
    const ingredients = chooseDiv.querySelector('#ingredients');

    for (let i = 1; randomDrink[`strIngredient${i}`] !== null && randomDrink[`strIngredient${i}`] !== ""; i++) {
      console.log(randomDrink[`strIngredient${i}`]);
      let li = document.createElement('li');
      li.innerText = randomDrink[`strIngredient${i}`];
      if (randomDrink[`strMeasure${i}`] !== null && randomDrink[`strMeasure${i}`] !== '') {
        li.innerText += " - " + randomDrink[`strMeasure${i}`];
        ingredients.appendChild(li);
      }
    }
    const makeChoiceBtn = chooseDiv.querySelector('#makeChoiceBtn');


    if (makeChoiceBtn) {
      makeChoiceBtn.addEventListener('click', async (e) => {
        const editForm = document.querySelector("#editForm");
        const cocktailid = e.target.id;
        const cocktailname = e.target.dataset.cocktailname;

        editForm.cocktail.value = randomDrink.strDrink;
        editForm.cocktail.dataset.cocktailid = randomDrink.idDrink;
        editForm.cocktailReal.value = randomDrink.strDrink;
        editForm.querySelector("#cocktailid").value = randomDrink.idDrink;


      })

    }


  })
}


//=================================

if (editForm) {
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('я здесь ');
    const author = e.target.author.value;
    const location = e.target.location.value;
    const starts = e.target.starts.value;
    const description = e.target.description.value;
    const cocktailid = e.target.cocktailid.value;
    const cocktailReal = e.target.cocktailReal.value;
    let privat = e.target.privat.value;
    if (e.target.privat.checked) {
      privat = 'on'
    } else {
      privat = '';
    }
    console.log(privat);
    const partyId = e.target.dataset.partyid;
    const response = await fetch(`/parties/${partyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author,
        location,
        starts,
        description,
        cocktailid,
        cocktailReal,
        privat
      }),
    });
    const result = await response.json();
    console.log(result);
    console.log(result.privat);
    if (result.status === "all good") {
      window.location = `/parties/${partyId}`;
    } else {
      const editShow = document.querySelector('#editShow');
      const error = document.createElement('div');
      error.innerHTML = `
      <div class="alert alert-danger" role="alert">
      Произошла ошибка!
      </div>
    `
      editShow.appendChild(error);
    }
  })
}
