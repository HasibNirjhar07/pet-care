import { useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NewsfeedPost = ({ post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showLikedBy, setShowLikedBy] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  // Initialize like state and comment count on component mount
  useEffect(() => {
    const initializePostData = async () => {
      if (!post.adoptionId) {
        console.warn("No adoptionId found for post:", post);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        // Check if current user has liked this post
        const likeRes = await fetch(
          `http://localhost:3000/adoption/${post.adoptionId}/like-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (likeRes.ok) {
          const likeData = await likeRes.json();
          setLiked(likeData.liked);
          setLikes(likeData.totalLikes);
        }

        // Get comment count
        const commentRes = await fetch(
          `http://localhost:3000/adoption/${post.adoptionId}/comments/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (commentRes.ok) {
          const commentData = await commentRes.json();
          setCommentCount(commentData.count);
        }
      } catch (error) {
        console.error("Error initializing post data:", error);
      }
    };

    initializePostData();
  }, [post.adoptionId]);

  const handleLike = async () => {
    if (!post.adoptionId) {
      console.warn("No adoptionId found for post:", post);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/${post.adoptionId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikes(data.totalLikes);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    if (!post.adoptionId) {
      console.warn("No adoptionId found for post:", post);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/${post.adoptionId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment, parentId: replyingTo }),
        }
      );
      if (res.ok) {
        const newComment = await res.json();

        // If replying to a comment, add to the parent's replies
        if (replyingTo) {
          const updatedComments = comments.map((c) => {
            if (c._id === replyingTo) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          });
          setComments(updatedComments);
        } else {
          // If it's a top-level comment, add to main comments array
          setComments([...comments, newComment]);
        }

        setCommentCount(commentCount + 1);
        setComment("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!post.adoptionId) {
        console.warn("No adoptionId found for post:", post);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/adoption/${post.adoptionId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
          setCommentCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (showComments && post.adoptionId) {
      fetchComments();
    }
  }, [showComments, post.adoptionId]);

  const handleAdoptionRequest = async () => {
    if (!post.adoptionId) {
      console.warn("No adoptionId found for post:", post);
      alert("Unable to send adoption request. Missing adoption information.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/adoption/${post.adoptionId}/request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        alert("Adoption request sent successfully!");
        navigate("/dashboard");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to send adoption request.");
      }
    } catch (error) {
      console.error("Error sending adoption request:", error);
      alert("Error sending adoption request.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <img
            src={
              post.user?.avatar ||
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
            }
            alt={post.user?.name || "User"}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face";
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.user?.name || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500">
              {post.user?.location || "Unknown Location"}
            </p>
            <p className="text-xs text-gray-400">
              {post.timestamp || "Unknown Time"}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            post.status === "Available"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {post.status}
        </span>
      </div>

      {/* Pet Image */}
      <Link to={`/pet/${post.id}`}>
        <div className="relative">
          <img
            src={
              post.pet?.image ||
              "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&crop=center"
            }
            alt={post.pet?.name || "Pet"}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&crop=center";
            }}
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
            {post.pet?.adoptionType || "Regular"} Adoption
          </div>
        </div>
      </Link>

      {/* Pet Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Meet {post.pet?.name || "Unknown Pet"}!
          </h2>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">
              {post.pet?.type || "Unknown Type"}
            </p>
            <p className="text-sm text-gray-500">
              {post.pet?.breed || "Unknown Breed"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Age:</span>{" "}
              {post.pet?.age || "Unknown"}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Medical:</span>{" "}
              {post.pet?.medicalHistory || "No medical history available"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Personality:</span>{" "}
              {post.pet?.personality?.text || "Friendly"}
            </p>
            {post.pet?.adoptionType === "temporary" && post.pet?.returnDate && (
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Return Date:</span>{" "}
                {new Date(post.pet.returnDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm ${
                liked ? "text-red-500" : "text-gray-500"
              } hover:text-red-500 transition-colors`}
            >
              <Heart size={20} className={liked ? "fill-current" : ""} />
              <span>{likes}</span>
            </button>

            {post.likedBy && post.likedBy.length > 0 && (
              <button
                onClick={() => setShowLikedBy(!showLikedBy)}
                className="text-sm text-gray-500 hover:underline"
              >
                {post.likedBy.length} likes
              </button>
            )}

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageSquare size={20} />
              <span>{commentCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>

          {post.status === "Available" &&
            post.postedBy?._id !== currentUserId && (
              <button
                onClick={handleAdoptionRequest}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                Request Adoption
              </button>
            )}
        </div>

        {/* Liked By Section */}
        {showLikedBy && post.likedBy && post.likedBy.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Liked by: {post.likedBy.join(", ")}
            </p>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            {comments.map((c) => (
              <div key={c._id} className="flex items-start space-x-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{c.userName}:</span>{" "}
                    {c.comment}
                  </p>
                  <button
                    onClick={() => setReplyingTo(c._id)}
                    className="text-xs text-gray-500 hover:underline"
                  >
                    Reply
                  </button>
                  {c.replies &&
                    c.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className="flex items-start space-x-3 mt-2 ml-4"
                      >
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={12} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">
                              {reply.userName}:
                            </span>{" "}
                            {reply.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <input
                type="text"
                placeholder={
                  replyingTo ? "Write a reply..." : "Write a comment..."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleComment();
                  }
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim()}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsfeedPost;
