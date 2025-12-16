import React from 'react';
import FacultyCard from '../components/FacultyCard';

const FacultyInfo = () => {
  const hod = {
    name: 'Dr. S. Kalarani',
    title: 'HoD (i/c)',
    specialization: 'Cloud Computing, Deep Learning',
    email: 'kalarani@psgitech.ac.in',
    googleSite: 'https://psgitech.ac.in/ai-ds',
    googleScholar: 'https://scholar.google.co.in/citations?user=JUzxGPEAAAAJ&hl=en',
    orcid: 'https://orcid.org/0000-0002-7554-1130',
    imageUrl: 'https://image2url.com/images/1763822054111-2abc1681-8378-4dc4-8dc2-4f5b925cb42d.jpg',
  };

  const faculty = [
    {
      name: 'Dr. S. Lokesh',
      title: 'Professor',
      specialization: 'AI, Human-Computer Interaction, Data Science',
      email: 'lokesh@psgitech.ac.in',
      googleSite: 'https://sites.google.com/view/slokesh/home',
      googleScholar: 'https://scholar.google.co.in/citations?user=mQcPDT0AAAAJ',
      orcid: 'https://orcid.org/0000-0003-2067-6756',
      imageUrl: 'https://image2url.com/images/1763822136498-f6d58635-7e85-4603-9221-3e1f7d2fbed3.jpg',
    },
    {
      name: 'Dr. S. Sangeetha',
      title: 'Associate Professor',
      specialization: 'Responsible AI, Deep Learning, Generative AI',
      email: 'sangeetha@psgitech.ac.in',
      googleSite: 'javascript:void(0)',
      googleScholar: 'javascript:void(0)',
      orcid: 'javascript:void(0)',
      imageUrl: 'https://image2url.com/images/1763822422587-0efb8c14-6c02-48e5-ab2f-a156502f48e3.jpg',
    },
    {
      name: 'Mr. C. Santhosh',
      title: 'Assistant Professor (Selection Grade)',
      specialization: 'Data Science, Big Data Analysis',
      email: 'santhosh@psgitech.ac.in',
      googleSite: 'https://psgitech.ac.in/ai-ds',
      googleScholar: 'https://psgitech.ac.in/ai-ds',
      orcid: 'https://psgitech.ac.in/ai-ds',
      imageUrl: 'https://image2url.com/images/1763822155502-c8afffeb-0a35-431f-b5de-69243fddd2dc.jpg',
    },
    {
      name: 'Ms. G. Suganya',
      title: 'Assistant Professor (Senior Grade)',
      specialization: 'DevOps, Soft Computing',
      email: 'suganya@psgitech.ac.in',
      googleSite: 'https://psgitech.ac.in/ai-ds',
      googleScholar: 'https://psgitech.ac.in/ai-ds',
      orcid: 'https://psgitech.ac.in/ai-ds',
      imageUrl: 'https://image2url.com/images/1763822177999-864581f0-bc1f-4d2a-b0ca-79f23c28982e.jpg',
    },
    {
      name: 'Ms. P. Gomathi',
      title: 'Assistant Professor (Senior Grade)',
      specialization: 'Deep Learning, Computer Networks, Data Science',
      email: 'gomathi.ai@psgitech.ac.in',
      googleSite: 'javascript:void(0)',
      googleScholar: 'javascript:void(0)',
      orcid: 'javascript:void(0)',
      imageUrl: 'https://image2url.com/images/1763822112670-30f35cb9-0929-4f06-b9ca-c45e12918343.jpg',
    },
    {
      name: 'Ms. K. Sathya',
      title: 'Assistant Professor',
      specialization: 'Machine Learning, Deep Learning',
      email: 'sathya@psgitech.ac.in',
      googleSite: 'https://sites.google.com/psgitech.ac.in/profsathyakrishnasamy',
      googleScholar: 'https://scholar.google.com/citations?hl=en&user=gexwfvoAAAAJ',
      orcid: 'https://orcid.org/0000-0003-2973-270X',
      imageUrl: 'https://image2url.com/images/1763822257239-e5a9f5d2-f3b4-4ebb-90d1-433bcaea318a.jpg',
    },
    {
      name: 'Ms. K. Santhiya',
      title: 'Assistant Professor',
      specialization: 'Data Structures, Machine Learning, Deep Learning',
      email: 'santhiya@psgitech.ac.in',
      googleSite: 'https://sites.google.com/psgitech.ac.in/santhiya-kanagaraj/home',
      googleScholar: 'https://scholar.google.com/citations?user=Qzg-joMAAAAJ&hl=en',
      orcid: 'https://orcid.org/0000-0003-3840-1750',
      imageUrl: 'https://image2url.com/images/1763822289625-334c40ac-dec6-43aa-bede-7612d5d28da5.jpg',
    },
    {
      name: 'Ms. R. S. Niranjana',
      title: 'Assistant Professor',
      specialization: 'Deep Learning, Cybersecurity, Data Structures',
      email: 'niranjana@psgitech.ac.in',
      googleSite: 'javascript:void(0)',
      googleScholar: 'javascript:void(0)',
      orcid: 'javascript:void(0)',
      imageUrl: 'https://image2url.com/images/1763822328307-2aa96916-1928-4a95-a4cc-3bd0de25397d.jpg',
    },
    {
      name: 'Ms. B. Sree Krishna',
      title: 'Assistant Professor',
      specialization: 'Artificial Intelligence, Image Processing and Data Science',
      email: 'sreekrishna.ai@psgitech.ac.in',
      googleSite: 'javascript:void(0)',
      googleScholar: 'javascript:void(0)',
      orcid: 'javascript:void(0)',
      imageUrl: 'https://image2url.com/images/1763822307567-7634608c-a785-4a28-a3e7-5a2ac0e0c9e0.jpg',
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50">
      <h1 className="text-center text-3xl sm:text-4xl font-bold mb-8 text-gray-800">Faculty Information</h1>
      
      {/* HOD Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-12">
        <h2 className="text-2xl font-bold p-6 text-center text-gray-700">Head of Department</h2>
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={hod.imageUrl}
              alt={hod.name}
              className="h-48 w-full object-cover md:w-48"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-xl text-indigo-500 font-semibold">{hod.name}</div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">{hod.title}</p>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">{hod.specialization}</p>
            <a href={`mailto:${hod.email}`} className="mt-2 text-gray-500 hover:text-indigo-600">{hod.email}</a>
            <div className="mt-4">
              <a href={hod.googleSite} className="text-indigo-500 hover:text-indigo-600 font-semibold" target="_blank" rel="noopener noreferrer">Google Site</a>
              <span className="mx-2">|</span>
              <a href={hod.googleScholar} className="text-indigo-500 hover:text-indigo-600 font-semibold" target="_blank" rel="noopener noreferrer">Google Scholar</a>
              <span className="mx-2">|</span>
              <a href={hod.orcid} className="text-indigo-500 hover:text-indigo-600 font-semibold" target="_blank" rel="noopener noreferrer">ORCiD</a>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 rounded-xl shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member) => (
            <FacultyCard key={member.name} faculty={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyInfo;
