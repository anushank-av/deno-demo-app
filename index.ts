import { serve } from "https://deno.land/std/http/server.ts";

const s = serve({ port: 8000 });
console.log("localhost:8000");
for await (const req of s) {
  console.info("Request received");
  req.respond({ body: "Hello World" });
}
