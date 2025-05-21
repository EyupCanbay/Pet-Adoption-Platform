import { getListingCommentReplyComment, getListingComments } from "../services/Listings";
import { getLostListingsCommentReplies, getLostListingsCommentsbyPetId } from "../services/LostListings";

export const fetchPetCommentsWithReplies = async (petId) => {
    try {
        let commentsData = null;
        let isLost = false;

        // 1. Try fetching comments for a regular listing
        try {
            const regularComments = await getListingComments(petId);
            console.log("Regular listing comments found:", regularComments);
            if (regularComments?.data && regularComments.data.length > 0) {
                commentsData = regularComments.data;
                isLost = false;
            }
        } catch (error) {
            console.warn("Regular listing comments not found or error:", error);
            // Continue to try lost listing comments if regular failed
        }

        // 2. If no comments found for regular listing, try fetching for a lost listing
        if (!commentsData || commentsData.length === 0) {
            try {
                const lostComments = await getLostListingsCommentsbyPetId(petId);
                console.log("Lost listing comments found:", lostComments);
                if (lostComments?.data && lostComments.data.length > 0) {
                    commentsData = lostComments.data;
                    isLost = true;
                }
            } catch (error) {
                console.warn("Lost listing comments not found or error:", error);
            }
        }

        // If no comments found after trying both, return an empty array
        if (!commentsData || commentsData.length === 0) {
            return [];
        }

        // 3. Fetch replies for each comment
        const commentsWithReplies = await Promise.all(
            commentsData.map(async (comment) => {
                let replies = [];
                try {
                    const response = isLost
                        ? await getLostListingsCommentReplies(petId, comment._id)
                        : await getListingCommentReplyComment(petId, comment._id);

                    // Ensure replies is an array, even if the service returns null/undefined or a non-array
                    replies = response?.data && Array.isArray(response.data) ? response.data : [];
                } catch (replyError) {
                    console.error(`Yorum yanıtları yüklenemedi for comment ${comment._id}:`, replyError);
                }

                return {
                    ...comment,
                    replies: replies, // Attach the fetched replies to the comment
                };
            })
        );

        return commentsWithReplies;

    } catch (error) {
        console.error("Tüm yorumlar yüklenemedi:", error);
        return [];
    }
};