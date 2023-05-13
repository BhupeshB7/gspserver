const express = require('express');
const multer = require('multer');
const router = express.Router();
const Deposit = require('../models/Deposit');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, transactionId, userID } = req.body;
    const imagePath = req.file.path;

    // Check if the uploaded file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error('File not found');
    }
 // Check if email already exists
 const transaction = await Deposit.findOne({ transactionId });
 if (transaction) {
  return res.status(400).json({ error: ' transactionId already exists' });
 }
    const user = new Deposit({ name, transactionId, userID, image: imagePath });
    await user.save();
    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Set up multer for handling image uploads
// const upload = multer();

// // Create a new deposit record
// router.post('/deposit',upload.single('image'), async (req, res) => {
//   try {
//     const { name, transactionId, userId } = req.body;
//     // const {base64} = req.body;
//     const image = req.file ? req.file.buffer.toString('base64') : '';
//     Images.create({image:base64});
//     const deposit = new Deposit({
//       name,
//       transactionId,
//       userId,
//       image
//     });
//     await deposit.save();
//     res.json(deposit);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


//for get user data
// router.get('/depositusers', async (req, res) => {
//     try {
//       const users = await Deposit.find();
//       res.json(users);
//     }
//      catch (error) {
//       console.error(error);
//       res.status(500).json({ message});
//     };
// });
// Endpoint for fetching user data with pagination
// router.get('/depositusers', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // default to page 1
//     const perPage = 20;
//     const users = await Deposit.find().skip((page - 1) * perPage).limit(perPage);
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   };
// });
router.get('/depositusers', async (req, res) => {
  try {
    const searchDepositQuery = req.query.search; // Get the search query parameter from the request

    // Use a regular expression to perform a case-insensitive search for the given query
    const searchRegex = new RegExp(searchDepositQuery, 'i');
    const page = parseInt(req.query.page) || 1; // default to page 1
    const perPage = 300;
    const totalUsers = await Deposit.countDocuments();
    
    const users = await Deposit.find({
      $or: [
        { name: searchRegex },
        { userID: searchRegex },
        { transactionId: searchRegex }
      ]
    }).skip((page - 1) * perPage).limit(perPage);
    res.set('x-total-count', totalUsers);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  };
});

module.exports = router;
