const router = require('express').Router();
const User = require('../models/User')
const Party = require('../models/Party');
var multer = require('multer')
var upload = multer({ dest: 'public/avatars' })

router.get('/:username', async (req, res) => {
  const userParties = await Party.find({ author: req.session.user.username }).lean();
  const user = await User.findOne({ username: req.params.username }).lean();
  const date = userParties.map(item => {
    return item.starts.toString().slice(0, 21);
  })
  for (let i = 0; i < userParties.length; i++) {
    userParties[i].slicedDate = date[i];
    userParties[i].guestsAmount = userParties[i].guests.length;
  }
  //-------------------------------------------------------------
  const allParties = await Party.find().lean()
  const userAsGuest = [];
  for (let i = 0; i < allParties.length; i++) {
    if (allParties[i].guests === undefined) {
      continue;
    } else {
      for (let j = 0; j < allParties[i].guests.length; j++) {
        if (allParties[i].guests[j].username === req.session.user.username) {
          userAsGuest.push(allParties[i]);
          allParties[i].slicedDate = allParties[i].starts.toString().slice(0, 21);
          allParties[i].takeFood = allParties[i].guests[j].food;
          allParties[i].takeDrink = allParties[i].guests[j].ingredient;
        }
      }
    }
  }
  res.render('profile', { userParties, userAsGuest, username: req.session.user.username, user });
});
router.post('/:username', upload.single('avatar'), async function (req, res, next) {
  const { filename } = req.file;
  const { username } = req.params;
  const user = await User.findOneAndUpdate({ username }, { avatar: filename }).lean();
  res.redirect(`/profile/${username}`)
})

router.get('/form/:username', async (req, res) => {
  const { username } = req.params;
  console.log(username);
  // res.send('hi')
  res.render('profileForm', { username, layout: false })
})


module.exports = router;



/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/')
    },
    filename: function (req, file, cb) {
        //console.log(req.body)
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage })

router.post('/register', (req, res) => {
    upload(req, res, function(err) {
        if(err) {
            //stuff when error while file uploading
        } else {
            //file uploaded
        }
    })
});
*/
