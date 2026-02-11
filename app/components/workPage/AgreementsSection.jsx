"use client";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";

export default function AgreementsSection({ form, updateField }) {
  return (
    <SectionWrapper
      number="07"
      icon="✅"
      iconColor="green"
      title="Agreements"
      description="Final confirmations before submitting"
      delay="0.4s"
    >
      {/* Rights Confirmation */}
      <div className={s.agreementBox}>
        <input
          className={s.checkbox}
          type="checkbox"
          id="rightsConfirmed"
          checked={form.rightsConfirmed}
          onChange={(e) => updateField("rightsConfirmed", e.target.checked)}
        />
        <label htmlFor="rightsConfirmed" className={s.agreementText}>
          I confirm I am the author, co-author, or authorized representative and
          hold the rights to publish this work on mebookmeta. I have not
          infringed upon any third-party copyright or intellectual property
          rights. <span className={s.req}>*</span>
        </label>
      </div>

      {/* Terms Accepted */}
      <div className={s.agreementBox}>
        <input
          className={s.checkbox}
          type="checkbox"
          id="termsAccepted"
          checked={form.termsAccepted}
          onChange={(e) => updateField("termsAccepted", e.target.checked)}
        />
        <label htmlFor="termsAccepted" className={s.agreementText}>
          I agree to mebookmeta&apos;s <a href="/terms">Terms of Service</a>,{" "}
          <a href="/publisher-agreement">Publisher Agreement</a>, and{" "}
          <a href="/content-guidelines">Content Guidelines</a>. My submission
          will be reviewed before publication. <span className={s.req}>*</span>
        </label>
      </div>

      {/* Email Opt-in */}
      <div className={s.agreementBox}>
        <input
          className={s.checkbox}
          type="checkbox"
          id="emailOptIn"
          checked={form.emailOptIn}
          onChange={(e) => updateField("emailOptIn", e.target.checked)}
        />
        <label htmlFor="emailOptIn" className={s.agreementText}>
          I&apos;d like to receive updates on book performance, reader reviews,
          and promotional opportunities.{" "}
          <span className={s.opt}>(optional)</span>
        </label>
      </div>
    </SectionWrapper>
  );
}
