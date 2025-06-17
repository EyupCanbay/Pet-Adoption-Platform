import { getListingCommentReplyComment, getListingComments } from "../services/Listings";
import { getLostListingsCommentReplies, getLostListingsCommentsbyPetId } from "../services/LostListings";

export const fetchPetCommentsWithReplies = async (petId) => {
    try {
        let commentsData = null;
        let isLost = false;

        try {
            const regularComments = await getListingComments(petId);
            if (regularComments?.data && regularComments.data.length > 0) {
                commentsData = regularComments.data;
                isLost = false;
            }
        } catch (error) {
            console.warn("Regular listing comments not found or error:", error);
        }

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

        if (!commentsData || commentsData.length === 0) {
            return [];
        }

        const commentsWithReplies = await Promise.all(
            commentsData.map(async (comment) => {
                let replies = [];
                try {
                    const response = isLost
                        ? await getLostListingsCommentReplies(petId, comment._id)
                        : await getListingCommentReplyComment(petId, comment._id);

                    replies = response?.data && Array.isArray(response.data) ? response.data : [];
                } catch (replyError) {
                    console.error(`Yorum yanıtları yüklenemedi for comment ${comment._id}:`, replyError);
                }

                return {
                    ...comment,
                    replies: replies, 
                };
            })
        );

        return commentsWithReplies;

    } catch (error) {
        console.error("Tüm yorumlar yüklenemedi:", error);
        return [];
    }
};