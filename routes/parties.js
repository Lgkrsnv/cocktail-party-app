const fetch = require('node-fetch');
const router = require('express').Router();
const User = require('../models/User')
const Party = require('../models/Party')

const url = "https://cleaner.dadata.ru/api/v1/clean/address";
const token = process.env.API_KEY_Decoder;
const secret = process.env.SECRET_KEY;



const sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/users/login");
  } else {
    next();
  }
};
router.get('/map', async (req, res) => {
  let parties;
  const openedParties = [];
  let latLonArr = [];
  try {
    parties = await Party.sortIt();

    for (let i = 0; i < parties.length; i++) {
      if (parties[i].privat !== 'on') {
        openedParties.push(parties[i]);
      }
    }
    const date = openedParties.map(item => {
      return item.starts.toString().slice(0, 21);
    })
    for (let i = 0; i < openedParties.length; i++) {
      openedParties[i].slicedDate = date[i];
      openedParties[i].guestsAmount = openedParties[i].guests.length;
      const user = await User.findOne({ username: openedParties[i].author }).lean();
      openedParties[i].avatar = user.avatar;
    }
    for (let i = 0; i < openedParties.length; i++) {
      let query = openedParties[i].location;
      console.log(i, 'iiiiiiiiiiiiiiiiiiiiiiiiiiii');
      let options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + token,
          "X-Secret": secret
        },
        body: JSON.stringify([query])
      }
      const latLon = (await (await fetch(url, options)).json());
      console.log(latLon);
      const obj = {}

      obj.latitude = latLon[0].geo_lat;
      obj.longitude = latLon[0].geo_lon;
      obj.hintContent = `<div class="map__hint">${openedParties[i].location}</div>`
      obj.balloonContent = [
        '<div class="map__balloon">',
        '<img class="map__burger-img" src="img/red.png" alt="Бокал"/>',
        `Вечеринка по адресу: ${openedParties[i].location}`,
        '</div>'
      ]
      latLonArr.push(obj)
      console.log(latLonArr);
      console.log(latLon[0].geo_lat, latLon[0].geo_lon);
    }

    
    return res.json({ latLonArr });

  } catch (error) {
    console.log(error);
    return res.render('error', {
      message: 'Не удалось получить записи из базы данных.',
      error: {}
    });
  }

})
router
  .route('/')
  .get(async (req, res) => {
    let parties;
    const openedParties = [];
    try {
      parties = await Party.sortIt();

      for (let i = 0; i < parties.length; i++) {
        if (parties[i].privat !== 'on') {
          openedParties.push(parties[i]);
        }
      }
      const date = openedParties.map(item => {
        return item.starts.toString().slice(0, 21);
      })
      for (let i = 0; i < openedParties.length; i++) {
        openedParties[i].slicedDate = date[i];
        openedParties[i].guestsAmount = openedParties[i].guests.length;
        const user = await User.findOne({ username: openedParties[i].author }).lean();
        openedParties[i].avatar = user.avatar;
      }
      // let latLonArr = [];
      // for (let i = 0; i < openedParties.length; i++) {
      //   let query = openedParties[i].location;

      //   let options = {
      //     method: "POST",
      //     mode: "cors",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Authorization": "Token " + token,
      //       "X-Secret": secret
      //     },
      //     body: JSON.stringify([query])
      //   }
      //   const latLon = (await (await fetch(url, options)).json())
      //   const obj = {}
      /*        
      latitude: 59.97,
      longitude: 30.31,
      hintContent: '<div class="map__hint">ул. Литераторов, д. 19</div>',
      balloonContent: [
          '<div class="map__balloon">',
          '<img class="map__burger-img" src="img/red.png" alt="Бокал"/>',
          'Вечеринка по адресу: ул. Литераторов, д. 19',
          '</div>'
      ]
  } */
      //   obj.latitude = latLon[0].geo_lat;
      //   obj.longitude = latLon[0].geo_lon;
      //   obj.hintContent = `<div class="map__hint">${openedParties[i].location}</div>`
      //   obj.balloonContent = [
      //     '<div class="map__balloon">',
      //     '<img class="map__burger-img" src="img/red.png" alt="Бокал"/>',
      //     `Вечеринка по адресу: ${openedParties[i].location}`,
      //     '</div>'
      // ]
      //   latLonArr.push(obj)
      //   console.log(latLonArr);
      //   console.log(latLon[0].geo_lat, latLon[0].geo_lon);
      // }


    } catch (error) {
      return res.render('error', {
        message: 'Не удалось получить записи из базы данных.',
        error: {}
      });
    }

    return res.render('parties/index', { openedParties });
  })
  .post(sessionChecker, async (req, res) => {
    const { author, location, starts, description, cocktailReal, cocktailid, privat } = req.body;
    try {
      const username = req.session.user.username;
      const newParty = await Party.create({ author: username, location, starts, description, cocktailid, cocktail: cocktailReal, privat })
      return res.redirect(`parties/${newParty._id}`);
    } catch (err) {
      return res.render('parties/form', { errors: [err] });
    }
  });

router.get('/form', sessionChecker, async (req, res) => {
  const username = req.session.user.username;
  res.render('parties/form', { username });
});


router
  .route('/:id')
  .get(sessionChecker, async (req, res) => {
    const party = await Party.findById(req.params.id).lean();
    const partyMaker = party.author;

    const user = await User.findOne({ username: partyMaker }).lean();
    const avatar = user.avatar;
    const result = (await (await fetch(`http://thecocktaildb.com/api/json/v1/1/lookup.php?i=${party.cocktailid}`)).json())
    const drinkObj = result.drinks[0];


    let isAuthor = false;
    let alreadyGuest = false;
    const userid = req.session.user._id;
    const username = req.session.user.username;
    if (req.session.user.username === party.author) {
      isAuthor = true;
    }
    const slicedTime = party.starts.toString().slice(0, 21);

    if (party.guests.some(e => e.username === username)) {
      alreadyGuest = true;
    }
    let showForm = false;
    if (!isAuthor && !alreadyGuest) {
      showForm = true;
    }
    const ingredientsMeasuresArr = []
    for (let i = 1; drinkObj[`strIngredient${i}`] !== null && drinkObj[`strIngredient${i}`] !== ""; i++) {
      const obj = {};
      obj.ingredients = drinkObj[`strIngredient${i}`];
      if (drinkObj[`strMeasure${i}`] !== null && drinkObj[`strMeasure${i}`] !== '') {
        obj.measures = drinkObj[`strMeasure${i}`];
      }
      ingredientsMeasuresArr.push(obj)
    }
    return res.render('parties/show', { party, isAuthor, slicedTime, userid, username, partyGuests: party.guests, showForm, drinkObj, ingredientsMeasuresArr, avatar });
  })
  .put(sessionChecker, async (req, res) => {

    const {
      author,
      location,
      starts,
      description,
      cocktailid,
      cocktailReal,
      privat
    } = req.body;

    try {
      const party = await Party.findOneAndUpdate({ _id: req.params.id }, { author: author, location: location, starts: starts, cocktail: cocktailReal, cocktailid, description, privat });

      res.json({ status: "all good" });
    } catch (error) {
      return res.json({ status: "all bad", error, privat })
    }

  })
  .delete(sessionChecker, async (req, res, next) => {
    try {
      await Party.deleteOne({ _id: req.params.id });
      return res.json({ status: 'deleted' });
    } catch (error) {
      return res.json({ status: 'error', error })
    }

  });

router.get('/form/:id', sessionChecker, async (req, res) => {
  const party = await Party.findById(req.params.id);
  console.log(party);
  return res.render('parties/edit', { party });
})


router.put("/:idparty/:idguest", sessionChecker, async (req, res) => {
  const { food } = req.body;
  const { ingredient } = req.body;
  const { username } = req.body;
  const { idparty } = req.params;
  const { idguest } = req.params;
  try {
    let party = await Party.findOne({ _id: idparty }).lean();
    //проверяем, что food уникален

    if (party.guests.some(e => e.food === food)) {
      return res.json({ status: 'food already in the list' });
    }

    party = await Party.findOneAndUpdate({ _id: idparty }, { $push: { guests: { userid: idguest, food: food, username: username, ingredient } } });
    const guest = await User.findOne({ _id: idguest }).lean();
    return res.json({ status: "all good", guestname: guest.username, food, ingredient });

  } catch (error) {
    return res.json({ status: "all bad", error })
  }
})

router.get('/comments/:id', async (req, res) => {
  const partyid = req.params.id;
  let party = await Party.findById(partyid).lean();
  for (let i = 0; i < party.comments.length; i++) {
    const user = await User.findOne({ username: party.comments[i].user }).lean();
    party.comments[i].avatar = user.avatar;
    party.comments[i].slicedDate = party.comments[i].createdAt.toString().slice(0, 21)
    party.comments[i].canDelete = false;
    if (party.author === req.session.user.username || party.comments[i].user === req.session.user.username) {
      party.comments[i].canDelete = true;
    }
  }

  res.render('parties/comments', { party, layout: false });
})
router.post('/comments/:id', async (req, res) => {
  try {
    const partyid = req.params.id;
    const comment = req.body.comment;
    const user = req.session.user.username;
    const u = await User.findOne({ username: user }).lean();
    const party = await Party.findByIdAndUpdate({ _id: partyid }, { $push: { comments: { user, comment } } }).lean();

    return res.json({ status: 'ok', user, avatar: u.avatar });
  } catch (err) {
    return res.json({ status: 'not ok', err })
  }

})
router.delete('/comments/:id', async (req, res) => {
  try {
    const partyid = req.params.id;
    const commentid = req.body.commentid;
    const party = await Party.findById(partyid);
    for (let i = 0; i < party.comments.length; i++) {
      if (party.comments[i].id === commentid) {
        console.log(party.comments[i], party.comments[i]._id);
        await Party.findOneAndUpdate({ _id: partyid }, { $pull: { comments: { _id: commentid } } });
      }
    }
    // await Party.findOneAndUpdate({ _id: partyid }, { $pull: { comments: commentid } });
    return res.json({ status: 'ok' });
  } catch (err) {
    return res.json({ status: 'not ok', err })
  }

})
module.exports = router;

