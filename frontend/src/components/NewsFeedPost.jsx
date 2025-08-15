import { useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, User } from "lucide-react";
import { Link } from "react-router-dom";

const NewsfeedPost = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  const handleLike = async () => {
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
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async () => {
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
        setComments([...comments, newComment]);
        setComment("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
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
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.adoptionId]);

  const handleAdoptionRequest = () => {
    console.log(`Adoption request sent for ${post.pet.name}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500">
              {post.user.location} • {post.timestamp}
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
            src={post.pet.image}
            alt={post.pet.name}
            className="w-full h-80 object-cover"
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
            {post.pet.adoptionType} Adoption
          </div>
        </div>
      </Link>

      {/* Pet Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Meet {post.pet.name}!
          </h2>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">{post.pet.type}</p>
            <p className="text-sm text-gray-500">{post.pet.breed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Age:</span> {post.pet.age}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Medical:</span>{" "}
              {post.pet.medicalHistory}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Personality:</span>{" "}
              {post.pet.personality}
            </p>
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

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageSquare size={20} />
              <span>{comments.length}</span>
            </button>

            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>

          {post.status === "Available" && (
            <button
              onClick={handleAdoptionRequest}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Request Adoption
            </button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            {comments.map((c) => (
              <div key={c._id} className="flex items-start space-x-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{c.comment}</p>
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
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleComment}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
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
