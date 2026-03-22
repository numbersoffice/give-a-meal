"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export async function updateProfileName(formData: FormData) {
  const payload = await getPayload({ config });

  // Verify the donor's identity from the JWT cookie
  const hdrs = await headers();
  const result = await payload.auth({ headers: hdrs });

  if (!result.user) throw new Error("Not authorized");

  const rawFormData = {
    name: formData.get("profileName"),
    donorId: result.user.id,
    lang: formData.get("lang"),
    formName: formData.get("formName"),
  };

  // Check if form data is valid
  if (
    typeof rawFormData.name !== "string" ||
    rawFormData.name.length > 24 ||
    !rawFormData.lang ||
    !rawFormData.formName
  ) {
    throw new Error("Invalid form data");
  }

  await payload.update({
    collection: "donors",
    id: rawFormData.donorId,
    data: { firstName: rawFormData.name },
  });

  revalidatePath(`/[lang]/donors/profile`, "layout");
  revalidatePath(`/[lang]`);
  redirect(
    `/${rawFormData.lang}/donors/profile/general?success-form-name=${rawFormData.formName}`
  );
}
