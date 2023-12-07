import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { encode } from "base64-arraybuffer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://www.30secondsofcode.org/js/s/format-duration/
export const formatDuration = (ms: number, short = false) => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    // millisecond: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(
      ([key, val]) =>
        `${val}${!short ? " " : ""}${short ? key.substring(0, 1) : key}${
          val !== 1 && !short ? "s" : ""
        }`
    )
    .join(short ? " " : ", ");
};

export const linkFull = (protocol: string, fqdn: string, port: number) =>
  `${protocol}://${fqdn}:${port}`;

export const linkDisplay = (protocol: string, fqdn: string, port: number) => {
  if (protocol === "https" && port === 443) return fqdn;
  if (protocol === "http" && port === 80) return `http://${fqdn}`;
  return linkFull(protocol, fqdn, port);
};

export const base64ToBase64url = (base64: string) => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");
};

export const arrayBufferToBase64Url = (arrayBuffer: ArrayBuffer) => {
  const base64 = encode(arrayBuffer);
  return base64ToBase64url(base64);
};

export const fromAsyncGenerator = async <T>(
  source: Iterable<T> | AsyncIterable<T>
): Promise<T[]> => {
  const items: T[] = [];
  for await (const item of source) {
    items.push(item);
  }
  return items;
};
