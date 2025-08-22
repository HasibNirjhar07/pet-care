import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import NewsfeedPost from "../../components/NewsFeedPost";
import QuickActions from "../../components/layout/QuickActions";
import { Star } from "lucide-react";

const Favorites = ({ user, onLogout }) => {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoritePosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        setError("Please login to view favorites");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/api/favorites/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          setFavoritePosts([]);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch favorite posts");
      }

      const data = await res.json();
      
      // Format the favorite posts data
      const formattedPosts = data.favorites.map((favorite) => {
        const pet = favorite.postId.PetID;
        const adoption = favorite.postId;
        
        return {
          id: adoption._id,
          _id: adoption._id,
          adoptionId: adoption._id,
          postedBy: pet.postedBy,
          user: {
            name: pet.postedBy?.name || "Unknown User",
            avatar: pet.postedBy?.profilePhoto
              ? `http://localhost:3000${pet.postedBy?.profilePhoto}`
              : "https://ui-avatars.com/api/?name=Pet&background=random",
            location: pet.postedBy?.location || "Unknown",
          },
          // Pet data directly at post level for NewsFeedPost
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          dateOfBirth: pet.dateOfBirth,
          color: pet.color,
          description: pet.description,
          healthRecords: pet.healthRecords,
          traits: pet.traits,
          profilePhoto: pet.profilePhoto,
          photos: pet.photos,
          adoptionType: adoption.adoptionType,
          returnDate: adoption.adoptionType === "temporary" ? adoption.ReturnDate : null,
          adoptionDescription: adoption.AdoptionDescription,
          timestamp: new Date(adoption.createdAt).toLocaleString(),
          likes: adoption.likes?.length || 0,
          likedBy: adoption.likes || [],
          status: pet.status || "Available",
        };
      });

      setFavoritePosts(formattedPosts);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      // Fallback to localStorage method
      await fetchAllPetsAndFilter();
    } finally {
      setLoading(false);
    }
  };

  // Fallback method using localStorage (for backwards compatibility)
  const fetchAllPetsAndFilter = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/adoption/pets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch available pets");
      const data = await res.json();

      const formattedPosts = data.map((pet) => ({
        id: pet._id,
        _id: pet._id,
        adoptionId: pet.adoptionId,
        postedBy: pet.postedBy,
        user: {
          name: pet.postedBy?.name || "Unknown User",
          avatar: pet.postedBy?.profilePhoto
            ? `http://localhost:3000${pet.postedBy?.profilePhoto}`
            : "https://ui-avatars.com/api/?name=Pet&background=random",
          location: pet.postedBy?.location || "Unknown",
        },
        // Pet data directly at post level for NewsFeedPost
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        color: pet.color,
        description: pet.description,
        healthRecords: pet.healthRecords,
        traits: pet.traits,
        profilePhoto: pet.profilePhoto,
        photos: pet.photos,
        adoptionType: pet.adoptionType,
        returnDate: pet.adoptionType === "temporary" ? pet.returnDate : null,
        adoptionDescription: pet.adoptionDescription,
        timestamp: new Date(pet.createdAt).toLocaleString(),
        likes: pet.likes || 0,
        likedBy: pet.likedBy || [],
        status: pet.status || "Available",
      }));

      // Filter by localStorage favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const filtered = formattedPosts.filter(
        (post) => favorites.includes(post._id) || favorites.includes(post.id)
      );
      setFavoritePosts(filtered);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFavoritePosts();
  }, []);

  // Listen for favorites changes to update in real-time
  useEffect(() => {
    const handleFavoritesChange = () => {
      fetchFavoritePosts();
    };

    window.addEventListener("favoritesChanged", handleFavoritesChange);

    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="flex">
          <Sidebar user={user} onLogout={onLogout} />
          <main className="flex-1 ml-64">
            <div className="p-8">
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">
                  Loading your favorite pets...
                </div>
              </div>
            </div>
          </main>
          <QuickActions />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="flex">
          <Sidebar user={user} onLogout={onLogout} />
          <main className="flex-1 ml-64">
            <div className="p-8">
              <div className="text-center text-red-600">Error: {error}</div>
            </div>
          </main>
          <QuickActions />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="flex">
        <Sidebar user={user} onLogout={onLogout} />
        <main className="flex-1 ml-64">
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <Star className="text-yellow-500 fill-current" size={28} />
                <h1 className="text-3xl font-bold text-gray-800">
                  My Favorite Pets
                </h1>
              </div>

              {/* Favorite Posts */}
              {favoritePosts.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="mx-auto text-gray-300 mb-4" size={64} />
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    No favorite pets yet
                  </h2>
                  <p className="text-gray-500">
                    Start favoriting pets you're interested in and they'll
                    appear here!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {favoritePosts.map((post) => (
                    <NewsfeedPost key={post.id || post._id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <QuickActions />
      </div>
    </div>
  );
};

export default Favorites;
