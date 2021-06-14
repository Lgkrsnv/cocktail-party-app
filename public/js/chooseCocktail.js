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
        console.log(getDrinksCardHTML);
        chooseCocktailForm.remove();
        chooseDiv.innerHTML += getDrinksCardHTML;
        const makeChoiceBtn = document.querySelectorAll('.makeChoiceBtn');
        if (makeChoiceBtn) {
          for (let i = 0; i < makeChoiceBtn.length; i++) {
            makeChoiceBtn[i].addEventListener('click', async (e) => {
              console.log(e.target);
              const cocktailid = e.target.id;
              const cocktailname = e.target.dataset.cocktailname;

              const makePartyForm = document.querySelector("#makePartyForm");
              makePartyForm.cocktail.value = cocktailname;
              makePartyForm.cocktailReal.value = cocktailname;
              makePartyForm.querySelector("#cocktailid").value = cocktailid;


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
        const makePartyForm = document.querySelector("#makePartyForm");
        makePartyForm.cocktail.value = drinkObj.strDrink;
        makePartyForm.cocktail.dataset.cocktailid = drinkObj.idDrink;
        makePartyForm.cocktailReal.value = drinkObj.strDrink;
        makePartyForm.querySelector("#cocktailid").value = drinkObj.idDrink;

      })
    }
  })
}
//=====================================================================================

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
        const makePartyForm = document.querySelector("#makePartyForm");
        makePartyForm.cocktail.value = randomDrink.strDrink;
        makePartyForm.cocktail.dataset.cocktailid = randomDrink.idDrink;
        makePartyForm.cocktailReal.value = randomDrink.strDrink;
        makePartyForm.querySelector("#cocktailid").value = randomDrink.idDrink;

      })
    }
  })
}
