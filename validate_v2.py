#!/usr/bin/env python3
"""Validate venue JSON files against Fieldy outing schema v2.

Usage:  python3 validate_v2.py [outputs_dir]

Exit code 0 if no ERRORs. WARNs never fail the run -- they flag records that are
valid but not publishable, which is an expected and honest state.
"""
import json
import sys
import glob
import os
import re
from datetime import datetime

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")

VENUE_CATEGORY = {"animals_farms", "nature_outdoors", "museums_history",
                  "arts_performance", "science", "community_civic", "comes_to_you"}
BOOKING_METHOD = {"email", "phone", "web_form", "shop"}
GEO_SOURCE = {"site_embed", "geocoded", "geocode_pending"}
AGE_BASIS = {"years", "grades"}
FORMAT = {"guided", "self_guided", "hands_on", "interactive"}
MOOD = {"play", "explore", "active", "creative", "learn"}
IMAGE_ROLE = {"hero", "program", "space", "activity"}
IMAGE_USAGE = {"licensed", "venue_supplied", "public_domain", "unverified"}
ALT_SOURCE = {"site", "generated"}

VENUE_FIELDS = ["id", "name", "website", "description", "category", "address", "lat", "lng",
                "geo_source", "hosts_school_groups", "hosts_daycare_groups",
                "youngest_age_welcomed_years", "booking_email", "booking_phone", "booking_url",
                "booking_method", "has_washrooms", "has_lunch_space", "has_rain_backup",
                "stroller_accessible", "wheelchair_accessible", "bus_parking", "facility_notes",
                "nearby_park", "restrictions", "languages", "general_admission_child_cad",
                "general_admission_adult_cad", "hours_notes", "seasonal_notes",
                "price_year_or_season", "checked_on", "checked_by"]

PROGRAM_FIELDS = ["id", "name", "description", "what_children_do", "our_note", "practical_summary",
                  "comes_to_you", "age_min_years", "age_max_years", "grade_min", "grade_max",
                  "age_basis", "duration_min", "capacity_max", "capacity_min",
                  "cost_per_child_cad", "cost_per_group_cad", "cost_per_adult_cad",
                  "free_adults_per_children", "is_free", "tax_included", "extra_fees_note",
                  "school_rate_only", "deposit_required", "payment_timing", "cancellation_note",
                  "months_offered", "days_offered", "time_slots", "lead_time_days",
                  "chaperone_ratio", "adults_free", "indoor", "outdoor", "format",
                  "sensory_friendly", "low_noise", "neurodiversity_friendly", "mood_tags",
                  "curriculum_tags", "booking_email", "booking_url", "source_url", "evidence",
                  "checked_on", "image_ids"]

IMAGE_FIELDS = ["id", "url", "role", "alt", "alt_source", "caption", "found_on_url",
                "width", "height", "rights_note", "usage"]

BOOL = (bool,)
NUM = (int, float)


class Report:
    def __init__(self, fname):
        self.fname = fname
        self.errors = []
        self.warns = []

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warns.append(msg)


def is_num(v):
    return isinstance(v, NUM) and not isinstance(v, bool)


def check_enum(r, path, val, allowed, required=False):
    if val is None:
        if required:
            r.err(f"{path}: required, got null")
        return
    if val not in allowed:
        r.err(f"{path}: {val!r} not in {sorted(allowed)}")


def check_enum_list(r, path, val, allowed):
    if val is None:
        return
    if not isinstance(val, list):
        r.err(f"{path}: expected array, got {type(val).__name__}")
        return
    for v in val:
        if v not in allowed:
            r.err(f"{path}: {v!r} not in {sorted(allowed)}")


def check_type(r, path, val, types, label):
    if val is None:
        return
    if types is NUM:
        if not is_num(val):
            r.err(f"{path}: expected {label}, got {type(val).__name__}")
    elif not isinstance(val, types):
        r.err(f"{path}: expected {label}, got {type(val).__name__}")


def check_str_list(r, path, val):
    if val is None:
        return
    if not isinstance(val, list):
        r.err(f"{path}: expected array of strings, got {type(val).__name__}")
        return
    for v in val:
        if not isinstance(v, str):
            r.err(f"{path}: array must contain strings, found {type(v).__name__}")


DASHES = "\u2014\u2013"
JARGON = re.compile(r"\b(chaperone_ratio|hours_notes|capacity_m\w+|time_slots|booking_\w+|"
                    r"facility_notes[.\w]*|cost_per_\w+|has_\w+|geo_source|age_basis|"
                    r"mood_tags|extra_fees_note|left null|last modified|\(modified)")


def check_voice(r, path, text):
    """Everything a director reads has to sound like a person talking.

    Dashes and field names both leak our plumbing into her reading. The prompt
    forbids them; this catches an extraction that forgot.
    """
    if not text:
        return
    if any(d in text for d in DASHES):
        r.warn(f"{path}: contains an em or en dash. Use a comma, a full stop, "
               f"or two sentences")
    m = JARGON.search(text)
    if m:
        r.err(f"{path}: contains {m.group(0)!r}, which is our plumbing, not "
              f"words a director would use")


def validate_venue(r, v):
    for f in VENUE_FIELDS:
        if f not in v:
            r.err(f"venue.{f}: missing key")

    for f in ("id", "name", "website", "description", "checked_on"):
        if not v.get(f):
            r.err(f"venue.{f}: required, got {v.get(f)!r}")

    if v.get("id") and not SLUG_RE.match(str(v["id"])):
        r.err(f"venue.id: {v['id']!r} is not a lowercase hyphenated slug")

    check_enum(r, "venue.category", v.get("category"), VENUE_CATEGORY, required=True)
    check_enum(r, "venue.booking_method", v.get("booking_method"), BOOKING_METHOD)
    check_enum(r, "venue.geo_source", v.get("geo_source"), GEO_SOURCE)
    check_voice(r, "venue.description", v.get("description"))

    if v.get("checked_on") and not DATE_RE.match(str(v["checked_on"])):
        r.err(f"venue.checked_on: {v['checked_on']!r} is not ISO YYYY-MM-DD")

    for f in ("lat", "lng"):
        check_type(r, f"venue.{f}", v.get(f), NUM, "number")
    lat, lng = v.get("lat"), v.get("lng")
    if (lat is None) != (lng is None):
        r.err("venue.lat/lng: must both be set or both null")
    if is_num(lat) and not (-90 <= lat <= 90):
        r.err(f"venue.lat: {lat} out of range")
    if is_num(lng) and not (-180 <= lng <= 180):
        r.err(f"venue.lng: {lng} out of range")
    # Vancouver Island sanity box
    if is_num(lat) and is_num(lng):
        if not (48.0 <= lat <= 51.5 and -128.5 <= lng <= -122.5):
            r.warn(f"venue.lat/lng: ({lat}, {lng}) is outside Vancouver Island")
        if v.get("geo_source") is None:
            r.err("venue.geo_source: required when lat/lng are set")
        if v.get("geo_source") == "geocode_pending":
            r.err("venue.geo_source: geocode_pending but lat/lng are populated")
    if lat is None and v.get("geo_source") in ("site_embed", "geocoded"):
        r.err(f"venue.geo_source: {v['geo_source']!r} but lat/lng are null")

    for f in ("hosts_school_groups", "hosts_daycare_groups", "has_washrooms", "has_lunch_space",
              "has_rain_backup", "stroller_accessible", "wheelchair_accessible", "bus_parking"):
        check_type(r, f"venue.{f}", v.get(f), BOOL, "boolean")

    for f in ("youngest_age_welcomed_years", "general_admission_child_cad",
              "general_admission_adult_cad"):
        check_type(r, f"venue.{f}", v.get(f), NUM, "number")

    for f in ("address", "nearby_park", "hours_notes", "seasonal_notes", "price_year_or_season",
              "booking_email", "booking_phone", "booking_url", "checked_by"):
        check_type(r, f"venue.{f}", v.get(f), str, "string")

    check_str_list(r, "venue.restrictions", v.get("restrictions"))
    check_str_list(r, "venue.languages", v.get("languages"))

    fn = v.get("facility_notes")
    if fn is not None:
        if not isinstance(fn, dict):
            r.err(f"venue.facility_notes: expected object, got {type(fn).__name__}")
        else:
            allowed = {"washrooms", "lunch_space", "rain_backup", "stroller_accessible",
                       "wheelchair_accessible", "bus_parking"}
            for k, val in fn.items():
                if k not in allowed:
                    r.warn(f"venue.facility_notes: unexpected key {k!r}")
                if not isinstance(val, str):
                    r.err(f"venue.facility_notes.{k}: expected string")

    if v.get("booking_email") and "@" not in str(v["booking_email"]):
        r.err(f"venue.booking_email: {v['booking_email']!r} is not an email address")


def validate_program(r, p, i, image_ids):
    path = f"programs[{i}]"
    for f in PROGRAM_FIELDS:
        if f not in p:
            r.err(f"{path}.{f}: missing key")

    for f in ("id", "name", "source_url", "evidence", "checked_on"):
        if not p.get(f):
            r.err(f"{path}.{f}: required, got {p.get(f)!r}")

    if p.get("id") and not SLUG_RE.match(str(p["id"])):
        r.err(f"{path}.id: {p['id']!r} is not a lowercase hyphenated slug")

    if p.get("checked_on") and not DATE_RE.match(str(p["checked_on"])):
        r.err(f"{path}.checked_on: not ISO YYYY-MM-DD")

    ev = p.get("evidence") or ""
    if ev and len(ev.split()) > 25:
        r.err(f"{path}.evidence: {len(ev.split())} words, limit 25")
    if "..." in ev or "…" in ev:
        r.err(f"{path}.evidence: contains ellipsis; must be a contiguous quote")

    check_enum(r, f"{path}.age_basis", p.get("age_basis"), AGE_BASIS)
    check_enum(r, f"{path}.booking_method", p.get("booking_method"), BOOKING_METHOD)
    check_enum_list(r, f"{path}.format", p.get("format"), FORMAT)
    check_enum_list(r, f"{path}.mood_tags", p.get("mood_tags"), MOOD)

    for field in ("our_note", "practical_summary", "what_children_do", "description"):
        check_voice(r, f"{path}.{field}", p.get(field))

    # mood_tags is required from v2.0 on. The app can fall back to guessing from
    # the venue category, but that guess reads `fun` as "animals or science" and
    # misses an indoor climbing gym as `active`. A warning, not an error, so an
    # otherwise good record still loads.
    mt = p.get("mood_tags")
    if not mt:
        r.warn(f"{path}.mood_tags: missing - the mood chips will fall back to "
               f"guessing from the venue category")
    elif len(mt) > 3:
        r.warn(f"{path}.mood_tags: {len(mt)} tags; 1 to 3 keeps the chips meaningful")

    for f in ("comes_to_you", "is_free", "tax_included", "school_rate_only", "deposit_required",
              "adults_free", "indoor", "outdoor", "sensory_friendly", "low_noise",
              "neurodiversity_friendly"):
        check_type(r, f"{path}.{f}", p.get(f), BOOL, "boolean")

    for f in ("age_min_years", "age_max_years", "grade_min", "grade_max", "duration_min",
              "capacity_max", "capacity_min", "cost_per_child_cad", "cost_per_group_cad",
              "cost_per_adult_cad", "free_adults_per_children", "lead_time_days"):
        check_type(r, f"{path}.{f}", p.get(f), NUM, "number")

    # age_basis consistency
    has_age = p.get("age_min_years") is not None or p.get("age_max_years") is not None
    has_grade = p.get("grade_min") is not None or p.get("grade_max") is not None
    if p.get("age_basis") == "years" and not has_age:
        r.err(f"{path}: age_basis 'years' but no age range set")
    if p.get("age_basis") == "grades" and not has_grade:
        r.err(f"{path}: age_basis 'grades' but no grade range set")
    if has_age and has_grade:
        r.warn(f"{path}: both age and grade ranges set; check the site published both")
    if (has_age or has_grade) and p.get("age_basis") is None:
        r.err(f"{path}: age/grade range set but age_basis is null")

    for lo, hi in (("age_min_years", "age_max_years"), ("grade_min", "grade_max"),
                   ("capacity_min", "capacity_max")):
        a, b = p.get(lo), p.get(hi)
        if is_num(a) and is_num(b) and a > b:
            r.err(f"{path}: {lo} ({a}) > {hi} ({b})")

    if is_num(p.get("grade_min")) and p["grade_min"] < -1:
        r.err(f"{path}.grade_min: {p['grade_min']} below -1 (preschool)")

    # cost rules
    if p.get("cost_per_child_cad") is not None and p.get("cost_per_group_cad") is not None:
        r.err(f"{path}: cost_per_child_cad and cost_per_group_cad both set; use one")
    if p.get("is_free") is True:
        for f in ("cost_per_child_cad", "cost_per_group_cad"):
            if p.get(f):
                r.err(f"{path}: is_free true but {f} is {p[f]}")
    for f in ("cost_per_child_cad", "cost_per_group_cad", "cost_per_adult_cad"):
        if is_num(p.get(f)) and p[f] < 0:
            r.err(f"{path}.{f}: negative")

    # months / days
    for f, lo, hi in (("months_offered", 1, 12), ("days_offered", 1, 7)):
        val = p.get(f)
        if val is None:
            continue
        if not isinstance(val, list):
            r.err(f"{path}.{f}: expected array")
            continue
        for x in val:
            if not isinstance(x, int) or isinstance(x, bool) or not (lo <= x <= hi):
                r.err(f"{path}.{f}: {x!r} not an integer {lo}-{hi}")
        if len(set(val)) != len(val):
            r.err(f"{path}.{f}: duplicate values")

    ts = p.get("time_slots")
    if ts is not None:
        if not isinstance(ts, list):
            r.err(f"{path}.time_slots: expected array")
        else:
            for t in ts:
                if not isinstance(t, str) or not TIME_RE.match(t):
                    r.err(f"{path}.time_slots: {t!r} is not 24h HH:MM")

    cr = p.get("chaperone_ratio")
    if cr is not None:
        items = cr if isinstance(cr, list) else [cr]
        for c in items:
            if not isinstance(c, dict):
                r.err(f"{path}.chaperone_ratio: expected object or array of objects")
                continue
            if not is_num(c.get("children_per_adult")):
                r.err(f"{path}.chaperone_ratio.children_per_adult: expected number")
            if "applies_to" in c and c["applies_to"] is not None \
                    and not isinstance(c["applies_to"], str):
                r.err(f"{path}.chaperone_ratio.applies_to: expected string")

    check_str_list(r, f"{path}.curriculum_tags", p.get("curriculum_tags"))

    ids = p.get("image_ids")
    if ids is not None:
        if not isinstance(ids, list):
            r.err(f"{path}.image_ids: expected array")
        else:
            for x in ids:
                if x not in image_ids:
                    r.err(f"{path}.image_ids: {x!r} not found in images[]")

    if "image_url" in p:
        r.err(f"{path}.image_url: v1 field removed in v2; use image_ids")


def validate_images(r, images):
    seen = set()
    heroes = 0
    for i, im in enumerate(images):
        path = f"images[{i}]"
        for f in IMAGE_FIELDS:
            if f not in im:
                r.err(f"{path}.{f}: missing key")
        for f in ("id", "url", "role", "alt", "alt_source", "found_on_url", "usage"):
            if not im.get(f):
                r.err(f"{path}.{f}: required, got {im.get(f)!r}")
        if im.get("id"):
            if im["id"] in seen:
                r.err(f"{path}.id: duplicate {im['id']!r}")
            seen.add(im["id"])
            if not SLUG_RE.match(str(im["id"])):
                r.err(f"{path}.id: {im['id']!r} is not a slug")
        check_enum(r, f"{path}.role", im.get("role"), IMAGE_ROLE, required=True)
        check_enum(r, f"{path}.usage", im.get("usage"), IMAGE_USAGE, required=True)
        check_enum(r, f"{path}.alt_source", im.get("alt_source"), ALT_SOURCE, required=True)
        if im.get("role") == "hero":
            heroes += 1
        for f in ("url", "found_on_url"):
            if im.get(f) and not str(im[f]).startswith(("http://", "https://")):
                r.err(f"{path}.{f}: not an absolute URL")
        for f in ("width", "height"):
            check_type(r, f"{path}.{f}", im.get(f), NUM, "number")
        check_type(r, f"{path}.caption", im.get("caption"), str, "string")
        check_type(r, f"{path}.rights_note", im.get("rights_note"), str, "string")
        rn = (im.get("rights_note") or "").strip().lower()
        if rn and re.match(r"^(©|\(c\)|copyright)?\s*©?\s*\d{4}", rn) and len(rn.split()) <= 6:
            r.warn(f"{path}.rights_note: {im['rights_note']!r} looks like a site-wide "
                   "copyright line, not a photo credit")
    if len(images) > 5:
        r.err(f"images: {len(images)} entries, cap is 5")
    if heroes > 1:
        r.err(f"images: {heroes} hero images, expected exactly 1")
    return heroes, seen


def validate_provenance(r, d):
    for i, c in enumerate(d.get("conflicts") or []):
        # `note` is the only part of a conflict a director ever reads.
        check_voice(r, f"conflicts[{i}].note", c.get("note"))
    check_str_list(r, "gaps", d.get("gaps"))
    if "gaps" not in d:
        r.err("gaps: missing key")
    for f in ("pages_opened", "pages_useful"):
        if f not in d:
            r.err(f"{f}: missing key")
        check_str_list(r, f, d.get(f))
    conflicts = d.get("conflicts")
    if conflicts is None:
        r.err("conflicts: missing key (use [] when there are none)")
    elif not isinstance(conflicts, list):
        r.err("conflicts: expected array")
    else:
        for i, c in enumerate(conflicts):
            if not isinstance(c, dict):
                r.err(f"conflicts[{i}]: expected object")
                continue
            for f in ("field", "values", "sources", "note"):
                if f not in c:
                    r.err(f"conflicts[{i}].{f}: missing")
            if isinstance(c.get("values"), list) and len(c["values"]) < 2:
                r.err(f"conflicts[{i}].values: needs at least 2 conflicting values")
            check_str_list(r, f"conflicts[{i}].sources", c.get("sources"))
    if not d.get("extractor_version"):
        r.err("extractor_version: required")
    ea = d.get("extracted_at")
    if not ea:
        r.err("extracted_at: required")
    else:
        try:
            datetime.fromisoformat(str(ea).replace("Z", "+00:00"))
        except ValueError:
            r.err(f"extracted_at: {ea!r} is not an ISO datetime")


def check_publishable(r, d, heroes):
    """Minimum viable record. Failures are WARNs -- an honest gap is allowed."""
    missing = []
    v = d.get("venue", {})
    for f in ("id", "name", "address", "lat", "lng", "category", "checked_on"):
        if v.get(f) in (None, ""):
            missing.append(f"venue.{f}")
    if heroes < 1:
        missing.append("images: one hero")
    else:
        for im in d.get("images", []):
            if im.get("role") == "hero" and not im.get("alt"):
                missing.append("hero image alt")

    progs = d.get("programs") or []
    if not progs:
        missing.append("at least one program")
    else:
        ok = False
        for p in progs:
            need = [p.get("id"), p.get("name"), p.get("age_basis"), p.get("our_note")]
            has_range = (p.get("age_min_years") is not None or p.get("age_max_years") is not None
                         or p.get("grade_min") is not None or p.get("grade_max") is not None)
            has_cost = (p.get("is_free") is not None or p.get("cost_per_child_cad") is not None
                        or p.get("cost_per_group_cad") is not None)
            if all(need) and has_range and has_cost and p.get("comes_to_you") is not None:
                ok = True
                break
        if not ok:
            missing.append("a program with id, name, age_basis + range, comes_to_you, "
                           "cost/is_free, our_note")
    if missing:
        r.warn("NOT PUBLISHABLE - missing: " + "; ".join(missing))
    return not missing


def validate_file(path):
    r = Report(os.path.basename(path))
    try:
        with open(path, encoding="utf-8") as fh:
            d = json.load(fh)
    except json.JSONDecodeError as e:
        r.err(f"invalid JSON: {e}")
        return r, False
    if not isinstance(d, dict):
        r.err("top level must be an object")
        return r, False

    validate_venue(r, d.get("venue", {}) if isinstance(d.get("venue"), dict) else {})
    if not isinstance(d.get("venue"), dict):
        r.err("venue: missing or not an object")

    images = d.get("images")
    if images is None:
        r.err("images: missing key (use [] when there are none)")
        images = []
    elif not isinstance(images, list):
        r.err("images: expected array")
        images = []
    heroes, image_ids = validate_images(r, images)

    progs = d.get("programs")
    if progs is None:
        r.err("programs: missing key")
        progs = []
    elif not isinstance(progs, list):
        r.err("programs: expected array")
        progs = []
    pids = set()
    for i, p in enumerate(progs):
        if not isinstance(p, dict):
            r.err(f"programs[{i}]: expected object")
            continue
        validate_program(r, p, i, image_ids)
        if p.get("id"):
            if p["id"] in pids:
                r.err(f"programs[{i}].id: duplicate {p['id']!r}")
            pids.add(p["id"])

    validate_provenance(r, d)

    v = d.get("venue", {}) if isinstance(d.get("venue"), dict) else {}
    if v.get("hosts_school_groups") is False and v.get("hosts_daycare_groups") is False and progs:
        r.err("venue hosts neither schools nor daycares but programs[] is not empty")

    publishable = check_publishable(r, d, heroes)
    return r, publishable


def main():
    d = sys.argv[1] if len(sys.argv) > 1 else "outputs"
    files = sorted(glob.glob(os.path.join(d, "*.json")))
    if not files:
        print(f"No JSON files found in {d}")
        return 1
    n_err = n_pub = 0
    reports = []
    for f in files:
        r, pub = validate_file(f)
        reports.append((r, pub))
        if r.errors:
            n_err += 1
        if pub:
            n_pub += 1
    for r, pub in reports:
        status = "FAIL" if r.errors else ("OK  " if pub else "OK* ")
        print(f"{status} {r.fname}")
        for e in r.errors:
            print(f"       ERROR  {e}")
        for w in r.warns:
            print(f"       warn   {w}")
    print("-" * 70)
    print(f"{len(files)} files | {n_err} with errors | {n_pub} publishable "
          f"| {len(files) - n_pub} below the minimum viable bar")
    print("OK* = schema-valid but not publishable (expected for thin venues)")
    return 1 if n_err else 0


if __name__ == "__main__":
    sys.exit(main())
