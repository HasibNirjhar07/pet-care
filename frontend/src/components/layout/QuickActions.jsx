import React from 'react';
import { Calendar, MapPin, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const nearbyHomes = [
    { name: "Happy Paws Sanctuary", distance: "2.3 km", rating: 4.8, slots: 3 },
    { name: "Golden Hearts Pet Care", distance: "3.1 km", rating: 4.9, slots: 1 },
    { name: "Furry Friends Haven", distance: "4.7 km", rating: 4.7, slots: 5 },
  ];

  const upcomingEvents = [
    { title: "Pet Adoption Fair", date: "Dec 15", location: "Central Park" },
    { title: "Vet Health Checkup", date: "Dec 18", location: "PetCare Clinic" },
    { title: "Training Workshop", date: "Dec 22", location: "Community Center" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Nearby Adoption Homes */}
      <Card className="shadow-md bg-white/80 backdrop-blur-sm">
        <div className="flex items-center border-b border-gray-200 px-4 py-2">
          <MapPin size={20} className="text-purple-600 mr-2" />
          <h2 className="text-base font-semibold">Nearby Adoption Homes</h2>
        </div>
        <CardContent className="space-y-3">
          {nearbyHomes.map((home, index) => (
            <div
              key={index}
              className="rounded-lg p-3 space-y-2"
              style={{
                background: 'linear-gradient(to right, #f5f3ff, #ffe4e6)',
              }}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm">{home.name}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  ⭐ {home.rating}
                </span>
              </div>
              <p className="text-xs text-gray-600">{home.distance} away</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600">
                  {home.slots} slots available
                </p>
                <Button variant="outline" className="h-7 px-3 text-xs">
                  Book
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="shadow-md bg-white/80 backdrop-blur-sm">
        <div className="flex items-center border-b border-gray-200 px-4 py-2">
          <Calendar size={20} className="text-purple-600 mr-2" />
          <h2 className="text-base font-semibold">Upcoming Events</h2>
        </div>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="rounded-lg p-3"
              style={{
                background: 'linear-gradient(to right, #eff6ff, #f3e8ff)',
              }}
            >
              <p className="font-medium text-sm mb-0.5">{event.title}</p>
              <p className="text-xs text-gray-600">
                {event.date} • {event.location}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card
        className="shadow-md"
        style={{
          background: 'linear-gradient(to bottom right, #ede9fe, #fce7f3)',
        }}
      >
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <Heart size={32} className="text-purple-600" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">2,847</h3>
            <p className="text-sm text-gray-600">Pets Found Homes</p>
          </div>
          <Button
            className="w-full text-white"
            style={{
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
            }}
          >
            <Users size={16} className="mr-2" />
            Join Community
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
