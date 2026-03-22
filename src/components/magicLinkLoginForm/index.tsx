"use client"

import Link from "next/link";
import Button from "../button";
import TextInput from "../textInput";
import s from "./styles.module.css"
import { useEffect, useState } from "react";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary-client";
import fillTemplate from "@/utils/fillTemplate";

export default function MagicLinkLoginForm({ title,
    emailLabel,
    buttonLabel,
    termsLabel,
    privacyLabel,
    termsLink,
    privacyLink,
    lang,
    defaultEmail
}: {
    title: string,
    emailLabel: string,
    buttonLabel: string,
    termsLabel: string,
    privacyLabel: string,
    termsLink: string,
    privacyLink: string,
    lang: Locale,
    defaultEmail?: string | null
}) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [dict, setDict] = useState<any>(null)


    useEffect(() => {
        getDictionary(lang).then((res) => setDict(res))
    }, [lang])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const email = (e.target as HTMLFormElement).email.value;

        try {
            const res = await fetch("/api/donors/magic-link/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, lang }),
            });

            if (res.ok) {
                setEmail(email);
                setSuccess(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (success) return (
        <p className={`body ${s.textContainer}`} dangerouslySetInnerHTML={{ __html: fillTemplate(dict.pages.donors.login.form.successMessage, email) }}></p>
    )
    else return (
        <form className={s.form} onSubmit={handleSubmit} method='POST'>
            <h3>{title}</h3>
            <TextInput defaultValue={defaultEmail || undefined} name="email" label={emailLabel} type="email" />
            <Button large>{buttonLabel}</Button>
            <div className={s.linkContainer}>
                <Link href={termsLink} className="label">{termsLabel}</Link>
                <span className="label">·</span>
                <Link href={privacyLink} className="label">{privacyLabel}</Link>
            </div>
        </form>
    )



}
