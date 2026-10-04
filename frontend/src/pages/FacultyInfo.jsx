import React from "react";
import AboutTabs from "../components/AboutTabs";
import FacultyCard from "../components/FacultyCard";
import PageHeader from "../components/ui/PageHeader";
import SpotlightCard from "../components/ui/SpotlightCard";
import { Reveal, Stagger, StaggerItem } from "../components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";

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
    <div>
      <AboutTabs />

      <div className="container-ln">
        <PageHeader
          spacing="pt-10 pb-10 sm:pt-12 sm:pb-12"
          eyebrow={`${faculty.length + 1} members`}
          title="Faculty"
          description="Researchers and educators across machine learning, data science and responsible AI."
        />

        {/* HOD */}
        <Reveal className="mb-6">
          <SpotlightCard variant="gradient">
            <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-[minmax(160px,240px)_minmax(0,1fr)] sm:p-8">
              <div className="relative w-full max-w-[240px]">
                <div aria-hidden="true" className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-canvas-elevated">
                  <img
                    src={hod.imageUrl}
                    alt={hod.name}
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <span className="eyebrow-accent">Head of department</span>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    <span className="text-gradient">{hod.name}</span>
                  </h2>
                  <span className="text-[15px] font-medium text-accent-bright">{hod.title}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hod.specialization.split(", ").map((s) => (
                    <span key={s} className="pill-neutral">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <a
                    href={`mailto:${hod.email}`}
                    className="group/link flex flex-col gap-1.5 rounded-xl border border-line bg-white/[0.03] px-4 py-3 transition-colors duration-200 hover:border-line-hover hover:bg-white/[0.05] xl:col-span-1"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">Email</span>
                    <span className="truncate text-[13px] font-medium text-fg">{hod.email}</span>
                  </a>
                  {hodLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link flex flex-col gap-1.5 rounded-xl border border-line bg-white/[0.03] px-4 py-3 transition-colors duration-200 hover:border-line-hover hover:bg-white/[0.05]"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">{l.label}</span>
                      <span className="flex items-center gap-1 text-[13px] font-medium text-fg">
                        Visit
                        <ArrowUpRight className="h-3.5 w-3.5 text-fg-muted transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Faculty grid */}
        <Stagger className="grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {faculty.map((f) => (
            <StaggerItem key={f.email}>
              <FacultyCard faculty={f} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
};

export default FacultyInfo;
