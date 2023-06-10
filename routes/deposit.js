const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');
const imageValidate = require('../utils/imageValidate');
const User = require('../models/User');
const Topup = require('../models/Topup');

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

router.get('/depositusers', async (req, res) => {
  try {
    const searchDepositQuery = req.query.search; // Get the search query parameter from the request

    // Use a regular expression to perform a case-insensitive search for the given query
    const searchRegex = new RegExp(searchDepositQuery, 'i');
    const totalUsers = await Deposit.countDocuments();
    
    const users = await Deposit.find({
      $or: [
        { name: searchRegex },
        { userID: searchRegex },
        { transactionId: searchRegex }
      ]
    })
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  };
});

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

      // console.log(req.params.productId)
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
          // console.log(image)
          // console.log(path.extname(image.name))
          // console.log(uuidv4())
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
      // console.log(err)
      return res.status(500).json({ error: 'Internal server error' });

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
    // console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const activateUser = async (userId, is_active) => {
  try {
    const activationTime = new Date();
    const is_active = true
    const updatedUser = await User.findOneAndUpdate(
      {userId:userId}, // Specify the filter condition for the update
      // { is_active:is_active},
     
{
is_active: is_active,
activationTime:activationTime
},
      { new: true }
    );
    if (updatedUser) {
      return true; // Activation successful
    } else {
      return false; // Failed to update user
    }
  } catch (error) {
    // console.log(error);
    return false; // Error occurred during activation
  }
};


// Modify the route handler to use the helper function
router.post('/topUpUserID/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const deposit = await Deposit.findOne({ userID }).select("isApproved").lean().exec();

    if (!deposit) {
      return res.status(401).send("User not found!");
    } else if (deposit.isApproved) {
      const { userId, is_active, activationTime} = req.body;
      const activeUser = await User.findOne({ userId }).select("userId is_active").lean().exec();     
      if(activeUser.is_active){
        return res.status(201).send('user Already Activated!')
      }
      const depositUser = await Deposit.findOne({userID})
      
      if(depositUser.depositAmount < 800){
        return res.status(400).json({error:'Low Balance'})
      }
      const activationStatus = await activateUser(userId, is_active , activationTime);
      if (activationStatus) {
        const { userID } = req.params;
        const depositUser = await Deposit.findOne({userID})    
          depositUser.depositAmount -=800;
          // const  topupUser = new Topup({userID:userID,depositAmount:depositAmount, ActivationTime:activationTime }); 
          // topupUser.save();
          depositUser.save();
          return res.status(201).json({success:'user Activated'});
        
      } else {
        return res.json({error:'Failed to activate user.'});
      }
    } else {
      return res.json({error:'Your Deposit Amount is not Approved!'});
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({error:'An error occurred. Please try again later.'});
  }
});

router.patch('/activate/:id', async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await Deposit.findById(userID);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    user.isApproved = true;
    // user.activationTime = new Date();
    await user.save();

    res.json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/topUpuserAmount/:userID', async (req,res)=>{
  try {
    const { userID } = req.params;
    const deposit = await Deposit.findOne({ userID }).select("userID depositAmount isApproved").lean().exec();
  
    if (!deposit) {
      return res.status(401).send("User not found!");
    }

    return res.status(201).json({deposit})
  } catch (error) {
    console.log(error)
    return res.status(500).json({error:'Internal server error'})
  }
   
})
module.exports = router;
