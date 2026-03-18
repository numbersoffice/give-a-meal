import SettingsForm, {
  SettingsFormGapContainer,
} from "@/components/settingsForm";
import TextInput from "@/components/textInput";
import { supabaseService } from "@/lib/supabase";
import s from "./styles.module.css";
import { updateProfileName } from "@/lib/actions";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary-server";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ lang: Locale }>;
}) {
  const sp = await searchParams;
  const { lang } = await params;
  const {
    elements: { buttons },
    pages: {
      donors: {
        profile: {
          sections: { displayName, email },
        },
      },
    },
  } = await getDictionary(lang);

  const userId: string = sp?.uid || "";
  const userEmail: string = sp?.email || "";

  // Get donations by donor id
  let dbResponse;
  dbResponse = await supabaseService
    .from("profiles")
    .select("first_name, email, auth_id")
    .eq("auth_id", userId)
    .single();

  // If data but no auth connection
  if (dbResponse.data && !dbResponse.data.auth_id) {
    dbResponse = await supabaseService
      .from("profiles")
      .update([{ auth_id: userId }])
      .eq("email", userEmail);
  }

  // If no data, insert a new profile
  if (!dbResponse.data) {
    dbResponse = await supabaseService
      .from("profiles")
      .upsert([{ auth_id: userId, email: userEmail }])
      .eq("email", userEmail);
  }

  if (dbResponse.error) throw new Error("Error getting user data");

  function EmailActionText() {
    return (
      <span className={s.actionText}>
        {email.subText}{" "}
        <a className={s.link} href="mailto:max@give-a-meal.org">
          max@give-a-meal.org
        </a>
      </span>
    );
  }

  return (
    <div className={s.container}>
      <SettingsForm
        buttonText={buttons.save}
        successText={displayName.toasts.updateSuccess}
        formName="displayName"
        action={updateProfileName}
      >
        <SettingsFormGapContainer>
          <p className="body_l_bold">{displayName.title}</p>
          <p>{displayName.description}</p>
          <TextInput
            placeholder={displayName.placeholder}
            maxLength={24}
            defaultValue={dbResponse?.data?.first_name || ""}
            small
            name="profileName"
            className={s.textInput}
          />
        </SettingsFormGapContainer>
        <TextInput hidden defaultValue={lang} name="lang" />
      </SettingsForm>
      <SettingsForm subText={<EmailActionText />}>
        <SettingsFormGapContainer>
          <p className="body_l_bold">{email.title}</p>
          <p>{email.description}</p>
          <TextInput
            disabled
            defaultValue={dbResponse?.data?.email}
            small
            className={s.textInput}
          />
        </SettingsFormGapContainer>
      </SettingsForm>
    </div>
  );
}
