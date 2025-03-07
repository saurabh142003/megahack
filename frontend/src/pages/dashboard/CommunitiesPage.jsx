import React, { useState } from "react";
import { Map, Users, Calendar, Check, X, Bell, ChevronRight, Lock } from "lucide-react";

const CommunitiesPage = () => {
  const [joined, setJoined] = useState(false);
  const totalMembers = 50;
  const [currentMembers, setCurrentMembers] = useState(23);
  const [currentDate] = useState(new Date("2025-06-05"));
  const [isHead, setIsHead] = useState(true); // For demo purposes, set user as community head
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    marketLocation: "",
    eventType: "single",
    startDateTime: "",
    endDateTime: "",
    category: "market",
    participants: ""
  });
  
  // Sample data for nearby communities
  const [nearbyCommunities, setNearbyCommunities] = useState([
    { id: 1, name: "Downtown Farmers Market", distance: "0.5 miles", members: 50, status: null },
    { id: 2, name: "Westside Community Market", distance: "1.2 miles", members: 45, status: "pending" },
    { id: 3, name: "Highland Park Co-op", distance: "2.3 miles", members: 32, status: null },
    { id: 4, name: "Riverfront Growers Association", distance: "3.1 miles", members: 63, status: "rejected" },
    { id: 5, name: "Sunrise Organic Network", distance: "3.8 miles", members: 28, status: "approved" }
  ]);
  
  // Track joined communities
  const [joinedCommunities, setJoinedCommunities] = useState([
    { id: 1, name: "Downtown Farmers Market", isHead: true },
    { id: 5, name: "Sunrise Organic Network", isHead: false }
  ]);
  
  // Sample community events (only from joined communities)
  const [communityEvents, setCommunityEvents] = useState([
    { 
      id: 1, 
      title: "Summer Market", 
      date: "June 15, 2025", 
      dateObj: new Date("2025-06-15"),
      endDateObj: new Date("2025-06-15T18:00:00"),
      community: "Downtown Farmers Market", 
      communityId: 1,
      type: "market" 
    },
    { 
      id: 2, 
      title: "Organic Training Workshop", 
      date: "June 20, 2025", 
      dateObj: new Date("2025-06-20"),
      endDateObj: new Date("2025-06-21"),
      community: "Sunrise Organic Network", 
      communityId: 5,
      type: "workshop" 
    }
  ]);
  
  // Track the event the farmer is currently joined to
  const [currentEvent, setCurrentEvent] = useState(null);

  const handleJoinClick = () => {
    if (!joined) {
      setCurrentMembers((prev) => (prev < totalMembers ? prev + 1 : prev));
    } else {
      setCurrentMembers((prev) => (prev > 0 ? prev - 1 : prev));
    }
    setJoined(!joined);
  };
  
  const handleRequestJoin = (communityId) => {
    setNearbyCommunities(communities => communities.map(community => 
      community.id === communityId ? {...community, status: "pending"} : community
    ));
  };
  
  const handleJoinEvent = (eventId) => {
    if (currentEvent) return; // Already joined an event
    setCurrentEvent(eventId);
  };
  
  const handleCancelEvent = () => {
    setCurrentEvent(null);
  };

  const handleOpenCreateEventModal = () => {
    setShowCreateEventModal(true);
  };

  const handleCloseCreateEventModal = () => {
    setShowCreateEventModal(false);
    setNewEvent({
      name: "",
      description: "",
      marketLocation: "",
      eventType: "single",
      startDateTime: "",
      endDateTime: "",
      category: "market",
      participants: ""
    });
  };

  const handleCreateEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    
    // Create new event object
    const formattedStartDate = new Date(newEvent.startDateTime);
    const formattedEndDate = new Date(newEvent.endDateTime);
    
    const eventToAdd = {
      id: communityEvents.length + 1,
      title: newEvent.name,
      date: formattedStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      dateObj: formattedStartDate,
      endDateObj: formattedEndDate,
      community: joinedCommunities.find(c => c.isHead)?.name || "Your Community",
      communityId: joinedCommunities.find(c => c.isHead)?.id || 1,
      type: newEvent.category
    };
    
    // Add to events list
    setCommunityEvents(prev => [...prev, eventToAdd]);
    
    // Close modal and reset form
    handleCloseCreateEventModal();
  };

  // Get status badge component based on status
  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"><Check size={12} className="mr-1" />Approved</span>;
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center"><X size={12} className="mr-1" />Rejected</span>;
      default:
        return (
          <button
            onClick={() => handleRequestJoin(community.id)}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors"
          >
            Request to Join
          </button>
        );
    }
  };

  // Filter events to only show those from communities the farmer has joined
  const filteredEvents = communityEvents.filter(event => 
    joinedCommunities.some(community => community.id === event.communityId)
  );

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Nearby Communities</h2>
        <div className="relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
          <div className="absolute w-64 h-64 border-4 border-green-500 rounded-full" style={{ opacity: 0.3 }}></div>
          <div className="absolute w-44 h-44 border-4 border-green-500 rounded-full" style={{ opacity: 0.5 }}></div>
          <div className="absolute w-24 h-24 border-4 border-green-500 rounded-full" style={{ opacity: 0.7 }}></div>

          {/* Center point (your location) */}
          <div className="absolute w-4 h-4 bg-green-600 rounded-full z-10"></div>

          {/* Community points */}
          <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-100">
            <Map size={20} className="text-green-600" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-100">
            <Map size={20} className="text-green-600" />
          </div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-100">
            <Map size={20} className="text-green-600" />
          </div>
        </div>
        
        {/* Communities list with request option */}
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Community Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nearbyCommunities.map(community => (
                <tr key={community.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{community.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {community.distance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {community.members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {getStatusBadge(community.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Your Communities</h2>
          <div className="space-y-4">
            {joinedCommunities.map(community => (
              <div key={community.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{community.name}</h3>
                    <p className="text-sm text-gray-500">{community.id === 1 ? `${currentMembers}/${totalMembers}` : "28/50"} members</p>
                    {community.isHead && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                        Community Head
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={community.id === 1 ? handleJoinClick : null}
                  className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600"
                >
                  Joined
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Pending Requests</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Westside Community Market</h3>
                  <p className="text-sm text-gray-500">45 members</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Current Event (if joined) */}
      {currentEvent && (
        <div className="mt-6 bg-green-50 p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-800">Your Current Event</h3>
                <p className="text-green-700">
                  {filteredEvents.find(e => e.id === currentEvent)?.title} • {filteredEvents.find(e => e.id === currentEvent)?.date}
                </p>
              </div>
            </div>
            <button 
              onClick={handleCancelEvent}
              className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Cancel Participation
            </button>
          </div>
        </div>
      )}

      {/* Community Events - only from joined communities */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Community Events</h2>
          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-4">
              {currentEvent ? "You can only join one event at a time" : "Select an event to participate"}
            </div>
            {isHead && (
              <button 
                onClick={handleOpenCreateEventModal}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
              >
                <Calendar size={16} className="mr-2" />
                Create New Event
              </button>
            )}
          </div>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map(event => {
              const isPast = event.dateObj < currentDate;
              const isActive = currentEvent === event.id;
              const isLocked = currentEvent !== null && !isActive;
              
              return (
                <div key={event.id} className={`p-4 border rounded-lg flex justify-between items-center
                  ${isPast ? 'bg-gray-50 border-gray-200' : 
                    isActive ? 'bg-green-50 border-green-300' : 
                    'border-gray-200'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${isPast ? 'bg-gray-100' : 
                        event.type === 'market' ? 'bg-blue-100' : 'bg-purple-100'}`}
                    >
                      <Calendar size={20} className={
                        isPast ? 'text-gray-500' : 
                        event.type === 'market' ? 'text-blue-600' : 'text-purple-600'
                      } />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isPast ? 'text-gray-500' : ''}`}>{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.date} • {event.community}</p>
                    </div>
                  </div>
                  
                  <div>
                    {isPast ? (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        Past Event
                      </span>
                    ) : isActive ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                        Participating
                      </span>
                    ) : isLocked ? (
                      <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        <Lock size={12} />
                        <span>Locked</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleJoinEvent(event.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600"
                      >
                        Join Event
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
            <p>No events available from your communities yet.</p>
            <p className="text-sm mt-2">Join more communities to see their events.</p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Create New Community Event</h2>
              <button 
                onClick={handleCloseCreateEventModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEventSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name*
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleCreateEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter event name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea 
                    name="description"
                    value={newEvent.description}
                    onChange={handleCreateEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Describe your event"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Market Location*
                  </label>
                  <input 
                    type="text"
                    name="marketLocation"
                    value={newEvent.marketLocation}
                    onChange={handleCreateEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter location"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type*
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio"
                        name="eventType"
                        value="single"
                        checked={newEvent.eventType === "single"}
                        onChange={handleCreateEventChange}
                        className="mr-2"
                      />
                      Single Day
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio"
                        name="eventType"
                        value="multi"
                        checked={newEvent.eventType === "multi"}
                        onChange={handleCreateEventChange}
                        className="mr-2"
                      />
                      Multiple Days
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time*
                    </label>
                    <input 
                      type="datetime-local"
                      name="startDateTime"
                      value={newEvent.startDateTime}
                      onChange={handleCreateEventChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date & Time*
                    </label>
                    <input 
                      type="datetime-local"
                      name="endDateTime"
                      value={newEvent.endDateTime}
                      onChange={handleCreateEventChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select 
                    name="category"
                    value={newEvent.category}
                    onChange={handleCreateEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="market">Market</option>
                    <option value="workshop">Workshop</option>
                    <option value="training">Training</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants*
                  </label>
                  <input 
                    type="number"
                    name="participants"
                    value={newEvent.participants}
                    onChange={handleCreateEventChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter maximum number of participants"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={handleCloseCreateEventModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;