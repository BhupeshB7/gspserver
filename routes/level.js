
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.post('/updateIncome/:id', async (req, res) => {
//   const { id } = req.params;
//   // const { sponsorId } = req.params;

//   try {
//     // Find the user based on the provided userId
//     const user = await User.findOne({ _id: id });

//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     // Find the user(s) whose sponsorId matches the user's userId
//     const sponsoredUsers = await User.find({ userId: user.sponsorId });

//     console.log('sponsoredUsers:', sponsoredUsers);

//     // Update the income of the user and the sponsored users
//     user.income += 30;
//     await user.save();

//     for (const sponsoredUser of sponsoredUsers) {
//       console.log('sponsoredUser:', sponsoredUser);
      
//       // Make sure that the sponsoredUser object is a valid User object
//       if (sponsoredUser instanceof User) {
//         console.log('sponsoredUser income before update:', sponsoredUser.income);
        
//         sponsoredUser.income +=5;
//         await sponsoredUser.save();
        
//         console.log('sponsoredUser income after update:', sponsoredUser.income);
//       } else {
//         console.log('Invalid sponsoredUser object:', sponsoredUser);
//       }
//     }

//     return res.status(200).send('Income updated successfully');
//   } catch (error) {
//     console.error('Error updating income:', error);
//     return res.status(500).send('Error updating income');
//   }
// });
//for new code
// router.post('/updateIncome/:id', async (req, res) => {
//   const { id } = req.params;

//   // Find the user based on the provided userId
//   const user = await User.findOne({ _id: id});

//   if (!user) {
//     console.log('User not found');
//     return res.status(404).send('User not found');
//   }

//   // Find the user whose userId matches the user's sponsorId
//   const sponsor = await User.findOne({ userId: user.sponsorId });

//   if (!sponsor) {
//     console.log('Sponsor not found');
//     return res.status(404).send('Sponsor not found');
//   }

//   //find the existing user Sponsor of sponsor
 
//   // Find the user whose sponsorId matches the user's userId
//   const sponsoredUser = await User.findOne({ sponsorId: user.userId });

//   // Find the user whose sponsorId matches the sponsor's userId
//   const matchingSponsor = await User.findOne({ sponsorId: sponsor.userId });
// // // Find other users whose sponsorId matches the user's userId
// // const otherUsers = await User.find({ sponsorId:  sponsor.userId });

// // // Update the income and sponsorId of the other users
// // otherUsers.forEach(async (otherUser) => {
// //   otherUser.income += 50;
// //   otherUser.sponsorId = user.userId;
// //   await otherUser.save();
// // });
//   console.log(`User: ${user}`);
//   console.log(`Sponsor: ${sponsor}`);
//   console.log(`Sponsored User: ${sponsoredUser}`);
//   console.log(`Matching Sponsor: ${matchingSponsor}`);

//   // Update the income of the user, sponsor, sponsoredUser, and matchingSponsor
//   user.income += 30;
//   sponsor.income += 5;

//   if (sponsoredUser) {
//     sponsoredUser.income += 5;
//     console.log(`Updated income of sponsored user: ${sponsoredUser.income}`);
//     await sponsoredUser.save();
//   }

//   if (matchingSponsor) {
//     matchingSponsor.income += 10;
//     console.log(`Updated income of matching sponsor: ${matchingSponsor.income}`);
//     await matchingSponsor.save();
//   }

//   console.log(`Updated income of user: ${user.income}`);
//   console.log(`Updated income of sponsor: ${sponsor.income}`);

//   await Promise.all([user.save(), sponsor.save()]);

//   console.log('Income updated successfully');
//   return res.status(200).send('Income updated successfully');
// });

//For new data set

//for new code end
// module.exports = router;





const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router.post("/updateWallet/:id", async (req, res) => {
//   const { id } = req.params;
//   let user = await User.findOne({ _id : id});
//   if (!user) {
//     console.log(`User with ID ${id} not found`);
//     return res.status(404).send("User not found");
//   }
//   console.log(`User found: ${JSON.stringify(user)}`);
//   user.income += 50;
//   await user.save();
//   console.log(`Account increased for user ${id}: ${user.income}`);
//   let sponsor = await User.findOne({ userId: user.sponsorId });
//   if (sponsor) {
//     console.log(`Sponsor found: ${JSON.stringify(sponsor)}`);
//     sponsor.income += 40;
//     await sponsor.save();
//     console.log(`Account increased for sponsor ${sponsor._id}: ${sponsor.income}`);
//     let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });
//     if (sponsor2) {
//       console.log(`Second sponsor found: ${JSON.stringify(sponsor2)}`);
//       sponsor2.income += 30;
//       await sponsor2.save();
//       console.log(`Account increased for second sponsor ${sponsor2._id}: ${sponsor2.income}`);
//     }
//     //
//     let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });
//     if (sponsor3) {
//       console.log(`Third sponsor found: ${JSON.stringify(sponsor3)}`);
//       sponsor3.income += 20;
//       await sponsor3.save();
//       console.log(`Account increased for Third sponsor ${sponsor3._id}: ${sponsor3.income}`);
//     }
//     //
//     let sponsor4 = await User.findOne({ userId: sponsor3.sponsorId });
//     if (sponsor4) {
//       console.log(`fourth sponsor found: ${JSON.stringify(sponsor4)}`);
//       sponsor4.income += 10;
//       await sponsor4.save();
//       console.log(`Account increased for fourth sponsor ${sponsor4._id}: ${sponsor4.income}`);
//     }
//   }
//   res.send("Account increased successfully");
// });


//
router.get('/api/daily-earnings', async (req, res) => {
  try {
    const sales = await User.find().sort({ date: 'asc' });
    const dailyEarnings = new Map();
    sales.forEach(sale => {
      const date = moment(sale.date).format('YYYY-MM-DD');
      const income = sale.income;
      const earnings = dailyEarnings.get(date) || 0;
      dailyEarnings.set(date, earnings + income);
    });
    res.json([...dailyEarnings]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post("/updateWallet/:userId", async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ userId : userId});
  if (!user) {
    // console.log(`User with ID ${userId} not found`);
    return res.status(404).send("User not found");
  }
  // console.log(`User found: ${JSON.stringify(user)}`);
  user.balance += 30;
  user.income += 30;
  user.selfIncome += 30;
  await user.save();
  // console.log(`Account increased for user ${userId}: ${user.income}`);
  let sponsor = await User.findOne({ userId: user.sponsorId });
  let spnosorCount = await User.countDocuments({ userId: user.sponsorId });
  if (sponsor && spnosorCount>=1) {
    // console.log(`Sponsor found: ${JSON.stringify(sponsor)}`);
    sponsor.balance +=4;
    sponsor.teamIncome +=4;
    sponsor.income += 4;
    await sponsor.save();
    // console.log(`Account increased for sponsor ${sponsor._id}: ${sponsor.income}`);
    let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });
    let sponsor2Count = await User.countDocuments({ userId: sponsor.sponsorId });
    if (sponsor2 && sponsor2Count>=2) {
      // console.log(`Second sponsor found: ${JSON.stringify(sponsor2)}`);
      sponsor2.balance +=3;
      sponsor2.teamIncome +=3;  
      sponsor2.income += 3;
      await sponsor2.save();
      // onsole.log(`Account increased for second sponsor ${sponsor2._id}: ${sponsor2.income}`);
      let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });
      let sponsor3Count = await User.countDocuments({ userId: sponsor2.sponsorId });
      if (sponsor3 && sponsor3Count >=3) {
        // console.log(`Third sponsor found: ${JSON.stringify(sponsor3)}`);
        sponsor3.balance +=2;
        sponsor3.teamIncome +=2;
        sponsor3.income += 2;
        await sponsor3.save();
        // console.log(`Account increased for third sponsor ${sponsor3._id}: ${sponsor3.income}`);
        //
        let sponsor4 = await User.findOne({userId: sponsor3.sponsorId});
        let sponsor4Count = await User.countDocuments({ userId: sponsor3.sponsorId });
        if(sponsor4 && sponsor4Count>=4){
          // console.log(`Fourth sponsor found: &{JSON.stringify(sponsor4)} `)
          // console.log(`Fourth sponsor found: ${sponsor4.userId}`);
          sponsor4.balance +=2;
          sponsor4.teamIncome +=2;
          sponsor4.income +=2;
          await sponsor4.save();
          // console.log(`Account increased for third sponsor ${sponsor4.userId}: ${sponsor4.income}`);
          //
          let sponsor5 = await User.findOne({userId: sponsor4.sponsorId});
          if(sponsor5){
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



//
// router.post("/updateWallet/:id", async (req, res) => {
//   const { id } = req.params;
//   let user = await User.findOne({ _id : id});
//   if (!user) {
//     console.log(`User with ID ${id} not found`);
//     return res.status(404).send("User not found");
//   }
//   console.log(`User found: ${JSON.stringify(user)}`);
//   user.income += 50;
//   await user.save();
//   console.log(`Account increased for user ${id}: ${user.income}`);
//   let sponsor = await User.findOne({ userId: user.sponsorId });
//   let sponsorCount = 0;
//   let sponsorCount2 = 0;
//   let sponsorCount3 =0;
//   let sponsorCount4 =0;
//   if (sponsor) {
//     console.log(`Sponsor found: ${JSON.stringify(sponsor)}`);
//     sponsorCount++;
//     sponsor.income += 40;
//     await sponsor.save();
//     console.log(`Account increased for sponsor ${sponsor._id}: ${sponsor.income}`);
//     let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });
   
//     if (sponsor2) {
//       console.log(`Second sponsor found: ${JSON.stringify(sponsor2)}`);
//       sponsorCount2 ++;
//       sponsor2.income += 30;
//       await sponsor2.save();
//       console.log(`Account increased for second sponsor ${sponsor2._id}: ${sponsor2.income}`);
      
//       let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });
//       if (sponsor3) {
//         console.log(`Third sponsor found: ${JSON.stringify(sponsor3)}`);
//         sponsorCount3++;
//         sponsor3.income += 20;
//         await sponsor3.save();
//         console.log(`Account increased for third sponsor ${sponsor3._id}: ${sponsor3.income}`);
//         //
//         let sponsor4 = await User.findOne({userId: sponsor3.sponsorId});
//         if(sponsor4){
//           console.log(`Fourth sponsor found: ${sponsor4.userId}`);
//           sponsorCount4 ++;
//           sponsor4.income +=10;
//           await sponsor4.save();
//           console.log(`Account increased for fourth sponsor ${sponsor4.userId}: ${sponsor4.income}`);
//         }
//       }
//     }
//   }
//   let message;
//   if (sponsorCount === 1) {
//     message = "Beginner";
//     console.log('Beginner');
//   } else if (sponsorCount2 === 2) {
//     message = "Medium";
//     console.log('Medium');
//   } else if (sponsorCount3 === 3) {
//     message = "Advance";
//     console.log('Advance');
//   } else if (sponsorCount4 === 3) {
//     message = "Advance level";
//     console.log('Advance level');
//   }
//   console.log(`Sponsor count: ${sponsorCount}, Message: ${message}`);
//   res.send("Account increased successfully");
// });



module.exports = router;
