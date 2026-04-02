import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Get the authenticated donor from the Payload JWT cookie.
 * Redirects to the donor login page if not authenticated.
 */
export async function getDonor(lang: string = "en") {
  const payload = await getPayload({ config });
  const hdrs = await headers();
  const result = await payload.auth({ headers: hdrs });

  if (!result.user || result.user.collection !== "donors") {
    redirect(`/${lang}/donors/login`);
  }

  return result.user;
}
