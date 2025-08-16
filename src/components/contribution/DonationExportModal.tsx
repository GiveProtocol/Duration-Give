import React, { useState, useCallback } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Transaction, TransactionExportOptions } from "@/types/contribution";
import { exportDonationsToCSV } from "@/utils/export";
import { formatDateForInput } from "@/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

interface DonationExportModalProps {
  donations: Transaction[];
  onClose: () => void;
}

export const DonationExportModal: React.FC<DonationExportModalProps> = ({
  donations,
  onClose,
}) => {
  const { t } = useTranslation();
  const [filename, setFilename] = useState(
    `contributions_${new Date().toISOString().split("T")[0]}`,
  );
  const [options, setOptions] = useState<TransactionExportOptions>({
    includePersonalInfo: true,
    dateRange: {
      start: formatDateForInput(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ),
      end: formatDateForInput(new Date().toISOString()),
    },
  });

  const handleExport = useCallback(() => {
    // Filter donations based on date range if provided
    let filteredDonations = [...donations];

    if (options.dateRange?.start && options.dateRange?.end) {
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day

      filteredDonations = filteredDonations.filter((donation) => {
        const donationDate = new Date(donation.timestamp);
        return donationDate >= startDate && donationDate <= endDate;
      });
    }

    // Export the filtered donations
    exportDonationsToCSV(filteredDonations, `${filename}.csv`);
    onClose();
  }, [donations, options.dateRange, filename, onClose]);

  const handleFilenameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilename(e.target.value);
    },
    [],
  );

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOptions({
        ...options,
        dateRange: {
          start: e.target.value,
          end: options.dateRange?.end || "",
        },
      });
    },
    [options],
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOptions({
        ...options,
        dateRange: {
          start: options.dateRange?.start || "",
          end: e.target.value,
        },
      });
    },
    [options],
  );

  const handleIncludePersonalInfoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOptions({
        ...options,
        includePersonalInfo: e.target.checked,
      });
    },
    [options],
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form className="bg-white rounded-lg shadow-xl max-w-md w-full divide-y divide-gray-200" onSubmit={(e) => { e.preventDefault(); handleExport(); }}>
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("export.title")}
          </h2>
          <X 
            onClick={handleClose}
            className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer"
            aria-label="Close"
            role="button"
            tabIndex={0}
          />
        </div>

        <main className="p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("export.filename")}
            <Input
              value={filename}
              onChange={handleFilenameChange}
              placeholder="contributions_export"
              className="mt-1"
            />
          </label>

          <label className="block space-y-1 text-sm font-medium text-gray-700">
            {t("export.dateRange")}
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Input
                type="date"
                value={options.dateRange?.start || ""}
                onChange={handleStartDateChange}
              />
              <Input
                type="date"
                value={options.dateRange?.end || ""}
                onChange={handleEndDateChange}
              />
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              id="includePersonalInfo"
              checked={options.includePersonalInfo}
              onChange={handleIncludePersonalInfoChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
            />
            <span className="text-sm text-gray-900">
              {t("export.includePersonal")}
            </span>
          </label>

          <p className="text-sm text-gray-500">{t("export.willInclude")}</p>
          <ul className="text-sm text-gray-500 list-disc list-inside mt-1 space-y-1">
              <li>{t("contributions.date")}</li>
              <li>{t("contributions.type")}</li>
              <li>{t("contributions.details")}</li>
              <li>{t("contributions.status")}</li>
              {options.includePersonalInfo && (
                <li>
                  {t(
                    "export.walletAddresses",
                    "Wallet addresses (sender and recipient)",
                  )}
                </li>
              )}
              <li>
                {t(
                  "export.volunteerDetails",
                  "Volunteer contribution details (when applicable)",
                )}
              </li>
              <li>
                {t(
                  "export.verificationHashes",
                  "Verification hashes (when applicable)",
                )}
              </li>
            </ul>
        </main>

        <div className="flex justify-end space-x-3 p-6">
          <Button variant="secondary" onClick={handleClose}>
            {t("export.cancel")}
          </Button>
          <Button onClick={handleExport} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            {t("export.download")}
          </Button>
        </div>
      </form>
    </section>
  );
};
