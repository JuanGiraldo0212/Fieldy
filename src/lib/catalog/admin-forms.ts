import type { Program } from '@/db/schema'

/*
  The program row flattened for the admin form. Lives here rather than in the
  form component because the form is a client module, and a server page
  cannot call a function it imports from one — it would receive a client
  reference, not the function.
*/

export type ProgramFormValues = {
  slug: string
  name: string
  active: boolean
  comesToYou: boolean
  description: string | null
  whatChildrenDo: string | null
  ourNote: string | null
  practicalSummary: string | null
  ageBasis: string | null
  ageMinYears: number | null
  ageMaxYears: number | null
  gradeMin: number | null
  gradeMax: number | null
  durationMin: number | null
  capacityMin: number | null
  capacityMax: number | null
  leadTimeDays: number | null
  costPerChildCad: string | null
  costPerGroupCad: string | null
  costPerAdultCad: string | null
  freeAdultsPerChildren: number | null
  isFree: boolean | null
  taxIncluded: boolean | null
  extraFeesNote: string | null
  schoolRateOnly: boolean
  depositRequired: boolean | null
  paymentTiming: string | null
  cancellationNote: string | null
  adultsFree: boolean | null
  chaperoneChildrenPerAdult: number | null
  chaperoneAppliesTo: string | null
  chaperoneHasMore: boolean
  monthsOffered: number[] | null
  daysOffered: number[] | null
  timeSlots: string[] | null
  indoor: boolean | null
  outdoor: boolean | null
  format: string[] | null
  sensoryFriendly: boolean | null
  lowNoise: boolean | null
  neurodiversityFriendly: boolean | null
  moodTags: string[] | null
  curriculumTags: string[] | null
  bookingEmail: string | null
  bookingUrl: string | null
  bookingMethod: string | null
  sourceUrl: string | null
  evidence: string | null
}

export function programFormValues(p: Program): ProgramFormValues {
  const ratio = Array.isArray(p.chaperoneRatio) ? p.chaperoneRatio[0] : p.chaperoneRatio
  return {
    slug: p.slug,
    name: p.name,
    active: p.active,
    comesToYou: p.comesToYou,
    description: p.description,
    whatChildrenDo: p.whatChildrenDo,
    ourNote: p.ourNote,
    practicalSummary: p.practicalSummary,
    ageBasis: p.ageBasis,
    ageMinYears: p.ageMinYears,
    ageMaxYears: p.ageMaxYears,
    gradeMin: p.gradeMin,
    gradeMax: p.gradeMax,
    durationMin: p.durationMin,
    capacityMin: p.capacityMin,
    capacityMax: p.capacityMax,
    leadTimeDays: p.leadTimeDays,
    costPerChildCad: p.costPerChildCad,
    costPerGroupCad: p.costPerGroupCad,
    costPerAdultCad: p.costPerAdultCad,
    freeAdultsPerChildren: p.freeAdultsPerChildren,
    isFree: p.isFree,
    taxIncluded: p.taxIncluded,
    extraFeesNote: p.extraFeesNote,
    schoolRateOnly: p.schoolRateOnly,
    depositRequired: p.depositRequired,
    paymentTiming: p.paymentTiming,
    cancellationNote: p.cancellationNote,
    adultsFree: p.adultsFree,
    chaperoneChildrenPerAdult: ratio?.children_per_adult ?? null,
    chaperoneAppliesTo: ratio?.applies_to ?? null,
    chaperoneHasMore: Array.isArray(p.chaperoneRatio) && p.chaperoneRatio.length > 1,
    monthsOffered: p.monthsOffered,
    daysOffered: p.daysOffered,
    timeSlots: p.timeSlots,
    indoor: p.indoor,
    outdoor: p.outdoor,
    format: p.format,
    sensoryFriendly: p.sensoryFriendly,
    lowNoise: p.lowNoise,
    neurodiversityFriendly: p.neurodiversityFriendly,
    moodTags: p.moodTags,
    curriculumTags: p.curriculumTags,
    bookingEmail: p.bookingEmail,
    bookingUrl: p.bookingUrl,
    bookingMethod: p.bookingMethod,
    sourceUrl: p.sourceUrl,
    evidence: p.evidence,
  }
}
