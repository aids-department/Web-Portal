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
import PageHeader from "./ui/PageHeader";

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

    <div className="mx-auto max-w-5xl">

      <PageHeader
        compact
        eyebrow="Content"
        title="Events Admin Panel"
        actions={
          <div className="tabs">
            <button
              onClick={()=>setActiveTab("upcoming")}
              className={`tab flex items-center gap-2 px-4 py-2 ${activeTab==="upcoming" ? "tab-active" : ""}`}
            >
              <Plus className="h-4 w-4"/>
              Add Event
            </button>

            <button
              onClick={()=>setActiveTab("manage")}
              className={`tab flex items-center gap-2 px-4 py-2 ${activeTab==="manage" ? "tab-active" : ""}`}
            >
              <Users className="h-4 w-4"/>
              Manage Events
            </button>
          </div>
        }
      />

      {activeTab==="manage" && (

        <div className="surface edge-highlight p-6 animate-fade-in">

          <h2 className="mb-5 flex items-center justify-between text-[15px] font-semibold text-fg">
            Existing Events
            <span className="font-mono text-[11px] font-normal text-fg-muted">{events.length} total</span>
          </h2>

          <div className="space-y-2">

            {events.map(ev=>(
              <div key={ev._id} className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.02] p-3.5 transition-colors hover:border-line-hover hover:bg-white/[0.04]">

                <div className="flex min-w-0 items-center gap-3">
                  <span className="icon-tile h-9 w-9 flex-none">
                    <Calendar className="h-4 w-4 text-fg-muted" strokeWidth={1.75}/>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{ev.eventName}</p>
                    <p className="text-[12.5px] text-fg-muted">{ev.eventType}</p>
                  </div>
                </div>

                <div className="flex flex-none gap-1.5">

                  <button
                    onClick={()=>handleEdit(ev)}
                    aria-label="Edit event"
                    className="btn-secondary h-9 w-9 p-0"
                  >
                    <Pencil size={15}/>
                  </button>

                  <button
                    onClick={()=>handleDelete(ev._id)}
                    aria-label="Delete event"
                    className="btn-danger h-9 w-9 p-0"
                  >
                    <Trash size={15}/>
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      )}

      {activeTab==="upcoming" && (

        <div className="surface edge-highlight p-6 sm:p-8 animate-fade-in">

          {step==="category" ? (

            <div className="mx-auto flex max-w-md flex-col items-center py-6 text-center">

              <span className="icon-tile mb-4 h-12 w-12">
                <Calendar className="h-5 w-5 text-accent-bright" strokeWidth={1.5}/>
              </span>

              <h2 className="mb-6 text-xl font-semibold tracking-tight text-fg">
                Select Event Category
              </h2>

              <select
                value={selectedCategory}
                onChange={(e)=>setSelectedCategory(e.target.value)}
                className="field py-3"
              >
                <option value="">Choose category...</option>
                {categories.map(cat=>(
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <button
                onClick={()=>selectedCategory && setStep("form")}
                className="btn-primary btn-lg mt-6"
              >
                Next
                <ArrowRight size={16}/>
              </button>

            </div>

          ):(
            <form onSubmit={handleUpcomingSubmit} className="space-y-4">

              <div className="mb-2 flex items-center gap-2">
                <span className="pill">{selectedCategory}</span>
                {editingEventId && <span className="pill-neutral">Editing</span>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <AdminField label="Event Name"><input name="name" required placeholder="Event Name" className="field" value={eventData.name} onChange={handleEventChange}/></AdminField>

                <AdminField label="Mode">
                  <select name="mode" required className="field" value={eventData.mode} onChange={handleEventChange}>
                    <option value="">Mode</option>
                    <option>Online</option>
                    <option>Offline</option>
                  </select>
                </AdminField>

                <AdminField label="Venue"><input name="venue" required placeholder="Venue" className="field" value={eventData.venue} onChange={handleEventChange}/></AdminField>

                <AdminField label="Contact Info"><input name="contact" required placeholder="Contact Info" className="field" value={eventData.contact} onChange={handleEventChange}/></AdminField>

                <AdminField label="Start date"><input type="date" name="startDate" required className="field" value={eventData.startDate} onChange={handleEventChange}/></AdminField>

                <AdminField label="End date"><input type="date" name="endDate" required className="field" value={eventData.endDate} onChange={handleEventChange}/></AdminField>

                <AdminField label="Start time"><input type="time" name="startTime" required className="field" value={eventData.startTime} onChange={handleEventChange}/></AdminField>

                <AdminField label="End time"><input type="time" name="endTime" className="field" value={eventData.endTime} onChange={handleEventChange}/></AdminField>

                <AdminField label="Deadline"><input type="date" name="deadlines" required className="field" value={eventData.deadlines} onChange={handleEventChange}/></AdminField>

                <AdminField label="Registration Link"><input name="registrationLink" placeholder="Registration Link" className="field" value={eventData.registrationLink} onChange={handleEventChange}/></AdminField>

              </div>

              <AdminField label="Description">
                <textarea name="description" placeholder="Description" className="field resize-none" rows={3} value={eventData.description} onChange={handleEventChange}/>
              </AdminField>

              <div className="flex flex-wrap gap-2.5 border-t border-line pt-5">
                <button className="btn-primary">
                  <Save size={16}/>
                  {editingEventId ? "Update Event":"Save Event"}
                </button>
              </div>

            </form>
          )}

        </div>

      )}

    </div>
  );

}

// Label wrapper for admin form controls. Inputs previously relied on
// placeholders alone; a visible label keeps them readable once filled.
function AdminField({ label, children }) {
  return (
    <label className="flex flex-col">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
