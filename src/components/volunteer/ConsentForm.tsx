import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

interface ConsentFormProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentForm: React.FC<ConsentFormProps> = ({
  onAccept,
  onDecline,
}) => {
  const [essentialProcessing, setEssentialProcessing] = useState(false);
  const [ageConfirmation, setAgeConfirmation] = useState(false);
  const [privacyNotice, setPrivacyNotice] = useState(false);
  const [internationalTransfers, setInternationalTransfers] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAccept = useCallback(() => {
    // Validate required checkboxes
    if (!essentialProcessing) {
      setValidationError("Essential Processing consent is required to proceed");
      return;
    }

    if (!ageConfirmation || !privacyNotice) {
      setValidationError(
        "You must confirm your age and that you have read the Privacy Notice",
      );
      return;
    }

    // Clear any validation errors and proceed
    setValidationError(null);
    onAccept();
  }, [essentialProcessing, ageConfirmation, privacyNotice, onAccept]);

  const handleEssentialProcessingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEssentialProcessing(e.target.checked);
      if (
        e.target.checked &&
        validationError?.includes("Essential Processing")
      ) {
        setValidationError(null);
      }
    },
    [validationError],
  );

  const handleInternationalTransfersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternationalTransfers(e.target.checked);
    },
    [],
  );

  const handleAgeConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAgeConfirmation(e.target.checked);
      if (
        e.target.checked &&
        privacyNotice &&
        validationError?.includes("confirm your age")
      ) {
        setValidationError(null);
      }
    },
    [privacyNotice, validationError],
  );

  const handlePrivacyNoticeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrivacyNotice(e.target.checked);
      if (
        e.target.checked &&
        ageConfirmation &&
        validationError?.includes("confirm your age")
      ) {
        setValidationError(null);
      }
    },
    [ageConfirmation, validationError],
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Volunteer Application Consent Form
        </h2>

        <main className="prose prose-sm max-w-none space-y-6">
            <h3 className="text-lg font-semibold">
              CONSENT TO PROCESS PERSONAL INFORMATION
            </h3>

            <p>
              By completing and submitting this form, I consent to GIVE PROTOCOL
              collecting, processing, and storing my personal information as
              described in the Volunteer Application Privacy Notice, which I
              have read and understood.
            </p>

            <div>
              <p className="font-medium">I understand that:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  My personal information will be processed for the purposes of
                  evaluating my volunteer application, managing volunteer
                  assignments, and related activities.
                </li>
                <li>
                  GIVE PROTOCOL may collect various categories of my personal
                  information, including identity information, contact details,
                  background information, availability, references, and where
                  relevant and permitted by law, certain special categories of
                  data.
                </li>
                <li>
                  My personal information may be shared with authorized personnel
                  within the charity organization offering the volunteer
                  opportunity, service providers, and third parties as outlined in
                  the Privacy Notice.
                </li>
                <li>
                  My personal information may be transferred internationally with
                  appropriate safeguards in place.
                </li>
                <li>
                  I have certain rights regarding my personal information, which
                  vary depending on my location, including the rights to access,
                  rectify, delete, restrict processing, data portability, and
                  object to processing.
                </li>
                <li>
                  I can withdraw my consent at any time by contacting
                  legal@giveprotocol.io, though this will not affect the
                  lawfulness of processing based on my consent before withdrawal.
                  Withdrawing consent may impact the organization&apos;s ability
                  to consider my volunteer application.
                </li>
              </ol>
            </div>

            <section>
              <h3 className="text-lg font-semibold">SPECIFIC CONSENTS</h3>
              <p>Please review and indicate your consent to each of the following:</p>

              <div className="space-y-4 mt-4">
                <label className="flex items-start space-x-3" htmlFor="essential-processing">
                  <input
                    type="checkbox"
                    id="essential-processing"
                    checked={essentialProcessing}
                    onChange={handleEssentialProcessingChange}
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">
                      Essential Processing (Required)
                    </div>
                    I consent to GIVE PROTOCOL collecting and processing my
                    personal information for the purpose of evaluating my
                    volunteer application and, if successful, managing my
                    volunteer engagement.
                    <div className="mt-1 text-gray-500 italic">
                      Note: This consent is necessary to process your volunteer
                      application. If you do not provide this consent, we will not
                      be able to consider your application.
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3" htmlFor="international-transfers">
                  <input
                    type="checkbox"
                    id="international-transfers"
                    checked={internationalTransfers}
                    onChange={handleInternationalTransfersChange}
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">
                      International Transfers (if applicable)
                    </div>
                    I consent to GIVE PROTOCOL transferring my personal
                    information to countries outside my country of residence,
                    including countries that may not provide the same level of
                    data protection, with appropriate safeguards in place as
                    described in the Privacy Notice.
                  </div>
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold">ACKNOWLEDGMENT</h3>
              <div className="space-y-4">
                <label className="flex items-start space-x-3" htmlFor="age-confirmation">
                  <input
                    type="checkbox"
                    id="age-confirmation"
                    checked={ageConfirmation}
                    onChange={handleAgeConfirmationChange}
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">
                    I confirm that I am at least 16 years of age. (If you are
                    under 16 years of age, parental or guardian consent is
                    required)
                  </span>
                </label>

                <label className="flex items-start space-x-3" htmlFor="privacy-notice">
                  <input
                    type="checkbox"
                    id="privacy-notice"
                    checked={privacyNotice}
                    onChange={handlePrivacyNoticeChange}
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">
                    I confirm that I have read and understood the Volunteer
                    Application Privacy Notice dated 29/03/2025.
                  </span>
                </label>
              </div>
            </section>
          </main>

          {validationError && (
            <div className="p-4 bg-red-50 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-700">{validationError}</p>
            </div>
          )}

          <footer className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onDecline}>
              Do Not Accept
            </Button>
            <Button onClick={handleAccept}>Accept and Continue</Button>
          </footer>
      </div>
    </div>
  );
};
