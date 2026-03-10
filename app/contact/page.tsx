import { Mail, Globe, ArrowUpRight } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const contacts = [
  {
    icon: <Mail className="size-4.5" />,
    label: "Email",
    value: "jordan@jtlee.dev",
    href: "mailto:jordan@jtlee.dev",
  },
  {
    icon: <FontAwesomeIcon icon={faXTwitter} className="size-4.5" />,
    label: "Twitter / X",
    value: "@jtljrdn",
    href: "https://x.com/jtljrdn",
  },
  {
    icon: <Globe className="size-4.5" />,
    label: "Website",
    value: "jtlee.dev",
    href: "https://jtlee.dev",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col justify-center px-4 py-12">
      <div className="relative mb-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="size-4.5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Get in Touch</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Have a question, suggestion, or just want to say hi? Reach out
            through any of the channels below.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <Link
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={contact.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {contact.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{contact.label}</p>
              <p className="text-sm text-muted-foreground">{contact.value}</p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
