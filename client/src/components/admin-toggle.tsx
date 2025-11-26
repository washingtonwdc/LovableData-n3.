import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAdmin } from "./admin-provider";

export function AdminToggle() {
  const { adminOpen, setAdminOpen, setDialogOpen } = useAdmin();

  const handleClick = () => {
    if (adminOpen) {
      setAdminOpen(false);
    } else {
      setDialogOpen(true);
    }
  };

  // Unlock flow handled by AdminDialog via provider

  return (
    <>
      <Button
        variant={adminOpen ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        data-testid="button-admin-toggle"
        title={adminOpen ? "Admin ativo" : "Abrir admin"}
      >
        <Shield className="mr-2 h-4 w-4" />
        Admin
      </Button>

      {/* Dialog moved to AdminDialog */}
    </>
  );
}