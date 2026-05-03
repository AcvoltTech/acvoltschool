// ============================================
// 🔥 PIPELINE DE VENTAS & 👔 VENDEDORES — JS
// ============================================

// --- HTML escape helper (XSS prevention) ---
function _escHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Admin auth gate ---
function isAdminAuthenticated() {
  // Check that the global admin session exists (set by admin login flow)
  if (typeof window !== 'undefined' && window._adminSession && window._adminSession.email) {
    return true;
  }
  // Also check the supabase auth session
  if (typeof supabaseClient !== 'undefined' && supabaseClient.auth) {
    // Synchronous check — the session is cached by the auth manager
    try {
      var session = supabaseClient.auth._session;
      if (session && session.user && session.user.email) return true;
    } catch(_) {}
  }
  return false;
}

// --- Source icons/colors ---
var sourceIcons = {instagram:'📸',facebook:'📘',tiktok:'🎵',youtube:'▶️',whatsapp:'💬',referido:'🤝',otro:'📌'};
var stageColors = {contacto:'#3b82f6',interesado:'#f59e0b',inscrito:'#a855f7',pagado:'#22c55e',perdido:'#ef4444'};
var planValues = {'App Mensual $20':20,'App Anual $240':240,'Principiante $119':119,'Intermedio $299':299,'Mentoría $699':699};

// --- Cache ---
var pipelineLeads = [];
var salesReps = [];

// --- Auto-fill value from plan ---
function updateLeadValue() {
  var plan = document.getElementById('leadPlan').value;
  if (planValues[plan]) document.getElementById('leadValue').value = planValues[plan];
}

// --- Load Reps for Dropdown ---
async function loadRepsForDropdown() {
  try {
    var { data, error } = await supabaseClient.from('sales_reps').select('id,name').eq('status','active').order('name');
    if (error) throw error;
    salesReps = data || [];
    // Fill both dropdowns
    ['leadRep','pipelineFilterRep'].forEach(function(selId) {
      var sel = document.getElementById(selId);
      if (!sel) return;
      var val = sel.value;
      var opts = selId === 'pipelineFilterRep' ? '<option value="">Todos los vendedores</option>' : '<option value="">Sin asignar</option>';
      (data || []).forEach(function(r) { opts += '<option value="'+_escHtml(r.id)+'">'+_escHtml(r.name)+'</option>'; });
      sel.innerHTML = opts;
      sel.value = val;
    });
  } catch(e) { console.error('[Pipeline] Error loading reps:', e); }
}

// --- Active source filter ---
var activeSourceFilter = '';

// --- Filter by source icon ---
function filterBySource(source) {
  activeSourceFilter = source;
  var sourceColors = {instagram:'#E4405F',facebook:'#1877F2',tiktok:'#000000',youtube:'#FF0000',whatsapp:'#25D366',referido:'#8b5cf6',otro:'#64748b'};
  // Reset all buttons
  document.querySelectorAll('.source-filter-btn').forEach(function(btn) {
    btn.classList.remove('source-active');
    btn.style.background = 'transparent';
    btn.style.boxShadow = 'none';
    var label = btn.querySelectorAll('span')[1];
    if (label) label.style.color = 'var(--crm-text-muted,#8993a4)';
    if (btn.dataset.source === '') {
      btn.style.color = 'var(--crm-text,#1a1d21)';
    }
  });
  // Highlight active
  var activeBtn;
  if (!source) {
    activeBtn = document.querySelector('.source-filter-btn[data-source=""]');
    if (activeBtn) {
      activeBtn.classList.add('source-active');
      activeBtn.style.background = 'var(--crm-accent,#16803c)';
      activeBtn.style.color = 'white';
      var label = activeBtn.querySelectorAll('span')[1];
      if (label) label.style.color = 'white';
    }
  } else {
    activeBtn = document.querySelector('.source-filter-btn[data-source="'+source+'"]');
    if (activeBtn) {
      activeBtn.classList.add('source-active');
      activeBtn.style.background = (sourceColors[source] || 'var(--crm-accent)');
      activeBtn.style.boxShadow = '0 2px 8px ' + (sourceColors[source] || '#16803c') + '40';
      var label = activeBtn.querySelectorAll('span')[1];
      if (label) label.style.color = 'white';
    }
  }
  loadPipelineLeads();
}

// --- Update source badges with counts ---
function updateSourceBadges(leads) {
  var counts = {};
  leads.forEach(function(l) { counts[l.source] = (counts[l.source]||0) + 1; });
  document.querySelectorAll('.source-filter-btn').forEach(function(btn) {
    var src = btn.dataset.source;
    // Remove existing badges
    var existing = btn.querySelector('.source-badge');
    if (existing) existing.remove();
    if (src && counts[src]) {
      var badge = document.createElement('span');
      badge.className = 'source-badge';
      badge.textContent = counts[src];
      btn.appendChild(badge);
    }
  });
}

// --- Load Pipeline Leads ---
async function loadPipelineLeads() {
  try {
    var filterSource = activeSourceFilter;
    var filterRep = document.getElementById('pipelineFilterRep')?.value || '';
    var query = supabaseClient.from('sales_leads').select('*,sales_reps(name)').order('created_at',{ascending:false});
    if (filterSource) query = query.eq('source', filterSource);
    if (filterRep) query = query.eq('assigned_rep', filterRep);
    var { data, error } = await query;
    if (error) throw error;
    pipelineLeads = data || [];
    renderKanban(pipelineLeads);
    updatePipelineStats(pipelineLeads);
    // Also load ALL leads (unfiltered) for badge counts
    if (filterSource || filterRep) {
      var { data: allData } = await supabaseClient.from('sales_leads').select('source');
      updateSourceBadges(allData || []);
    } else {
      updateSourceBadges(pipelineLeads);
    }
  } catch(e) {
    console.error('[Pipeline] Error loading leads:', e);
    document.getElementById('pipelineSubtitle').textContent = '⚠️ Error cargando leads';
  }
}

// --- Render Kanban Board ---
function renderKanban(leads) {
  var stages = ['contacto','interesado','inscrito','pagado','perdido'];
  stages.forEach(function(stage) {
    var container = document.getElementById('kanbanCards-' + stage);
    var countEl = document.getElementById('kanbanCount-' + stage);
    if (!container) return;
    var stageLeads = leads.filter(function(l) { return l.stage === stage; });
    if (countEl) countEl.textContent = stageLeads.length;
    if (stageLeads.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#475569;font-size:11px;padding:20px;">Sin leads</div>';
      return;
    }
    container.innerHTML = stageLeads.map(function(lead) {
      var srcIcon = sourceIcons[lead.source] || '📌';
      var repName = lead.sales_reps ? _escHtml(lead.sales_reps.name) : '';
      var followUp = '';
      if (lead.follow_up_date) {
        var fDate = new Date(lead.follow_up_date);
        var today = new Date(); today.setHours(0,0,0,0);
        var isOverdue = fDate < today;
        followUp = '<div class="kanban-card-followup" style="color:'+(isOverdue?'#ef4444':'#f59e0b')+'">📅 '+ fDate.toLocaleDateString('es-MX',{month:'short',day:'numeric'}) + (isOverdue?' ⚠️ Vencido':'') +'</div>';
      }
      return '<div class="kanban-card" draggable="true" ondragstart="kanbanDragStart(event)" data-lead-id="'+_escHtml(lead.id)+'">' +
        '<div class="kanban-card-actions">' +
          '<button class="kanban-card-btn" onclick="editLead(\''+_escHtml(lead.id)+'\')" title="Editar">✏️</button>' +
          '<button class="kanban-card-btn" onclick="deleteLead(\''+_escHtml(lead.id)+'\')" title="Eliminar">🗑️</button>' +
        '</div>' +
        '<div class="kanban-card-name">'+_escHtml(lead.name)+'</div>' +
        '<div class="kanban-card-meta">' +
          '<span class="kanban-card-source">'+srcIcon+' '+_escHtml(lead.source)+'</span>' +
          (lead.phone ? '<span>📱 '+_escHtml(lead.phone)+'</span>' : '') +
        '</div>' +
        (lead.plan_interest ? '<div style="font-size:11px;color:var(--crm-text-muted,#8993a4);margin-top:4px;">📋 '+_escHtml(lead.plan_interest)+'</div>' : '') +
        (lead.estimated_value > 0 ? '<div class="kanban-card-value">$'+Number(lead.estimated_value).toLocaleString()+'</div>' : '') +
        (repName ? '<div style="font-size:10px;color:#7c3aed;margin-top:4px;">👤 '+repName+'</div>' : '') +
        followUp +
      '</div>';
    }).join('');
  });
  var total = leads.length;
  document.getElementById('pipelineSubtitle').textContent = total + ' lead' + (total !== 1 ? 's' : '') + ' en el pipeline';
}

// --- Pipeline Stats ---
function updatePipelineStats(leads) {
  var total = leads.length;
  var totalValue = leads.reduce(function(s,l){ return s + (Number(l.estimated_value)||0); }, 0);
  var paid = leads.filter(function(l){ return l.stage === 'pagado'; });
  var paidCount = paid.length;
  var convRate = total > 0 ? Math.round((paidCount / total) * 100) : 0;
  // Paid this month
  var now = new Date();
  var paidThisMonth = paid.filter(function(l) {
    if (!l.closed_date) return false;
    var d = new Date(l.closed_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  document.getElementById('pipeStatTotal').textContent = total;
  document.getElementById('pipeStatValue').textContent = '$' + totalValue.toLocaleString();
  document.getElementById('pipeStatConversion').textContent = convRate + '%';
  document.getElementById('pipeStatPaid').textContent = paidThisMonth;
}

// --- Drag & Drop ---
function kanbanDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.leadId);
  e.target.classList.add('dragging');
}
function kanbanDragOver(e) { e.preventDefault(); }
function kanbanDragEnter(e) {
  e.preventDefault();
  var col = e.target.closest('.kanban-col');
  if (col) col.classList.add('drag-over');
}
function kanbanDragLeave(e) {
  var col = e.target.closest('.kanban-col');
  if (col && !col.contains(e.relatedTarget)) col.classList.remove('drag-over');
}
async function kanbanDrop(e) {
  e.preventDefault();
  var col = e.target.closest('.kanban-col');
  if (col) col.classList.remove('drag-over');
  var leadId = e.dataTransfer.getData('text/plain');
  var newStage = col ? col.dataset.stage : null;
  if (!leadId || !newStage) return;
  // Remove dragging class
  document.querySelectorAll('.kanban-card.dragging').forEach(function(c){ c.classList.remove('dragging'); });
  try {
    var updateData = { stage: newStage };
    if (newStage === 'pagado') updateData.closed_date = new Date().toISOString();
    if (newStage !== 'pagado') updateData.closed_date = null;
    var { error } = await supabaseClient.from('sales_leads').update(updateData).eq('id', leadId);
    if (error) throw error;
    await loadPipelineLeads();
    console.log('[Pipeline] Lead moved to', newStage);
  } catch(e) { console.error('[Pipeline] Drag error:', e); alert('Error al mover lead: ' + e.message); }
}

// --- New Lead Modal ---
function openNewLeadModal() {
  document.getElementById('leadModalTitle').textContent = '➕ Nuevo Lead';
  document.getElementById('leadSaveBtn').textContent = '💾 Guardar Lead';
  document.getElementById('leadEditId').value = '';
  document.getElementById('leadName').value = '';
  document.getElementById('leadPhone').value = '';
  document.getElementById('leadEmail').value = '';
  document.getElementById('leadCity').value = '';
  document.getElementById('leadState').value = '';
  document.getElementById('leadSource').value = 'instagram';
  document.getElementById('leadStage').value = 'contacto';
  document.getElementById('leadPlan').value = '';
  document.getElementById('leadValue').value = '';
  document.getElementById('leadRep').value = '';
  document.getElementById('leadFollowUp').value = '';
  document.getElementById('leadNotes').value = '';
  document.getElementById('newLeadModal').style.display = 'flex';
}
function closeLeadModal() { document.getElementById('newLeadModal').style.display = 'none'; }

// --- Edit Lead ---
function editLead(id) {
  var lead = pipelineLeads.find(function(l){ return l.id === id; });
  if (!lead) return;
  document.getElementById('leadModalTitle').textContent = '✏️ Editar Lead';
  document.getElementById('leadSaveBtn').textContent = '💾 Actualizar Lead';
  document.getElementById('leadEditId').value = lead.id;
  document.getElementById('leadName').value = lead.name || '';
  document.getElementById('leadPhone').value = lead.phone || '';
  document.getElementById('leadEmail').value = lead.email || '';
  document.getElementById('leadCity').value = lead.city || '';
  document.getElementById('leadState').value = lead.state || '';
  document.getElementById('leadSource').value = lead.source || 'otro';
  document.getElementById('leadStage').value = lead.stage || 'contacto';
  document.getElementById('leadPlan').value = lead.plan_interest || '';
  document.getElementById('leadValue').value = lead.estimated_value || '';
  document.getElementById('leadRep').value = lead.assigned_rep || '';
  document.getElementById('leadFollowUp').value = lead.follow_up_date ? lead.follow_up_date.substring(0,10) : '';
  document.getElementById('leadNotes').value = lead.notes || '';
  document.getElementById('newLeadModal').style.display = 'flex';
}

// --- Save Lead ---
async function saveLead() {
  var name = document.getElementById('leadName').value.trim();
  if (!name) { alert('El nombre es requerido'); return; }
  var editId = document.getElementById('leadEditId').value;
  var leadData = {
    name: name,
    phone: document.getElementById('leadPhone').value.trim() || null,
    email: document.getElementById('leadEmail').value.trim() || null,
    city: document.getElementById('leadCity').value.trim() || null,
    state: document.getElementById('leadState').value.trim() || null,
    source: document.getElementById('leadSource').value,
    stage: document.getElementById('leadStage').value,
    plan_interest: document.getElementById('leadPlan').value || null,
    estimated_value: parseFloat(document.getElementById('leadValue').value) || 0,
    assigned_rep: document.getElementById('leadRep').value || null,
    follow_up_date: document.getElementById('leadFollowUp').value || null,
    notes: document.getElementById('leadNotes').value.trim() || null
  };
  if (leadData.stage === 'pagado' && !leadData.closed_date) leadData.closed_date = new Date().toISOString();
  var btn = document.getElementById('leadSaveBtn');
  btn.disabled = true; btn.textContent = '⏳ Guardando...';
  try {
    var result;
    if (editId) {
      result = await supabaseClient.from('sales_leads').update(leadData).eq('id', editId);
    } else {
      result = await supabaseClient.from('sales_leads').insert([leadData]);
    }
    if (result.error) throw result.error;
    closeLeadModal();
    await loadPipelineLeads();
    console.log('[Pipeline] Lead saved ✅');
  } catch(e) {
    console.error('[Pipeline] Save error:', e);
    alert('Error: ' + e.message);
  }
  btn.disabled = false; btn.textContent = editId ? '💾 Actualizar Lead' : '💾 Guardar Lead';
}

// --- Delete Lead ---
async function deleteLead(id) {
  if (!confirm('¿Eliminar este lead del pipeline?')) return;
  try {
    var { error } = await supabaseClient.from('sales_leads').delete().eq('id', id);
    if (error) throw error;
    await loadPipelineLeads();
  } catch(e) { alert('Error: ' + e.message); }
}

// ============================================
// 👔 VENDEDORES FUNCTIONS
// ============================================

async function loadVendedores() {
  try {
    var { data: reps, error } = await supabaseClient.from('sales_reps').select('*').order('name');
    if (error) throw error;
    // Get lead counts per rep
    var { data: leads } = await supabaseClient.from('sales_leads').select('assigned_rep,stage,estimated_value');
    leads = leads || [];
    var repStats = {};
    (reps || []).forEach(function(r) { repStats[r.id] = { total: 0, paid: 0, value: 0 }; });
    leads.forEach(function(l) {
      if (l.assigned_rep && repStats[l.assigned_rep]) {
        repStats[l.assigned_rep].total++;
        if (l.stage === 'pagado') {
          repStats[l.assigned_rep].paid++;
          repStats[l.assigned_rep].value += Number(l.estimated_value) || 0;
        }
      }
    });
    renderVendedoresTable(reps || [], repStats);
    updateRepStats(reps || [], repStats, leads);
  } catch(e) {
    console.error('[Vendedores] Error:', e);
    document.getElementById('vendedoresSubtitle').textContent = '⚠️ Error cargando vendedores';
  }
}

function renderVendedoresTable(reps, stats) {
  var tbody = document.getElementById('vendedoresTableBody');
  if (!tbody) return;
  document.getElementById('vendedoresSubtitle').textContent = reps.length + ' vendedor' + (reps.length !== 1 ? 'es' : '') + ' registrados';
  if (reps.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="padding:40px;text-align:center;color:var(--crm-text-muted,#8993a4);font-size:13px;">No hay vendedores registrados. Haz clic en "+ Nuevo Vendedor" para agregar uno.</td></tr>';
    return;
  }
  tbody.innerHTML = reps.map(function(r) {
    var s = stats[r.id] || { total:0, paid:0, value:0 };
    var commission = s.value * ((r.commission_pct || 0) / 100);
    var goalPct = r.monthly_goal > 0 ? Math.round((s.value / r.monthly_goal) * 100) : 0;
    var goalColor = goalPct >= 100 ? '#22c55e' : goalPct >= 50 ? '#f59e0b' : '#ef4444';
    return '<tr style="border-bottom:1px solid var(--crm-border,#e3e7ee);">' +
      '<td style="padding:12px 14px;"><div style="font-weight:600;color:var(--crm-text,#1a1d21);">'+_escHtml(r.name)+'</div><div style="font-size:11px;color:var(--crm-text-muted,#8993a4);">'+_escHtml(r.email||'')+'</div></td>' +
      '<td style="padding:12px 14px;text-align:center;color:var(--crm-text-light,#4b5563);">'+s.total+'</td>' +
      '<td style="padding:12px 14px;text-align:center;color:#16803c;font-weight:600;">'+s.paid+'</td>' +
      '<td style="padding:12px 14px;text-align:center;color:var(--crm-text,#1a1d21);">'+_escHtml(r.commission_pct)+'%</td>' +
      '<td style="padding:12px 14px;text-align:right;color:#16803c;font-weight:600;">$'+commission.toLocaleString()+'</td>' +
      '<td style="padding:12px 14px;text-align:right;">' +
        '<div style="font-size:12px;color:var(--crm-text,#1a1d21);">$'+Number(r.monthly_goal||0).toLocaleString()+'</div>' +
        '<div style="background:var(--crm-border,#e3e7ee);border-radius:4px;height:4px;margin-top:4px;overflow:hidden;"><div style="background:'+goalColor+';height:100%;width:'+Math.min(goalPct,100)+'%;border-radius:4px;"></div></div>' +
        '<div style="font-size:10px;color:'+goalColor+';margin-top:2px;">'+goalPct+'%</div>' +
      '</td>' +
      '<td style="padding:12px 14px;text-align:center;">' +
        '<span style="padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;background:'+(r.status==='active'?'rgba(22,128,60,0.1)':'rgba(220,38,38,0.1)')+';color:'+(r.status==='active'?'#16803c':'#dc2626')+';">'+(r.status==='active'?'Activo':'Inactivo')+'</span>' +
      '</td>' +
      '<td style="padding:12px 14px;text-align:center;">' +
        '<button onclick="editRep(\''+_escHtml(r.id)+'\')" style="background:none;border:none;cursor:pointer;font-size:14px;margin-right:4px;" title="Editar">✏️</button>' +
        '<button onclick="toggleRepStatus(\''+_escHtml(r.id)+'\',\''+(r.status==='active'?'inactive':'active')+'\')" style="background:none;border:none;cursor:pointer;font-size:14px;" title="'+(r.status==='active'?'Desactivar':'Activar')+'">'+(r.status==='active'?'🔴':'🟢')+'</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function updateRepStats(reps, stats, allLeads) {
  var activeCount = reps.filter(function(r){ return r.status === 'active'; }).length;
  var totalAssigned = allLeads.filter(function(l){ return l.assigned_rep; }).length;
  var totalCommissions = 0;
  var totalGoal = 0;
  reps.forEach(function(r) {
    var s = stats[r.id] || {value:0};
    totalCommissions += s.value * ((r.commission_pct||0)/100);
    totalGoal += Number(r.monthly_goal) || 0;
  });
  document.getElementById('repStatActive').textContent = activeCount;
  document.getElementById('repStatLeads').textContent = totalAssigned;
  document.getElementById('repStatCommissions').textContent = '$' + Math.round(totalCommissions).toLocaleString();
  document.getElementById('repStatGoal').textContent = '$' + totalGoal.toLocaleString();
}

// --- New Rep Modal ---
function openNewRepModal() {
  document.getElementById('repModalTitle').textContent = '➕ Nuevo Vendedor';
  document.getElementById('repSaveBtn').textContent = '💾 Guardar Vendedor';
  document.getElementById('repEditId').value = '';
  document.getElementById('repName').value = '';
  document.getElementById('repEmail').value = '';
  document.getElementById('repPhone').value = '';
  document.getElementById('repGoal').value = '5000';
  document.getElementById('repCommission').value = '10';
  document.getElementById('newRepModal').style.display = 'flex';
}
function closeRepModal() { document.getElementById('newRepModal').style.display = 'none'; }

// --- Edit Rep ---
function editRep(id) {
  var rep = null;
  // Need to fetch from supabase
  supabaseClient.from('sales_reps').select('*').eq('id', id).single().then(function(res) {
    if (res.error || !res.data) { alert('Error cargando vendedor'); return; }
    rep = res.data;
    document.getElementById('repModalTitle').textContent = '✏️ Editar Vendedor';
    document.getElementById('repSaveBtn').textContent = '💾 Actualizar Vendedor';
    document.getElementById('repEditId').value = rep.id;
    document.getElementById('repName').value = rep.name || '';
    document.getElementById('repEmail').value = rep.email || '';
    document.getElementById('repPhone').value = rep.phone || '';
    document.getElementById('repGoal').value = rep.monthly_goal || 0;
    document.getElementById('repCommission').value = rep.commission_pct || 10;
    document.getElementById('newRepModal').style.display = 'flex';
  });
}

// --- Save Rep ---
async function saveRep() {
  var name = document.getElementById('repName').value.trim();
  if (!name) { alert('El nombre es requerido'); return; }
  var editId = document.getElementById('repEditId').value;
  var repData = {
    name: name,
    email: document.getElementById('repEmail').value.trim() || null,
    phone: document.getElementById('repPhone').value.trim() || null,
    monthly_goal: parseFloat(document.getElementById('repGoal').value) || 0,
    commission_pct: parseFloat(document.getElementById('repCommission').value) || 10
  };
  var btn = document.getElementById('repSaveBtn');
  btn.disabled = true; btn.textContent = '⏳ Guardando...';
  try {
    var result;
    if (editId) {
      result = await supabaseClient.from('sales_reps').update(repData).eq('id', editId);
    } else {
      result = await supabaseClient.from('sales_reps').insert([repData]);
    }
    if (result.error) throw result.error;
    closeRepModal();
    await loadVendedores();
    await loadRepsForDropdown();
    console.log('[Vendedores] Rep saved ✅');
  } catch(e) {
    console.error('[Vendedores] Save error:', e);
    alert('Error: ' + e.message);
  }
  btn.disabled = false; btn.textContent = editId ? '💾 Actualizar Vendedor' : '💾 Guardar Vendedor';
}

// --- Toggle Rep Status ---
async function toggleRepStatus(id, newStatus) {
  try {
    var { error } = await supabaseClient.from('sales_reps').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
    await loadVendedores();
  } catch(e) { alert('Error: ' + e.message); }
}
