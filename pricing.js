/* Regras comerciais aprovadas. Todos os cálculos monetários usam centavos. */
const GEOEDUCA_PRICING = Object.freeze({
  minimumMonthlyCents: 2990,
  annualMonthsCharged: 10,
  launchPercent: 10,
  launchMonths: 3,
  maximumQuotedStudents: 1000,
  tiers: Object.freeze([
    Object.freeze({label: 'Primeiros 100',capacity: 100,rateCents: 200}),
    Object.freeze({label: 'Do 101º ao 300º',capacity: 200,rateCents: 150}),
    Object.freeze({label: 'Do 301º ao 1.000º',capacity: 700,rateCents: 120})
  ]),
  quote(studentCount, {annual = false, launch = false} = {}) {
    if (!Number.isSafeInteger(studentCount) || studentCount < 1) return {kind: 'invalid'};
    if (studentCount > this.maximumQuotedStudents) return {kind: 'custom',studentCount};
    let remaining = studentCount;
    const parts = this.tiers.map(tier => {
      const quantity = Math.min(remaining,tier.capacity);
      remaining -= quantity;
      return {...tier,quantity,subtotalCents: quantity * tier.rateCents};
    });
    const subtotalCents = parts.reduce((sum,part) => sum + part.subtotalCents,0);
    const regularMonthlyCents = Math.max(this.minimumMonthlyCents,subtotalCents);
    const launchApplied = Boolean(launch && !annual);
    const launchMonthlyCents = Math.max(this.minimumMonthlyCents,Math.round(regularMonthlyCents * (100 - this.launchPercent) / 100));
    const annualCents = regularMonthlyCents * this.annualMonthsCharged;
    return {
      kind: 'priced',studentCount,parts,annual,launchApplied,
      minimumAdjustmentCents: regularMonthlyCents - subtotalCents,
      regularMonthlyCents,annualCents,
      annualEquivalentCents: Math.round(annualCents / 12),
      annualSavingsCents: regularMonthlyCents * 12 - annualCents,
      launchSavingsCents: (regularMonthlyCents - launchMonthlyCents) * this.launchMonths,
      priceCents: annual ? annualCents : launchApplied ? launchMonthlyCents : regularMonthlyCents
    };
  }
});
