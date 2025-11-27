import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Phone, Mail, Star, Copy, Share2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ContactShareButtonsProps {
    nome: string;
    ramal?: string;
    telefone?: string;
    email?: string;
}

export function ContactShareButtons({ nome, ramal, telefone, email }: ContactShareButtonsProps) {
    const shareWhatsApp = () => {
        let message = `📞 Contato: ${nome}`;
        if (ramal) message += `\nRamal: ${ramal}`;
        if (telefone) message += `\nTelefone: ${telefone}`;
        if (email) message += `\nE-mail: ${email}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const copyContact = () => {
        let text = `${nome}`;
        if (ramal) text += `\nRamal: ${ramal}`;
        if (telefone) text += `\nTelefone: ${telefone}`;
        if (email) text += `\nE-mail: ${email}`;

        navigator.clipboard.writeText(text).then(() => {
            toast({ title: "Copiado!", description: "Contato copiado para área de transferência" });
        }).catch(() => {
            toast({ title: "Erro", description: "Falha ao copiar", variant: "destructive" });
        });
    };

    return (
        <TooltipProvider>
            <div className="flex gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={shareWhatsApp}
                        >
                            <SiWhatsapp className="h-4 w-4 text-green-600" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Compartilhar via WhatsApp</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={copyContact}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copiar contato</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
