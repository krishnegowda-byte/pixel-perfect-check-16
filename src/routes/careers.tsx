import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionHeading } from "@/components/site/Blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: seo(
      "Careers at DICS Global",
      "Explore engineering and technical support careers at Digital Instruments & Control Systems."
    ),
  }),
  component: Careers,
});

const jobs = [
  {
    title: "PLC Programmer / Application Engineer / Technical Support Engineer",
    experience: "1–5 years",
    education:
      "Diploma or B.E. in Electrical & Electronics, Electronics & Communication, or a related field.",
    locations:
      "Bangalore, Coimbatore, Chennai, Mumbai, Hyderabad, Pune and Noida",
    industry: "Industrial Automation",
  },
];

function Careers() {
  return (
    <>
      <PageHeader
        title="Build Your Career with DICS"
        eyebrow="Careers"
        crumbs={[{ label: "Careers" }]}
        intro="Join a team delivering industrial automation products, engineering expertise and innovative solutions to industries across India."
      />

      <section className="container-site grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Work with us"
            title="Be part of industrial innovation"
          />
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Established in Bangalore in 1996, Digital Instruments & Control
            Systems works with leading automation technologies to help
            industries improve productivity, reliability and performance.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            At DICS, you can develop your technical skills, work on practical
            engineering challenges and contribute to automation projects
            across multiple industries.
          </p>
        </div>

        <div className="rounded-lg bg-tech p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why join DICS?
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-foreground">
            <li>✓ Work with industrial automation technologies</li>
            <li>✓ Develop application and troubleshooting skills</li>
            <li>✓ Support customers across different industries</li>
            <li>✓ Grow with an experienced engineering team</li>
          </ul>
        </div>
      </section>

      <section className="bg-tech py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="Opportunities"
            title="Current opening"
          />

          {jobs.map((job) => (
            <article
              key={job.title}
              className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card md:p-9"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-tech px-3 py-1 text-xs font-semibold text-primary">
                  {job.industry}
                </span>
                <span className="text-sm text-muted-foreground">
                  Experience: {job.experience}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold text-foreground">
                {job.title}
              </h3>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-foreground">Education</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {job.education}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">
                    Job locations
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {job.locations}
                  </p>
                </div>
              </div>

              <a
                href="mailto:bangalore@dicsglobal.com?subject=Career%20Application%20-%20DICS"
                className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply by Email →
              </a>

              <p className="mt-3 text-xs text-muted-foreground">
                Please include your résumé and the position you are applying
                for in your email.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-site py-16">
        <div className="rounded-lg bg-navy-gradient p-8 text-navy-foreground md:p-12">
          <h2 className="text-2xl font-bold">
            Interested in joining our team?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-navy-muted">
            Send us your résumé and tell us how your experience and technical
            skills could contribute to DICS.
          </p>
          <a
            href="mailto:bangalore@dicsglobal.com?subject=Career%20Enquiry%20-%20DICS"
            className="mt-6 inline-flex rounded-md bg-card px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-tech"
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </>
  );
}
