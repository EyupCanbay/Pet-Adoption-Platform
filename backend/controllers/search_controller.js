const responseHandler = require('../utils/responseHandler')
const Enum = require('../config/enum')
const models = require('../models/index'); // Tüm modeller buradan import edildi



async function searching(req, res, next) {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        if (!search) {
            return responseHandler.error({
                res, 
                statusCode: Enum.HTTP_CODES.BAD_REQUEST, 
                message: "Search term is required"
            });
        }

        const results = {};
        let foundAnyResults = false;

        if (!models || typeof models !== 'object') {
            return responseHandler.error({
                res, 
                statusCode: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR, 
                message: "Models not properly configured"
            });
        }

        // Perform search across all models
        for (const [modelName, model] of Object.entries(models)) {
            try {
                // Try text search first (requires text index)
                let foundDocuments = [];
                
                try {
                    foundDocuments = await model.find(
                        { $text: { $search: search } },
                        { score: { $meta: "textScore" } }
                    ).sort({ score: { $meta: "textScore" } }).skip(skip).limit(limit);
                } catch (textSearchError) {
                    // Fallback to regex search if text search fails
                    const searchableFields = Object.keys(model.schema.paths).filter(
                        path => ['String'].includes(model.schema.paths[path].instance)
                    );
                    
                    if (searchableFields.length > 0) {
                        const regexConditions = searchableFields.map(field => ({
                            [field]: { $regex: search, $options: 'i' }
                        }));
                        
                        foundDocuments = await model.find({ $or: regexConditions }).limit(10);
                    }
                }
                
                if (foundDocuments.length > 0) {
                    results[modelName] = foundDocuments;
                    foundAnyResults = true;
                }
            } catch (error) {
                console.error(`Error searching in ${modelName}:`, error);
            }
        }
        
        if (!foundAnyResults) {
            return responseHandler.error({
                res, 
                statusCode: Enum.HTTP_CODES.NOT_FOUND, 
                message: "No results found for your search"
            });
        }
        
        if(results.Auditlogs) {
            delete results.Auditlogs
        }
        return responseHandler.success({
            res, 
            statusCode: Enum.HTTP_CODES.OK, 
            message: "Successfully fetched search results", 
            data: results
        });
    } catch (error) {
        console.error("Search function error:", error);
        return responseHandler.error({
            res, 
            statusCode: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR, 
            message: "An error occurred during search"
        });
    }
}
module.exports = {
    searching
}

