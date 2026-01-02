import React from "react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-16">

        <h1 className="text-center text-5xl font-bold text-gray-900">
          Faculty Information
        </h1>

        {/* HOD */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10 hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center mb-10 text-black">
              Head of Department
            </h2>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <img
              src={hod.imageUrl}
              alt={hod.name}
              className="h-56 w-56 rounded-full object-cover border-4 shadow-lg"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/224x224?text=No+Image";
              }}
            />

            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold">{hod.name}</h3>
              <p className="text-xl text-gray-600 mb-4">{hod.title}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {hod.specialization.split(", ").map((s) => (
                  <span
                    key={s}
                    className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <a
                href={`mailto:${hod.email}`}
                className="text-blue-600 font-medium block mb-4"
              >
                {hod.email}
              </a>

              <div className="flex gap-4 flex-wrap">
                {hod.googleSite && (
                  <a
                    href={hod.googleSite}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    Google Site
                  </a>
                )}
                {hod.googleScholar && (
                  <a
                    href={hod.googleScholar}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-success"
                  >
                    Scholar
                  </a>
                )}
                {hod.orcid && (
                  <a
                    href={hod.orcid}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-warning"
                  >
                    ORCID
                  </a>
                )}
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Faculty Grid */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10 hover:shadow-3xl transition-all duration-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Our Faculty
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {faculty.map((f) => (
                <FacultyCard key={f.email} faculty={f} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default FacultyInfo;
