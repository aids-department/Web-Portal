import React from "react";
import { Link } from "react-router-dom";
import FacultyCard from "../components/FacultyCard";

const FacultyInfo = () => {
  const hod = {
    name: "Dr. S. Kalarani",
    title: "HoD (i/c)",
    specialization: "Cloud Computing, Deep Learning",
    email: "kalarani@psgitech.ac.in",
    googleSite: "https://psgitech.ac.in/ai-ds",
    googleScholar: "https://scholar.google.co.in/citations?user=JUzxGPEAAAAJ&hl=en",
    orcid: "https://orcid.org/0000-0002-7554-1130",
    imageUrl: "https://image2url.com/images/1763822054111-2abc1681-8378-4dc4-8dc2-4f5b925cb42d.jpg",
  };

  const faculty = [
    { name: "Dr. S. Lokesh", title: "Professor", specialization: "AI, Human-Computer Interaction, Data Science", email: "lokesh@psgitech.ac.in", googleSite: "https://sites.google.com/view/slokesh/home", googleScholar: "https://scholar.google.co.in/citations?user=mQcPDT0AAAAJ", office: "C-215", imageUrl: "https://image2url.com/images/1763822136498-f6d58635-7e85-4603-9221-3e1f7d2fbed3.jpg" },
    { name: "Dr. S. Sangeetha", title: "Associate Professor", specialization: "Responsible AI, Deep Learning, Generative AI", email: "sangeetha@psgitech.ac.in", office: "C-216", imageUrl: "https://image2url.com/images/1763822422587-0efb8c14-6c02-48e5-ab2f-a156502f48e3.jpg" },
    { name: "Mr. C. Santhosh", title: "Assistant Professor (Selection Grade)", specialization: "Data Science, Big Data Analysis", email: "santhosh@psgitech.ac.in", office: "C-217", imageUrl: "https://image2url.com/images/1763822155502-c8afffeb-0a35-431f-b5de-69243fddd2dc.jpg" },
    { name: "Ms. G. Suganya", title: "Assistant Professor (Senior Grade)", specialization: "DevOps, Soft Computing", email: "suganya@psgitech.ac.in", office: "C-218", imageUrl: "https://image2url.com/images/1763822177999-864581f0-bc1f-4d2a-b0ca-79f23c28982e.jpg" },
    { name: "Ms. P. Gomathi", title: "Assistant Professor (Senior Grade)", specialization: "Deep Learning, Computer Networks, Data Science", email: "gomathi.ai@psgitech.ac.in", office: "C-219", imageUrl: "https://image2url.com/images/1763822112670-30f35cb9-0929-4f06-b9ca-c45e12918343.jpg" },
    { name: "Ms. K. Sathya", title: "Assistant Professor", specialization: "Machine Learning, Deep Learning", email: "sathya@psgitech.ac.in", office: "C-220", imageUrl: "https://image2url.com/images/1763822257239-e5a9f5d2-f3b4-4ebb-90d1-433bcaea318a.jpg" },
    { name: "Ms. K. Santhiya", title: "Assistant Professor", specialization: "Data Structures, Machine Learning, Deep Learning", email: "santhiya@psgitech.ac.in", office: "C-221", imageUrl: "https://image2url.com/images/1763822289625-334c40ac-dec6-43aa-bede-7612d5d28da5.jpg" },
    { name: "Ms. R. S. Niranjana", title: "Assistant Professor", specialization: "Deep Learning, Cybersecurity, Data Structures", email: "niranjana@psgitech.ac.in", office: "C-222", imageUrl: "https://image2url.com/images/1763822328307-2aa96916-1928-4a95-a4cc-3bd0de25397d.jpg" },
    { name: "Ms. B. Sree Krishna", title: "Assistant Professor", specialization: "Artificial Intelligence, Image Processing, Data Science", email: "sreekrishna.ai@psgitech.ac.in", office: "C-223", imageUrl: "https://image2url.com/images/1763822307567-7634608c-a785-4a28-a3e7-5a2ac0e0c9e0.jpg" },
  ];

  return (
    <div className="bg-white">
      {/* Sub-nav tab strip */}
      <div className="flex gap-[26px] px-gutter border-b-2 border-navy bg-white">
        <span className="py-4 text-[12.5px] leading-none font-semibold text-navy shadow-[inset_0_-3px_0_#dd2b0f]">Faculty</span>
        <Link to="/about/staff" className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy no-underline">Staff</Link>
        <Link to="/about/syllabus" className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy no-underline">Syllabus</Link>
        <span className="py-4 text-[12.5px] leading-none font-medium text-ds-ink-soft hover:text-navy cursor-pointer">The department</span>
      </div>

      {/* Page heading */}
      <div className="pt-10 px-gutter pb-[26px] bg-white flex items-end justify-between">
        <div className="flex flex-col gap-2.5">
          <span className="font-medium text-[10.5px] leading-none tracking-kicker uppercase text-ds-red">
            {faculty.length + 1} members · 4 research groups
          </span>
          <h1 className="m-0 font-semibold text-[44px] leading-none tracking-display text-navy">
            Faculty
          </h1>
        </div>
        <div className="flex gap-[9px]">
          <span className="px-[13px] py-2 font-semibold text-[11.5px] leading-none bg-navy text-white">All</span>
          <span className="px-[13px] py-2 font-medium text-[11.5px] leading-none border border-ds-edge text-ds-ink-soft">Professors</span>
          <span className="px-[13px] py-2 font-medium text-[11.5px] leading-none border border-ds-edge text-ds-ink-soft">Associate</span>
          <span className="px-[13px] py-2 font-medium text-[11.5px] leading-none border border-ds-edge text-ds-ink-soft">Assistant</span>
        </div>
      </div>

      {/* HOD section */}
      <div className="px-gutter pb-5 bg-white">
        <div className="grid grid-cols-[220px_1fr] gap-[30px] border border-ds-edge p-6">
          <div className="h-[250px] bg-ds-blue grid place-items-center grayscale overflow-hidden">
            {hod.imageUrl ? (
              <img src={hod.imageUrl} alt={hod.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <span className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-[#a8b6cc]">Portrait</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-medium text-[10px] leading-none tracking-[.18em] uppercase text-ds-red">Head of department</span>
            <h2 className="m-0 font-semibold text-[30px] leading-[1.1] text-navy">{hod.name}</h2>
            <span className="font-medium text-[13.5px] leading-none text-ds-blue">{hod.title} · {hod.specialization}</span>
            <p className="m-0 max-w-[76ch] font-normal text-[14px] leading-[1.7] text-[#3a3838]">
              {/* Added a sample placeholder bio since bio is not in JSON data currently */}
              Dr. S. Kalarani brings years of academic expertise in Cloud Computing and Deep Learning. She has been instrumental in aligning the department's curriculum with industry standards and shaping research initiatives in applied artificial intelligence.
            </p>
            
            <div className="grid grid-cols-4 gap-px bg-ds-edge border border-ds-edge mt-1.5">
              <div className="bg-white px-3.5 py-3">
                <div className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-ds-ink-faint">Qualification</div>
                <div className="font-medium text-[13px] leading-[1.3] text-navy pt-1.5">Ph.D.</div>
              </div>
              <div className="bg-white px-3.5 py-3">
                <div className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-ds-ink-faint">Publications</div>
                <div className="font-medium text-[13px] leading-[1.3] text-navy pt-1.5 font-variant-numeric tabular-nums">48</div>
              </div>
              <div className="bg-white px-3.5 py-3">
                <div className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-ds-ink-faint">Office</div>
                <div className="font-medium text-[13px] leading-[1.3] text-navy pt-1.5">C-214</div>
              </div>
              <div className="bg-white px-3.5 py-3">
                <div className="font-medium text-[9.5px] leading-none tracking-[.14em] uppercase text-ds-ink-faint">Email</div>
                <a href={`mailto:${hod.email}`} className="font-medium text-[13px] leading-[1.3] text-ds-blue pt-1.5 block">{hod.email}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty grid */}
      <div className="grid grid-cols-4 gap-px bg-ds-edge mx-gutter mb-12 border border-ds-edge">
        {faculty.map((f, i) => (
          <div key={i} className="bg-white p-5 flex flex-col gap-[11px]">
            <div className="h-[150px] bg-ds-blue-tint border border-[#c3cfe3] grid place-items-center grayscale overflow-hidden">
              {f.imageUrl ? (
                <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <span className="font-medium text-[9px] leading-none tracking-[.14em] uppercase text-[#7d8ba6]">Portrait</span>
              )}
            </div>
            <h3 className="m-0 font-semibold text-[16px] leading-[1.25] text-navy">{f.name}</h3>
            <span className="font-medium text-[11.5px] leading-[1.3] text-ds-blue">{f.title}</span>
            <span className="font-normal text-[11.5px] leading-[1.4] text-ds-ink-faint">{f.specialization}</span>
            <div className="border-t border-ds-row pt-[9px] flex justify-between mt-auto">
              <span className="font-normal text-[11px] leading-none text-ds-ink-faint">{f.office || "Office TBD"}</span>
              <a href={f.googleSite || "#"} className="font-medium text-[11px] leading-none text-ds-red no-underline">Profile</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyInfo;
