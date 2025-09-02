import React, { useState } from 'react';
import { MapPin, Filter, Navigation, Clock, Phone } from 'lucide-react';

function MapView() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    {
      id: 1,
      name: 'Downtown Community Center',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      hours: 'Mon-Fri: 9AM-5PM',
      availableItems: 12,
      distance: '0.5 miles',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: 'Westside Food Bank',
      address: '456 West Ave, Westside',
      phone: '(555) 234-5678',
      hours: 'Mon-Sat: 8AM-6PM',
      availableItems: 8,
      distance: '1.2 miles',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    {
      id: 3,
      name: 'Northside Center',
      address: '789 North Blvd, Northside',
      phone: '254 746953269',
      hours: 'Daily: 10AM-8PM',
      availableItems: 15,
      distance: '2.1 miles',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Find <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Locations</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover pickup locations and donation centers near you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96">
            <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
                <p className="text-gray-600">Map integration would display here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Shows donation centers, pickup locations, and available items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Navigation className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Nearby Locations</h2>
          </div>

          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                <span className="text-sm font-medium text-emerald-600">{location.distance}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{location.hours}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {location.availableItems} items available
                  </span>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Get Directions
                </button>
              </div>
            </div>
          ))}

          {/* Add Location CTA */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Know a Location?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Help us expand our network by suggesting new donation centers or pickup points.
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Suggest Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;