// ============================================
// ZONA DE CONTRATISTAS — Plantillas de Contratos
// California-compliant HVAC contract templates
// §7159, §7018, §7159.5 compliance
// ============================================

(function() {
  'use strict';

  // ── Shared helpers for renderers ──────────────
  function _e(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function _v(values, key, fallback) {
    if (values && values[key] != null && String(values[key]).trim() !== '') return _e(values[key]);
    return fallback != null ? ('<span style="color:#888;">'+_e(fallback)+'</span>') : '<span style="color:#888;">__________________</span>';
  }

  function _vRaw(values, key, fallback) {
    if (values && values[key] != null && String(values[key]).trim() !== '') return String(values[key]);
    return fallback != null ? String(fallback) : '';
  }

  function _money(values, key, fallback) {
    var raw = _vRaw(values, key, fallback);
    if (!raw) return '<span style="color:#888;">$_________</span>';
    var n = parseFloat(String(raw).replace(/[^0-9.\-]/g, ''));
    if (isNaN(n)) return '$' + _e(raw);
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function _printStyles() {
    return '<style>' +
      '@page { size: letter; margin: 0.75in; }' +
      '* { box-sizing: border-box; }' +
      'body { font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.45; color: #111; margin: 0; padding: 0.75in; background: #fff; }' +
      'h1 { font-size: 18pt; margin: 0 0 6pt; text-align: center; letter-spacing: 0.5pt; }' +
      'h2 { font-size: 14pt; margin: 14pt 0 6pt; border-bottom: 1pt solid #111; padding-bottom: 3pt; }' +
      'h3 { font-size: 12pt; margin: 10pt 0 4pt; }' +
      'p { margin: 6pt 0; }' +
      '.en { font-style: italic; color: #333; font-size: 10pt; display: block; margin-top: 2pt; }' +
      '.lic-band { text-align:center; padding:8pt; border:2pt solid #111; margin-bottom:12pt; font-weight:bold; font-size:12pt; }' +
      '.boxed { border: 2pt solid #111; padding: 10pt; margin: 10pt 0; }' +
      '.warning { border: 3pt solid #b00; padding: 10pt; margin: 12pt 0; background: #fff8f6; }' +
      '.warning-title { color: #b00; font-weight: bold; font-size: 13pt; text-transform: uppercase; }' +
      'table { width: 100%; border-collapse: collapse; margin: 8pt 0; }' +
      'th, td { border: 1pt solid #333; padding: 5pt 7pt; text-align: left; vertical-align: top; }' +
      'th { background: #eee; font-weight: bold; }' +
      '.sig-row { display: flex; gap: 20pt; margin-top: 22pt; page-break-inside: avoid; }' +
      '.sig-block { flex:1; border-top: 1pt solid #111; padding-top: 4pt; font-size: 10pt; }' +
      '.small { font-size: 9.5pt; color: #222; }' +
      '.row { display: flex; gap: 12pt; flex-wrap: wrap; }' +
      '.col { flex: 1; min-width: 200pt; }' +
      '.pbb { page-break-before: always; }' +
      '.pba { page-break-after: always; }' +
      '.no-break { page-break-inside: avoid; }' +
      '.tier { border:1.5pt solid #111; padding:10pt; border-radius:4pt; margin:6pt 0; }' +
      '.tier-best { border:2.5pt solid #0a5; background:#f6fff9; }' +
      '.foot-legal { margin-top: 20pt; font-size: 9pt; color: #333; border-top: 1pt solid #999; padding-top: 6pt; }' +
      'button.print-btn { display:block; margin:14pt auto; padding:12pt 24pt; font-size:13pt; font-weight:bold; background:#0a1628; color:#fff; border:none; border-radius:6pt; cursor:pointer; }' +
      '@media print { button.print-btn, .no-print { display:none !important; } body { padding: 0; } }' +
      '</style>';
  }

  function _header(title, values) {
    var h = '';
    h += '<div class="lic-band">';
    h += 'CSLB LICENSE #: ' + _v(values, 'license_num', 'XXXXXXX') + ' &nbsp;·&nbsp; ';
    h += _v(values, 'business_name', 'NOMBRE DE LA EMPRESA') + '</div>';
    h += '<div style="text-align:center;font-size:10pt;margin-bottom:10pt;">';
    h += _v(values, 'business_address', 'Dirección') + ' &nbsp;·&nbsp; ';
    h += 'Tel: ' + _v(values, 'business_phone', '(xxx) xxx-xxxx') + ' &nbsp;·&nbsp; ';
    h += 'Email: ' + _v(values, 'business_email', 'email@empresa.com');
    h += '</div>';
    h += '<h1>' + _e(title) + '</h1>';
    return h;
  }

  function _printButton() {
    return '<button class="print-btn no-print" onclick="window.print()">Imprimir / Guardar PDF</button>';
  }

  // ══════════════════════════════════════════════════════════════
  // §7018 VERBATIM MECHANICS LIEN WARNING (California Civil Code)
  // Must appear in all home-improvement contracts >$500
  // ══════════════════════════════════════════════════════════════
  var MECHANICS_LIEN_WARNING = ''
    + '<div class="warning no-break">'
    + '<div class="warning-title">Mechanics Lien Warning:</div>'
    + '<p class="small">Anyone who helps improve your property, but who is not paid, may record what is called a mechanics lien on your property. A mechanics lien is a claim, like a mortgage or home equity loan, made against your property and recorded with the county recorder.</p>'
    + '<p class="small">Even if you pay your contractor in full, unpaid subcontractors, suppliers, and laborers who helped to improve your property may record mechanics liens and sue you in court to foreclose the lien. If a court finds the lien is valid, you could be forced to pay twice or have a court officer sell your home to pay the lien. Liens can also affect your credit.</p>'
    + '<p class="small">To preserve their right to record a lien, each subcontractor and material supplier must provide you with a document called a "20-day Preliminary Notice." This notice is not a lien. The purpose of the notice is to let you know that the person who sends you the notice has the right to record a lien on your property if he or she is not paid.</p>'
    + '<p class="small"><b>BE CAREFUL.</b> The Preliminary Notice can be sent up to 20 days after the subcontractor starts work or the supplier provides material. This can be a big problem if you pay your contractor before you have received the Preliminary Notices.</p>'
    + '<p class="small"><b>PROTECT YOURSELF FROM LIENS.</b> You can protect yourself from liens by getting a list from your contractor of all the subcontractors and material suppliers that work on your project. Find out from your contractor when these subcontractors started work and when these suppliers delivered goods or materials. Then wait 20 days, paying attention to the Preliminary Notices you receive.</p>'
    + '<p class="small"><b>PAY WITH JOINT CHECKS.</b> One way to protect yourself is to pay with a joint check. When your contractor tells you it is time to pay for the work of a subcontractor or supplier who has provided you with a Preliminary Notice, write a joint check payable to both the contractor and the subcontractor or material supplier.</p>'
    + '<p class="small">For other ways to prevent liens, visit CSLB\'s internet website at www.cslb.ca.gov or call CSLB at 800-321-CSLB (2752).</p>'
    + '<p class="small"><b>REMEMBER, IF YOU DO NOTHING, YOU RISK HAVING A LIEN PLACED ON YOUR HOME.</b> This can mean that you may have to pay twice, or face the forced sale of your home to pay what you owe.</p>'
    + '</div>';

  // ══════════════════════════════════════════════════════════════
  // §7159(d) VERBATIM NOTICE OF RIGHT TO CANCEL
  // ══════════════════════════════════════════════════════════════
  var RIGHT_TO_CANCEL = ''
    + '<div class="boxed no-break" style="font-size:12pt;">'
    + '<div style="text-align:center;font-weight:bold;font-size:13pt;text-transform:uppercase;margin-bottom:6pt;">Notice of Cancellation / Aviso de Cancelación</div>'
    + '<p class="small"><b>You, the buyer, have the right to cancel this contract within three business days.</b> You may cancel by e-mailing, mailing, faxing, or delivering a written notice to the contractor at the contractor\'s place of business by midnight of the third business day after you received a signed and dated copy of the contract that includes this notice. Include your name, your address, and the date you received the signed copy of the contract and this notice.</p>'
    + '<p class="small">If you cancel, the contractor must return to you anything you paid within 10 days of receiving the notice of cancellation. For your part, you must make available to the contractor at your residence, in substantially as good condition as you received them, goods delivered to you under this contract or sale. Or, you may, if you wish, comply with the contractor\'s instructions on how to return the goods at the contractor\'s expense and risk. If you do make the goods available to the contractor and the contractor does not pick them up within 20 days of the date of your notice of cancellation, you may keep them without any further obligation. If you fail to make the goods available to the contractor, or if you agree to return the goods to the contractor and fail to do so, then you remain liable for performance of all obligations under the contract.</p>'
    + '<p class="en small">(Spanish) Usted, el comprador, tiene el derecho de cancelar este contrato dentro de tres días hábiles. Puede cancelar enviando un aviso por escrito al contratista en su lugar de negocios antes de la medianoche del tercer día hábil después de recibir una copia firmada y fechada de este contrato con este aviso.</p>'
    + '</div>';

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 1: RESIDENTIAL INSTALL
  // ══════════════════════════════════════════════════════════════
  var T_RESIDENTIAL = {
    id: 'residential-install',
    title: 'Contrato de Instalación Residencial HVAC',
    icon: '🏠',
    category: 'Residencial',
    description: 'Contrato CA-compliant (§7159) para instalación de equipo de AC/calefacción en residencia. Incluye lien warning y aviso de 3 días.',
    fields: [
      { id:'license_num', label:'Número de licencia CSLB', type:'text', placeholder:'1087654', required:true },
      { id:'business_name', label:'Nombre de la empresa', type:'text', placeholder:'ACVOLT HVAC Services Inc.', required:true },
      { id:'business_address', label:'Dirección de la empresa', type:'text', placeholder:'1234 Main St, Los Angeles, CA 90001', required:true },
      { id:'business_phone', label:'Teléfono de la empresa', type:'text', placeholder:'(323) 555-1212', required:true },
      { id:'business_email', label:'Email de la empresa', type:'text', placeholder:'contacto@acvolt.com', required:false },
      { id:'contract_num', label:'Número de contrato', type:'text', placeholder:'RC-2026-001', required:true },
      { id:'contract_date', label:'Fecha del contrato', type:'date', required:true },
      { id:'customer_name', label:'Nombre del cliente', type:'text', placeholder:'Juan Pérez', required:true },
      { id:'customer_address', label:'Dirección del proyecto', type:'text', placeholder:'5678 Oak Ave, Inglewood, CA 90301', required:true },
      { id:'customer_phone', label:'Teléfono del cliente', type:'text', placeholder:'(310) 555-9999', required:true },
      { id:'equip_brand', label:'Marca del equipo', type:'text', placeholder:'Carrier', required:true },
      { id:'equip_model', label:'Modelo / Condensing Unit', type:'text', placeholder:'24ACB636A003', required:true },
      { id:'equip_seer2', label:'SEER2', type:'text', placeholder:'15.2', required:true },
      { id:'equip_tonnage', label:'Toneladas', type:'text', placeholder:'3', required:true },
      { id:'scope', label:'Alcance del trabajo (scope)', type:'textarea', placeholder:'Remover sistema existente. Instalar nuevo condensador 3-ton SEER2 15.2, evaporador emparejado, line set nuevo 3/4" x 3/8", termostato programable, breaker dedicado, permit con ciudad, pruebas y arranque.', required:true },
      { id:'price_materials', label:'Precio materiales', type:'money', placeholder:'4500', required:true },
      { id:'price_labor', label:'Precio mano de obra', type:'money', placeholder:'3500', required:true },
      { id:'price_permits', label:'Precio permisos/inspección', type:'money', placeholder:'450', required:false },
      { id:'price_total', label:'Precio total', type:'money', placeholder:'8450', required:true },
      { id:'down_payment', label:'Enganche (menor de 10% o $1,000 — §7159.5)', type:'money', placeholder:'845', required:true },
      { id:'start_date', label:'Fecha de inicio estimada', type:'date', required:true },
      { id:'completion_date', label:'Fecha estimada de terminación', type:'date', required:true },
      { id:'warranty_parts', label:'Garantía de partes (años)', type:'text', placeholder:'10', required:true, defaultValue:'10' },
      { id:'warranty_labor', label:'Garantía de mano de obra (años)', type:'text', placeholder:'2', required:true, defaultValue:'2' },
      { id:'warranty_compressor', label:'Garantía del compresor (años)', type:'text', placeholder:'10', required:true, defaultValue:'10' },
      { id:'service_fee', label:'Tarifa de servicio / diagnóstico', type:'money', placeholder:'89', required:false, defaultValue:'89' },
      { id:'arbitration', label:'Incluir cláusula de arbitraje', type:'checkbox', defaultValue:true }
    ],
    render: function(values) {
      var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Contrato Residencial HVAC</title>' + _printStyles() + '</head><body>';
      h += _printButton();
      h += _header('CONTRATO DE INSTALACIÓN HVAC RESIDENCIAL', values);
      h += '<div style="text-align:center;font-style:italic;color:#555;font-size:10pt;margin-bottom:10pt;">Residential HVAC Installation Contract</div>';

      // Contract header
      h += '<table><tr>';
      h += '<td><b>Contrato #</b><br>'+_v(values,'contract_num')+'</td>';
      h += '<td><b>Fecha</b><br>'+_v(values,'contract_date')+'</td>';
      h += '<td><b>Cliente</b><br>'+_v(values,'customer_name')+'</td>';
      h += '</tr><tr>';
      h += '<td colspan="2"><b>Dirección del proyecto</b><br>'+_v(values,'customer_address')+'</td>';
      h += '<td><b>Teléfono</b><br>'+_v(values,'customer_phone')+'</td>';
      h += '</tr></table>';

      // §7159(d) — Right to cancel (prominent)
      h += RIGHT_TO_CANCEL;

      // Scope of work
      h += '<h2>1. Alcance del trabajo <span class="en">Scope of Work</span></h2>';
      h += '<p>'+_v(values,'scope')+'</p>';
      h += '<table>';
      h += '<tr><th>Marca</th><th>Modelo</th><th>SEER2</th><th>Toneladas</th></tr>';
      h += '<tr><td>'+_v(values,'equip_brand')+'</td><td>'+_v(values,'equip_model')+'</td><td>'+_v(values,'equip_seer2')+'</td><td>'+_v(values,'equip_tonnage')+'</td></tr>';
      h += '</table>';

      // Price breakdown
      h += '<h2>2. Desglose de precio <span class="en">Price Breakdown</span></h2>';
      h += '<table>';
      h += '<tr><th>Concepto</th><th style="text-align:right;">Monto</th></tr>';
      h += '<tr><td>Materiales y equipo</td><td style="text-align:right;">'+_money(values,'price_materials')+'</td></tr>';
      h += '<tr><td>Mano de obra</td><td style="text-align:right;">'+_money(values,'price_labor')+'</td></tr>';
      h += '<tr><td>Permisos e inspección</td><td style="text-align:right;">'+_money(values,'price_permits','0')+'</td></tr>';
      h += '<tr><th>TOTAL DEL CONTRATO</th><th style="text-align:right;">'+_money(values,'price_total')+'</th></tr>';
      h += '</table>';

      // §7159.5 — Down payment limit
      h += '<div class="boxed no-break">';
      h += '<p><b>Enganche / Down Payment (§7159.5):</b> '+_money(values,'down_payment')+'</p>';
      h += '<p class="small"><b>California law limits the down payment to the lesser of 10% of the contract price or $1,000, whichever is less.</b> No person shall require or accept payment for a home-improvement contract from an owner before the work has begun in excess of this amount.</p>';
      h += '<p class="en small">La ley de California limita el pago inicial al menor entre 10% del precio del contrato o $1,000.</p>';
      h += '</div>';

      // Service fee disclosure
      h += '<h3>Tarifa de servicio / Service Call Fee</h3>';
      h += '<p>Si el cliente cancela después del período de 3 días y ya se realizó visita de diagnóstico, se cobrará una tarifa de servicio de '+_money(values,'service_fee','89')+'. <span class="en">A service/diagnostic fee applies after the 3-day cancellation period if a diagnostic visit has occurred.</span></p>';

      // Schedule
      h += '<h2>3. Cronograma <span class="en">Schedule</span></h2>';
      h += '<p><b>Inicio estimado:</b> '+_v(values,'start_date')+' &nbsp;|&nbsp; <b>Terminación estimada:</b> '+_v(values,'completion_date')+'</p>';
      h += '<p class="small">Demoras causadas por condiciones fuera del control razonable del contratista (clima, backorder de equipo, tiempos de permiso, actos del cliente) extenderán proporcionalmente este cronograma.</p>';

      // Warranty
      h += '<h2>4. Garantías <span class="en">Warranty Terms</span></h2>';
      h += '<ul>';
      h += '<li><b>Partes (fabricante):</b> '+_v(values,'warranty_parts','10')+' años — transferido por el fabricante al cliente final, sujeto al registro del equipo dentro de 60-90 días de la instalación.</li>';
      h += '<li><b>Compresor:</b> '+_v(values,'warranty_compressor','10')+' años — garantía del fabricante.</li>';
      h += '<li><b>Mano de obra (del contratista):</b> '+_v(values,'warranty_labor','2')+' años desde la fecha de terminación, cubriendo defectos de instalación.</li>';
      h += '<li><b>Exclusiones:</b> mal uso, falta de mantenimiento (ver Sección 5), daños por sobrecarga eléctrica, inundación, actos de Dios, obstrucciones a la unidad externa, alteraciones por terceros.</li>';
      h += '</ul>';

      // Change orders — §7159(g)
      h += '<h2>5. Órdenes de cambio <span class="en">Change Orders</span></h2>';
      h += '<p>Cualquier cambio al alcance o precio del contrato debe hacerse por escrito mediante una <b>Orden de Cambio</b> firmada por el cliente ANTES de empezar el trabajo adicional. <span class="en">Any change to the scope or price must be in writing via a signed Change Order before additional work begins (§7159(g)).</span></p>';
      h += '<p class="small"><b>AVISO:</b> En California, las órdenes de cambio verbales no son ejecutables. El contratista no es responsable de cargos adicionales por trabajo realizado sin una Orden de Cambio firmada.</p>';

      // Mechanics lien warning
      h += MECHANICS_LIEN_WARNING;

      // Arbitration (optional)
      if (values && values.arbitration) {
        h += '<h2>6. Arbitraje <span class="en">Arbitration</span></h2>';
        h += '<p class="small">Cualquier disputa derivada de este contrato será resuelta por arbitraje vinculante bajo las reglas de la American Arbitration Association en el condado donde se realizó el trabajo. Al firmar, ambas partes renuncian al derecho a juicio por jurado.</p>';
        h += '<p class="en small">Any dispute arising out of this contract shall be resolved by binding arbitration under AAA rules in the county where the work was performed. By signing, both parties waive the right to a jury trial.</p>';
      }

      // Acknowledgment + signatures
      h += '<div class="no-break">';
      h += '<h2>Aceptación y firmas <span class="en">Acceptance & Signatures</span></h2>';
      h += '<p class="small">El cliente reconoce haber recibido una copia firmada de este contrato con el Aviso de Cancelación y el Mechanics Lien Warning en el momento de la firma. <span class="en">Customer acknowledges receipt of a signed copy of this contract including the Notice of Cancellation and Mechanics Lien Warning at the time of signing.</span></p>';
      h += '<div class="sig-row">';
      h += '<div class="sig-block"><b>Cliente / Customer</b><br>Firma: ____________________________<br>Nombre: '+_v(values,'customer_name')+'<br>Fecha: ____________________________</div>';
      h += '<div class="sig-block"><b>Contratista / Contractor</b><br>Firma: ____________________________<br>'+_v(values,'business_name')+'<br>CSLB #'+_v(values,'license_num')+'<br>Fecha: ____________________________</div>';
      h += '</div>';
      h += '</div>';

      h += '<div class="foot-legal">Este contrato cumple con California Business & Professions Code §7159, §7018 y §7159.5. CSLB #'+_v(values,'license_num')+'.</div>';
      h += '</body></html>';
      return h;
    }
  };

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 2: COMMERCIAL SERVICE AGREEMENT
  // ══════════════════════════════════════════════════════════════
  var T_COMMERCIAL = {
    id: 'commercial-service',
    title: 'Acuerdo de Servicio Comercial HVAC',
    icon: '🏢',
    category: 'Comercial',
    description: 'Contrato de mantenimiento preventivo para clientes comerciales. Incluye PM checklist, tarifas de emergencia, renovación automática.',
    fields: [
      { id:'license_num', label:'Número de licencia CSLB', type:'text', placeholder:'1087654', required:true },
      { id:'business_name', label:'Nombre de la empresa', type:'text', placeholder:'ACVOLT Commercial HVAC', required:true },
      { id:'business_address', label:'Dirección de la empresa', type:'text', required:true },
      { id:'business_phone', label:'Teléfono de la empresa', type:'text', required:true },
      { id:'business_email', label:'Email de la empresa', type:'text', required:false },
      { id:'agreement_num', label:'Número de acuerdo', type:'text', placeholder:'CS-2026-001', required:true },
      { id:'agreement_date', label:'Fecha del acuerdo', type:'date', required:true },
      { id:'client_name', label:'Nombre del cliente (empresa)', type:'text', placeholder:'Tacos Rigo LLC', required:true },
      { id:'client_contact', label:'Contacto principal', type:'text', placeholder:'María Rodríguez, Gerente', required:true },
      { id:'client_address', label:'Dirección del sitio', type:'text', required:true },
      { id:'client_phone', label:'Teléfono del cliente', type:'text', required:true },
      { id:'num_units', label:'Número de unidades RTU / split', type:'text', placeholder:'4', required:true },
      { id:'frequency', label:'Frecuencia de visitas', type:'text', placeholder:'Trimestral (4/año)', required:true, defaultValue:'Trimestral (4 visitas/año)' },
      { id:'monthly_fee', label:'Tarifa mensual', type:'money', placeholder:'450', required:true },
      { id:'quarterly_fee', label:'Tarifa trimestral', type:'money', placeholder:'1350', required:false },
      { id:'term_months', label:'Duración del contrato (meses)', type:'text', placeholder:'12', required:true, defaultValue:'12' },
      { id:'emergency_4hr_rate', label:'Tarifa respuesta 4 horas ($/hr)', type:'money', placeholder:'185', required:true, defaultValue:'185' },
      { id:'emergency_24hr_rate', label:'Tarifa respuesta 24 horas ($/hr)', type:'money', placeholder:'135', required:true, defaultValue:'135' },
      { id:'afterhours_rate', label:'Tarifa fuera de horario ($/hr)', type:'money', placeholder:'225', required:true, defaultValue:'225' },
      { id:'parts_discount', label:'Descuento en partes (%)', type:'text', placeholder:'15', required:true, defaultValue:'15' },
      { id:'liability_cap', label:'Tope de responsabilidad civil', type:'money', placeholder:'1000000', required:true, defaultValue:'1000000' }
    ],
    render: function(values) {
      var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Acuerdo de Servicio Comercial HVAC</title>' + _printStyles() + '</head><body>';
      h += _printButton();
      h += _header('ACUERDO DE SERVICIO COMERCIAL HVAC', values);
      h += '<div style="text-align:center;font-style:italic;color:#555;font-size:10pt;margin-bottom:10pt;">Commercial HVAC Service Agreement</div>';

      h += '<table><tr>';
      h += '<td><b>Acuerdo #</b><br>'+_v(values,'agreement_num')+'</td>';
      h += '<td><b>Fecha</b><br>'+_v(values,'agreement_date')+'</td>';
      h += '<td><b>Duración</b><br>'+_v(values,'term_months','12')+' meses</td>';
      h += '</tr><tr>';
      h += '<td><b>Cliente</b><br>'+_v(values,'client_name')+'</td>';
      h += '<td><b>Contacto</b><br>'+_v(values,'client_contact')+'</td>';
      h += '<td><b>Tel</b><br>'+_v(values,'client_phone')+'</td>';
      h += '</tr><tr>';
      h += '<td colspan="3"><b>Dirección del sitio</b><br>'+_v(values,'client_address')+'</td>';
      h += '</tr></table>';

      h += '<h2>1. Alcance del servicio preventivo <span class="en">Preventive Maintenance Scope</span></h2>';
      h += '<p><b>Unidades cubiertas:</b> '+_v(values,'num_units')+' unidades · <b>Frecuencia:</b> '+_v(values,'frequency','Trimestral')+'</p>';

      h += '<h3>PM Checklist — cada visita:</h3>';
      h += '<ul class="small">';
      h += '<li>Inspeccionar y reemplazar filtros (MERV 8 estándar, MERV 11+ cuota adicional)</li>';
      h += '<li>Lavar condensador con químico apropiado</li>';
      h += '<li>Limpiar evaporador y charola de condensado; aplicar tabletas biocida</li>';
      h += '<li>Medir supply y return (temp split), static pressure externo</li>';
      h += '<li>Verificar sobrecalentamiento (superheat) y subenfriamiento (subcool) — ajuste de carga si necesario</li>';
      h += '<li>Medir amperaje de compresor, condenser fan, blower motor; comparar vs FLA/RLA</li>';
      h += '<li>Apretar terminales eléctricas (thermal imaging opcional)</li>';
      h += '<li>Inspeccionar contactor, capacitor (microfarad), relevadores, crankcase heater</li>';
      h += '<li>Limpiar drain line, verificar pendiente y trap; drenar tubo y revisar switch de seguridad</li>';
      h += '<li>Inspección visual de line set, aislamiento, soportes y conexiones de gas si aplica</li>';
      h += '<li>Verificar operación del termostato, programación estacional</li>';
      h += '<li>Reporte digital con fotos y recomendaciones enviado al cliente</li>';
      h += '</ul>';

      h += '<h2>2. Precio y cronograma de pagos <span class="en">Fees & Payment</span></h2>';
      h += '<table>';
      h += '<tr><th>Concepto</th><th style="text-align:right;">Monto</th></tr>';
      h += '<tr><td>Cuota mensual</td><td style="text-align:right;">'+_money(values,'monthly_fee')+' / mes</td></tr>';
      h += '<tr><td>Cuota trimestral (si aplica)</td><td style="text-align:right;">'+_money(values,'quarterly_fee','0')+' / trimestre</td></tr>';
      h += '</table>';
      h += '<p class="small">Facturación neta-30. Pagos tardíos (>30 días) acumulan 1.5%/mes de interés. La no-renovación automática requiere aviso por escrito 30 días antes del vencimiento.</p>';

      h += '<h2>3. Tiempos de respuesta a emergencias <span class="en">Emergency Response Tiers</span></h2>';
      h += '<table>';
      h += '<tr><th>Nivel</th><th>Tiempo de respuesta</th><th style="text-align:right;">Tarifa</th></tr>';
      h += '<tr><td><b>Emergencia crítica</b> (AC abajo durante horario comercial, riesgo de producto)</td><td>4 horas</td><td style="text-align:right;">'+_money(values,'emergency_4hr_rate','185')+' /hr</td></tr>';
      h += '<tr><td><b>Standard</b> (comfort, no-emergencia)</td><td>24 horas</td><td style="text-align:right;">'+_money(values,'emergency_24hr_rate','135')+' /hr</td></tr>';
      h += '<tr><td><b>Fuera de horario</b> (noches, fines de semana, feriados)</td><td>según disponibilidad</td><td style="text-align:right;">'+_money(values,'afterhours_rate','225')+' /hr</td></tr>';
      h += '</table>';
      h += '<p class="small">Mínimo 1 hora facturada por visita de emergencia. Tiempo de viaje portal-a-portal incluido.</p>';

      h += '<h2>4. Beneficios de miembro <span class="en">Member Benefits</span></h2>';
      h += '<ul>';
      h += '<li>Descuento '+_v(values,'parts_discount','15')+'% en todas las partes y equipo reemplazado</li>';
      h += '<li>Prioridad de agenda sobre clientes no-contratados</li>';
      h += '<li>Cotizaciones gratuitas para reemplazos y actualizaciones</li>';
      h += '<li>Registro digital de unidades con histórico de lecturas y partes reemplazadas</li>';
      h += '<li>Sin cuota de diagnóstico en visitas de emergencia cubiertas</li>';
      h += '</ul>';

      h += '<h2>5. Renovación automática <span class="en">Auto-Renewal</span></h2>';
      h += '<p>Este acuerdo se renueva automáticamente por períodos iguales de '+_v(values,'term_months','12')+' meses a menos que una de las partes entregue notificación por escrito al menos <b>30 días</b> antes del vencimiento. Las tarifas pueden ajustarse en la renovación con aviso por escrito de 60 días.</p>';
      h += '<p class="en small">This agreement auto-renews for equal terms of '+_v(values,'term_months','12')+' months unless either party provides written notice at least 30 days before expiration.</p>';

      h += '<h2>6. Tope de responsabilidad <span class="en">Liability Cap</span></h2>';
      h += '<p>La responsabilidad total agregada del contratista bajo este acuerdo, por cualquier causa, no excederá '+_money(values,'liability_cap','1000000')+' o los pagos totales realizados bajo este acuerdo en los 12 meses anteriores al evento, el que sea menor. El contratista no será responsable por daños consecuentes, pérdida de ingresos, pérdida de producto perecedero o pérdida de uso del edificio.</p>';
      h += '<p class="en small">Contractor\'s aggregate liability under this agreement shall not exceed '+_money(values,'liability_cap','1000000')+' or the total payments made in the preceding 12 months, whichever is less. No liability for consequential, lost profit, spoiled inventory, or loss-of-use damages.</p>';

      h += '<h2>7. Indemnización <span class="en">Indemnification</span></h2>';
      h += '<p>Cada parte indemnizará y eximirá a la otra de cualquier reclamo de terceros causado por su propia negligencia o acto doloso. El contratista mantendrá seguro de responsabilidad civil general de al menos $1,000,000 por ocurrencia y compensación de trabajadores según lo exigido por la ley de California. Certificados de seguro disponibles a solicitud.</p>';
      h += '<p class="en small">Each party shall indemnify the other from third-party claims caused by its own negligence. Contractor maintains general liability of at least $1M/occurrence and CA workers\' compensation.</p>';

      // Signatures
      h += '<div class="no-break">';
      h += '<h2>Firmas <span class="en">Signatures</span></h2>';
      h += '<div class="sig-row">';
      h += '<div class="sig-block"><b>Cliente / Client</b><br>Firma: ____________________________<br>Nombre: '+_v(values,'client_contact')+'<br>Empresa: '+_v(values,'client_name')+'<br>Fecha: ____________________________</div>';
      h += '<div class="sig-block"><b>Contratista / Contractor</b><br>Firma: ____________________________<br>'+_v(values,'business_name')+'<br>CSLB #'+_v(values,'license_num')+'<br>Fecha: ____________________________</div>';
      h += '</div>';
      h += '</div>';

      h += '<div class="foot-legal">California CSLB #'+_v(values,'license_num')+' · Commercial Service Agreement template · B&P Code compliant.</div>';
      h += '</body></html>';
      return h;
    }
  };

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 3: CHANGE ORDER
  // ══════════════════════════════════════════════════════════════
  var T_CHANGE_ORDER = {
    id: 'change-order',
    title: 'Orden de Cambio (Change Order)',
    icon: '📝',
    category: 'Modificación',
    description: '§7159(g) requiere que todas las modificaciones al contrato sean por escrito y firmadas ANTES del trabajo adicional.',
    fields: [
      { id:'license_num', label:'Número de licencia CSLB', type:'text', required:true },
      { id:'business_name', label:'Nombre de la empresa', type:'text', required:true },
      { id:'business_address', label:'Dirección de la empresa', type:'text', required:true },
      { id:'business_phone', label:'Teléfono de la empresa', type:'text', required:true },
      { id:'business_email', label:'Email de la empresa', type:'text', required:false },
      { id:'co_num', label:'Número de orden de cambio', type:'text', placeholder:'CO-001', required:true },
      { id:'co_date', label:'Fecha de la orden de cambio', type:'date', required:true },
      { id:'original_contract_num', label:'Número de contrato original', type:'text', placeholder:'RC-2026-001', required:true },
      { id:'original_contract_date', label:'Fecha del contrato original', type:'date', required:true },
      { id:'customer_name', label:'Nombre del cliente', type:'text', required:true },
      { id:'customer_address', label:'Dirección del proyecto', type:'text', required:true },
      { id:'reason', label:'Razón del cambio', type:'textarea', placeholder:'Durante el desmantelamiento se encontró el plenum de retorno con daño por moho que requiere reemplazo para cumplir con código.', required:true },
      { id:'work_added', label:'Trabajo agregado', type:'textarea', placeholder:'Remover plenum existente 20x20. Fabricar e instalar plenum nuevo en lámina calibre 26 con aislamiento R-6. Sellar todas las juntas con mastic.', required:false },
      { id:'work_removed', label:'Trabajo removido/sustituido', type:'textarea', placeholder:'N/A', required:false },
      { id:'new_materials', label:'Costo de nuevos materiales', type:'money', placeholder:'320', required:true },
      { id:'new_labor_hours', label:'Horas de mano de obra adicionales', type:'text', placeholder:'4', required:true },
      { id:'new_labor_cost', label:'Costo de mano de obra adicional', type:'money', placeholder:'480', required:true },
      { id:'co_subtotal', label:'Subtotal de esta orden de cambio', type:'money', placeholder:'800', required:true },
      { id:'original_total', label:'Total del contrato original', type:'money', placeholder:'8450', required:true },
      { id:'new_contract_total', label:'Nuevo total del contrato', type:'money', placeholder:'9250', required:true },
      { id:'schedule_impact_days', label:'Impacto en cronograma (días)', type:'text', placeholder:'1', required:true, defaultValue:'0' },
      { id:'new_completion_date', label:'Nueva fecha de terminación', type:'date', required:true }
    ],
    render: function(values) {
      var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Orden de Cambio</title>' + _printStyles() + '</head><body>';
      h += _printButton();
      h += _header('ORDEN DE CAMBIO / CHANGE ORDER', values);

      h += '<div class="warning no-break">';
      h += '<div class="warning-title">⚠ Aviso importante / Important Notice</div>';
      h += '<p class="small">Bajo California Business & Professions Code §7159(g), cualquier modificación a un contrato de mejoras del hogar debe ser <b>por escrito y firmada por ambas partes antes de empezar el trabajo adicional</b>. <b>Las órdenes de cambio verbales NO son ejecutables en California.</b> Ambas partes deben firmar ABAJO antes de que el contratista proceda con el trabajo descrito.</p>';
      h += '<p class="en small">Under California Business & Professions Code §7159(g), any modification to a home-improvement contract must be in writing and signed by both parties <b>before the additional work begins</b>. <b>Verbal change orders are NOT enforceable in California.</b></p>';
      h += '</div>';

      h += '<h2>1. Referencia al contrato original <span class="en">Reference to Original Contract</span></h2>';
      h += '<table>';
      h += '<tr><td><b>Change Order #</b><br>'+_v(values,'co_num')+'</td><td><b>Fecha de la CO</b><br>'+_v(values,'co_date')+'</td></tr>';
      h += '<tr><td><b>Contrato original #</b><br>'+_v(values,'original_contract_num')+'</td><td><b>Fecha del contrato original</b><br>'+_v(values,'original_contract_date')+'</td></tr>';
      h += '<tr><td><b>Cliente</b><br>'+_v(values,'customer_name')+'</td><td><b>Proyecto</b><br>'+_v(values,'customer_address')+'</td></tr>';
      h += '</table>';

      h += '<h2>2. Razón del cambio <span class="en">Reason for Change</span></h2>';
      h += '<p>'+_v(values,'reason')+'</p>';

      h += '<h2>3. Descripción del cambio <span class="en">Description of Change</span></h2>';
      h += '<h3>Trabajo agregado / Work Added:</h3>';
      h += '<p>'+_v(values,'work_added','—')+'</p>';
      h += '<h3>Trabajo removido o sustituido / Work Removed or Substituted:</h3>';
      h += '<p>'+_v(values,'work_removed','—')+'</p>';

      h += '<h2>4. Impacto en costo <span class="en">Cost Impact</span></h2>';
      h += '<table>';
      h += '<tr><th>Concepto</th><th style="text-align:right;">Monto</th></tr>';
      h += '<tr><td>Materiales nuevos</td><td style="text-align:right;">'+_money(values,'new_materials')+'</td></tr>';
      h += '<tr><td>Mano de obra adicional ('+_v(values,'new_labor_hours')+' hrs)</td><td style="text-align:right;">'+_money(values,'new_labor_cost')+'</td></tr>';
      h += '<tr><th>Subtotal de esta Orden de Cambio</th><th style="text-align:right;">'+_money(values,'co_subtotal')+'</th></tr>';
      h += '<tr><td>Total del contrato original</td><td style="text-align:right;">'+_money(values,'original_total')+'</td></tr>';
      h += '<tr><th style="background:#dfd;">NUEVO TOTAL DEL CONTRATO</th><th style="background:#dfd;text-align:right;">'+_money(values,'new_contract_total')+'</th></tr>';
      h += '</table>';

      h += '<h2>5. Impacto en cronograma <span class="en">Schedule Impact</span></h2>';
      h += '<p><b>Días adicionales:</b> '+_v(values,'schedule_impact_days','0')+' &nbsp;|&nbsp; <b>Nueva fecha de terminación:</b> '+_v(values,'new_completion_date')+'</p>';

      h += '<div class="boxed no-break">';
      h += '<p class="small"><b>Acuerdo:</b> Al firmar abajo, el cliente autoriza al contratista a proceder con el trabajo descrito y acepta el nuevo total del contrato. Todos los demás términos, garantías y disposiciones del contrato original permanecen en pleno vigor.</p>';
      h += '<p class="en small"><b>Agreement:</b> By signing below, customer authorizes contractor to proceed with the described work and accepts the new contract total. All other terms, warranties, and provisions of the original contract remain in full force.</p>';
      h += '</div>';

      h += '<div class="no-break">';
      h += '<div class="sig-row">';
      h += '<div class="sig-block"><b>Cliente / Customer</b> (firma ANTES de iniciar el trabajo)<br>Firma: ____________________________<br>Nombre: '+_v(values,'customer_name')+'<br>Fecha: ____________________________</div>';
      h += '<div class="sig-block"><b>Contratista / Contractor</b><br>Firma: ____________________________<br>'+_v(values,'business_name')+'<br>CSLB #'+_v(values,'license_num')+'<br>Fecha: ____________________________</div>';
      h += '</div>';
      h += '</div>';

      h += '<div class="foot-legal">California B&P Code §7159(g) compliant Change Order · CSLB #'+_v(values,'license_num')+'.</div>';
      h += '</body></html>';
      return h;
    }
  };

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 4: WARRANTY CERTIFICATE
  // ══════════════════════════════════════════════════════════════
  var T_WARRANTY = {
    id: 'warranty-certificate',
    title: 'Certificado de Garantía de Instalación',
    icon: '🛡️',
    category: 'Garantía',
    description: 'Certificado formal de garantía para entregar al cliente al finalizar la instalación.',
    fields: [
      { id:'license_num', label:'Número de licencia CSLB', type:'text', required:true },
      { id:'business_name', label:'Nombre de la empresa', type:'text', required:true },
      { id:'business_address', label:'Dirección de la empresa', type:'text', required:true },
      { id:'business_phone', label:'Teléfono de la empresa', type:'text', required:true },
      { id:'business_email', label:'Email de la empresa', type:'text', required:false },
      { id:'cert_num', label:'Número de certificado', type:'text', placeholder:'W-2026-001', required:true },
      { id:'install_date', label:'Fecha de instalación', type:'date', required:true },
      { id:'customer_name', label:'Nombre del cliente', type:'text', required:true },
      { id:'customer_address', label:'Dirección de instalación', type:'text', required:true },
      { id:'equip_brand', label:'Marca del equipo', type:'text', placeholder:'Carrier', required:true },
      { id:'equip_model', label:'Modelo del equipo', type:'text', required:true },
      { id:'equip_serial', label:'Serial del equipo', type:'text', placeholder:'2326E12345', required:true },
      { id:'equip_seer2', label:'SEER2', type:'text', required:false },
      { id:'warranty_parts_years', label:'Garantía de partes (años — fabricante)', type:'text', placeholder:'10', required:true, defaultValue:'10' },
      { id:'warranty_compressor_years', label:'Garantía del compresor (años)', type:'text', placeholder:'10', required:true, defaultValue:'10' },
      { id:'warranty_labor_years', label:'Garantía de mano de obra (años — contratista)', type:'text', placeholder:'2', required:true, defaultValue:'2' },
      { id:'warranty_workmanship_years', label:'Garantía de ejecución (años)', type:'text', placeholder:'5', required:true, defaultValue:'5' },
      { id:'transferable', label:'Garantía transferible al nuevo dueño', type:'checkbox', defaultValue:true },
      { id:'registration_deadline', label:'Plazo para registrar equipo con fabricante (días)', type:'text', placeholder:'90', required:true, defaultValue:'90' }
    ],
    render: function(values) {
      var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificado de Garantía</title>' + _printStyles() + '</head><body>';
      h += _printButton();
      h += _header('CERTIFICADO DE GARANTÍA DE INSTALACIÓN', values);
      h += '<div style="text-align:center;font-style:italic;color:#555;font-size:10pt;margin-bottom:10pt;">Installation Warranty Certificate</div>';

      h += '<table>';
      h += '<tr><td><b>Certificado #</b><br>'+_v(values,'cert_num')+'</td><td><b>Fecha de instalación</b><br>'+_v(values,'install_date')+'</td></tr>';
      h += '<tr><td><b>Cliente</b><br>'+_v(values,'customer_name')+'</td><td><b>Dirección</b><br>'+_v(values,'customer_address')+'</td></tr>';
      h += '</table>';

      h += '<h2>Equipo instalado <span class="en">Installed Equipment</span></h2>';
      h += '<table>';
      h += '<tr><th>Marca</th><th>Modelo</th><th>Serial</th><th>SEER2</th></tr>';
      h += '<tr><td>'+_v(values,'equip_brand')+'</td><td>'+_v(values,'equip_model')+'</td><td>'+_v(values,'equip_serial')+'</td><td>'+_v(values,'equip_seer2','N/A')+'</td></tr>';
      h += '</table>';

      h += '<h2>Cobertura de garantía <span class="en">Warranty Coverage</span></h2>';
      h += '<table>';
      h += '<tr><th>Tipo</th><th>Duración</th><th>Proveedor</th></tr>';
      h += '<tr><td>Partes del equipo</td><td>'+_v(values,'warranty_parts_years','10')+' años</td><td>Fabricante (transferida)</td></tr>';
      h += '<tr><td>Compresor</td><td>'+_v(values,'warranty_compressor_years','10')+' años</td><td>Fabricante (transferida)</td></tr>';
      h += '<tr><td>Mano de obra</td><td>'+_v(values,'warranty_labor_years','2')+' años</td><td>'+_v(values,'business_name')+'</td></tr>';
      h += '<tr><td>Ejecución (workmanship)</td><td>'+_v(values,'warranty_workmanship_years','5')+' años</td><td>'+_v(values,'business_name')+'</td></tr>';
      h += '</table>';

      h += '<h2>Lo que cubre <span class="en">What is Covered</span></h2>';
      h += '<ul>';
      h += '<li><b>Garantía del fabricante (partes + compresor):</b> componentes defectuosos de fábrica. Sujeta a que el cliente registre el equipo con el fabricante dentro de '+_v(values,'registration_deadline','90')+' días de la instalación. Si el equipo no se registra a tiempo, la garantía del fabricante por lo general cae a 5 años base.</li>';
      h += '<li><b>Mano de obra:</b> cubre el trabajo de diagnóstico y reemplazo/reparación de componentes cubiertos bajo garantía del fabricante, sin cargo al cliente, durante el período indicado.</li>';
      h += '<li><b>Ejecución (workmanship):</b> cubre defectos de instalación — fugas de refrigerante de juntas hechas por nosotros, mala calibración inicial, ductería mal sellada, drenaje mal pendiente — por el período indicado.</li>';
      h += '</ul>';

      h += '<h2>Lo que NO cubre — Exclusiones <span class="en">Exclusions</span></h2>';
      h += '<ul>';
      h += '<li>Mal uso, abuso, o uso fuera de parámetros de diseño</li>';
      h += '<li>Falta de mantenimiento regular (filtros, limpieza, coils) — se recomiendan servicios de PM semianuales o anuales</li>';
      h += '<li>Daños por sobrecarga eléctrica, rayos, apagones repetidos (recomendamos surge protector dedicado)</li>';
      h += '<li>Daños por inundación, terremoto, incendio, acts of God, roedores, insectos</li>';
      h += '<li>Alteraciones, modificaciones o servicio realizado por terceros no autorizados por '+_v(values,'business_name')+'</li>';
      h += '<li>Componentes consumibles: filtros, baterías del termostato, UV lamps</li>';
      h += '<li>Daño cosmético que no afecta el funcionamiento</li>';
      h += '<li>Pérdida de ingresos, pérdida de uso, costos de hotel, daño a alimentos perecederos (daños consecuentes)</li>';
      h += '</ul>';

      // Transferability
      h += '<h2>Transferibilidad <span class="en">Transferability</span></h2>';
      if (values && values.transferable) {
        h += '<p>Esta garantía <b>ES transferible</b> al siguiente dueño de la propiedad si la casa se vende durante el período de garantía, sujeta a: (1) notificación por escrito a '+_v(values,'business_name')+' dentro de 30 días del cierre; (2) inspección de transferencia ($149 pagaderos por el vendedor o comprador); (3) el equipo no se ha alterado.</p>';
        h += '<p class="en small">This warranty <b>IS transferable</b> to a subsequent owner subject to 30-day written notice, $149 transfer inspection, and no unauthorized alterations.</p>';
      } else {
        h += '<p>Esta garantía <b>NO es transferible</b> y aplica únicamente al cliente original.</p>';
        h += '<p class="en small">This warranty is <b>NOT transferable</b> and applies only to the original customer.</p>';
      }

      h += '<h2>Cómo presentar un reclamo <span class="en">How to File a Claim</span></h2>';
      h += '<ol>';
      h += '<li>Llame a '+_v(values,'business_name')+' al '+_v(values,'business_phone')+' o envíe correo a '+_v(values,'business_email','email')+'. Tenga listo su número de certificado: '+_v(values,'cert_num')+'.</li>';
      h += '<li>Describa el problema; le pediremos hacer pruebas básicas (verificar termostato, breaker, filtro).</li>';
      h += '<li>Programaremos una visita de diagnóstico. Dentro de la garantía de mano de obra, esta visita es sin costo. Fuera del horario comercial estándar, tarifas after-hours pueden aplicar.</li>';
      h += '<li>Si el problema es cubierto por garantía, reparamos o reemplazamos sin costo al cliente. Si es un problema no cubierto, le damos cotización antes de cualquier trabajo.</li>';
      h += '<li>Plazo estándar de respuesta: 48 horas en días hábiles. Emergencias (unidad completamente inoperativa con temperaturas extremas): 4 horas.</li>';
      h += '</ol>';

      h += '<div class="no-break">';
      h += '<div class="sig-row">';
      h += '<div class="sig-block"><b>Cliente / Customer</b><br>Recibido por: ____________________________<br>Nombre: '+_v(values,'customer_name')+'<br>Fecha: ____________________________</div>';
      h += '<div class="sig-block"><b>Contratista / Contractor</b><br>Emitido por: ____________________________<br>'+_v(values,'business_name')+'<br>CSLB #'+_v(values,'license_num')+'<br>Fecha: ____________________________</div>';
      h += '</div>';
      h += '</div>';

      h += '<div class="foot-legal">Conserve este certificado junto con su contrato original. CSLB #'+_v(values,'license_num')+'.</div>';
      h += '</body></html>';
      return h;
    }
  };

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE 5: SALES PROPOSAL (Good-Better-Best)
  // ══════════════════════════════════════════════════════════════
  var T_PROPOSAL = {
    id: 'proposal',
    title: 'Propuesta de Venta / Estimado (3 opciones)',
    icon: '💼',
    category: 'Ventas',
    description: 'Estimado good-better-best con 3 niveles de equipo. Incluye financiamiento y válido 30 días. NO es un contrato.',
    fields: [
      { id:'license_num', label:'Número de licencia CSLB', type:'text', required:true },
      { id:'business_name', label:'Nombre de la empresa', type:'text', required:true },
      { id:'business_address', label:'Dirección de la empresa', type:'text', required:true },
      { id:'business_phone', label:'Teléfono de la empresa', type:'text', required:true },
      { id:'business_email', label:'Email de la empresa', type:'text', required:false },
      { id:'proposal_num', label:'Número de propuesta', type:'text', placeholder:'P-2026-001', required:true },
      { id:'proposal_date', label:'Fecha de la propuesta', type:'date', required:true },
      { id:'customer_name', label:'Nombre del cliente', type:'text', required:true },
      { id:'customer_address', label:'Dirección del proyecto', type:'text', required:true },
      { id:'customer_phone', label:'Teléfono del cliente', type:'text', required:true },
      { id:'scope_summary', label:'Resumen del alcance', type:'textarea', placeholder:'Reemplazo completo de sistema AC 3-ton con calefacción por gas 80% AFUE en residencia de 1 planta, 1,450 sq ft.', required:true },

      { id:'good_brand', label:'GOOD — Marca/Modelo', type:'text', placeholder:'Goodman GSXC160361 + GMVC96', required:true },
      { id:'good_seer2', label:'GOOD — SEER2', type:'text', placeholder:'14.3', required:true },
      { id:'good_rebate', label:'GOOD — Rebate/Incentivo', type:'money', placeholder:'250', required:false, defaultValue:'0' },
      { id:'good_price', label:'GOOD — Precio instalado', type:'money', placeholder:'7450', required:true },

      { id:'better_brand', label:'BETTER — Marca/Modelo', type:'text', placeholder:'Carrier 24ACB7 + 59TN6', required:true },
      { id:'better_seer2', label:'BETTER — SEER2', type:'text', placeholder:'16.5', required:true },
      { id:'better_rebate', label:'BETTER — Rebate/Incentivo', type:'money', placeholder:'750', required:false, defaultValue:'0' },
      { id:'better_price', label:'BETTER — Precio instalado', type:'money', placeholder:'9850', required:true },

      { id:'best_brand', label:'BEST — Marca/Modelo', type:'text', placeholder:'Lennox XC25 + SLP99V variable', required:true },
      { id:'best_seer2', label:'BEST — SEER2', type:'text', placeholder:'26.0', required:true },
      { id:'best_rebate', label:'BEST — Rebate/Incentivo', type:'money', placeholder:'1500', required:false, defaultValue:'0' },
      { id:'best_price', label:'BEST — Precio instalado', type:'money', placeholder:'14500', required:true },

      { id:'fin_6mo_apr', label:'Financiamiento 6 meses — APR %', type:'text', placeholder:'0', required:false, defaultValue:'0' },
      { id:'fin_12mo_apr', label:'Financiamiento 12 meses — APR %', type:'text', placeholder:'0', required:false, defaultValue:'0' },
      { id:'fin_60mo_apr', label:'Financiamiento 60 meses — APR %', type:'text', placeholder:'7.99', required:false, defaultValue:'7.99' },
      { id:'fin_120mo_apr', label:'Financiamiento 120 meses — APR %', type:'text', placeholder:'9.99', required:false, defaultValue:'9.99' }
    ],
    render: function(values) {
      var h = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Propuesta de Venta HVAC</title>' + _printStyles() + '</head><body>';
      h += _printButton();
      h += _header('PROPUESTA DE VENTA HVAC', values);
      h += '<div style="text-align:center;font-style:italic;color:#555;font-size:10pt;margin-bottom:10pt;">HVAC Sales Proposal · Good / Better / Best</div>';

      h += '<table>';
      h += '<tr><td><b>Propuesta #</b><br>'+_v(values,'proposal_num')+'</td><td><b>Fecha</b><br>'+_v(values,'proposal_date')+'</td></tr>';
      h += '<tr><td><b>Cliente</b><br>'+_v(values,'customer_name')+'</td><td><b>Tel</b><br>'+_v(values,'customer_phone')+'</td></tr>';
      h += '<tr><td colspan="2"><b>Dirección del proyecto</b><br>'+_v(values,'customer_address')+'</td></tr>';
      h += '</table>';

      h += '<h2>Alcance propuesto <span class="en">Proposed Scope</span></h2>';
      h += '<p>'+_v(values,'scope_summary')+'</p>';

      h += '<h2>3 Opciones de equipo <span class="en">Good / Better / Best</span></h2>';

      function tier(label, badge, border, values, kb) {
        var rebate = _vRaw(values, kb+'_rebate', '0');
        var rebateDisplay = (rebate && parseFloat(rebate) > 0) ? _money(values, kb+'_rebate', '0') : '—';
        var netPrice = _vRaw(values, kb+'_price', '');
        var netN = parseFloat(String(netPrice).replace(/[^0-9.\-]/g, ''));
        var rN = parseFloat(String(rebate).replace(/[^0-9.\-]/g, ''));
        var netAfter = (isNaN(netN) ? '—' : '$' + (netN - (isNaN(rN) ? 0 : rN)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
        var s = '<div class="tier'+(border||'')+'">';
        s += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        s += '<div><b style="font-size:13pt;">'+label+'</b> &nbsp; <span style="font-size:10pt;color:#555;">'+badge+'</span></div>';
        s += '<div style="font-size:14pt;font-weight:bold;">'+_money(values,kb+'_price')+'</div>';
        s += '</div>';
        s += '<div style="margin-top:4pt;font-size:10.5pt;"><b>Equipo:</b> '+_v(values,kb+'_brand')+' &nbsp;·&nbsp; <b>SEER2:</b> '+_v(values,kb+'_seer2')+'</div>';
        s += '<div style="margin-top:3pt;font-size:10pt;"><b>Rebate/Incentivo:</b> '+rebateDisplay+' &nbsp;·&nbsp; <b>Precio neto después de rebate:</b> '+netAfter+'</div>';
        s += '</div>';
        return s;
      }

      h += tier('GOOD', 'Entrada — eficiencia básica que cumple código', '', values, 'good');
      h += tier('BETTER', 'Recomendado — mejor eficiencia + rebates', ' tier-best', values, 'better');
      h += tier('BEST', 'Premium — variable speed, máxima eficiencia, rebates máximos', '', values, 'best');

      h += '<h2>Opciones de financiamiento <span class="en">Financing Options</span></h2>';
      h += '<table>';
      h += '<tr><th>Plazo</th><th>APR</th><th>Notas</th></tr>';
      h += '<tr><td>6 meses</td><td>'+_v(values,'fin_6mo_apr','0')+'%</td><td>Pago mínimo. Sin interés si se paga en 6 meses.</td></tr>';
      h += '<tr><td>12 meses</td><td>'+_v(values,'fin_12mo_apr','0')+'%</td><td>Sin interés con crédito aprobado.</td></tr>';
      h += '<tr><td>60 meses</td><td>'+_v(values,'fin_60mo_apr','7.99')+'%</td><td>Pago fijo mensual.</td></tr>';
      h += '<tr><td>120 meses</td><td>'+_v(values,'fin_120mo_apr','9.99')+'%</td><td>Pago mínimo mensual — mayor plazo, más interés total.</td></tr>';
      h += '</table>';
      h += '<p class="small">Financiamiento a través de socios aprobados (Synchrony, Service Finance, Wells Fargo, GreenSky). Sujeto a aprobación de crédito. APR real depende del perfil crediticio. Los pagos mínimos mensuales varían por opción.</p>';

      h += '<h2>Validez y próximos pasos <span class="en">Validity & Next Steps</span></h2>';
      h += '<p>Esta propuesta es válida por <b>30 días</b> a partir de la fecha indicada arriba. Los precios pueden cambiar después de ese período debido a fluctuaciones en costos de equipo y refrigerante.</p>';
      h += '<p class="en small">This proposal is valid for 30 days from the date above. Pricing may change thereafter due to equipment and refrigerant cost fluctuations.</p>';

      h += '<div class="warning no-break">';
      h += '<div class="warning-title">Esto NO es un contrato / This is NOT a contract</div>';
      h += '<p class="small">Este documento es una cotización/propuesta únicamente. Al firmar abajo, el cliente autoriza a '+_v(values,'business_name')+' a preparar un contrato formal basado en la opción seleccionada y a proceder con la orden de equipo. El contrato formal incluirá los avisos requeridos por §7159, el Mechanics Lien Warning, y el Notice of Right to Cancel, y debe ser firmado por separado antes de que comience cualquier trabajo en la propiedad.</p>';
      h += '<p class="en small">This document is a quote/proposal only. By signing below, customer authorizes '+_v(values,'business_name')+' to prepare a formal contract based on the selected option. The formal contract — including §7159 notices, Mechanics Lien Warning, and 3-day Notice of Cancellation — must be signed separately before any work begins.</p>';
      h += '</div>';

      h += '<div class="no-break">';
      h += '<h3>Selección del cliente:</h3>';
      h += '<p>';
      h += '□ GOOD &nbsp;&nbsp; □ BETTER &nbsp;&nbsp; □ BEST &nbsp;&nbsp; Plazo financiamiento: □ 0-6mo &nbsp;□ 12mo &nbsp;□ 60mo &nbsp;□ 120mo &nbsp;□ Efectivo';
      h += '</p>';
      h += '<div class="sig-row">';
      h += '<div class="sig-block"><b>Cliente — Autorizo proceder con contrato</b><br>Firma: ____________________________<br>Nombre: '+_v(values,'customer_name')+'<br>Fecha: ____________________________</div>';
      h += '<div class="sig-block"><b>Representante de '+_v(values,'business_name')+'</b><br>Firma: ____________________________<br>Nombre: ____________________________<br>Fecha: ____________________________</div>';
      h += '</div>';
      h += '</div>';

      h += '<div class="foot-legal">Propuesta #'+_v(values,'proposal_num')+' · Válida 30 días · CSLB #'+_v(values,'license_num')+'. Este documento NO es un contrato.</div>';
      h += '</body></html>';
      return h;
    }
  };

  // ── Export ──────────────────────────────────────────────────
  window.CONTRACTOR_TEMPLATES = [
    T_RESIDENTIAL,
    T_COMMERCIAL,
    T_CHANGE_ORDER,
    T_WARRANTY,
    T_PROPOSAL
  ];

})();
