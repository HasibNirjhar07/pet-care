import { useState } from "react";
import { Camera, Image, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = ({ 
  userName = 'John Doe',
  userAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  isAuthenticated = true
}) => {
  const [postText, setPostText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [petType, setPetType] = useState("");
  const [adoptionType, setAdoptionType] = useState("");

  return (
    <Card className="bg-white/90 backdrop-blur-md shadow-md border-none">
      <CardContent className="p-4">
        {!showForm ? (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {isAuthenticated && userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
            </Avatar>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="w-full justify-start text-muted-foreground rounded-full bg-gray-100 hover:bg-gray-200"
            >
              Share a pet for adoption...
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                {isAuthenticated && userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Create Adoption Post</p>
                <p className="text-xs text-muted-foreground">
                  Help a pet find their forever home
                </p>
              </div>
            </div>

            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Tell us about your pet's story, personality, and what kind of home you're looking for..."
              rows={4}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Pet Type</Label>
                <Select onValueChange={setPetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Pet Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Adoption Type</Label>
                <Select onValueChange={setAdoptionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Adoption Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="foster">Foster Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm text-muted-foreground hover:bg-purple-100"
                >
                  <Image size={16} className="mr-1" /> Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm text-muted-foreground hover:bg-purple-100"
                >
                  <Camera size={16} className="mr-1" /> Video
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 text-sm"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;