const cron = require("node-cron");
const { User } = require("./models/index"); // Kullanıcı modelini içe aktar

// 5 dakikada bir yasak süresi kontrolü
cron.schedule("*/10 * * * *", async () => {
    try {
        const now = new Date();
        await User.updateMany(
            { forbiddenTime: { $lte: now } },
            { is_active: true, forbiddenUntil: null }
        );
        console.log("Users who have expired the ban period have been activated.");
    } catch (error) {
       console.log("Cron job error:", error);
    }
});

module.exports = cron;
