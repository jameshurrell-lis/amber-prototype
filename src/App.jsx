import { useState } from "react";

/* ═══════════════════════════════════════════
   AMBER — Research-through-design prototype
   Re:Form Assessment 2 · LIS MASc 2024/26
   Mobile-first refactor · WCAG 2.2 AA target
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
  textMuted: "#6B6560", // bumped from #A9A29A for AA contrast on warm bg
  textFaint: "#A9A29A", // legacy faint colour — use only on white / large text
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

// ── Screen IDs ── (14 screens: Overview + A–M)
const S = {
  OVERVIEW: 0, INVITE: 1, ABOUT: 12, APPLY: 2, ELICIT_INTRO: 3, ELICIT_CHAT: 4,
  UNDERSTOOD: 5, MATCH: 6, BRIDGE: 13, CONSENT: 7, HANDOFF: 8,
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
  { id: S.BRIDGE, label: "Bridge Pathway", short: "H" },
  { id: S.CONSENT, label: "Consent", short: "I" },
  { id: S.HANDOFF, label: "Introduction", short: "J" },
  { id: S.OUTCOME, label: "Outcome", short: "K" },
  { id: S.GOVERNANCE, label: "Governance", short: "L" },
  { id: S.TRENDS, label: "Community", short: "M" },
];

// ── Global stylesheet (focus rings, reduced motion, responsive breakpoints) ──
const GLOBAL_CSS = `
  *:focus-visible {
    outline: 3px solid #B8923E !important;
    outline-offset: 2px !important;
    transition: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Skip link — visible only when focused */
  .a-skip {
    position: absolute;
    left: -9999px;
    top: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: 9999;
    text-decoration: none;
  }
  .a-skip:focus {
    position: fixed;
    top: 12px;
    left: 12px;
    width: auto;
    height: auto;
    padding: 12px 18px;
    background: #2A2520;
    color: #FDFAF5;
    font-family: 'Libre Franklin', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  /* Visually-hidden — for screen-reader-only content */
  .a-sr {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0,0,0,0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  /* Back button — 44×44 touch target */
  .a-back {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 8px 4px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Libre Franklin', sans-serif;
    font-size: 13px;
    color: #6B6560;
    touch-action: manipulation;
    margin-bottom: 8px;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s;
  }
  .a-back:hover { color: #2A2520; }

  /* Phone shell — desktop default */
  .a-shell {
    width: 390px;
    min-height: 760px;
    max-height: 760px;
    border-radius: 44px;
    border: 2px solid #E8E3DB;
    background: #FDFAF5;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 60px rgba(42,37,32,0.08), 0 2px 8px rgba(42,37,32,0.04);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .a-shell-bar {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    font-size: 13px;
    font-weight: 600;
    color: #2A2520;
    font-family: 'Libre Franklin', sans-serif;
    flex-shrink: 0;
  }
  .a-shell-body { flex: 1; overflow-y: auto; overflow-x: hidden; }

  /* Layout: phone + notes */
  .a-layout {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 32px 48px;
    display: flex;
    gap: 48px;
    justify-content: center;
    align-items: flex-start;
  }

  /* Desktop header / tabs */
  .a-hdr { max-width: 900px; margin: 0 auto; padding: 36px 32px 0; }
  .a-hdr-mobile { display: none; }
  .a-tabs {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 32px 24px;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  .a-tab {
    padding: 8px 14px;
    border-radius: 8px;
    font-family: 'Libre Franklin', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
    touch-action: manipulation;
    min-height: 36px;
    -webkit-tap-highlight-color: transparent;
  }

  /* Mobile sticky nav bar — hidden on desktop */
  .a-mobile-nav { display: none; }

  /* Notes — desktop sidebar */
  .a-notes {
    width: 340px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .a-notes-hdr {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #6B6560;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding-bottom: 8px;
    border-bottom: 1px solid #F0ECE5;
  }
  .a-notes-toggle { display: none; }
  .a-notes-body { display: flex; flex-direction: column; gap: 16px; }

  /* State-toggle pills (e.g. Match states, Bridge tabs) — bigger tap target on mobile */
  .a-pill {
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    cursor: pointer;
    min-height: 32px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    line-height: 1.1;
  }

  /* ── Tablet (681–880px) ──────────────────── */
  @media (min-width: 681px) and (max-width: 880px) {
    .a-shell { width: 340px; }
    .a-notes { width: 240px; }
    .a-layout { gap: 32px; padding: 0 20px 48px; }
    .a-tabs { padding: 0 20px 24px; }
    .a-hdr { padding: 28px 20px 0; }
  }

  /* ── Mobile (≤680px) ─────────────────────── */
  @media (max-width: 680px) {
    .a-hdr { display: none; }
    .a-hdr-mobile {
      display: block;
      padding: 16px 16px 14px;
      border-bottom: 1px solid #E8E3DB;
    }

    .a-tabs { display: none; }
    .a-mobile-nav {
      display: flex;
      align-items: stretch;
      gap: 8px;
      padding: 8px 12px;
      background: #FDFAF5;
      border-bottom: 1px solid #E8E3DB;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 8px rgba(42,37,32,0.06);
    }
    .a-nav-btn {
      min-width: 44px;
      min-height: 44px;
      width: 48px;
      border-radius: 10px;
      border: 1.5px solid #E8E3DB;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      font-family: 'Libre Franklin', sans-serif;
      color: #2A2520;
      flex-shrink: 0;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      transition: all 0.15s;
      padding: 0;
    }
    .a-nav-btn:disabled {
      background: #F0ECE5;
      color: #A9A29A;
      border-color: #E8E3DB;
      cursor: default;
    }
    .a-nav-btn-next {
      background: #2A2520;
      color: #FDFAF5;
      border-color: #2A2520;
    }
    .a-nav-btn-next:disabled {
      background: #F0ECE5;
      color: #A9A29A;
      border-color: #E8E3DB;
    }
    .a-nav-progress {
      flex: 1;
      min-width: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4px 4px;
    }

    .a-layout {
      flex-direction: column;
      padding: 12px 12px 24px;
      gap: 0;
    }

    /* Drop the phone bezel on mobile — content card is the experience */
    .a-shell {
      width: 100%;
      min-height: auto;
      max-height: none;
      border-radius: 16px;
      border: 1px solid #E8E3DB;
      box-shadow: 0 4px 20px rgba(42,37,32,0.05);
      overflow: visible;
    }
    .a-shell-body { overflow: visible; }
    .a-shell-bar { display: none; }

    /* Mobile padding override — original screens use 32px sides;
       tighten to 18px so 320px viewports breathe */
    .a-shell-body > div { padding-left: 18px !important; padding-right: 18px !important; }

    /* Notes — accordion under content */
    .a-notes {
      width: 100%;
      margin-top: 14px;
      background: #FFFFFF;
      border: 1px solid #E8E3DB;
      border-radius: 14px;
      overflow: hidden;
      gap: 0;
    }
    .a-notes-hdr { display: none; }
    .a-notes-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 14px 18px;
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: #2A2520;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-align: left;
      min-height: 48px;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .a-notes-body { padding: 4px 18px 18px; gap: 14px; }
    .a-notes-body.a-hidden { display: none; }

    /* Bigger pill tap targets on mobile */
    .a-pill { min-height: 44px; padding: 10px 14px; font-size: 12px; }
  }
`;

// ── Components ──

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
);

// ScreenShell — phone bezel on desktop, plain card on mobile (CSS-driven).
const ScreenShell = ({ children, noStatusBar = false }) => (
  <div className="a-shell">
    {!noStatusBar && (
      <div className="a-shell-bar" aria-hidden="true">
        <span>9:41</span>
        <div style={{ width: 126, height: 32, borderRadius: 16, background: C.text }} />
        <span style={{ fontSize: 11 }}>●●●</span>
      </div>
    )}
    <div className="a-shell-body">{children}</div>
  </div>
);

const BackBtn = ({ onClick, label = "Back" }) => (
  <button className="a-back" onClick={onClick} aria-label={label}>
    <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>‹</span>
    <span>{label}</span>
  </button>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
    textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14,
  }}>{children}</div>
);

const Btn = ({ children, variant = "primary", onClick, style = {}, ariaLabel }) => {
  const base = {
    padding: "15px 24px", borderRadius: 10, fontSize: 13.5,
    fontWeight: 500, fontFamily: font.sans, cursor: "pointer",
    width: "100%", letterSpacing: "0.02em", transition: "all 0.2s",
    border: "none", minHeight: 48, touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  };
  const variants = {
    primary: { background: C.text, color: C.bg },
    secondary: { background: "transparent", color: C.text, border: `1.5px solid ${C.border}` },
    amber: { background: C.amber, color: "#fff" },
    ghost: { background: "transparent", color: C.textSecondary, border: "none" },
  };
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const AmberMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
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
      color: isSystem ? C.textSecondary : C.amberDark,
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
  <ScreenShell noStatusBar>
    <div style={{ padding: "48px 32px 32px" }}>
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
          <div key={i} style={{ padding: "12px 0", borderTop: `1px solid ${C.borderLight}` }}>
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
  </ScreenShell>
);

const overviewNotes = [
  "This screen frames the prototype as a research artefact. It establishes the research question and the scope of the interaction before the viewer enters the flow.",
  "The broader research landscape was mapped in Framing and Cartography Assessment 1 across six interconnected zones. This prototype addresses one layer within that cartography: the design of relational infrastructure for trusted, purposeful connection among stewards of significant capital.",
  "The prototype's structure is: one relational arc (invitation → elicitation → understanding → rationale → consent → introduction → outcome), deepened by a bridge pathway layer (screen H), a governance screen, and a community intelligence view. The bridge pathway is the most significant structural addition — it is Amber's reputation and recommendation layer, the mechanism by which Amber reaches beyond its direct membership through trusted member networks.",
  "The research question responds directly to Re:Form Assessment 1's finding that legacy elite networks keep the mechanism of connection offstage. This prototype brings that mechanism onstage — but stages it with discretion, explanation, and consent.",
];

// ═══════════════════════════════════════════
// SCREEN A — Invitation
// ═══════════════════════════════════════════

const InviteScreen = ({ onNav }) => (
  <ScreenShell>
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
            flexShrink: 0,
          }} aria-hidden="true">R</div>
          <div>
            <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 14, color: C.text }}>Rebecca Thornton</div>
            <div style={{ fontFamily: font.sans, fontSize: 12, color: C.textSecondary }}>Family Office Principal</div>
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
  </ScreenShell>
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
  <ScreenShell>
    <div style={{ padding: "20px 32px 32px" }}>
      <BackBtn onClick={() => onNav(S.INVITE)} label="Back to invitation" />

      <ScreenChip type="member" />
      <h2 style={{
        fontFamily: font.serif, fontSize: 26, fontWeight: 500,
        color: C.text, margin: "0 0 10px", lineHeight: 1.2,
      }}>About Amber</h2>
      <p style={{
        fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
        margin: "0 0 6px", lineHeight: 1.7,
      }}>
        Amber is private relational infrastructure for stewards of significant capital — designed for people whose decisions carry weight, and for whom the right connection can change the quality of a question, a conversation, or a course of action.
      </p>
      <p style={{
        fontFamily: font.sans, fontSize: 13, color: C.textSecondary,
        margin: "0 0 28px", lineHeight: 1.7,
      }}>
        Through its reputation and recommendation layer, Amber can reach beyond its immediate membership — activating trusted member networks when a direct introduction is not available.
      </p>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "18px 20px", marginBottom: 14,
      }}>
        <SectionLabel>Who Amber is for</SectionLabel>
        <p style={{ fontFamily: font.sans, fontSize: 13, color: C.text, lineHeight: 1.65, margin: 0 }}>
          Principals, next-generation wealth holders, family office decision-makers, and capital holders acting in their own right.
        </p>
      </div>

      <div style={{
        background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
        borderRadius: 12, padding: "18px 20px", marginBottom: 18,
      }}>
        <SectionLabel>Who Amber is not for</SectionLabel>
        <p style={{ fontFamily: font.sans, fontSize: 13, color: C.textSecondary, lineHeight: 1.65, margin: 0 }}>
          Advisers, consultants, fundraisers, recruiters, service providers, or others seeking access to members without holding capital decision-making responsibility themselves.
        </p>
      </div>

      <div style={{ marginBottom: 18 }}>
        {[
          "No feed. No directory. No noise.",
          "No browsing. Introductions arrive when relevant.",
          "Context before contact. Consent before connection.",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }} aria-hidden="true">◆</span>
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
  </ScreenShell>
);

const aboutNotes = [
  "'Private relational infrastructure' distinguishes Amber from networking apps. Infrastructure implies permanence, purpose-built design, and something the community builds on over time — not merely a space to be in. The phrase also signals that Amber's value compounds: every introduction, every outcome, every bridge strengthens the system.",
  "The reputation and recommendation layer is named explicitly on this screen — members understand before joining that Amber can reach beyond its direct membership through trusted bridges, and that this is governed by strict member controls and the reciprocity principle.",
  "Earlier linguistic analysis of elite membership organisations (The Right Word Assessment 2) found that exclusion is often performed through invitation language, fit signals, and selective access rituals rather than blunt criteria. Amber makes that boundary logic visible and intentional: the excluded categories are named, not implied.",
  "The 'Who Amber is not for' section names specific excluded categories (advisers, consultants, fundraisers). This is necessary because many elite networks fail by admitting intermediaries. But the tone is matter-of-fact, not hostile — it states a structural boundary, not a social judgement.",
  "The selectivity line — 'the quality of the network depends on the quality of its membership' — states the principle plainly. Bourdieu's analysis of social capital reproduction informs the design: controlled access is made transparent rather than mystified.",
];

// ═══════════════════════════════════════════
// SCREEN C — Apply to Join
// ═══════════════════════════════════════════

const ApplyScreen = ({ onNav }) => (
  <ScreenShell>
    <div style={{ padding: "20px 32px 32px" }}>
      <BackBtn onClick={() => onNav(S.ABOUT)} label="Back to About Amber" />

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
              flexShrink: 0,
            }} aria-hidden="true">
              {i === 1 && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.amber }} />}
            </div>
            <span style={{
              fontFamily: font.sans, fontSize: 13,
              color: i === 1 ? C.text : C.textSecondary,
            }}>{role}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: C.amberLight, border: `1px solid ${C.amberBorder}`,
        borderRadius: 10, padding: 14, marginBottom: 16,
      }}>
        <p style={{ fontFamily: font.sans, fontSize: 12.5, color: C.amberDark, lineHeight: 1.6, margin: 0 }}>
          I am applying in my own capacity as a capital holder, principal, or next-generation family member — not as an external adviser or intermediary.
        </p>
      </div>

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
              flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
              background: mode === "Type" ? C.text : C.surface,
              color: mode === "Type" ? C.bg : C.textSecondary,
              fontFamily: font.sans, fontSize: 11.5, fontWeight: 500,
              border: mode === "Voice" ? `1px solid ${C.border}` : "none",
            }}>{mode}</div>
          ))}
        </div>
      </div>

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
            <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }} aria-hidden="true">◆</span>
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
          }} aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 5.2L4.2 6.8L7.5 3.2" stroke={C.amber} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily: font.sans, fontSize: 12, color: C.text }}>
            I have read and agree to the Amber Member Code
          </span>
        </div>
      </div>

      <div style={{
        background: C.cream, borderRadius: 10, padding: 14,
        marginBottom: 24, borderLeft: `3px solid ${C.amber}`,
      }}>
        <p style={{
          fontFamily: font.sans, fontSize: 12, color: C.amberDark, lineHeight: 1.6, margin: 0,
        }}>
          Amber reviews each application to confirm role, fit, and context before membership is activated. This is not instant access — it is considered admission.
        </p>
      </div>

      <Btn onClick={() => onNav(S.ELICIT_INTRO)}>Submit application</Btn>
    </div>
  </ScreenShell>
);

const applyNotes = [
  "This screen does the role, fit, and covenant work. The role declaration makes the applicant's position overt — sorting for principals and capital holders rather than intermediaries. The applicant declaration makes this commitment explicit and personal.",
  "Verification is conversational-first: Amber will learn about the applicant through conversation, not a checklist. A next-gen who does not yet hold a formal role can still describe their context. Supporting signals (professional profile, email, background review) are available but conditional.",
  "The human review note makes clear that membership is not automatic. 'This is not instant access — it is considered admission.' This names the human-in-the-loop step and signals that Amber's selectivity is real, not performative.",
  "The Member Code is framed as a covenant — 'I will' rather than 'do not' — though the final principle is a clear prohibition. It establishes behavioural norms before any introduction is made, shaping culture through commitment.",
];

// ═══════════════════════════════════════════
// SCREEN D — Elicitation Intro
// ═══════════════════════════════════════════

const ElicitIntroScreen = ({ onNav }) => (
  <ScreenShell>
    <div style={{ padding: "20px 32px 32px" }}>
      <BackBtn onClick={() => onNav(S.APPLY)} label="Back to Apply" />

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
          { label: "Tension", desc: "The questions and challenges you are navigating" },
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
              fontWeight: 500, marginTop: 2, flexShrink: 0, minWidth: 60,
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
          fontFamily: font.sans, fontSize: 12, color: C.amberDark, lineHeight: 1.6, margin: 0,
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
  </ScreenShell>
);

const elicitIntroNotes = [
  "Frames elicitation as guided reflection rather than data extraction. This draws on Pescetelli's research: structured articulation improves judgement and decision quality. The conversation is the product, not a step before the product.",
  "Members can type or speak — the interface supports both modes. This matters because many members in this context are accustomed to conversation, not forms. Voice lowers the friction of self-description and produces richer, more natural context.",
  "The five listening dimensions — context, tension, counterpart, style, timing — establish that Amber's understanding is dynamic and multi-layered. This is what enables the non-superficial matching visible on the Match Rationale screen.",
  "Consent is surfaced before data collection begins — privacy by design, not privacy by afterthought. The visual tone models the conversational quality Amber aspires to produce.",
];

// ═══════════════════════════════════════════
// SCREEN E — Elicitation Chat
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
    <ScreenShell>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
        <div style={{
          padding: "8px 24px 14px", borderBottom: `1px solid ${C.borderLight}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <button onClick={() => onNav(S.ELICIT_INTRO)}
            aria-label="Back to Elicitation Intro"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 8, marginLeft: -8, minWidth: 44, minHeight: 44,
              color: C.textMuted, fontSize: 18, lineHeight: 1,
            }}>‹</button>
          <AmberMark size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 13.5, color: C.text }}>Amber</div>
            <div style={{ fontFamily: font.mono, fontSize: 9.5, color: C.textMuted }}>Elicitation · listening</div>
          </div>
          <div style={{
            display: "flex", gap: 4, alignItems: "center",
            padding: "3px 8px", borderRadius: 6,
            background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
            flexShrink: 0,
          }} aria-hidden="true">
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
              width: "100%", padding: "14px", borderRadius: 10, minHeight: 48,
              border: `1.5px dashed ${C.border}`, background: C.surfaceWarm,
              color: C.textSecondary, fontFamily: font.sans, fontSize: 12.5,
              cursor: "pointer", touchAction: "manipulation",
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
    </ScreenShell>
  );
};

const elicitChatNotes = [
  "The conversation surfaces timing, tension, and preferred counterpart — not keywords or categories. It is closer to structured coaching than chatbot interaction. This is what makes the downstream matching non-superficial.",
  "Amber's questions help the member clarify their own thinking. This reflects Pescetelli's work on how better articulation improves social learning and judgement quality — the elicitation is itself a valuable service, not just a data-gathering step.",
  "The responses reveal what no static profile could: that this member wants challenge with cultural fit, that the need is active and time-bounded, that they distrust advisory-mode interactions. These are relational signals, not demographics.",
  "The tone is perceptive and non-intrusive. Amber reflects back what it hears rather than steering the member toward pre-determined categories. The system is designed to understand, not to classify.",
];

// ═══════════════════════════════════════════
// SCREEN F — What Amber Has Understood
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
    <ScreenShell>
      <div style={{ padding: "20px 32px 32px" }}>
        <BackBtn onClick={() => onNav(S.ELICIT_CHAT)} label="Back to Elicitation" />

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
                <button style={{
                  fontFamily: font.mono, fontSize: 9, color: C.textMuted,
                  cursor: "pointer", background: "none", border: "none",
                  padding: "8px 4px", minHeight: 32,
                }} aria-label={`Edit ${f.label}`}>Edit</button>
              </div>
              <div style={{
                fontFamily: font.sans, fontSize: 12.5, color: C.text,
                lineHeight: 1.55,
              }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: font.mono, fontSize: 9, color: C.textMuted,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
        }}>Longer-term picture</div>
        <div style={{
          background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
          borderRadius: 12, padding: "14px 20px", marginBottom: 16,
        }}>
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

          <div style={{ marginBottom: 14, paddingTop: 10, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
            }}>Other active threads</div>
            {longTerm[1].items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0" }}>
                <span style={{ color: C.amber, fontSize: 6, marginTop: 6, flexShrink: 0 }} aria-hidden="true">◆</span>
                <span style={{ fontFamily: font.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 10, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9.5, color: C.textMuted,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
            }}>Introduction history</div>
            {longTerm[2].items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0" }}>
                <span style={{ color: C.textMuted, fontSize: 6, marginTop: 6, flexShrink: 0 }} aria-hidden="true">◇</span>
                <span style={{ fontFamily: font.sans, fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>{item}</span>
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
    </ScreenShell>
  );
};

const understoodNotes = [
  "This screen separates situational context (what emerged from this conversation) from the longer-term picture (accumulated themes, other active threads, introduction history). This demonstrates that Amber's understanding is not a single-interaction snapshot but an evolving relational model.",
  "The 'other active threads' section shows that a member may be navigating succession, climate stewardship, and family systems questions simultaneously — each requiring a different kind of introduction. Amber tracks these separately and can match for different purposes in parallel.",
  "Introduction history feeds back into future judgement. Amber knows that this member responded well to lived experience and poorly to advisory-mode interactions, and will weight future suggestions accordingly.",
  "Member control remains foregrounded: every situational field has an 'Edit' affordance. The member is the authority over their own representation — consistent with Shneiderman's emphasis on user control in human-centred AI.",
];

// ═══════════════════════════════════════════
// SCREEN G — Match Rationale (4 states)
// ═══════════════════════════════════════════

const MatchScreen = ({ onNav }) => {
  const [matchState, setMatchState] = useState("strong");
  const states = [
    { key: "strong", label: "Direct" },
    { key: "partial", label: "Considered" },
    { key: "bridge", label: "Bridge" },
    { key: "hold", label: "Watching" },
  ];
  return (
    <ScreenShell>
      <div style={{ padding: "20px 32px 32px" }}>
        <BackBtn onClick={() => onNav(S.UNDERSTOOD)} label="Back to Understanding" />

        <ScreenChip type="member" />

        <div role="group" aria-label="Match state — prototype demonstration"
          style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {states.map(s => (
            <button
              key={s.key}
              className="a-pill"
              onClick={() => setMatchState(s.key)}
              aria-pressed={matchState === s.key}
              style={{
                border: matchState === s.key ? `1.5px solid ${C.text}` : `1px solid ${C.border}`,
                background: matchState === s.key ? C.text : C.surface,
                color: matchState === s.key ? C.bg : C.textSecondary,
              }}
            >{s.label}</button>
          ))}
        </div>

        {matchState === "strong" && (<>
          <SectionLabel>Suggested introduction</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 99, background: C.surfaceWarm,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1.5px solid ${C.border}`, flexShrink: 0,
            }} aria-hidden="true">
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
                <span style={{ color: C.amber, fontSize: 7 }} aria-hidden="true">◆</span>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary }}>{t}</span>
              </div>
            ))}
            <SectionLabel>Where it diverges</SectionLabel>
            {["Institutional rather than family context", "Timing may not align as closely"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
                <span style={{ color: C.textMuted, fontSize: 7 }} aria-hidden="true">◇</span>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary }}>{t}</span>
              </div>
            ))}
          </div>

          <Btn variant="amber" onClick={() => onNav(S.CONSENT)}>Review this introduction</Btn>
          <div style={{ marginTop: 10 }}>
            <Btn variant="secondary" onClick={() => setMatchState("hold")}>Ask Amber to wait</Btn>
          </div>
        </>)}

        {matchState === "bridge" && (<>
          <div style={{
            background: C.surface, border: `1.5px solid ${C.amber}`,
            borderRadius: 14, padding: "22px 20px", marginBottom: 18,
          }}>
            <div style={{
              fontFamily: font.mono, fontSize: 10, color: C.amber,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
            }}>Amber's assessment</div>
            <p style={{ fontFamily: font.sans, fontSize: 13.5, color: C.text, lineHeight: 1.75, margin: "0 0 14px" }}>
              I don't have a direct match for you right now. But I have identified a credible path — through a member whose background suggests they may know the right person.
            </p>
            <p style={{ fontFamily: font.sans, fontSize: 13, color: C.textSecondary, lineHeight: 1.7, margin: 0 }}>
              I am going to ask them discreetly whether they can help. This is Amber's reputation and recommendation layer — activating trusted member networks when direct matching reaches its limit.
            </p>
          </div>

          <div style={{
            background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
            borderRadius: 12, padding: "16px 20px", marginBottom: 18,
          }}>
            <SectionLabel>What this means for you</SectionLabel>
            {[
              "A trusted member will be asked privately whether they know someone relevant",
              "If they do, they can introduce you themselves — or ask Amber to connect the three of you on WhatsApp",
              "If they decline or don't reply, nothing happens and you are not informed of the approach",
              "If successful, Amber will return to you with a warm, contextualised introduction",
            ].map((t, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0",
                borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none",
              }}>
                <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }} aria-hidden="true">◆</span>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: C.cream, borderRadius: 10, padding: 14,
            marginBottom: 20, borderLeft: `3px solid ${C.amber}`,
          }}>
            <p style={{ fontFamily: font.sans, fontSize: 12, color: C.amberDark, lineHeight: 1.6, margin: 0 }}>
              Amber will return within a few days. This pathway takes a little more time than a direct introduction — because it is being handled with the same care and discretion.
            </p>
          </div>

          <Btn variant="secondary" onClick={() => onNav(S.BRIDGE)}>See how the bridge pathway works →</Btn>
          <div style={{ marginTop: 10 }}>
            <Btn variant="ghost" onClick={() => setMatchState("strong")}>View direct match (prototype demo)</Btn>
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
    </ScreenShell>
  );
};

const matchNotes = [
  "This screen has four states: a direct introduction, a considered suggestion with candid caveats, a bridge pathway through a trusted member, and a hold. All four demonstrate that Amber exercises judgement rather than claiming omniscience. Not introducing someone yet — or routing through a trusted bridge — are both quality outcomes, not failures.",
  "The suggested member is anonymised before consent: role level, broad geography, and relevant experience — but no name or identifying detail. In a narrow elite network, even city and specific role could identify someone. The name is disclosed only after mutual opt-in, making the privacy architecture coherent with Amber's consent logic.",
  "The five structured dimensions — shared context, productive difference, decision relevance, conversation fit, timing — demonstrate relational judgement, not keyword matching. The separation of shared context from productive difference draws on Burt's structural holes and Granovetter's weak ties: value comes from bridging, not clustering.",
  "The bridge pathway state introduces Amber's reputation and recommendation layer — the mechanism by which Amber reaches beyond its direct membership through trusted member networks. This is the moment where Amber moves from a closed matching engine to a relationship-routing system. Screen H shows this flow in detail.",
  "This screen is the beginning of Amber's governance architecture. Explanation is not a UX convenience — it is a condition of trustworthy AI. Match Rationale is where Amber's intelligence becomes legible; Governance is where that legibility becomes accountable.",
];

// ═══════════════════════════════════════════
// SCREEN H — Bridge Pathway
// ═══════════════════════════════════════════

const BridgeScreen = ({ onNav }) => {
  const [bridgeTab, setBridgeTab] = useState("callout");
  const tabs = [
    { key: "callout", label: "Amber's approach" },
    { key: "handoff", label: "Handoff" },
    { key: "followup", label: "Follow-up" },
  ];
  return (
    <ScreenShell>
      <div style={{ padding: "20px 32px 32px" }}>
        <BackBtn onClick={() => onNav(S.MATCH)} label="Back to Match Rationale" />

        <ScreenChip type="system" />
        <h2 style={{
          fontFamily: font.serif, fontSize: 24, fontWeight: 500,
          color: C.text, margin: "0 0 6px", lineHeight: 1.25,
        }}>Bridge Pathway</h2>
        <p style={{
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
          margin: "0 0 18px", lineHeight: 1.6,
        }}>
          Amber's reputation and recommendation layer — how trusted member networks are activated when direct matching reaches its limit.
        </p>

        <div role="tablist" aria-label="Bridge pathway phases"
          style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={bridgeTab === t.key}
              className="a-pill"
              onClick={() => setBridgeTab(t.key)}
              style={{
                border: bridgeTab === t.key ? `1.5px solid ${C.text}` : `1px solid ${C.border}`,
                background: bridgeTab === t.key ? C.text : C.surface,
                color: bridgeTab === t.key ? C.bg : C.textSecondary,
                fontSize: 10.5,
              }}
            >{t.label}</button>
          ))}
        </div>

        {bridgeTab === "callout" && (<>
          <SectionLabel>What Member B receives from Amber</SectionLabel>
          <div style={{
            background: C.surface, border: `1.5px solid ${C.amber}`,
            borderRadius: 14, padding: "20px", marginBottom: 18,
          }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9, color: C.amber,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12,
            }}>From Amber · Private</div>
            <p style={{ fontFamily: font.serif, fontSize: 14.5, color: C.text, lineHeight: 1.75, fontStyle: "italic", margin: "0 0 12px" }}>
              I'm trying to help a member connect with someone who has experience of intergenerational family governance — a next-generation principal navigating when and how to reorient family capital toward impact. Given your background, I wondered whether you might know someone who would be open to a conversation?
            </p>
            <p style={{ fontFamily: font.sans, fontSize: 11.5, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
              You are under no obligation to respond. If this isn't something you can help with right now, there is nothing to do.
            </p>
          </div>

          <SectionLabel>Member B's response options</SectionLabel>
          {[
            { label: "I know someone — happy to help", active: true },
            { label: "I might know someone — let me check", active: false },
            { label: "I don't know anyone suitable", active: false },
          ].map((opt, i) => (
            <div key={i} style={{
              padding: "14px 16px", borderRadius: 10, marginBottom: 8,
              background: opt.active ? C.amberLight : C.surface,
              border: `1px solid ${opt.active ? C.amberBorder : C.border}`,
              minHeight: 44,
              display: "flex", alignItems: "center",
            }}>
              <span style={{
                fontFamily: font.sans, fontSize: 13,
                color: opt.active ? C.amberDark : C.textSecondary,
                fontWeight: opt.active ? 500 : 400,
              }}>{opt.label}</span>
            </div>
          ))}
          <div style={{ background: C.surfaceWarm, borderRadius: 8, padding: 12, marginTop: 4 }}>
            <p style={{ fontFamily: font.sans, fontSize: 11.5, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
              Non-reply is treated identically to a quiet decline. No follow-up. No record of the approach shared with anyone.
            </p>
          </div>
        </>)}

        {bridgeTab === "handoff" && (<>
          <SectionLabel>When B confirms they can help</SectionLabel>
          <p style={{ fontFamily: font.sans, fontSize: 13, color: C.textSecondary, lineHeight: 1.65, margin: "0 0 16px" }}>
            Amber shares brief context about the requesting member, confirms B still wishes to proceed, then asks:
          </p>
          <div style={{
            background: C.surface, border: `1.5px solid ${C.amber}`,
            borderRadius: 14, padding: "20px", marginBottom: 20,
          }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9, color: C.amber,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12,
            }}>From Amber · Private</div>
            <p style={{ fontFamily: font.serif, fontSize: 14.5, color: C.text, lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>
              Would you like to make this introduction yourself — in your own voice, through your own channel? Or shall I connect the three of you on WhatsApp, so they can take it from there?
            </p>
          </div>

          {[
            {
              label: "Option A — B makes the introduction",
              desc: "B uses their own relationship with X. Amber provides a brief context note to draw on if useful. The introduction carries B's full personal weight and voice.",
            },
            {
              label: "Option B — Amber connects via WhatsApp",
              desc: "Amber creates a WhatsApp group with the requesting member, B, and X. Amber sends a single, considered introduction message and steps back. B is released from further obligation while retaining the relational credit.",
            },
          ].map((opt, i) => (
            <div key={i} style={{
              background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
              borderRadius: 12, padding: "16px 18px", marginBottom: 10,
            }}>
              <div style={{
                fontFamily: font.mono, fontSize: 9.5, color: C.amber,
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7,
              }}>{opt.label}</div>
              <p style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>{opt.desc}</p>
            </div>
          ))}
        </>)}

        {bridgeTab === "followup" && (<>
          <SectionLabel>One week later — if no introduction has been made</SectionLabel>
          <div style={{
            background: C.surface, border: `1.5px solid ${C.amber}`,
            borderRadius: 14, padding: "20px", marginBottom: 18,
          }}>
            <div style={{
              fontFamily: font.mono, fontSize: 9, color: C.amber,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12,
            }}>From Amber · Private</div>
            <p style={{ fontFamily: font.serif, fontSize: 14.5, color: C.text, lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>
              You kindly offered to connect them. I think they'd enjoy knowing each other. Would you still like to make that happen — or has the moment passed?
            </p>
          </div>
          <p style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.65, margin: "0 0 20px" }}>
            Warm, not transactional. It reminds B of their own stated intention rather than chasing a task. "Or has the moment passed?" gives B a graceful exit — acknowledging that introductions are time-sensitive social acts.
          </p>

          <div style={{ height: 1, background: C.borderLight, margin: "0 0 18px" }} />
          <SectionLabel>Post-introduction outcome check-in (all pathways)</SectionLabel>
          <div style={{
            background: C.cream, border: `1px solid ${C.amberBorder}`,
            borderRadius: 12, padding: "16px 18px", marginBottom: 14,
          }}>
            <p style={{ fontFamily: font.serif, fontSize: 15, color: C.amberDark, fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
              "It's been a week. Was the conversation useful?"
            </p>
          </div>
          <p style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.65, margin: 0 }}>
            The same follow-up applies whether Amber made the introduction directly, a partial match was accepted, or a bridge member facilitated it. Consistency across all four pathways is a governance principle, not a design convenience. Outcome data improves future matching and bridge identification — without individual attribution.
          </p>
        </>)}
      </div>
    </ScreenShell>
  );
};

const bridgeNotes = [
  "The bridge pathway is Amber's reputation and recommendation layer in operation. When direct matching reaches its limit, Amber activates trusted member networks rather than returning a dead end. This encodes a behaviour that already exists in elite networks — 'I think you should meet X, let me see if I can arrange that' — and gives it governed infrastructure for the first time.",
  "Amber approaches Member B individually and privately, never via a broadcast. The framing is an invitation ('I wondered whether you might know someone'), not a task. Non-reply closes the loop identically to a quiet decline — no follow-up, no record of the approach shared with the requesting member. B's social capital is protected at every stage.",
  "The handoff question gives B genuine agency: make the introduction in their own voice and channel, or let Amber facilitate via a WhatsApp group of three. Both options preserve B's relational credit. Option B absorbs the administrative friction — composing a message, managing the thread — while B retains the social weight of having facilitated the connection.",
  "Reciprocity is a structural principle of the bridge layer: members must be willing to act as bridge nodes to receive bridge introductions. Members who contribute are acknowledged directly and privately by Amber — not through a badge or metric, but through a considered note that their contribution produced something useful.",
];

// ═══════════════════════════════════════════
// SCREEN I — Double Opt-In / Consent
// ═══════════════════════════════════════════

const ConsentScreen = ({ onNav }) => {
  const [memberConsent, setMemberConsent] = useState(null);
  return (
    <ScreenShell>
      <div style={{ padding: "20px 32px 32px" }}>
        <BackBtn onClick={() => onNav(S.MATCH)} label="Back to Match Rationale" />

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
              }} aria-hidden="true">
                {s.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 5.2L4.2 6.8L7.5 3.2" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                {s.active && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.amber }} />}
              </div>
              <span style={{
                fontFamily: font.sans, fontSize: 13,
                color: s.done ? C.text : s.active ? C.text : C.textSecondary,
                fontWeight: s.active ? 600 : 400,
              }}>{s.label}</span>
              {s.waiting && <span style={{ fontFamily: font.mono, fontSize: 10, color: C.textMuted, marginLeft: "auto" }}>Waiting</span>}
            </div>
          ))}
        </div>

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
              gap: 12, padding: "9px 0",
              borderBottom: i < 4 ? `1px solid rgba(184,146,62,0.12)` : "none",
            }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.text }}>{c.label}</span>
                {c.note && <div style={{ fontFamily: font.mono, fontSize: 9, color: C.textSecondary, marginTop: 1 }}>{c.note}</div>}
              </div>
              <span style={{
                fontFamily: font.mono, fontSize: 10, flexShrink: 0,
                color: c.shared ? C.amber : C.textSecondary,
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
    </ScreenShell>
  );
};

const consentNotes = [
  "Consent is a designed part of the experience, not legal compliance. The double opt-in flow is visible, sequential, and explained at every step. This makes the mechanism of mutual protection legible without collapsing discretion.",
  "The other member remains anonymised throughout consent. 'What the other member will see' specifies disclosure granularly: themes are visible, specific words are not; first name is shared, surname is withheld. Names are revealed only after both parties opt in — completing the privacy staging begun on the Match Rationale screen.",
  "The three response options — accept, defer, refine — give the member agency without pressure. 'Refine suggestion' loops back upstream, maintaining human control over the AI's interpretation at every step.",
  "The status diagram makes the sequential, mutual nature of the process legible. The final step — 'Names revealed · introduction made' — signals that identity disclosure is the culmination of consent, not its precondition.",
];

// ═══════════════════════════════════════════
// SCREEN J — Introduction Handoff
// ═══════════════════════════════════════════

const HandoffScreen = ({ onNav }) => (
  <ScreenShell>
    <div style={{ padding: "20px 32px 32px" }}>
      <BackBtn onClick={() => onNav(S.CONSENT)} label="Back to Consent" />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }} aria-hidden="true">
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
          fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, margin: 0,
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
          fontFamily: font.sans, fontSize: 12, color: C.amberDark, lineHeight: 1.6, margin: 0,
        }}>
          Amber will check in after a reasonable interval to understand what was useful. There is no rush — reflection matters more than speed.
        </p>
      </div>

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
  </ScreenShell>
);

const handoffNotes = [
  "The introduction text is warm, specific, and controlled — it explains the relevance without overexposing either party. Names appear here for the first time, completing the privacy staging from Match Rationale through Consent.",
  "The first interaction happens inside Amber, between members directly. There is no EA layer, no external channel handoff, no intermediary. This is a deliberate design choice: Amber makes the introduction and then steps back. Members choose for themselves whether to move elsewhere later.",
  "Follow-through prompts are stacked for readability — each has a temporal label and a short description. They are Amber-initiated, paced, and non-intrusive: closer to a thoughtful check-in than a chatbot notification.",
  "Pacing is visibly designed into the flow. Amber spaces introductions to preserve quality — not as artificial scarcity, but as stewardship. The cadence communicates that each introduction carries weight.",
];

// ═══════════════════════════════════════════
// SCREEN K — Outcome / Follow-through
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
    <ScreenShell>
      <div style={{ padding: "20px 32px 32px" }}>
        <BackBtn onClick={() => onNav(S.HANDOFF)} label="Back to Introduction" />

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

        <div role="radiogroup" aria-label="Outcome reflection" style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "4px 0", marginBottom: 24,
        }}>
          {options.map((opt, i) => (
            <button
              key={i}
              role="radio"
              aria-checked={selected === i}
              onClick={() => setSelected(i)}
              style={{
                width: "100%", textAlign: "left",
                padding: "14px 20px", cursor: "pointer", minHeight: 48,
                borderBottom: i < options.length - 1 ? `1px solid ${C.borderLight}` : "none",
                borderTop: "none", borderLeft: "none", borderRight: "none",
                display: "flex", alignItems: "center", gap: 14,
                background: selected === i ? C.cream : "transparent",
                transition: "background 0.15s",
                fontFamily: font.sans, fontSize: 13,
                color: selected === i ? C.text : C.textSecondary,
                touchAction: "manipulation",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 99,
                border: `1.5px solid ${selected === i ? C.amber : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }} aria-hidden="true">
                {selected === i && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.amber }} />}
              </div>
              <span>{opt}</span>
            </button>
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
                  borderBottom: i < 2 ? `1px solid ${C.borderLight}` : "none",
                }}>
                  <span style={{ color: C.amber, fontSize: 7, marginTop: 6, flexShrink: 0 }} aria-hidden="true">◆</span>
                  <span style={{ fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55 }}>{update}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: C.cream, borderRadius: 10, padding: 14,
              marginBottom: 24, borderLeft: `3px solid ${C.amber}`,
            }}>
              <p style={{
                fontFamily: font.sans, fontSize: 12, color: C.amberDark, lineHeight: 1.6, margin: 0,
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
    </ScreenShell>
  );
};

const outcomeNotes = [
  "Amber learns from relational outcomes, not engagement metrics. The feedback categories capture whether challenge or similarity was useful, whether timing was right, whether the counterpart felt like a peer or an adviser. These signals make the next suggestion more precise and the system less likely to repeat what didn't work.",
  "The explicit update items make the learning loop legible: timing preferences, counterpart criteria, which forms of follow-through create value, and what kinds of introductions should happen less often. This transforms Amber from a matching tool into an evolving relational intelligence system.",
  "The pacing indicator ('a new introduction window opens in 14 days') makes cadence visible. Amber spaces introductions to preserve quality and follow-through — not as artificial scarcity, but as stewardship. Each introduction carries weight.",
  "Individual outcomes accumulate into the broader intelligence visible on the Community screen. This completes the feedback loop: conversation → understanding → introduction → outcome → refined understanding → community intelligence.",
];

// ═══════════════════════════════════════════
// SCREEN L — Governance
// ═══════════════════════════════════════════

const GovernanceScreen = ({ onNav }) => (
  <ScreenShell>
    <div style={{ padding: "20px 32px 32px" }}>
      <BackBtn onClick={() => onNav(S.OUTCOME)} label="Back to Outcome" />

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
  </ScreenShell>
);

const governanceNotes = [
  "This screen makes governance visible as a designed product feature, not back-office compliance. Each principle is stated plainly so that a member — or an academic viewer — can assess the system's ethical commitments at a glance.",
  "The principles directly reflect Shneiderman's Human-Centered AI framework: intelligibility (members can see what Amber understood), human oversight (automation is bounded, not total), user control (memory is editable and deletable), and explanation (rationale accompanies every suggestion). AI here is positioned as support for human judgement, not its replacement.",
  "Match Rationale is where Amber's intelligence becomes legible. This screen is where that legibility becomes accountable. Together they form a single argument: that explanation and governance are not separate concerns but two sides of trustworthy relational infrastructure.",
  "The closing question — 'can explanation carry the same trust-producing weight as discretion alone?' — restates the research question. The prototype invites the viewer to evaluate whether bringing the mechanism of connection onstage, under governance, can produce trust rather than erode it.",
];

// ═══════════════════════════════════════════
// SCREEN M — Community Trends
// ═══════════════════════════════════════════

const TrendsScreen = ({ onNav }) => {
  const themes = [
    { label: "Succession & governance", pct: 72, trend: "Prominent" },
    { label: "Climate stewardship", pct: 58, trend: "Prominent" },
    { label: "Next-gen identity & role clarity", pct: 45, trend: "Emerging" },
    { label: "Measuring impact", pct: 34, trend: "Declining" },
    { label: "Family systems & mediation", pct: 22, trend: "Niche" },
  ];

  const trendColor = (t) => t === "Prominent" ? C.amber : t === "Emerging" ? C.amberDark : t === "Declining" ? C.textSecondary : "#8A8680";

  const signals = [
    { label: "Introductions", value: "14 this quarter", note: "across 9 distinct thematic pairings" },
    { label: "Follow-through", value: "11 led to conversation", note: "4 led to a second meeting or ongoing exchange" },
    { label: "Highest-value outcome", value: "1 co-investment", note: "originated from a governance-climate bridge introduction" },
    { label: "Active demand", value: "Succession, next-gen identity", note: "several members navigating similar transitions simultaneously" },
  ];

  return (
    <ScreenShell>
      <div style={{ padding: "20px 32px 32px" }}>
        <BackBtn onClick={() => onNav(S.GOVERNANCE)} label="Back to Governance" />

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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2, gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: font.sans, fontSize: 12.5, fontWeight: 600, color: C.text }}>{s.label}</span>
                <span style={{ fontFamily: font.mono, fontSize: 10, color: C.amber }}>{s.value}</span>
              </div>
              <span style={{ fontFamily: font.sans, fontSize: 11.5, color: C.textSecondary, lineHeight: 1.5 }}>{s.note}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: C.surfaceWarm, border: `1px solid ${C.borderLight}`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 18,
        }}>
          <SectionLabel>Themes across the community</SectionLabel>
          {themes.map((t, i) => (
            <div key={i} style={{ marginBottom: i < themes.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
                <span style={{ fontFamily: font.sans, fontSize: 12, color: C.text }}>{t.label}</span>
                <span style={{
                  fontFamily: font.mono, fontSize: 9,
                  color: trendColor(t.trend),
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>{t.trend}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: C.borderLight, overflow: "hidden" }} aria-hidden="true">
                <div style={{
                  height: "100%", width: `${t.pct}%`, borderRadius: 2,
                  background: t.trend === "Declining" ? C.textMuted : `linear-gradient(90deg, ${C.amber}, ${C.amberBorder})`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 18,
        }}>
          <SectionLabel>Relational topology</SectionLabel>
          <div style={{
            background: C.surfaceWarm, borderRadius: 8, padding: 14,
            marginBottom: 10, border: `1px solid ${C.borderLight}`,
          }}>
            <svg viewBox="0 0 280 110" width="100%" style={{ display: "block" }} aria-hidden="true">
              <circle cx="60" cy="48" r="26" fill={C.amberLight} stroke={C.amberBorder} strokeWidth="1" />
              <circle cx="45" cy="40" r="3.5" fill={C.amber} opacity="0.7" />
              <circle cx="60" cy="34" r="4" fill={C.amber} opacity="0.8" />
              <circle cx="72" cy="46" r="3.5" fill={C.amber} opacity="0.6" />
              <circle cx="55" cy="56" r="3" fill={C.amber} opacity="0.5" />
              <text x="60" y="84" textAnchor="middle" style={{ fontSize: 7.5, fill: C.textSecondary, fontFamily: "IBM Plex Mono, monospace" }}>Governance</text>

              <circle cx="190" cy="52" r="20" fill={C.amberLight} stroke={C.amberBorder} strokeWidth="1" />
              <circle cx="183" cy="46" r="3.5" fill={C.amber} opacity="0.6" />
              <circle cx="196" cy="44" r="3" fill={C.amber} opacity="0.7" />
              <circle cx="194" cy="58" r="3" fill={C.amber} opacity="0.5" />
              <text x="190" y="84" textAnchor="middle" style={{ fontSize: 7.5, fill: C.textSecondary, fontFamily: "IBM Plex Mono, monospace" }}>Climate</text>

              <line x1="86" y1="48" x2="170" y2="52" stroke={C.amber} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />

              <circle cx="245" cy="38" r="12" fill={C.borderLight} stroke={C.border} strokeWidth="1" strokeDasharray="3 2" />
              <circle cx="242" cy="36" r="2.5" fill={C.textSecondary} opacity="0.3" />
              <circle cx="248" cy="40" r="2" fill={C.textSecondary} opacity="0.25" />
              <text x="245" y="58" textAnchor="middle" style={{ fontSize: 7, fill: C.textSecondary, fontFamily: "IBM Plex Mono, monospace" }}>Forming</text>
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
            fontFamily: font.sans, fontSize: 12, color: C.amberDark, lineHeight: 1.6, margin: 0,
          }}>
            This is a member-facing briefing, not a system dashboard. It shows what the community is navigating collectively — and how individual conversations contribute to a broader picture that no single member can see alone.
          </p>
        </div>
      </div>
    </ScreenShell>
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
  const [announcement, setAnnouncement] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);

  const screenIndex = SCREEN_META.findIndex(s => s.id === screen);
  const prevMeta = screenIndex > 0 ? SCREEN_META[screenIndex - 1] : null;
  const nextMeta = screenIndex < SCREEN_META.length - 1 ? SCREEN_META[screenIndex + 1] : null;
  const currentMeta = SCREEN_META[screenIndex];

  const navigate = (id) => {
    setScreen(id);
    setNotesOpen(false);
    const meta = SCREEN_META.find(s => s.id === id);
    if (meta) {
      const idx = SCREEN_META.findIndex(s => s.id === id);
      setAnnouncement(`Now viewing screen ${idx + 1} of ${SCREEN_META.length}: ${meta.label}`);
    }
  };

  const allNotes = {
    [S.OVERVIEW]: overviewNotes,
    [S.INVITE]: inviteNotes,
    [S.ABOUT]: aboutNotes,
    [S.APPLY]: applyNotes,
    [S.ELICIT_INTRO]: elicitIntroNotes,
    [S.ELICIT_CHAT]: elicitChatNotes,
    [S.UNDERSTOOD]: understoodNotes,
    [S.MATCH]: matchNotes,
    [S.BRIDGE]: bridgeNotes,
    [S.CONSENT]: consentNotes,
    [S.HANDOFF]: handoffNotes,
    [S.OUTCOME]: outcomeNotes,
    [S.GOVERNANCE]: governanceNotes,
    [S.TRENDS]: trendsNotes,
  };

  const screens = {
    [S.OVERVIEW]: <OverviewScreen onNav={navigate} />,
    [S.INVITE]: <InviteScreen onNav={navigate} />,
    [S.ABOUT]: <AboutScreen onNav={navigate} />,
    [S.APPLY]: <ApplyScreen onNav={navigate} />,
    [S.ELICIT_INTRO]: <ElicitIntroScreen onNav={navigate} />,
    [S.ELICIT_CHAT]: <ElicitChatScreen onNav={navigate} />,
    [S.UNDERSTOOD]: <UnderstoodScreen onNav={navigate} />,
    [S.MATCH]: <MatchScreen onNav={navigate} />,
    [S.BRIDGE]: <BridgeScreen onNav={navigate} />,
    [S.CONSENT]: <ConsentScreen onNav={navigate} />,
    [S.HANDOFF]: <HandoffScreen onNav={navigate} />,
    [S.OUTCOME]: <OutcomeScreen onNav={navigate} />,
    [S.GOVERNANCE]: <GovernanceScreen onNav={navigate} />,
    [S.TRENDS]: <TrendsScreen onNav={navigate} />,
  };

  const currentNotes = allNotes[screen] || [];

  return (
    <div style={{ minHeight: "100vh", background: "#F0EDE7", fontFamily: font.sans }}>
      <GlobalStyles />

      <a href="#main-content" className="a-skip">Skip to main content</a>

      {/* ARIA live region — announces screen changes */}
      <div role="status" aria-live="polite" aria-atomic="true" className="a-sr">
        {announcement}
      </div>

      {/* Mobile header — full submission info */}
      <div className="a-hdr-mobile">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <AmberMark size={22} />
          <span style={{ fontFamily: font.mono, fontSize: 9.5, color: C.textSecondary, letterSpacing: "0.08em" }}>
            RESEARCH PROTOTYPE
          </span>
        </div>
        <h1 style={{
          fontFamily: font.serif, fontSize: 26, fontWeight: 500,
          color: C.text, margin: "0 0 8px", lineHeight: 1.2,
        }}>Amber</h1>
        <p style={{
          fontFamily: font.serif, fontSize: 13.5, color: C.textSecondary,
          margin: "0 0 8px", lineHeight: 1.55, fontStyle: "italic",
        }}>
          How might a platform make valuable relational connection more explicit and legible, without losing the trust, discretion, and high-status signals that elite private networks depend on?
        </p>
        <p style={{
          fontFamily: font.mono, fontSize: 9.5, color: C.textSecondary,
          margin: 0, lineHeight: 1.5,
        }}>
          Re:Form Assessment 2 · Product Prototype · Student ID 24000132957 · LIS MASc 2024/26
        </p>
      </div>

      {/* Mobile sticky nav bar (Prev / Progress / Next) */}
      <nav className="a-mobile-nav" aria-label="Prototype screen navigation">
        <button
          className="a-nav-btn"
          onClick={() => prevMeta && navigate(prevMeta.id)}
          disabled={!prevMeta}
          aria-label={prevMeta ? `Previous screen: ${prevMeta.label}` : "No previous screen"}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="a-nav-progress" aria-current="step"
          aria-label={`Screen ${screenIndex + 1} of ${SCREEN_META.length}: ${currentMeta?.label}`}>
          <div style={{
            fontFamily: font.mono, fontSize: 9, color: C.textSecondary,
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            Screen {screenIndex + 1} of {SCREEN_META.length}
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 13, fontWeight: 600, color: C.text, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentMeta?.label}
          </div>
        </div>

        <button
          className={`a-nav-btn${nextMeta ? " a-nav-btn-next" : ""}`}
          onClick={() => nextMeta && navigate(nextMeta.id)}
          disabled={!nextMeta}
          aria-label={nextMeta ? `Next screen: ${nextMeta.label}` : "No next screen"}
        >
          <span aria-hidden="true">›</span>
        </button>
      </nav>

      {/* Desktop header */}
      <div className="a-hdr">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <AmberMark size={28} />
          <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textSecondary, letterSpacing: "0.08em" }}>
            RESEARCH PROTOTYPE
          </span>
        </div>
        <h1 style={{
          fontFamily: font.serif, fontSize: 34, fontWeight: 500,
          color: C.text, margin: "0 0 10px", lineHeight: 1.2,
        }}>Amber</h1>
        <p style={{
          fontFamily: font.serif, fontSize: 17, color: C.textSecondary,
          margin: "0 0 8px", lineHeight: 1.6, maxWidth: 680, fontStyle: "italic",
        }}>
          How might a platform make valuable relational connection more explicit and legible, without losing the trust, discretion, and high-status signals that elite private networks depend on?
        </p>
        <p style={{ fontFamily: font.mono, fontSize: 10.5, color: C.textSecondary, margin: "0 0 24px" }}>
          Re:Form Assessment 2 · Product Prototype · Student ID 24000132957 · LIS MASc 2024/26
        </p>
      </div>

      {/* Desktop tab nav */}
      <nav className="a-tabs" aria-label="Prototype screens">
        {SCREEN_META.map((s, idx) => (
          <button
            key={s.id}
            className="a-tab"
            onClick={() => navigate(s.id)}
            aria-current={screen === s.id ? "step" : undefined}
            aria-label={`Screen ${idx + 1} of ${SCREEN_META.length}: ${s.label}`}
            style={{
              border: screen === s.id ? `1.5px solid ${C.text}` : `1px solid ${C.border}`,
              background: screen === s.id ? C.text : C.surface,
              color: screen === s.id ? C.bg : C.textSecondary,
            }}
          >
            <span style={{ fontFamily: font.mono, fontSize: 10, opacity: 0.5 }} aria-hidden="true">
              {s.short}
            </span>
            {s.label}
          </button>
        ))}
      </nav>

      <main id="main-content">
        <div className="a-layout">
          {screens[screen]}

          <div className="a-notes">
            <div className="a-notes-hdr">Design decisions</div>
            <button
              className="a-notes-toggle"
              aria-expanded={notesOpen}
              aria-controls="a-notes-body"
              onClick={() => setNotesOpen(v => !v)}
            >
              <span>Design annotations ({currentNotes.length})</span>
              <span aria-hidden="true" style={{ fontSize: 18, color: C.amber, lineHeight: 1 }}>
                {notesOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id="a-notes-body"
              className={`a-notes-body${notesOpen ? "" : " a-hidden"}`}
              role="region"
              aria-label={`Design annotations for ${currentMeta?.label}`}
            >
              {currentNotes.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: font.mono, fontSize: 10, color: C.amber,
                    fontWeight: 600, flexShrink: 0, marginTop: 2,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{
                    fontFamily: font.sans, fontSize: 12.5, color: C.textSecondary,
                    lineHeight: 1.65, margin: 0,
                  }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 40px", textAlign: "center" }}>
        <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
        <p style={{
          fontFamily: font.mono, fontSize: 10.5, color: C.textSecondary,
          lineHeight: 1.7, maxWidth: 520, margin: "0 auto",
        }}>
          14 screens · Interactive prototype with design annotations · Navigate using the tabs or the in-screen controls
        </p>
      </div>
    </div>
  );
}
