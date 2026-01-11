import * as functions from "firebase-functions";
import { Readable } from "node:stream";

const backendBaseUrl =
  process.env.BACKEND_BASE_URL ||
  (functions.config()?.backend?.base_url as string | undefined);

const stripHopByHopHeaders = new Set([
  "host",
  "origin",
  "referer",
  "connection",
  "content-length",
  "accept-encoding",
]);

const splitSetCookie = (headerValue: string) =>
  headerValue.split(/,(?=[^;]+=[^;]+)/g).map((cookie) => cookie.trim());

const normalizeSetCookie = (cookie: string) => {
  let normalized = cookie.replace(/;\s*Domain=[^;]+/i, "");
  if (!/;\s*SameSite=/i.test(normalized)) {
    normalized = `${normalized}; SameSite=Lax`;
  }
  return normalized;
};

const getSetCookieHeaders = (headers: Headers) => {
  const typedHeaders = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof typedHeaders.getSetCookie === "function") {
    return typedHeaders.getSetCookie();
  }

  const setCookie = headers.get("set-cookie");
  return setCookie ? splitSetCookie(setCookie) : [];
};

export const proxy = functions.https.onRequest(async (req, res) => {
  if (!backendBaseUrl) {
    res.status(500).send("BACKEND_BASE_URL is not configured.");
    return;
  }

  const targetUrl = new URL(req.originalUrl, backendBaseUrl).toString();

  const forwardedHeaders = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (stripHopByHopHeaders.has(key.toLowerCase()) || value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      forwardedHeaders.set(key, value.join(","));
    } else {
      forwardedHeaders.set(key, value);
    }
  });

  const controller = new AbortController();
  req.on("close", () => controller.abort());

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : req.rawBody;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: forwardedHeaders,
    body,
    signal: controller.signal,
    redirect: "manual",
  });

  const setCookies = getSetCookieHeaders(response.headers).map(normalizeSetCookie);

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      return;
    }
    if (key.toLowerCase() === "content-length") {
      return;
    }
    if (key.toLowerCase() === "content-encoding") {
      return;
    }
    res.setHeader(key, value);
  });

  if (setCookies.length > 0) {
    res.setHeader("set-cookie", setCookies);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/event-stream") && response.body) {
    res.status(response.status);
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    // @ts-ignore
    if (typeof res.flushHeaders === "function") res.flushHeaders();

    const nodeStream = Readable.fromWeb(response.body as any);
    nodeStream.on("error", () => res.end());
    nodeStream.pipe(res);
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  res.status(response.status).send(Buffer.from(arrayBuffer));
});
