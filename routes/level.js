

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router.post("/updateWallet/:userId", async (req, res) => {
//   const { userId } = req.params;
//   let user = await User.findOne({ userId : userId});
//   if (!user) {
//     // console.log(`User with ID ${userId} not found`);
//     return res.status(404).send("User not found");
//   }
//   // let spon = await User.find({sponsorId: userId}).select('userId name sponsorId');
//   // console.log(`print all data: ${spon}`)
//   // console.log(`User found: ${JSON.stringify(user)}`);
//   user.balance += 30;
//   user.income += 30;
//   user.selfIncome += 30;
//   await user.save();
//   // console.log(`Account increased for user ${userId}: ${user.income}`);
//   let sponsor = await User.findOne({ userId: user.sponsorId });
//   // console.log("sponsor Account");
//   console.log(sponsor);
//   let spnosorCount = await User.countDocuments({ userId: user.sponsorId });
//   console.log(spnosorCount);
//   if (sponsor && spnosorCount>=1) {
//     // console.log(`Sponsor found: ${JSON.stringify(sponsor)}`);
//     sponsor.balance +=4;
//     sponsor.teamIncome +=4;
//     sponsor.income += 4;
//     await sponsor.save();
//     // console.log(`Account increased for sponsor ${sponsor._id}: ${sponsor.income}`);
//     let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });
//     console.log("sponsor 0f sponsor Account");
//     console.log(sponsor2);
//     const sponsor2CountUser = await User.distinct('userId', { sponsorId: sponsor2.userId }).countDocuments();
    
//     console.log(`Sponsor2Count= ${sponsor2CountUser}`)
//     //  console.log(`Sponsor2CountUser= ${sponsor2CountUser}`)
//     if (sponsor2 && sponsor2CountUser >=2 ) {
//       // console.log(`Second sponsor found: ${JSON.stringify(sponsor2)}`);
//       sponsor2.teamIncome +=3;  
//       sponsor2.balance +=3;
//       sponsor2.income += 3;
//       await sponsor2.save();
//       // onsole.log(`Account increased for second sponsor ${sponsor2._id}: ${sponsor2.income}`);
//       // let sponsor3 = await User.findOne({ userId:  sponsor2.sponsorId });
//       let sponsor3User = await User.countDocuments({ sponsorId: sponsor2.userId}).distinct('userId');
//       // console.log(sponsor3User) // GSP sponsor's direct user - n,d
//       let sponsor3 = await User.countDocuments({ sponsorId: sponsor2.sponsorId}).distinct('sponsorId');
//       console.log('Sponsor2 of sponsor')
//       // console.log(sponsor3) // GSP sponsor's
//         // console.log("sponsor2 0f sponsor Account");
//         // console.log(sponsor3);
//         const sponsor3Count = await User.distinct('userId', { sponsorId: sponsor2.userId }).countDocuments();
//         // console.log(sponsor3Count)// GSP sponsor's direct user - n,d = 2
//         // let sponsor3Count = await User.countDocuments({  sponsorId: sponsor3.userId});
//         if (sponsor3 && sponsor3Count >=3) {
//           // console.log(`Third sponsor found: ${JSON.stringify(sponsor3)}`);
//           sponsor3.balance +=2;
//           sponsor3.teamIncome +=2;
//           sponsor3.income += 2;
//           await sponsor3.save();
//           // console.log(`Account increased for third sponsor ${sponsor3._id}: ${sponsor3.income}`);
//           //
//           let sponsor4 = await User.findOne({userId: user.sponsorId});
//           let sponsor4Count = await User.countDocuments({  sponsorId: sponsor4.userId });
//           if(sponsor4 && sponsor4Count>4){
//             // console.log(`Fourth sponsor found: &{JSON.stringify(sponsor4)} `)
//             // console.log(`Fourth sponsor found: ${sponsor4.userId}`);
//             sponsor4.balance +=1;
//             sponsor4.teamIncome +=1;
//             sponsor4.income +=1;
//             await sponsor4.save();
//             // console.log(`Account increased for third sponsor ${sponsor4.userId}: ${sponsor4.income}`);
//             //
//             let sponsor5 = await User.findOne({userId: user.sponsorId});
//             let sponsor5Count = await User.countDocuments({  sponsorId: sponsor3.userId });
//             if(sponsor5 && sponsor5Count>=5){
//               // console.log(`Fourth sponsor found: &{JSON.stringify(sponsor4)} `)
//               // console.log(`Fifth sponsor found: ${sponsor5.userId}`);
//               sponsor5.balance +=1;
//               sponsor5.teamIncome +=1;
//               sponsor5.income +=1;
//               await sponsor5.save();
//               // console.log(`Account increased for fifth sponsor ${sponsor5.userId}: ${sponsor5.income}`);
//             }  
//           }
//         }
//       }
 
//   }
//   res.send("Account increased successfully");
// })

router.post("/updateWallet/:userId", async (req, res) => {
  const { userId } = req.params;
  let user = await User.findOne({ userId: userId });
  if (!user) {
    return res.status(404).send("User not found");
  }

  user.balance += 30;
  user.income += 30;
  user.selfIncome += 30;
  await user.save();

  let sponsor = await User.findOne({ userId: user.sponsorId });
  let sponsorCount = await User.countDocuments({ userId: user.sponsorId });

  if (sponsor && sponsorCount >= 1) {
    sponsor.balance += 4;
    sponsor.teamIncome += 4;
    sponsor.income += 4;
    await sponsor.save();

    let sponsor2 = await User.findOne({ userId: sponsor.sponsorId });

    if (sponsor2) {
      // let sponsor2CountUser = await User.countDocuments({ sponsorId: sponsor2.userId });
      let sponsor2CountUser = await User.distinct('userId', { sponsorId: sponsor2.userId }).countDocuments();
      if (sponsor2CountUser >= 2) {
        sponsor2.teamIncome += 3;
        sponsor2.balance += 3;
        sponsor2.income += 3;
        await sponsor2.save();

        let sponsor3 = await User.findOne({ userId: sponsor2.sponsorId });

        if (sponsor3) {
          let sponsor3CountUser = await User.countDocuments({ sponsorId: sponsor2.userId });

          if (sponsor3CountUser >= 3) {
            sponsor3.balance += 2;
            sponsor3.teamIncome += 2;
            sponsor3.income += 2;
            await sponsor3.save();

            let sponsor4 = await User.findOne({ userId: sponsor3.sponsorId });

            if (sponsor4) {
              let sponsor4CountUser = await User.countDocuments({ sponsorId: sponsor3.userId });

              if (sponsor4CountUser >= 4) {
                sponsor4.balance += 1;
                sponsor4.teamIncome += 1;
                sponsor4.income += 1;
                await sponsor4.save();

                let sponsor5 = await User.findOne({ userId: sponsor4.sponsorId });

                if (sponsor5) {
                  let sponsor5CountUser = await User.countDocuments({ sponsorId: sponsor4.userId });

                  if (sponsor5CountUser >= 5) {
                    sponsor5.balance += 1;
                    sponsor5.teamIncome += 1;
                    sponsor5.income += 1;
                    await sponsor5.save();
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  res.send("Account increased successfully");
});


module.exports = router;
