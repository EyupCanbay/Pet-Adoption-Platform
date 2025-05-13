require("dotenv").config()
const mongoose = require("mongoose")
const { faker } = require("@faker-js/faker")
const { Address, Category, Comment, ReplyComment, LostPetListing, Notification, PetListing, Report, SubCategory, User } = require("./models/index");



//dogs and cats breed and clours
const dogBreeds = ['Labrador', 'Golden Retriever', 'Bulldog', 'Beagle', 'Poodle'];  
const catBreeds = ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Ragdoll'];  
const clours = ["red", "blue", "green", "black", "brown"]


const dbConn = async (retryCount = 5) => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            dbName: 'tesodev_product'
        });
        console.log("Database connected successfully!");

        return seedDatabase(); 
    } catch (error) {
        console.error("Database connection failed:", error.message);

        if (retryCount > 0) {
            console.log(`Retrying connection in 3 seconds... (${retryCount} retries left)`);
            setTimeout(() => dbConn(retryCount - 1), 3000);
        } else {
            console.error("All connection attempts failed.");
        }
    }
};


// async function seedDatabase() {
//     await mongoose.connection.dropDatabase();

//     const users = await createUsers();
//     const categories = await createCategories(users);
//     const subCategories = await createSubCategories(categories, users);
//     const comments = await createComments(users);
//     const replyComments = await createReplyComments(users, comments);
//     const locations = await createAddresses(users);
//     const petListings = await createPetListings(users, categories, subCategories, comments);
//     const lostPetListings = await createLostPetListings(users, categories, subCategories, comments);
//     const notifications = await createNotifications(users, petListings);
//     const reportes = await createReports(users, petListings, lostPetListings);
//     console.log("\n\nAdded fake data in monogDB")
     
//     for(let i = 0; i<5; i++) {
//     const user = await User.findByIdAndUpdate(
//         faker.helpers.arrayElement(users)._id,{
//             $set: {
//                 blockedUser: faker.helpers.arrayElement(users)._id,
//                 bookmarks: [
//                     faker.helpers.arrayElement(petListings)._id,
//                     faker.helpers.arrayElement(petListings)._id,
//                     faker.helpers.arrayElement(petListings)._id
//                 ],
//                 rates:[{
//                     user: faker.helpers.arrayElement(users)._id,
//                     rate: faker.number.int({ min: 1, max: 10 })
//                 }],
//                 notifications: [
//                     faker.helpers.arrayElement(notifications)._id,
//                     faker.helpers.arrayElement(notifications)._id,
//                     faker.helpers.arrayElement(notifications)._id
//                 ],
//                 location:[
//                     faker.helpers.arrayElement(locations)._id
//                 ]
//             }
//         }, 
//         {new: true})
//     console.log(user)
//     }

//     const comment = await Comment.find();
//     const replyComment = await ReplyComment.find();
//     const category = await Category.find();
//     const subcategory = await SubCategory.find();
    
//     for referances comment data 
//     for(let c = 0; c < 30; c++) {
//         let buffer = []
//         for(let rc = 0; rc < 45; rc++) {

//             if(comment[c]._id.toString() === replyComment[rc].comment_id.toString()) {
//                 console.log(comment[c]._id, replyComment[rc].comment_id)
//                 buffer.push(replyComment[rc]._id)
//             }
//         }
//         let dbComment = await Comment.findByIdAndUpdate(comment[c]._id,{
//             reply_comment_id: buffer 
//         })
        
//     }

//     for referances category data 
//     for(let c = 0; c < 2; c++) {
//         let buffer = []
//         for(let sc = 0; sc < 10; sc++) {

//             if(category[c]._id.toString() === subcategory[sc].category_id.toString()) {
//                 console.log(category[c]._id, subcategory[sc].category_id)
//                 buffer.push(subcategory[sc]._id)
//             }
//         }
//         let dbComment = await Category.findByIdAndUpdate(category[c]._id,{
//             subCategory_id: buffer 
//         })
//     }
// }

async function seedDatabase() {
    await mongoose.connection.dropDatabase();

}

async function createUsers(){    //fake users create this part
    const users = []
    for (let i = 0; i < 5; i++) {
        const socialLinks = [
            {platform: 'facebook', url: faker.internet.url()},
            {platform: 'x', url: faker.internet.url()},
            {platform: 'instagram', url: faker.internet.url()}
        ]
        const user = new User({
            userName: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password(8, true),
            name: faker.person.firstName(),
            surname: faker.person.lastName(),
            birthdate: faker.date.past(30, new Date("2025-01-01")),
            phoneNumber: faker.phone.number('+90 ### ### ## ##'),
            profilePhoto: faker.internet.url(),
            bio: faker.lorem.sentence(),
            gender: faker.helpers.arrayElement(["male", "female", "non-binary"]),
            role: faker.helpers.arrayElement(["USER"]), // "user" veya "admin" rastgele seçilecek
            authType: faker.helpers.arrayElement(["local", "google"]),
            social_links: socialLinks,
            job: faker.person.jobTitle(),
            blockedUser: [],
            bookmarks: [],
            rates: [],
            is_active: faker.datatype.boolean(0.9),
           // forbiddenTime: faker.date.past(30, new Date("2025-01-01")),
          //  banCount: faker.helpers.arrayElement(["0","1"]),
            notifications: [],
           // location: faker.internet.username(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
        });

        await user.save()
        users.push(user)
        console.log("Added fake users succesfuly", users)
    }
    return users
}

async function createCategories(users){    //fake category create that part
    const categories = [];
    for(let i = 0; i < 2; i++) {
        const category = new Category({
            name: i === 0 ? "köpek" : "kedi",
            description: i === 0 ? "everyting for dogs" : "everything for cats",
            created_by: faker.helpers.arrayElement(users).userName,
        })
        await category.save();
        categories.push(category);
        console.log("Added succesfuly categories", categories)
    }
    return categories
}

async function createSubCategories(categories, users){   //for subcategory creating
    const subCategories = [];
    for (let i = 0; i < 5; i++) {
        //for dog subcategories
        const dogSubCategory = new SubCategory({
            breed: dogBreeds[i],  
            description: faker.lorem.sentence(),
            category_id: categories[0]._id,
            created_by: faker.helpers.arrayElement(users).userName
        });
        await dogSubCategory.save();
        subCategories.push(dogSubCategory);
        //for cat subcategories
        const catSubCategory = new SubCategory({
            breed: catBreeds[i],  // Kedi cinslerini kullan
            description: faker.lorem.sentence(),
            category_id: categories[1]._id, // 'Kedi' kategorisi
            created_by: faker.helpers.arrayElement(users).userName
        });
        await catSubCategory.save();
        subCategories.push(catSubCategory);
        console.log("Added succesfuly sub categories", subCategories)

    }
    return subCategories
}

async function createComments(users){   //for comments
    const comments = []
    for (let i = 0; i < 30; i++) {
        const comment = new Comment({
            user_id: faker.helpers.arrayElement(users)._id,
            content: faker.lorem.sentence(),
            createdAt: faker.date.recent()
        });
        await comment.save();
        comments.push(comment);
        console.log("Added succesfuly comments", comments)

    }
    return comments
}

async function createReplyComments(users, comments){   // Yanıt yorumlar oluştur
    const replyComments = []
    for (let i = 0; i < 45; i++) {
        const replyComment = new ReplyComment({
            user_id: faker.helpers.arrayElement(users)._id,
            comment_id: faker.helpers.arrayElement(comments)._id,
            content: faker.lorem.sentence(),
            createdAt: faker.date.recent()
        });
        await replyComment.save();
        replyComments.push(replyComment)
        console.log("Added succesfuly reply comments", replyComments)

    }
    return replyComments
}
 
async function createAddresses(users){   // adress creating
    const locations = []
    for (let i = 0; i < 5; i++) {
        const address = new Address({
            user_id: faker.helpers.arrayElement(users)._id,
            country: faker.location.country(),
            city: faker.location.city(),
            state: faker.location.state(),
            neighborhood: faker.location.street(),
            createdAt: faker.date.recent()
        });
        await address.save();
        locations.push(address)
        console.log("Added succesfuly address", address)

    }
    return locations
    
}

async function createPetListings(users, categories, subCategories, comments){    //for pet listing
    const petListings = [];
    for (let i = 0; i < 15; i++) {
        const petListing = new PetListing({
            user_id: faker.helpers.arrayElement(users)._id,
            category_name: faker.helpers.arrayElement(categories).name,
            sub_category_name: faker.helpers.arrayElement(subCategories).breed,
            comment_id: [faker.helpers.arrayElement(comments)._id,faker.helpers.arrayElement(comments)._id,faker.helpers.arrayElement(comments)._id],
            petName: faker.animal.dog(),  // Hayvanın adı eklendi
            age: faker.number.int({ min: 1, max: 15 }),
            gender: faker.datatype.boolean(),
            description: faker.lorem.paragraph(),
            images: [faker.image.url(), faker.image.url],         //----------------------------
            status: faker.datatype.boolean(),
            additionalInfo: {
                color: faker.helpers.arrayElement(clours),
                eyeColor: faker.helpers.arrayElement(clours),
                furType: faker.helpers.arrayElement(["short", "long", "hairless"]),
                size: faker.helpers.arrayElement(["small", "medium", "large"]),
                weight: faker.number.int({ min: 1, max: 50 }),
                vaccinated: faker.datatype.boolean(),
                vaccinated_last_date: faker.date.future(),
                neutered: faker.datatype.boolean(),
                trainability: faker.helpers.arrayElement(["easy", "medium", "hard"]),
                playfulness: faker.number.int({ min: 1, max: 5 }),
                sociality: faker.helpers.arrayElement(["low", "medium", "high"]),
            },
            createdAt: faker.date.recent()
        });
        await petListing.save();
        petListings.push(petListing);
        console.log("Added succesfuly listing", petListings)
    }
    return petListings
}

async function createLostPetListings(users, categories, subCategories, comments){   // for lost listing
    const lostPetListings = [];
    for (let i = 0; i < 15; i++) {
        const lostPetListing = new LostPetListing({
            user_id: faker.helpers.arrayElement(users)._id,
            category_name: faker.helpers.arrayElement(categories).name,
            sub_category_name: faker.helpers.arrayElement(subCategories).breed,
            comment_id:  [faker.helpers.arrayElement(comments)._id,faker.helpers.arrayElement(comments)._id,faker.helpers.arrayElement(comments)._id],
            petName: faker.animal.cat(),  // Hayvanın adı eklendi
            age: faker.number.int({ min: 1, max: 15 }),
            gender: faker.datatype.boolean(),
            description: faker.lorem.paragraph(),
            images: [faker.image.url(), faker.image.url()],   //-----------------------------------
            status: faker.datatype.boolean(),
            additionalInfo: {
                color: faker.helpers.arrayElement(clours),
                eyeColor: faker.helpers.arrayElement(clours),
                furType: faker.helpers.arrayElement(["short", "long", "hairless"]),
                size: faker.helpers.arrayElement(["small", "medium", "large"]),
                weight: faker.number.int({ min: 1, max: 50 }),
                vaccinated: faker.datatype.boolean(),
                vaccinated_last_date: faker.date.future(),
                trainability: faker.helpers.arrayElement(["easy", "medium", "hard"]),
                playfulness: faker.number.int({ min: 1, max: 5 }),
                sociality: faker.helpers.arrayElement(["low", "medium", "high"])
            },
            createdAt: faker.date.recent()
        });
        await lostPetListing.save();
        lostPetListings.push(lostPetListing);
        console.log("Added succesfuly listing", lostPetListing)

    }
    return lostPetListings
}

async function createNotifications(users, petListings){    //for notifications
    const notifications = []
    for (let i = 0; i < 30; i++) {
        const notification = new Notification({
            recipient_id: faker.helpers.arrayElement(users)._id,
            initiator_id: faker.helpers.arrayElement(users)._id,
            postId: faker.helpers.arrayElement(petListings)._id,
            type: faker.helpers.arrayElement(['comment', 'reply', 'favorite', 'report', 'general']),
            message: faker.lorem.paragraph(),
            isRead: faker.datatype.boolean(),
            createdAt: faker.date.recent()
            })

            await notification.save();
            notifications.push(notification);
            console.log("Added succesfuly notifications", notifications)

    }
    return notifications
}
    
async function createReports(users, petListings, lostPetListings){   // Raporlar oluştur
    
    for (let i = 0; i < 5; i++) {
        const pet_lisitng_report = new Report({
            reporter: faker.helpers.arrayElement(users)._id,
            reportedUser: faker.helpers.arrayElement(users)._id,
            reportedPetListing_id: faker.helpers.arrayElement(petListings)._id, // PetListing'e referans
            reason: faker.lorem.sentence(),
            status: faker.datatype.boolean(),
            createdAt: faker.date.recent()
        });

        const lost_lisitng_report = new Report({
            reporter: faker.helpers.arrayElement(users)._id,
            reportedUser: faker.helpers.arrayElement(users)._id,
            reportedLostPetListing_id: faker.helpers.arrayElement(lostPetListings)._id, // PetListing'e referans
            reason: faker.lorem.sentence(),
            status: faker.datatype.boolean(),
            createdAt: faker.date.recent()
        });


        const users_report = new Report({
            reporter: faker.helpers.arrayElement(users)._id,
            reportedUser: faker.helpers.arrayElement(users)._id,
            reason: faker.lorem.sentence(),
            status: faker.datatype.boolean(),
            createdAt: faker.date.recent()
        });



        await pet_lisitng_report.save();
        await lost_lisitng_report.save()
        await users_report.save()
        console.log("Added succesfuly report", users_report)
    }
}

dbConn(); 

