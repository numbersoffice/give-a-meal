import SettingsForm, {
  SettingsFormGapContainer,
} from "@/components/settingsForm";
import TextInput from "@/components/textInput";
import s from "./styles.module.css";
import { updateProfileName } from "@/lib/actions";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary-server";
import { getDonor } from "@/lib/auth/getDonor";

export default async function Page({
  params,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
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

  const donor = await getDonor(lang);

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
            defaultValue={donor.firstName || ""}
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
            defaultValue={donor.email || ""}
            small
            className={s.textInput}
          />
        </SettingsFormGapContainer>
      </SettingsForm>
    </div>
  );
}
