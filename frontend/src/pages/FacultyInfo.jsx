import React from "react";
import { Link } from "react-router-dom";
import FacultyCard from "../components/FacultyCard";
import Tabs from "../components/ui/Tabs";

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

  return (
    <div>
      <Tabs className="mb-8 -mt-2">
        <Tabs.Tab active>Faculty</Tabs.Tab>
        <Link to="/about/staff"><Tabs.Tab>Staff</Tabs.Tab></Link>
        <Link to="/about/syllabus"><Tabs.Tab>Syllabus</Tabs.Tab></Link>
      </Tabs>

      <div className="mb-10">
        <span className="text-kicker tracking-kicker uppercase text-ds-red">
          {faculty.length + 1} members
        </span>
        <h1 className="text-page-heading text-navy mt-2.5">Faculty</h1>
      </div>

      {/* HOD */}
      <section className="border border-ds-edge grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 p-6 mb-12">
        <div className="h-[250px] bg-ds-blue-tint overflow-hidden grid place-items-center">
          <img
            src={hod.imageUrl}
            alt={hod.name}
            className="w-full h-full object-cover grayscale"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-kicker tracking-kicker uppercase text-ds-red">Head of department</span>
          <h2 className="text-section-heading text-navy">{hod.name}</h2>
          <span className="text-label font-medium text-ds-blue">{hod.title}</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {hod.specialization.split(", ").map((s) => (
              <span key={s} className="px-2.5 py-1 border border-ds-edge text-label text-ds-ink">
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-6 pt-2 border-t border-ds-row mt-2">
            <a href={`mailto:${hod.email}`} className="text-label text-ds-blue">{hod.email}</a>
            {hod.googleSite && <a href={hod.googleSite} target="_blank" rel="noreferrer" className="text-label font-medium text-ds-red">Site</a>}
            {hod.googleScholar && <a href={hod.googleScholar} target="_blank" rel="noreferrer" className="text-label font-medium text-ds-red">Scholar</a>}
            {hod.orcid && <a href={hod.orcid} target="_blank" rel="noreferrer" className="text-label font-medium text-ds-red">ORCID</a>}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ds-edge border border-ds-edge">
        {faculty.map((f) => (
          <FacultyCard key={f.email} faculty={f} />
        ))}
      </section>
    </div>
  );
};

export default FacultyInfo;
