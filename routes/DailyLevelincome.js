// // API endpoint (api.js)
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // Calculate daily level income for a user
// router.get('/daily-level-income/users/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Calculate daily level income
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     const dailyIncome = user.income - user.incomeYesterday || 0;

//     // Update the user's incomeYesterday with today's value
//     user.incomeYesterday = user.income;
//     user.save();

//     return res.json({ dailyIncome, totalIncome: user.income });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;



// API endpoint (api.js)
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Calculate daily level income for a user
router.get('/daily-level-income/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({userId: userId});

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate daily level income
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let dailyIncome = 0;

    // Check if income was updated today
    if (
      user.incomeLastUpdated &&
      user.incomeLastUpdated.getFullYear() === today.getFullYear() &&
      user.incomeLastUpdated.getMonth() === today.getMonth() &&
      user.incomeLastUpdated.getDate() === today.getDate()
    ) {
      dailyIncome = user.income - user.incomeYesterday;
    } else if (
      user.incomeLastUpdated &&
      user.incomeLastUpdated.getFullYear() === yesterday.getFullYear() &&
      user.incomeLastUpdated.getMonth() === yesterday.getMonth() &&
      user.incomeLastUpdated.getDate() === yesterday.getDate()
    ) {
      dailyIncome = user.income - user.incomeYesterday;
      user.incomeYesterday = user.income;
      user.incomeLastUpdated = today;
      await user.save();
    }

    return res.json({ dailyIncome, totalIncome: user.income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
