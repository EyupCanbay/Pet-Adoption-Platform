const cron = require("node-cron");
const { User } = require("../models/index"); // Kullanıcı modelini içe aktar

// dakikada bir yasak süresi kontrolü
cron.schedule("*-10 * * * *", async () => {
    try {
        const now = new Date();
        const users = await User.find({ forbiddenTime: { $lte: now } }); // Önce güncellenecekleri al
        await User.updateMany(
            { forbiddenTime: { $lte: now } },
            { is_active: true, forbiddenTime: null}
        );
        console.log(users.map(user => user.userName), "Users who have expired the ban period have been activated.");
    } catch (error) {
       console.log("Cron job error:", error);
    }
});

module.exports = cron;
