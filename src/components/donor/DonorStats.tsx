import React from 'react';
import { PiggyBank, TrendingUp, Heart } from 'lucide-react';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { useTranslation } from '@/hooks/useTranslation';

interface DonorStatsProps {
  totalDonated: number;
  impactGrowth: number;
  charitiesSupported: number;
}

export const DonorStats: React.FC<DonorStatsProps> = ({
  totalDonated,
  impactGrowth,
  charitiesSupported
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-3">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100">
            <PiggyBank className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{t('dashboard.totalDonations')}</p>
            <p className="text-2xl font-semibold text-gray-900">
              <CurrencyDisplay amount={totalDonated} />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{t('dashboard.impactGrowth', 'Impact Growth')}</p>
            <p className="text-2xl font-semibold text-gray-900">
              <CurrencyDisplay amount={impactGrowth} />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{t('dashboard.charitiesSupported', 'Charities Supported')}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {charitiesSupported}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};