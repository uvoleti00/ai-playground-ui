
export async function streamModelReply(
    model: string,
    prompt: string,
    onMessage: (id: string, chunk: string, isDone?: boolean) => void,
    token: string
){
    const aiId = `${model}-${Date.now()}`;
  onMessage(aiId, "", false); // init empty message

  try {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || "";
    const endpoint = process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT || "";
    
    
    const res = await fetch(`${apiHost}${endpoint}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
        },
      body: JSON.stringify({ model, prompt }),
    });

    if (!res.ok) {
      onMessage(aiId, `API error ${res.status}`, true);
      return;
    }

    if (!res.body) {
      const data = await res.json().catch(() => null);
      const reply = typeof data === "string" ? data : data?.reply ?? "No reply";
      onMessage(aiId, reply, true);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const result = await reader.read();
      done = !!result.done;
      if (result.value) {
        const chunk = decoder.decode(result.value, { stream: true });
        onMessage(aiId, chunk);
      }
    }
    onMessage(aiId, "", true);
  } catch (err) {
    onMessage(aiId, `Error: ${(err as Error).message}`, true);
  }
}