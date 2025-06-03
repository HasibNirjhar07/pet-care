
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import NewsfeedPost from "../../components/NewsFeedPost";
import CreatePost from "../../components/CreatePost";
import QuickActions from "../../components/layout/QuickActions";

const Dashboard = ({user , onLogout}) => {

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        location: "San Francisco, CA"
      },
      pet: {
        name: "Luna",
        type: "Cat",
        breed: "Persian",
        age: "2 years",
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&h=400&fit=crop",
        adoptionType: "Permanent",
        medicalHistory: "Vaccinated, spayed, microchipped",
        personality: "Gentle, loves cuddles, good with children"
      },
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      status: "Available"
    },
    {
      id: 2,
      user: {
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        location: "Austin, TX"
      },
      pet: {
        name: "Buddy",
        type: "Dog",
        breed: "Golden Retriever",
        age: "3 years",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
        adoptionType: "Temporary",
        medicalHistory: "Fully vaccinated, neutered, healthy",
        personality: "Energetic, loves fetch, great with kids and other dogs"
      },
      timestamp: "4 hours ago",
      likes: 41,
      comments: 15,
      status: "Available"
    },
    {
      id: 3,
      user: {
        name: "Emma Chen",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        location: "Seattle, WA"
      },
      pet: {
        name: "Whiskers",
        type: "Cat",
        breed: "Maine Coon",
        age: "1 year",
        image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&h=400&fit=crop",
        adoptionType: "Permanent",
        medicalHistory: "Recently vaccinated, health certificate available",
        personality: "Playful, curious, loves climbing and exploring"
      },
      timestamp: "6 hours ago",
      likes: 37,
      comments: 12,
      status: "Pending"
    }
  ]);

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