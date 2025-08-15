import React from "react";
import { DonationButton } from "@/components/web3/donation/DonationButton";
import { ScheduledDonationButton } from "@/components/web3/donation/ScheduledDonationButton";
import { formatCurrency } from "@/utils/money";
import { Link } from "react-router-dom";

const GlobalWaterFoundation: React.FC = () => {
  const charity = {
    id: "1",
    name: "Global Water Foundation",
    description:
      "Providing clean water solutions worldwide through innovative technology, community engagement, and sustainable infrastructure development.",
    category: "Water & Sanitation",
    image:
      "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=800",
    verified: true,
    country: "United States",
    stats: {
      totalDonated: 750000,
      donorCount: 1250,
      projectsCompleted: 15,
    },
    mission:
      "Our mission is to ensure universal access to clean water through sustainable solutions and community empowerment.",
    impact: [
      "Provided clean water access to 500,000+ people",
      "Built 1,000+ sustainable water systems",
      "Trained 2,000+ local water technicians",
      "Reduced waterborne diseases by 60% in target areas",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative h-80 rounded-xl overflow-hidden mb-6">
        <img
          src={charity.image}
          alt={charity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8 text-white">
          <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full self-start mb-2">
            Verified
          </span>
          <span className="text-sm opacity-90 mb-2">{charity.country}</span>
          <h1 className="text-4xl font-bold mb-2">{charity.name}</h1>
          <p className="text-lg opacity-90">{charity.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Impact Statistics
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Total Donated</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(charity.stats.totalDonated)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Donors</p>
              <p className="text-xl font-bold text-gray-900">
                {charity.stats.donorCount}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Projects</p>
              <p className="text-xl font-bold text-gray-900">
                {charity.stats.projectsCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Giving Options
          </h2>
          <div className="space-y-4">
            <DonationButton
              charityName={charity.name}
              charityAddress={charity.id}
              buttonText="Give Once"
            />
            <ScheduledDonationButton
              charityName={charity.name}
              charityAddress={charity.id}
              buttonText="Give Monthly"
            />
            <Link
              to="/docs/giving-options"
              className="block text-sm text-indigo-600 hover:text-indigo-800 mt-2 text-center"
            >
              Learn about the difference in giving options →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600">{charity.mission}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Impact Highlights
          </h2>
          <ul className="space-y-2">
            {charity.impact.map((item) => (
              <li key={item} className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GlobalWaterFoundation;
