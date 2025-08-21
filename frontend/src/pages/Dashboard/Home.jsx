import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import NewsfeedPost from "../../components/NewsFeedPost";
import CreatePost from "../../components/CreatePost";
import QuickActions from "../../components/layout/QuickActions";

const Dashboard = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailablePets = async () => {
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
          adoptionId: pet.adoptionId,
          user: {
            name: pet.postedBy?.name,
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            location: "Unknown",
          },
          pet: {
            name: pet.name,
            type: pet.species,
            breed: pet.breed,
            age: `${
              new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()
            } years`,
            image: `http://localhost:3000${pet.photos[0]}`,
            adoptionType: pet.adoptionType,
            medicalHistory: pet.healthRecords.join(", "),
            personality: pet.traits.join(", "),
          },
          timestamp: new Date(pet.createdAt).toLocaleString(),
          likes: pet.likes,
          comments: pet.comments,
          status: pet.status,
        }));
        setPosts(formattedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePets();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error && posts.length === 0) {
    // Only show error if it's a real fetch error, not just empty list
    if (error.includes('Failed to fetch available pets')) {
      return <div>No pets are available for adoption.</div>;
    } else {
      return <div>Error: {error}</div>;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container my-10 mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content - Newsfeed */}
          <div className="lg:col-span-2 space-y-6">
            <CreatePost />

            <div className="space-y-6">
              {posts.map((post) => (
                <NewsfeedPost key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
