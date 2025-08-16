import { Heart } from "lucide-react";

const ProfileHeader = () => (
  <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
    <div className="bg-gradient-to-r from-purple-600 to-purple-200 p-6 text-white">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Heart className="w-8 h-8" />
        PetCare User Profile
      </h1>
    </div>
  </div>
);

export default ProfileHeader;
