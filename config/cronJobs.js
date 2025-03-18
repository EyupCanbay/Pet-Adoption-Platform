const cron = require("node-cron");
const { User } = require("../models/index"); // Kullanıcı modelini içe aktar

// 5 dakikada bir yasak süresi kontrolü
cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();
       const users = await User.updateMany(
            { forbiddenTime: { $lte: now } },
            { is_active: true, forbiddenUntil: null }, {new: true}
        );
        console.log(users.userName, "Users who have expired the ban period have been activated.");
    } catch (error) {
       console.log("Cron job error:", error);
    }
});

module.exports = cron;
