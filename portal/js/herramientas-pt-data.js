/**
 * PT Chart Data — Pressure-Temperature for common HVAC refrigerants
 * VERIFIED DATA from NIST WebBook, ASHRAE, Carrier, Army TM, manufacturer charts
 * Dense reference at 5°F intervals, linear interpolation for 1°F steps
 * Includes reverse-lookup helper (psig → temp)
 */
(function() {
  'use strict';

  function _r1(v) { return Math.round(v * 10) / 10; }

  /** Generate 1°F data from reference table via linear interpolation */
  function _fromRef(refObj) {
    var temps = Object.keys(refObj).map(Number).sort(function(a, b) { return a - b; });
    var minT = temps[0], maxT = temps[temps.length - 1];
    var pts = [];
    for (var t = Math.max(-60, minT); t <= Math.min(160, maxT); t += 1) {
      var p = _interp(temps, refObj, t);
      if (p !== null) pts.push({ temp_f: t, psig_liquid: _r1(p), psig_vapor: _r1(p) });
    }
    return pts;
  }

  function _fromRefZeo(refBubble, refDew) {
    var tempsB = Object.keys(refBubble).map(Number).sort(function(a, b) { return a - b; });
    var tempsD = Object.keys(refDew).map(Number).sort(function(a, b) { return a - b; });
    var minT = Math.max(tempsB[0], tempsD[0]);
    var maxT = Math.min(tempsB[tempsB.length - 1], tempsD[tempsD.length - 1]);
    var pts = [];
    for (var t = Math.max(-60, minT); t <= Math.min(160, maxT); t += 1) {
      var pb = _interp(tempsB, refBubble, t);
      var pd = _interp(tempsD, refDew, t);
      if (pb !== null && pd !== null) pts.push({ temp_f: t, psig_liquid: _r1(pb), psig_vapor: _r1(pd) });
    }
    return pts;
  }

  function _interp(temps, refObj, t) {
    if (refObj[t] !== undefined) return refObj[t];
    var lo = null, hi = null;
    for (var i = 0; i < temps.length; i++) {
      if (temps[i] <= t) lo = temps[i];
      if (temps[i] >= t && hi === null) hi = temps[i];
    }
    if (lo === null || hi === null || lo === hi) return null;
    var frac = (t - lo) / (hi - lo);
    return refObj[lo] + frac * (refObj[hi] - refObj[lo]);
  }

  // ============================================================
  // VERIFIED REFERENCE DATA — 5°F intervals, all values in PSIG
  // Sources: NIST WebBook, ASHRAE, Carrier, Army TM, manufacturer charts
  // ============================================================

  // R-22 (HCFC-22) — Verified correct against ASHRAE + multiple sources
  var _ref_R22 = {
    '-60': -11.8, '-55': -9.8, '-50': -7.6, '-45': -4.9, '-40': 0.5, '-35': 2.6, '-30': 5.0,
    '-25': 7.5, '-20': 10.2, '-15': 13.2, '-10': 16.5, '-5': 20.1, '0': 24.0,
    '5': 28.2, '10': 33.0, '15': 37.8, '20': 43.0, '25': 48.8, '30': 54.9,
    '35': 61.5, '40': 68.5, '45': 76.0, '50': 84.0, '55': 92.5, '60': 101.6,
    '65': 111.2, '70': 121.4, '75': 132.2, '80': 143.6, '85': 155.7, '90': 168.4,
    '95': 181.9, '100': 196.0, '105': 210.9, '110': 226.4, '115': 242.8, '120': 260.0,
    '125': 278.1, '130': 297.0, '135': 316.9, '140': 337.6, '145': 359.5, '150': 382.4
  };

  // R-410A — Corrected from The Engineering Knowledge + NIST REFPROP
  // Cross-validated: 70°F=201.1, 100°F=317.6, 130°F=476.8
  var _ref_R410A = {
    '-60': 0.2, '-55': 2.4, '-50': 4.9, '-45': 7.6, '-40': 10.7, '-35': 14.0, '-30': 17.7,
    '-25': 21.8, '-20': 26.2, '-15': 31.0, '-10': 36.3, '-5': 42.0, '0': 48.2,
    '5': 54.9, '10': 62.2, '15': 70.0, '20': 78.4, '25': 87.4, '30': 97.0,
    '35': 107.3, '40': 118.4, '45': 130.1, '50': 142.6, '55': 156.0, '60': 170.1,
    '65': 185.2, '70': 201.1, '75': 217.9, '80': 235.8, '85': 254.6, '90': 274.5,
    '95': 295.5, '100': 317.6, '105': 340.9, '110': 365.4, '115': 391.2, '120': 418.3,
    '125': 446.8, '130': 476.8, '135': 508.3, '140': 541.4, '145': 576.3, '150': 613.0,
    '155': 652.1, '160': 692.5
  };

  // R-134a — Corrected from Carrier + NIST WebBook + Pacific Seabreeze
  // Cross-validated: 40°F=35.0, 70°F=71.1, 100°F=124.2, 130°F=198.7
  var _ref_R134a = {
    '-40': -7.3, '-35': -6.1, '-30': -4.8, '-25': -3.4, '-20': -1.8, '-15': 0.0, '-10': 1.9,
    '-5': 4.1, '0': 6.5, '5': 9.1, '10': 11.9, '15': 15.1, '20': 18.4,
    '25': 22.1, '30': 26.1, '35': 30.4, '40': 35.0, '45': 40.0, '50': 45.4,
    '55': 51.2, '60': 57.4, '65': 64.1, '70': 71.1, '75': 78.7, '80': 86.7,
    '85': 95.2, '90': 104.3, '95': 114.0, '100': 124.2, '105': 134.9, '110': 146.4,
    '115': 158.4, '120': 171.2, '125': 184.6, '130': 198.7, '135': 213.6, '140': 229.2
  };

  // R-404A — Corrected from Army TM-10-4110-262-13-P + Advantage Engineering
  // Cross-validated: 0°F=32.8, 40°F=85.5, 70°F=147.5, 100°F=234.7, 130°F=353.0
  var _ref_R404A = {
    '-60': -3.4, '-55': -1.8, '-50': 0.0, '-45': 2.3, '-40': 4.5, '-35': 7.0, '-30': 9.9,
    '-25': 13.0, '-20': 16.3, '-15': 20.0, '-10': 23.9, '-5': 28.2, '0': 32.8,
    '5': 37.9, '10': 43.3, '15': 49.2, '20': 55.5, '25': 62.3, '30': 69.5,
    '35': 77.2, '40': 85.5, '45': 94.4, '50': 103.7, '55': 113.8, '60': 124.3,
    '65': 135.6, '70': 147.5, '75': 160.2, '80': 173.5, '85': 187.6, '90': 202.5,
    '95': 218.2, '100': 234.7, '105': 252.1, '110': 270.3, '115': 289.6, '120': 309.7,
    '125': 330.9, '130': 353.0
  };

  // R-407C (Zeotropic) — Corrected from The Engineering Knowledge + Fluidtool + Arkema
  // Cross-validated: bubble 70°F=140.5, dew 70°F=117.3
  var _ref_R407C_bubble = {
    '-40': 2.7, '-35': 5.0, '-30': 7.7, '-25': 10.5, '-20': 13.7,
    '-15': 17.1, '-10': 20.9, '-5': 25.2, '0': 29.5, '5': 34.3,
    '10': 39.5, '15': 45.2, '20': 51.2, '25': 57.7, '30': 64.7,
    '35': 72.2, '40': 80.2, '45': 88.7, '50': 97.9, '55': 107.6,
    '60': 118.0, '65': 128.9, '70': 140.5, '75': 152.7, '80': 165.8,
    '85': 179.5, '90': 194.1, '95': 209.4, '100': 225.5, '105': 242.5,
    '110': 260.3, '115': 279.0, '120': 298.6, '125': 319.2, '130': 340.7
  };
  var _ref_R407C_dew = {
    '-40': -4.6, '-35': -1.8, '-30': 1.6, '-25': 3.8, '-20': 6.5,
    '-15': 9.3, '-10': 12.3, '-5': 15.7, '0': 19.4, '5': 23.4,
    '10': 27.9, '15': 32.7, '20': 37.9, '25': 43.5, '30': 49.6,
    '35': 56.1, '40': 63.2, '45': 70.7, '50': 78.8, '55': 87.4,
    '60': 96.8, '65': 106.7, '70': 117.3, '75': 128.5, '80': 140.5,
    '85': 153.2, '90': 166.7, '95': 181.0, '100': 196.1, '105': 212.1,
    '110': 229.0, '115': 246.8, '120': 265.8, '125': 285.6, '130': 306.7
  };

  // R-32 — Corrected from NIST WebBook (CAS 75-10-5) + RefrigerantHQ
  // Cross-validated: 70°F=205.8
  var _ref_R32 = {
    '-40': 11.0, '-35': 14.4, '-30': 18.2, '-25': 22.3, '-20': 26.8,
    '-15': 31.7, '-10': 37.1, '-5': 42.9, '0': 49.3, '5': 56.1,
    '10': 63.5, '15': 71.4, '20': 80.0, '25': 89.2, '30': 99.1,
    '35': 109.7, '40': 121.0, '45': 133.0, '50': 145.8, '55': 159.5,
    '60': 174.0, '65': 189.5, '70': 205.8, '75': 223.2, '80': 241.5,
    '85': 260.9, '90': 281.3, '95': 302.9, '100': 325.7, '105': 349.6,
    '110': 374.9, '115': 401.4, '120': 429.3, '125': 458.7, '130': 489.5
  };

  // R-448A (Solstice N40) — Zeotropic HFO/HFC blend (R-32/R-125/R-1234yf/R-134a/R-1234ze)
  // Sources: Honeywell Solstice N40 Product Bulletin, ASHRAE, Hudson Technologies
  // Bubble point at 1 atm: ~-49.8°F, Glide: ~10-12°F
  var _ref_R448A_bubble = {
    '-40': 4.5, '-35': 7.1, '-30': 10.0, '-25': 13.3, '-20': 16.9,
    '-15': 20.9, '-10': 25.3, '-5': 30.2, '0': 35.5, '5': 41.3,
    '10': 47.7, '15': 54.7, '20': 62.2, '25': 70.4, '30': 79.3,
    '35': 88.9, '40': 99.2, '45': 110.4, '50': 122.4, '55': 135.2,
    '60': 149.0, '65': 163.7, '70': 179.5, '75': 196.3, '80': 214.2,
    '85': 233.3, '90': 253.7, '95': 275.3, '100': 298.3, '105': 322.8,
    '110': 348.7, '115': 376.3, '120': 405.5
  };
  var _ref_R448A_dew = {
    '-40': 1.9, '-35': 4.3, '-30': 7.0, '-25': 10.0, '-20': 13.4,
    '-15': 17.2, '-10': 21.4, '-5': 26.1, '0': 31.2, '5': 36.9,
    '10': 43.1, '15': 49.9, '20': 57.3, '25': 65.4, '30': 74.1,
    '35': 83.6, '40': 93.9, '45': 105.0, '50': 116.9, '55': 129.8,
    '60': 143.6, '65': 158.4, '70': 174.3, '75': 191.3, '80': 209.5,
    '85': 228.9, '90': 249.7, '95': 271.9, '100': 295.5, '105': 320.7,
    '110': 347.5, '115': 376.0, '120': 406.3
  };

  // R-449A (Opteon XP40) — Zeotropic HFO/HFC blend (R-32/R-125/R-1234yf/R-134a)
  // Sources: Chemours Opteon XP40 Product Bulletin, ASHRAE, Hudson Technologies
  // Bubble point at 1 atm: ~-49.1°F, Glide: ~10-11°F
  var _ref_R449A_bubble = {
    '-40': 4.8, '-35': 7.5, '-30': 10.5, '-25': 13.9, '-20': 17.6,
    '-15': 21.8, '-10': 26.3, '-5': 31.4, '0': 36.9, '5': 43.0,
    '10': 49.6, '15': 56.9, '20': 64.8, '25': 73.4, '30': 82.7,
    '35': 92.8, '40': 103.7, '45': 115.4, '50': 128.1, '55': 141.6,
    '60': 156.2, '65': 171.7, '70': 188.3, '75': 206.0, '80': 224.9,
    '85': 245.0, '90': 266.5, '95': 289.3, '100': 313.5, '105': 339.3,
    '110': 366.8, '115': 395.9, '120': 427.0
  };
  var _ref_R449A_dew = {
    '-40': 2.2, '-35': 4.6, '-30': 7.4, '-25': 10.6, '-20': 14.1,
    '-15': 18.0, '-10': 22.4, '-5': 27.2, '0': 32.6, '5': 38.5,
    '10': 45.0, '15': 52.2, '20': 60.0, '25': 68.5, '30': 77.8,
    '35': 87.8, '40': 98.7, '45': 110.5, '50': 123.1, '55': 136.7,
    '60': 151.3, '65': 167.0, '70': 183.8, '75': 201.7, '80': 221.0,
    '85': 241.5, '90': 263.4, '95': 286.8, '100': 311.7, '105': 338.3,
    '110': 366.7, '115': 397.0, '120': 429.2
  };

  // R-290 (Propane) — Corrected from NIST WebBook (CAS 74-98-6)
  // Cross-validated: 70°F=110.2
  var _ref_R290 = {
    '-40': 1.4, '-35': 3.4, '-30': 5.7, '-25': 8.1, '-20': 10.7,
    '-15': 13.6, '-10': 16.7, '-5': 20.1, '0': 23.7, '5': 27.6,
    '10': 31.8, '15': 36.3, '20': 41.1, '25': 46.3, '30': 51.8,
    '35': 57.7, '40': 63.9, '45': 70.6, '50': 77.6, '55': 85.1,
    '60': 93.0, '65': 101.4, '70': 110.2, '75': 119.5, '80': 129.3,
    '85': 139.7, '90': 150.5, '95': 161.9, '100': 173.9, '105': 186.5,
    '110': 199.6, '115': 213.4, '120': 227.8, '125': 242.9, '130': 258.7
  };

  // R-600a (Isobutane) — Corrected from NIST WebBook (CAS 75-28-5)
  // Cross-validated: 70°F=30.6, operates in vacuum below ~11°F
  var _ref_R600a = {
    '-40': -10.5, '-35': -9.9, '-30': -9.2, '-25': -8.4, '-20': -7.6,
    '-15': -6.6, '-10': -5.6, '-5': -4.4, '0': -3.2, '5': -1.8,
    '10': -0.3, '15': 1.4, '20': 3.2, '25': 5.1, '30': 7.2,
    '35': 9.4, '40': 11.9, '45': 14.5, '50': 17.3, '55': 20.3,
    '60': 23.5, '65': 27.0, '70': 30.6, '75': 34.5, '80': 38.7,
    '85': 43.1, '90': 47.8, '95': 52.7, '100': 57.9, '105': 63.5,
    '110': 69.3, '115': 75.5, '120': 82.0, '125': 88.8, '130': 95.9
  };

  // R-717 (Ammonia) — Corrected from NIST WebBook (CAS 7664-41-7) + IRPC
  // Cross-validated: 70°F=114.1
  var _ref_R717 = {
    '-40': -4.3, '-35': -2.7, '-30': -0.8, '-25': 1.3, '-20': 3.6,
    '-15': 6.2, '-10': 9.0, '-5': 12.2, '0': 15.7, '5': 19.5,
    '10': 23.8, '15': 28.4, '20': 33.5, '25': 39.0, '30': 45.0,
    '35': 51.5, '40': 58.6, '45': 66.2, '50': 74.5, '55': 83.3,
    '60': 92.9, '65': 103.1, '70': 114.1, '75': 125.8, '80': 138.4,
    '85': 151.7, '90': 166.0, '95': 181.1, '100': 197.2, '105': 214.3,
    '110': 232.4, '115': 251.5, '120': 271.7, '125': 293.1, '130': 315.7
  };

  // R-744 (CO2) — Corrected from NIST WebBook (CAS 124-38-9) + Carrier
  // Critical point at ~87.8°F / 1056.2 psig — no liquid/vapor above that
  var _ref_R744 = {
    '-40': 131.0, '-35': 146.5, '-30': 163.1, '-25': 181.0, '-20': 200.2,
    '-15': 220.8, '-10': 242.7, '-5': 266.1, '0': 291.0, '5': 317.6,
    '10': 345.7, '15': 375.6, '20': 407.2, '25': 440.7, '30': 476.1,
    '35': 513.4, '40': 552.9, '45': 594.5, '50': 638.3, '55': 684.5,
    '60': 733.1, '65': 784.2, '70': 838.1, '75': 894.9, '80': 954.9,
    '85': 1018.4
  };

  // R-1234yf (HFO) — From NIST REFPROP + Honeywell Solstice yf + Hudson Tech
  // Boiling point: -29.4°C / -20.9°F, pressures very close to R-134a
  var _ref_R1234yf = {
    '-30': -2.4, '-25': -1.1, '-20': 0.4, '-15': 2.0, '-10': 3.8,
    '-5': 5.8, '0': 7.9, '5': 10.3, '10': 12.9, '15': 15.8,
    '20': 18.9, '25': 22.4, '30': 26.1, '35': 30.2, '40': 34.6,
    '45': 39.4, '50': 44.6, '55': 50.2, '60': 56.3, '65': 62.8,
    '70': 69.8, '75': 77.4, '80': 85.5, '85': 94.2, '90': 103.5,
    '95': 113.5, '100': 124.2, '105': 135.6, '110': 147.8, '115': 160.9,
    '120': 174.8, '125': 189.7, '130': 205.6, '135': 222.6, '140': 240.7
  };

  // R-502 — Corrected from CADX Services + RefrigerantHQ + A-Gas
  // Cross-validated: 70°F=137.6
  var _ref_R502 = {
    '-40': 4.1, '-35': 6.5, '-30': 9.2, '-25': 12.1, '-20': 15.3,
    '-15': 18.8, '-10': 22.6, '-5': 26.7, '0': 31.1, '5': 35.9,
    '10': 41.0, '15': 46.5, '20': 52.5, '25': 58.8, '30': 65.6,
    '35': 72.8, '40': 80.5, '45': 88.7, '50': 97.4, '55': 107.0,
    '60': 116.4, '65': 127.0, '70': 137.6, '75': 149.0, '80': 161.3,
    '85': 174.0, '90': 187.4, '95': 201.0, '100': 216.2, '105': 232.0,
    '110': 247.9, '115': 265.0, '120': 282.7, '125': 301.0, '130': 320.8
  };

  // R-12 (CFC-12) — Corrected from NIST WebBook (CAS 75-71-8) + CADX
  // Cross-validated: 70°F=70.1
  var _ref_R12 = {
    '-40': -5.4, '-35': -4.1, '-30': -2.7, '-25': -1.2, '-20': 0.5,
    '-15': 2.4, '-10': 4.5, '-5': 6.7, '0': 9.1, '5': 11.7,
    '10': 14.6, '15': 17.7, '20': 21.0, '25': 24.6, '30': 28.4,
    '35': 32.5, '40': 36.9, '45': 41.6, '50': 46.6, '55': 51.9,
    '60': 57.6, '65': 63.7, '70': 70.1, '75': 76.8, '80': 84.0,
    '85': 91.6, '90': 99.6, '95': 108.0, '100': 116.9, '105': 126.3,
    '110': 136.1, '115': 146.4, '120': 157.3, '125': 168.6, '130': 180.5
  };

  // R-454B — From ESCO A2L Book / Honeywell Genetron Properties V 1.41
  // R-32/R-1234yf (68.9/31.1) — Zeotropic, REPLACEMENT for R-410A
  // Boiling point: -60°F, GWP: 466, Class: A2L
  var _ref_R454B_bubble = {
    '-45': 6.7, '-40': 9.6, '-35': 12.8, '-30': 16.3, '-25': 20.2,
    '-20': 24.4, '-15': 29, '-10': 34.1, '-5': 39.5, '0': 45.4,
    '5': 51.8, '10': 58.7, '15': 66.2, '20': 74.2, '25': 82.8,
    '30': 92, '35': 101.8, '40': 112.3, '45': 123.5, '50': 135.5,
    '55': 148.2, '60': 161.7, '65': 176, '70': 191.1, '75': 207.2,
    '80': 224.1, '85': 242, '90': 260.9, '95': 280.8, '100': 301.8,
    '105': 323.8, '110': 347, '115': 371.4, '120': 397, '125': 423.9,
    '130': 452, '135': 481.6, '140': 512.5, '145': 544.9, '150': 578.9,
    '155': 614.5, '160': 651.7, '165': 690.8, '170': 731.6
  };
  var _ref_R454B_dew = {
    '-45': 5.7, '-40': 8.5, '-35': 11.6, '-30': 15, '-25': 18.7,
    '-20': 22.8, '-15': 27.2, '-10': 32, '-5': 37.3, '0': 43,
    '5': 49.2, '10': 55.8, '15': 63, '20': 70.7, '25': 79,
    '30': 87.9, '35': 97.4, '40': 107.6, '45': 118.5, '50': 130,
    '55': 142.4, '60': 155.4, '65': 169.4, '70': 184.1, '75': 199.7,
    '80': 216.3, '85': 233.8, '90': 252.2, '95': 271.7, '100': 292.3,
    '105': 314, '110': 336.8, '115': 360.9, '120': 386.2, '125': 412.8,
    '130': 440.8, '135': 470.2, '140': 501.1, '145': 533.7, '150': 567.9,
    '155': 604, '160': 642.2, '165': 682.6, '170': 726.2
  };

  // ============================================================
  // BUILD FINAL DATA
  // ============================================================

  window.PT_DATA = {
    'R-22':     _fromRef(_ref_R22),
    'R-410A':   _fromRef(_ref_R410A),
    'R-134a':   _fromRef(_ref_R134a),
    'R-404A':   _fromRef(_ref_R404A),
    'R-407C':   _fromRefZeo(_ref_R407C_bubble, _ref_R407C_dew),
    'R-32':     _fromRef(_ref_R32),
    'R-454B':   _fromRefZeo(_ref_R454B_bubble, _ref_R454B_dew),
    'R-448A':   _fromRefZeo(_ref_R448A_bubble, _ref_R448A_dew),
    'R-449A':   _fromRefZeo(_ref_R449A_bubble, _ref_R449A_dew),
    'R-290':    _fromRef(_ref_R290),
    'R-600a':   _fromRef(_ref_R600a),
    'R-717':    _fromRef(_ref_R717),
    'R-744':    _fromRef(_ref_R744),
    'R-1234yf': _fromRef(_ref_R1234yf),
    'R-502':    _fromRef(_ref_R502),
    'R-12':     _fromRef(_ref_R12)
  };

  /** Reverse lookup: given pressure (psig), find closest saturation temperature (°F) */
  window.PT_REVERSE = function(refrigerant, psig) {
    var data = window.PT_DATA[refrigerant];
    if (!data || !data.length) return null;
    var closest = null, minDiff = Infinity;
    for (var i = 0; i < data.length; i++) {
      var diff = Math.abs(data[i].psig_vapor - psig);
      if (diff < minDiff) { minDiff = diff; closest = data[i]; }
    }
    return closest;
  };

  // ============================================================
  // COMPREHENSIVE REFRIGERANT PROPERTIES
  // Sources: ESCO A2L Book (2022), ASHRAE 34, NIST WebBook, Manufacturer SDS
  // ============================================================
  window.PT_META = {
    'R-22': {
      name: 'R-22 (HCFC-22)', type: 'HCFC', status: 'Phase-out', color: '#f59e0b',
      apps: 'AC residencial/comercial (legacy)',
      chemical: 'Clorodifluorometano', formula: 'CHClF\u2082',
      boiling_f: -41.4, gwp: 1810, odp: 0.055,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['MO', 'AB'], mol_weight: 86.47,
      density_lb_ft3: 74.5, latent_heat_btu_lb: 100.2,
      rcl_ppm: 59000, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 204.8, critical_psi: 721.9,
      replaces: '\u2014', replaced_by: 'R-410A, R-407C'
    },
    'R-410A': {
      name: 'R-410A', type: 'HFC', status: 'Activo (phase-down)', color: '#3b82f6',
      apps: 'Mini splits, AC residencial moderno',
      chemical: 'R-32/R-125', formula: 'CH\u2082F\u2082 / CHF\u2082CF\u2083',
      composition: '50/50', boiling_f: -55.3, gwp: 2088, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE'], mol_weight: 72.6,
      density_lb_ft3: 66.3, latent_heat_btu_lb: 91.3,
      rcl_ppm: 140000, blend_type: 'Near-azeotropic', glide_f: 0.3,
      critical_temp_f: 161.8, critical_psi: 711.5,
      replaces: 'R-22', replaced_by: 'R-454B, R-32'
    },
    'R-134a': {
      name: 'R-134a (HFC-134a)', type: 'HFC', status: 'Activo', color: '#10b981',
      apps: 'Automotriz, refrigeraci\u00F3n media temp, chillers',
      chemical: 'Tetrafluoroetano', formula: 'CH\u2082FCF\u2083',
      boiling_f: -15.3, gwp: 1430, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE', 'PAG'], mol_weight: 102.03,
      density_lb_ft3: 75.5, latent_heat_btu_lb: 93.4,
      rcl_ppm: 50000, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 213.9, critical_psi: 588.8,
      replaces: 'R-12', replaced_by: 'R-1234yf'
    },
    'R-404A': {
      name: 'R-404A', type: 'HFC', status: 'Phase-down', color: '#8b5cf6',
      apps: 'Refrigeraci\u00F3n comercial, congeladores, walk-in',
      chemical: 'R-125/R-143a/R-134a', formula: 'Blend',
      composition: '44/52/4', boiling_f: -46.2, gwp: 3920, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE'], mol_weight: 97.6,
      density_lb_ft3: 65.8, latent_heat_btu_lb: 72.1,
      rcl_ppm: 130000, blend_type: 'Near-azeotropic', glide_f: 0.8,
      critical_temp_f: 162.0, critical_psi: 540.6,
      replaces: 'R-502', replaced_by: 'R-448A, R-449A'
    },
    'R-407C': {
      name: 'R-407C (Zeotropic)', type: 'HFC', status: 'Activo', color: '#06b6d4',
      apps: 'Retrofit de R-22, AC comercial',
      chemical: 'R-32/R-125/R-134a', formula: 'Blend',
      composition: '23/25/52', boiling_f: -43.6, gwp: 1770, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE'], mol_weight: 86.2,
      density_lb_ft3: 71.2, latent_heat_btu_lb: 95.0,
      rcl_ppm: null, blend_type: 'Zeotropic', glide_f: 9,
      critical_temp_f: 186.7, critical_psi: 678.0,
      replaces: 'R-22', replaced_by: '\u2014'
    },
    'R-32': {
      name: 'R-32 (Difluorometano)', type: 'HFC', status: 'Nuevo est\u00E1ndar', color: '#2563eb',
      apps: 'Mini splits nuevos, bajo GWP, heat pumps',
      chemical: 'Difluorometano', formula: 'CH\u2082F\u2082',
      boiling_f: -62, gwp: 675, odp: 0,
      safety_class: 'A2L', flammability: '2L', toxicity: 'A',
      oil: ['POE', 'PVE'], mol_weight: 52.02,
      density_lb_ft3: 60.1, latent_heat_btu_lb: 145.5,
      rcl_ppm: 36000, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 173.1, critical_psi: 838.5,
      replaces: 'R-410A', replaced_by: '\u2014',
      burn_velocity: '<10 cm/s'
    },
    'R-454B': {
      name: 'R-454B (Puron Advance)', type: 'HFC/HFO', status: 'Nuevo est\u00E1ndar', color: '#6366f1',
      apps: 'Reemplazo R-410A, AC residencial/comercial, heat pumps',
      chemical: 'R-32/R-1234yf', formula: 'Blend',
      composition: '68.9/31.1', boiling_f: -60, gwp: 466, odp: 0,
      safety_class: 'A2L', flammability: '2L', toxicity: 'A',
      oil: ['POE'], mol_weight: 62.6,
      density_lb_ft3: 62.8, latent_heat_btu_lb: 127.0,
      rcl_ppm: 19000, blend_type: 'Zeotropic', glide_f: 2.5,
      critical_temp_f: 169.8, critical_psi: 780.0,
      replaces: 'R-410A', replaced_by: '\u2014',
      burn_velocity: '<10 cm/s',
      ignition_temp_f: 761
    },
    'R-448A': {
      name: 'R-448A (Solstice N40)', type: 'HFO/HFC', status: 'Nuevo', color: '#0ea5e9',
      apps: 'Reemplazo R-404A, supermercados, refrigeraci\u00F3n comercial',
      chemical: 'R-32/R-125/R-1234yf/R-134a/R-1234ze', formula: 'Blend',
      composition: '26/26/20/21/7', boiling_f: -50.8, gwp: 1273, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE'], mol_weight: 86.3,
      density_lb_ft3: 67.2, latent_heat_btu_lb: 82.0,
      rcl_ppm: null, blend_type: 'Zeotropic', glide_f: 11,
      critical_temp_f: 181.9, critical_psi: 645.0,
      replaces: 'R-404A', replaced_by: '\u2014'
    },
    'R-449A': {
      name: 'R-449A (Opteon XP40)', type: 'HFO/HFC', status: 'Nuevo', color: '#0891b2',
      apps: 'Reemplazo R-404A/R-22, retail, supermercados',
      chemical: 'R-32/R-125/R-1234yf/R-134a', formula: 'Blend',
      composition: '24.3/24.7/25.3/25.7', boiling_f: -49.1, gwp: 1282, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE'], mol_weight: 87.2,
      density_lb_ft3: 67.8, latent_heat_btu_lb: 80.5,
      rcl_ppm: null, blend_type: 'Zeotropic', glide_f: 10,
      critical_temp_f: 183.2, critical_psi: 650.0,
      replaces: 'R-404A, R-22', replaced_by: '\u2014'
    },
    'R-290': {
      name: 'R-290 (Propano)', type: 'HC', status: 'Natural', color: '#ef4444',
      apps: 'Refrigeraci\u00F3n ligera, self-contained units, vending',
      chemical: 'Propano', formula: 'C\u2083H\u2088',
      boiling_f: -44, gwp: 3, odp: 0,
      safety_class: 'A3', flammability: '3', toxicity: 'A',
      oil: ['MO', 'AB', 'POE'], mol_weight: 44.1,
      density_lb_ft3: 30.7, latent_heat_btu_lb: 162.0,
      rcl_ppm: 5300, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 206.1, critical_psi: 616.3,
      replaces: '\u2014', replaced_by: '\u2014',
      charge_limit: '5.3 oz max (150g) — EPA SNAP'
    },
    'R-600a': {
      name: 'R-600a (Isobutano)', type: 'HC', status: 'Natural', color: '#f97316',
      apps: 'Refrigeradores dom\u00E9sticos, peque\u00F1os freezers',
      chemical: 'Isobutano', formula: 'C\u2084H\u2081\u2080',
      boiling_f: 11, gwp: 3, odp: 0,
      safety_class: 'A3', flammability: '3', toxicity: 'A',
      oil: ['MO', 'AB', 'POE'], mol_weight: 58.12,
      density_lb_ft3: 34.4, latent_heat_btu_lb: 150.0,
      rcl_ppm: null, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 274.5, critical_psi: 527.9,
      replaces: 'R-12', replaced_by: '\u2014',
      charge_limit: '2.0 oz max (57g) — EPA SNAP'
    },
    'R-717': {
      name: 'R-717 (Amoniaco)', type: 'Natural', status: 'Industrial', color: '#a855f7',
      apps: 'Plantas industriales, cold storage, procesamiento de alimentos',
      chemical: 'Amoniaco', formula: 'NH\u2083',
      boiling_f: -28, gwp: 0, odp: 0,
      safety_class: 'B2L', flammability: '2L', toxicity: 'B',
      oil: ['MO'], mol_weight: 17.03,
      density_lb_ft3: 37.5, latent_heat_btu_lb: 565.0,
      rcl_ppm: null, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 271.4, critical_psi: 1646.0,
      replaces: '\u2014', replaced_by: '\u2014'
    },
    'R-744': {
      name: 'R-744 (CO\u2082)', type: 'Natural', status: 'Emergente', color: '#64748b',
      apps: 'Transcr\u00EDtico, supermercados, heat pumps, automotriz',
      chemical: 'Di\u00F3xido de Carbono', formula: 'CO\u2082',
      boiling_f: -109.3, gwp: 1, odp: 0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['POE'], mol_weight: 44.01,
      density_lb_ft3: 46.2, latent_heat_btu_lb: 100.8,
      rcl_ppm: null, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 87.8, critical_psi: 1071,
      replaces: '\u2014', replaced_by: '\u2014',
      note: 'Punto cr\u00EDtico bajo (87.8\u00B0F) \u2014 opera transcr\u00EDtico a >88\u00B0F'
    },
    'R-1234yf': {
      name: 'R-1234yf (Opteon YF)', type: 'HFO', status: 'Nuevo est\u00E1ndar', color: '#22c55e',
      apps: 'Automotriz (reemplazo R-134a), MAC systems',
      chemical: 'Tetrafluoropropeno', formula: 'CF\u2083CF=CH\u2082',
      boiling_f: -22, gwp: 4, odp: 0,
      safety_class: 'A2L', flammability: '2L', toxicity: 'A',
      oil: ['POE', 'PAG'], mol_weight: 114.04,
      density_lb_ft3: 68.7, latent_heat_btu_lb: 79.5,
      rcl_ppm: 16000, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 202.5, critical_psi: 490.5,
      replaces: 'R-134a', replaced_by: '\u2014',
      burn_velocity: '<10 cm/s'
    },
    'R-502': {
      name: 'R-502 (Obsoleto)', type: 'CFC/HCFC', status: 'Prohibido', color: '#94a3b8',
      apps: 'Refrigeraci\u00F3n baja temp (legacy)',
      chemical: 'R-22/R-115', formula: 'Blend',
      composition: '48.8/51.2', boiling_f: -49.8, gwp: 4657, odp: 0.33,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['MO', 'AB'], mol_weight: 111.6,
      density_lb_ft3: 73.8, latent_heat_btu_lb: 62.0,
      rcl_ppm: null, blend_type: 'Azeotropic', glide_f: 0,
      critical_temp_f: 179.9, critical_psi: 590.0,
      replaces: '\u2014', replaced_by: 'R-404A, R-507A'
    },
    'R-12': {
      name: 'R-12 (CFC-12, Freon)', type: 'CFC', status: 'Prohibido', color: '#6b7280',
      apps: 'AC automotriz/residencial (legacy)',
      chemical: 'Diclorodifluorometano', formula: 'CCl\u2082F\u2082',
      boiling_f: -21.6, gwp: 10900, odp: 1.0,
      safety_class: 'A1', flammability: '1', toxicity: 'A',
      oil: ['MO'], mol_weight: 120.91,
      density_lb_ft3: 81.8, latent_heat_btu_lb: 71.0,
      rcl_ppm: null, blend_type: 'Puro', glide_f: 0,
      critical_temp_f: 233.6, critical_psi: 596.9,
      replaces: '\u2014', replaced_by: 'R-134a, R-1234yf'
    }
  };

  window.PT_ORDER = [
    'R-410A', 'R-454B', 'R-22', 'R-134a', 'R-404A', 'R-407C', 'R-32',
    'R-448A', 'R-449A', 'R-1234yf', 'R-290', 'R-600a', 'R-717', 'R-744',
    'R-502', 'R-12'
  ];
})();
