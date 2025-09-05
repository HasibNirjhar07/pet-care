import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Heart,
  Camera,
  Bell,
  User,
  Settings,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={16} />, label: "Feed", path: "/dashboard" },
    { icon: <Star size={16} />, label: "Favorites", path: "/favorites" },
    { icon: <Camera size={16} />, label: "My Posts", path: "/my-posts" },
    {
      icon: <Heart size={16} />,
      label: "View Adoption Requests",
      path: "/adopt/post",
    },
    {
      icon: <Bell size={16} />,
      label: "Notifications",
      path: "/notifications",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const adoptionStats = [
    { label: "Pets Adopted", value: "2,847", change: "+12%" },
    { label: "Active Posts", value: "156", change: "+5%" },
    { label: "Happy Families", value: "1,924", change: "+8%" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation Menu */}
      <Card className="bg-white/80 backdrop-blur-md shadow-md">
        <CardContent className="py-4 px-3 flex flex-col gap-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "ghost"}
                className={`justify-start ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : "text-muted-foreground hover:bg-purple-50"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Adoption Stats */}
      <Card className="bg-white/80 backdrop-blur-md shadow-md">
        <CardContent className="py-4 px-4">
          <h3 className="text-sm font-semibold text-primary mb-3">
            Adoption Impact
          </h3>
          <div className="flex flex-col gap-3">
            {adoptionStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-base">{stat.value}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 font-medium">
                  {stat.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-fuchsia-100 to-pink-100 shadow-md">
        <CardContent className="py-4 px-4 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-primary">Quick Actions</h3>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600">
            Post a Pet
          </Button>
          <Button
            variant="outline"
            className="w-full border-violet-200 hover:bg-violet-50"
          >
            Find Vet Services
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
