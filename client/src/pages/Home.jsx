import React, { useState } from 'react';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import axios from 'axios';

// Section 1 Slides
const textSlides = [
  {
    title: "Importance of AlertNet",
    description:
      "AlertNet connects citizens with real-time reporting tools that can save lives during emergencies. It bridges the gap between awareness and action.",
  },
  {
    title: "Why Reporting Matters",
    description:
      "Even small incidents, when reported quickly, can prevent larger disasters. Your alert can mobilize the right help at the right time.",
  },
  {
    title: "Empowering Communities",
    description:
      "When everyone contributes, everyone is safer. AlertNet empowers local communities to take part in building a safer environment.",
  },
];

// Section 2 Slides (Manual Incidents)
const incidentSlides = [
  {
    title: "Ahmedabad Plane Crash",
    date: "June 12, 2024",
    location: "Ahmedabad, Gujarat",
    deaths: 240,
    description:
      "A private chartered plane crashed shortly after takeoff due to engine failure. Emergency teams rushed to the site, but the impact led to severe casualties.",
    image: img2,
  },
  {
    title: "Bengaluru Stampede",
    date: "April 9, 2024",
    location: "Bengaluru, Karnataka",
    deaths: 14,
    description:
      "Chaos erupted at a religious gathering when a fire scare caused panic. The narrow exits led to a stampede situation resulting in tragic losses.",
    image: img3,
  },
  {
    title: "Pahalgam Terror Attack",
    date: "May 21, 2024",
    location: "Pahalgam, Jammu & Kashmir",
    deaths: 7,
    description:
      "Militants opened fire on a bus carrying tourists. Security forces responded immediately, but the surprise nature of the attack led to several fatalities.",
    image: img4,
  },
  {
    title: "Prayagraj Crowd Rush",
    date: "March 2, 2024",
    location: "Prayagraj, Uttar Pradesh",
    deaths: 10,
    description:
      "A sudden surge of pilgrims during a religious ceremony led to an uncontrollable crowd rush. Lack of proper barricading worsened the tragedy.",
    image: img5,
  },
];

const Home = () => {
  const [topReporters, setTopReporters] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentIncidentIndex, setCurrentIncidentIndex] = useState(0);

  const handlePrevText = () => {
    setCurrentTextIndex((prev) =>
      prev === 0 ? textSlides.length - 1 : prev - 1
    );
  };

  const handleNextText = () => {
    setCurrentTextIndex((prev) =>
      prev === textSlides.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevIncident = () => {
    setCurrentIncidentIndex((prev) =>
      prev === 0 ? incidentSlides.length - 1 : prev - 1
    );
  };

  const handleNextIncident = () => {
    setCurrentIncidentIndex((prev) =>
      prev === incidentSlides.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
  const fetchTopReporters = async () => {
    try {
      const res = await axios.get("https://alertnet-backend-mnnu.onrender.com/api/users/top-reporters");
      setTopReporters(res.data);
    } catch (err) {
      console.error("Failed to fetch top reporters", err);
    }
  };
  fetchTopReporters();
}, []);

  const incident = incidentSlides[currentIncidentIndex];

  return (
    <div className="min-h-screen bg-slate-700 py-10 px-4">
      {/* Section 1: Hero/Intro */}
      <section className="flex flex-col md:flex-row items-center bg-white shadow-lg  hover:shadow-yellow-300/90 rounded-xl p-6 gap-8 max-w-6xl mx-auto mb-12">
        <div className="flex-1 flex items-center relative w-full">
          <button
            onClick={handlePrevText}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
          >
            ◀
          </button>

          <div className="mx-auto px-6 text-center md:text-left space-y-4 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
              {textSlides[currentTextIndex].title}
            </h1>
            <p className="text-gray-700 text-base md:text-lg">
              {textSlides[currentTextIndex].description}
            </p>
          </div>

          <button
            onClick={handleNextText}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
          >
            ▶
          </button>
        </div>

        <div className="flex-1 w-full">
          <img
            src={img1}
            alt="AlertNet awareness"
            className="w-full h-72 object-cover rounded-lg shadow"
          />
        </div>
      </section>

      {/* Section 2: Recent Incidents */}
      <section className="bg-white shadow-lg hover:shadow-yellow-300/80 rounded-xl p-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-6">
          Top Incidents 
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left or Right Image */}
          <div className="flex-1">
            <img
              src={incident.image}
              alt={incident.title}
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>

          {/* Details */}
          <div className="flex-1 relative w-full">
            <button
              onClick={handlePrevIncident}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
            >
              ◀
            </button>

            <div className="px-6 text-center md:text-left space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-800">{incident.title}</h3>
              <p className="text-gray-600">
                📍 {incident.location} | 📅 {incident.date}
              </p>
              <p className="text-red-600 font-semibold">💀 Deaths: {incident.deaths}</p>
              <p className="text-gray-700 text-sm">{incident.description}</p>
            </div>

            <button
              onClick={handleNextIncident}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
            >
              ▶
            </button>
          </div>
        </div>
      </section>
      {/* Section 3: Top Reporters */}
<section className="bg-white shadow-lg hover:shadow-yellow-300/80 rounded-xl p-6 max-w-6xl mx-auto mt-12">
  <h2 className="text-4xl  font-bold text-center text-blue-700 mb-6">
    🏆 Top Reporters
  </h2>

  <div className="grid sm:grid-cols-2   md:grid-cols-5 lg:grid-cols-3  gap-10">
    {topReporters.map((reporter, index) => (
      <div
        key={index}
        className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-slate-100 hover:shadow-md transition-shadow"
      >
        <img
          src={reporter.avatar}
          alt={reporter.name}
          className="w-20 h-20 rounded-full object-cover border shadow"
        />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{reporter.name}</h3>
          <p className="text-sm text-gray-600">🚨 Reports: {reporter.incidentCount}</p>
        </div>
      </div>
    ))}
  </div>

  {topReporters.length === 0 && (
    <p className="text-center text-gray-500 mt-6">No top reporters found.</p>
  )}
</section>

      <Footer/>
    </div>
    
  );
};

export default Home;

