import { Risk } from "./types/risk";

interface StatusBadgeProps {
  status: Risk['status'];
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusLabel = (status: Risk['status']) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'pending': return 'Ausstehend';
      case 'completed': return 'Abgeschlossen';
      case 'draft': return 'Entwurf';
      case 'expired': return 'Abgelaufen';
      case 'evaluating': return 'In Prüfung';
      default: return status;
    }
  };

  const getStatusColor = (status: Risk['status']) => {
    switch (status) {
      case 'active': return { bg: '#e8f5e9', color: '#00a63e' };
      case 'pending': return { bg: '#fff3e0', color: '#ffa726' };
      case 'completed': return { bg: '#e6e5e5', color: '#353131' };
      case 'draft': return { bg: '#f3f2f2', color: '#4f4a4a' };
      case 'expired': return { bg: '#ffebee', color: '#f54900' };
      case 'evaluating': return { bg: '#e3f2fd', color: '#2196f3' };
      default: return { bg: '#f3f2f2', color: '#4f4a4a' };
    }
  };

  const colors = getStatusColor(status);
  const displayLabel = label || getStatusLabel(status);

  return (
    <div 
      className="box-border content-stretch flex h-[28px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0" 
      data-name="StatusBadge" 
      style={{ backgroundColor: colors.bg }}
    >
      <p 
        className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[12px] text-nowrap whitespace-pre" 
        style={{ 
          fontVariationSettings: "'wdth' 100",
          color: colors.color 
        }}
      >
        {displayLabel}
      </p>
    </div>
  );
}

interface CustomBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'neutral';
}

export function CustomBadge({ label, variant = 'neutral' }: CustomBadgeProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'success': return { bg: '#e8f5e9', color: '#00a63e' };
      case 'warning': return { bg: '#fff3e0', color: '#ff671f' };
      case 'info': return { bg: '#e3f2fd', color: '#2196f3' };
      case 'neutral': return { bg: '#f3f2f2', color: '#4f4a4a' };
      default: return { bg: '#f3f2f2', color: '#4f4a4a' };
    }
  };

  const colors = getVariantColor();

  return (
    <div 
      className="box-border content-stretch flex h-[28px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0" 
      data-name="CustomBadge" 
      style={{ backgroundColor: colors.bg }}
    >
      <p 
        className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[12px] text-nowrap whitespace-pre" 
        style={{ 
          fontVariationSettings: "'wdth' 100",
          color: colors.color 
        }}
      >
        {label}
      </p>
    </div>
  );
}
