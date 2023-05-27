

const express = require('express');
const router = express.Router();
const User = require('../models/User');


//
// router.get('/api/daily-earnings', async (req, res) => {
//   try {
//     const sales = await User.find().sort({ date: 'asc' });
//     const dailyEarnings = new Map();
//     sales.forEach(sale => {
//       const date = moment(sale.date).format('YYYY-MM-DD');
//       const income = sale.income;
//       const earnings = dailyEarnings.get(date) || 0;
//       dailyEarnings.set(date, earnings + income);
//     });
//     res.json([...dailyEarnings]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
router.post("/updateWallet/:userId", async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ userId : userId});
  if (!user) {
    // console.log(`User with ID ${userId} not found`);
    return res.status(404).send("User not found");
  }
  // let spon = await User.find({sponsorId: userId}).select('userId name sponsorId');
  // console.log(`print all data: ${spon}`)
  // console.log(`User found: ${JSON.stringify(user)}`);
  user.balance += 30;
  user.income += 30;
  user.selfIncome += 30;
  await user.save();
  // console.log(`Account increased for user ${userId}: ${user.income}`);
  let sponsor = await User.findOne({ userId: user.sponsorId });
  // console.log("sponsor Account");
  console.log(sponsor);
  let spnosorCount = await User.countDocuments({ userId: user.sponsorId });
  console.log(spnosorCount);
  if (sponsor && spnosorCount>=1) {
    // console.log(`Sponsor found: ${JSON.stringify(sponsor)}`);
    sponsor.balance +=4;
    sponsor.teamIncome +=4;
    sponsor.income += 4;
    await sponsor.save();
    // console.log(`Account increased for sponsor ${sponsor._id}: ${sponsor.income}`);
    let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });
    console.log("sponsor 0f sponsor Account");
    console.log(sponsor2);
    const sponsor2CountUser = await User.distinct('userId', { sponsorId: sponsor2.userId }).countDocuments();
    
    console.log(`Sponsor2Count= ${sponsor2CountUser}`)
    //  console.log(`Sponsor2CountUser= ${sponsor2CountUser}`)
    if (sponsor2 && sponsor2CountUser >=2 ) {
      // console.log(`Second sponsor found: ${JSON.stringify(sponsor2)}`);
      sponsor2.teamIncome +=3;  
      sponsor2.balance +=3;
      sponsor2.income += 3;
      await sponsor2.save();
      // onsole.log(`Account increased for second sponsor ${sponsor2._id}: ${sponsor2.income}`);
      // let sponsor3 = await User.findOne({ userId:  sponsor2.sponsorId });
      let sponsor3User = await User.countDocuments({ sponsorId: sponsor2.userId}).distinct('userId');
      // console.log(sponsor3User) // GSP sponsor's direct user - n,d
      let sponsor3 = await User.countDocuments({ sponsorId: sponsor2.sponsorId}).distinct('sponsorId');
      console.log('Sponsor2 of sponsor')
      // console.log(sponsor3) // GSP sponsor's
        // console.log("sponsor2 0f sponsor Account");
        // console.log(sponsor3);
        const sponsor3Count = await User.distinct('userId', { sponsorId: sponsor2.userId }).countDocuments();
        // console.log(sponsor3Count)// GSP sponsor's direct user - n,d = 2
        // let sponsor3Count = await User.countDocuments({  sponsorId: sponsor3.userId});
        if (sponsor3 && sponsor3Count >=3) {
          // console.log(`Third sponsor found: ${JSON.stringify(sponsor3)}`);
          sponsor3.balance +=2;
          sponsor3.teamIncome +=2;
          sponsor3.income += 2;
          await sponsor3.save();
          // console.log(`Account increased for third sponsor ${sponsor3._id}: ${sponsor3.income}`);
          //
          let sponsor4 = await User.findOne({userId: user.sponsorId});
          let sponsor4Count = await User.countDocuments({  sponsorId: sponsor4.userId });
          if(sponsor4 && sponsor4Count>4){
            // console.log(`Fourth sponsor found: &{JSON.stringify(sponsor4)} `)
            // console.log(`Fourth sponsor found: ${sponsor4.userId}`);
            sponsor4.balance +=1;
            sponsor4.teamIncome +=1;
            sponsor4.income +=1;
            await sponsor4.save();
            // console.log(`Account increased for third sponsor ${sponsor4.userId}: ${sponsor4.income}`);
            //
            let sponsor5 = await User.findOne({userId: user.sponsorId});
            let sponsor5Count = await User.countDocuments({  sponsorId: sponsor3.userId });
            if(sponsor5 && sponsor5Count>=5){
              // console.log(`Fourth sponsor found: &{JSON.stringify(sponsor4)} `)
              // console.log(`Fifth sponsor found: ${sponsor5.userId}`);
              sponsor5.balance +=1;
              sponsor5.teamIncome +=1;
              sponsor5.income +=1;
              await sponsor5.save();
              // console.log(`Account increased for fifth sponsor ${sponsor5.userId}: ${sponsor5.income}`);
            }  
          }
        }
      }
  
  }
  res.send("Account increased successfully");
})


// daily level income

// router.get('/countDailyIncome/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const users = await User.findOne({userId:userId});
//   const dailyIncomeCount = {};

//   for (const user of users) {
//     const { userId, income, updatedAt } = user;
//     const date = getDateString(updatedAt);

//     if (!dailyIncomeCount[date]) {
//       dailyIncomeCount[date] = {};
//     }

//     if (!dailyIncomeCount[date][userId]) {
//       dailyIncomeCount[date][userId] = 0;
//     }

//     dailyIncomeCount[date][userId] += income;
//   }

//   res.json(dailyIncomeCount);
// });

// function getDateString(date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }




module.exports = router;
