/**
 * Parts Finder Data — Massive HVAC equipment, compressor & parts database
 * Organized by Mario's 4 Circuits: Electricidad, Refrigeración, Airflow, Agua
 */
(function() {
  'use strict';

  // ============================================================
  // BRANDS
  // ============================================================
  // Brand monograms — 2-letter initials rendered as typographic logo chips.
  // Each brand has a hue for its monogram tile background. All light,
  // desaturated, designed to sit on the warm #FAFAF7 canvas.
  window.PF_BRANDS = [
    { name: 'Carrier',        mono: 'CA', hue: '#1E3A8A' },
    { name: 'Trane',          mono: 'TR', hue: '#991B1B' },
    { name: 'Lennox',         mono: 'LE', hue: '#B45309' },
    { name: 'Goodman',        mono: 'GO', hue: '#047857' },
    { name: 'Rheem/Ruud',     mono: 'RH', hue: '#A16207' },
    { name: 'York',           mono: 'YO', hue: '#1E3A8A' },
    { name: 'Daikin',         mono: 'DA', hue: '#334155' },
    { name: 'Bryant',         mono: 'BR', hue: '#0369A1' },
    { name: 'Amana',          mono: 'AM', hue: '#78350F' },
    { name: 'Heil',           mono: 'HE', hue: '#991B1B' },
    { name: 'Payne',          mono: 'PA', hue: '#1E40AF' },
    { name: 'Mitsubishi',     mono: 'MI', hue: '#7F1D1D' },
    { name: 'LG',             mono: 'LG', hue: '#9F1239' },
    { name: 'Fujitsu',        mono: 'FU', hue: '#1E3A8A' },
    { name: 'MRCOOL',         mono: 'MR', hue: '#047857' },
    { name: 'Copeland',       mono: 'CO', hue: '#0F0F0F' },
    { name: 'Danfoss',        mono: 'DF', hue: '#B91C1C' },
    { name: 'Bristol',        mono: 'BI', hue: '#1D4ED8' },
    { name: 'Honeywell',      mono: 'HO', hue: '#B91C1C' },
    { name: 'Rinnai',         mono: 'RI', hue: '#991B1B' },
    { name: 'Navien',         mono: 'NA', hue: '#1E40AF' },
    { name: 'AO Smith',       mono: 'AO', hue: '#1E3A8A' },
    { name: 'Weil-McLain',    mono: 'WM', hue: '#7F1D1D' },
    { name: 'Burnham',        mono: 'BU', hue: '#9A3412' },
    { name: 'Bradford White', mono: 'BW', hue: '#1E3A8A' },
    { name: 'Noritz',         mono: 'NO', hue: '#334155' },
    { name: 'Samsung',        mono: 'SA', hue: '#1D4ED8' },
    { name: 'Pioneer',        mono: 'PI', hue: '#065F46' },
    { name: 'Ecobee',         mono: 'EC', hue: '#047857' },
    { name: 'Taco',           mono: 'TA', hue: '#991B1B' },
    { name: 'Grundfos',       mono: 'GR', hue: '#1E40AF' }
  ];

  // ============================================================
  // EQUIPMENT DATABASE — Condensers, Heat Pumps, Mini Splits
  // ============================================================
  window.PF_EQUIPMENT = [
    // ── CARRIER Condensers ──
    { brand: 'Carrier', model: '24ACC618A003', type: 'Condensadora', tons: 1.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP20K5E', oil: 'POE', oilOz: 27, metering: 'TXV', voltage: '208-230/1/60', rla: 9.8, lra: 58, fla: 0.8, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '24ACC624A003', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP25K5E', oil: 'POE', oilOz: 27, metering: 'TXV', voltage: '208-230/1/60', rla: 11.5, lra: 68, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '24ACC630A003', type: 'Condensadora', tons: 2.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP29K5E', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 13.2, lra: 76, fla: 1.1, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '24ACC636A003', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP34K5E', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 15.8, lra: 96, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '24ACC642A003', type: 'Condensadora', tons: 3.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP42K5E', oil: 'POE', oilOz: 46, metering: 'TXV', voltage: '208-230/1/60', rla: 19.0, lra: 117, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '24ACC648A003', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP49K5E', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 22.8, lra: 134, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '24ACC660A003', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland ZP61K5E', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 28.0, lra: 170, fla: 1.5, circuit: 'refrigeracion' },
    // Carrier Heat Pumps
    { brand: 'Carrier', model: '25HBC536A003', type: 'Bomba de Calor', tons: 3, seer: 15, refrigerant: 'R-410A', compressor: 'Copeland ZP34K5E', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 15.8, lra: 96, fla: 1.1, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '25HBC548A003', type: 'Bomba de Calor', tons: 4, seer: 15, refrigerant: 'R-410A', compressor: 'Copeland ZP49K5E', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 22.8, lra: 134, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Carrier', model: '25HBC560A003', type: 'Bomba de Calor', tons: 5, seer: 15, refrigerant: 'R-410A', compressor: 'Copeland ZP61K5E', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 28.0, lra: 170, fla: 1.5, circuit: 'refrigeracion' },

    // ── TRANE Condensers ──
    { brand: 'Trane', model: '4TTR6024J1000A', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.0, lra: 66, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TTR6030J1000A', type: 'Condensadora', tons: 2.5, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 12.5, lra: 74, fla: 1.1, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TTR6036J1000A', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 13.9, lra: 98, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TTR6042J1000A', type: 'Condensadora', tons: 3.5, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 48, metering: 'TXV', voltage: '208-230/1/60', rla: 16.5, lra: 108, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TTR6048J1000A', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.5, lra: 115, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TTR6060J1000A', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 68, metering: 'TXV', voltage: '208-230/1/60', rla: 24.0, lra: 142, fla: 1.6, circuit: 'refrigeracion' },

    // ── GOODMAN Condensers ──
    { brand: 'Goodman', model: 'GSX160181', type: 'Condensadora', tons: 1.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 27, metering: 'TXV', voltage: '208-230/1/60', rla: 9.5, lra: 56, fla: 0.8, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSX160241', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.2, lra: 65, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSX160301', type: 'Condensadora', tons: 2.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 13.0, lra: 75, fla: 1.1, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSX160361', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.0, lra: 95, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSX160421', type: 'Condensadora', tons: 3.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 46, metering: 'TXV', voltage: '208-230/1/60', rla: 17.0, lra: 108, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSX160481', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.8, lra: 112, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSX160601', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 23.5, lra: 140, fla: 1.5, circuit: 'refrigeracion' },

    // ── RHEEM/RUUD Condensers ──
    { brand: 'Rheem/Ruud', model: 'RA1618AJ1NA', type: 'Condensadora', tons: 1.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 27, metering: 'TXV', voltage: '208-230/1/60', rla: 9.6, lra: 57, fla: 0.8, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RA1624AJ1NA', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.3, lra: 67, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RA1630AJ1NA', type: 'Condensadora', tons: 2.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 13.0, lra: 75, fla: 1.1, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RA1636AJ1NA', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.2, lra: 97, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RA1642AJ1NA', type: 'Condensadora', tons: 3.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 46, metering: 'TXV', voltage: '208-230/1/60', rla: 17.2, lra: 110, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RA1648AJ1NA', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 19.0, lra: 116, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RA1660AJ1NA', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 24.0, lra: 145, fla: 1.5, circuit: 'refrigeracion' },

    // ── LENNOX Condensers ──
    { brand: 'Lennox', model: 'XC16-024-230', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.0, lra: 64, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Lennox', model: 'XC16-030-230', type: 'Condensadora', tons: 2.5, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 12.8, lra: 74, fla: 1.1, circuit: 'refrigeracion' },
    { brand: 'Lennox', model: 'XC16-036-230', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.1, lra: 94, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Lennox', model: 'XC16-048-230', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.6, lra: 110, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Lennox', model: 'XC16-060-230', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 24.5, lra: 148, fla: 1.5, circuit: 'refrigeracion' },

    // ── YORK Condensers ──
    { brand: 'York', model: 'YCE24B21S', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.2, lra: 66, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'York', model: 'YCE36B21S', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.3, lra: 96, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'York', model: 'YCE48B21S', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 19.1, lra: 118, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'York', model: 'YCE60B21S', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 24.2, lra: 146, fla: 1.5, circuit: 'refrigeracion' },

    // ── DAIKIN Condensers ──
    { brand: 'Daikin', model: 'DX16SA0181', type: 'Condensadora', tons: 1.5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 27, metering: 'TXV', voltage: '208-230/1/60', rla: 9.5, lra: 56, fla: 0.8, circuit: 'refrigeracion' },
    { brand: 'Daikin', model: 'DX16SA0241', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.0, lra: 64, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Daikin', model: 'DX16SA0361', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.0, lra: 95, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Daikin', model: 'DX16SA0481', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.8, lra: 112, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Daikin', model: 'DX16SA0601', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 23.5, lra: 140, fla: 1.5, circuit: 'refrigeracion' },

    // ── MINI SPLITS ──
    { brand: 'Mitsubishi', model: 'MSZ-GL09NA', type: 'Mini Split', tons: 0.75, seer: 24.6, refrigerant: 'R-410A', compressor: 'Mitsubishi Rotary', oil: 'POE', oilOz: 18, metering: 'EEV', voltage: '208-230/1/60', rla: 5.2, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 9000 },
    { brand: 'Mitsubishi', model: 'MSZ-GL12NA', type: 'Mini Split', tons: 1, seer: 23.1, refrigerant: 'R-410A', compressor: 'Mitsubishi Rotary', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'Mitsubishi', model: 'MSZ-GL18NA', type: 'Mini Split', tons: 1.5, seer: 20.5, refrigerant: 'R-410A', compressor: 'Mitsubishi Rotary', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 9.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'Mitsubishi', model: 'MSZ-GL24NA', type: 'Mini Split', tons: 2, seer: 19.0, refrigerant: 'R-410A', compressor: 'Mitsubishi Rotary', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'Mitsubishi', model: 'MSZ-FH15NA', type: 'Mini Split Hyper Heat', tons: 1.25, seer: 22.0, refrigerant: 'R-410A', compressor: 'Mitsubishi Rotary', oil: 'POE', oilOz: 24, metering: 'EEV', voltage: '208-230/1/60', rla: 7.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 15000 },
    { brand: 'LG', model: 'LSN090HSV5', type: 'Mini Split', tons: 0.75, seer: 23.5, refrigerant: 'R-410A', compressor: 'LG Rotary', oil: 'POE', oilOz: 18, metering: 'EEV', voltage: '208-230/1/60', rla: 5.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 9000 },
    { brand: 'LG', model: 'LSN120HSV5', type: 'Mini Split', tons: 1, seer: 23.5, refrigerant: 'R-410A', compressor: 'LG Rotary', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.2, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'LG', model: 'LSN180HSV5', type: 'Mini Split', tons: 1.5, seer: 20.0, refrigerant: 'R-410A', compressor: 'LG Rotary', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 8.8, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'Fujitsu', model: 'ASU9RLS3', type: 'Mini Split', tons: 0.75, seer: 33.0, refrigerant: 'R-410A', compressor: 'Fujitsu Rotary', oil: 'POE', oilOz: 16, metering: 'EEV', voltage: '208-230/1/60', rla: 4.8, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 9000 },
    { brand: 'Fujitsu', model: 'ASU12RLS3H', type: 'Mini Split', tons: 1, seer: 29.3, refrigerant: 'R-410A', compressor: 'Fujitsu Rotary', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'MRCOOL', model: 'DIY-12-HP-WM-230C', type: 'Mini Split DIY', tons: 1, seer: 22.0, refrigerant: 'R-410A', compressor: 'Rotary', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'MRCOOL', model: 'DIY-18-HP-WM-230C', type: 'Mini Split DIY', tons: 1.5, seer: 20.0, refrigerant: 'R-410A', compressor: 'Rotary', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 9.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'MRCOOL', model: 'DIY-24-HP-WM-230C', type: 'Mini Split DIY', tons: 2, seer: 20.0, refrigerant: 'R-410A', compressor: 'Rotary', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.2, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'MRCOOL', model: 'DIY-36-HP-WM-230C', type: 'Mini Split DIY', tons: 3, seer: 18.0, refrigerant: 'R-410A', compressor: 'Rotary', oil: 'POE', oilOz: 40, metering: 'EEV', voltage: '208-230/1/60', rla: 14.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 36000 },

    // ── GAS FURNACES (Circuito Airflow + Electricidad) ──
    { brand: 'Carrier', model: '59SC2A040S14--12', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'airflow', btu: 40000, afue: 96 },
    { brand: 'Carrier', model: '59SC2A060S17--14', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 7.0, circuit: 'airflow', btu: 60000, afue: 96 },
    { brand: 'Carrier', model: '59SC2A080S17--16', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Carrier', model: '58STA090-1-14', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 9.0, circuit: 'airflow', btu: 90000, afue: 96 },
    { brand: 'Carrier', model: '58STA110-1-20', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 11.0, circuit: 'airflow', btu: 110000, afue: 96 },
    { brand: 'Trane', model: 'S9X2B060U4PSA', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', btu: 60000, afue: 97 },
    { brand: 'Trane', model: 'S9X2B080U4PSA', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 97 },
    { brand: 'Trane', model: 'S9X2B100U5PSA', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 97 },
    { brand: 'Trane', model: 'XR95 TUD1B060A9361A', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', btu: 60000, afue: 95 },
    { brand: 'Goodman', model: 'GMSS920603BN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', btu: 60000, afue: 92 },
    { brand: 'Goodman', model: 'GMSS920803BN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 92 },
    { brand: 'Goodman', model: 'GMVC960603BN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', btu: 60000, afue: 96 },
    { brand: 'Goodman', model: 'GMVC960803BN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Goodman', model: 'GMVC961005CN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 96 },
    { brand: 'Rheem/Ruud', model: 'R801TA050317MSA', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'airflow', btu: 50000, afue: 80 },
    { brand: 'Rheem/Ruud', model: 'R96VA0702317MSA', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 7.0, circuit: 'airflow', btu: 70000, afue: 96 },
    { brand: 'Rheem/Ruud', model: 'R96VA1002521MSA', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 96 },
    { brand: 'Lennox', model: 'SL297NV060XV36B', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', btu: 60000, afue: 97 },
    { brand: 'Lennox', model: 'SL297NV070XV36B', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 7.0, circuit: 'airflow', btu: 70000, afue: 97 },
    { brand: 'Lennox', model: 'EL296V060XV36A', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', btu: 60000, afue: 96 },

    // ── TANKLESS WATER HEATERS (Circuito Agua) ──
    { brand: 'Rinnai', model: 'RU199iN', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 199000, gpm: 11.0, uef: 0.93 },
    { brand: 'Rinnai', model: 'RU160iN', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 160000, gpm: 9.0, uef: 0.93 },
    { brand: 'Rinnai', model: 'V75iN', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 180000, gpm: 7.5, uef: 0.82 },
    { brand: 'Navien', model: 'NPE-240A2', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 199000, gpm: 11.2, uef: 0.96 },
    { brand: 'Navien', model: 'NPE-180A2', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 150000, gpm: 8.4, uef: 0.96 },
    { brand: 'Navien', model: 'NCB-240E', type: 'Combi Boiler', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.5, circuit: 'agua', btu: 199000, gpm: 4.5, uef: 0.95 },
    { brand: 'Rheem/Ruud', model: 'RTGH-95DVLN-3', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 199000, gpm: 9.5, uef: 0.93 },
    { brand: 'AO Smith', model: 'ATI-540H-N', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 199000, gpm: 10.0, uef: 0.93 },

    // ── WATER HEATERS (Tank) ──
    { brand: 'Rheem/Ruud', model: 'PROG50-38N RH62', type: 'Water Heater Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 0, circuit: 'agua', btu: 38000, galones: 50, uef: 0.60 },
    { brand: 'Rheem/Ruud', model: 'PROG40-36N RH60', type: 'Water Heater Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 0, circuit: 'agua', btu: 36000, galones: 40, uef: 0.58 },
    { brand: 'AO Smith', model: 'GPVL-50 200', type: 'Water Heater Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 0, circuit: 'agua', btu: 40000, galones: 50, uef: 0.60 },

    // ── BOILERS (Circuito Agua) ──
    { brand: 'Navien', model: 'NHB-80', type: 'Boiler', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.5, circuit: 'agua', btu: 80000, afue: 95 },
    { brand: 'Navien', model: 'NHB-150', type: 'Boiler', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 3.0, circuit: 'agua', btu: 150000, afue: 95 },

    // ── BRYANT Condensers (hermano de Carrier) ──
    { brand: 'Bryant', model: '126BNA024000', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 27, metering: 'TXV', voltage: '208-230/1/60', rla: 11.5, lra: 68, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Bryant', model: '126BNA036000', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 15.8, lra: 96, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Bryant', model: '126BNA048000', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 22.8, lra: 134, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Bryant', model: '126BNA060000', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 28.0, lra: 170, fla: 1.5, circuit: 'refrigeracion' },

    // ── AMANA Condensers (hermano de Goodman) ──
    { brand: 'Amana', model: 'ASX160241', type: 'Condensadora', tons: 2, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 30, metering: 'TXV', voltage: '208-230/1/60', rla: 11.2, lra: 65, fla: 1.0, circuit: 'refrigeracion' },
    { brand: 'Amana', model: 'ASX160361', type: 'Condensadora', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.0, lra: 95, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Amana', model: 'ASX160481', type: 'Condensadora', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.8, lra: 112, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Amana', model: 'ASX160601', type: 'Condensadora', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 23.5, lra: 140, fla: 1.5, circuit: 'refrigeracion' },

    // ── MORE HEAT PUMPS ──
    { brand: 'Trane', model: '4TWR6036N1000', type: 'Bomba de Calor', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 13.9, lra: 98, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TWR6048N1000', type: 'Bomba de Calor', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.5, lra: 115, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Trane', model: '4TWR6060N1000', type: 'Bomba de Calor', tons: 5, seer: 16, refrigerant: 'R-410A', compressor: 'Climatuff Scroll', oil: 'POE', oilOz: 68, metering: 'TXV', voltage: '208-230/1/60', rla: 24.0, lra: 142, fla: 1.6, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSZB403610', type: 'Bomba de Calor', tons: 3, seer: 14, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.0, lra: 95, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSZB404810', type: 'Bomba de Calor', tons: 4, seer: 14, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.8, lra: 112, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Goodman', model: 'GSZB406010', type: 'Bomba de Calor', tons: 5, seer: 14, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 66, metering: 'TXV', voltage: '208-230/1/60', rla: 23.5, lra: 140, fla: 1.5, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RP1636AJ2NA', type: 'Bomba de Calor', tons: 3, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.2, lra: 97, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Rheem/Ruud', model: 'RP1648AJ2NA', type: 'Bomba de Calor', tons: 4, seer: 16, refrigerant: 'R-410A', compressor: 'Copeland Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 19.0, lra: 116, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Lennox', model: 'EL17XP1-036-230', type: 'Bomba de Calor', tons: 3, seer: 17, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 40, metering: 'TXV', voltage: '208-230/1/60', rla: 14.1, lra: 94, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Lennox', model: 'EL17XP1-048-230', type: 'Bomba de Calor', tons: 4, seer: 17, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 18.6, lra: 110, fla: 1.4, circuit: 'refrigeracion' },
    { brand: 'Bryant', model: '286BNC036000', type: 'Bomba de Calor', tons: 3, seer: 17, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 36, metering: 'TXV', voltage: '208-230/1/60', rla: 15.8, lra: 96, fla: 1.3, circuit: 'refrigeracion' },
    { brand: 'Bryant', model: '286BNC048000', type: 'Bomba de Calor', tons: 4, seer: 17, refrigerant: 'R-410A', compressor: 'Scroll', oil: 'POE', oilOz: 56, metering: 'TXV', voltage: '208-230/1/60', rla: 22.8, lra: 134, fla: 1.3, circuit: 'refrigeracion' },

    // ── MORE MINI SPLITS ──
    { brand: 'Mitsubishi', model: 'MSZ-GL15NA', type: 'Mini Split', tons: 1.25, seer: 21.6, refrigerant: 'R-410A', compressor: 'Mitsubishi Rotary', oil: 'POE', oilOz: 22, metering: 'EEV', voltage: '208-230/1/60', rla: 7.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 15000 },
    { brand: 'Samsung', model: 'AR12BSFCMWK Wind-Free', type: 'Mini Split', tons: 1, seer: 20, refrigerant: 'R-410A', compressor: 'Samsung Rotary', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.2, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'Samsung', model: 'AR18BSFCMWK Wind-Free', type: 'Mini Split', tons: 1.5, seer: 20, refrigerant: 'R-410A', compressor: 'Samsung Rotary', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 9.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'Samsung', model: 'AR24BSFCMWK Wind-Free', type: 'Mini Split', tons: 2, seer: 20, refrigerant: 'R-410A', compressor: 'Samsung Rotary', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'Pioneer', model: 'WYS012GMFI22RL', type: 'Mini Split', tons: 1, seer: 22, refrigerant: 'R-410A', compressor: 'Rotary Inverter', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'Pioneer', model: 'WYS018GMFI22RL', type: 'Mini Split', tons: 1.5, seer: 22, refrigerant: 'R-410A', compressor: 'Rotary Inverter', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 9.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'Pioneer', model: 'WYS024GMFI19RL', type: 'Mini Split', tons: 2, seer: 19, refrigerant: 'R-410A', compressor: 'Rotary Inverter', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.2, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'Fujitsu', model: 'ASU15RLF', type: 'Mini Split', tons: 1.25, seer: 21.5, refrigerant: 'R-410A', compressor: 'Fujitsu Rotary', oil: 'POE', oilOz: 22, metering: 'EEV', voltage: '208-230/1/60', rla: 7.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 15000 },
    { brand: 'Fujitsu', model: 'ASU18RLF', type: 'Mini Split', tons: 1.5, seer: 19.0, refrigerant: 'R-410A', compressor: 'Fujitsu Rotary', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 9.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'Fujitsu', model: 'ASU24RLB', type: 'Mini Split', tons: 2, seer: 20.0, refrigerant: 'R-410A', compressor: 'Fujitsu Rotary', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'Daikin', model: 'FTXS12WVJU9', type: 'Mini Split', tons: 1, seer: 19, refrigerant: 'R-410A', compressor: 'Daikin Swing', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },
    { brand: 'Daikin', model: 'FTXS18WVJU9', type: 'Mini Split', tons: 1.5, seer: 19, refrigerant: 'R-410A', compressor: 'Daikin Swing', oil: 'POE', oilOz: 28, metering: 'EEV', voltage: '208-230/1/60', rla: 9.0, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 18000 },
    { brand: 'Daikin', model: 'FTXS24WVJU9', type: 'Mini Split', tons: 2, seer: 19, refrigerant: 'R-410A', compressor: 'Daikin Swing', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'LG', model: 'LSN240HSV5', type: 'Mini Split', tons: 2, seer: 20.5, refrigerant: 'R-410A', compressor: 'LG Rotary', oil: 'POE', oilOz: 32, metering: 'EEV', voltage: '208-230/1/60', rla: 11.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 24000 },
    { brand: 'MRCOOL', model: 'DIY-12-HP-230D (5th Gen)', type: 'Mini Split DIY', tons: 1, seer: 22, refrigerant: 'R-454B', compressor: 'Rotary', oil: 'POE', oilOz: 20, metering: 'EEV', voltage: '208-230/1/60', rla: 6.5, lra: 0, fla: 0, circuit: 'refrigeracion', btu: 12000 },

    // ── MORE FURNACES — Bryant, York, Amana ──
    { brand: 'Bryant', model: '986TA60080V20--A', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Bryant', model: '915SA60080V17', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Bryant', model: '310AAV060100', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 80 },
    { brand: 'York', model: 'TM9V080B12MP11', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'York', model: 'TM9V100C16MP11', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 96 },
    { brand: 'York', model: 'TM8V080B12MP11', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 80 },
    { brand: 'Amana', model: 'AMVC960804CN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Amana', model: 'AMVC961005CN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 96 },
    { brand: 'Amana', model: 'AMSS960803BN', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Carrier', model: '59MN7A080V21--18', type: 'Furnace Gas Modulating', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 98 },
    { brand: 'Carrier', model: '59MN7A100V21--20', type: 'Furnace Gas Modulating', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 98 },
    { brand: 'Trane', model: 'S9V2B080U4PSA', type: 'Furnace Gas Modulating', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 97 },
    { brand: 'Goodman', model: 'GMVM970804BN', type: 'Furnace Gas Modulating', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 97 },
    { brand: 'Rheem/Ruud', model: 'R98MV080317MSA', type: 'Furnace Gas Modulating', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 98 },
    { brand: 'Lennox', model: 'SL297NV100V60C', type: 'Furnace Gas Modulating', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 10.0, circuit: 'airflow', btu: 100000, afue: 97 },
    { brand: 'Lennox', model: 'EL296V080V60C', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 96 },
    { brand: 'Lennox', model: 'ML195UH080XV48C', type: 'Furnace Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', btu: 80000, afue: 95 },

    // ── AIR HANDLERS (Circuito Airflow) ──
    { brand: 'Carrier', model: 'FE4ANF003T00', type: 'Air Handler', tons: 2.5, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 4.0, circuit: 'airflow', blower: 'Variable Speed' },
    { brand: 'Carrier', model: 'FE4ANF005T00', type: 'Air Handler', tons: 5, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', blower: 'Variable Speed' },
    { brand: 'Carrier', model: 'FB4CNF036T00', type: 'Air Handler + Electric Heat', tons: 3, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 8.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Trane', model: 'TEM4A0B30S21SA', type: 'Air Handler', tons: 2.5, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 4.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Trane', model: 'TEM4A0C36S31SA', type: 'Air Handler', tons: 3, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Trane', model: 'TEM6A0C48H41SB', type: 'Air Handler', tons: 4, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', blower: 'Variable Speed' },
    { brand: 'Goodman', model: 'ARUF37C14', type: 'Air Handler', tons: 3, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Goodman', model: 'ARUF49C14', type: 'Air Handler', tons: 4, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Goodman', model: 'ARUF61D14', type: 'Air Handler', tons: 5, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 7.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Goodman', model: 'ASPT49D14', type: 'Air Handler ECM', tons: 4, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', blower: 'Variable Speed ECM' },
    { brand: 'Rheem/Ruud', model: 'RHLLHM3617JA', type: 'Air Handler', tons: 3, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'airflow', blower: 'Multi-Speed' },
    { brand: 'Rheem/Ruud', model: 'RHLLHM4821JA', type: 'Air Handler', tons: 4, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '208-230/1/60', rla: 0, lra: 0, fla: 6.0, circuit: 'airflow', blower: 'Multi-Speed' },

    // ── MORE BOILERS (Circuito Agua) ──
    { brand: 'Weil-McLain', model: 'ECO 70', type: 'Boiler Condensing', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 3.0, circuit: 'agua', btu: 70000, afue: 95 },
    { brand: 'Weil-McLain', model: 'ECO 110', type: 'Boiler Condensing', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 4.0, circuit: 'agua', btu: 110000, afue: 95 },
    { brand: 'Weil-McLain', model: 'ECO 155', type: 'Boiler Condensing', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'agua', btu: 155000, afue: 95 },
    { brand: 'Weil-McLain', model: 'CGa-4', type: 'Boiler Cast Iron', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 3.0, circuit: 'agua', btu: 116000, afue: 84 },
    { brand: 'Burnham', model: 'Alpine ALP080B', type: 'Boiler Condensing', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 3.0, circuit: 'agua', btu: 80000, afue: 95 },
    { brand: 'Burnham', model: 'Alpine ALP105B', type: 'Boiler Condensing', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 4.0, circuit: 'agua', btu: 105000, afue: 95 },
    { brand: 'Burnham', model: 'Alpine ALP150B', type: 'Boiler Condensing', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 5.0, circuit: 'agua', btu: 150000, afue: 95 },
    { brand: 'Burnham', model: 'ES2-4', type: 'Boiler Cast Iron', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 3.5, circuit: 'agua', btu: 120000, afue: 85 },
    { brand: 'Navien', model: 'NCB-180E', type: 'Combi Boiler', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.5, circuit: 'agua', btu: 150000, gpm: 3.4, uef: 0.95 },

    // ── MORE TANKLESS ──
    { brand: 'Rinnai', model: 'RU130iN', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 130000, gpm: 7.0, uef: 0.93 },
    { brand: 'Navien', model: 'NPE-210A2', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 180000, gpm: 10.1, uef: 0.96 },
    { brand: 'Noritz', model: 'EZ111DV', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 199000, gpm: 11.1, uef: 0.96 },
    { brand: 'Noritz', model: 'EZ98DV', type: 'Tankless', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 180000, gpm: 9.8, uef: 0.95 },
    { brand: 'Rheem/Ruud', model: 'RTEX-24', type: 'Tankless Electric', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '240/1/60', rla: 0, lra: 0, fla: 100, circuit: 'agua', btu: 0, gpm: 5.9, uef: 0.99 },

    // ── MORE WATER HEATERS ──
    { brand: 'Bradford White', model: 'RG250T6N', type: 'Water Heater Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 0, circuit: 'agua', btu: 40000, galones: 50, uef: 0.64 },
    { brand: 'Bradford White', model: 'RG240T6N', type: 'Water Heater Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 0, circuit: 'agua', btu: 40000, galones: 40, uef: 0.62 },
    { brand: 'AO Smith', model: 'GPVL-50 Power Vent', type: 'Water Heater Gas', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '120/1/60', rla: 0, lra: 0, fla: 2.0, circuit: 'agua', btu: 40000, galones: 50, uef: 0.70 },
    { brand: 'Rheem/Ruud', model: 'PROE50 T2 RH95', type: 'Water Heater Electric', tons: 0, seer: 0, refrigerant: 'N/A', compressor: 'N/A', oil: 'N/A', oilOz: 0, metering: 'N/A', voltage: '240/1/60', rla: 0, lra: 0, fla: 18.75, circuit: 'agua', btu: 0, galones: 50, uef: 0.95 }
  ];

  // ============================================================
  // COMPRESSOR DATABASE with Cross-Reference
  // ============================================================
  window.PF_COMPRESSORS = [
    // ── Copeland Scroll ZP (R-410A) Single Phase ──
    { model: 'ZP16K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 1.25, btu: 16000, voltage: '208-230/1/60', rla: 8.0, lra: 48, oil: 'POE 3MAF', oilOz: 22, suction: '1/2"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Daikin'] },
    { model: 'ZP20K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 1.5, btu: 20000, voltage: '208-230/1/60', rla: 9.8, lra: 58, oil: 'POE 3MAF', oilOz: 27, suction: '1/2"', liquid: '3/8"', xref: ['Bristol H29B20UABCA'], usedIn: ['Carrier', 'Goodman', 'Daikin'] },
    { model: 'ZP25K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 2, btu: 25000, voltage: '208-230/1/60', rla: 11.5, lra: 68, oil: 'POE 3MAF', oilOz: 27, suction: '1/2"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Daikin'] },
    { model: 'ZP29K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 2.5, btu: 29000, voltage: '208-230/1/60', rla: 13.2, lra: 76, oil: 'POE 3MAF', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Rheem'] },
    { model: 'ZP31K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 2.5, btu: 31100, voltage: '208-230/1/60', rla: 14.4, lra: 79, oil: 'POE 3MAF', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Rheem', 'Daikin'] },
    { model: 'ZP34K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 3, btu: 34500, voltage: '208-230/1/60', rla: 15.8, lra: 96, oil: 'POE 3MAF', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Bristol H29B34UABCA'], usedIn: ['Carrier', 'Trane', 'Goodman', 'Rheem'] },
    { model: 'ZP38K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 3, btu: 38000, voltage: '208-230/1/60', rla: 17.5, lra: 105, oil: 'POE 3MAF', oilOz: 46, suction: '3/4"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Lennox'] },
    { model: 'ZP42K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 3.5, btu: 42000, voltage: '208-230/1/60', rla: 19.0, lra: 117, oil: 'POE 3MAF', oilOz: 46, suction: '3/4"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Rheem', 'York'] },
    { model: 'ZP44K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 3.5, btu: 44000, voltage: '208-230/1/60', rla: 20.5, lra: 122, oil: 'POE 3MAF', oilOz: 46, suction: '3/4"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane', 'Goodman'] },
    { model: 'ZP49K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 4, btu: 49000, voltage: '208-230/1/60', rla: 22.8, lra: 134, oil: 'POE 3MAF', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: ['Bristol H29B49UABCA'], usedIn: ['Carrier', 'Goodman', 'Rheem', 'Daikin'] },
    { model: 'ZP51K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 4, btu: 51000, voltage: '208-230/1/60', rla: 23.5, lra: 140, oil: 'POE 3MAF', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane', 'Goodman'] },
    { model: 'ZP54K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 4.5, btu: 54000, voltage: '208-230/1/60', rla: 25.0, lra: 148, oil: 'POE 3MAF', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Goodman', 'Lennox'] },
    { model: 'ZP61K5E-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 5, btu: 61000, voltage: '208-230/1/60', rla: 28.0, lra: 170, oil: 'POE 3MAF', oilOz: 66, suction: '7/8"', liquid: '3/8"', xref: ['Bristol H25A61BABCA'], usedIn: ['Carrier', 'Trane', 'Goodman', 'Rheem', 'Lennox'] },
    { model: 'ZP67KCE-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 5.5, btu: 67000, voltage: '208-230/1/60', rla: 31.0, lra: 188, oil: 'POE 3MAF', oilOz: 72, suction: '7/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane'] },
    { model: 'ZP83KCE-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 7, btu: 83000, voltage: '208-230/1/60', rla: 38.0, lra: 230, oil: 'POE 3MAF', oilOz: 88, suction: '1-1/8"', liquid: '1/2"', xref: [], usedIn: ['Carrier', 'Trane'] },
    { model: 'ZP90KCE-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-410A', tons: 7.5, btu: 90000, voltage: '208-230/1/60', rla: 42.0, lra: 252, oil: 'POE 3MAF', oilOz: 96, suction: '1-1/8"', liquid: '1/2"', xref: [], usedIn: ['Carrier', 'Trane'] },

    // ── Copeland Scroll ZP Three Phase 208-230V ──
    { model: 'ZP34K5E-TFD', brand: 'Copeland', type: 'Scroll 3\u03C6', refrigerant: 'R-410A', tons: 3, btu: 34500, voltage: '208-230/3/60', rla: 10.2, lra: 54, oil: 'POE 3MAF', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane', 'York'] },
    { model: 'ZP49K5E-TFD', brand: 'Copeland', type: 'Scroll 3\u03C6', refrigerant: 'R-410A', tons: 4, btu: 49000, voltage: '208-230/3/60', rla: 14.5, lra: 76, oil: 'POE 3MAF', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane', 'York'] },
    { model: 'ZP61K5E-TFD', brand: 'Copeland', type: 'Scroll 3\u03C6', refrigerant: 'R-410A', tons: 5, btu: 61000, voltage: '208-230/3/60', rla: 17.8, lra: 98, oil: 'POE 3MAF', oilOz: 66, suction: '7/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane', 'York', 'Lennox'] },
    { model: 'ZP83KCE-TFD', brand: 'Copeland', type: 'Scroll 3\u03C6', refrigerant: 'R-410A', tons: 7, btu: 83000, voltage: '208-230/3/60', rla: 24.5, lra: 130, oil: 'POE 3MAF', oilOz: 88, suction: '1-1/8"', liquid: '1/2"', xref: [], usedIn: ['Carrier', 'Trane', 'York'] },

    // ── Copeland Scroll ZR (R-22 Legacy) ──
    { model: 'ZR22K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 2, btu: 22000, voltage: '208-230/1/60', rla: 9.5, lra: 55, oil: 'Mineral', oilOz: 27, suction: '1/2"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane'] },
    { model: 'ZR28K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 2.5, btu: 28000, voltage: '208-230/1/60', rla: 11.5, lra: 65, oil: 'Mineral', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Bristol H23A283ABCA', 'Danfoss MLZ028'], usedIn: ['Carrier', 'Trane', 'Rheem'] },
    { model: 'ZR34K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 3, btu: 34000, voltage: '208-230/1/60', rla: 14.0, lra: 84, oil: 'Mineral', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Bristol H23A343ABCA', 'Danfoss MLZ034'], usedIn: ['Carrier', 'Trane', 'Goodman', 'Rheem'] },
    { model: 'ZR42K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 3.5, btu: 42000, voltage: '208-230/1/60', rla: 17.5, lra: 105, oil: 'Mineral', oilOz: 46, suction: '3/4"', liquid: '3/8"', xref: ['Bristol H23A423ABCA', 'Danfoss MLZ042'], usedIn: ['Carrier', 'Trane', 'Rheem', 'York'] },
    { model: 'ZR48K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 4, btu: 48000, voltage: '208-230/1/60', rla: 20.0, lra: 120, oil: 'Mineral', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: ['Bristol H23A483ABCA'], usedIn: ['Carrier', 'Trane', 'Goodman'] },
    { model: 'ZR57K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 5, btu: 57000, voltage: '208-230/1/60', rla: 23.5, lra: 142, oil: 'Mineral', oilOz: 66, suction: '7/8"', liquid: '3/8"', xref: ['Bristol H25A573ABCA'], usedIn: ['Carrier', 'Trane', 'Goodman', 'Rheem'] },
    { model: 'ZR61K5-PFV', brand: 'Copeland', type: 'Scroll', refrigerant: 'R-22', tons: 5, btu: 61000, voltage: '208-230/1/60', rla: 26.0, lra: 155, oil: 'Mineral', oilOz: 72, suction: '7/8"', liquid: '3/8"', xref: [], usedIn: ['Carrier', 'Trane'] },

    // ── Bristol (R-410A) ──
    { model: 'H29B20UABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-410A', tons: 1.5, btu: 20000, voltage: '208-230/1/60', rla: 10.0, lra: 60, oil: 'POE', oilOz: 27, suction: '1/2"', liquid: '3/8"', xref: ['Copeland ZP20K5E-PFV'], usedIn: ['Carrier', 'York', 'Bryant'] },
    { model: 'H29B34UABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-410A', tons: 3, btu: 34000, voltage: '208-230/1/60', rla: 16.0, lra: 98, oil: 'POE', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Copeland ZP34K5E-PFV'], usedIn: ['Carrier', 'York', 'Bryant'] },
    { model: 'H29B49UABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-410A', tons: 4, btu: 49000, voltage: '208-230/1/60', rla: 23.0, lra: 136, oil: 'POE', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: ['Copeland ZP49K5E-PFV'], usedIn: ['Carrier', 'York', 'Bryant'] },
    { model: 'H25A61BABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-410A', tons: 5, btu: 61000, voltage: '208-230/1/60', rla: 28.5, lra: 172, oil: 'POE', oilOz: 66, suction: '7/8"', liquid: '3/8"', xref: ['Copeland ZP61K5E-PFV'], usedIn: ['Carrier', 'York'] },

    // ── Bristol (R-22 Legacy) ──
    { model: 'H23A283ABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-22', tons: 2.5, btu: 28000, voltage: '208-230/1/60', rla: 12.0, lra: 68, oil: 'Mineral', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Copeland ZR28K5-PFV'], usedIn: ['Carrier', 'York'] },
    { model: 'H23A343ABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-22', tons: 3, btu: 34000, voltage: '208-230/1/60', rla: 14.5, lra: 86, oil: 'Mineral', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Copeland ZR34K5-PFV', 'Danfoss MLZ034'], usedIn: ['Carrier', 'York'] },
    { model: 'H23A423ABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-22', tons: 3.5, btu: 42000, voltage: '208-230/1/60', rla: 17.8, lra: 107, oil: 'Mineral', oilOz: 46, suction: '3/4"', liquid: '3/8"', xref: ['Copeland ZR42K5-PFV'], usedIn: ['Carrier', 'York'] },
    { model: 'H23A483ABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-22', tons: 4, btu: 48000, voltage: '208-230/1/60', rla: 20.5, lra: 122, oil: 'Mineral', oilOz: 56, suction: '7/8"', liquid: '3/8"', xref: ['Copeland ZR48K5-PFV'], usedIn: ['Carrier', 'York'] },
    { model: 'H25A573ABCA', brand: 'Bristol', type: 'Recip', refrigerant: 'R-22', tons: 5, btu: 57000, voltage: '208-230/1/60', rla: 24.0, lra: 145, oil: 'Mineral', oilOz: 66, suction: '7/8"', liquid: '3/8"', xref: ['Copeland ZR57K5-PFV'], usedIn: ['Carrier', 'York'] },

    // ── Danfoss/Maneurop (R-410A) ──
    { model: 'SH120A4ALC', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-410A', tons: 2, btu: 24000, voltage: '208-230/1/60', rla: 11.0, lra: 65, oil: 'POE 160PZ', oilOz: 32, suction: '1/2"', liquid: '3/8"', xref: ['Copeland ZP25K5E-PFV'], usedIn: ['Lennox', 'Daikin'] },
    { model: 'SH180A4ALC', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-410A', tons: 3, btu: 35000, voltage: '208-230/1/60', rla: 15.0, lra: 90, oil: 'POE 160PZ', oilOz: 40, suction: '5/8"', liquid: '3/8"', xref: ['Copeland ZP34K5E-PFV'], usedIn: ['Lennox', 'Daikin'] },
    { model: 'SH240A4ALC', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-410A', tons: 4, btu: 47000, voltage: '208-230/1/60', rla: 20.0, lra: 118, oil: 'POE 160PZ', oilOz: 50, suction: '3/4"', liquid: '3/8"', xref: ['Copeland ZP49K5E-PFV'], usedIn: ['Lennox', 'Daikin'] },
    { model: 'SH300A4ABE', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-410A', tons: 5, btu: 58000, voltage: '208-230/1/60', rla: 26.0, lra: 155, oil: 'POE 160PZ', oilOz: 60, suction: '7/8"', liquid: '3/8"', xref: ['Copeland ZP61K5E-PFV'], usedIn: ['Lennox'] },

    // ── Danfoss (R-22 Legacy) ──
    { model: 'MLZ028', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-22', tons: 2.5, btu: 28000, voltage: '208-230/1/60', rla: 11.8, lra: 68, oil: 'Mineral', oilOz: 36, suction: '5/8"', liquid: '3/8"', xref: ['Copeland ZR28K5-PFV', 'Bristol H23A283ABCA'], usedIn: ['Lennox'] },
    { model: 'MLZ034', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-22', tons: 3, btu: 34000, voltage: '208-230/1/60', rla: 14.2, lra: 82, oil: 'Mineral', oilOz: 40, suction: '5/8"', liquid: '3/8"', xref: ['Copeland ZR34K5-PFV', 'Bristol H23A343ABCA'], usedIn: ['Lennox'] },
    { model: 'MLZ042', brand: 'Danfoss', type: 'Scroll', refrigerant: 'R-22', tons: 3.5, btu: 42000, voltage: '208-230/1/60', rla: 18.0, lra: 108, oil: 'Mineral', oilOz: 46, suction: '3/4"', liquid: '3/8"', xref: ['Copeland ZR42K5-PFV'], usedIn: ['Lennox'] }
  ];

  // ============================================================
  // COMMON PARTS — Organized by Circuit
  // ============================================================
  window.PF_PARTS = {
    // ── CIRCUITO ELECTRICIDAD ──
    'Capacitor Dual 25/5 MFD 440V': { part: 'CPT0255', circuit: 'electricidad', price: '$10-14' },
    'Capacitor Dual 30/5 MFD 440V': { part: 'CPT0305', circuit: 'electricidad', price: '$10-15' },
    'Capacitor Dual 35/5 MFD 440V': { part: 'CPT0355', circuit: 'electricidad', price: '$10-15' },
    'Capacitor Dual 40/5 MFD 440V': { part: 'CPT0405', circuit: 'electricidad', price: '$12-18' },
    'Capacitor Dual 45/5 MFD 440V': { part: 'CPT0455', circuit: 'electricidad', price: '$12-18' },
    'Capacitor Dual 50/5 MFD 440V': { part: 'CPT0505', circuit: 'electricidad', price: '$14-20' },
    'Capacitor Dual 55/5 MFD 440V': { part: 'CPT0555', circuit: 'electricidad', price: '$15-22' },
    'Capacitor Dual 60/5 MFD 440V': { part: 'CPT0605', circuit: 'electricidad', price: '$16-24' },
    'Capacitor Dual 80/5 MFD 440V': { part: 'CPT0805', circuit: 'electricidad', price: '$20-28' },
    'Contactor 1P 30A 24V Coil': { part: 'C130A', circuit: 'electricidad', price: '$12-20' },
    'Contactor 1P 40A 24V Coil': { part: 'C140A', circuit: 'electricidad', price: '$15-25' },
    'Contactor 2P 30A 24V Coil': { part: 'C230A', circuit: 'electricidad', price: '$15-25' },
    'Contactor 2P 40A 24V Coil': { part: 'C240A', circuit: 'electricidad', price: '$18-30' },
    'Transformer 40VA 120/208/240 to 24V': { part: 'AT72D1683', circuit: 'electricidad', price: '$18-28' },
    'Transformer 75VA 120/208/240 to 24V': { part: 'AT175F1023', circuit: 'electricidad', price: '$25-40' },
    'Hard Start Kit 5-2-1 CSR-U1': { part: 'CSR-U1', circuit: 'electricidad', price: '$22-35' },
    'Hard Start Kit 5-2-1 CSR-U2': { part: 'CSR-U2', circuit: 'electricidad', price: '$25-40' },
    'Hard Start Kit 5-2-1 CSR-U3': { part: 'CSR-U3', circuit: 'electricidad', price: '$28-45' },
    'Potential Relay 90-370': { part: '90-370', circuit: 'electricidad', price: '$12-18' },
    'Time Delay Relay?"TD-69"': { part: 'TD-69', circuit: 'electricidad', price: '$18-28' },
    'Fan Relay SPST 24V': { part: '90-340', circuit: 'electricidad', price: '$10-16' },
    'Sequencer 2-Stage': { part: 'Q3200U1004', circuit: 'electricidad', price: '$25-40' },
    'Disconnect 60A Non-Fused': { part: 'DDS-60U', circuit: 'electricidad', price: '$12-20' },
    'Disconnect 60A Fused': { part: 'DDS-60UF', circuit: 'electricidad', price: '$18-28' },
    'Thermostat Wire 18/2 250ft': { part: '18-2-250', circuit: 'electricidad', price: '$25-35' },
    'Thermostat Wire 18/4 250ft': { part: '18-4-250', circuit: 'electricidad', price: '$35-50' },
    'Thermostat Wire 18/5 250ft': { part: '18-5-250', circuit: 'electricidad', price: '$45-65' },
    'Thermostat Wire 18/8 250ft': { part: '18-8-250', circuit: 'electricidad', price: '$55-80' },

    // ── CIRCUITO REFRIGERACI\u00D3N ──
    'Filter Drier 1/4 SAE Flare': { part: 'EK-032S', circuit: 'refrigeracion', price: '$10-15' },
    'Filter Drier 3/8 SAE Flare': { part: 'EK-083S', circuit: 'refrigeracion', price: '$12-18' },
    'Filter Drier 3/8 Sweat': { part: 'C-083-S', circuit: 'refrigeracion', price: '$12-18' },
    'Filter Drier 1/2 Sweat': { part: 'C-084-S', circuit: 'refrigeracion', price: '$15-22' },
    'TXV R-410A 1.5-2 Ton': { part: 'EBSE-3-GA', circuit: 'refrigeracion', price: '$40-60' },
    'TXV R-410A 2.5-3 Ton': { part: 'EBSE-5-GA', circuit: 'refrigeracion', price: '$45-70' },
    'TXV R-410A 3.5-4 Ton': { part: 'EBSE-7-GA', circuit: 'refrigeracion', price: '$50-80' },
    'TXV R-410A 5 Ton': { part: 'EBSE-10-GA', circuit: 'refrigeracion', price: '$55-85' },
    'TXV R-22 3 Ton': { part: 'EBSE-5-Z', circuit: 'refrigeracion', price: '$40-65' },
    'Schrader Valve Core (5 pack)': { part: 'CH-217', circuit: 'refrigeracion', price: '$4-8' },
    'Service Valve 1/4 SAE Access': { part: 'A-31244', circuit: 'refrigeracion', price: '$8-12' },
    'Service Valve 3/8 SAE Access': { part: 'A-31258', circuit: 'refrigeracion', price: '$10-15' },
    'Reversing Valve 4-Way 3 Ton': { part: 'STF-0801G', circuit: 'refrigeracion', price: '$120-180' },
    'Reversing Valve 4-Way 4-5 Ton': { part: 'STF-1001G', circuit: 'refrigeracion', price: '$140-200' },
    'Sight Glass 3/8 Flare': { part: 'SA-13S', circuit: 'refrigeracion', price: '$12-18' },
    'Bi-Flow Filter Drier 3/8': { part: 'BFK-083S', circuit: 'refrigeracion', price: '$18-28' },
    'Suction Accumulator 3/4"': { part: 'SA-5211', circuit: 'refrigeracion', price: '$35-55' },
    'Suction Accumulator 7/8"': { part: 'SA-5213', circuit: 'refrigeracion', price: '$40-60' },
    'Copper Line Set 3/8 x 3/4 x 25ft': { part: 'LS-3825', circuit: 'refrigeracion', price: '$60-90' },
    'Copper Line Set 3/8 x 7/8 x 25ft': { part: 'LS-3825L', circuit: 'refrigeracion', price: '$70-100' },

    // ── CIRCUITO AIRFLOW ──
    'Condenser Fan Motor 1/6 HP 208-230V': { part: 'ORM-5458', circuit: 'airflow', price: '$65-95' },
    'Condenser Fan Motor 1/4 HP 208-230V': { part: 'ORM-5461', circuit: 'airflow', price: '$75-110' },
    'Condenser Fan Motor 1/3 HP 208-230V': { part: 'ORM-5464', circuit: 'airflow', price: '$85-125' },
    'Condenser Fan Motor 1/2 HP 208-230V': { part: 'ORM-5468', circuit: 'airflow', price: '$95-140' },
    'Blower Motor PSC 1/2 HP 115V': { part: 'OBK-2002', circuit: 'airflow', price: '$120-175' },
    'Blower Motor PSC 3/4 HP 115V': { part: 'OBK-2003', circuit: 'airflow', price: '$140-200' },
    'Blower Motor PSC 1 HP 115V': { part: 'OBK-2004', circuit: 'airflow', price: '$160-220' },
    'ECM Blower Motor 1/2 HP': { part: 'HD44AE116', circuit: 'airflow', price: '$350-500' },
    'ECM Blower Motor 3/4 HP': { part: 'HD44AE120', circuit: 'airflow', price: '$380-540' },
    'ECM Blower Motor 1 HP': { part: 'HD46AE126', circuit: 'airflow', price: '$400-580' },
    'Inducer Motor Carrier': { part: 'HC23UZ116', circuit: 'airflow', price: '$180-280' },
    'Inducer Motor Goodman': { part: 'B1859005S', circuit: 'airflow', price: '$150-230' },
    'Inducer Motor Trane': { part: 'BLW01437', circuit: 'airflow', price: '$170-260' },
    'Fan Blade 18" 3-Blade': { part: 'FB-1803', circuit: 'airflow', price: '$15-25' },
    'Fan Blade 22" 3-Blade': { part: 'FB-2203', circuit: 'airflow', price: '$18-30' },
    'Fan Blade 24" 3-Blade': { part: 'FB-2403', circuit: 'airflow', price: '$20-35' },
    'Blower Wheel 10x8 CW': { part: 'BW-1008CW', circuit: 'airflow', price: '$30-50' },
    'Blower Wheel 10x10 CW': { part: 'BW-1010CW', circuit: 'airflow', price: '$35-55' },
    'Blower Wheel 11x10 CW': { part: 'BW-1110CW', circuit: 'airflow', price: '$38-60' },
    'Air Filter 16x20x1 (6 pack)': { part: 'AF-16201', circuit: 'airflow', price: '$12-20' },
    'Air Filter 16x25x1 (6 pack)': { part: 'AF-16251', circuit: 'airflow', price: '$12-20' },
    'Air Filter 20x20x1 (6 pack)': { part: 'AF-20201', circuit: 'airflow', price: '$12-20' },
    'Air Filter 20x25x1 (6 pack)': { part: 'AF-20251', circuit: 'airflow', price: '$14-22' },
    'Air Filter 20x25x4 MERV 11': { part: 'AF-20254', circuit: 'airflow', price: '$18-30' },

    // ── CIRCUITO AGUA ──
    'Circulator Pump Taco 007-F5': { part: '007-F5', circuit: 'agua', price: '$120-170' },
    'Circulator Pump Taco 007-HF5': { part: '007-HF5', circuit: 'agua', price: '$130-185' },
    'Circulator Pump Grundfos UP15-42F': { part: 'UP15-42F', circuit: 'agua', price: '$130-180' },
    'Zone Valve Honeywell V8043E1012': { part: 'V8043E1012', circuit: 'agua', price: '$55-80' },
    'Zone Valve Honeywell V8043F1036': { part: 'V8043F1036', circuit: 'agua', price: '$60-85' },
    'Zone Valve Actuator Honeywell': { part: 'VC2012ZZ11', circuit: 'agua', price: '$35-50' },
    'Expansion Tank Amtrol ST-12': { part: 'ST-12', circuit: 'agua', price: '$40-60' },
    'Expansion Tank Amtrol ST-25': { part: 'ST-25', circuit: 'agua', price: '$55-80' },
    'PRV 30 PSI Boiler Relief': { part: 'PRV-30', circuit: 'agua', price: '$15-25' },
    'Auto Air Vent 1/8" NPT': { part: 'AAV-18', circuit: 'agua', price: '$8-14' },
    'Mixing Valve 3/4" Thermostatic': { part: 'AM-1-D', circuit: 'agua', price: '$45-70' },
    'Anode Rod Magnesium 3/4" NPT': { part: 'AR-44', circuit: 'agua', price: '$12-20' },
    'Water Heater Thermocouple 24"': { part: 'CQ100A1013', circuit: 'agua', price: '$8-14' },
    'Gas Valve Honeywell WV8840B1110': { part: 'WV8840B1110', circuit: 'agua', price: '$85-130' },
    'Gas Valve Honeywell VR8345M4302': { part: 'VR8345M4302', circuit: 'agua', price: '$110-160' },
    'Ignitor Hot Surface Universal': { part: 'IGN-401', circuit: 'agua', price: '$15-25' },
    'Flame Sensor Universal': { part: 'FS-790', circuit: 'agua', price: '$8-15' },
    'Pressure Switch Goodman 0.40"WC': { part: 'B1370142', circuit: 'agua', price: '$15-25' },

    // ── THERMOSTATS ──
    'Honeywell T6 Pro TH6220U2000': { part: 'TH6220U2000', circuit: 'electricidad', price: '$75-110' },
    'Honeywell T6 Pro WiFi TH6220WF2006': { part: 'TH6220WF2006', circuit: 'electricidad', price: '$120-160' },
    'Honeywell VisionPRO 8000 TH8321WF1001': { part: 'TH8321WF1001', circuit: 'electricidad', price: '$150-200' },
    'Ecobee Smart Thermostat Premium': { part: 'EB-STATE5P-01', circuit: 'electricidad', price: '$220-250' },
    'Ecobee Smart Thermostat Enhanced': { part: 'EB-STATE5-01', circuit: 'electricidad', price: '$170-200' },
    'Google Nest Learning 3rd Gen': { part: 'T3007ES', circuit: 'electricidad', price: '$200-250' },
    'Google Nest Thermostat E': { part: 'T4000ES', circuit: 'electricidad', price: '$130-170' },
    'Google Nest Thermostat 2020': { part: 'GA02082-US', circuit: 'electricidad', price: '$100-130' },
    'Carrier Infinity Touch Thermostat': { part: 'SYSTXCCITC01-A', circuit: 'electricidad', price: '$350-500' },
    'Trane XL850 ComfortLink II': { part: 'TCONT850AS52DA', circuit: 'electricidad', price: '$300-450' },
    'Trane XL624 WiFi': { part: 'TCONT624AS42DA', circuit: 'electricidad', price: '$200-280' },

    // ── MORE AGUA PARTS ──
    'Circulator Pump Taco 006-B4': { part: '006-B4', circuit: 'agua', price: '$100-145' },
    'Circulator Pump Taco 0010-F3': { part: '0010-F3', circuit: 'agua', price: '$160-220' },
    'Circulator Pump Taco VR1816 ECM': { part: 'VR1816', circuit: 'agua', price: '$250-350' },
    'Circulator Pump Grundfos UP26-99F': { part: 'UP26-99F', circuit: 'agua', price: '$180-250' },
    'Circulator Pump Grundfos ALPHA2': { part: 'ALPHA2 15-55F', circuit: 'agua', price: '$280-380' },
    'Zone Valve Taco 571-2 3/4"': { part: '571-2', circuit: 'agua', price: '$50-75' },
    'Zone Valve Taco 572-2 1"': { part: '572-2', circuit: 'agua', price: '$55-80' },
    'Zone Valve Honeywell V8043E1020 1"': { part: 'V8043E1020', circuit: 'agua', price: '$60-90' },
    'Expansion Tank Amtrol ST-5': { part: 'ST-5', circuit: 'agua', price: '$25-40' },
    'Water Heater Thermocouple 30"': { part: 'CQ100A1021', circuit: 'agua', price: '$8-14' },
    'Water Heater Pilot Assembly': { part: 'SP20305', circuit: 'agua', price: '$30-50' },
    'Water Heater Element 4500W 240V': { part: 'SG-1674', circuit: 'agua', price: '$12-20' },
    'Water Heater Thermostat Upper': { part: 'WH9-D', circuit: 'agua', price: '$10-18' },
    'Pressure Relief Valve T&P 3/4"': { part: 'TP-3070A', circuit: 'agua', price: '$12-22' }
  };

})();
