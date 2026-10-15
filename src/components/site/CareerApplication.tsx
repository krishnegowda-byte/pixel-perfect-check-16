import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { careerApplicationSchema, careerEmailUrl } from "@/lib/careers";
import { company } from "@/lib/site";

export function CareerApplication({ position }: { position: string }) {
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailUrl, setEmailUrl] = useState("");
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = careerApplicationSchema.safeParse({ ...values, consent, experience: values.experience === "" ? -1 : values.experience });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setEmailUrl("");
      return;
    }
    setErrors({});
    setEmailUrl(careerEmailUrl(company.email, parsed.data));
  }
  const error = (name: string) => errors[name] ? <p id={`${name}-error`} className="mt-1 text-sm text-destructive">{errors[name]}</p> : null;
  const field = (name: string, label: string, type = "text", maxLength = 200) => (
    <div>
      <Label htmlFor={name}>{label} <span aria-hidden className="text-primary">*</span></Label>
      <Input id={name} name={name} type={type} maxLength={maxLength} required className="mt-2" aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} autoComplete={name === "fullName" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : undefined} />
      {error(name)}
    </div>
  );
  return (
    <form noValidate onSubmit={prepare} onChange={() => setEmailUrl("")} className="mt-8" aria-label="Careers application">
      <div className="grid gap-6 sm:grid-cols-2">
        {field("fullName", "Full name", "text", 120)}
        {field("email", "Email address", "email")}
        {field("phone", "Phone number", "tel", 30)}
        <div>
          <Label htmlFor="experience">Years of experience <span aria-hidden className="text-primary">*</span></Label>
          <Input id="experience" name="experience" type="number" min={0} max={60} step={0.5} required className="mt-2" aria-invalid={Boolean(errors.experience)} aria-describedby={errors.experience ? "experience-error" : undefined} />
          {error("experience")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="position">Position applied for <span aria-hidden className="text-primary">*</span></Label>
          <Input key={position} id="position" name="position" defaultValue={position} maxLength={200} required className="mt-2" aria-invalid={Boolean(errors.position)} aria-describedby={errors.position ? "position-error" : undefined} />
          {error("position")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="skills">Relevant skills <span aria-hidden className="text-primary">*</span></Label>
          <Textarea id="skills" name="skills" maxLength={1000} required placeholder="PLC programming, HMI development, commissioning…" className="mt-2" aria-invalid={Boolean(errors.skills)} aria-describedby={errors.skills ? "skills-error" : undefined} />
          {error("skills")}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="message">Cover letter or message <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Textarea id="message" name="message" maxLength={2000} rows={4} className="mt-2" />
        </div>
      </div>
      <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground"><Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />Attach your résumé in your email before sending. No files are uploaded to this website.</p>
      <div className="mt-6 flex items-start gap-3">
        <Checkbox id="consent" checked={consent} onCheckedChange={(value) => { setConsent(value === true); setEmailUrl(""); }} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} />
        <Label htmlFor="consent" className="text-sm font-normal leading-relaxed">I consent to DICS processing my details and résumé for recruitment. <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link></Label>
      </div>
      {error("consent")}
      <Button type="submit" size="lg" className="mt-6"><Mail aria-hidden /> Prepare application email</Button>
      {emailUrl && <div role="status" className="mt-5 border-l-2 border-primary bg-tech p-5">
        <p className="text-sm">Your email is ready to open, but your application has not been sent. Attach your résumé and send it from your email app.</p>
        <Button asChild className="mt-4"><a href={emailUrl}><Mail aria-hidden /> Open email application</a></Button>
      </div>}
      <p className="mt-4 text-sm text-muted-foreground">Prefer to email directly? Send your details and résumé to <a href={`mailto:${company.email}?subject=Career%20Application`} className="break-all font-medium text-primary underline">{company.email}</a>, our head-office contact.</p>
    </form>
  );
}