import React from 'react';
import { Shield, Users, Vote, Scale, Clock, AlertTriangle } from 'lucide-react';

export const Governance: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Protocol Governance</h1>
      <p className="text-xl text-gray-600 text-center mb-12">
        Empowering our community through transparent and decentralized decision-making
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Vote className="h-6 w-6 text-indigo-600 mr-2" />
            Voting Power
          </h3>
          <p className="text-gray-600 mb-4">
            Voting power is earned through active participation:
          </p>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Donations contribute to base voting power
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Volunteer hours add additional weight
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Verified organizations receive multipliers
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-6 w-6 text-indigo-600 mr-2" />
            Proposal Thresholds
          </h3>
          <p className="text-gray-600 mb-4">
            Core protocol changes require:
          </p>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              66% supermajority approval
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              50% minimum participation
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              48-hour voting period
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-6 w-6 text-indigo-600 mr-2" />
            Council Oversight
          </h3>
          <p className="text-gray-600 mb-4">
            A multi-signature council provides:
          </p>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Emergency response capabilities
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              4/7 signatures for critical actions
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              24-hour maximum timelock
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Scale className="h-8 w-8 text-indigo-600 mr-3" />
            Proposal Process
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Creation</h4>
              <p className="text-gray-600">
                Any account with minimum voting power can submit detailed proposals with implementation plans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Discussion</h4>
              <p className="text-gray-600">
                7-day minimum discussion period for community feedback and refinement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Voting</h4>
              <p className="text-gray-600">
                48-hour voting period with weighted voting based on participation metrics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Execution</h4>
              <p className="text-gray-600">
                Successful proposals are implemented after meeting all required thresholds.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            Timeframes & Delays
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Standard Changes</h4>
              <div className="text-gray-600 space-y-2">
                <div>• 7 days discussion period</div>
                <div>• 48 hours voting period</div>
                <div>• 24 hours timelock before execution</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Emergency Actions</h4>
              <div className="text-gray-600 space-y-2">
                <div>• No discussion period required</div>
                <div>• 4/7 council signatures needed</div>
                <div>• 24 hours maximum timelock</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-lg flex items-start">
          <AlertTriangle className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Important Notice</h3>
            <p className="text-indigo-700">
              All governance participants are required to review and understand the complete governance documentation before participating in proposals or voting. This ensures informed decision-making and maintains the integrity of our governance process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};