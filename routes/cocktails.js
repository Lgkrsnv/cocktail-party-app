const router = require('express').Router();
const fetch = require('node-fetch');
const User = require('../models/User')
const Party = require('../models/Party');
const { query } = require('express');

router.get('/form', async (req, res) => {
  const result = (await (await fetch('http://thecocktaildb.com/api/json/v1/1/list.php?i=list')).json())
  res.render('cocktails/form', { drinks: result.drinks, layout: false });
});



router.post('/form', async (req, res) => {
  const selectedIngr = req.body;
  let ingrArr = selectedIngr.selectedIngr;
  for (let i = 0; i < ingrArr.length; i++) {
    ingrArr[i] = ingrArr[i].split(' ').join("_")//Dry_Vermouth,Gin,Anis
  }
  const queryStr = ingrArr.join(',');
  const list = (await (await fetch(`http://thecocktaildb.com/api/json/${process.env.VERSION}/${process.env.API_KEY}/filter.php?i=${queryStr}`)).json())
  if (list.drinks === 'None Found') {
    return res.render('cocktails/errorList', { layout: false })
  }
  const fullDrinksList = []
  for (let i = 0; i < list.drinks.length; i++) {
    let drink = (await (await fetch(`http://thecocktaildb.com/api/json/v1/1/lookup.php?i=${list.drinks[i].idDrink}`)).json());
    fullDrinksList.push(drink);
  }
  const fullDrinksList2 = [];
  for (let i = 0; i < fullDrinksList.length; i++) {
     console.log(fullDrinksList[i].drinks[0].strIngredient1)
    fullDrinksList2.push(fullDrinksList[i].drinks[0])
  }
  console.log(fullDrinksList2);
  for (let i = 0; i < fullDrinksList2.length; i++) {
    const ingredientsMeasuresArr = []
    for (let j = 1; fullDrinksList2[i][`strIngredient${j}`] !== null && fullDrinksList2[i][`strIngredient${j}`] !== ''; j++) {
      const obj = {};
      obj.ingredients = fullDrinksList2[i][`strIngredient${j}`];
      if (fullDrinksList2[i][`strMeasure${j}`] !== null && fullDrinksList2[i][`strMeasure${j}`] !== '') {
        obj.measures = fullDrinksList2[i][`strMeasure${j}`]
      }
      ingredientsMeasuresArr.push(obj);
    }
    fullDrinksList2[i].ingredientsMeasuresArr = ingredientsMeasuresArr;
  }
  console.log(fullDrinksList2[0].ingredientsMeasuresArr);
  return res.render('cocktails/list', { fullDrinksList2, layout: false});
});

router.get('/random', async (req, res) => {
  const result = (await (await fetch('http://thecocktaildb.com/api/json/v1/1/random.php')).json())
  console.log(result);

  res.json({ result });
});
router.get('/top', async (req, res) => {
  const result = (await (await fetch('http://thecocktaildb.com/api/json/v2/9973533/popular.php')).json())
  console.log(result.drinks.length);

  res.json({ result });
});

module.exports = router;



/*
  for (let i = 0; i < fullDrinksList2.length; i++) {
    fullDrinksList2[i].ingArr = [];
    fullDrinksList2[i].measuresArr = [];
    for (let j = 1; fullDrinksList2[i][`strIngredient${j}`] !== null && fullDrinksList2[i][`strIngredient${j}`] !== ''; j++) {
      fullDrinksList2[i].ingArr.push(fullDrinksList2[i][`strIngredient${j}`])
      if (fullDrinksList2[i][`strMeasure${j}`] !== null && fullDrinksList2[i][`strMeasure${j}`] !== '') {
        fullDrinksList2[i].measuresArr.push(fullDrinksList2[i][`strMeasure${j}`]);
      }
    }
  }
*/
