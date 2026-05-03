// Maestro Pro · Eléctrico Avanzado calculators
// NEC-compliant. ES5 only. Bilingual (es/en) via t(key,fallback).
(function(){
  'use strict';
  window.MP_CALCS = window.MP_CALCS || {};
  var h = function(){ return window.MP_HELPERS || {}; };
  function esc(s){ var H=h(); return H.esc?H.esc(s):String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(k,fb){ var H=h(); return H.t?H.t(k,fb):(fb||k); }
  function exampleTip(caseKey,tipKey){ var H=h(); return H.exampleTip?H.exampleTip(caseKey,tipKey):''; }
  function num(v,d){ var n=parseFloat(v); return isNaN(n)?(d||0):n; }
  function fmt(n,dp){ if(!isFinite(n)) return '—'; var d=(dp==null?2:dp); return (+n).toFixed(d); }

  var SQRT3 = Math.sqrt(3);

  // ─────────────────────────────────────────────────────────────────
  // NEC 430.250 — 3-phase motor Full-Load Current (FLC, amps)
  // Keys = HP string, values = {voltage: FLA}
  // ─────────────────────────────────────────────────────────────────
  var FLC_3PH = {
    '0.5': {'115':4.4,'200':2.5,'208':2.4,'230':2.2,'460':1.1,'575':0.9},
    '0.75':{'115':6.4,'200':3.7,'208':3.5,'230':3.2,'460':1.6,'575':1.3},
    '1':   {'115':8.4,'200':4.8,'208':4.6,'230':4.2,'460':2.1,'575':1.7},
    '1.5': {'115':12.0,'200':6.9,'208':6.6,'230':6.0,'460':3.0,'575':2.4},
    '2':   {'115':13.6,'200':7.8,'208':7.5,'230':6.8,'460':3.4,'575':2.7},
    '3':   {'200':11.0,'208':10.6,'230':9.6,'460':4.8,'575':3.9},
    '5':   {'200':17.5,'208':16.7,'230':15.2,'460':7.6,'575':6.1},
    '7.5': {'200':25.3,'208':24.2,'230':22.0,'460':11.0,'575':9.0},
    '10':  {'200':32.2,'208':30.8,'230':28.0,'460':14.0,'575':11.0},
    '15':  {'200':48.3,'208':46.2,'230':42.0,'460':21.0,'575':17.0},
    '20':  {'200':62.1,'208':59.4,'230':54.0,'460':27.0,'575':22.0},
    '25':  {'200':78.2,'208':74.8,'230':68.0,'460':34.0,'575':27.0},
    '30':  {'200':92.0,'208':88.0,'230':80.0,'460':40.0,'575':32.0},
    '40':  {'200':120.0,'208':114.0,'230':104.0,'460':52.0,'575':41.0},
    '50':  {'200':150.0,'208':143.0,'230':130.0,'460':65.0,'575':52.0},
    '60':  {'200':177.0,'208':169.0,'230':154.0,'460':77.0,'575':62.0},
    '75':  {'200':221.0,'208':211.0,'230':192.0,'460':96.0,'575':77.0},
    '100': {'200':285.0,'208':273.0,'230':248.0,'460':124.0,'575':99.0}
  };

  // NEC 430.248 — 1-phase motor FLC
  var FLC_1PH = {
    '0.5': {'115':9.8,'200':5.6,'208':5.4,'230':4.9},
    '0.75':{'115':13.8,'200':7.9,'208':7.6,'230':6.9},
    '1':   {'115':16.0,'200':9.2,'208':8.8,'230':8.0},
    '1.5': {'115':20.0,'200':11.5,'208':11.0,'230':10.0},
    '2':   {'115':24.0,'200':13.8,'208':13.2,'230':12.0},
    '3':   {'115':34.0,'200':19.6,'208':18.7,'230':17.0},
    '5':   {'115':56.0,'200':32.2,'208':30.8,'230':28.0},
    '7.5': {'115':80.0,'200':46.0,'208':44.0,'230':40.0},
    '10':  {'115':100.0,'200':57.5,'208':55.0,'230':50.0}
  };

  // NEC 430.251(B) — Locked-rotor kVA/hp by NEMA design code letter
  // Approximate midpoints per Table 430.7(B)
  var LR_KVA_PER_HP = { 'B':3.55, 'C':3.80, 'D':4.25 };

  // NEC 250.122 — Min copper EGC (AWG) by OCPD amps
  var EGC_TABLE = {
    '15':'14','20':'12','30':'10','60':'10','100':'8',
    '200':'6','300':'4','400':'3','500':'2','600':'1'
  };

  // NEC 250.102(C)(1) simplified — Bonding jumper by largest ungrounded copper
  // Key = phase conductor size, value = min bonding jumper size
  var BOND_TABLE = {
    '8':'8','6':'8','4':'8','3':'6','2':'6','1':'6',
    '1/0':'6','2/0':'4','3/0':'4','4/0':'2',
    '250':'2','350':'1/0','500':'1/0','600':'1/0',
    '800':'2/0','1000':'2/0','1100':'3/0'
  };

  // ═════════════════════════════════════════════════════════════════
  // 1. motorFLC3ph — 3-phase motor FLC (NEC 430.250)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['motorFLC3ph'] = {
    i18n: {
      es: {
        mp_m3_title:'FLC Motor 3Φ',
        mp_m3_sub:'NEC Tabla 430.250',
        mp_m3_hp:'Caballos de fuerza',
        mp_m3_v:'Voltaje',
        mp_m3_res:'Corriente a plena carga',
        mp_m3_125:'Protección (125%)',
        mp_m3_na:'No disponible para este voltaje',
        mp_m3_desc:'FLA de tabla NEC · conductor ≥125% FLA',
        mp_m3_case:'Ejemplo: Motor 10HP @ 460V, FLA=14A → OCPD máx 125% = 17.5A, conductor #10 AWG.',
        mp_m3_tip:'Usa siempre la tabla NEC, no la placa del motor, para dimensionar conductores (430.6(A)(1)).'
      },
      en: {
        mp_m3_title:'3Φ Motor FLC',
        mp_m3_sub:'NEC Table 430.250',
        mp_m3_hp:'Horsepower',
        mp_m3_v:'Voltage',
        mp_m3_res:'Full-load amps',
        mp_m3_125:'Protection (125%)',
        mp_m3_na:'Not available at this voltage',
        mp_m3_desc:'FLA from NEC table · conductor ≥125% FLA',
        mp_m3_case:'Example: 10HP motor @ 460V, FLA=14A → OCPD max 125% = 17.5A, #10 AWG conductor.',
        mp_m3_tip:'Always use NEC table (not nameplate) to size conductors — NEC 430.6(A)(1).'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.motorFLC3ph) || {};
      var hp = s.hp || '10';
      var v  = s.v  || '460';
      var row = FLC_3PH[hp] || {};
      var fla = row[v];
      var hps = ['0.5','0.75','1','1.5','2','3','5','7.5','10','15','20','25','30','40','50','60','75','100'];
      var vs  = ['115','200','208','230','460','575'];
      var hpOpts='', vOpts='', i;
      for(i=0;i<hps.length;i++) hpOpts += '<option value="'+hps[i]+'"'+(hp===hps[i]?' selected':'')+'>'+hps[i]+' HP</option>';
      for(i=0;i<vs.length;i++)  vOpts  += '<option value="'+vs[i]+'"'+(v===vs[i]?' selected':'')+'>'+vs[i]+' V</option>';
      var protectedA = (fla!=null) ? (fla*1.25) : null;
      var mainVal = (fla!=null) ? fmt(fla,1)+' A' : t('mp_m3_na','Not available');
      var protVal = (protectedA!=null) ? fmt(protectedA,1)+' A' : '—';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_m3_hp','Horsepower'))+'</span><span class="mp-unit">HP</span></div>'+
            '<select class="mp-in" data-in="motorFLC3ph.hp">'+hpOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_m3_v','Voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<select class="mp-in" data-in="motorFLC3ph.v">'+vOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_m3_res','Full-load amps'))+'</div>'+
          '<div class="mp-res-main">'+esc(mainVal)+'</div>'+
          '<div class="mp-res-desc">'+esc(t('mp_m3_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_m3_125','Protection (125%)'))+'</div><div class="mp-res-val">'+esc(protVal)+'</div></div>'+
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">430.250</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_m3_case','mp_m3_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 2. motorFLC1ph — 1-phase motor FLC (NEC 430.248)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['motorFLC1ph'] = {
    i18n: {
      es: {
        mp_m1_title:'FLC Motor 1Φ',
        mp_m1_sub:'NEC Tabla 430.248',
        mp_m1_hp:'Caballos de fuerza',
        mp_m1_v:'Voltaje',
        mp_m1_res:'Corriente a plena carga',
        mp_m1_125:'Protección (125%)',
        mp_m1_desc:'FLA monofásica · conductor ≥125% FLA',
        mp_m1_case:'Ejemplo: Bomba 1HP @ 230V monofásico, FLA=8A, protección 125%=10A.',
        mp_m1_tip:'Motor de condensador partido: añade 25% al dimensionar el breaker de arranque.'
      },
      en: {
        mp_m1_title:'1Φ Motor FLC',
        mp_m1_sub:'NEC Table 430.248',
        mp_m1_hp:'Horsepower',
        mp_m1_v:'Voltage',
        mp_m1_res:'Full-load amps',
        mp_m1_125:'Protection (125%)',
        mp_m1_desc:'Single-phase FLA · conductor ≥125% FLA',
        mp_m1_case:'Example: 1HP pump @ 230V 1Φ, FLA=8A, 125% protection = 10A.',
        mp_m1_tip:'Capacitor-start motor: add 25% when sizing start breaker.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.motorFLC1ph) || {};
      var hp = s.hp || '1';
      var v  = s.v  || '230';
      var row = FLC_1PH[hp] || {};
      var fla = row[v];
      var hps = ['0.5','0.75','1','1.5','2','3','5','7.5','10'];
      var vs  = ['115','200','208','230'];
      var hpOpts='', vOpts='', i;
      for(i=0;i<hps.length;i++) hpOpts += '<option value="'+hps[i]+'"'+(hp===hps[i]?' selected':'')+'>'+hps[i]+' HP</option>';
      for(i=0;i<vs.length;i++)  vOpts  += '<option value="'+vs[i]+'"'+(v===vs[i]?' selected':'')+'>'+vs[i]+' V</option>';
      var prot = (fla!=null) ? (fla*1.25) : null;
      var mainVal = (fla!=null) ? fmt(fla,1)+' A' : '—';
      var protVal = (prot!=null) ? fmt(prot,1)+' A' : '—';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_m1_hp','Horsepower'))+'</span><span class="mp-unit">HP</span></div>'+
            '<select class="mp-in" data-in="motorFLC1ph.hp">'+hpOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_m1_v','Voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<select class="mp-in" data-in="motorFLC1ph.v">'+vOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_m1_res','Full-load amps'))+'</div>'+
          '<div class="mp-res-main">'+esc(mainVal)+'</div>'+
          '<div class="mp-res-desc">'+esc(t('mp_m1_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_m1_125','Protection (125%)'))+'</div><div class="mp-res-val">'+esc(protVal)+'</div></div>'+
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">430.248</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_m1_case','mp_m1_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 3. lockedRotor — Locked-rotor amps (NEC 430.251 / 430.7(B))
  // LRA = kVA/hp × hp × 1000 / (V × √3)  for 3ph
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['lockedRotor'] = {
    i18n: {
      es: {
        mp_lr_title:'Rotor bloqueado',
        mp_lr_sub:'NEC 430.251 · kVA/HP',
        mp_lr_hp:'HP',
        mp_lr_v:'Voltaje',
        mp_lr_code:'Código de diseño',
        mp_lr_res:'Corriente de rotor bloqueado',
        mp_lr_kva:'kVA total',
        mp_lr_desc:'LRA = (kVA/HP × HP × 1000) / (V × √3)',
        mp_lr_case:'Ejemplo: 10HP · 460V · código B → 3.55×10×1000/(460×1.732) = 44.6 A (×FLA ~3.2).',
        mp_lr_tip:'LRA define el breaker instantáneo máx (NEC 430.52). Código más alto = mayor corriente de arranque.'
      },
      en: {
        mp_lr_title:'Locked-rotor',
        mp_lr_sub:'NEC 430.251 · kVA/HP',
        mp_lr_hp:'HP',
        mp_lr_v:'Voltage',
        mp_lr_code:'Design code',
        mp_lr_res:'Locked-rotor amps',
        mp_lr_kva:'Total kVA',
        mp_lr_desc:'LRA = (kVA/HP × HP × 1000) / (V × √3)',
        mp_lr_case:'Example: 10HP · 460V · code B → 3.55×10×1000/(460×1.732) = 44.6 A (~3.2× FLA).',
        mp_lr_tip:'LRA sets max instantaneous breaker (NEC 430.52). Higher code = higher inrush.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.lockedRotor) || {};
      var hp = num(s.hp, 10);
      var v  = num(s.v, 460);
      var code = s.code || 'B';
      var kvaPerHp = LR_KVA_PER_HP[code] || 3.55;
      var totalKVA = kvaPerHp * hp;
      var lra = (totalKVA * 1000) / (v * SQRT3);
      var codes = ['B','C','D'];
      var cOpts='', i;
      for(i=0;i<codes.length;i++) cOpts += '<option value="'+codes[i]+'"'+(code===codes[i]?' selected':'')+'>Code '+codes[i]+' ('+LR_KVA_PER_HP[codes[i]]+' kVA/HP)</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lr_hp','HP'))+'</span><span class="mp-unit">HP</span></div>'+
            '<input type="number" class="mp-in" data-in="lockedRotor.hp" value="'+hp+'" step="0.5" min="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lr_v','Voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="lockedRotor.v" value="'+v+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lr_code','Design code'))+'</span><span class="mp-unit">NEMA</span></div>'+
            '<select class="mp-in" data-in="lockedRotor.code">'+cOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_lr_res','Locked-rotor amps'))+'</div>'+
          '<div class="mp-res-main">'+fmt(lra,1)+'<span class="mp-res-unit">A</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_lr_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_lr_kva','Total kVA'))+'</div><div class="mp-res-val">'+fmt(totalKVA,1)+' kVA</div></div>'+
            '<div><div class="mp-res-item">kVA/HP</div><div class="mp-res-val">'+kvaPerHp+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_lr_case','mp_lr_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 4. transformerKVA — Primary & secondary current
  // 1ph: I = kVA·1000 / V    |   3ph: I = kVA·1000 / (V·√3)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['transformerKVA'] = {
    i18n: {
      es: {
        mp_tk_title:'kVA del transformador',
        mp_tk_sub:'Corrientes primaria y secundaria',
        mp_tk_kva:'Potencia',
        mp_tk_vp:'Voltaje primario',
        mp_tk_vs:'Voltaje secundario',
        mp_tk_phase:'Fases',
        mp_tk_res:'Corriente primaria',
        mp_tk_ip:'Primaria',
        mp_tk_is:'Secundaria',
        mp_tk_ratio:'Relación de transformación',
        mp_tk_desc:'1Φ: I=kVA·1000/V  ·  3Φ: I=kVA·1000/(V·√3)',
        mp_tk_case:'Ejemplo: 75kVA, 480→208V 3Φ → Ip=90.2A, Is=208A (conductor #3/0 AWG secundario).',
        mp_tk_tip:'Primario requiere protección ≤125% (NEC 450.3). Secundario ≤125% si es >9A continuo.'
      },
      en: {
        mp_tk_title:'Transformer kVA',
        mp_tk_sub:'Primary & secondary current',
        mp_tk_kva:'Power',
        mp_tk_vp:'Primary voltage',
        mp_tk_vs:'Secondary voltage',
        mp_tk_phase:'Phases',
        mp_tk_res:'Primary current',
        mp_tk_ip:'Primary',
        mp_tk_is:'Secondary',
        mp_tk_ratio:'Turns ratio',
        mp_tk_desc:'1Φ: I=kVA·1000/V  ·  3Φ: I=kVA·1000/(V·√3)',
        mp_tk_case:'Example: 75kVA, 480→208V 3Φ → Ip=90.2A, Is=208A (#3/0 AWG secondary).',
        mp_tk_tip:'Primary needs ≤125% protection (NEC 450.3). Secondary ≤125% if >9A continuous.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.transformerKVA) || {};
      var kva = num(s.kva, 75);
      var vp  = num(s.vp, 480);
      var vs  = num(s.vs, 208);
      var ph  = s.phase || '3';
      var ip, is;
      if (ph === '1') {
        ip = (kva*1000)/vp;
        is = (kva*1000)/vs;
      } else {
        ip = (kva*1000)/(vp*SQRT3);
        is = (kva*1000)/(vs*SQRT3);
      }
      var ratio = vp/vs;

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tk_kva','Power'))+'</span><span class="mp-unit">kVA</span></div>'+
            '<input type="number" class="mp-in" data-in="transformerKVA.kva" value="'+kva+'" step="1" min="0.1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tk_vp','Primary voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="transformerKVA.vp" value="'+vp+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tk_vs','Secondary voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="transformerKVA.vs" value="'+vs+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tk_phase','Phases'))+'</span><span class="mp-unit">Φ</span></div>'+
            '<select class="mp-in" data-in="transformerKVA.phase">'+
              '<option value="1"'+(ph==='1'?' selected':'')+'>1Φ</option>'+
              '<option value="3"'+(ph==='3'?' selected':'')+'>3Φ</option>'+
            '</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_tk_res','Primary current'))+'</div>'+
          '<div class="mp-res-main">'+fmt(ip,1)+'<span class="mp-res-unit">A</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_tk_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_tk_ip','Primary'))+'</div><div class="mp-res-val">'+fmt(ip,1)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_tk_is','Secondary'))+'</div><div class="mp-res-val">'+fmt(is,1)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_tk_ratio','Turns ratio'))+'</div><div class="mp-res-val">'+fmt(ratio,2)+':1</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_tk_case','mp_tk_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 5. boxFill — Box fill (NEC 314.16)
  // Conductor volumes: 14=2.0, 12=2.25, 10=2.5, 8=3.0 cu.in
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['boxFill'] = {
    i18n: {
      es: {
        mp_bf_title:'Box fill',
        mp_bf_sub:'NEC 314.16 · Llenado de caja',
        mp_bf_14:'Conductores #14 AWG',
        mp_bf_12:'Conductores #12 AWG',
        mp_bf_10:'Conductores #10 AWG',
        mp_bf_8:'Conductores #8 AWG',
        mp_bf_box:'Volumen de caja',
        mp_bf_res:'Volumen requerido',
        mp_bf_pass:'Aprobado',
        mp_bf_fail:'Rechazado · excede capacidad',
        mp_bf_avail:'Espacio disponible',
        mp_bf_status:'Estado',
        mp_bf_desc:'Volúmenes: 14=2.0 · 12=2.25 · 10=2.5 · 8=3.0 in³',
        mp_bf_case:'Ejemplo: caja 4" cuadrada de 21 in³ con 6× #12 = 13.5 in³ → aprueba con 7.5 in³ sobrantes.',
        mp_bf_tip:'Cada tuerca/conector a tierra cuenta como UN conductor del mayor AWG presente (314.16(B)(5)).'
      },
      en: {
        mp_bf_title:'Box fill',
        mp_bf_sub:'NEC 314.16 · Box fill',
        mp_bf_14:'#14 AWG conductors',
        mp_bf_12:'#12 AWG conductors',
        mp_bf_10:'#10 AWG conductors',
        mp_bf_8:'#8 AWG conductors',
        mp_bf_box:'Box volume',
        mp_bf_res:'Required volume',
        mp_bf_pass:'Pass',
        mp_bf_fail:'Fail · exceeds capacity',
        mp_bf_avail:'Available room',
        mp_bf_status:'Status',
        mp_bf_desc:'Volumes: 14=2.0 · 12=2.25 · 10=2.5 · 8=3.0 in³',
        mp_bf_case:'Example: 4" square 21 in³ box with 6× #12 = 13.5 in³ → passes with 7.5 in³ to spare.',
        mp_bf_tip:'Each ground pigtail/connector counts as ONE conductor of largest AWG present (314.16(B)(5)).'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.boxFill) || {};
      var n14 = num(s.n14, 0);
      var n12 = num(s.n12, 6);
      var n10 = num(s.n10, 0);
      var n8  = num(s.n8, 0);
      var box = num(s.box, 21);
      var req = n14*2.0 + n12*2.25 + n10*2.5 + n8*3.0;
      var avail = box - req;
      var pass = (req <= box);
      var statusText = pass ? t('mp_bf_pass','Pass') : t('mp_bf_fail','Fail');
      var statusColor = pass ? '#059669' : '#DC2626';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bf_14','#14 AWG'))+'</span><span class="mp-unit">×2.0 in³</span></div>'+
            '<input type="number" class="mp-in" data-in="boxFill.n14" value="'+n14+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bf_12','#12 AWG'))+'</span><span class="mp-unit">×2.25 in³</span></div>'+
            '<input type="number" class="mp-in" data-in="boxFill.n12" value="'+n12+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bf_10','#10 AWG'))+'</span><span class="mp-unit">×2.5 in³</span></div>'+
            '<input type="number" class="mp-in" data-in="boxFill.n10" value="'+n10+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bf_8','#8 AWG'))+'</span><span class="mp-unit">×3.0 in³</span></div>'+
            '<input type="number" class="mp-in" data-in="boxFill.n8" value="'+n8+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bf_box','Box volume'))+'</span><span class="mp-unit">in³</span></div>'+
            '<input type="number" class="mp-in" data-in="boxFill.box" value="'+box+'" step="0.5" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_bf_res','Required volume'))+'</div>'+
          '<div class="mp-res-main">'+fmt(req,2)+'<span class="mp-res-unit">in³</span></div>'+
          '<div class="mp-res-desc" style="color:'+statusColor+' !important;font-weight:600;">'+esc(statusText)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_bf_box','Box volume'))+'</div><div class="mp-res-val">'+fmt(box,2)+' in³</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_bf_avail','Available room'))+'</div><div class="mp-res-val" style="color:'+statusColor+' !important;">'+fmt(avail,2)+' in³</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_bf_status','Status'))+'</div><div class="mp-res-val" style="color:'+statusColor+' !important;">'+(pass?'✓':'⚠')+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_bf_case','mp_bf_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 6. powerFactor — PF correction (capacitive kVAR)
  // kVAR_add = kW × ( tan(acos(PF1)) − tan(acos(PF2)) )
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['powerFactor'] = {
    i18n: {
      es: {
        mp_pf_title:'Factor de potencia',
        mp_pf_sub:'Corrección con capacitor',
        mp_pf_kw:'Potencia activa',
        mp_pf_cur:'PF actual',
        mp_pf_tgt:'PF objetivo',
        mp_pf_res:'kVAR a corregir',
        mp_pf_kvar1:'kVAR actual',
        mp_pf_kvar2:'kVAR objetivo',
        mp_pf_cap:'Capacitor requerido',
        mp_pf_desc:'kVAR = kW × (tan(acos PF₁) − tan(acos PF₂))',
        mp_pf_case:'Ejemplo: 100kW · PF 0.75 → 0.95 → añadir 55.3 kVAR (banco de 60 kVAR estándar).',
        mp_pf_tip:'PF <0.90 genera recargo en factura industrial. Corregir cerca de la carga reduce I²R.'
      },
      en: {
        mp_pf_title:'Power factor',
        mp_pf_sub:'Capacitor correction',
        mp_pf_kw:'Real power',
        mp_pf_cur:'Current PF',
        mp_pf_tgt:'Target PF',
        mp_pf_res:'kVAR to correct',
        mp_pf_kvar1:'Current kVAR',
        mp_pf_kvar2:'Target kVAR',
        mp_pf_cap:'Capacitor needed',
        mp_pf_desc:'kVAR = kW × (tan(acos PF₁) − tan(acos PF₂))',
        mp_pf_case:'Example: 100kW · PF 0.75 → 0.95 = add 55.3 kVAR (use 60 kVAR standard bank).',
        mp_pf_tip:'PF <0.90 triggers utility penalties. Correct near the load to cut I²R losses.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.powerFactor) || {};
      var kw = num(s.kw, 100);
      var pf1 = Math.min(0.999, Math.max(0.1, num(s.pf1, 0.75)));
      var pf2 = Math.min(0.999, Math.max(0.1, num(s.pf2, 0.95)));
      var kvar1 = kw * Math.tan(Math.acos(pf1));
      var kvar2 = kw * Math.tan(Math.acos(pf2));
      var kvarAdd = kvar1 - kvar2;

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pf_kw','Real power'))+'</span><span class="mp-unit">kW</span></div>'+
            '<input type="number" class="mp-in" data-in="powerFactor.kw" value="'+kw+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pf_cur','Current PF'))+'</span><span class="mp-unit">0–1</span></div>'+
            '<input type="number" class="mp-in" data-in="powerFactor.pf1" value="'+pf1+'" step="0.01" min="0.1" max="0.999" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pf_tgt','Target PF'))+'</span><span class="mp-unit">0–1</span></div>'+
            '<input type="number" class="mp-in" data-in="powerFactor.pf2" value="'+pf2+'" step="0.01" min="0.1" max="0.999" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_pf_res','kVAR to correct'))+'</div>'+
          '<div class="mp-res-main">'+fmt(kvarAdd,1)+'<span class="mp-res-unit">kVAR</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_pf_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_pf_kvar1','Current kVAR'))+'</div><div class="mp-res-val">'+fmt(kvar1,1)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pf_kvar2','Target kVAR'))+'</div><div class="mp-res-val">'+fmt(kvar2,1)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pf_cap','Capacitor'))+'</div><div class="mp-res-val">'+fmt(kvarAdd,1)+' kVAR</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_pf_case','mp_pf_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 7. serviceComm — Commercial Service Load (NEC Article 220)
  // Lighting 125%, Receptacles 100% first 10kVA + 50% remainder
  // Motors: largest @125% + others @100%
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['serviceComm'] = {
    i18n: {
      es: {
        mp_sc_title:'Servicio comercial',
        mp_sc_sub:'NEC Art. 220 · Carga calculada',
        mp_sc_light:'Iluminación',
        mp_sc_recep:'Receptáculos',
        mp_sc_motor:'Motor mayor',
        mp_sc_hvac:'HVAC',
        mp_sc_res:'Carga total calculada',
        mp_sc_amps:'Amperaje (208V 3Φ)',
        mp_sc_rec:'Servicio recomendado',
        mp_sc_desc:'Iluminación ×1.25 · Recep. 100%→10kVA, 50% resto · Motor mayor ×1.25',
        mp_sc_case:'Ejemplo: 15kVA ilum + 12kVA recep + 10kVA motor + 20kVA HVAC → 66 kVA, 183A → servicio 200A.',
        mp_sc_tip:'Receptáculos no continuos ≤180 VA cada uno (220.14(I)). HVAC: usar carga mayor (calefacción o enfriamiento).'
      },
      en: {
        mp_sc_title:'Commercial service',
        mp_sc_sub:'NEC Art. 220 · Calculated load',
        mp_sc_light:'Lighting',
        mp_sc_recep:'Receptacles',
        mp_sc_motor:'Largest motor',
        mp_sc_hvac:'HVAC',
        mp_sc_res:'Total calculated load',
        mp_sc_amps:'Amps (208V 3Φ)',
        mp_sc_rec:'Recommended service',
        mp_sc_desc:'Lighting ×1.25 · Recep. 100%→10kVA, 50% above · Largest motor ×1.25',
        mp_sc_case:'Example: 15kVA lt + 12kVA recep + 10kVA motor + 20kVA HVAC → 66 kVA, 183A → 200A service.',
        mp_sc_tip:'Non-continuous receptacles ≤180 VA each (220.14(I)). HVAC: use larger of heat vs cool.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.serviceComm) || {};
      var light = num(s.light, 15);
      var recep = num(s.recep, 12);
      var motor = num(s.motor, 10);
      var hvac  = num(s.hvac, 20);
      var lightAdj = light * 1.25;
      var recepAdj = (recep <= 10) ? recep : (10 + (recep-10)*0.5);
      var motorAdj = motor * 1.25;
      var total = lightAdj + recepAdj + motorAdj + hvac;
      var amps = (total*1000) / (208 * SQRT3);
      var sizes = [100,200,400,600,800];
      var rec = sizes[sizes.length-1];
      for (var i=0;i<sizes.length;i++){ if (amps*1.25 <= sizes[i]) { rec = sizes[i]; break; } }

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sc_light','Lighting'))+'</span><span class="mp-unit">kVA</span></div>'+
            '<input type="number" class="mp-in" data-in="serviceComm.light" value="'+light+'" step="0.5" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sc_recep','Receptacles'))+'</span><span class="mp-unit">kVA</span></div>'+
            '<input type="number" class="mp-in" data-in="serviceComm.recep" value="'+recep+'" step="0.5" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sc_motor','Largest motor'))+'</span><span class="mp-unit">kVA</span></div>'+
            '<input type="number" class="mp-in" data-in="serviceComm.motor" value="'+motor+'" step="0.5" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sc_hvac','HVAC'))+'</span><span class="mp-unit">kVA</span></div>'+
            '<input type="number" class="mp-in" data-in="serviceComm.hvac" value="'+hvac+'" step="0.5" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_sc_res','Total calculated load'))+'</div>'+
          '<div class="mp-res-main">'+fmt(total,1)+'<span class="mp-res-unit">kVA</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_sc_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_sc_amps','Amps (208V 3Φ)'))+'</div><div class="mp-res-val">'+fmt(amps,0)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_sc_rec','Recommended service'))+'</div><div class="mp-res-val">'+rec+' A</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_sc_case','mp_sc_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 8. groundingAWG — Equipment Grounding Conductor (NEC 250.122)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['groundingAWG'] = {
    i18n: {
      es: {
        mp_gd_title:'EGC · Tierra de equipo',
        mp_gd_sub:'NEC Tabla 250.122',
        mp_gd_ocpd:'Tamaño del OCPD',
        mp_gd_res:'Conductor de tierra mínimo (Cu)',
        mp_gd_desc:'Conductor de equipo a tierra en cobre según el breaker/fusible',
        mp_gd_note:'Aluminio: siguiente tamaño superior',
        mp_gd_case:'Ejemplo: circuito con breaker de 60A → EGC mínimo #10 AWG Cu.',
        mp_gd_tip:'Si redimensionas los conductores de fase por caída de voltaje, DEBES redimensionar el EGC proporcionalmente (250.122(B)).'
      },
      en: {
        mp_gd_title:'EGC · Equipment ground',
        mp_gd_sub:'NEC Table 250.122',
        mp_gd_ocpd:'OCPD rating',
        mp_gd_res:'Min copper EGC',
        mp_gd_desc:'Copper equipment grounding conductor based on breaker/fuse',
        mp_gd_note:'Aluminum: next size up',
        mp_gd_case:'Example: 60A breaker circuit → minimum #10 AWG Cu EGC.',
        mp_gd_tip:'If phase conductors are upsized for voltage drop, you MUST upsize the EGC proportionally (250.122(B)).'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.groundingAWG) || {};
      var ocpd = s.ocpd || '60';
      var sizes = ['15','20','30','60','100','200','300','400','500','600'];
      var opts='', i;
      for(i=0;i<sizes.length;i++) opts += '<option value="'+sizes[i]+'"'+(ocpd===sizes[i]?' selected':'')+'>'+sizes[i]+' A</option>';
      var egc = EGC_TABLE[ocpd] || '—';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_gd_ocpd','OCPD rating'))+'</span><span class="mp-unit">A</span></div>'+
            '<select class="mp-in" data-in="groundingAWG.ocpd">'+opts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_gd_res','Min copper EGC'))+'</div>'+
          '<div class="mp-res-main">#'+esc(egc)+'<span class="mp-res-unit">AWG</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_gd_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">OCPD</div><div class="mp-res-val">'+esc(ocpd)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_gd_note','Aluminum: next size up'))+'</div><div class="mp-res-val">NEC 250.122</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_gd_case','mp_gd_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 9. bondingJumper — Bonding jumper (NEC 250.102(C)(1))
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['bondingJumper'] = {
    i18n: {
      es: {
        mp_bj_title:'Puente de unión',
        mp_bj_sub:'NEC 250.102(C)(1)',
        mp_bj_phase:'Conductor de fase (Cu)',
        mp_bj_res:'Puente de unión mínimo',
        mp_bj_desc:'Basado en el mayor conductor no puesto a tierra por fase',
        mp_bj_note:'>1100 kcmil: ≥12.5% del conductor de fase',
        mp_bj_case:'Ejemplo: conductor de servicio 4/0 AWG Cu → puente de unión #2 AWG Cu mínimo.',
        mp_bj_tip:'El puente principal de unión conecta el neutro al gabinete en el medio de desconexión — crítico para operar OCPD en falla.'
      },
      en: {
        mp_bj_title:'Bonding jumper',
        mp_bj_sub:'NEC 250.102(C)(1)',
        mp_bj_phase:'Phase conductor (Cu)',
        mp_bj_res:'Min bonding jumper',
        mp_bj_desc:'Based on largest ungrounded phase conductor',
        mp_bj_note:'>1100 kcmil: ≥12.5% of phase conductor',
        mp_bj_case:'Example: 4/0 AWG Cu service conductor → #2 AWG Cu minimum bonding jumper.',
        mp_bj_tip:'Main bonding jumper ties neutral to enclosure at service disconnect — critical for OCPD to clear faults.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.bondingJumper) || {};
      var ph = s.phase || '4/0';
      var sizes = ['8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','350','500','600','800','1000','1100'];
      var opts='', i;
      for(i=0;i<sizes.length;i++){
        var lbl = (parseInt(sizes[i],10) >= 250 && sizes[i].indexOf('/')===-1) ? (sizes[i]+' kcmil') : ('#'+sizes[i]+' AWG');
        opts += '<option value="'+sizes[i]+'"'+(ph===sizes[i]?' selected':'')+'>'+lbl+'</option>';
      }
      var bj = BOND_TABLE[ph] || '—';
      var bjLbl = (parseInt(bj,10) >= 250 && bj.indexOf('/')===-1) ? (bj+' kcmil') : ('#'+bj+' AWG');

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bj_phase','Phase conductor (Cu)'))+'</span><span class="mp-unit">AWG/kcmil</span></div>'+
            '<select class="mp-in" data-in="bondingJumper.phase">'+opts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_bj_res','Min bonding jumper'))+'</div>'+
          '<div class="mp-res-main">'+esc(bjLbl)+'</div>'+
          '<div class="mp-res-desc">'+esc(t('mp_bj_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_bj_phase','Phase conductor'))+'</div><div class="mp-res-val">'+esc(ph)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_bj_note','>1100 kcmil rule'))+'</div><div class="mp-res-val">12.5%</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_bj_case','mp_bj_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 10. seriesParallel — Series/parallel resistor network
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['seriesParallel'] = {
    i18n: {
      es: {
        mp_sp_title:'Serie / paralelo',
        mp_sp_sub:'Red de resistores',
        mp_sp_mode:'Modo',
        mp_sp_series:'Serie',
        mp_sp_parallel:'Paralelo',
        mp_sp_v:'Voltaje de fuente',
        mp_sp_r1:'R₁',
        mp_sp_r2:'R₂',
        mp_sp_r3:'R₃ (opcional)',
        mp_sp_r4:'R₄ (opcional)',
        mp_sp_res:'Resistencia total',
        mp_sp_i:'Corriente total',
        mp_sp_p:'Potencia total',
        mp_sp_desc:'Serie: R=ΣRₙ · Paralelo: 1/R=Σ(1/Rₙ)',
        mp_sp_case:'Ejemplo: 120V con 10Ω + 20Ω + 30Ω en serie → R=60Ω · I=2A · P=240W.',
        mp_sp_tip:'En paralelo, la resistencia total siempre es menor que la menor resistencia individual.'
      },
      en: {
        mp_sp_title:'Series / parallel',
        mp_sp_sub:'Resistor network',
        mp_sp_mode:'Mode',
        mp_sp_series:'Series',
        mp_sp_parallel:'Parallel',
        mp_sp_v:'Source voltage',
        mp_sp_r1:'R₁',
        mp_sp_r2:'R₂',
        mp_sp_r3:'R₃ (optional)',
        mp_sp_r4:'R₄ (optional)',
        mp_sp_res:'Total resistance',
        mp_sp_i:'Total current',
        mp_sp_p:'Total power',
        mp_sp_desc:'Series: R=ΣRₙ · Parallel: 1/R=Σ(1/Rₙ)',
        mp_sp_case:'Example: 120V with 10Ω + 20Ω + 30Ω in series → R=60Ω · I=2A · P=240W.',
        mp_sp_tip:'In parallel, total R is always less than the smallest individual resistor.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.seriesParallel) || {};
      var mode = s.mode || 'series';
      var v = num(s.v, 120);
      var r1 = num(s.r1, 10);
      var r2 = num(s.r2, 20);
      var r3 = num(s.r3, 30);
      var r4 = num(s.r4, 0);
      var rs = [r1,r2,r3,r4];
      var rt;
      if (mode === 'series') {
        rt = 0;
        for (var i=0;i<rs.length;i++) rt += rs[i];
      } else {
        var inv = 0;
        for (var j=0;j<rs.length;j++){ if (rs[j] > 0) inv += 1/rs[j]; }
        rt = (inv > 0) ? 1/inv : 0;
      }
      var it = (rt > 0) ? v/rt : 0;
      var pt = v * it;

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_mode','Mode'))+'</span><span class="mp-unit">—</span></div>'+
            '<select class="mp-in" data-in="seriesParallel.mode">'+
              '<option value="series"'+(mode==='series'?' selected':'')+'>'+esc(t('mp_sp_series','Series'))+'</option>'+
              '<option value="parallel"'+(mode==='parallel'?' selected':'')+'>'+esc(t('mp_sp_parallel','Parallel'))+'</option>'+
            '</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_v','Source voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="seriesParallel.v" value="'+v+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_r1','R₁'))+'</span><span class="mp-unit">Ω</span></div>'+
            '<input type="number" class="mp-in" data-in="seriesParallel.r1" value="'+r1+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_r2','R₂'))+'</span><span class="mp-unit">Ω</span></div>'+
            '<input type="number" class="mp-in" data-in="seriesParallel.r2" value="'+r2+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_r3','R₃'))+'</span><span class="mp-unit">Ω</span></div>'+
            '<input type="number" class="mp-in" data-in="seriesParallel.r3" value="'+r3+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_r4','R₄'))+'</span><span class="mp-unit">Ω</span></div>'+
            '<input type="number" class="mp-in" data-in="seriesParallel.r4" value="'+r4+'" step="0.1" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_sp_res','Total resistance'))+'</div>'+
          '<div class="mp-res-main">'+fmt(rt,2)+'<span class="mp-res-unit">Ω</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_sp_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_sp_i','Total current'))+'</div><div class="mp-res-val">'+fmt(it,3)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_sp_p','Total power'))+'</div><div class="mp-res-val">'+fmt(pt,2)+' W</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_sp_case','mp_sp_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 11. powerTriangle — Power triangle (kW, kVAR, kVA, PF, θ)
  // User provides any 2 known quantities.
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['powerTriangle'] = {
    i18n: {
      es: {
        mp_pt3_title:'Triángulo de potencia',
        mp_pt3_sub:'kW · kVAR · kVA · PF · θ',
        mp_pt3_known:'Cantidades conocidas',
        mp_pt3_kw:'kW (activa)',
        mp_pt3_kvar:'kVAR (reactiva)',
        mp_pt3_kva:'kVA (aparente)',
        mp_pt3_pf:'PF (factor de potencia)',
        mp_pt3_theta:'θ (grados)',
        mp_pt3_res:'Potencia aparente',
        mp_pt3_desc:'kVA=√(kW²+kVAR²) · PF=kW/kVA · θ=acos(PF)',
        mp_pt3_case:'Ejemplo: 80kW + 60kVAR → kVA=100, PF=0.80, θ=36.87°.',
        mp_pt3_tip:'PF adelantado (capacitivo) = negativo. PF atrasado (inductivo, motores) = positivo. La mayoría de cargas HVAC son inductivas.'
      },
      en: {
        mp_pt3_title:'Power triangle',
        mp_pt3_sub:'kW · kVAR · kVA · PF · θ',
        mp_pt3_known:'Known quantities',
        mp_pt3_kw:'kW (real)',
        mp_pt3_kvar:'kVAR (reactive)',
        mp_pt3_kva:'kVA (apparent)',
        mp_pt3_pf:'PF (power factor)',
        mp_pt3_theta:'θ (degrees)',
        mp_pt3_res:'Apparent power',
        mp_pt3_desc:'kVA=√(kW²+kVAR²) · PF=kW/kVA · θ=acos(PF)',
        mp_pt3_case:'Example: 80kW + 60kVAR → kVA=100, PF=0.80, θ=36.87°.',
        mp_pt3_tip:'Leading PF (capacitive) = negative. Lagging PF (inductive, motors) = positive. Most HVAC loads are lagging.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.powerTriangle) || {};
      // Default known pair: kW + kVAR
      var kw   = (s.kw   != null && s.kw   !== '') ? +s.kw   : 80;
      var kvar = (s.kvar != null && s.kvar !== '') ? +s.kvar : 60;
      var kva  = (s.kva  != null && s.kva  !== '') ? +s.kva  : null;
      var pf   = (s.pf   != null && s.pf   !== '') ? +s.pf   : null;
      var th   = (s.theta!= null && s.theta!== '') ? +s.theta: null;

      // Resolve any 2-of-5. Priority: kW+kVAR → kW+kVA → kW+PF → kVA+PF → kVAR+PF → PF only (theta)
      var have = {kw:kw!=null&&!isNaN(kw), kvar:kvar!=null&&!isNaN(kvar), kva:kva!=null&&!isNaN(kva), pf:pf!=null&&!isNaN(pf), th:th!=null&&!isNaN(th)};
      var count = 0; for (var k in have){ if (have[k]) count++; }

      // If user over-provides, use first two that we find.
      function solve(){
        if (have.kw && have.kvar){
          kva = Math.sqrt(kw*kw + kvar*kvar);
          pf = (kva>0) ? (kw/kva) : 1;
          th = Math.acos(Math.max(-1,Math.min(1,pf))) * 180/Math.PI;
          return;
        }
        if (have.kw && have.kva){
          pf = (kva>0) ? (kw/kva) : 1;
          th = Math.acos(Math.max(-1,Math.min(1,pf))) * 180/Math.PI;
          kvar = Math.sqrt(Math.max(0, kva*kva - kw*kw));
          return;
        }
        if (have.kw && have.pf){
          kva = (pf>0) ? (kw/pf) : 0;
          th = Math.acos(Math.max(-1,Math.min(1,pf))) * 180/Math.PI;
          kvar = kva * Math.sin(th*Math.PI/180);
          return;
        }
        if (have.kva && have.pf){
          kw = kva * pf;
          th = Math.acos(Math.max(-1,Math.min(1,pf))) * 180/Math.PI;
          kvar = kva * Math.sin(th*Math.PI/180);
          return;
        }
        if (have.kvar && have.pf){
          th = Math.acos(Math.max(-1,Math.min(1,pf))) * 180/Math.PI;
          var sn = Math.sin(th*Math.PI/180);
          kva = (sn>0) ? (kvar/sn) : 0;
          kw = kva * pf;
          return;
        }
        if (have.kva && have.th){
          pf = Math.cos(th*Math.PI/180);
          kw = kva * pf;
          kvar = kva * Math.sin(th*Math.PI/180);
          return;
        }
        // Fallback default
        kw = 80; kvar = 60;
        kva = Math.sqrt(kw*kw + kvar*kvar);
        pf = kw/kva;
        th = Math.acos(pf)*180/Math.PI;
      }
      solve();

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_pt3_known','Known quantities'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pt3_kw','kW'))+'</span><span class="mp-unit">kW</span></div>'+
            '<input type="number" class="mp-in" data-in="powerTriangle.kw" value="'+(s.kw!=null?s.kw:80)+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pt3_kvar','kVAR'))+'</span><span class="mp-unit">kVAR</span></div>'+
            '<input type="number" class="mp-in" data-in="powerTriangle.kvar" value="'+(s.kvar!=null?s.kvar:60)+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pt3_kva','kVA'))+'</span><span class="mp-unit">kVA</span></div>'+
            '<input type="number" class="mp-in" data-in="powerTriangle.kva" value="'+(s.kva!=null?s.kva:'')+'" step="1" placeholder="—" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pt3_pf','PF'))+'</span><span class="mp-unit">0–1</span></div>'+
            '<input type="number" class="mp-in" data-in="powerTriangle.pf" value="'+(s.pf!=null?s.pf:'')+'" step="0.01" min="0" max="1" placeholder="—" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pt3_theta','θ'))+'</span><span class="mp-unit">°</span></div>'+
            '<input type="number" class="mp-in" data-in="powerTriangle.theta" value="'+(s.theta!=null?s.theta:'')+'" step="0.1" placeholder="—" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_pt3_res','Apparent power'))+'</div>'+
          '<div class="mp-res-main">'+fmt(kva,2)+'<span class="mp-res-unit">kVA</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_pt3_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">kW</div><div class="mp-res-val">'+fmt(kw,2)+'</div></div>'+
            '<div><div class="mp-res-item">kVAR</div><div class="mp-res-val">'+fmt(kvar,2)+'</div></div>'+
            '<div><div class="mp-res-item">PF</div><div class="mp-res-val">'+fmt(pf,3)+'</div></div>'+
            '<div><div class="mp-res-item">θ</div><div class="mp-res-val">'+fmt(th,2)+'°</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_pt3_case','mp_pt3_tip');
    }
  };

})();
