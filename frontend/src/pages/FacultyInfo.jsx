import React from "react";
import AboutTabs from "../components/AboutTabs";
import FacultyCard from "../components/FacultyCard";

const FacultyInfo = () => {
  const hod = {
    name: "Dr. S. Kalarani",
    title: "HoD (i/c)",
    specialization: "Cloud Computing, Deep Learning",
    email: "kalarani@psgitech.ac.in",
    googleSite: "https://psgitech.ac.in/ai-ds",
    googleScholar:
      "https://scholar.google.co.in/citations?user=JUzxGPEAAAAJ&hl=en",
    orcid: "https://orcid.org/0000-0002-7554-1130",
    imageUrl:
      "https://image2url.com/images/1763822054111-2abc1681-8378-4dc4-8dc2-4f5b925cb42d.jpg",
  };

  const faculty = [
    {
      name: "Dr. S. Lokesh",
      title: "Professor",
      specialization: "AI, Human-Computer Interaction, Data Science",
      email: "lokesh@psgitech.ac.in",
      googleSite: "https://sites.google.com/view/slokesh/home",
      googleScholar:
        "https://scholar.google.co.in/citations?user=mQcPDT0AAAAJ",
      orcid: "https://orcid.org/0000-0003-2067-6756",
      imageUrl:
        "https://image2url.com/images/1763822136498-f6d58635-7e85-4603-9221-3e1f7d2fbed3.jpg",
    },
    {
      name: "Dr. S. Sangeetha",
      title: "Associate Professor",
      specialization: "Responsible AI, Deep Learning, Generative AI",
      email: "sangeetha@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822422587-0efb8c14-6c02-48e5-ab2f-a156502f48e3.jpg",
    },
    {
      name: "Mr. C. Santhosh",
      title: "Assistant Professor (Selection Grade)",
      specialization: "Data Science, Big Data Analysis",
      email: "santhosh@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822155502-c8afffeb-0a35-431f-b5de-69243fddd2dc.jpg",
    },
    {
      name: "Ms. G. Suganya",
      title: "Assistant Professor (Senior Grade)",
      specialization: "DevOps, Soft Computing",
      email: "suganya@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822177999-864581f0-bc1f-4d2a-b0ca-79f23c28982e.jpg",
    },
    {
      name: "Ms. P. Gomathi",
      title: "Assistant Professor (Senior Grade)",
      specialization: "Deep Learning, Computer Networks, Data Science",
      email: "gomathi.ai@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822112670-30f35cb9-0929-4f06-b9ca-c45e12918343.jpg",
    },
    {
      name: "Ms. K. Sathya",
      title: "Assistant Professor",
      specialization: "Machine Learning, Deep Learning",
      email: "sathya@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822257239-e5a9f5d2-f3b4-4ebb-90d1-433bcaea318a.jpg",
    },
    {
      name: "Ms. K. Santhiya",
      title: "Assistant Professor",
      specialization: "Data Structures, Machine Learning, Deep Learning",
      email: "santhiya@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822289625-334c40ac-dec6-43aa-bede-7612d5d28da5.jpg",
    },
    {
      name: "Ms. R. S. Niranjana",
      title: "Assistant Professor",
      specialization: "Deep Learning, Cybersecurity, Data Structures",
      email: "niranjana@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822328307-2aa96916-1928-4a95-a4cc-3bd0de25397d.jpg",
    },
    {
      name: "Ms. B. Sree Krishna",
      title: "Assistant Professor",
      specialization:
        "Artificial Intelligence, Image Processing, Data Science",
      email: "sreekrishna.ai@psgitech.ac.in",
      imageUrl:
        "https://image2url.com/images/1763822307567-7634608c-a785-4a28-a3e7-5a2ac0e0c9e0.jpg",
    },
  ];

  const hodLinks = [
    hod.googleSite && { label: "Google Site", href: hod.googleSite },
    hod.googleScholar && { label: "Scholar", href: hod.googleScholar },
    hod.orcid && { label: "ORCID", href: hod.orcid },
  ].filter(Boolean);

  return (
    <div className="font-brand">
      <AboutTabs />

      <div className="px-5 sm:px-8 lg:px-12 pt-7 sm:pt-9 lg:pt-[42px] pb-6 flex items-end justify-between gap-5 flex-wrap">
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-medium tracking-[0.2em] uppercase text-brand-red">
            {faculty.length + 1} members
          </span>
          <h1 className="m-0 text-[32px] sm:text-[38px] lg:text-[44px] leading-none font-semibold tracking-[-0.02em] text-brand-navy">
            Faculty
          </h1>
        </div>
      </div>

      {/* HOD */}
      <div className="px-5 sm:px-8 lg:px-12 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(150px,220px)_minmax(0,2fr)] gap-6 border border-brand-edge p-6">
          <div className="min-h-[230px] bg-brand-blue overflow-hidden">
            <img
              src={hod.imageUrl}
              alt={hod.name}
              className="w-full h-full object-cover grayscale"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
              }}
            />
          </div>
          <div className="min-w-0 flex flex-col gap-2.5">
            <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-brand-red">
              Head of department
            </span>
            <h2 className="m-0 text-[28px] leading-[1.1] font-semibold text-brand-navy">{hod.name}</h2>
            <span className="text-[13.5px] font-medium text-brand-blue">{hod.title}</span>
            <div className="flex flex-wrap gap-1.5">
              {hod.specialization.split(", ").map((s) => (
                <span key={s} className="px-2.5 py-1 text-[11px] border border-brand-ink-faint text-brand-ink-soft">
                  {s}
                </span>
              ))}
            </div>
            <div
              className="grid gap-px bg-brand-edge border border-brand-edge mt-1.5"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
            >
              <div className="bg-white px-3.5 py-3">
                <div className="text-[9.5px] font-medium tracking-[0.14em] uppercase text-brand-ink-soft">
                  Email
                </div>
                <a
                  href={`mailto:${hod.email}`}
                  className="block pt-1.5 text-[13px] font-medium text-brand-blue"
                >
                  {hod.email}
                </a>
              </div>
              {hodLinks.map((l) => (
                <div key={l.label} className="bg-white px-3.5 py-3">
                  <div className="text-[9.5px] font-medium tracking-[0.14em] uppercase text-brand-ink-soft">
                    {l.label}
                  </div>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block pt-1.5 text-[13px] font-medium text-brand-navy"
                  >
                    Visit
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Faculty grid */}
      <div
        className="mx-5 sm:mx-8 lg:mx-12 mb-7 sm:mb-9 lg:mb-12 grid gap-px bg-brand-edge border border-brand-edge"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
      >
        {faculty.map((f) => (
          <FacultyCard key={f.email} faculty={f} />
        ))}
      </div>
    </div>
  );
};

export default FacultyInfo;
