import { zodResolver } from "@hookform/resolvers/zod";
import { Headset } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { uploadImageToImgbb } from "@/lib/upload-imgbb";
import { feedbackOnlySystems, getSystemLabelById, hubSystems } from "@/data/systems";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
        return files[0].size <= MAX_IMAGE_BYTES;
      },
      { message: "Imagem deve ter no máximo 5 MB." },
    ),
});

type FormValues = z.infer<typeof schema>;

const systemOptions = [
  ...hubSystems.map((s) => ({ value: s.id, label: s.name })),
  ...feedbackOnlySystems.map((s) => ({ value: s.id, label: s.label })),
];

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;

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

  const attachmentFiles = useWatch({ control: form.control, name: "attachment" });
  const attachmentLabel =
    attachmentFiles && attachmentFiles.length > 0 && attachmentFiles[0]?.name
      ? attachmentFiles[0].name
      : "Nenhuma imagem selecionada";

  const onSubmit = form.handleSubmit(async (values) => {
    if (!accessKey?.trim()) {
      toast.error("Formulário indisponível: configure VITE_WEB3FORMS_ACCESS_KEY.");
      return;
    }

    const files = values.attachment;
    const hasFile = Boolean(files && files.length > 0 && files[0].size > 0);
    const imgbb = imgbbKey?.trim();
    if (hasFile && !imgbb) {
      toast.error("Upload de imagem indisponível: configure VITE_IMGBB_API_KEY.");
      return;
    }

    let imageUrl: string | undefined;
    if (hasFile && files && imgbb) {
      try {
        imageUrl = await uploadImageToImgbb(files[0], imgbb);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Falha ao enviar a imagem.";
        toast.error(msg);
        return;
      }
    }

    const systemLabel = getSystemLabelById(values.systemId);
    const kindLabel = values.kind === "bug" ? "Bug" : "Feedback";
    const messageBody = [
      `Tipo: ${kindLabel}`,
      `Sistema: ${systemLabel}`,
      "",
      values.description.trim(),
      ...(imageUrl ? ["", `Link da imagem: ${imageUrl}`] : []),
    ].join("\n");

    const fd = new FormData();
    fd.append("access_key", accessKey.trim());
    fd.append("name", values.title.trim());
    fd.append("email", values.email.trim());
    fd.append("subject", `[Hub AMC] [${kindLabel}] ${values.title.trim()}`);
    fd.append("message", messageBody);

    const result = await submitWeb3Form(fd);

    if (result.ok) {
      toast.success("Chamado enviado. Obrigado!");
      form.reset({ systemId: "", kind: "feedback", title: "", description: "", email: "" });
      setFileInputKey((k) => k + 1);
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
            "group fixed bottom-6 left-8 z-40 flex min-h-[4.25rem] min-w-[4.75rem] flex-col items-center justify-center gap-1",
            "rounded-2xl px-3 py-2.5",
            "bg-[#023164] text-white",
            "shadow-[0_6px_20px_-4px_rgba(2,49,100,0.42)] ring-1 ring-inset ring-white/10",
            "transition-[color,background-color,box-shadow,transform] duration-200 ease-out",
            "hover:bg-[#021c48] hover:text-red-500 hover:shadow-[0_10px_28px_-6px_rgba(2,49,100,0.55)] hover:ring-red-500/20",
            "active:scale-[0.97]",
            "motion-reduce:transition-colors motion-reduce:hover:shadow-[0_6px_20px_-4px_rgba(2,49,100,0.42)] motion-reduce:active:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023164] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
            "md:left-12 lg:bottom-10 lg:left-20",
          )}
          aria-label="Abrir suporte — chamado ou feedback"
        >
          <Headset
            className="h-6 w-6 shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
            strokeWidth={2}
            aria-hidden
          />
          <span
            className={cn(
              "max-h-4 overflow-hidden text-center text-[0.625rem] font-bold uppercase leading-none tracking-[0.2em]",
              "text-white transition-[opacity,max-height,transform] duration-300 ease-in-out",
              "group-hover:pointer-events-none group-hover:text-red-500 group-hover:max-h-0 group-hover:-translate-y-0.5 group-hover:opacity-0",
              "motion-reduce:transition-none motion-reduce:group-hover:text-white motion-reduce:group-hover:max-h-4 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:opacity-100",
            )}
          >
            SUPORTE
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chamado ou feedback</DialogTitle>
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
              placeholder="Explique com suas palavras: o que você estava fazendo, o que apareceu na tela (cores, mensagens, botões) e, se lembrar, quando isso ocorreu. Se puder, descreva como se estivesse mostrando a tela para alguém ao telefone."
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
            <span className="text-sm font-medium leading-none">Imagem da tela (opcional)</span>
            <Controller
              key={fileInputKey}
              control={form.control}
              name="attachment"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Input
                    id="fb-file"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      onChange(e.target.files ?? undefined);
                    }}
                  />
                  <label
                    htmlFor="fb-file"
                    className={cn(
                      "inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background",
                      "hover:bg-accent hover:text-accent-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                      !imgbbKey?.trim() && "pointer-events-none opacity-50",
                    )}
                  >
                    Selecionar imagem no computador
                  </label>
                  <span className="truncate text-sm text-muted-foreground" title={attachmentLabel}>
                    {!imgbbKey?.trim() ? "Upload não configurado (admin)" : attachmentLabel}
                  </span>
                </div>
              )}
            />
            {form.formState.errors.attachment && (
              <p className="text-sm text-destructive">{form.formState.errors.attachment.message}</p>
            )}
            {!imgbbKey?.trim() && (
              <p className="text-xs text-muted-foreground">
                Para anexar imagens, é necessário configurar a chave da API ImgBB (variável VITE_IMGBB_API_KEY).
              </p>
            )}
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
