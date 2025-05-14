import { getListingCommentReplyComment, getListingComments } from "../services/Listings";
import { getLostListingsCommentReplies, getLostListingsCommentsbyPetId } from "../services/LostListings";

export const fetchPetCommentsWithReplies = async (petId) => {
    console.log("petId", petId);
    try {
        let commentsData;
        let isLost = false;
        try {
            commentsData = await getListingComments(petId);
        } catch (err) {
            commentsData = await getLostListingsCommentsbyPetId(petId);
            isLost = true;
        }

        // Her yorum için yanıtları getir
        const commentsWithReplies = await Promise.all(
            commentsData?.data?.map(async (comment) => {
                const replies = isLost
                    ? await getLostListingsCommentReplies(petId, comment._id)
                    : await getListingCommentReplyComment(petId, comment._id);

                return {
                    ...comment,
                    replies: replies || [],
                };
            })
        );

        return commentsWithReplies;
    } catch (error) {
        console.error("Tüm yorumlar yüklenemedi:", error);
        return [];
    }
};
