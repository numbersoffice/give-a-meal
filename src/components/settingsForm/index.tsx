"use client";

import s from "./styles.module.css";
import { useFormStatus } from "react-dom";
import Button from "../button";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 *
 * @param {React.ReactNode} children Elements to be displayed in the form
 * @param {React.ReactNode} subText Text to be displayed below the form
 * @param {(formData: FormData) => Promise<void>} action Function to be called when the form is submitted
 * @param {string} buttonText Text to be displayed on the submit button
 * @param {string} successText Text to be displayed when the form is successfully submitted
 * @param {string} name Required to show success toast
 * @returns A form component with a submit button
 */
export default function SettingsForm({
  children,
  subText,
  action,
  buttonText = "Save",
  successText,
  formName,
}: {
  children: React.ReactNode;
  subText?: React.ReactNode;
  action?: (formData: FormData) => Promise<void>;
  buttonText?: string;
  successText?: string;
  formName?: string;
}) {
  return (
    <form action={action} className={s.container}>
      <div className={s.content}>
        {children}
        <input name="formName" defaultValue={formName} hidden />
      </div>
      <div className={s.actionBar}>
        <p>{subText}</p>
        {action && (
          <FormSubmitButton formName={formName} successText={successText}>
            {buttonText}
          </FormSubmitButton>
        )}
      </div>
    </form>
  );
}

export function SettingsFormGapContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={s.gapContainer}>{children}</div>;
}

function FormSubmitButton({
  children,
  successText,
  formName,
}: {
  children: React.ReactNode;
  successText?: string;
  formName?: string;
}) {
  const { pending } = useFormStatus();
  const searchParams = useSearchParams();

  // Show success toast
  useEffect(() => {
    if (successText) {
      // Check "success-form-name" query params to see if it matches the form name
      const formQuery = searchParams.get("success-form-name");

      // Show success toast if query param is present
      if (formQuery === formName) toast.success(successText);

      // Remove query param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, formName, successText]);

  return (
    <Button isLoading={pending} aria-disabled={pending}>
      {children}
    </Button>
  );
}
