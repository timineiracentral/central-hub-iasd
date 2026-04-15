import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitWeb3Form } from "@/lib/submit-web3form";
import { feedbackOnlySystems, getSystemLabelById, hubSystems } from "@/data/systems";

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const schema = z.object({
  systemId: z.string().min(1, "Selecione o sistema."),
  kind: z.enum(["bug", "feedback"], { message: "Escolha o tipo." }),
  title: z.string().min(3, "Título muito curto.").max(200),
  description: z.string().min(10, "Descreva com pelo menos 10 caracteres.").max(8000),
  email: z.string().email("E-mail inválido."),
  attachment: z
    .custom<FileList | undefined>((v) => v === undefined || v instanceof FileList)
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files[0].size <= MAX_ATTACHMENT_BYTES;
      },
      { message: "Arquivo deve ter no máximo 5 MB." },
    ),
});

type FormValues = z.infer<typeof schema>;

const systemOptions = [
  ...hubSystems.map((s) => ({ value: s.id, label: s.name })),
  ...feedbackOnlySystems.map((s) => ({ value: s.id, label: s.label })),
];

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      systemId: "",
      kind: "feedback",
      title: "",
      description: "",
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!accessKey?.trim()) {
      toast.error("Formulário indisponível: configure VITE_WEB3FORMS_ACCESS_KEY.");
      return;
    }

    const systemLabel = getSystemLabelById(values.systemId);
    const kindLabel = values.kind === "bug" ? "Bug" : "Feedback";
    const messageBody = [
      `Tipo: ${kindLabel}`,
      `Sistema: ${systemLabel}`,
      "",
      values.description.trim(),
    ].join("\n");

    const fd = new FormData();
    fd.append("access_key", accessKey.trim());
    fd.append("name", values.title.trim());
    fd.append("email", values.email.trim());
    fd.append("subject", `[Hub AMC] [${kindLabel}] ${values.title.trim()}`);
    fd.append("message", messageBody);

    const files = values.attachment;
    if (files && files.length > 0 && files[0].size > 0) {
      fd.append("attachment", files[0], files[0].name);
    }

    const result = await submitWeb3Form(fd);

    if (result.ok) {
      toast.success("Chamado enviado. Obrigado!");
      form.reset({ systemId: "", kind: "feedback", title: "", description: "", email: "" });
      setOpen(false);
    } else {
      toast.error(result.message || "Falha ao enviar. Tente novamente.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full",
            "bg-[#023164] text-white shadow-lg transition hover:bg-[#034a8c] focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#023164] focus-visible:ring-offset-2",
            "lg:bottom-10 lg:right-10",
          )}
          aria-label="Abrir formulário de chamado ou feedback"
        >
          <LifeBuoy className="h-7 w-7" strokeWidth={1.75} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chamado ou feedback</DialogTitle>
          <DialogDescription>
            Descreva o problema ou sugestão. Inclua um print se ajudar (imagem, até 5 MB).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fb-system">Sistema</Label>
            <Controller
              control={form.control}
              name="systemId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="fb-system" aria-invalid={!!form.formState.errors.systemId}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {systemOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.systemId && (
              <p className="text-sm text-destructive">{form.formState.errors.systemId.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Controller
              control={form.control}
              name="kind"
              render={({ field }) => (
                <RadioGroup
                  className="flex flex-col gap-2 sm:flex-row sm:gap-6"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                    <RadioGroupItem value="bug" id="fb-kind-bug" />
                    <span>Bug (algo não funciona)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                    <RadioGroupItem value="feedback" id="fb-kind-fb" />
                    <span>Feedback / sugestão</span>
                  </label>
                </RadioGroup>
              )}
            />
            {form.formState.errors.kind && (
              <p className="text-sm text-destructive">{form.formState.errors.kind.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fb-title">Título</Label>
            <Input id="fb-title" placeholder="Resumo em uma linha" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fb-desc">Descrição</Label>
            <Textarea
              id="fb-desc"
              rows={5}
              placeholder="Passos para reproduzir, mensagem de erro, navegador…"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fb-email">Seu e-mail</Label>
            <Input id="fb-email" type="email" autoComplete="email" placeholder="nome@exemplo.org" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fb-file">Print (opcional)</Label>
            <Controller
              control={form.control}
              name="attachment"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <Input
                  id="fb-file"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  name={name}
                  ref={ref}
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChange(e.target.files ?? undefined);
                  }}
                />
              )}
            />
            {form.formState.errors.attachment && (
              <p className="text-sm text-destructive">{form.formState.errors.attachment.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              No Web3Forms, anexos podem exigir plano com suporte a arquivo; se o envio falhar, envie sem o print ou
              descreva o que aparece na tela.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Enviando…" : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
