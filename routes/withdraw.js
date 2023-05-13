const express = require('express');
// import database models
const User = require('../models/User');
const WithdrawalReq = require('../models/WithdrawReq');

// router.use(express.json());
const router = express.Router();

// // endpoint for withdrawal request
// router.post('/withdraw/:userId', async (req, res) => {
//   const { userId  } = req.params;
//   const { amount, GPay, IfscCode, accountNo  } = req.body;


//   // check if the withdrawal amount is greater than or equal to 500
//   if (amount < 500) {
//     return res.status(400).json({ error: 'Minimum withdrawal amount is 500 Rs' });
//   }
  

//   // get user from database
//   const user = await User.findOne({userId:userId});
//   if(!user){
//     return res.status(401).json({error:'User not found!'})
//   }
//   const count = await User.countDocuments({ sponsorId: userId });

//   if (count <= 2) {
//     return res.json({error: 'Minimum Two Direct for Withdrawal'});
//   }
// //   check if user exists
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   // check if user balance is sufficient for the withdrawal
//   if (user.balance < amount) {
//     return res.status(400).json({ error: 'Insufficient balance' });
//   }

//   // create a new withdrawal request
//   const withdrawalRequest = new WithdrawalReq({
//     userId,
//     amount,
//     GPay,
//     IfscCode,
//     accountNo
//   });

//   await withdrawalRequest.save();
//   //update withdrawal 
//   user.withdrawal += amount;
//   // update user balance
//   user.balance -= amount;
//   await user.save();

//   return res.json({ success: true });
// });
// endpoint for withdrawal request
router.post('/withdraw/:userId', async (req, res) => {
  const { userId } = req.params;
  const { amount, GPay, IfscCode, accountNo } = req.body;
  
  const user = await User.findOne({ userId: userId });
  // check if the withdrawal amount is greater than 0
  if (amount <= 0) {
    return res.status(400).json({ error: 'Withdrawal amount should be greater than 0' });
  }

  // check if the withdrawal amount is greater than or equal to 500
  if (amount >= 500) {
    // get user from database
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // check if user has at least two direct referrals
    const count = await User.countDocuments({ sponsorId: userId });
    if (count < 2) {
      return res.status(400).json({ error: 'Minimum Two Direct for Withdrawal' });
    }

    // check if user balance is sufficient for the withdrawal
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // create a new withdrawal request
    const withdrawalRequest = new WithdrawalReq({
      userId,
      amount,
      GPay,
      IfscCode,
      accountNo,
    });

    await withdrawalRequest.save();

    // update user withdrawal and balance
    user.withdrawal += amount;
    user.balance -= amount;
    await user.save();

    //   await withdrawalRequest.save();
//   //update withdrawal 
//   user.withdrawal += amount;
//   // update user balance
//   user.balance -= amount;
//   await user.save();
    return res.json({ success: true });
  } 
   
  else if(amount < 200){
    return res.status(400).json({ error: 'Minimum withdrawal amount is 500 Rs' });
  } else  if (user.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance in wallet' });
  }
  else if (amount === 200) {
    // check if user balance is sufficient for the withdrawal
   
    // create a new withdrawal request
    const withdrawalRequest = new WithdrawalReq({
      userId,
      amount,
      GPay,
      IfscCode,
      accountNo,
    });

    await withdrawalRequest.save();

    // update user withdrawal
    const user = await User.findOne({ userId: userId });
    // user.withdrawal += amount;
    // await user.save();
//   //update withdrawal 
  user.withdrawal += amount;
//   // update user balance
  user.balance -= amount;
  await user.save();
    return res.json({ success: true });
  }
  else {
    return res.status(400).json({ error: 'Minimum withdrawal amount is 500 Rs' });
  }
});

// // endpoint for admin to fetch a specific withdrawal request
// router.get('/admin/withdrawals/', async (req, res) => {
//   try {
//     const withdrawalRequest = await WithdrawalReq.find();
//     if (!withdrawalRequest) {
//       return res.status(404).json({ error: 'Withdrawal request not found' });
//     }
//     res.json(withdrawalRequest);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// // Update withdrawal request status
// router.put('/admin/withdrawals/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const withdrawalReq = await WithdrawalReq.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
//     if (!withdrawalReq) {
//       return res.status(404).json({ error: 'Withdrawal request not found' });
//     }
//     res.json(withdrawalReq);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// // define the DELETE route for deleting a withdrawal request
// router.delete('/withdrawals/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     // find and delete the withdrawal request with the given ID
//     const deletedRequest = await WithdrawalReq.findByIdAndDelete(id);
//     // send response with status 200 and the deleted request data
//     res.status(200).json(deletedRequest);
//   } catch (error) {
//     console.error(error);
//     // send response with status 500 and an error message
//     res.status(500).json({ message: 'Unable to delete withdrawal request.' });
//   }
// });
// endpoint for admin to fetch a specific withdrawal request
router.get('/withdrawals/:userId', async (req, res) => {
  const {userId} = req.params;
  try {
    const withdrawalRequest = await WithdrawalReq.find({userId: userId});
    if (!withdrawalRequest) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }
    res.json(withdrawalRequest);
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint for admin to fetch all withdrawal requests
router.get('/withdrawals', async (req, res) => {
  try {
    const withdrawalRequests = await WithdrawalReq.find();
    res.json(withdrawalRequests);
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint for admin to update the status and transaction number of a withdrawal request
router.put('/withdrawals/:id', async (req, res) => {
  const { id } = req.params;
  const { status, transactionNumber } = req.body;
  try {
    const withdrawalRequest = await WithdrawalReq.findByIdAndUpdate(id, { status, transactionNumber }, { new: true });
    if (!withdrawalRequest) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }
    res.json(withdrawalRequest);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;