import { useState } from "react";

/* ═══════════════════════════════════════════
   AMBER — Research-through-design prototype
   Re:Form Assessment 2 · LIS MASc 2024/26
   ═══════════════════════════════════════════ */

// ── Design Tokens ──
const C = {
  bg: "#FDFAF5",
  surface: "#FFFFFF",
  surfaceWarm: "#FAF7F2",
  border: "#E8E3DB",
  borderLight: "#F0ECE5",
  text: "#2A2520",
  textSecondary: "#6B6560",
  textMuted: "#A9A29A",
  amber: "#B8923E",
  amberLight: "#F3ECDD",
  amberBorder: "#DDD2BA",
  amberDark: "#8A6D2F",
  cream: "#FFF9F0",
};

const font = {
  serif: "'Cormorant Garamond', serif",
  sans: "'Libre Franklin', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// ── Screen IDs ──
const S = {
  OVERVIEW: 0, INVITE: 1, ABOUT: 12, APPLY: 2, ELICIT_INTRO: 3, ELICIT_CHAT: 4,
  UNDERSTOOD: 5, MATCH: 6, CONSENT: 7, HANDOFF: 8,
  OUTCOME: 9, GOVERNANCE: 10, TRENDS: 11,
};

const SCREEN_META = [
  { id: S.OVERVIEW, label: "Overview", short: "—" },
  { id: S.INVITE, label: "Invitation", short: "A" },
  { id: S.ABOUT, label: "About Amber", short: "B" },
  { id: S.APPLY, label: "Apply to Join", short: "C" },
  { id: S.ELICIT_INTRO, label: "Elicitation Intro", short: "D" },
  { id: S.ELICIT_CHAT, label: "Elicitation", short: "E" },
  { id: S.UNDERSTOOD, label: "Understanding", short: "F" },
  { id: S.MATCH, label: "Match Rationale", short: "G" },
  { id: S.CONSENT, label: "Consent", short: "H" },
  { id: S.HANDOFF, label: "Introduction", short: "I" },
  { id: S.OUTCOME, label: "Outcome", short: "J" },
  { id: S.GOVERNANCE, label: "Governance", short: "K" },
  { id: S.TRENDS, label: "Community", short: "L" },
];

// ── Shared Components ──

const Phone = ({ children }) => (
  <div style={{
    width: 390, minHeight: 760, maxHeight: 760,
    borderRadius: 44, border: `2px solid ${C.border}`,
    background: C.bg, overflow: "hidden", position: "relative",
    boxShadow: "0 20px 60px rgba(42,37,32,0.08), 0 2px 8px rgba(42,37,32,0.04)",
    display: "flex", flexDirection: "column",
  }}>
    <div style={{
      height: 48, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 28px",
      fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font.sans,
    }}>
      <span>9:41</span>
      <div style={{ width: 126, height: 32, borderRadius: 16, background: C.text }} />
      <span style={{ fontSize: 11 }}>●●●</span>
    </div>
    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</div>
  </div>
);

const Notes = ({ items }) => (
  <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{
      fontFamily: font.mono, fontSize: 10, color: C.textMuted,
      textTransform: "uppercase", letterSpacing: "0.1em", paddingBottom: 8,
      borderBottom: `1px solid ${C.borderLight}`,
    }}>
      Design decisions
    </div>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{
          fontFamily: font.mono, fontSize: 10, color: C.amber,
          fontWeight: 600, flexShrink: 0, marginTop: 2,
        }}>{String(i + 1).padStart(2, "0")}</span>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
          lineHeight: 1.65, margin: 0,
        }}>{item}</p>
      </div>
    ))}
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
    textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14,
  }}>{children}</div>
);

const Btn = ({ children, variant = "primary", onClick, style = {} }) => {
  const base = {
    padding: "15px 24px", borderRadius: 10, fontSize: 13.5,
    fontWeight: 500, fontFamily: font.sans, cursor: "pointer",
    width: "100%", letterSpacing: "0.02em", transition: "all 0.2s",
    border: "none",
  };
  const variants = {
    primary: { background: C.text, color: C.bg },
    secondary: { background: "transparent", color: C.text, border: `1.5px solid ${C.border}` },
    amber: { background: C.amber, color: "#fff" },
    ghost: { background: "transparent", color: C.textMuted, border: "none" },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};

const Divider = () => (
  <div style={{ height: 1, background: C.borderLight, margin: "0" }} />
);

const AmberMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16.5" fill="none" stroke={C.amber} strokeWidth="1.5" />
    <circle cx="18" cy="18" r="6" fill={C.amber} opacity="0.15" />
    <circle cx="18" cy="18" r="2.5" fill={C.amber} />
  </svg>
);

const ScreenChip = ({ type }) => {
  const isSystem = type === "system";
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 99,
      fontFamily: font.mono, fontSize: 8.5, letterSpacing: "0.08em",
      textTransform: "uppercase",
      background: isSystem ? "#EDE9E3" : C.amberLight,
      color: isSystem ? C.textMuted : C.amberDark,
      border: `1px solid ${isSystem ? C.border : C.amberBorder}`,
      marginBottom: 16,
    }}>
      {isSystem ? "Prototype context" : "Member view"}
    </span>
  );
};

// ═══════════════════════════════════════════
// OVERVIEW — Research Context
// ═══════════════════════════════════════════

const OverviewScreen = ({ onNav }) => (
  <div style={{
    width: 390, minHeight: 760, maxHeight: 760,
    borderRadius: 44, border: `2px solid ${C.border}`,
    background: C.bg, overflow: "hidden", position: "relative",
    boxShadow: "0 20px 60px rgba(42,37,32,0.08), 0 2px 8px rgba(42,37,32,0.04)",
    display: "flex", flexDirection: "column",
  }}>
    <div style={{ flex: 1, overflowY: "auto", padding: "48px 32px 32px" }}>
      <ScreenChip type="system" />
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <AmberMark size={44} />
        <h2 style={{
          fontFamily: font.serif, fontSize: 32, fontWeight: 500,
          color: C.text, margin: "24px 0 12px", lineHeight: 1.15,
        }}>Connect with purpose.</h2>
        <p style={{
          fontFamily: font.sans, fontSize: 13.5, color: C.textSecondary,
          lineHeight: 1.7, margin: 0, maxWidth: 300, marginLeft: "auto", marginRight: "auto",
        }}>
          Fewer, better relationships — mediated with care.
        </p>
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "20px", marginBottom: 20,
      }}>
        <SectionLabel>This prototype traces one relational arc</SectionLabel>
        {[
          ["Context before contact", "Amber listens for timing, tension, and the kind of counterpart a member needs."],
          ["Explanation before introduction", "Suggested connections come with qualitative rationale, not opaque matching."],
          ["Consent before connection", "No member is surfaced without relevance, context, and double opt-in."],
        ].map(([title, desc], i) => (
          <div key={i} style={{
            padding: "12px 0",
            borderTop: `1px solid ${C.borderLight}`,
          }}>
            <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 3 }}>{title}</div>
            <div style={{ fontFamily: font.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.55 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 28, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.serif, fontSize: 14, color: C.amberDark,
          lineHeight: 1.65, margin: 0, fontStyle: "italic",
        }}>
          The question this prototype explores: can explanation carry the same trust-producing weight as discretion alone?
        </p>
      </div>

      <Btn onClick={() => onNav(S.INVITE)}>Enter prototype →</Btn>
    </div>
  </div>
);

const overviewNotes = [
  "This screen frames the prototype as a research artefact. It establishes the research question and the scope of the interaction before the viewer enters the flow.",
  "The broader research landscape was mapped in Framing and Cartography Assessment 1 across six interconnected zones. This prototype addresses one layer within that cartography: the design of relational infrastructure for trusted, purposeful connection.",
  "The prototype's structure is: one relational arc (invitation → elicitation → understanding → rationale → consent → introduction → outcome), deepened by a governance layer and made cumulatively visible through an anonymised community intelligence view.",
  "The research question responds directly to Re:Form Assessment 1's finding that legacy elite networks keep the mechanism of connection offstage. This prototype brings that mechanism onstage, but stages it with discretion, explanation, and consent.",
];

// ═══════════════════════════════════════════
// SCREEN A — Invitation
// ═══════════════════════════════════════════

const InviteScreen = ({ onNav }) => (
  <Phone>
    <div style={{ padding: "48px 32px 32px", textAlign: "center" }}>
      <ScreenChip type="member" />
      <AmberMark size={40} />
      <h1 style={{
        fontFamily: font.serif, fontSize: 30, fontWeight: 500,
        color: C.text, margin: "28px 0 10px", lineHeight: 1.15, fontStyle: "italic",
      }}>
        You've been invited
      </h1>
      <p style={{
        fontFamily: font.sans, fontSize: 13.5, color: C.textSecondary,
        margin: "0 0 40px", lineHeight: 1.7,
      }}>
        Amber is a private relational infrastructure for stewards of capital who want better connections at consequential moments.
      </p>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "22px 20px", textAlign: "left", marginBottom: 20,
      }}>
        <SectionLabel>Nominated by</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 99, background: C.amberLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: font.serif, fontSize: 17, fontWeight: 600, color: C.amberDark,
          }}>R</div>
          <div>
            <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 14, color: C.text }}>Rebecca Thornton</div>
            <div style={{ fontFamily: font.sans, fontSize: 12, color: C.textMuted }}>Family Office Principal</div>
          </div>
        </div>
        <p style={{
          fontFamily: font.serif, fontSize: 14, color: C.textSecondary,
          lineHeight: 1.6, margin: 0, fontStyle: "italic",
          borderLeft: `2px solid ${C.amberBorder}`, paddingLeft: 14,
        }}>
          "He brings a rare combination of seriousness and warmth to conversations about stewardship and purpose."
        </p>
      </div>

      <p style={{
        fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
        lineHeight: 1.7, margin: "0 0 28px", textAlign: "left",
      }}>
        Amber helps members find trusted, timely connections when the stakes are high — whether the question is about stewardship, succession, governance, identity, or responsibility.
      </p>

      <Btn onClick={() => onNav(S.ABOUT)}>Learn more about Amber</Btn>
      <div style={{ marginTop: 10 }}>
        <Btn variant="ghost">Not right now</Btn>
      </div>
    </div>
  </Phone>
);

const inviteNotes = [
  "The Invitation does persuasive work only. It welcomes, names the nominator, and describes Amber's purpose — but does not yet filter, verify, or explain the rules. Boundary-setting is staged across the next two screens.",
  "Selective belonging is performed in sequence: invitation (you are wanted), self-selection (this is what Amber is and isn't), and review (your role and commitment are assessed). This draws on earlier linguistic analysis (The Right Word Assessment 2) showing that elite organisations stage exclusion through invitation language, fit signals, and selective access rituals.",
  "The nomination card makes the referral visible and specific. The nominator is named, the basis is stated. This begins to bring the mechanism of connection onstage — but the tone remains warm and inviting, not evaluative.",
];

// ═══════════════════════════════════════════
// SCREEN B — About Amber
// ═══════════════════════════════════════════

const AboutScreen = ({ onNav }) => (
  <Phone>
    <div style={{ padding: "20px 32px 32px" }}>
      <button onClick={() => onNav(S.INVITE)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 16 }}>‹</span> Back
      </button>

      <ScreenChip type="member" />
      <h2 style={{
        fontFamily: font.serif, fontSize: 26, fontWeight: 500,
        color: C.text, margin: "0 0 10px", lineHeight: 1.2,
      }}>About Amber</h2>
      <p style={{
        fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
        margin: "0 0 28px", lineHeight: 1.7,
      }}>
        Amber is designed for people whose decisions carry weight — and for whom the right connection can change the quality of a question, a conversation, or a course of action.
      </p>

      {/* Who Amber is for */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "18px 20px", marginBottom: 14,
      }}>
        <SectionLabel>Who Amber is for</SectionLabel>
        <p style={{
          fontFamily: font.sans, fontSize: 13, color: C.text,
          lineHeight: 1.65, margin: 0,
        }}>
          Principals, next-generation wealth holders, family office decision-makers, and capital holders acting in their own right.
        </p>
      </div>

      {/* Who Amber is not for */}
      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "18px 20px", marginBottom: 18,
      }}>
        <SectionLabel>Who Amber is not for</SectionLabel>
        <p style={{
          fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
          lineHeight: 1.65, margin: 0,
        }}>
          Advisers, consultants, fundraisers, recruiters, service providers, or others seeking access to members without holding capital decision-making responsibility themselves.
        </p>
      </div>

      {/* What Amber is not */}
      <div style={{ marginBottom: 18 }}>
        {[
          "No feed. No directory. No noise.",
          "No browsing. Introductions arrive when relevant.",
          "Context before contact. Consent before connection.",
        ].map((t, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8,
          }}>
            <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }}>◆</span>
            <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 24, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.serif, fontSize: 14, color: C.amberDark,
          lineHeight: 1.65, margin: 0, fontStyle: "italic",
        }}>
          Amber is selective because the quality of the network depends on the quality of its membership.
        </p>
      </div>

      <Btn onClick={() => onNav(S.APPLY)}>Apply to join</Btn>
      <div style={{ marginTop: 10 }}>
        <Btn variant="ghost" onClick={() => onNav(S.INVITE)}>Back to invitation</Btn>
      </div>
    </div>
  </Phone>
);

const aboutNotes = [
  "This screen does the conceptual and boundary-setting work that the Invitation deliberately avoids. It explains who Amber is for, who it is not for, and why selectivity matters — making the boundary logic more explicit than most elite membership organisations.",
  "Earlier linguistic analysis of elite membership organisations (The Right Word Assessment 2) found that exclusion is often performed through invitation language, fit signals, and selective access rituals rather than blunt criteria. Amber makes that boundary logic visible and intentional: the excluded categories are named, not implied.",
  "The 'Who Amber is not for' section names specific excluded categories (advisers, consultants, fundraisers). This is necessary because many elite networks fail by admitting intermediaries. But the tone is matter-of-fact, not hostile — it states a structural boundary, not a social judgement.",
  "The selectivity line — 'the quality of the network depends on the quality of its membership' — states the principle plainly. Bourdieu's analysis of social capital reproduction informs the design: controlled access is made transparent rather than mystified.",
];

// ═══════════════════════════════════════════
// SCREEN C — Apply to Join
// ═══════════════════════════════════════════

const ApplyScreen = ({ onNav }) => (
  <Phone>
    <div style={{ padding: "20px 32px 32px" }}>
      <button onClick={() => onNav(S.ABOUT)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 16 }}>‹</span> Back
      </button>

      <h2 style={{
        fontFamily: font.serif, fontSize: 26, fontWeight: 500,
        color: C.text, margin: "0 0 8px", lineHeight: 1.2,
      }}>Apply to join</h2>
      <ScreenChip type="member" />
      <p style={{
        fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
        margin: "0 0 24px", lineHeight: 1.65,
      }}>
        Amber learns about you through conversation, not forms. But first, a few things that help confirm your fit.
      </p>

      {/* Role declaration */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "18px 20px", marginBottom: 16,
      }}>
        <SectionLabel>Your role</SectionLabel>
        {[
          "Family principal",
          "Next-generation wealth holder",
          "Family office decision-maker",
          "Foundation or asset-owning principal",
          "Other",
        ].map((role, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "9px 0",
            borderBottom: i < 4 ? `1px solid ${C.borderLight}` : "none",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 99,
              border: `1.5px solid ${i === 1 ? C.amber : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {i === 1 && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.amber }} />}
            </div>
            <span style={{
              fontFamily: font.sans, fontSize: 13,
              color: i === 1 ? C.text : C.textSecondary,
            }}>{role}</span>
          </div>
        ))}
      </div>

      {/* Applicant declaration */}
      <div style={{
        background: C.amberLight, border: `1px solid ${C.amberBorder}`,
        borderRadius: 10, padding: 14, marginBottom: 16,
      }}>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.amberDark,
          lineHeight: 1.6, margin: 0,
        }}>
          I am applying in my own capacity as a capital holder, principal, or next-generation family member — not as an external adviser or intermediary.
        </p>
      </div>

      {/* Conversational verification */}
      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 16,
      }}>
        <SectionLabel>How Amber learns more</SectionLabel>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
          lineHeight: 1.6, margin: "0 0 12px",
        }}>
          Once submitted, Amber will invite you to describe your context, your work, and your relationship to this community — by typing or speaking, whichever feels more natural.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {["Type", "Voice"].map((mode) => (
            <div key={mode} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, textAlign: "center",
              background: mode === "Type" ? C.text : C.surface,
              color: mode === "Type" ? C.bg : C.textSecondary,
              fontFamily: font.sans, fontSize: 11.5, fontWeight: 500,
              border: mode === "Voice" ? `1px solid ${C.border}` : "none",
            }}>{mode}</div>
          ))}
        </div>
      </div>

      {/* Member Code */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "18px 20px", marginBottom: 16,
      }}>
        <SectionLabel>Amber Member Code</SectionLabel>
        <p style={{
          fontFamily: font.sans, fontSize: 12, color: C.textSecondary,
          lineHeight: 1.55, margin: "0 0 12px",
        }}>
          To protect the quality of the network, members are expected to engage in good faith, with discretion, clarity, and respect.
        </p>
        {[
          "I will engage in good faith",
          "I will treat introductions with discretion",
          "I will respond with courtesy and clarity",
          "I will not use Amber for extraction, solicitation, or status performance",
        ].map((principle, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0",
            borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none",
          }}>
            <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }}>◆</span>
            <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>{principle}</span>
          </div>
        ))}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginTop: 14,
          padding: "12px 14px", borderRadius: 8,
          background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4,
            border: `1.5px solid ${C.amber}`, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 5.2L4.2 6.8L7.5 3.2" stroke={C.amber} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily: font.sans, fontSize: 12, color: C.text }}>
            I have read and agree to the Amber Member Code
          </span>
        </div>
      </div>

      {/* Human review */}
      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 24, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.sans, fontSize: 12, color: C.amberDark,
          lineHeight: 1.6, margin: 0,
        }}>
          Amber reviews each application to confirm role, fit, and context before membership is activated. This is not instant access — it is considered admission.
        </p>
      </div>

      <Btn onClick={() => onNav(S.ELICIT_INTRO)}>Submit application</Btn>
    </div>
  </Phone>
);

const applyNotes = [
  "This screen does the role, fit, and covenant work. The role declaration makes the applicant's position overt — sorting for principals and capital holders rather than intermediaries. The applicant declaration makes this commitment explicit and personal.",
  "Verification is conversational-first: Amber will learn about the applicant through conversation, not a checklist. A next-gen who does not yet hold a formal role can still describe their context. Supporting signals (professional profile, email, background review) are available but conditional.",
  "The human review note makes clear that membership is not automatic. 'This is not instant access — it is considered admission.' This names the human-in-the-loop step and signals that Amber's selectivity is real, not performative.",
  "The Member Code is framed as a covenant — 'I will' rather than 'do not' — though the final principle is a clear prohibition. It establishes behavioural norms before any introduction is made, shaping culture through commitment.",
];

// ═══════════════════════════════════════════
// SCREEN C — Elicitation Intro
// ═══════════════════════════════════════════

const ElicitIntroScreen = ({ onNav }) => (
  <Phone>
    <div style={{ padding: "20px 32px 32px" }}>
      <button onClick={() => onNav(S.APPLY)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 16 }}>‹</span> Back
      </button>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 99, margin: "0 auto 20px",
          background: `linear-gradient(160deg, ${C.cream} 0%, ${C.amberLight} 100%)`,
          border: `1px solid ${C.amberBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <AmberMark size={32} />
        </div>
        <h2 style={{
          fontFamily: font.serif, fontSize: 24, fontWeight: 500,
          color: C.text, margin: "0 0 10px", lineHeight: 1.25,
        }}>
          A conversation, not a form
        </h2>
        <p style={{
          fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
          margin: "0", lineHeight: 1.7, maxWidth: 280, marginLeft: "auto", marginRight: "auto",
        }}>
          Amber learns about you through guided conversation — closer to reflection than data collection.
        </p>
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "20px", marginBottom: 24,
      }}>
        <SectionLabel>What Amber listens for</SectionLabel>
        {[
          { label: "Context", desc: "What you are working on, and what feels most alive" },
          { label: "Tension", desc: "The questions and trade-offs you are navigating" },
          { label: "Counterpart", desc: "What kind of person would be genuinely useful now" },
          { label: "Style", desc: "How you prefer to engage — challenge, affirmation, difference" },
          { label: "Timing", desc: "Whether this is urgent or something unfolding gradually" },
        ].map((item, i) => (
          <div key={i} style={{
            padding: "11px 0",
            borderBottom: i < 4 ? `1px solid ${C.borderLight}` : "none",
            display: "flex", gap: 12,
          }}>
            <span style={{
              fontFamily: font.mono, fontSize: 10, color: C.amber,
              fontWeight: 500, marginTop: 2, flexShrink: 0,
            }}>{item.label}</span>
            <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.5 }}>
              {item.desc}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 28, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.sans, fontSize: 12, color: C.amberDark,
          lineHeight: 1.6, margin: 0,
        }}>
          Nothing you share is surfaced to another member without your explicit consent. You choose what becomes visible, to whom, and when.
        </p>
      </div>

      <Btn variant="amber" onClick={() => onNav(S.ELICIT_CHAT)}>Begin conversation</Btn>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
        {["Type", "Voice"].map((mode) => (
          <span key={mode} style={{
            fontFamily: font.mono, fontSize: 10, color: mode === "Type" ? C.amber : C.textMuted,
            letterSpacing: "0.06em",
          }}>{mode === "Type" ? "◉ " : "○ "}{mode}</span>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 6 }}>
        <span style={{ fontFamily: font.mono, fontSize: 10.5, color: C.textMuted }}>Approximately 8 minutes</span>
      </div>
    </div>
  </Phone>
);

const elicitIntroNotes = [
  "Frames elicitation as guided reflection rather than data extraction. This draws on Pescetelli's research: structured articulation improves judgement and decision quality. The conversation is the product, not a step before the product.",
  "Members can type or speak — the interface supports both modes. This matters because many members in this context are accustomed to conversation, not forms. Voice lowers the friction of self-description and produces richer, more natural context.",
  "The five listening dimensions — context, tension, counterpart, style, timing — establish that Amber's understanding is dynamic and multi-layered. This is what enables the non-superficial matching visible on the Match Rationale screen.",
  "Consent is surfaced before data collection begins — privacy by design, not privacy by afterthought. The visual tone models the conversational quality Amber aspires to produce.",
];

// ═══════════════════════════════════════════
// SCREEN D — Elicitation Chat
// ═══════════════════════════════════════════

const ElicitChatScreen = ({ onNav }) => {
  const [step, setStep] = useState(0);
  const messages = [
    { from: "ai", text: "What question feels most alive for you right now?" },
    { from: "user", text: "I'm looking for peers who have thought seriously about succession — without wanting to hand over too early." },
    { from: "ai", text: "That's a tension many people in your position navigate. Would affirmation, challenge, or a genuinely different perspective be more useful to you?" },
    { from: "user", text: "Challenge, but with cultural fit. I don't want someone performing contrarianism." },
    { from: "ai", text: "Understood. What kind of person would be genuinely useful to you right now?" },
    { from: "user", text: "Someone who has lived through an intergenerational transition and won't feel like an adviser trying to sell me something." },
    { from: "ai", text: "Is the urgency immediate — something you need to think through in the coming weeks — or is this a longer arc you want to explore over time?" },
    { from: "user", text: "Active. I'd like to have a conversation in the next month or so." },
  ];
  const visible = messages.slice(0, step + 1);

  return (
    <Phone>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{
          padding: "8px 24px 14px", borderBottom: `1px solid ${C.borderLight}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <button onClick={() => onNav(S.ELICIT_INTRO)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            color: C.textMuted, fontSize: 16,
          }}>‹</button>
          <AmberMark size={28} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 13.5, color: C.text }}>Amber</div>
            <div style={{ fontFamily: font.mono, fontSize: 9.5, color: C.textMuted }}>Elicitation · listening</div>
          </div>
          <div style={{
            display: "flex", gap: 4, alignItems: "center",
            padding: "3px 8px", borderRadius: 6,
            background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
          }}>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, color: C.textMuted }}>TYPE</span>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, color: C.border }}>|</span>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, color: C.border }}>VOICE</span>
          </div>
        </div>

        <div style={{ flex: 1, padding: "18px 20px 8px", overflowY: "auto" }}>
          {visible.map((m, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 14,
            }}>
              <div style={{
                maxWidth: "82%", padding: "13px 17px",
                borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.from === "user" ? C.text : C.surface,
                color: m.from === "user" ? C.bg : C.text,
                fontFamily: font.sans, fontSize: 13, lineHeight: 1.6,
                border: m.from === "ai" ? `1px solid ${C.border}` : "none",
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "10px 20px 20px" }}>
          {step < messages.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              width: "100%", padding: "14px", borderRadius: 10,
              border: `1.5px dashed ${C.border}`, background: C.surfaceWarm,
              color: C.textMuted, fontFamily: font.sans, fontSize: 12.5,
              cursor: "pointer",
            }}>
              Continue conversation ›
            </button>
          ) : (
            <Btn variant="amber" onClick={() => onNav(S.UNDERSTOOD)}>
              View what Amber understood →
            </Btn>
          )}
        </div>
      </div>
    </Phone>
  );
};

const elicitChatNotes = [
  "The conversation surfaces timing, tension, and preferred counterpart — not keywords or categories. It is closer to structured coaching than chatbot interaction. This is what makes the downstream matching non-superficial.",
  "Amber's questions help the member clarify their own thinking. This reflects Pescetelli's work on how better articulation improves social learning and judgement quality — the elicitation is itself a valuable service, not just a data-gathering step.",
  "The responses reveal what no static profile could: that this member wants challenge with cultural fit, that the need is active and time-bounded, that they distrust advisory-mode interactions. These are relational signals, not demographics.",
  "The tone is perceptive and non-intrusive. Amber reflects back what it hears rather than steering the member toward pre-determined categories. The system is designed to understand, not to classify.",
];

// ═══════════════════════════════════════════
// SCREEN E — What Amber Has Understood
// ═══════════════════════════════════════════

const UnderstoodScreen = ({ onNav }) => {
  const situational = [
    { label: "Current focus", value: "Succession and responsibility — navigating when and how to step forward without displacing the previous generation prematurely." },
    { label: "Key tension", value: "Wants thoughtful peers, not performative networkers or advisers selling access." },
    { label: "What would help now", value: "Someone who has navigated an intergenerational transition without surrendering agency too early — and can speak from lived experience." },
    { label: "Style", value: "Discreet, serious. Prefers challenge with cultural fit over broad affirmation." },
    { label: "Timing", value: "Active in the coming 4–6 weeks. A live decision context." },
  ];

  const longTerm = [
    { label: "Recurring themes", tags: ["Governance", "Identity", "Stewardship", "Next-gen role clarity", "Responsibility"] },
    { label: "Other active threads", items: [
      "Exploring climate stewardship — early stage, no introduction needed yet",
      "Family systems question resurfaced from a previous conversation",
    ]},
    { label: "Introduction history", items: [
      "2 introductions completed · 1 led to ongoing exchange",
      "Prior outcome: lived experience valued over advisory mode",
    ]},
  ];

  return (
    <Phone>
      <div style={{ padding: "20px 32px 32px" }}>
        <button onClick={() => onNav(S.ELICIT_CHAT)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>‹</span> Back
        </button>

        <ScreenChip type="member" />
        <h2 style={{
          fontFamily: font.serif, fontSize: 24, fontWeight: 500,
          color: C.text, margin: "0 0 6px", lineHeight: 1.25,
        }}>
          What Amber has understood
        </h2>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
          margin: "0 0 8px", lineHeight: 1.6,
        }}>
          Conversation becomes structured understanding. You can revise, clarify, or remove anything.
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
          padding: "10px 14px", borderRadius: 8,
          background: C.amberLight, border: `1px solid ${C.amberBorder}`,
        }}>
          <span style={{ fontFamily: font.mono, fontSize: 9, color: C.amberDark, letterSpacing: "0.06em" }}>
            CONVERSATION → INTERPRETATION → JUDGEMENT
          </span>
        </div>

        {/* Situational context */}
        <div style={{
          fontFamily: font.mono, fontSize: 9, color: C.amber,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
        }}>From this conversation</div>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "4px 0", marginBottom: 16,
        }}>
          {situational.map((f, i) => (
            <div key={i} style={{
              padding: "14px 20px",
              borderBottom: i < situational.length - 1 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{
                  fontFamily: font.mono, fontSize: 9.5, color: C.amber,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                }}>{f.label}</div>
                <span style={{
                  fontFamily: font.mono, fontSize: 9, color: C.textMuted,
                  cursor: "pointer", opacity: 0.6,
                }}>Edit</span>
              </div>
              <div style={{
                fontFamily: font.sans, fontSize: 12.5, color: C.text,
                lineHeight: 1.55,
              }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Long-term context */}
        <div style={{
          fontFamily: font.mono, fontSize: 9, color: C.textMuted,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
        }}>Longer-term picture</div>
        <div style={{
          background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
          borderRadius: 12, padding: "14px 20px", marginBottom: 16,
        }}>
          {/* Tags */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
            }}>Recurring themes</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {longTerm[0].tags.map(t => (
                <span key={t} style={{
                  padding: "4px 10px", borderRadius: 99, fontSize: 11,
                  fontFamily: font.sans, color: C.amberDark,
                  background: C.amberLight, border: `1px solid ${C.amberBorder}`,
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Other active threads */}
          <div style={{ marginBottom: 14, paddingTop: 10, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
            }}>Other active threads</div>
            {longTerm[1].items.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0",
              }}>
                <span style={{ color: C.amber, fontSize: 6, marginTop: 6, flexShrink: 0 }}>◆</span>
                <span style={{ fontFamily: font.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Introduction history */}
          <div style={{ paddingTop: 10, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
            }}>Introduction history</div>
            {longTerm[2].items.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0",
              }}>
                <span style={{ color: C.textMuted, fontSize: 6, marginTop: 6, flexShrink: 0 }}>◇</span>
                <span style={{ fontFamily: font.sans, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: C.cream, borderRadius: 10, padding: 14,
          marginBottom: 24, borderLeft: `3px solid ${C.amber}`,
        }}>
          <p style={{
            fontFamily: font.sans, fontSize: 12, color: C.amberDark,
            lineHeight: 1.6, margin: 0,
          }}>
            This understanding evolves. A member may be navigating many questions simultaneously — each requiring a different kind of introduction. Amber tracks these threads separately and learns from the outcomes of each.
          </p>
        </div>

        <Btn onClick={() => onNav(S.MATCH)}>Continue</Btn>
      </div>
    </Phone>
  );
};

const understoodNotes = [
  "This screen separates situational context (what emerged from this conversation) from the longer-term picture (accumulated themes, other active threads, introduction history). This demonstrates that Amber's understanding is not a single-interaction snapshot but an evolving relational model.",
  "The 'other active threads' section shows that a member may be navigating succession, climate stewardship, and family systems questions simultaneously — each requiring a different kind of introduction. Amber tracks these separately and can match for different purposes in parallel.",
  "Introduction history feeds back into future judgement. Amber knows that this member responded well to lived experience and poorly to advisory-mode interactions, and will weight future suggestions accordingly.",
  "Member control remains foregrounded: every situational field has an 'Edit' affordance. The member is the authority over their own representation — consistent with Shneiderman's emphasis on user control in human-centred AI.",
];

// ═══════════════════════════════════════════
// SCREEN F — Match Rationale
// ═══════════════════════════════════════════

const MatchScreen = ({ onNav }) => {
  const [matchState, setMatchState] = useState("strong"); // strong | partial | hold
  return (
  <Phone>
    <div style={{ padding: "20px 32px 32px" }}>
      <button onClick={() => onNav(S.UNDERSTOOD)} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 16 }}>‹</span> Back
      </button>

      <ScreenChip type="member" />

      {/* State toggle for prototype demonstration */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[
          { key: "strong", label: "Strong match" },
          { key: "partial", label: "Partial overlap" },
          { key: "hold", label: "Hold" },
        ].map(s => (
          <button key={s.key} onClick={() => setMatchState(s.key)} style={{
            padding: "5px 12px", borderRadius: 99, fontSize: 11,
            fontFamily: font.mono, cursor: "pointer",
            border: matchState === s.key ? `1.5px solid ${C.text}` : `1px solid ${C.border}`,
            background: matchState === s.key ? C.text : C.surface,
            color: matchState === s.key ? C.bg : C.textMuted,
          }}>{s.label}</button>
        ))}
      </div>

      {matchState === "strong" && (<>
      <SectionLabel>Suggested introduction</SectionLabel>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 99, background: C.surfaceWarm,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${C.border}`,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="8" r="4" fill={C.textMuted} opacity="0.4" />
            <path d="M3 18c0-4 3-7 7-7s7 3 7 7" fill={C.textMuted} opacity="0.25" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 14, color: C.text }}>Principal-level member</div>
          <div style={{ fontFamily: font.sans, fontSize: 12, color: C.textSecondary }}>Switzerland · Family governance experience</div>
          <div style={{ fontFamily: font.mono, fontSize: 9.5, color: C.textMuted, marginTop: 3 }}>Name disclosed after mutual consent</div>
        </div>
      </div>

      <div style={{
        background: C.surface, border: `1.5px solid ${C.amber}`,
        borderRadius: 14, padding: "22px 20px", marginBottom: 18,
      }}>
        <div style={{
          fontFamily: font.mono, fontSize: 10, color: C.amber,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
        }}>Why Amber is suggesting this now</div>
        <div style={{ fontFamily: font.sans, fontSize: 13.5, color: C.text, lineHeight: 1.75 }}>
          <p style={{ margin: "0 0 12px" }}>
            You are both thinking seriously about succession, but from different generational positions. This member has already navigated a comparable governance transition and is now focused on stewardship and legacy.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            You indicated that challenge with cultural fit would be more useful than broad similarity. This person's experience and directness appear well-suited to that preference.
          </p>
          <p style={{ margin: "0" }}>
            This is a timely, high-context conversation — not a generic match based on shared keywords or sector overlap.
          </p>
        </div>
      </div>

      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "4px 0", marginBottom: 18,
      }}>
        {[
          { dim: "Shared context", value: "Intergenerational succession, governance, stewardship" },
          { dim: "Productive difference", value: "Different generational positions — complementary, not overlapping" },
          { dim: "Decision relevance", value: "Both in active decision windows, not exploring abstractly" },
          { dim: "Conversation fit", value: "Challenge with cultural fit — serious, direct, non-advisory" },
          { dim: "Timing", value: "Both indicated active need within the coming weeks" },
        ].map((d, i) => (
          <div key={i} style={{
            padding: "12px 20px",
            borderBottom: i < 4 ? `1px solid ${C.borderLight}` : "none",
          }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.amber,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4,
            }}>{d.dim}</div>
            <div style={{
              fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.5,
            }}>{d.value}</div>
          </div>
        ))}
      </div>

      <Btn variant="amber" onClick={() => onNav(S.CONSENT)}>Review consent options</Btn>
      <div style={{ marginTop: 10 }}>
        <Btn variant="secondary" onClick={() => onNav(S.UNDERSTOOD)}>Refine what Amber understood</Btn>
      </div>
      </>)}

      {matchState === "partial" && (<>
      <SectionLabel>Suggested introduction — partial overlap</SectionLabel>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "20px", marginBottom: 18,
      }}>
        <div style={{
          fontFamily: font.mono, fontSize: 10, color: C.amber,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
        }}>Amber's assessment</div>
        <p style={{ fontFamily: font.sans, fontSize: 13.5, color: C.text, lineHeight: 1.75, margin: "0 0 14px" }}>
          Amber has not identified someone who precisely matches what you described. However, there is a member whose experience overlaps meaningfully with yours — particularly around governance questions and intergenerational responsibility.
        </p>
        <p style={{ fontFamily: font.sans, fontSize: 13, color: C.textSecondary, lineHeight: 1.7, margin: 0 }}>
          The overlap is real but not exact. This person's focus is more institutional than familial, and their timing may be less immediate than yours. Whether that difference is productive is a judgement Amber cannot make alone.
        </p>
      </div>

      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 18,
      }}>
        <SectionLabel>Where this overlaps</SectionLabel>
        {["Governance and stewardship themes", "Seriousness and non-advisory tone"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
            <span style={{ color: C.amber, fontSize: 7 }}>◆</span>
            <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary }}>{t}</span>
          </div>
        ))}
        <SectionLabel>Where it diverges</SectionLabel>
        {["Institutional rather than family context", "Timing may not align as closely"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
            <span style={{ color: C.textMuted, fontSize: 7 }}>◇</span>
            <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textMuted }}>{t}</span>
          </div>
        ))}
      </div>

      <Btn variant="amber" onClick={() => onNav(S.CONSENT)}>Review this introduction</Btn>
      <div style={{ marginTop: 10 }}>
        <Btn variant="secondary" onClick={() => setMatchState("hold")}>Ask Amber to wait</Btn>
      </div>
      </>)}

      {matchState === "hold" && (<>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "24px 20px", marginBottom: 20, textAlign: "center",
      }}>
        <AmberMark size={36} />
        <h3 style={{
          fontFamily: font.serif, fontSize: 20, fontWeight: 500,
          color: C.text, margin: "16px 0 10px", lineHeight: 1.3,
        }}>Nothing right now — and that's a considered judgement</h3>
        <p style={{
          fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
          lineHeight: 1.7, margin: 0,
        }}>
          Amber has not identified someone who fits what you're looking for with enough precision to suggest an introduction. Rather than offer a generic connection, Amber will hold your request and continue watching. If someone suitable enters the community or becomes available, you will hear from Amber directly.
        </p>
      </div>

      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 20, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.sans, fontSize: 12, color: C.amberDark,
          lineHeight: 1.6, margin: 0,
        }}>
          Not introducing someone yet is also a form of quality. Amber would rather wait than force a match that wastes your time or someone else's.
        </p>
      </div>

      <Btn variant="secondary" onClick={() => onNav(S.UNDERSTOOD)}>Refine what you're looking for</Btn>
      <div style={{ marginTop: 10 }}>
        <Btn variant="ghost" onClick={() => setMatchState("strong")}>View strong match (prototype demo)</Btn>
      </div>
      </>)}
    </div>
  </Phone>
  );
};

const matchNotes = [
  "This screen has three states: a strong match, a partial overlap, and a hold. The alternative states demonstrate that Amber exercises judgement rather than claiming omniscience — not introducing someone yet is itself a high-quality outcome. This bounded uncertainty is a form of critical maturity in the design.",
  "The suggested member is anonymised before consent: role level, broad geography, and relevant experience — but no name or identifying detail. In a narrow elite network, even city and specific role could identify someone. The name is disclosed only after mutual opt-in, making the privacy architecture coherent with Amber's consent logic.",
  "The five structured dimensions — shared context, productive difference, decision relevance, conversation fit, timing — demonstrate relational judgement, not keyword matching. The separation of shared context from productive difference draws on the brokerage and social capital literature mapped in Framing and Cartography Assessment 1, particularly Burt's structural holes and Granovetter's weak ties: value comes from bridging, not clustering.",
  "This screen is the beginning of Amber's governance architecture. Explanation is not a UX convenience — it is a condition of trustworthy AI. Match Rationale is where Amber's intelligence becomes legible; Governance is where that legibility becomes accountable.",
];

// ═══════════════════════════════════════════
// SCREEN G — Double Opt-In / Consent
// ═══════════════════════════════════════════

const ConsentScreen = ({ onNav }) => {
  const [memberConsent, setMemberConsent] = useState(null);
  return (
    <Phone>
      <div style={{ padding: "20px 32px 32px" }}>
        <button onClick={() => onNav(S.MATCH)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>‹</span> Back
        </button>

        <h2 style={{
          fontFamily: font.serif, fontSize: 24, fontWeight: 500,
          color: C.text, margin: "0 0 8px", lineHeight: 1.25,
        }}>Consent</h2>
        <p style={{
          fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
          margin: "0 0 28px", lineHeight: 1.65,
        }}>
          Amber only introduces members when both sides can see the relevance. No one is surfaced without context and consent.
        </p>

        {/* State diagram */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "20px", marginBottom: 24,
        }}>
          <SectionLabel>Introduction status</SectionLabel>
          {[
            { label: "You reviewed rationale", done: true },
            { label: "Your consent", done: memberConsent === true, active: memberConsent === null },
            { label: "Other member reviews rationale", done: false, waiting: memberConsent === true },
            { label: "Other member's consent", done: false },
            { label: "Names revealed · introduction made", done: false },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
              borderBottom: i < 4 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 99, flexShrink: 0,
                background: s.done ? C.amber : s.active ? C.amberLight : s.waiting ? C.cream : C.surfaceWarm,
                border: s.done ? "none" : `1.5px solid ${s.active ? C.amber : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {s.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 5.2L4.2 6.8L7.5 3.2" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                {s.active && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.amber }} />}
              </div>
              <span style={{
                fontFamily: font.sans, fontSize: 13,
                color: s.done ? C.text : s.active ? C.text : C.textMuted,
                fontWeight: s.active ? 600 : 400,
              }}>{s.label}</span>
              {s.waiting && <span style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, marginLeft: "auto" }}>Waiting</span>}
            </div>
          ))}
        </div>

        {/* Consent controls */}
        <div style={{
          background: C.cream, border: `1px solid ${C.amberBorder}`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 24,
        }}>
          <SectionLabel>What the other member will see</SectionLabel>
          {[
            { label: "Your first name", shared: true, note: "surname withheld until you choose" },
            { label: "Amber's rationale for the introduction", shared: true, note: "" },
            { label: "Broad themes from your conversation", shared: true, note: "e.g. succession, governance" },
            { label: "Your specific words or responses", shared: false, note: "always private" },
            { label: "Your contact details", shared: false, note: "released only after both parties consent" },
          ].map((c, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0",
              borderBottom: i < 4 ? `1px solid rgba(184,146,62,0.12)` : "none",
            }}>
              <div>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.text }}>{c.label}</span>
                {c.note && <div style={{ fontFamily: font.mono, fontSize: 9, color: C.textMuted, marginTop: 1 }}>{c.note}</div>}
              </div>
              <span style={{
                fontFamily: font.mono, fontSize: 10,
                color: c.shared ? C.amber : C.textMuted,
              }}>{c.shared ? "Visible" : "Private"}</span>
            </div>
          ))}
        </div>

        {memberConsent === null ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn variant="amber" onClick={() => setMemberConsent(true)}>I'd like to be introduced</Btn>
            <Btn variant="secondary" onClick={() => onNav(S.MATCH)}>Not right now</Btn>
            <Btn variant="ghost" onClick={() => onNav(S.MATCH)} style={{ fontSize: 12 }}>Refine suggestion</Btn>
          </div>
        ) : (
          <div>
            <div style={{
              background: C.amberLight, borderRadius: 10, padding: 16,
              textAlign: "center", marginBottom: 16,
            }}>
              <p style={{ fontFamily: font.sans, fontSize: 13, color: C.amberDark, margin: 0, lineHeight: 1.6 }}>
                Your consent has been recorded. The other member will now review the rationale on their side. You will be notified when they respond.
              </p>
            </div>
            <Btn onClick={() => onNav(S.HANDOFF)}>Continue →</Btn>
          </div>
        )}
      </div>
    </Phone>
  );
};

const consentNotes = [
  "Consent is a designed part of the experience, not legal compliance. The double opt-in flow is visible, sequential, and explained at every step. This makes the mechanism of mutual protection legible without collapsing discretion.",
  "The other member remains anonymised throughout consent. 'What the other member will see' specifies disclosure granularly: themes are visible, specific words are not; first name is shared, surname is withheld. Names are revealed only after both parties opt in — completing the privacy staging begun on the Match Rationale screen.",
  "The three response options — accept, defer, refine — give the member agency without pressure. 'Refine suggestion' loops back upstream, maintaining human control over the AI's interpretation at every step.",
  "The status diagram makes the sequential, mutual nature of the process legible. The final step — 'Names revealed · introduction made' — signals that identity disclosure is the culmination of consent, not its precondition.",
];

// ═══════════════════════════════════════════
// SCREEN H — Introduction Handoff
// ═══════════════════════════════════════════

const HandoffScreen = ({ onNav }) => (
  <Phone>
    <div style={{ padding: "20px 32px 32px" }}>
      <button onClick={() => onNav(S.CONSENT)} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 16 }}>‹</span> Back
      </button>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 99, background: C.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.bg, fontSize: 14, fontWeight: 600, fontFamily: font.serif,
            border: `3px solid ${C.bg}`, zIndex: 2,
          }}>J</div>
          <div style={{
            width: 44, height: 44, borderRadius: 99, background: C.amberLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.amberDark, fontSize: 14, fontWeight: 600, fontFamily: font.serif,
            border: `3px solid ${C.bg}`, marginLeft: -10, zIndex: 1,
          }}>D</div>
        </div>
        <h2 style={{
          fontFamily: font.serif, fontSize: 22, fontWeight: 500,
          color: C.text, margin: "0 0 4px", lineHeight: 1.25,
        }}>Introduction</h2>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textMuted, margin: 0,
        }}>Both members have consented</p>
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "20px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <AmberMark size={20} />
          <span style={{
            fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>Amber's introduction</span>
        </div>
        <p style={{
          fontFamily: font.serif, fontSize: 15, color: C.text,
          lineHeight: 1.7, margin: 0, fontStyle: "italic",
        }}>
          James, meet Daniela. You are both navigating questions of stewardship and intergenerational responsibility, though from different vantage points. Amber is introducing you because each of you appears able to offer the other a timely and useful perspective.
        </p>
      </div>

      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 20,
      }}>
        <SectionLabel>How this works</SectionLabel>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
          lineHeight: 1.6, margin: 0,
        }}>
          This introduction happens directly between you and Daniela, inside Amber. Amber makes the introduction and then steps back. If you both choose to continue the conversation elsewhere, that is your decision to make.
        </p>
      </div>

      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 16, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.sans, fontSize: 12, color: C.amberDark,
          lineHeight: 1.6, margin: 0,
        }}>
          Amber will check in after a reasonable interval to understand what was useful. There is no rush — reflection matters more than speed.
        </p>
      </div>

      {/* Follow-through and pacing — stacked layout */}
      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 24,
      }}>
        <SectionLabel>What comes next</SectionLabel>
        {[
          { time: "After the conversation", text: "Amber asks what was useful — not whether it 'went well'." },
          { time: "If no follow-up occurs", text: "A gentle check-in, not a reminder. Paced, not persistent." },
          { time: "Before the next suggestion", text: "Amber spaces introductions to preserve quality. Reflection comes before the next request." },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "10px 0",
            borderBottom: i < 2 ? `1px solid ${C.borderLight}` : "none",
          }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.amber,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
            }}>{f.time}</div>
            <div style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55 }}>{f.text}</div>
          </div>
        ))}
      </div>

      <Btn onClick={() => onNav(S.OUTCOME)}>Send introduction</Btn>
    </div>
  </Phone>
);

const handoffNotes = [
  "The introduction text is warm, specific, and controlled — it explains the relevance without overexposing either party. Names appear here for the first time, completing the privacy staging from Match Rationale through Consent.",
  "The first interaction happens inside Amber, between members directly. There is no EA layer, no external channel handoff, no intermediary. This is a deliberate design choice: Amber makes the introduction and then steps back. Members choose for themselves whether to move elsewhere later.",
  "Follow-through prompts are stacked for readability — each has a temporal label and a short description. They are Amber-initiated, paced, and non-intrusive: closer to a thoughtful check-in than a chatbot notification.",
  "Pacing is visibly designed into the flow. Amber spaces introductions to preserve quality — not as artificial scarcity, but as stewardship. The cadence communicates that each introduction carries weight.",
];

// ═══════════════════════════════════════════
// SCREEN I — Outcome / Follow-through
// ═══════════════════════════════════════════

const OutcomeScreen = ({ onNav }) => {
  const [selected, setSelected] = useState(null);
  const options = [
    "Useful perspective",
    "Would speak again",
    "Valuable but different than expected",
    "We already know each other well",
    "We were already acquainted — good to reconnect",
    "Too early — timing wasn't right",
    "Not the right fit",
    "Better for future",
  ];

  return (
    <Phone>
      <div style={{ padding: "20px 32px 32px" }}>
        <button onClick={() => onNav(S.HANDOFF)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>‹</span> Back
        </button>

        <ScreenChip type="member" />
        <h2 style={{
          fontFamily: font.serif, fontSize: 24, fontWeight: 500,
          color: C.text, margin: "0 0 6px", lineHeight: 1.25,
        }}>What was useful?</h2>
        <p style={{
          fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
          margin: "0 0 24px", lineHeight: 1.65,
        }}>
          Amber is learning about your timing preferences, the kinds of introduction that create value, and whether challenge or similarity was more productive. This shapes what comes next.
        </p>

        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "4px 0", marginBottom: 24,
        }}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                padding: "14px 20px", cursor: "pointer",
                borderBottom: i < options.length - 1 ? `1px solid ${C.borderLight}` : "none",
                display: "flex", alignItems: "center", gap: 14,
                background: selected === i ? C.cream : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 99,
                border: `1.5px solid ${selected === i ? C.amber : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {selected === i && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.amber }} />}
              </div>
              <span style={{
                fontFamily: font.sans, fontSize: 13,
                color: selected === i ? C.text : C.textSecondary,
              }}>{opt}</span>
            </div>
          ))}
        </div>

        {selected !== null && (
          <>
            <div style={{
              background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
              borderRadius: 12, padding: "16px 20px", marginBottom: 20,
            }}>
              <SectionLabel>What Amber takes forward</SectionLabel>
              {(selected <= 2 ? [
                "Introductions grounded in complementary experience are productive for you",
                "Challenge with cultural fit produces stronger outcomes than broad similarity",
                "Lived experience preferred over advisory-mode counterparts",
              ] : selected === 3 ? [
                "Good to know. I'll remember that this is already a strong connection.",
                "Future suggestions will account for relationships already in place",
                "Amber learns who is already in your world, not just who should be",
              ] : selected === 4 ? [
                "Glad this helped bring the relationship back into view.",
                "Reactivating a dormant connection can be as valuable as creating a new one",
                "Amber will note that this tie was worth renewing — and may surface similar reconnections in future",
              ] : [
                "Timing sensitivity adjusted — urgency alone does not predict a good conversation",
                "Counterpart criteria refined: cultural fit carries more weight than thematic overlap",
                "Amber will suggest this kind of introduction less often unless your needs shift",
              ]).map((update, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none",
                }}>
                  <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }}>◆</span>
                  <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55 }}>{update}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: C.cream, borderRadius: 10, padding: 14,
              marginBottom: 24, borderLeft: `3px solid ${C.amber}`,
            }}>
              <p style={{
                fontFamily: font.sans, fontSize: 12, color: C.amberDark,
                lineHeight: 1.6, margin: 0,
              }}>
                Feedback is private. The other member will not see your specific response — they provide their own, independently.
              </p>
            </div>

            <Btn onClick={() => onNav(S.GOVERNANCE)}>Submit reflection</Btn>
            <div style={{
              textAlign: "center", marginTop: 12,
              fontFamily: font.mono, fontSize: 10, color: C.textMuted,
              lineHeight: 1.6,
            }}>
              A new introduction window opens in 14 days.<br/>
              You can continue reflecting with Amber in the meantime.
            </div>
          </>
        )}
      </div>
    </Phone>
  );
};

const outcomeNotes = [
  "Amber learns from relational outcomes, not engagement metrics. The feedback categories capture whether challenge or similarity was useful, whether timing was right, whether the counterpart felt like a peer or an adviser. These signals make the next suggestion more precise and the system less likely to repeat what didn't work.",
  "The explicit update items make the learning loop legible: timing preferences, counterpart criteria, which forms of follow-through create value, and what kinds of introductions should happen less often. This transforms Amber from a matching tool into an evolving relational intelligence system.",
  "The pacing indicator ('a new introduction window opens in 14 days') makes cadence visible. Amber spaces introductions to preserve quality and follow-through — not as artificial scarcity, but as stewardship. Each introduction carries weight.",
  "Individual outcomes accumulate into the broader intelligence visible on the Community screen. This completes the feedback loop: conversation → understanding → introduction → outcome → refined understanding → community intelligence.",
];

// ═══════════════════════════════════════════
// SCREEN J — Governance
// ═══════════════════════════════════════════

const GovernanceScreen = ({ onNav }) => (
  <Phone>
    <div style={{ padding: "20px 32px 32px" }}>
      <button onClick={() => onNav(S.OUTCOME)} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 16 }}>‹</span> Back
      </button>

      <ScreenChip type="system" />
      <h2 style={{
        fontFamily: font.serif, fontSize: 24, fontWeight: 500,
        color: C.text, margin: "0 0 8px", lineHeight: 1.25,
      }}>Trust and governance</h2>
      <p style={{
        fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
        margin: "0 0 28px", lineHeight: 1.65,
      }}>
        Governance is not a compliance layer. It is the founding design constraint — the reason Amber can explain its suggestions, bound its memory, and keep human judgement at the centre of every consequential decision.
      </p>

      {[
        { title: "Explanation before introduction", desc: "Every suggestion comes with a readable rationale: why this person, why now, and on what basis. The member always knows the reasoning behind a specific introduction." },
        { title: "Consent before connection", desc: "No one is surfaced, introduced, or contacted without mutual, informed consent. Both parties see the rationale before either is identified." },
        { title: "Bounded memory", desc: "Amber's understanding of you is visible, editable, and deletable. Memory is bounded by design — you decide what persists and what is forgotten." },
        { title: "Human oversight", desc: "AI supports human judgement; it does not replace it. Amber includes human review at high-consequence decision points. Automation is bounded, not total." },
        { title: "Intelligibility", desc: "Beyond individual explanations, members can see how Amber works as a system: what it has learned over time, how feedback shapes its judgement, and where its reasoning comes from." },
        { title: "No feed, no directory", desc: "Members cannot browse other members. Amber understands relational topology in the background but does not expose it." },
        { title: "No advertising", desc: "Revenue comes from membership alone. Amber will never monetise attention, sell data, or incentivise engagement for its own sake." },
      ].map((item, i) => (
        <div key={i} style={{
          padding: "16px 0",
          borderBottom: i < 6 ? `1px solid ${C.borderLight}` : "none",
        }}>
          <div style={{
            fontFamily: font.sans, fontWeight: 600, fontSize: 13.5,
            color: C.text, marginBottom: 4,
          }}>{item.title}</div>
          <div style={{
            fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
            lineHeight: 1.6,
          }}>{item.desc}</div>
        </div>
      ))}

      <div style={{
        marginTop: 28, background: C.cream, borderRadius: 10,
        padding: 14, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.serif, fontSize: 14, color: C.amberDark,
          lineHeight: 1.65, margin: 0, fontStyle: "italic",
        }}>
          The question this prototype explores: can explanation carry the same trust-producing weight as discretion alone?
        </p>
      </div>
      <div style={{ marginTop: 20 }}>
        <Btn variant="secondary" onClick={() => onNav(S.TRENDS)}>View community briefing →</Btn>
      </div>
    </div>
  </Phone>
);

const governanceNotes = [
  "This screen makes governance visible as a designed product feature, not back-office compliance. Each principle is stated plainly so that a member — or an academic viewer — can assess the system's ethical commitments at a glance.",
  "The principles directly reflect Shneiderman's Human-Centered AI framework: intelligibility (members can see what Amber understood), human oversight (automation is bounded, not total), user control (memory is editable and deletable), and explanation (rationale accompanies every suggestion). AI here is positioned as support for human judgement, not its replacement.",
  "Match Rationale is where Amber's intelligence becomes legible. This screen is where that legibility becomes accountable. Together they form a single argument: that explanation and governance are not separate concerns but two sides of trustworthy relational infrastructure.",
  "The closing question — 'can explanation carry the same trust-producing weight as discretion alone?' — restates the research question. The prototype invites the viewer to evaluate whether bringing the mechanism of connection onstage, under governance, can produce trust rather than erode it.",
];

// ═══════════════════════════════════════════
// SCREEN K — Community Trends
// ═══════════════════════════════════════════

const TrendsScreen = ({ onNav }) => {
  const themes = [
    { label: "Succession & governance", pct: 72, trend: "Prominent" },
    { label: "Climate stewardship", pct: 58, trend: "Prominent" },
    { label: "Next-gen identity & role clarity", pct: 45, trend: "Emerging" },
    { label: "Measuring impact", pct: 34, trend: "Declining" },
    { label: "Family systems & mediation", pct: 22, trend: "Niche" },
  ];

  const trendColor = (t) => t === "Prominent" ? C.amber : t === "Emerging" ? C.amberDark : t === "Declining" ? C.textMuted : "#8A8680";

  const signals = [
    { label: "Introductions", value: "14 this quarter", note: "across 9 distinct thematic pairings" },
    { label: "Follow-through", value: "11 led to conversation", note: "4 led to a second meeting or ongoing exchange" },
    { label: "Highest-value outcome", value: "1 co-investment", note: "originated from a governance-climate bridge introduction" },
    { label: "Active demand", value: "Succession, next-gen identity", note: "several members navigating similar transitions simultaneously" },
  ];

  return (
    <Phone>
      <div style={{ padding: "20px 32px 32px" }}>
        <button onClick={() => onNav(S.GOVERNANCE)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          marginBottom: 24, color: C.textMuted, fontFamily: font.sans, fontSize: 13,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>‹</span> Back
        </button>

        <div style={{
          fontFamily: font.mono, fontSize: 9, color: C.amber,
          textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8,
        }}>Private briefing</div>
        <ScreenChip type="system" />
        <h2 style={{
          fontFamily: font.serif, fontSize: 24, fontWeight: 500,
          color: C.text, margin: "0 0 6px", lineHeight: 1.25,
        }}>Community</h2>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
          margin: "0 0 24px", lineHeight: 1.65,
        }}>
          What is moving across Amber. Individual conversations accumulate into collective patterns — visible here without exposing anyone.
        </p>

        {/* Prestige-safe signals */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "18px 20px", marginBottom: 18,
        }}>
          <SectionLabel>Relational activity</SectionLabel>
          {signals.map((s, i) => (
            <div key={i} style={{
              padding: "10px 0",
              borderBottom: i < signals.length - 1 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, fontWeight: 600, color: C.text }}>{s.label}</span>
                <span style={{ fontFamily: font.mono, fontSize: 10, color: C.amber }}>{s.value}</span>
              </div>
              <span style={{ fontFamily: font.sans, fontSize: 11.5, color: C.textMuted, lineHeight: 1.5 }}>{s.note}</span>
            </div>
          ))}
        </div>

        {/* Theme bars */}
        <div style={{
          background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 18,
        }}>
          <SectionLabel>Themes across the community</SectionLabel>
          {themes.map((t, i) => (
            <div key={i} style={{ marginBottom: i < themes.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontFamily: font.sans, fontSize: 12, color: C.text }}>{t.label}</span>
                <span style={{
                  fontFamily: font.mono, fontSize: 9,
                  color: trendColor(t.trend),
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>{t.trend}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: C.borderLight, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${t.pct}%`, borderRadius: 2,
                  background: t.trend === "Declining" ? C.textMuted : `linear-gradient(90deg, ${C.amber}, ${C.amberBorder})`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Relational topology */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 18,
        }}>
          <SectionLabel>Relational topology</SectionLabel>
          <div style={{
            background: C.surfaceWarm, borderRadius: 8, padding: 14,
            marginBottom: 10, border: `1px solid ${C.borderLight}`,
          }}>
            <svg viewBox="0 0 280 110" width="100%" style={{ display: "block" }}>
              <circle cx="60" cy="48" r="26" fill={C.amberLight} stroke={C.amberBorder} strokeWidth="1" />
              <circle cx="45" cy="40" r="3.5" fill={C.amber} opacity="0.7" />
              <circle cx="60" cy="34" r="4" fill={C.amber} opacity="0.8" />
              <circle cx="72" cy="46" r="3.5" fill={C.amber} opacity="0.6" />
              <circle cx="55" cy="56" r="3" fill={C.amber} opacity="0.5" />
              <text x="60" y="84" textAnchor="middle" style={{ fontSize: 7.5, fill: C.textMuted, fontFamily: "IBM Plex Mono, monospace" }}>Governance</text>

              <circle cx="190" cy="52" r="20" fill={C.amberLight} stroke={C.amberBorder} strokeWidth="1" />
              <circle cx="183" cy="46" r="3.5" fill={C.amber} opacity="0.6" />
              <circle cx="196" cy="44" r="3" fill={C.amber} opacity="0.7" />
              <circle cx="194" cy="58" r="3" fill={C.amber} opacity="0.5" />
              <text x="190" y="84" textAnchor="middle" style={{ fontSize: 7.5, fill: C.textMuted, fontFamily: "IBM Plex Mono, monospace" }}>Climate</text>

              <line x1="86" y1="48" x2="170" y2="52" stroke={C.amber} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />

              <circle cx="245" cy="38" r="12" fill={C.borderLight} stroke={C.border} strokeWidth="1" strokeDasharray="3 2" />
              <circle cx="242" cy="36" r="2.5" fill={C.textMuted} opacity="0.3" />
              <circle cx="248" cy="40" r="2" fill={C.textMuted} opacity="0.25" />
              <text x="245" y="58" textAnchor="middle" style={{ fontSize: 7, fill: C.textMuted, fontFamily: "IBM Plex Mono, monospace" }}>Forming</text>
            </svg>
          </div>
          <p style={{
            fontFamily: font.sans, fontSize: 11.5, color: C.textSecondary,
            lineHeight: 1.55, margin: 0,
          }}>
            Thematic clusters and the bridges between them. Introductions across clusters tend to produce the most novel conversations.
          </p>
        </div>

        <div style={{
          background: C.cream, borderRadius: 10, padding: 14,
          borderLeft: `3px solid ${C.amber}`,
        }}>
          <p style={{
            fontFamily: font.sans, fontSize: 12, color: C.amberDark,
            lineHeight: 1.6, margin: 0,
          }}>
            This is a member-facing briefing, not a system dashboard. It shows what the community is navigating collectively — and how individual conversations contribute to a broader picture that no single member can see alone.
          </p>
        </div>
      </div>
    </Phone>
  );
};

const trendsNotes = [
  "This screen sits adjacent to the relational arc — not within it. It is the feedback loop made visible: individual interactions accumulate into collective intelligence that no single member can see alone. This builds collective identity through aggregated intelligence rather than exposed profiles.",
  "The signals are prestige-safe and privacy-preserving: introductions made, follow-through, high-value outcomes. They communicate collective momentum without exposing individuals or resembling growth analytics.",
  "The four-stage trend taxonomy (Niche, Emerging, Prominent, Declining) conveys maturity and direction without quantifying membership. A declining theme signals the community's attention is shifting — useful intelligence for members navigating related decisions. A niche theme may be small but high-value.",
  "The relational topology diagram draws on Burt's structural holes (mapped in Framing and Cartography Assessment 1, Zone 2): Amber's value lies in identifying and bridging across disconnected clusters. Dunbar's work on the cognitive limits of meaningful relationships (Zone 5) informs the emphasis on selectivity over scale.",
];

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function AmberPrototype() {
  const [screen, setScreen] = useState(S.OVERVIEW);

  const allNotes = {
    [S.OVERVIEW]: overviewNotes,
    [S.INVITE]: inviteNotes,
    [S.ABOUT]: aboutNotes,
    [S.APPLY]: applyNotes,
    [S.ELICIT_INTRO]: elicitIntroNotes,
    [S.ELICIT_CHAT]: elicitChatNotes,
    [S.UNDERSTOOD]: understoodNotes,
    [S.MATCH]: matchNotes,
    [S.CONSENT]: consentNotes,
    [S.HANDOFF]: handoffNotes,
    [S.OUTCOME]: outcomeNotes,
    [S.GOVERNANCE]: governanceNotes,
    [S.TRENDS]: trendsNotes,
  };

  const screens = {
    [S.OVERVIEW]: <OverviewScreen onNav={setScreen} />,
    [S.INVITE]: <InviteScreen onNav={setScreen} />,
    [S.ABOUT]: <AboutScreen onNav={setScreen} />,
    [S.APPLY]: <ApplyScreen onNav={setScreen} />,
    [S.ELICIT_INTRO]: <ElicitIntroScreen onNav={setScreen} />,
    [S.ELICIT_CHAT]: <ElicitChatScreen onNav={setScreen} />,
    [S.UNDERSTOOD]: <UnderstoodScreen onNav={setScreen} />,
    [S.MATCH]: <MatchScreen onNav={setScreen} />,
    [S.CONSENT]: <ConsentScreen onNav={setScreen} />,
    [S.HANDOFF]: <HandoffScreen onNav={setScreen} />,
    [S.OUTCOME]: <OutcomeScreen onNav={setScreen} />,
    [S.GOVERNANCE]: <GovernanceScreen onNav={setScreen} />,
    [S.TRENDS]: <TrendsScreen onNav={setScreen} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0EDE7", fontFamily: font.sans }}>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <AmberMark size={28} />
          <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted, letterSpacing: "0.08em" }}>
            RESEARCH PROTOTYPE
          </span>
        </div>
        <h1 style={{
          fontFamily: font.serif, fontSize: 34, fontWeight: 500,
          color: C.text, margin: "0 0 10px", lineHeight: 1.2,
        }}>
          Amber
        </h1>
        <p style={{
          fontFamily: font.serif, fontSize: 17, color: C.textSecondary,
          margin: "0 0 8px", lineHeight: 1.6, maxWidth: 680, fontStyle: "italic",
        }}>
          How might a platform make valuable relational connection more explicit and legible, without losing the trust, discretion, and high-status signals that elite private networks depend on?
        </p>
        <p style={{
          fontFamily: font.mono, fontSize: 10.5, color: C.textMuted,
          margin: "0 0 24px",
        }}>
          Re:Form Assessment 2 · Product Prototype · LIS MASc 2024/26
        </p>
      </div>

      {/* Navigation */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "0 32px 24px",
        display: "flex", gap: 5, flexWrap: "wrap",
      }}>
        {SCREEN_META.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: screen === s.id ? `1.5px solid ${C.text}` : `1px solid ${C.border}`,
              background: screen === s.id ? C.text : C.surface,
              color: screen === s.id ? C.bg : C.textSecondary,
              fontFamily: font.sans, fontSize: 12, fontWeight: 500,
              cursor: "pointer", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ fontFamily: font.mono, fontSize: 10, opacity: 0.5 }}>{s.short}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content: Phone + Notes */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "0 32px 48px",
        display: "flex", gap: 48, justifyContent: "center", alignItems: "flex-start",
      }}>
        {screens[screen]}
        <Notes items={allNotes[screen] || []} />
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "0 32px 40px",
        textAlign: "center",
      }}>
        <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
        <p style={{
          fontFamily: font.mono, fontSize: 10.5, color: C.textMuted,
          lineHeight: 1.7, maxWidth: 520, margin: "0 auto",
        }}>
          13 screens · Interactive prototype with design annotations · Navigate using the tabs above or the in-screen controls
        </p>
      </div>
    </div>
  );
}
