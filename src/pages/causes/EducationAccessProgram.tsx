import React from "react";
import { DonationButton } from "@/components/web3/donation/DonationButton";
import { formatCurrency } from "@/utils/money";

const EducationAccessProgram: React.FC = () => {
  const cause = {
    id: "2",
    name: "Education Access Program",
    description:
      "Ensuring quality education for underprivileged children through innovative learning programs, teacher training, and infrastructure development.",
    targetAmount: 75000,
    raisedAmount: 45000,
    charityId: "2",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800",
    impact: [
      "Provided education to 5,000+ children",
      "Built 20 new classrooms",
      "Trained 200 teachers",
      "Distributed 10,000 educational resources",
    ],
    timeline: "2024-2025",
    location: "Southeast Asia",
    partners: [
      "Education for All",
      "Local Schools",
      "Teaching Volunteers",
      "Ministry of Education",
    ],
  };

  return (
    <>
      <div className="relative h-80 rounded-xl overflow-hidden mb-6 mx-4 sm:mx-6 lg:mx-8 mt-8">
        <img
          src={cause.image}
          alt={cause.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{cause.name}</h1>
          <p className="text-lg opacity-90">{cause.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Funding Progress
            </h2>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {formatCurrency(cause.raisedAmount)} of{" "}
                {formatCurrency(cause.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{
                  width: `${(cause.raisedAmount / cause.targetAmount) * 100}%`,
                }}
              />
            </div>
            <DonationButton
              charityName={cause.name}
              charityAddress={cause.charityId}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Project Details
            </h2>
            <dl className="space-y-4">
              <dt className="text-sm text-gray-500">
                Timeline
                <dd className="font-medium mb-3">{cause.timeline}</dd>
              </dt>
              <dt className="text-sm text-gray-500">
                Location
                <dd className="font-medium mb-3">{cause.location}</dd>
              </dt>
              <dt className="text-sm text-gray-500 mb-1">
                Key Partners
                <dd>
                  <ul className="list-disc list-inside space-y-1">
                    {cause.partners.map((partner) => (
                      <li key={partner} className="text-gray-700">
                        {partner}
                      </li>
                    ))}
                  </ul>
                </dd>
              </dt>
            </dl>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Impact Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cause.impact.map((item) => (
              <p key={item} className="flex items-start text-gray-700">
                <span className="w-2 h-2 mt-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationAccessProgram;
