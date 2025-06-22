# Pet Adoption Platform API

## Project Description

The Pet Adoption Platform is a backend service designed to facilitate pet adoption and help find lost pets. It allows users to register, create listings for pets available for adoption or report lost pets, browse and search for listings, interact through comments and replies, bookmark favorite listings, and receive notifications. The platform also includes an admin panel for user management, role assignments, and viewing audit logs. A sentiment analysis feature is integrated to moderate comments for potentially inappropriate content related to financial transactions, and an image validation feature ensures uploaded images contain pets and reject indecent frames.

## Features

*   **User Management**: Registration, login, logout, profile management (view, update).
*   **Pet Listings**:
    *   Create, read, update, delete (CRUD) listings for pets available for adoption.
    *   CRUD listings for lost pets.
*   **Categorization**: Pets are categorized (e.g., Dog, Cat) and sub-categorized by breed.
*   **Interaction**:
    *   Comment on listings.
    *   Reply to comments.
*   **User Actions**:
    *   Bookmark favorite listings.
    *   Block other users.
    *   Report users or listings.
*   **Notifications**: Users receive notifications for comments, replies, etc.
*   **Search**: Global search functionality across various data models (users, listings, etc.).
*   **Image Validation**: Uploaded images are processed by a Python script using YOLOv5 to detect the presence of animals and the absence of humans.
*   **Sentiment Analysis**: Comments are analyzed using a pre-trained model to detect and prevent discussions containing IBAN information or general money-related content, ensuring appropriate communication within the platform.
*   **Admin Panel**:
    *   View audit logs.
    *   Manage user roles.
    *   View reports and ban users.
*   **Security & Moderation**:
    *   JWT-based authentication.
    *   Role-based authorization (USER, ADMIN).
    *   Cron job for automatic unbanning of users after a set duration.
    *   Content moderation for comments via sentiment analysis.
*   **Audit Logging**: Tracks significant actions within the system.

## Technologies Used

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **Authentication**: JSON Web Tokens (JWT), bcrypt
*   **Real-time/Scheduled Tasks**: node-cron
*   **Sentiment Analysis**: Custom Python model (TensorFlow/Keras- used LSTM) integrated via `child_process`.
*   **Image Detection**: YOLOv5 model implemented in Python and integrated via `child_process`.
*   **Other Key Libraries**:
    *   `dotenv` for environment variables
    *   `cookie-parser` for cookie management
    *   `cors` for Cross-Origin Resource Sharing
    *   `morgan` for HTTP request logging
    *   `express-validator` for input validation
    *   `cloudinary` for image hosting

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    https://github.com/EyupCanbay/Pet-Adoption-Platform.git
    cd Pet-Adoption-Platform
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    Create a `.env` file in the root directory and add the necessary environment variables
    ```env
    NODE_ENV=development
    DB_URI=your_mongodb__url
    JWT_SECRET=your_very_secret_jwt_key
    PYTHON_URI=/path/to/your/python_executable 
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
    *Note: The sentiment analysis model (`sentiment_model.h5`), `tokenizer.json`, and `label_map.json` are expected to be in a directory `sensement_analys` relative to the `sentimentAnalyzer.js` file's parent directory (i.e., `pet-adoption-platform/sensement_analys/`). Ensure the `image_detector` Python script has access to `yolov5m_best.pt` in its directory.*

4.  **Ensure MongoDB is running.**

5.  **Start the application**:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/auth`)

*   **`POST /auth/register`**
    *   Description: Registers a new user.
    *   Validation: `validateRegister` (checks for required fields, email format, password strength, unique constraints).
    *   Controller: `authController.register`
*   **`POST /auth/login`**
    *   Description: Logs in an existing user and sets an HTTP-only token cookie.
    *   Validation: `validateLogin` (checks credentials). Potentially `checkBanStatus` (though `checkBanStatus` is designed to check ban on email, it's not explicitly used in the route definition but might be intended).
    *   Controller: `authController.login`
*   **`GET /auth/logout`**
    *   Description: Logs out the currently authenticated user by clearing the token cookie.
    *   Middleware: `checkUser` (ensures user is logged in).
    *   Controller: `authController.logout`

### Users (`/users`)

*   **`GET /users`**
    *   Description: Retrieves a list of all users (excluding blocked users and admins for regular users).
    *   Middleware: `checkUser`.
    *   Controller: `userController.getAllUsers`
*   **`GET /users/me`**
    *   Description: Retrieves the profile information of the currently authenticated user, including their address.
    *   Middleware: `checkUser`.
    *   Controller: `userController.getUserMe`
*   **`PUT /users/me`**
    *   Description: Updates the profile information and/or address of the currently authenticated user.
    *   Middleware: `checkUser`. (Note: `validateUserData` and `validateAddressData` are defined but not used in this route's middleware chain).
    *   Controller: `userController.putUserMe`
*   **`GET /users/me/listing`**
    *   Description: Retrieves all pet listings (adoption and lost) created by the currently authenticated user.
    *   Middleware: `checkUser`.
    *   Controller: `userController.getAllListing`
*   **`GET /users/me/bookmarks`**
    *   Description: Retrieves all listings bookmarked by the currently authenticated user.
    *   Middleware: `checkUser`.
    *   Controller: `userController.getUserBookmarks`
*   **`DELETE /users/me/bookmarks/:listing_id`**
    *   Description: Removes a specific listing from the authenticated user's bookmarks.
    *   Middleware: `checkUser`.
    *   Controller: `userController.deleteUserBookmarks`
*   **`GET /users/me/block`**
    *   Description: Retrieves a list of users blocked by the currently authenticated user.
    *   Middleware: `checkUser`.
    *   Controller: `userController.getBlockUsers`
*   **`GET /users/:user_id`**
    *   Description: Retrieves the profile information of a specific user by their ID, including their address.
    *   Controller: `userController.getUser`
*   **`GET /users/:user_id/listing`**
    *   Description: Retrieves all pet listings (adoption and lost) created by a specific user.
    *   Middleware: `checkUser`.
    *   Controller: `userController.getAllListingForUsers`
*   **`PUT /users/block/:user_id`**
    *   Description: Allows the authenticated user (role: USER) to block another user.
    *   Middleware: `checkUser`, `checkRole(["USER"])`.
    *   Controller: `userController.blockedUser`
*   **`DELETE /users/block/:user_id`**
    *   Description: Allows the authenticated user to unblock another user.
    *   Middleware: `checkUser`.
    *   Controller: `userController.deleteUserBlock`
*   **`POST /users/report/:user_id`**
    *   Description: Allows an authenticated user to report another user or their listings.
    *   Middleware: `checkUser`, `validateReportData`.
    *   Controller: `reportController.reportUser`
*   **`GET /users/report/admin`**
    *   Description: (Admin only) Retrieves all user reports.
    *   Middleware: `checkUser`, `checkRole(['ADMIN'])`.
    *   Controller: `reportController.getAllReport`
*   **`PUT /users/report/admin/:user_id`**
    *   Description: (Admin only) Bans a user for a specified duration.
    *   Middleware: `checkUser`, `checkRole(['ADMIN'])`.
    *   Controller: `reportController.forbiddenUser`

### Categories (`/category`)

*   **`GET /category`**
    *   Description: Retrieves all pet categories.
    *   Controller: `categoryController.getCategories`
*   **`POST /category`**
    *   Description: (Admin authenticated) Creates a new pet category.
    *   Middleware: `checkUser`, `validateCategory`.
    *   Controller: `categoryController.createCategory`
*   **`PUT /category/:category_id`**
    *   Description: Updates an existing pet category. (Admin access implied).
    *   Controller: `categoryController.updateCategory`
*   **`DELETE /category/:category_id`**
    *   Description: Deletes a pet category. (Admin access implied).
    *   Controller: `categoryController.deleteCategory`
*   **`POST /category/:category_id/subcategory`**
    *   Description: (Admin authenticated) Creates a new subcategory (breed) under a specific category.
    *   Middleware: `checkUser`, `validateSubCategory`.
    *   Controller: `categoryController.createSubcategory`

### Subcategories (`/subcategory`)

*   **`GET /subcategory`**
    *   Description: Retrieves all subcategories (breeds).
    *   Controller: `subCategoryController.getAllSubCategories`
*   **`GET /subcategory/:subcategory_id`**
    *   Description: Retrieves a specific subcategory by its ID.
    *   Controller: `subCategoryController.getSubCategory`
*   **`PUT /subcategory/:subcategory_id`**
    *   Description: Updates an existing subcategory. (Admin access implied).
    *   Controller: `subCategoryController.updateSubCategory`
*   **`DELETE /subcategory/:subcategory_id`**
    *   Description: Deletes a subcategory. (Admin access implied).
    *   Controller: `subCategoryController.deleteSubCategory`

### Pet Listings (for Adoption) (`/listing`)

*   **`POST /listing`**
    *   Description: Creates a new pet listing for adoption. Uploads image to Cloudinary after validation.
    *   Middleware: `checkUser`, `imageValidator`, `uploadToCloudinary`, `validatePetListing`.
    *   Controller: `petListingController.createLostListing` (This function name appears to be a misnomer based on the model used).
*   **`GET /listing`**
    *   Description: Retrieves all pet listings for adoption with pagination.
    *   Controller: `petListingController.getAllPetListing`
*   **`GET /listing/:listing_id`**
    *   Description: Retrieves a specific pet listing for adoption by its ID, including user and address details.
    *   Controller: `petListingController.getPetListing`
*   **`DELETE /listing/:listing_id`**
    *   Description: Deletes a specific pet listing for adoption. User must be the owner or admin.
    *   Middleware: `checkUser`.
    *   Controller: `petListingController.deletePetListing`
*   **`PUT /listing/:listing_id`**
    *   Description: Updates a specific pet listing for adoption. User must be the owner or admin.
    *   Middleware: `checkUser`, `validatePetListing`.
    *   Controller: `petListingController.updatePetListing`
*   **`POST /listing/:listing_id/bookmarks`**
    *   Description: Adds a pet listing to the authenticated user's bookmarks.
    *   Middleware: `checkUser`.
    *   Controller: `petListingController.addPetListingBookmarks`
*   **`POST /listing/:listing_id/comment`**
    *   Description: Adds a comment to a specific pet listing.
    *   Middleware: `checkUser`, `sentimentAnalyzerMiddleware`.
    *   Controller: `petListingCommentController.createPetListingComment`
*   **`GET /listing/:listing_id/comment`**
    *   Description: Retrieves all comments for a specific pet listing.
    *   Controller: `petListingCommentController.getAllPetListingComments`
*   **`DELETE /listing/:listing_id/comment/:comment_id`**
    *   Description: Deletes a comment from a pet listing. User must be comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `petListingCommentController.deletePetListingComment`
*   **`PUT /listing/:listing_id/comment/:comment_id`**
    *   Description: Updates a comment on a pet listing. User must be comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `petListingCommentController.updatePetListingComment`
*   **`POST /listing/:listing_id/comment/:comment_id/reply_comment`**
    *   Description: Adds a reply to a specific comment on a pet listing.
    *   Middleware: `checkUser`, `sentimentAnalyzerMiddleware`.
    *   Controller: `petListingCommentController.createReplyComment`
*   **`GET /listing/:listing_id/comment/:comment_id/reply_comment`**
    *   Description: Retrieves all replies for a specific comment on a pet listing.
    *   Controller: `petListingCommentController.getAllSubComments`
*   **`DELETE /listing/:listing_id/comment/:comment_id/reply_comment/:reply_id`**
    *   Description: Deletes a reply to a comment. User must be reply owner, main comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `petListingCommentController.deleteSubComment`
*   **`PUT /listing/:listing_id/comment/:comment_id/reply_comment/:reply_id`**
    *   Description: Updates a reply to a comment. User must be reply owner, main comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `petListingCommentController.updatePetListingSubComment`

### Lost Pet Listings (`/lost_listing`)

*   **`POST /lost_listing`**
    *   Description: Creates a new lost pet listing. Validates image content before processing.
    *   Middleware: `checkUser`, `imageValidator`, `uploadToCloudinary`, `validateLostPetListing`.
    *   Controller: `listingController.createLostListing`
*   **`GET /lost_listing`**
    *   Description: Retrieves all lost pet listings with pagination.
    *   Controller: `listingController.getAllLostListing`
*   **`GET /lost_listing/:listing_id`**
    *   Description: Retrieves a specific lost pet listing by its ID, including user and address details.
    *   Controller: `listingController.getLostListing`
*   **`DELETE /lost_listing/:listing_id`**
    *   Description: Deletes a specific lost pet listing. User must be the owner or admin.
    *   Middleware: `checkUser`.
    *   Controller: `listingController.deleteLostListing`
*   **`PUT /lost_listing/:listing_id`**
    *   Description: Updates a specific lost pet listing. User must be the owner or admin.
    *   Middleware: `checkUser`, `validateLostPetListing`.
    *   Controller: `listingController.updateLostListing`
*   **`POST /lost_listing/:listing_id/bookmarks`**
    *   Description: Adds a lost pet listing to the authenticated user's bookmarks.
    *   Middleware: `checkUser`.
    *   Controller: `listingController.addBookmarks`
*   **`POST /lost_listing/:listing_id/comment`**
    *   Description: Adds a comment to a specific lost pet listing.
    *   Middleware: `checkUser`, `sentimentAnalyzerMiddleware`.
    *   Controller: `commentController.createComment`
*   **`GET /lost_listing/:listing_id/comment`**
    *   Description: Retrieves all comments for a specific lost pet listing.
    *   Controller: `commentController.getAllComments`
*   **`DELETE /lost_listing/:listing_id/comment/:comment_id`**
    *   Description: Deletes a comment from a lost pet listing. User must be comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `commentController.deleteComment`
*   **`PUT /lost_listing/:listing_id/comment/:comment_id`**
    *   Description: Updates a comment on a lost pet listing. User must be comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `commentController.updateLostListingComment`
*   **`POST /lost_listing/:listing_id/comment/:comment_id/reply_comment`**
    *   Description: Adds a reply to a specific comment on a lost pet listing.
    *   Middleware: `checkUser`, `sentimentAnalyzerMiddleware`.
    *   Controller: `commentController.createReplyComment`
*   **`GET /lost_listing/:listing_id/comment/:comment_id/reply_comment`**
    *   Description: Retrieves all replies for a specific comment on a lost pet listing.
    *   Controller: `commentController.getAllSubComments`
*   **`DELETE /lost_listing/:listing_id/comment/:comment_id/reply_comment/:reply_id`**
    *   Description: Deletes a reply to a comment. User must be reply owner, main comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `commentController.deleteSubComment`
*   **`PUT /lost_listing/:listing_id/comment/:comment_id/reply_comment/:reply_id`**
    *   Description: Updates a reply to a comment. User must be reply owner, main comment owner, listing owner, or admin.
    *   Middleware: `checkUser`.
    *   Controller: `commentController.updateLostListingSubComment`

### Admin (`/admin`)

*   **`GET /admin/auditlogs`**
    *   Description: (Admin only) Retrieves audit logs with pagination.
    *   Middleware: `checkUser`, `checkRole(['ADMIN'])`.
    *   Controller: `adminController.getAuditlogs`
*   **`PUT /admin/changing_role/:user_id`**
    *   Description: (Admin only) Updates the role of a specific user.
    *   Middleware: `checkUser`, `checkRole(['ADMIN'])`.
    *   Controller: `adminController.updateRole`

### Search (`/search`)

*   **`GET /search`**
    *   Description: Performs a global search across multiple models (Users, PetListings, LostPetListings, etc.) based on a query term. Excludes AuditLogs from results.
    *   Query Params: `search` (string, required), `page` (number, optional), `limit` (number, optional).
    *   Controller: `searchController.searching`

### Notifications (`/notification`)

*   **`GET /notification`**
    *   Description: Retrieves all notifications for the currently authenticated user.
    *   Middleware: `checkUser`.
    *   Controller: `notificationController.getNotifications`
*   **`DELETE /notification/:notification_id`**
    *   Description: Deletes a specific notification for the authenticated user.
    *   Middleware: `checkUser`.
    *   Controller: `notificationController.deleteNotifications`

## Cron Jobs

*   **User Unban Cron Job**:
    *   File: `config/cronJobs.js`
    *   Schedule: Runs every minute (`* * * * *`).
    *   Purpose: Checks for users whose `forbiddenTime` has passed. If found, it reactivates their account (`is_active: true`) and clears their `forbiddenTime`.

## Sentiment Analysis

*   **Mechanism**: A Python script (`sensement_analys/predict_sentiment.py`) using a pre-trained TensorFlow/Keras model is employed.
*   **Integration**: The `sentimentAnalyzerMiddleware` (`middleware/sentimentAnalyzer.js`) calls this Python script as a child process.
*   **Purpose**: To analyze the content of user-submitted comments (and replies).
*   **Action**:
    *   If the sentiment analysis detects text related to "IBAN" (label `1`) or "money talk" (label `0`), the middleware blocks the request with a `400 Bad Request` error.
    *   Otherwise (label `-1`), the request proceeds.
*   **Training Data**: The `sensement_analys/train_model.py` file shows the data and labels used for training the model:
    *   Label `1`: IBAN/payment related phrases.
    *   Label `0`: General money-related phrases.
    *   Label `-1`: Normal, acceptable pet-related conversation.

## Image Validation

*   **Mechanism**: A Python script (`image_detector/detect.py`) utilizing YOLOv5 is used for image validation.
*   **Integration**: The `imageValidator` middleware (`middleware/image_detector.js`) invokes this Python script when an image is uploaded.
*   **Purpose**: To verify if an uploaded image contains an animal and no humans.
*   **Action**:
    *   If the image contains a human (`HUMAN_CLASS_NAME`), the request is rejected with a `400 Bad Request` (`detecting invalid frame`).
    *   If the image contains an animal (`ANIMAL_CLASS_NAME`), the request proceeds to the next middleware.
    *   If no animal is found or an error occurs during detection, the request is rejected with a `400 Bad Request` (`do not found animal in frame` or `an error occurred during image verification`).

## Cloudinary Image Upload

*   **Mechanism**: Images are uploaded to Cloudinary using the `uploadToCloudinary` middleware (`middleware/upload_to_cloudinary.js`).
*   **Purpose**: Stores uploaded images in a cloud-based storage solution for better scalability and accessibility.
*   **Process**: After successful upload, the temporary local file is deleted.

## Database Schema Overview

The application uses MongoDB, and the main data models are:

*   **User**: Stores user information, credentials, roles, blocked users, bookmarks, notifications, etc.
*   **Address**: Stores address details linked to a user.
*   **Category**: Defines main categories for pets (e.g., Dog, Cat).
*   **SubCategory**: Defines breeds or sub-types within a category.
*   **PetListing**: Represents pets available for adoption, including details, images, status, and associated comments.
*   **LostPetListing**: Represents lost pets, with similar details to `PetListing`.
*   **Comment**: Stores comments made by users on listings (both adoption and lost). Can be linked to `PetListing` or `LostPetListing`.
*   **ReplyComment**: Stores replies to existing comments.
*   **Notification**: Stores notifications for users regarding various events (new comments, replies, etc.).
*   **Report**: Stores reports made by users against other users or listings.
*   **AuditLogs**: Stores logs of significant actions performed in the system for auditing purposes.

Each model has fields for timestamps (`createdAt`, `updatedAt`) and appropriate indexing for efficient querying. Relationships between models are managed using `ObjectId` references.

## Validators

Various validator middlewares are defined to ensure data integrity before processing requests:

*   **Auth Validators** (`validators/auth_validator.js`): `validateRegister`, `validateLogin` for user registration and login.
*   **Listing Validators**:
    *   `validators/pet_listing_validator.js`: `validatePetListing` for creating/updating adoption listings.
    *   `validators/lost_listing_validator.js`: `validateLostPetListing` for creating/updating lost pet listings.
*   **Category Validators** (`validators/category_validator.js`): `validateCategory`, `validateSubCategory` for category and subcategory creation/updates.
*   **Report Validator** (`validators/report_validator.js`): `validateReportData` for user reports.
*   **User Data Validators** (`validators/user_validator.js`): `validateUserData`, `validateAddressData` (defined but not explicitly used in the `PUT /users/me` route).
*   **Object ID Validator** (`validators/object_validate.js`): `validateObjectId` helper function to ensure MongoDB ObjectIds are valid.