const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');
const imageValidate = require('../utils/imageValidate');
const User = require('../models/User');

router.post('/user',  async (req, res) => {
  try {
    const { name, transactionId,userID , depositAmount } = req.body;
   
    // const imagePath = req.file.path;

   
 // Check if email already exists
 const transaction = await Deposit.findOne({ transactionId });
 if (transaction) {
  return res.status(400).json({ error: ' transactionId already exists' });
 }
    const user = new Deposit({ name:name, transactionId:transactionId, userID:userID,depositAmount:depositAmount });
    await user.save();
    res.json({ message: 'uploaded successfully' });
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

// router.post('/imageUpload', async (req, res) => {
//   try {
//       if (!req.files || !req.files.image) {
//           return res.status(400).send("No file was uploaded.")
//       }

//       const validateResult = imageValidate(req.files.image)
//       if (validateResult.error) {
//           return res.status(400).send(validateResult.error)
//       }

//       const path = require('path')
//       const uploadDirectory = path.resolve(__dirname, "../../frontend","public","images")
//       const { v4: uuidv4 } = require("uuid")

//       let product = await Deposit.findById(req.params.productId).orFail()
//       let image = req.files.image

//       var fileName = uuidv4() + path.extname(image.name)
//       var uploadPath = uploadDirectory + "/" + fileName
//       product.image.push({ path: "/images/products/" + fileName })

//       image.mv(uploadPath, function(err) {
//           if (err) {
//               return res.status(500).send(err)
//           }
//       })

//       await product.save()
//       return res.send("File uploaded.")
//   } catch(err) {
//       console.log(err)
//   }
// });
router.post('/image/:productId', async (req, res) => {
  try {
      if(!req.files || !! req.files.images === false) {
          return res.status(400).json({error:'error'})
      }
 
      const validateResult = imageValidate(req.files.images)
      if(validateResult.error) {
          return res.status(400).send(validateResult.error)
          // console.log('error')
      }

      const path = require('path')
      const uploadDirectory = path.resolve(__dirname, "../../frontend","public","images" )
      const {v4: uuidv4} = require("uuid")

      console.log(req.params.productId)
      let product = await Deposit.findById(req.params.productId)        
        let imagesTable =  []

      if (Array.isArray(req.files.images)) {
          // res.send("You sent " + req.files.images.length + " images")
          imagesTable = req.files.images
      } else {
          // res.send("You sent only one image")
          imagesTable.push(req.files.images)
          
      }
      
      for(let image of imagesTable){
          console.log(image)
          console.log(path.extname(image.name))
          console.log(uuidv4())
           var uploadPath = uploadDirectory + "/" + uuidv4() + path.extname(image.name)
          var fileName = uuidv4() + path.extname(image.name)
          var uploadPath = uploadDirectory + "/" + fileName
          product.images.push({path: "/images/" + fileName})
           image.mv(uploadPath, function(err){
              if(err){
                  return res.status(500).send(err)
              }
           })
      }
      await product.save()
      return res.send("files uploaded.")
  } catch(err) {
      console.log(err)
  }
})
router.delete('/delete', async (req, res) => {
  try {
    await Deposit.deleteMany({});
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting all users' });
  }
});

//
// router.get('/topUpActivate', async (req,res)=>{
//   try {
//     const userId= req.body;
//     const user = await User.findOne(userId).select("userId").orFail();
//     if(!user){
//       req.status(400).send("user not found!")
//     }
//   } catch (error) {
//     console.log(error)
//   }
// })
// router.get('/topUpActivate', async (req, res) => {
//   try {
//     const userId = req.query.userId; // Assuming the user ID is passed as a query parameter

//     const user = await User.findOne({ userId }).select("userId").lean().exec();
    
//     if (!user) {
//       return res.status(404).send("User not found!");
//     }

//     // Assuming you have an 'active' property in the User model
//     if (user.is_active) {
//       return res.send("User is active");
//     } else {
//       return res.send("User is not active");
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server error");
//   }
// });
// router.get('/topUpActivate/:userId', async (req, res) => {
//   try {
//     const {userId} = req.params; // Assuming the user ID is passed as a query parameter
//     // const userId = req.params.userId || req.query.userId;

//     const user = await User.findOne({ userId }).select("userId is_active").lean().exec();
    
//     if (!user) {
//       return res.status(404).send("User not found!");
//     }

//     // Assuming you have an 'active' property in the User model
//     if (user.is_active) {
//       return res.send("User is active");
//     } else {
//       return res.send("User not found");
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server error");
//   }
// });
router.post('/topUpActivate', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ userId }).select("userId is_active").lean().exec();

    if (!user) {
      return res.json({ status: 'not_found', message: 'User not found' });
    }

    // Assuming you have an 'is_active' property in the User model
    if (user.is_active) {
      return res.json({ status: true });
    } else {
      return res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
