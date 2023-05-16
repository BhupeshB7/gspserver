const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();


// Update all user names
// router.put('/userWalletUpdate', auth, async (req, res) => {
//   try {
//     await User.updateMany({}, { income: 0 });
//     await User.updateMany({}, { balance: 0 });
//     await User.updateMany({}, { selfIncome: 0 });
//     await User.updateMany({}, { teamIncome: 0 });
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Failed to update user names', error);
//     res.sendStatus(500);
//   }
// });

// router.post('/userWalletUpdate/:userId', auth, async (req, res) => {
//   const userId = req.params;
//   try {
//     await User.findOne({userId}, { income: 146 });
//     await User.findOne({userId}, { balance: 146 });
//     await User.findOne({userId}, { selfIncome: 120 });
//     await User.findOne({userId}, { teamIncome: 26 });
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Failed to update user names', error);
//     res.sendStatus(500);
//   }
// });

// router.post("/userWalletUpdate/:userId", async (req, res) => {
//   const { userId } = req.params;
//   let user = await User.findOne({ userId : userId});
//   if (!user) {
//     // console.log(`User with ID ${userId} not found`);
//     return res.status(404).send("User not found");
//   }
//   // console.log(`User found: ${JSON.stringify(user)}`);
//   user.balance === 146;
//   user.income === 146;
//   user.selfIncome === 120;
//   user.teamIncome === 26;
//   await user.save();
// })

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post('/profileUpdate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }
    if (req.body.accountHolderName) {
      user.accountHolderName = req.body.accountHolderName.trim();
    }

    if (req.body.bio) {
      user.bio = req.body.bio.trim();
    }
    if (req.body.address) {
      user.address = req.body.address.trim();
    }
    if (req.body.accountNo) {
      user.accountNo = req.body.accountNo.trim();
    }
    if (req.body.ifscCode) {
      user.ifscCode = req.body.ifscCode.trim();
    }
     //For google Pay
     if (req.body.GPay) {
      const GPay = req.body.GPay.trim();
      const GPayExists = await User.findOne({ GPay });
      if (GPayExists && GPayExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Gpay number already exists' });
      }
      user.GPay = GPay;
    }
    if (req.body.mobile) {
      const mobile = req.body.mobile.trim();
      const mobileExists = await User.findOne({ mobile });
      if (mobileExists && mobileExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Mobile number already exists' });
      }
      user.mobile = mobile;
    }
if (req.body.aadhar) {
      const aadhar = req.body.aadhar.trim();
      const aadharExists = await User.findOne({ aadhar });
      if (aadharExists && aadharExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Aadhar number already exists' });
      }
      user.aadhar = aadhar;
    }
    if (req.body.email) {
      const email = req.body.email.trim().toLowerCase();
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = email;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error for updation');
  }
});



// const isActive = (item) => item.is_active;

// const countActiveItems = async (items) => {
//   const activeItems = await items.filter(isActive);
//   return activeItems.length;
// };

// router.get("/count-active/:userId", async (req, res) => {
//   const { userId } = req.params;
  
//   try{
//     let user = await User.findOne({ userId : userId});
//     if (!user) {
//       // console.log(`User with ID ${userId} not found`);
//       return res.status(404).send("User not found");
//     }
//     const sponsor = await User.findOne({userId: user.sponsorId});
//     if(sponsor){
//       const numberOfActiveUser = await countActiveItems(sponsor);
//       res.json({ numberOfActiveUser });
    
//     }
//     // const sponsor1  = await User.find({userId:sponsor.sponsorId});
//     // if(sponsor1){
//     //   const numberOfActiveUser1 = await countActiveItems(sponsor1);
//     //   res.status(200).json({ numberOfActiveUser1 });
//     // }
//     // const sponsor2  = await User.find({userId:sponsor1.sponsorId});
//     //   if(sponsor2){
//     //     const numberOfActiveUser2 = await countActiveItems(sponsor2);
//     //     res.json({ numberOfActiveUser2 });
      
//     //  }
//   }catch(error){
//     res.status(500).json({error:"intenal server error"});
//   }
// });
module.exports = router;
