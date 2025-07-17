import React from "react";

const services = [
  {
    title: "Veterinary Consultation",
    description: "Get expert advice and health checkups for your pets from certified veterinarians.",
    icon: "🐾",
  },
  {
    title: "Grooming & Spa",
    description: "Professional grooming, bathing, and spa treatments to keep your pet looking and feeling great.",
    icon: "🛁",
  },
  {
    title: "Pet Training",
    description: "Behavioral training and obedience classes for dogs and cats of all ages.",
    icon: "🎓",
  },
  {
    title: "Boarding & Daycare",
    description: "Safe and comfortable boarding and daycare facilities for your pets.",
    icon: "🏠",
  },
];

const CarePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-10">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Pet Care & Services
      </h1>
      <p className="text-gray-600 text-center mb-10">
        Explore our range of professional services to keep your pets healthy, happy, and well cared for.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4 hover:scale-105 transition-transform">
            <span className="text-4xl">{service.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">{service.title}</h2>
              <p className="text-gray-700">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CarePage;