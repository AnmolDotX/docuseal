import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use gemini-2.5-flash — the latest stable and fast model for generation
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Document type → prompt builder ─────────────────────────────

function buildPrompt(documentType: string, answers: Record<string, string>): string {
  const base = `You are a professional legal document drafter. Generate a complete, professional legal document based on the details provided. Use clear headings, numbered sections, and professional legal language. Do not add any commentary or explanation — output only the document text itself.`;

  const prompts: Record<string, string> = {
    PRIVACY_POLICY: `${base}

Generate a comprehensive Privacy Policy for the following:
- Business Name: ${answers.businessName}
- Website/App URL: ${answers.websiteUrl}
- Business Type: ${answers.businessType}
- Primary Jurisdiction: ${answers.jurisdiction}
- Data Collected: ${answers.dataCollected || "standard analytics and contact data"}
- Third-party Services: ${answers.thirdParties || "standard analytics tools"}
- Privacy Contact Email: ${answers.contactEmail}

Include sections for: Information We Collect, How We Use Your Information, Cookies & Tracking, Third-Party Services, Data Retention, Your Rights (including GDPR and CCPA rights), Security, Children's Privacy, Changes to This Policy, and Contact Information.`,

    TERMS_OF_SERVICE: `${base}

Generate a comprehensive Terms of Service agreement for the following:
- Business/App Name: ${answers.businessName}
- Website URL: ${answers.websiteUrl}
- Service Description: ${answers.serviceDescription}
- Governing Law: ${answers.jurisdiction}
- Payment Model: ${answers.paymentTerms || "freemium SaaS"}
- Legal Contact Email: ${answers.contactEmail}

Include sections for: Acceptance of Terms, Description of Service, User Accounts, Acceptable Use, Intellectual Property, Disclaimers, Limitation of Liability, Indemnification, Termination, Governing Law, and Contact.`,

    NDA: `${base}

Generate a legally binding Non-Disclosure Agreement (NDA):
- Disclosing Party: ${answers.disclosingParty}
- Receiving Party: ${answers.receivingParty}
- Purpose: ${answers.purpose}
- Confidential Information Includes: ${answers.confidentialInfo || "all shared business information"}
- Agreement Duration: ${answers.duration || "2 years"}
- Governing Jurisdiction: ${answers.jurisdiction || "United States"}

Include sections for: Definition of Confidential Information, Obligations, Exclusions, Term and Termination, Return of Information, Remedies, Governing Law, and Signature Blocks.`,

    CLIENT_CONTRACT: `${base}

Generate a professional Client Service Agreement:
- Service Provider: ${answers.providerName}
- Client: ${answers.clientName}
- Services to be Delivered: ${answers.services}
- Payment Terms: ${answers.payment}
- Project Timeline: ${answers.timeline || "as agreed"}
- Governing Law: ${answers.jurisdiction || "United States"}

Include sections for: Scope of Work, Deliverables, Payment Schedule, Revisions Policy, Intellectual Property Ownership, Confidentiality, Warranties, Limitation of Liability, Termination, and Signatures.`,

    FREELANCER_AGREEMENT: `${base}

Generate an Independent Contractor Agreement:
- Client/Company: ${answers.clientName}
- Freelancer/Contractor: ${answers.freelancerName}
- Project/Services: ${answers.projectDescription}
- Compensation: ${answers.rate}
- Payment Schedule: ${answers.paymentSchedule || "50% upfront, 50% on completion"}
- Governing Law: ${answers.jurisdiction || "United States"}

Include sections for: Independent Contractor Status, Services & Deliverables, Compensation, IP Assignment, Confidentiality, Non-Solicitation, Warranties, Termination, and Governing Law.`,

    COOKIE_POLICY: `${base}

Generate a GDPR-compliant Cookie Policy:
- Business Name: ${answers.businessName}
- Website URL: ${answers.websiteUrl}
- Cookies Used: ${answers.cookiesUsed || "analytics and functional cookies"}
- Third-party Services: ${answers.thirdParties || "Google Analytics"}
- Primary Audience/Jurisdiction: ${answers.jurisdiction || "European Union (GDPR)"}
- Contact Email: ${answers.contactEmail || "privacy@website.com"}

Include sections for: What Are Cookies, Types of Cookies We Use (with a table), How to Control Cookies, Third-Party Cookies, Updates to This Policy, and Contact.`,

    EMPLOYMENT_CONTRACT: `${base}

Generate a professional Employment Contract:
- Employer: ${answers.employerName}
- Employee: ${answers.employeeName}
- Position/Title: ${answers.position}
- Start Date: ${answers.startDate || "as agreed"}
- Compensation: ${answers.salary}
- Work Location: ${answers.workLocation || "as agreed"}
- Governing Law: ${answers.jurisdiction || "United States"}

Include sections for: Position & Duties, Start Date & Hours, Compensation & Benefits, At-Will Employment, Confidentiality, Non-Compete (if applicable), Intellectual Property, Termination Procedures, Dispute Resolution, and Governing Law.`,

    REFUND_POLICY: `${base}

Generate a clear Refund and Return Policy:
- Business Name: ${answers.businessName}
- Product/Service Type: ${answers.productType}
- Refund Window: ${answers.refundWindow || "30 days"}
- Conditions for Refund: ${answers.conditions || "standard conditions"}
- Support/Contact Email: ${answers.contactEmail}

Include sections for: Eligibility for Refunds, How to Request a Refund, Processing Timeline, Non-Refundable Items, Exchanges, and Contact Information.`,
  };

  return prompts[documentType] ?? `${base}\n\nGenerate a professional ${documentType.replace(/_/g, " ").toLowerCase()} document with the following details:\n${JSON.stringify(answers, null, 2)}`;
}

// ─── Main export ─────────────────────────────────────────────────

export async function generateDocument(
  documentType: string,
  answers: Record<string, string>
): Promise<string> {
  const prompt = buildPrompt(documentType, answers);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) throw new Error("Empty response from Gemini");

  return text;
}
