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
//     const lastUpdatedDate = user.incomeLastUpdated;

//     // If the income was updated today, return 0 as the daily income
//     if (
//       lastUpdatedDate &&
//       lastUpdatedDate.getFullYear() === today.getFullYear() &&
//       lastUpdatedDate.getMonth() === today.getMonth() &&
//       lastUpdatedDate.getDate() === today.getDate()
//     ) {
//       return res.json({ dailyIncome: user.income - user.incomeYesterday, totalIncome: user.income });
//     }

//     const dailyIncome = user.income - user.incomeYesterday ;

//     // Update the user's incomeYesterday and incomeLastUpdated with today's values
//     user.incomeYesterday = user.income;
//     user.incomeLastUpdated = today;
//     await user.save();

//     return res.json({ dailyIncome, totalIncome: user.income });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;


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
//     const lastUpdatedDate = user.incomeLastUpdated;

//     // If the income was updated today, return the difference between current income and yesterday's income
//     if (
//       lastUpdatedDate &&
//       lastUpdatedDate.getFullYear() === today.getFullYear() &&
//       lastUpdatedDate.getMonth() === today.getMonth() &&
//       lastUpdatedDate.getDate() === today.getDate()
//     ) {
//       const dailyIncome = user.income - user.incomeYesterday;
//       return res.json({ dailyIncome, totalIncome: user.income });
//     }

//     // Calculate the sum of income updates on the current day
//     const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     const incomeUpdatesToday = await User.aggregate([
//       {
//         $match: {
//           _id: userId,
//           incomeLastUpdated: { $gte: todayStart, $lt: todayEnd },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalIncomeUpdates: { $sum: '$income' },
//         },
//       },
//     ]);

//     const totalIncomeUpdates = incomeUpdatesToday.length > 0 ? incomeUpdatesToday[0].totalIncomeUpdates : 0;
//     const dailyIncome = totalIncomeUpdates - user.incomeYesterday;

//     // Update the user's incomeYesterday and incomeLastUpdated with today's values
//     user.incomeYesterday = totalIncomeUpdates;
//     user.incomeLastUpdated = today;
//     await user.save();

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
router.get('/daily-level-income/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

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
