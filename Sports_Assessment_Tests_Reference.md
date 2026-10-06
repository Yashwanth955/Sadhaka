# Sports & Fitness Assessment Tests — Reference for App

Compiled from: Khelo India/SAI Basketball Retention & Induction Protocol, Volleyball Selection Criteria, SAI Battery Fitness Assessment Concept Note (10 tests), Khelo India Football Fitness Testing Manual, and the 254-page **Talent Identification Protocols** (Grassroot, Under-12/14/16) covering 20 sports.

---

## 1. Generic "10 Battery Fitness Assessment Tests" (sport-agnostic, all athletes)
Source: SAI Battery Fitness Assessment App Concept Note. These are the base tests every athlete undergoes regardless of sport — a good default module for your app.

| # | Test | Component | What it measures / How | Benchmark note |
|---|------|-----------|--------------------------|----------------|
| 1 | Height | Anthropometrics | Standing height, feet to vertex | ±1 cm accuracy target |
| 2 | Weight | Anthropometrics | Body mass; auto-calc BMI | age/gender categories |
| 3 | Flexibility (Sit & Reach) | Hip/Trunk flexibility | Forward reach with legs extended | best of multiple trials |
| 4 | Standing Vertical Jump | Explosive power | Max jump height from standing | ±2 cm detection |
| 5 | Standing Broad Jump | Explosive strength | Horizontal jump distance | best of multiple attempts |
| 6 | Medicine Ball Throw (Backward Overhead) | Upper-body strength | Throw distance; 1kg (U12 girls/boys), 2kg (boys 12+) | best of 2 |
| 7 | Speed (30m Standing Start) | Speed | Time over 30m sprint | best of 2, ±1s GPS accuracy |
| 8 | Agility (4×10m Shuttle Run) | Agility | Total time, 4-leg shuttle | turn detection ≥95% |
| 9 | Sit-Ups | Abdominal strength | Rep count in 30/45 sec window | ≥95% rep-count accuracy |
| 10 | Endurance Run | Endurance | 800m (U-12) / 1.6km (12+) | auto start/finish, GPS |

App requirements from the Concept Note: offline-first, video-based AI measurement, coach-led or self-upload modes, digital report card + percentile ranking, APAAR/Aadhaar/NSRS login, geo-tag + timestamp on every result.

---

## 2. Basketball (Khelo India / SAI — U14/U16/U18/Seniors)

**Total: 100 marks** — Height (30) + Physical/Motor Abilities (20, raw 50→scaled to 20) + Tactics (30, raw 45→scaled 30) + Skill (20, raw 15→scaled 20)

### A. Height (30 marks) — separate scales by age category & gender (see tables below)
| Age (Boys) | 5 marks | 10 | 15 | 20 | 30 |
|---|---|---|---|---|---|
| U14 | ≤170cm | 171-180 | 181-190 | 191-200 | 201+ |
| U16 | ≤180cm | 181-190 | 191-200 | 201-210 | 211+ |
| U18/Seniors | ≤180cm | 181-190 | 191-200 | 201-210 | 211+ |

Girls scale is ~10cm lower at each band (U14: ≤160→5, ..., 191+→30; U16/U18/Sr similar pattern — see source doc).

### B. Physical/Motor Abilities (10 sub-tests, 5 marks each, raw total /50 → scaled to /20)
Formula: `(raw/50) × 20`
| Test | How to score |
|---|---|
| 30m Sprint | `(10 − time_sec) ÷ 2` = marks (capped at 5) |
| Standing Vertical Jump | Male: `(jump_cm/10) − 1`; Female: `jump_cm/10`; 60cm+/50cm+ = 5 marks |
| 10 Bound Test | Distance table, e.g. 31m+=5, 19-19.29m=1 (male); female scale lower |
| Planks | 10min+=5; else `time_min/2` |
| Sit-Ups | 50+=5; else `count/10` |
| Push-Ups | Male: 50+=5, else `count/10`; Female: 41+=5, else `(count/10)+1` |
| Chin-Ups | Male: `count/5` (25+=5); Female: hold time `(sec/10)+1` (40s+=5) |
| Medicine Ball Throw | Distance table (male 7m+=5; female 6m+=5) |
| Illinois Agility Test | Male: 10s or below=5, else `(20−time)/2`; Female: 12s=5, else `(20−time)/2+1` |
| YO-YO Test | Distance-based lookup table, 20+=5 |

### C. Tactics (9 sub-tests × 5 = 45 raw → scaled to /30 via `(raw/45)×30`)
One-on-One, Defensive Rebound, Offensive Rebound, Game Passing, Overall Game Sense (screening/assist/efficiency), Understanding of Space, Team Defence, Team Offence, Lay-up Conversion/Technique.

### D. Skill (3 sub-tests × 5 = 15 raw → scaled to /20 via `(raw/15)×20`)
- **Control Dribble**: 9s or below=5; else `(18−time)/2`
- **Wall Passing**: count table (36+=5, 16-20=1, <15=0.5)
- **Spot Shooting**: `(baskets×0.5 + time_points)/2` — see worked example in doc

### Ranking / Induction
`Final Ranking = Camp Score + National Medal (Gold 7/Silver 6/Bronze 5) + National Camp participation (8) + International Medal (10)`. Cutoff: ≥50 marks. Vacancy split: U14/U17 60%, U19 20%, Seniors 20%.

### Retention/Weeding
Reviewed after 1 year — medal or camp attendance required; doping → immediate weed-out; height/age-advantage inductees get a structured 1+1 year evaluation.

---

## 3. Volleyball (Khelo India Selection Criteria)

**Total: 150 marks** — Game Performance (60) + Psychological Attributes (20) + Motor Abilities (50) + Sports Achievements (20)

### Motor Abilities tests (age/gender/birth-year specific tables, 2003–2006 cohorts)
| Test | Unit | How |
|---|---|---|
| Height | cm | Standing height; scaled 1-10 by cohort table |
| Speed (sprint) | seconds | Lower time = higher mark (1-10 scale) |
| 6-Block Jump (RA & OP) | seconds | Time-based, lower = better |
| 6-Block Jump (MB) | seconds | Time-based, lower = better |
| Approach Jump | cm | Higher = better (0.5-10 scale) |
| T-Test (agility) | seconds | Lower = better |
| Medicine Ball Throw | meters | Higher = better; 1kg for U12, weight varies |
| Standing Reach | cm | Higher = better |
| Absolute Jump | cm | Boys 90cm+=5, Girls 70cm+=5 |
| Block Jump | cm | Highest tier scale, boys ~320-335cm+, girls ~275-290cm+ |

All benchmark tables differ **by birth year** (2003, 2004, 2005, 2006) and gender — your app needs a lookup matrix keyed by (sport, gender, birth-year, test) → score.

### Sports Achievements Scoring
| Level | Marks |
|---|---|
| World Championships/VNL/World Club/World University Games/World Challenger Cup/Olympics | 20 |
| Asian Championships/Asian Games/CWG/SAF Games/Asian Challenger Cup/Olympic Qualification | 15 |
| National Camp/National Championship/Khelo India Games/National Leagues/SGFI/AIU | 10 |
| State Championship/State School Championship | 5 |

---

## 4. Football (Khelo India Fitness Manual + Talent ID Protocol)

### Grassroot Talent ID Matrix (U14)
| Test | Unit |
|---|---|
| Sit & Reach | cm |
| 12×20m repetitive sprint (20s recovery) | sec/min |
| Standing Vertical Jump | cm |
| 30m Flying Sprint | sec |
| 1kg Medicine Ball Throw | m |
| 2× Cricket Ball Overhead Throw | m |
| T/L Test (agility) | sec/min |
| Yo-Yo Intermittent Level 1 | m/level |

### Elite/Senior Fitness Testing (detailed protocols)
| Test | Purpose | Procedure | Result/Norm (Excellent → Poor) |
|---|---|---|---|
| **Yo-Yo Intermittent Endurance (IE1/IE2)** | Repeated intermittent running capacity | 20m shuttle + 5s recovery, paced by audio signal, until 2nd failure ("red card") | >3000m Excellent; 1500-2000m Low; <1500 Poor |
| **Yo-Yo Intermittent Recovery (IR1/IR2)** | Recovery after high-intensity bursts | 2×20m shuttle + 10s recovery, paced audio | >1600m Excellent; <800m Poor. VO2max: IR1: `dist×0.008+36.4`; IR2: `dist×0.0136+45.3` |
| **Linear Sprint (30m)** | Peak & repeated sprint speed | Best of 2, can repeat 5× with 25s recovery; Fatigue Index = `(last−fastest)/fastest×100%` | <4.10s Excellent avg; >4.50s Poor |
| **Creative Speed Test** | Sprint + ball coordination | Dribble course + shoot into goal corner (invalid if miss) | <16s Excellent; >21s Poor |
| **Agility (arrowhead run)** | Change of direction | Sprint to markers A→C→B→finish, both directions, best of 2 trials | <14.0s Excellent; >18s Poor |
| **Short Dribbling Test** | Ball control + speed | Dribble through markers, timed | <10.0s Excellent; >14.0s Poor |
| **Balance Test** | Static balance | Stand on balance beam, count falls in 1 min, both legs | 0 falls Excellent; >10 Poor |
| **Sit & Reach** | Trunk flexibility | Standard box test | >14cm Excellent; <5cm Poor |
| **Explosive Strength (Vertical Jump / Counter-movement)** | Leg power | Chalk-mark wall reach method, best of 3 | >55cm Excellent (arm-free CMJ); <35cm Poor |

Position-specific Key Performance Indicator charts (radar/spider chart format) also exist for Full Backs, Wide Midfield, etc., scoring Player vs Coach assessment 1-5 across physiological, tactical, technical and psychological categories.

---

## 5. The 20-Sport Grassroot Talent Identification Matrix (Under-12, unless noted)

Every sport below shares a **common Anthropometric panel**: Height (cm), Weight (kg), BMI (kg/m²), Sitting Height (cm), Arm Span (cm), Waist-Hip Ratio (score <1 is favorable) — plus an optional blood-panel (CBC, ESR, Urea, Bile salts/pigments, Bilirubin) for medical screening.

| Sport | Category | Tests (Physical/Skill/Mental) | Units |
|---|---|---|---|
| **Athletics** | U14/U16 | One-foot balance (eyes open/closed); 20m (U14)/30m (U16) start; Standing long jump; Vertical jump; 40m (U14)/50m (U16) obstacle run; 5-step bounding; Chest-pass (age/gender-specific ball weight); Cricket ball overhead throw; 1.6km endurance run | sec, m, cm |
| **Archery** | U12 | *Physical:* 1.6km run, Heart rate, Bow-hand holding, Push-up, Sit-up, Sit & reach, Plank, Vertical jump, Broad jump. *Skill:* Draw, Anchor, Follow-through, Release, T-Stance, Left elbow (all scored in points). *Mental:* Concentration, Reasoning, Reaction, Command (points) | min, count, cm, points |
| **Badminton** | U12 | Side-step jump; Modified Bass test (pass/fail); Nelson hand reaction; Nelson foot reaction; 20m shuttle run; Shoulder flexibility; Sit & reach; Hand grip; Vertical jump; Standing long jump; Push-up; Plank | count, sec, cm, kg, m |
| **Basketball** | (see §2 above — full detailed protocol) | | |
| **Boxing** | U12 | 800m run; Hand grip; Medicine ball throw; Standing vertical jump; 30m flying-start sprint; Harre's agility test; Bend & reach | min, kg, m, sec, cm |
| **Cycling** | U12 | Standing broad jump; Standing vertical jump; 1600m (boys)/800m (girls) endurance run; Watt bike test | m, cm, min, watts |
| **Fencing** | U12 | Standing broad jump; Medicine ball put; Forward bend & reach; 30m flying start; 10×6 shuttle run; 800m run; Modified 300m shuttle (25m×12) | cm, m, sec, min |
| **Football** | U14 | (see §4 above) | |
| **Gymnastics** | U12 | 20m sprint; Standing broad jump; Hand grip (both hands); Shuttle run 10×6m; Flexed hang on high bar; Straight & side walking on balance beam | sec, cm, kg, min |
| **Hockey** | U12 | *Physical:* Speed 10m, Speed 40m, Repeated sprints 6×30m (% difference). *Skill:* Receiving short/long distance, Passing short/long distance, Overhead passing/receiving, Tackling, Aerial skills, Drag flicks, 1v1 — all scored % + fore/reverse stick counts | sec, %, count |
| **Judo** | U12 | Sit & reach; Modified Bass test; Modified 300m shuttle; T-Test; Vertical jump; Medicine ball put; Multistage shuttle run (beep test); Pull-up | cm, sec, m, level, count |
| **Kabaddi** | U12 | 6×10m shuttle run; 30m run; Standing broad jump; Forward bend & reach; Medicine ball throw; Sit-ups; 800m run | sec, cm, m, count |
| **Kho-Kho** | U12 | Cover & attack; Pole turn test; Oval run test; Zig-zag; 3-3-2 drill | sec, count, min |
| **Rowing** | U12 | Sit & reach; Vertical jump; 500m rowing ergometer (+ stroke rate); Sit-up; Pull-up; Push-up; 1RM bench pull; 1RM squat; Wall toss test; Stick reaction time; VO2max on ergometer | cm, m, min/sec, kg, ml/kg/min |
| **Shooting** | U12 | Bent-arm hang; Sit-ups; Sit & reach; Flamingo balance; Single-leg balance (eyes closed); Hand grip; Plate tapping; Push-ups; Modified pull-ups; Hip/waist circumference; Wall squat; Shoulder stretch (Y/N); 2kg medicine ball throw; 12-min run; 2-min dribble test; Bicycle ergometer W170 | sec, count, cm, kg, watts |
| **Swimming** | U12 | Sit & reach; Sit-up; Plank; Reaction test; Speed test | cm, count, sec/min, grade |
| **Table Tennis** | U12 | Kraus-Weber strength (pass/fail); Harvard step test (fitness index); Meredith physical growth (height/weight/BMI); Sit & reach; Nelson hand/leg reaction; SEMO agility; Flamingo balance | cm, kg, sec |
| **Volleyball** | U12 | Absolute vertical jump; 20m flying test (speed); 1kg medicine ball throw; SEMO/T-Test (agility) | cm, sec, m |
| **Weightlifting** | 12-14 yrs | Standing broad jump; Vertical jump; Push-ups; Sit-ups; Shuttle run 6×10m; 300m run; 1.5mile/12-min Cooper test (VO2max). *Sport-specific:* Deadlift, Bench Press, Squat (all 1RM in kg) | cm, m, min:sec, kg |
| **Wrestling** | U12 | SEMO agility/T-Test; 30m sprint; Sit & reach; Sit-ups (1 min); Standing broad jump; 1000m run; Rope climbing 1×5m; 200m run | sec/min, cm, count |

**Universal test-day safety protocol** (applies to every sport above): mandatory warm-up before first test; hydration breaks; site-check for even, hazard-free surfaces; cones/markers around sprint & landing zones with only the athlete and assessing coach inside; sharp edges covered; faulty equipment replaced before testing.

---

## 6. App Design Implications (from Concept Note + protocols)

**Core building blocks your app needs, reusable across all 22+ sports above:**
1. **Anthropometric module** — Height, Weight, BMI, Sitting Height, Arm Span, Waist-Hip Ratio (shared across all 20 sports in the Talent ID doc).
2. **Generic fitness battery module** — the 10 SAI Battery tests, usable standalone or as a sub-component feeding into sport-specific scoring.
3. **Sport-specific test library** — each sport's unique tests (e.g., Basketball's Illinois Agility, Football's Yo-Yo, Volleyball's Block Jump) as pluggable "test cards," each with: name, unit, raw-score formula, age/gender/birth-year benchmark table, and video-capture requirement.
4. **Scoring engine** — needs to support three scoring patterns seen across sports:
   - **Direct point lookup** (range → fixed marks, e.g. Basketball height, Volleyball speed)
   - **Formula-based conversion** (e.g., `(10−time)/2`, `jump/10 − 1`)
   - **Raw/Total → Scaled** rescaling (e.g., Basketball's `(raw/50)×20`)
5. **Video/AI requirements** (per Concept Note): continuous unedited single-take video, verbal athlete/test/date announcement, 720p+ MP4, one test per video, auto-reject combined/irrelevant footage, ±1cm height / ±2cm jump / ≥95% sit-up & shuttle accuracy targets.
6. **Ranking/eligibility layer** — combine raw camp score + achievement/medal bonuses (pattern seen in Basketball's Final Ranking formula and Volleyball's Sports Achievement table) to produce a percentile rank and Emerging/Promising/High-Potential band.
7. **Offline-first + sync** — full battery completable with zero connectivity, minimum 500 sessions stored locally, geo-tag + timestamp per result, later cloud sync to NSRS/Khelo India Portal via modular APIs.

---

*Note: Basketball's football-scored duplicate PDFs and the Volleyball PDF you uploaded match the detail already folded into sections 2–3 above; nothing from those was left out.*
