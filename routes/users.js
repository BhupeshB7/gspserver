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

// router.post("/userWalletUpdating/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try{
//     let user = await User.findOne({ userId : userId});
//     if (!user) {
//       // console.log(`User with ID ${userId} not found`);
//       return res.status(404).send("User not found");
//     }
//     // console.log(`User found: ${JSON.stringify(user)}`);
//     user.balance === 146;
//     user.income === 146;
//     user.selfIncome === 120;
//     user.teamIncome === 26;
//     await user.save();
//   }catch(error){
//     res.status(500).json({error:'Internal server error'})
//   }

// })
router.post("/userWalletUpdating/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    let user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.balance = 60;
    user.income = 60;
    user.selfIncome = 60;
    user.teamIncome = 0;
    user.withdrawal = 0;
    await user.save();
    res.status(200).send("User wallet updated successfully");
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


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




router.post('/activeuser/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    
    let user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the active user based on userId: sponsorId
    const sponsor = await User.find({ userId: user.sponsorId });

    // Count the number of active users based on sponsorId
    // let spnosorCount = await User.countDocuments({ userId: user.sponsorId, is_active: true });
    const sponsorCount = await User.countDocuments({ sponsorId: user.userId, is_active: true });
    const sponsorTotalCount = await User.countDocuments({ sponsorId: user.userId });

    // Count the number of active users based on sponsor.sponsorId
    const sponsor2Count = await User.countDocuments({userId: sponsor.sponsorId, is_active: true });

    // Count the number of active users based on sponsor2.sponsorId
    const sponsor3Count = await User.countDocuments({ sponsorId: sponsor2Count?.sponsorId, is_active: true });

    // Count the number of active users based on sponsor3.sponsorId
    const sponsor4Count = await User.countDocuments({ sponsorId: sponsor3Count?.sponsorId, is_active: true });

    const data = {
      // activeUser: user,
      // sponsor,
      sponsorCount,
      sponsorTotalCount,
      sponsor2Count,
      sponsor3Count,
      sponsor4Count,
    };

    console.log(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
