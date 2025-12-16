import React, { useState } from "react";

export default function EventsAdminPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const categories = [
    "Hackathon", "Cultural Fests", "Management Fests", "Literary Fests",
    "Sports Fests", "Conferences", "Online Events", "Seminar",
    "Workshops", "Trainings", "Internships",
  ];

  const festCategories = ["Cultural Fests", "Management Fests", "Seminar", "Workshops"];
  const hackathonCategories = ["Hackathon"];
  const trainingCategories = ["Trainings", "Internships"];
  const literaryCategories = ["Literary Fests"];
  const sportsCategories = ["Sports Fests"];
  const conferenceCategories = ["Conferences"];
  const onlineCategories = ["Online Events"];

  // UPCOMING STATE
  const [step, setStep] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [eventData, setEventData] = useState({
    name: "", mode: "", venue: "", type: "", theme: "", organizer: "",
    startDate: "", endDate: "", startTime: "", endTime: "", description: "",
    poster: null, deadlines: "", fees: "", registrationLink: "", guestDetails: "",
    contact: "", maxParticipants: "", teamSize: "", eligibility: "",
    companyName: "", domain: "", duration: "", litCategory: "", rules: "",
    sportType: "", maxTeams: "", equipment: "", journalInfo: "", keynote: "",
    platform: "", eventLink: "",
    hackProblemStatements: "", hackTechStack: "", hackJudgingCriteria: "",
    hackPrizes: "", hackMentors: "", hackRules: "",
  });

  // Loading state for uploads
  const [isUploading, setIsUploading] = useState(false);

  // PAST STATE (unchanged)
  const [pastStep, setPastStep] = useState("category");
  const [pastSelectedCategory, setPastSelectedCategory] = useState("");
  const [pastData, setPastData] = useState({
    eventName: "", date: "", summary: "",
    hackWinningTeam: "", hackWinningMembers: "", hackPrizeAmount: "", hackRunnerUp: "", hackBestInnovation: "",
    festOverallChampion: "", festBestPerformance: "", festCategoryWinners: "", festJudgeComments: "",
    litWinnerName: "", litCategory: "", litBestPerformer: "",
    sportType: "", sportWinner: "", sportRunnerUp: "", sportScore: "", sportBestPlayer: "",
    confKeynote: "", confPapersPresented: "", confBestPaper: "", confHighlights: "",
    trainCompanyName: "", trainDomain: "", trainStudentsCount: "", trainDuration: "", trainOutcomeSummary: "",
    onlineType: "", onlineSpeaker: "", onlineParticipants: "", onlineRecordingLink: "",
  });

  const handleEventChange = (e) => {
    const { name, value, files } = e.target;
    setEventData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handlePastChange = (e) => {
    const { name, value } = e.target;
    setPastData(prev => ({ ...prev, [name]: value }));
  };

  // SUBMIT UPCOMING - UPDATED FOR FILE UPLOAD
  const handleUpcomingSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all event data fields
      formData.append('eventName', eventData.name);
      formData.append('eventType', selectedCategory);
      formData.append('startDate', eventData.startDate);
      formData.append('endDate', eventData.endDate || eventData.startDate);
      formData.append('venue', eventData.venue);
      formData.append('eventMode', eventData.mode);
      formData.append('organizer', eventData.organizer);
      formData.append('description', eventData.description);
      formData.append('registrationLink', eventData.registrationLink);
      formData.append('contact', eventData.contact);
      formData.append('deadlines', eventData.deadlines);
      formData.append('fees', eventData.fees);
      formData.append('eligibility', eventData.eligibility);
      formData.append('maxParticipants', eventData.maxParticipants);
      formData.append('startTime', eventData.startTime);
      formData.append('endTime', eventData.endTime);
      
      // Add category-specific fields
      if (hackathonCategories.includes(selectedCategory)) {
        formData.append('hackProblemStatements', eventData.hackProblemStatements);
        formData.append('hackTechStack', eventData.hackTechStack);
        formData.append('hackJudgingCriteria', eventData.hackJudgingCriteria);
        formData.append('hackPrizes', eventData.hackPrizes);
        formData.append('hackMentors', eventData.hackMentors);
        formData.append('hackRules', eventData.hackRules);
        formData.append('theme', eventData.theme);
        formData.append('teamSize', eventData.teamSize);
      }
      
      if (festCategories.includes(selectedCategory)) {
        formData.append('guestDetails', eventData.guestDetails);
        formData.append('theme', eventData.theme);
      }
      
      if (trainingCategories.includes(selectedCategory)) {
        formData.append('companyName', eventData.companyName);
        formData.append('domain', eventData.domain);
        formData.append('duration', eventData.duration);
      }
      
      if (literaryCategories.includes(selectedCategory)) {
        formData.append('litCategory', eventData.litCategory);
        formData.append('rules', eventData.rules);
      }
      
      if (sportsCategories.includes(selectedCategory)) {
        formData.append('sportType', eventData.sportType);
        formData.append('maxTeams', eventData.maxTeams);
        formData.append('equipment', eventData.equipment);
        formData.append('rules', eventData.rules);
      }
      
      if (conferenceCategories.includes(selectedCategory)) {
        formData.append('journalInfo', eventData.journalInfo);
        formData.append('keynote', eventData.keynote);
        formData.append('theme', eventData.theme);
      }
      
      if (onlineCategories.includes(selectedCategory)) {
        formData.append('platform', eventData.platform);
        formData.append('eventLink', eventData.eventLink);
      }
      
      // Add image file if exists
      if (eventData.poster) {
        formData.append('poster', eventData.poster);
      }

      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        body: formData, // Send FormData, not JSON
        // Don't set Content-Type header - browser will set it with boundary
      });

      const result = await res.json();

      if (res.ok) {
        alert("Upcoming event saved successfully!");
        console.log("Event saved:", result);
        
        // Reset form
        setEventData({
          name: "", mode: "", venue: "", type: "", theme: "", organizer: "",
          startDate: "", endDate: "", startTime: "", endTime: "", description: "",
          poster: null, deadlines: "", fees: "", registrationLink: "", guestDetails: "",
          contact: "", maxParticipants: "", teamSize: "", eligibility: "",
          companyName: "", domain: "", duration: "", litCategory: "", rules: "",
          sportType: "", maxTeams: "", equipment: "", journalInfo: "", keynote: "",
          platform: "", eventLink: "",
          hackProblemStatements: "", hackTechStack: "", hackJudgingCriteria: "",
          hackPrizes: "", hackMentors: "", hackRules: "",
        });
        setStep("category");
        setSelectedCategory("");
      } else {
        alert(`Error: ${result.error || 'Failed to save event'}`);
      }
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Error saving event: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // SUBMIT PAST (unchanged)
  const handlePastSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      eventName: pastData.eventName,
      eventType: pastSelectedCategory,
      startDate: pastData.date,
      endDate: pastData.date,
      ...pastData,
    };

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        alert("Past event saved successfully!");
        setPastData({
          eventName: "", date: "", summary: "",
          hackWinningTeam: "", hackWinningMembers: "", hackPrizeAmount: "", hackRunnerUp: "", hackBestInnovation: "",
          festOverallChampion: "", festBestPerformance: "", festCategoryWinners: "", festJudgeComments: "",
          litWinnerName: "", litCategory: "", litBestPerformer: "",
          sportType: "", sportWinner: "", sportRunnerUp: "", sportScore: "", sportBestPlayer: "",
          confKeynote: "", confPapersPresented: "", confBestPaper: "", confHighlights: "",
          trainCompanyName: "", trainDomain: "", trainStudentsCount: "", trainDuration: "", trainOutcomeSummary: "",
          onlineType: "", onlineSpeaker: "", onlineParticipants: "", onlineRecordingLink: "",
        });
        setPastStep("category");
        setPastSelectedCategory("");
      }
    } catch (err) {
      alert("Error saving past event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Events Admin Panel</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 shadow-md hover:shadow-lg"
            }`}
          >
            Add Upcoming Event
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "past"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 shadow-md hover:shadow-lg"
            }`}
          >
            Add Past Event Results
          </button>
        </div>

        {/* UPCOMING SECTION */}
        {activeTab === "upcoming" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === "category" ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Select Event Category</h2>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full max-w-md mx-auto p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedCategory && setStep("form")}
                  disabled={!selectedCategory}
                  className="mt-8 px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpcomingSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
                  {selectedCategory} Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <input name="name" placeholder="Event Name *" required className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.name} />
                  <select name="mode" required className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.mode}>
                    <option value="">Mode *</option>
                    <option>Online</option><option>Offline</option>
                  </select>
                  <input name="venue" placeholder="Venue / Platform" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.venue} />
                  <input name="organizer" placeholder="Organizer" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.organizer} />
                  <input name="startDate" type="date" required className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.startDate} />
                  <input name="endDate" type="date" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.endDate} />
                  <input name="startTime" type="time" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.startTime} />
                  <input name="endTime" type="time" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.endTime} />
                  <input name="deadlines" placeholder="Registration Deadline" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.deadlines} />
                  <input name="registrationLink" placeholder="Registration Link" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.registrationLink} />
                  <input name="contact" placeholder="Contact Info" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.contact} />
                  <div className="col-span-2">
                    <textarea name="description" placeholder="Description" rows={4} className="w-full p-4 border rounded-xl" onChange={handleEventChange} value={eventData.description}></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Poster / Image
                    </label>
                    <input 
                      type="file" 
                      name="poster" 
                      accept="image/*" 
                      className="w-full p-4 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                      onChange={handleEventChange} 
                    />
                    {eventData.poster && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ Selected: {eventData.poster.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category-specific fields */}
                {hackathonCategories.includes(selectedCategory) && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6 bg-gray-50 p-6 rounded-xl">
                    <h3 className="col-span-2 font-bold text-lg text-gray-700">Hackathon Details</h3>
                    <textarea name="hackProblemStatements" placeholder="Problem Statements" rows={3} className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.hackProblemStatements}></textarea>
                    <input name="hackTechStack" placeholder="Tech Stack" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.hackTechStack} />
                    <textarea name="hackJudgingCriteria" placeholder="Judging Criteria" rows={3} className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.hackJudgingCriteria}></textarea>
                    <input name="hackPrizes" placeholder="Prizes" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.hackPrizes} />
                    <input name="hackMentors" placeholder="Mentors" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.hackMentors} />
                    <input name="theme" placeholder="Theme" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.theme} />
                    <input name="teamSize" placeholder="Team Size" className="p-4 border rounded-xl" onChange={handleEventChange} value={eventData.teamSize} />
                    <textarea name="hackRules" placeholder="Rules" rows={3} className="col-span-2 p-4 border rounded-xl" onChange={handleEventChange} value={eventData.hackRules}></textarea>
                  </div>
                )}

                <div className="flex justify-between mt-10">
                  <button 
                    type="button" 
                    onClick={() => setStep("category")} 
                    className="px-8 py-4 bg-gray-500 text-white rounded-xl font-bold"
                    disabled={isUploading}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Save Upcoming Event"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PAST SECTION - Unchanged */}
        {activeTab === "past" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {pastStep === "category" ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Select Past Event Category</h2>
                <select
                  value={pastSelectedCategory}
                  onChange={(e) => setPastSelectedCategory(e.target.value)}
                  className="w-full max-w-md mx-auto p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose category...</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button
                  onClick={() => pastSelectedCategory && setPastStep("form")}
                  disabled={!pastSelectedCategory}
                  className="mt-8 px-10 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-purple-700 transition"
                >
                  Next
                </button>
              </div>
            ) : (
              <form onSubmit={handlePastSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                  {pastSelectedCategory} Results
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <input name="eventName" placeholder="Event Name *" required className="p-4 border rounded-xl" onChange={handlePastChange} value={pastData.eventName} />
                  <input name="date" type="date" required className="p-4 border rounded-xl" onChange={handlePastChange} value={pastData.date} />
                </div>

                {hackathonCategories.includes(pastSelectedCategory) && (
                  <div className="bg-orange-50 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-lg text-gray-700">Winners & Results</h3>
                    <input name="hackWinningTeam" placeholder="Winning Team Name" className="w-full p-4 border rounded-xl" onChange={handlePastChange} value={pastData.hackWinningTeam} />
                    <input name="hackWinningMembers" placeholder="Winning Team Members" className="w-full p-4 border rounded-xl" onChange={handlePastChange} value={pastData.hackWinningMembers} />
                    <input name="hackPrizeAmount" placeholder="Prize Amount" className="w-full p-4 border rounded-xl" onChange={handlePastChange} value={pastData.hackPrizeAmount} />
                    <input name="hackRunnerUp" placeholder="Runner-up Team" className="w-full p-4 border rounded-xl" onChange={handlePastChange} value={pastData.hackRunnerUp} />
                    <input name="hackBestInnovation" placeholder="Best Innovation Award" className="w-full p-4 border rounded-xl" onChange={handlePastChange} value={pastData.hackBestInnovation} />
                  </div>
                )}

                <textarea name="summary" placeholder="Overall Summary / Key Takeaways" rows={5} className="w-full p-4 border rounded-xl" onChange={handlePastChange} value={pastData.summary}></textarea>

                <div className="flex justify-between mt-10">
                  <button type="button" onClick={() => setPastStep("category")} className="px-8 py-4 bg-gray-500 text-white rounded-xl font-bold">
                    Back
                  </button>
                  <button type="submit" className="px-10 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition">
                    Save Past Event Results
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}