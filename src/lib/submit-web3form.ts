const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export type Web3FormsResult =
  | { ok: true; message: string }
  | { ok: false; message: string; status: number };

export async function submitWeb3Form(formData: FormData): Promise<Web3FormsResult> {
  const response = await fetch(WEB3FORMS_URL, {
    method: "POST",
    body: formData,
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      status: response.status,
      message: "Resposta inválida do servidor. Tente novamente.",
    };
  }

  const parsed = body as { success?: boolean; message?: string; body?: { message?: string } };
  const message =
    typeof parsed.message === "string"
      ? parsed.message
      : typeof parsed.body?.message === "string"
        ? parsed.body.message
        : response.ok
          ? "Enviado."
          : "Não foi possível enviar.";

  if (response.ok && parsed.success === true) {
    return { ok: true, message };
  }

  return { ok: false, status: response.status, message };
}
