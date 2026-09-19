/**
 * High-fidelity Vector SVG templates for IRS Form 1040 (Page 1 & 2) and Form W-2
 * Dimensions standard US Letter: 612 x 792 pt
 */

export const SVG_TEMPLATES: Record<string, string> = {
  'IRS-FORM-1040-1': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792" width="100%" height="100%" preserveAspectRatio="none" style="background:#ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <!-- Header Bar -->
  <rect x="30" y="24" width="552" height="34" fill="#000000" />
  <text x="36" y="44" fill="#ffffff" font-size="14" font-weight="900" font-family="Helvetica">Form 1040</text>
  <text x="140" y="40" fill="#ffffff" font-size="10" font-weight="bold">Department of the Treasury — Internal Revenue Service</text>
  <text x="140" y="52" fill="#e2e8f0" font-size="11" font-weight="900">U.S. Individual Income Tax Return</text>
  <text x="510" y="48" fill="#ffffff" font-size="18" font-weight="900">2024</text>

  <!-- Filing Status Section -->
  <rect x="30" y="62" width="552" height="24" fill="#f1f5f9" stroke="#000000" stroke-width="0.8" />
  <text x="36" y="74" fill="#000000" font-size="8" font-weight="bold">Filing Status</text>
  <text x="36" y="82" fill="#64748b" font-size="6.5">Check only one box.</text>
  
  <rect x="62" y="70" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="0.75" />
  <text x="76" y="78" fill="#000000" font-size="7.5">Single</text>

  <rect x="112" y="70" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="0.75" />
  <text x="126" y="78" fill="#000000" font-size="7.5">Married filing jointly</text>

  <rect x="236" y="70" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="0.75" />
  <text x="250" y="78" fill="#000000" font-size="7.5">Married filing separately (MFS)</text>

  <rect x="372" y="70" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="0.75" />
  <text x="386" y="78" fill="#000000" font-size="7.5">Head of household (HOH)</text>

  <!-- Taxpayer Personal Info Section -->
  <rect x="30" y="88" width="552" height="110" fill="#ffffff" stroke="#000000" stroke-width="0.8" />
  
  <!-- Row 1: Taxpayer Name & SSN -->
  <line x1="30" y1="120" x2="582" y2="120" stroke="#cbd5e1" stroke-width="0.6" />
  <line x1="276" y1="88" x2="276" y2="144" stroke="#cbd5e1" stroke-width="0.6" />
  <line x1="468" y1="88" x2="468" y2="144" stroke="#000000" stroke-width="0.8" />

  <text x="34" y="98" fill="#475569" font-size="7">Your first name and middle initial</text>
  <text x="280" y="98" fill="#475569" font-size="7">Last name</text>
  <text x="474" y="98" fill="#000000" font-size="7.5" font-weight="bold">Your social security number</text>
  <rect x="476" y="100" width="102" height="16" fill="none" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="0.5" />

  <!-- Row 2: Spouse Name & SSN -->
  <line x1="30" y1="144" x2="582" y2="144" stroke="#cbd5e1" stroke-width="0.6" />
  <text x="34" y="124" fill="#475569" font-size="7">If joint return, spouse's first name and middle initial</text>
  <text x="280" y="124" fill="#475569" font-size="7">Last name</text>
  <text x="474" y="124" fill="#000000" font-size="7.5" font-weight="bold">Spouse's social security number</text>
  <rect x="476" y="124" width="102" height="16" fill="none" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="0.5" />

  <!-- Row 3: Street Address & Apt -->
  <line x1="30" y1="168" x2="582" y2="168" stroke="#cbd5e1" stroke-width="0.6" />
  <line x1="468" y1="144" x2="468" y2="168" stroke="#cbd5e1" stroke-width="0.6" />
  <text x="34" y="148" fill="#475569" font-size="7">Home address (number and street). If you have a P.O. box, see instructions.</text>
  <text x="474" y="148" fill="#475569" font-size="7">Apt. no.</text>

  <!-- Row 4: City, State, ZIP -->
  <line x1="294" y1="168" x2="294" y2="198" stroke="#cbd5e1" stroke-width="0.6" />
  <line x1="342" y1="168" x2="342" y2="198" stroke="#cbd5e1" stroke-width="0.6" />
  <line x1="468" y1="168" x2="468" y2="198" stroke="#cbd5e1" stroke-width="0.6" />
  <text x="34" y="172" fill="#475569" font-size="7">City, town, or post office. (If foreign address, also complete spaces below.)</text>
  <text x="298" y="172" fill="#475569" font-size="7">State</text>
  <text x="346" y="172" fill="#475569" font-size="7">ZIP code</text>
  <text x="472" y="172" fill="#475569" font-size="7">Foreign country name</text>

  <!-- Dependents Section -->
  <rect x="30" y="202" width="552" height="74" fill="#ffffff" stroke="#000000" stroke-width="0.8" />
  <rect x="30" y="202" width="552" height="16" fill="#f8fafc" />
  <text x="34" y="213" fill="#000000" font-size="8" font-weight="bold">Dependents</text>
  <text x="34" y="228" fill="#475569" font-size="7">(a) First name, Last name</text>
  <text x="240" y="228" fill="#475569" font-size="7">(b) Social security number</text>
  <text x="346" y="228" fill="#475569" font-size="7">(c) Relationship to you</text>
  <text x="460" y="228" fill="#475569" font-size="7">(d) Child tax credit</text>

  <line x1="30" y1="234" x2="582" y2="234" stroke="#94a3b8" stroke-width="0.6" />
  <line x1="236" y1="218" x2="236" y2="276" stroke="#e2e8f0" stroke-width="0.6" />
  <line x1="342" y1="218" x2="342" y2="276" stroke="#e2e8f0" stroke-width="0.6" />
  <line x1="452" y1="218" x2="452" y2="276" stroke="#e2e8f0" stroke-width="0.6" />

  <line x1="30" y1="256" x2="582" y2="256" stroke="#f1f5f9" stroke-width="0.5" />
  <rect x="482" y="238" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="0.6" />

  <!-- Income Section Lines -->
  <rect x="30" y="280" width="552" height="480" fill="#ffffff" stroke="#000000" stroke-width="0.8" />
  <rect x="30" y="280" width="552" height="16" fill="#000000" />
  <text x="34" y="292" fill="#ffffff" font-size="9" font-weight="bold">Income &amp; Total Wages</text>
  <text x="480" y="292" fill="#ffffff" font-size="8" font-weight="bold">Amount</text>

  <!-- Line 1a -->
  <line x1="30" y1="336" x2="582" y2="336" stroke="#f1f5f9" stroke-width="0.6" />
  <text x="34" y="312" fill="#000000" font-size="8" font-weight="bold">1a</text>
  <text x="50" y="312" fill="#1e293b" font-size="7.5">Total amount from Form(s) W-2, box 1 (see instructions)</text>
  <line x1="450" y1="296" x2="450" y2="760" stroke="#000000" stroke-width="0.6" />
  <text x="432" y="324" fill="#000000" font-size="8" font-weight="bold">1a</text>

  <!-- Line 1z -->
  <line x1="30" y1="360" x2="582" y2="360" stroke="#e2e8f0" stroke-width="0.6" />
  <text x="34" y="352" fill="#000000" font-size="8" font-weight="bold">1z</text>
  <text x="50" y="352" fill="#1e293b" font-size="7.5">Add lines 1a through 1h</text>
  <text x="432" y="354" fill="#000000" font-size="8" font-weight="bold">1z</text>

  <!-- Line 2b -->
  <line x1="30" y1="382" x2="582" y2="382" stroke="#f1f5f9" stroke-width="0.6" />
  <text x="34" y="374" fill="#000000" font-size="8" font-weight="bold">2b</text>
  <text x="50" y="374" fill="#1e293b" font-size="7.5">Taxable interest. Attach Sch. B if required</text>
  <text x="432" y="376" fill="#000000" font-size="8" font-weight="bold">2b</text>

  <!-- Line 3b -->
  <line x1="30" y1="404" x2="582" y2="404" stroke="#f1f5f9" stroke-width="0.6" />
  <text x="34" y="396" fill="#000000" font-size="8" font-weight="bold">3b</text>
  <text x="50" y="396" fill="#1e293b" font-size="7.5">Ordinary dividends. Attach Sch. B if required</text>
  <text x="432" y="398" fill="#000000" font-size="8" font-weight="bold">3b</text>

  <!-- Line 9 Total Income -->
  <rect x="30" y="472" width="552" height="28" fill="#f1f5f9" />
  <line x1="30" y1="500" x2="582" y2="500" stroke="#000000" stroke-width="0.8" />
  <text x="34" y="488" fill="#000000" font-size="8.5" font-weight="bold">9</text>
  <text x="50" y="488" fill="#000000" font-size="8" font-weight="bold">Total income. Add lines 1z, 2b, 3b, 4b, 5b, 6b, 7, and 8</text>
  <text x="432" y="488" fill="#000000" font-size="8.5" font-weight="bold">9</text>

  <!-- Page Footer -->
  <text x="30" y="776" fill="#64748b" font-size="7.5">Form 1040 (2024)</text>
  <text x="536" y="776" fill="#64748b" font-size="7.5">Page 1 of 2</text>
</svg>
`,

  'IRS-FORM-1040-2': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792" width="100%" height="100%" preserveAspectRatio="none" style="background:#ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <rect x="30" y="24" width="552" height="26" fill="#000000" />
  <text x="36" y="41" fill="#ffffff" font-size="12" font-weight="900">Form 1040 (2024)</text>
  <text x="536" y="41" fill="#ffffff" font-size="10" font-weight="bold">Page 2</text>

  <rect x="30" y="54" width="552" height="20" fill="#f1f5f9" stroke="#000000" stroke-width="0.6" />
  <text x="34" y="67" fill="#000000" font-size="8" font-weight="bold">Tax and Credits</text>
  <line x1="450" y1="54" x2="450" y2="480" stroke="#000000" stroke-width="0.6" />

  <!-- Line 12 Standard Deduction -->
  <line x1="30" y1="96" x2="582" y2="96" stroke="#f1f5f9" stroke-width="0.6" />
  <text x="34" y="88" fill="#000000" font-size="8" font-weight="bold">12</text>
  <text x="50" y="88" fill="#1e293b" font-size="7.5">Standard deduction or itemized deductions (from Schedule A)</text>
  <text x="432" y="88" fill="#000000" font-size="8" font-weight="bold">12</text>

  <!-- Line 15 Taxable Income -->
  <rect x="30" y="120" width="552" height="24" fill="#f8fafc" />
  <line x1="30" y1="144" x2="582" y2="144" stroke="#000000" stroke-width="0.6" />
  <text x="34" y="136" fill="#000000" font-size="8.5" font-weight="bold">15</text>
  <text x="50" y="136" fill="#000000" font-size="8.5" font-weight="bold">Taxable income. Subtract line 14 from line 11</text>
  <text x="432" y="136" fill="#000000" font-size="8.5" font-weight="bold">15</text>

  <!-- Line 16 Tax -->
  <line x1="30" y1="168" x2="582" y2="168" stroke="#f1f5f9" stroke-width="0.6" />
  <text x="34" y="158" fill="#000000" font-size="8" font-weight="bold">16</text>
  <text x="50" y="158" fill="#1e293b" font-size="7.5">Tax (see instructions). Check if any from Form(s): 8814, 4972</text>
  <text x="432" y="158" fill="#000000" font-size="8" font-weight="bold">16</text>

  <!-- Line 24 Total Tax -->
  <rect x="30" y="232" width="552" height="24" fill="#f1f5f9" />
  <line x1="30" y1="256" x2="582" y2="256" stroke="#000000" stroke-width="0.8" />
  <text x="34" y="248" fill="#000000" font-size="8.5" font-weight="bold">24</text>
  <text x="50" y="248" fill="#000000" font-size="8.5" font-weight="bold">Total tax. Add lines 22 and 23</text>
  <text x="432" y="248" fill="#000000" font-size="8.5" font-weight="bold">24</text>

  <!-- Line 25d Total Withholding -->
  <line x1="30" y1="322" x2="582" y2="322" stroke="#e2e8f0" stroke-width="0.6" />
  <text x="34" y="312" fill="#000000" font-size="8" font-weight="bold">25d</text>
  <text x="50" y="312" fill="#1e293b" font-size="7.5">Add lines 25a through 25c (Federal income tax withheld)</text>
  <text x="428" y="312" fill="#000000" font-size="8" font-weight="bold">25d</text>

  <!-- Refund Section -->
  <rect x="30" y="374" width="552" height="96" fill="#f8fafc" stroke="#000000" stroke-width="0.8" />
  <text x="34" y="390" fill="#000000" font-size="9" font-weight="bold">Refund</text>
  <text x="34" y="400" fill="#000000" font-size="8" font-weight="bold">34</text>
  <text x="50" y="400" fill="#1e293b" font-size="7.5">If line 33 is more than line 24, subtract line 24 from line 33. This is the amount you OVERPAID</text>
  <text x="432" y="400" fill="#000000" font-size="8" font-weight="bold">34</text>

  <line x1="30" y1="410" x2="582" y2="410" stroke="#cbd5e1" stroke-width="0.6" />
  <text x="34" y="424" fill="#000000" font-size="8" font-weight="bold">35a</text>
  <text x="50" y="424" fill="#1e293b" font-size="7.5">Amount of line 34 you want REFUNDED TO YOU</text>
  <text x="432" y="424" fill="#000000" font-size="8" font-weight="bold">35a</text>

  <!-- Direct Deposit Box -->
  <line x1="30" y1="434" x2="582" y2="434" stroke="#cbd5e1" stroke-width="0.6" />
  <text x="50" y="452" fill="#000000" font-size="7.5" font-weight="bold">▶ b Routing number</text>
  <rect x="160" y="440" width="110" height="16" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5" />

  <text x="280" y="452" fill="#000000" font-size="7.5" font-weight="bold">▶ c Type:</text>
  <rect x="320" y="444" width="9" height="9" fill="#ffffff" stroke="#000000" stroke-width="0.5" />
  <text x="334" y="452" fill="#1e293b" font-size="7">Checking</text>

  <rect x="375" y="444" width="9" height="9" fill="#ffffff" stroke="#000000" stroke-width="0.5" />
  <text x="389" y="452" fill="#1e293b" font-size="7">Savings</text>

  <text x="435" y="452" fill="#000000" font-size="7.5" font-weight="bold">▶ d Account number</text>
  <rect x="515" y="440" width="60" height="16" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5" />

  <!-- Paid Preparer Section -->
  <rect x="30" y="618" width="552" height="140" fill="#ffffff" stroke="#000000" stroke-width="0.8" />
  <rect x="30" y="618" width="552" height="18" fill="#f1f5f9" />
  <text x="34" y="630" fill="#000000" font-size="8.5" font-weight="bold">Paid Preparer Use Only</text>
  <text x="472" y="640" fill="#475569" font-size="7">PTIN</text>
  <rect x="472" y="644" width="100" height="16" fill="none" stroke="#94a3b8" stroke-width="0.5" />
</svg>
`,

  'IRS-FORM-W2-1': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792" width="100%" height="100%" preserveAspectRatio="none" style="background:#ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <rect x="40" y="40" width="532" height="712" fill="#ffffff" stroke="#000000" stroke-width="1" />
  <rect x="40" y="40" width="532" height="36" fill="#000000" />
  <text x="50" y="64" fill="#ffffff" font-size="16" font-weight="900">Form W-2</text>
  <text x="140" y="60" fill="#ffffff" font-size="11" font-weight="bold">Wage and Tax Statement</text>
  <text x="140" y="70" fill="#94a3b8" font-size="8">Copy B—To Be Filed With Employee's FEDERAL Tax Return</text>
  <text x="490" y="64" fill="#ffffff" font-size="18" font-weight="900">2024</text>

  <rect x="40" y="76" width="260" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="46" y="88" fill="#475569" font-size="7" font-weight="bold">a Employee's social security number</text>

  <rect x="300" y="76" width="136" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="306" y="88" fill="#475569" font-size="7" font-weight="bold">1 Wages, tips, other comp.</text>

  <rect x="436" y="76" width="136" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="442" y="88" fill="#475569" font-size="7" font-weight="bold">2 Federal income tax withheld</text>

  <rect x="40" y="118" width="260" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="46" y="130" fill="#475569" font-size="7" font-weight="bold">b Employer identification number (EIN)</text>

  <rect x="300" y="118" width="136" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="306" y="130" fill="#475569" font-size="7" font-weight="bold">3 Social security wages</text>

  <rect x="436" y="118" width="136" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="442" y="130" fill="#475569" font-size="7" font-weight="bold">4 Social security tax withheld</text>

  <rect x="40" y="160" width="260" height="74" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="46" y="172" fill="#475569" font-size="7" font-weight="bold">c Employer's name, address, and ZIP code</text>

  <rect x="300" y="160" width="136" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="306" y="172" fill="#475569" font-size="7" font-weight="bold">5 Medicare wages and tips</text>

  <rect x="436" y="160" width="136" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="442" y="172" fill="#475569" font-size="7" font-weight="bold">6 Medicare tax withheld</text>

  <rect x="40" y="234" width="260" height="42" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="46" y="246" fill="#475569" font-size="7" font-weight="bold">e Employee's first name and initial, Last name</text>

  <rect x="300" y="280" width="272" height="60" fill="#ffffff" stroke="#000000" stroke-width="0.6" />
  <text x="306" y="292" fill="#475569" font-size="7" font-weight="bold">12a</text>
</svg>
`
};
