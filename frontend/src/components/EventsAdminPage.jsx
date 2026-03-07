import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Save,
  Upload,
  CheckCircle,
  Pencil,
  Trash
} from "lucide-react";

export default function EventsAdminPage() {

  const [activeTab, setActiveTab] = useState("upcoming");

  const categories = [
    "Hackathon", "Cultural Fests", "Management Fests", "Literary Fests",
    "Sports Fests", "Conferences", "Online Events", "Seminar",
    "Workshops", "Trainings", "Internships",
  ];

  const hackathonCategories = ["Hackathon"];

  const [events,setEvents] = useState([]);

  const [editingEventId,setEditingEventId] = useState(null);

  const [step,setStep] = useState("category");

  const [selectedCategory,setSelectedCategory] = useState("");

  const [isUploading,setIsUploading] = useState(false);

  const [eventData,setEventData] = useState({
    name:"",
    mode:"",
    venue:"",
    organizer:"",
    startDate:"",
    endDate:"",
    startTime:"",
    endTime:"",
    description:"",
    poster:null,
    deadlines:"",
    registrationLink:"",
    contact:"",
    hackProblemStatements:"",
    hackTechStack:"",
    hackJudgingCriteria:"",
    hackPrizes:"",
    hackMentors:"",
    hackRules:"",
    theme:"",
    teamSize:"",
  });

  useEffect(()=>{
    fetchEvents();
  },[]);

  const fetchEvents = async ()=>{
    try{
      const res = await fetch("https://web-portal-760h.onrender.com/api/events");
      const data = await res.json();
      setEvents(data);
    }catch(err){
      console.error(err);
    }
  };

  const handleEventChange = (e)=>{
    const {name,value,files} = e.target;
    setEventData(prev=>({...prev,[name]:files?files[0]:value}));
  };

  const handleEdit = (event)=>{

    setEditingEventId(event._id);

    setSelectedCategory(event.eventType);

    setActiveTab("upcoming");

    setEventData({
      name:event.eventName,
      mode:event.eventMode,
      venue:event.venue,
      organizer:event.organizer,
      startDate:event.startDate,
      endDate:event.endDate,
      startTime:event.startTime,
      endTime:event.endTime,
      description:event.description,
      poster:null,
      deadlines:event.deadlines,
      registrationLink:event.registrationLink === "NO_LINK" ? "" : event.registrationLink,
      contact:event.contact,
      hackProblemStatements:event.hackProblemStatements,
      hackTechStack:event.hackTechStack,
      hackJudgingCriteria:event.hackJudgingCriteria,
      hackPrizes:event.hackPrizes,
      hackMentors:event.hackMentors,
      hackRules:event.hackRules,
      theme:event.theme,
      teamSize:event.teamSize,
    });

    setStep("form");
  };

  const handleDelete = async(id)=>{

    if(!window.confirm("Delete this event?")) return;

    try{
      await fetch(`https://web-portal-760h.onrender.com/api/events/${id}`,{
        method:"DELETE"
      });

      fetchEvents();
    }catch(err){
      alert("Delete failed");
    }

  };

  const handleUpcomingSubmit = async(e)=>{

    e.preventDefault();

    setIsUploading(true);

    try{

      const formData = new FormData();

      formData.append("eventName",eventData.name);
      formData.append("eventType",selectedCategory);
      formData.append("startDate",eventData.startDate);
      formData.append("endDate",eventData.endDate || eventData.startDate);
      formData.append("venue",eventData.venue);
      formData.append("eventMode",eventData.mode);
      formData.append("organizer",eventData.organizer);
      formData.append("description",eventData.description);

      formData.append("registrationLink",eventData.registrationLink || "NO_LINK");

      formData.append("contact",eventData.contact);

      formData.append("deadlines",eventData.deadlines || eventData.startDate);

      formData.append("startTime",eventData.startTime);
      formData.append("endTime",eventData.endTime);

      if(hackathonCategories.includes(selectedCategory)){

        formData.append("hackProblemStatements",eventData.hackProblemStatements);
        formData.append("hackTechStack",eventData.hackTechStack);
        formData.append("hackJudgingCriteria",eventData.hackJudgingCriteria);
        formData.append("hackPrizes",eventData.hackPrizes);
        formData.append("hackMentors",eventData.hackMentors);
        formData.append("hackRules",eventData.hackRules);
        formData.append("theme",eventData.theme);
        formData.append("teamSize",eventData.teamSize);

      }

      if(eventData.poster){
        formData.append("poster",eventData.poster);
      }

      const url = editingEventId
        ? `https://web-portal-760h.onrender.com/api/events/${editingEventId}`
        : "https://web-portal-760h.onrender.com/api/events";

      const method = editingEventId ? "PUT":"POST";

      const res = await fetch(url,{
  method,
  headers: editingEventId ? { "Content-Type":"application/json" } : undefined,
  body: editingEventId
    ? JSON.stringify(Object.fromEntries(formData))
    : formData
});

      if(res.ok){

        alert("Event saved successfully");

        fetchEvents();

        setEditingEventId(null);

        setStep("category");

        setSelectedCategory("");

        setEventData({
          name:"",
          mode:"",
          venue:"",
          organizer:"",
          startDate:"",
          endDate:"",
          startTime:"",
          endTime:"",
          description:"",
          poster:null,
          deadlines:"",
          registrationLink:"",
          contact:"",
          hackProblemStatements:"",
          hackTechStack:"",
          hackJudgingCriteria:"",
          hackPrizes:"",
          hackMentors:"",
          hackRules:"",
          theme:"",
          teamSize:"",
        });

      }else{
        alert("Error saving event");
      }

    }catch(err){
      alert(err.message);
    }finally{
      setIsUploading(false);
    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 px-4">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Events Admin Panel
        </h1>

        <div className="flex justify-center gap-3 mb-6">

          <button
            onClick={()=>setActiveTab("upcoming")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
              activeTab==="upcoming"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
            }`}
          >
            <Plus className="w-4 h-4"/>
            Add Event
          </button>

          <button
            onClick={()=>setActiveTab("manage")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
              activeTab==="manage"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700"
            }`}
          >
            <Users className="w-4 h-4"/>
            Manage Events
          </button>

        </div>

        {activeTab==="manage" && (

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="font-bold text-lg mb-4">Existing Events</h2>

            <div className="space-y-3">

              {events.map(ev=>(
                <div key={ev._id} className="flex justify-between items-center border p-3 rounded">

                  <div>
                    <p className="font-semibold">{ev.eventName}</p>
                    <p className="text-sm text-gray-500">{ev.eventType}</p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={()=>handleEdit(ev)}
                      className="p-2 bg-blue-500 text-white rounded"
                    >
                      <Pencil size={16}/>
                    </button>

                    <button
                      onClick={()=>handleDelete(ev._id)}
                      className="p-2 bg-red-500 text-white rounded"
                    >
                      <Trash size={16}/>
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>

        )}

        {activeTab==="upcoming" && (

          <div className="bg-white rounded-xl shadow-lg p-6">

            {step==="category" ? (

              <div className="text-center">

                <h2 className="text-xl font-bold mb-6">
                  Select Event Category
                </h2>

                <select
                  value={selectedCategory}
                  onChange={(e)=>setSelectedCategory(e.target.value)}
                  className="w-full max-w-md mx-auto p-3 border rounded-lg"
                >
                  <option value="">Choose category...</option>
                  {categories.map(cat=>(
                    <option key={cat}>{cat}</option>
                  ))}
                </select>

                <button
                  onClick={()=>selectedCategory && setStep("form")}
                  className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 mx-auto"
                >
                  Next
                  <ArrowRight size={16}/>
                </button>

              </div>

            ):(
              <form onSubmit={handleUpcomingSubmit} className="space-y-4">

                <div className="grid md:grid-cols-2 gap-4">

                  <input name="name" required placeholder="Event Name" className="p-3 border rounded-lg" value={eventData.name} onChange={handleEventChange}/>

                  <select name="mode" required className="p-3 border rounded-lg" value={eventData.mode} onChange={handleEventChange}>
                    <option value="">Mode</option>
                    <option>Online</option>
                    <option>Offline</option>
                  </select>

                  <input name="venue" required placeholder="Venue" className="p-3 border rounded-lg" value={eventData.venue} onChange={handleEventChange}/>

                  <input name="contact" required placeholder="Contact Info" className="p-3 border rounded-lg" value={eventData.contact} onChange={handleEventChange}/>

                  <input type="date" name="startDate" required className="p-3 border rounded-lg" value={eventData.startDate} onChange={handleEventChange}/>

                  <input type="date" name="endDate" required className="p-3 border rounded-lg" value={eventData.endDate} onChange={handleEventChange}/>

                  <input type="time" name="startTime" required className="p-3 border rounded-lg" value={eventData.startTime} onChange={handleEventChange}/>

                  <input type="time" name="endTime" className="p-3 border rounded-lg" value={eventData.endTime} onChange={handleEventChange}/>

                  <input type="date" name="deadlines" required className="p-3 border rounded-lg" value={eventData.deadlines} onChange={handleEventChange}/>

                  <input name="registrationLink" placeholder="Registration Link" className="p-3 border rounded-lg" value={eventData.registrationLink} onChange={handleEventChange}/>

                </div>

                <textarea name="description" placeholder="Description" className="w-full p-3 border rounded-lg" rows={3} value={eventData.description} onChange={handleEventChange}/>

                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                  <Save size={16}/>
                  {editingEventId ? "Update Event":"Save Event"}
                </button>

              </form>
            )}

          </div>

        )}

      </div>

    </div>
  );

}