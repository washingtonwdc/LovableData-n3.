import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdmin } from "./admin-provider";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function AdminDialog() {
  const { dialogOpen, setDialogOpen, unlock } = useAdmin();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    const result = await unlock(password);
    setLoading(false);
    if (result.ok) {
      const minutes = Math.max(1, Math.round(((result.ms || 300000) / 60000)));
      toast({ title: "Admin desbloqueado", description: `Permissões ativas por ${minutes} minuto${minutes > 1 ? 's' : ''}.` });
    } else {
      toast({ title: "Senha inválida", description: "Verifique e tente novamente.", variant: "destructive" });
    }
  };

  const onCancel = () => {
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desbloquear Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm text-muted-foreground">Senha mestra</label>
          <Input
            id="admin-password"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha mestra"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onConfirm} disabled={loading || !password}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}