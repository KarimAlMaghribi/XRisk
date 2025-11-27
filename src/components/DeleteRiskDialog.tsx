import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface DeleteRiskDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  riskTitle: string;
}

export function DeleteRiskDialog({ open, onClose, onConfirm, riskTitle }: DeleteRiskDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Risiko wirklich löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Möchten Sie das Risiko <strong>"{riskTitle}"</strong> wirklich entfernen? 
            Diese Aktion kann nicht rückgängig gemacht werden. Alle damit verbundenen Nachrichten und Angebote werden ebenfalls gelöscht.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
