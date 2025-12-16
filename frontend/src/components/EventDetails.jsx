import React from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Share2, Users, Phone, Award, 
  FileText, Briefcase, Dribbble, PenTool, Download, Clock, AlertCircle 
} from 'lucide-react';

const EventDetails = ({ event, onBack }) => {
  if (!event) return null;

  // --- 1. HELPER FORMATTERS ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- 2. DYNAMIC CONTENT RENDERER ---
  const renderCategorySpecifics = () => {
    switch (event.eventType?.toUpperCase()) {
      
      case 'HACKATHON':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* SWAPPED: Deadline is now here in the main grid */}
            <InfoCard 
              title="Registration Deadline" 
              icon={<Clock className="text-red-500"/>} 
              content={formatDate(event.deadlines)} 
              valueClassName="text-red-600 font-bold"
            />
            <InfoCard title="Prizes" icon={<Award className="text-yellow-500"/>} content={event.prizes} />
            
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-600"/> Problem Statements
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{event.problemStatements}</p>
            </div>
             <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100">
              <h4 className="font-bold text-purple-900 mb-1">Judging Criteria</h4>
              <p className="text-sm text-purple-800">{event.judgingCriteria}</p>
            </div>
          </div>
        );

      case 'SPORTS':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
             <InfoCard title="Sport Type" icon={<Award className="text-orange-500"/>} content={event.sportType} />
             <InfoCard title="Deadline" icon={<Clock className="text-red-500"/>} content={formatDate(event.deadlines)} valueClassName="text-red-600 font-bold"/>
             <InfoCard title="Equipment" icon={<Briefcase className="text-green-500"/>} content={event.equipmentProvided} />
             <InfoCard title="Max Teams" icon={<Users className="text-blue-500"/>} content={event.maxTeams} />
          </div>
        );

      case 'LITERARY':
        return (
          <div className="grid grid-cols-1 gap-4 mt-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard title="Category" icon={<PenTool className="text-purple-500"/>} content={event.literaryCategory} />
                <InfoCard title="Deadline" icon={<Clock className="text-red-500"/>} content={formatDate(event.deadlines)} valueClassName="text-red-600 font-bold"/>
             </div>
             <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
              <h4 className="font-bold text-yellow-900 mb-2">Competition Rules</h4>
              <p className="text-sm text-yellow-800 whitespace-pre-line leading-relaxed">{event.rules}</p>
            </div>
          </div>
        );
      
      case 'INTERNSHIP':
      case 'TRAININGS':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
             <InfoCard title="Company" icon={<Briefcase className="text-blue-600"/>} content={event.companyName} />
             <InfoCard title="Deadline" icon={<Clock className="text-red-500"/>} content={formatDate(event.deadlines)} valueClassName="text-red-600 font-bold"/>
             <InfoCard title="Domain" icon={<Dribbble className="text-indigo-600"/>} content={event.domain} />
             <InfoCard title="Duration" icon={<Calendar className="text-green-600"/>} content={event.duration} />
          </div>
        );

      case 'CONFERENCE':
        return (
           <div className="grid grid-cols-1 gap-4 mt-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard title="Keynote Speaker" icon={<Users className="text-blue-600"/>} content={event.guestDetails} />
                <InfoCard title="Deadline" icon={<Clock className="text-red-500"/>} content={formatDate(event.deadlines)} valueClassName="text-red-600 font-bold"/>
             </div>
             {event.paperPublishingFees && (
                <InfoCard title="Publishing Fees" icon={<Award className="text-red-500"/>} content={event.paperPublishingFees} />
             )}
           </div>
        );

      default:
        return (
           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {event.deadlines && <InfoCard title="Deadline" icon={<Clock className="text-red-500"/>} content={formatDate(event.deadlines)} valueClassName="text-red-600 font-bold"/>}
             {event.guestDetails && event.guestDetails !== "N/A" && (
                <InfoCard title="Guest Speaker" icon={<Users className="text-blue-500"/>} content={event.guestDetails} />
             )}
           </div>
        );
    }
  };

  // --- 3. MAIN RENDER ---
  return (
    <div className="bg-white min-h-full w-full animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="px-6 py-4 border-b border-gray-100 mb-6 bg-white">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Back to Events
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
          {/* Left: Poster */}
          <div className="w-full lg:w-1/3 shrink-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gray-100 border border-gray-100">
              <img src={event.poster} alt={event.eventName} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right: Main Details */}
          <div className="flex-1 flex flex-col space-y-6 w-full">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {event.eventType}
                </span>
                <span className="text-gray-400 text-sm font-medium">Posted Nov 14</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{event.eventName}</h1>
              <p className="text-lg text-gray-500 mt-2">
                Organized by <span className="font-semibold text-gray-800">{event.organizer || event.companyName}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StandardCard icon={<Calendar size={20} className="text-blue-600"/>} label="Date" value={`${formatDate(event.startDate)}`} subValue={formatTime(event.startDate)} />
              <StandardCard icon={<MapPin size={20} className="text-red-600"/>} label="Venue" value={event.eventMode === 'Online' ? 'Online' : event.venue} />
            </div>

            {renderCategorySpecifics()}

            <div className="pt-4 flex gap-4 mt-auto">
              {event.registrationLink ? (
                 <a href={event.registrationLink} target="_blank" rel="noreferrer" className="flex-1 bg-slate-900 text-white text-center font-bold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200">Register Now</a>
              ) : (
                 <button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold py-3.5 rounded-xl cursor-not-allowed">Registration Closed</button>
              )}
              <button className="px-5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"><Share2 size={20}/></button>
            </div>
          </div>
        </div>

        {/* LOWER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10 border-t border-gray-100">
          
          {/* Main Description */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About the Event</h3>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {event.eventDescription || event.additionalDescription || "No specific description provided."}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6 flex flex-col order-first lg:order-last">
             
             {/* A. SWAPPED: TECH STACK BOX (Only for Hackathons) */}
             {event.techStack && (
               <div className="bg-pink-50 border border-pink-100 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Dribbble size={24} className="text-pink-600" />
                    </div>
                    <h4 className="font-bold text-lg text-pink-900">Tech Stack</h4>
                  </div>
                  <p className="font-medium text-pink-800 text-lg leading-relaxed">
                    {event.techStack}
                  </p>
               </div>
             )}

             {/* B. Downloads */}
             {event.attachments && event.attachments.length > 0 && (
               <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                 <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                   <Download size={20} /> Downloads & Resources
                 </h4>
                 <div className="space-y-3">
                   {event.attachments.map((file, index) => (
                     <a key={index} href={file.url} download className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                           <FileText size={16} />
                         </div>
                         <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">{file.name}</span>
                       </div>
                       <Download size={16} className="text-gray-400 group-hover:text-indigo-600" />
                     </a>
                   ))}
                 </div>
               </div>
             )}

             {/* C. Other Statistics */}
             {(event.teamSize || event.registrationFees || event.eligibility) && (
                <div className="border border-gray-200 p-6 rounded-2xl space-y-5">
                  {event.teamSize && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Team Size</p>
                      <p className="font-semibold text-gray-800 text-lg">{event.teamSize}</p>
                    </div>
                  )}
                  {event.registrationFees && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Entry Fee</p>
                      <p className="font-semibold text-green-600 text-xl">{event.registrationFees}</p>
                    </div>
                  )}
                  {event.eligibility && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Eligibility</p>
                      <p className="font-medium text-gray-800">{event.eligibility}</p>
                    </div>
                  )}
                </div>
             )}

             {/* D. Contact */}
             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Phone size={20} className="text-gray-700"/></div>
                  <h4 className="font-bold text-gray-900">Contact Support</h4>
                </div>
                <p className="text-gray-900 font-bold text-lg">{event.contact}</p>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StandardCard = ({ icon, label, value, subValue }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:border-blue-300 transition-colors group">
    <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="font-bold text-gray-900 text-sm md:text-base">{value}</p>
      {subValue && <p className="text-xs text-gray-500 font-medium mt-0.5">{subValue}</p>}
    </div>
  </div>
);

// Updated InfoCard to support valueClassName for Red Text
const InfoCard = ({ title, icon, content, valueClassName = "text-gray-900" }) => {
  if (!content) return null;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
         <p className={`font-medium text-sm ${valueClassName}`}>{content}</p>
      </div>
    </div>
  );
};

export default EventDetails;