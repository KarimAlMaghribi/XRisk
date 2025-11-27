import React, { useState, useEffect } from "react";
import { LandingButton } from "./LandingButton";

interface RiskInputModalProps {
  open: boolean;
  onClose: () => void;
  initialRiskDescription?: string;
  isLoggedIn?: boolean;
  onLogin?: () => void;
}

export const RiskInputModal: React.FC<RiskInputModalProps> = ({
  open,
  onClose,
  initialRiskDescription = "",
  isLoggedIn = false,
  onLogin,
}) => {
  const [description, setDescription] = useState(initialRiskDescription);

  useEffect(() => {
    setDescription(initialRiskDescription);
  }, [initialRiskDescription]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
        <h3 className="heading-3 text-primary">Dein Risiko beschreiben</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 min-h-[140px]"
          placeholder="Erzähl uns mehr über dein Risiko"
        />
        <div className="flex justify-end gap-3">
          <LandingButton variant="outline" onClick={onClose}>
            Abbrechen
          </LandingButton>
          {!isLoggedIn && onLogin ? (
            <LandingButton onClick={onLogin}>Anmelden</LandingButton>
          ) : (
            <LandingButton onClick={onClose}>Absenden</LandingButton>
          )}
        </div>
      </div>
    </div>
  );
};
