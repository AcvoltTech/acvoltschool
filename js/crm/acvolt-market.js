// ===== ACVOLT MARKET — Admin CRUD =====
if (typeof _addTranslations === 'function') _addTranslations({
  mkt_op_error:        { es: 'Error en operación', en: 'Operation error' },
  mkt_no_products:     { es: 'No hay productos. Haz clic en "+ Agregar Producto" para comenzar.', en: 'No products. Click "+ Add Product" to get started.' },
  mkt_active:          { es: 'Activo', en: 'Active' },
  mkt_inactive:        { es: 'Inactivo', en: 'Inactive' },
  mkt_no_name:         { es: 'Sin nombre', en: 'No name' },
  mkt_edit:            { es: 'Editar', en: 'Edit' },
  mkt_deactivate:      { es: 'Desactivar', en: 'Deactivate' },
  mkt_activate:        { es: 'Activar', en: 'Activate' },
  mkt_delete:          { es: 'Eliminar', en: 'Delete' },
  mkt_load_error:      { es: 'Error cargando productos: ', en: 'Error loading products: ' },
  mkt_edit_product:    { es: 'Editar Producto', en: 'Edit Product' },
  mkt_add_product:     { es: 'Agregar Producto', en: 'Add Product' },
  mkt_name_label:      { es: 'Nombre del producto *', en: 'Product name *' },
  mkt_name_ph:         { es: 'Ej: Manifold Digital 4 Vías', en: 'e.g. Digital 4-Way Manifold' },
  mkt_desc_label:      { es: 'Descripción', en: 'Description' },
  mkt_desc_ph:         { es: 'Describe el producto...', en: 'Describe the product...' },
  mkt_price_label:     { es: 'Precio (USD) *', en: 'Price (USD) *' },
  mkt_cat_label:       { es: 'Categoría *', en: 'Category *' },
  mkt_cat_tools:       { es: 'Herramientas', en: 'Tools' },
  mkt_cat_equipment:   { es: 'Equipos', en: 'Equipment' },
  mkt_cat_clothing:    { es: 'Ropa', en: 'Clothing' },
  mkt_cat_accessories: { es: 'Accesorios', en: 'Accessories' },
  mkt_cat_general:     { es: 'General', en: 'General' },
  mkt_img_label:       { es: 'Imagen del producto', en: 'Product image' },
  mkt_img_click:       { es: 'Haz clic para seleccionar imagen', en: 'Click to select image' },
  mkt_link_label:      { es: 'Enlace externo (opcional)', en: 'External link (optional)' },
  mkt_save_changes:    { es: 'Guardar Cambios', en: 'Save Changes' },
  mkt_cancel:          { es: 'Cancelar', en: 'Cancel' },
  mkt_img_too_large:   { es: 'Imagen muy grande. Máximo 10MB', en: 'Image too large. Maximum 10MB' },
  mkt_name_required:   { es: 'Ingresa el nombre del producto', en: 'Enter the product name' },
  mkt_price_required:  { es: 'Ingresa un precio válido', en: 'Enter a valid price' },
  mkt_saving:          { es: 'Guardando...', en: 'Saving...' },
  mkt_img_upload_err:  { es: 'Error subiendo imagen: ', en: 'Error uploading image: ' },
  mkt_updated:         { es: 'Producto actualizado', en: 'Product updated' },
  mkt_added:           { es: 'Producto agregado', en: 'Product added' },
  mkt_save_error:      { es: 'Error guardando producto: ', en: 'Error saving product: ' },
  mkt_load_prod_error: { es: 'Error cargando producto: ', en: 'Error loading product: ' },
  mkt_activated:       { es: 'Producto activado', en: 'Product activated' },
  mkt_deactivated:     { es: 'Producto desactivado', en: 'Product deactivated' },
  mkt_status_error:    { es: 'Error actualizando estado: ', en: 'Error updating status: ' },
  mkt_confirm_delete:  { es: '¿Eliminar este producto del mercado?', en: 'Delete this product from the market?' },
  mkt_deleted:         { es: 'Producto eliminado', en: 'Product deleted' },
  mkt_delete_error:    { es: 'Error eliminando producto: ', en: 'Error deleting product: ' },
});

// Helper: admin-verified edge function call for market_products writes
async function _adminMarketCall(action, data) {
  var adminEmail = getAdminEmail();
  var body = Object.assign({ action: action, admin_email: adminEmail }, data || {});
  var resp = await fetch(SUPABASE_URL + '/functions/v1/admin-market', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
    body: JSON.stringify(body)
  });
  var result = await resp.json();
  if (!resp.ok) throw new Error(result.error || _t('mkt_op_error'));
  return result;
}

async function loadAdminMarketProducts() {
  var container = document.getElementById('zmMarketProductsList');
  if (!container || !supabaseClient) return;
  try {
    var query = supabaseClient.from('market_products').select('*').order('created_at', { ascending: false });
    var catFilter = document.getElementById('zmMktFilterCat');
    var statusFilter = document.getElementById('zmMktFilterStatus');
    if (catFilter && catFilter.value !== 'all') query = query.eq('categoria', catFilter.value);
    if (statusFilter && statusFilter.value !== 'all') query = query.eq('estado', statusFilter.value);
    var res = await query;
    var products = res.data || [];

    // Stats
    var allRes = await supabaseClient.from('market_products').select('estado,categoria');
    var allProds = allRes.data || [];
    var active = allProds.filter(function(p) { return p.estado === 'activo'; }).length;
    var cats = {};
    allProds.forEach(function(p) { cats[p.categoria] = true; });
    var elTotal = document.getElementById('zmMktTotal');
    var elActive = document.getElementById('zmMktActive');
    var elCats = document.getElementById('zmMktCategories');
    if (elTotal) elTotal.textContent = allProds.length;
    if (elActive) elActive.textContent = active;
    if (elCats) elCats.textContent = Object.keys(cats).length;

    if (products.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;font-size:13px;">' + _t('mkt_no_products') + '</div>';
      return;
    }
    var catColors = { herramientas: '#3b82f6', equipos: '#8b5cf6', ropa: '#ec4899', accesorios: '#f59e0b', general: '#64748b' };
    var html = '';
    products.forEach(function(p) {
      var color = catColors[p.categoria] || '#64748b';
      var statusBadge = p.estado === 'activo'
        ? '<span style="color:#16a34a;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:#f0fdf4;">' + _t('mkt_active') + '</span>'
        : '<span style="color:#ef4444;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:#fef2f2;">' + _t('mkt_inactive') + '</span>';
      var date = p.created_at ? new Date(p.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
      var imgThumb = p.imagen_url
        ? '<img src="' + _escHtml(p.imagen_url) + '" style="width:50px;height:50px;object-fit:cover;border-radius:8px;flex-shrink:0;" onerror="this.style.display=\'none\'">'
        : '<div style="width:50px;height:50px;background:#f1f5f9;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px;">🛍️</div>';
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:8px;">' +
        '<div style="display:flex;gap:10px;align-items:flex-start;">' +
          imgThumb +
          '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap;">' +
              '<span style="font-weight:600;color:#1e293b;font-size:13px;">' + _escHtml(p.nombre || _t('mkt_no_name', 'Sin nombre')) + '</span>' +
              '<span style="padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;color:#fff;background:' + color + ';">' + _escHtml(p.categoria || 'general') + '</span>' +
              statusBadge +
            '</div>' +
            '<div style="font-weight:800;color:#f39c12;font-size:14px;">$' + Number(p.precio).toFixed(2) + '</div>' +
            (p.descripcion ? '<div style="color:#64748b;font-size:11px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:300px;">' + _escHtml(p.descripcion) + '</div>' : '') +
            '<div style="color:#94a3b8;font-size:10px;margin-top:2px;">' + date + '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">' +
            '<button onclick="editMarketProduct(\'' + p.id + '\')" style="padding:4px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;color:#475569;cursor:pointer;font-size:10px;">✏️ ' + _t('mkt_edit', 'Editar') + '</button>' +
            '<button onclick="toggleMarketProductStatus(\'' + p.id + '\',\'' + p.estado + '\')" style="padding:4px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;color:#475569;cursor:pointer;font-size:10px;">' + (p.estado === 'activo' ? '⏸️ ' + _t('mkt_deactivate', 'Desactivar') : '▶️ ' + _t('mkt_activate', 'Activar')) + '</button>' +
            '<button onclick="deleteMarketProduct(\'' + p.id + '\')" style="padding:4px 10px;border:1px solid #fecaca;border-radius:6px;background:#fff;color:#ef4444;cursor:pointer;font-size:10px;">🗑️ ' + _t('mkt_delete', 'Eliminar') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;
  } catch(e) {
    console.error('[Admin] Error loading market products:', e);
    container.innerHTML = '<div style="text-align:center;color:#ef4444;padding:20px;font-size:12px;">' + _t('mkt_load_error', 'Error cargando productos: ') + _escHtml(e.message) + '</div>';
  }
}

function openCreateMarketProductModal(editData) {
  var isEdit = !!editData;
  var modal = document.createElement('div');
  modal.id = 'zmMarketModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;overflow-y:auto;';
  modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:25px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;">' + (isEdit ? '✏️ ' + _t('mkt_edit_product') : '🛍️ ' + _t('mkt_add_product')) + '</h3>' +
    '<input type="hidden" id="zmMktEditId" value="' + (isEdit ? _escHtml(editData.id) : '') + '">' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
      '<div>' +
        '<label style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;">' + _t('mkt_name_label') + '</label>' +
        '<input id="zmMktNombre" placeholder="' + _t('mkt_name_ph') + '" value="' + (isEdit ? _escHtml(editData.nombre || '') : '') + '" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;">' +
      '</div>' +
      '<div>' +
        '<label style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;">' + _t('mkt_desc_label') + '</label>' +
        '<textarea id="zmMktDescripcion" placeholder="' + _t('mkt_desc_ph') + '" rows="3" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;resize:vertical;">' + (isEdit ? _escHtml(editData.descripcion || '') : '') + '</textarea>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
        '<div>' +
          '<label style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;">' + _t('mkt_price_label') + '</label>' +
          '<input id="zmMktPrecio" type="number" step="0.01" min="0" placeholder="29.99" value="' + (isEdit ? _escHtml(String(editData.precio || '')) : '') + '" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;">' +
        '</div>' +
        '<div>' +
          '<label style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;">' + _t('mkt_cat_label') + '</label>' +
          '<select id="zmMktCategoria" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;">' +
            '<option value="herramientas"' + (isEdit && editData.categoria === 'herramientas' ? ' selected' : '') + '>' + _t('mkt_cat_tools', 'Herramientas') + '</option>' +
            '<option value="equipos"' + (isEdit && editData.categoria === 'equipos' ? ' selected' : '') + '>' + _t('mkt_cat_equipment', 'Equipos') + '</option>' +
            '<option value="ropa"' + (isEdit && editData.categoria === 'ropa' ? ' selected' : '') + '>' + _t('mkt_cat_clothing', 'Ropa') + '</option>' +
            '<option value="accesorios"' + (isEdit && editData.categoria === 'accesorios' ? ' selected' : '') + '>' + _t('mkt_cat_accessories', 'Accesorios') + '</option>' +
            '<option value="general"' + (isEdit && editData.categoria === 'general' ? ' selected' : '') + '>' + _t('mkt_cat_general', 'General') + '</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;">' + _t('mkt_img_label') + '</label>' +
        '<div style="border:2px dashed #e2e8f0;border-radius:8px;padding:16px;text-align:center;cursor:pointer;" onclick="document.getElementById(\'zmMktImageFile\').click()">' +
          '<div id="zmMktImagePreview">' + (isEdit && editData.imagen_url ? '<img src="' + _escHtml(editData.imagen_url) + '" style="max-height:100px;border-radius:8px;">' : '<div style="font-size:24px;margin-bottom:4px;">📷</div><div style="color:#94a3b8;font-size:12px;">' + _t('mkt_img_click') + '</div>') + '</div>' +
          '<input type="file" id="zmMktImageFile" accept="image/*" style="display:none;" onchange="previewMarketImage(this)">' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;">' + _t('mkt_link_label') + '</label>' +
        '<input id="zmMktEnlace" placeholder="https://..." value="' + (isEdit ? _escHtml(editData.enlace_externo || '') : '') + '" style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;">' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:5px;">' +
        '<button id="zmMktSubmitBtn" onclick="saveMarketProduct()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#f39c12;color:#fff;font-weight:bold;cursor:pointer;font-size:14px;">' + (isEdit ? '💾 ' + _t('mkt_save_changes') : '🛍️ ' + _t('mkt_add_product')) + '</button>' +
        '<button onclick="document.getElementById(\'zmMarketModal\').remove()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#f1f5f9;color:#475569;cursor:pointer;font-size:14px;">' + _t('mkt_cancel') + '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(modal);
}

function previewMarketImage(input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { alert(_t('mkt_img_too_large')); input.value = ''; return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    var preview = document.getElementById('zmMktImagePreview');
    if (preview) preview.innerHTML = '<img src="' + e.target.result + '" style="max-height:100px;border-radius:8px;"><div style="color:#16a34a;font-size:11px;margin-top:4px;">✓ ' + _escHtml(file.name) + '</div>';
  };
  reader.readAsDataURL(file);
}

async function saveMarketProduct() {
  var nombre = document.getElementById('zmMktNombre').value.trim();
  var descripcion = document.getElementById('zmMktDescripcion').value.trim();
  var precio = parseFloat(document.getElementById('zmMktPrecio').value);
  var categoria = document.getElementById('zmMktCategoria').value;
  var enlace = document.getElementById('zmMktEnlace').value.trim();
  var editId = document.getElementById('zmMktEditId').value;
  var fileInput = document.getElementById('zmMktImageFile');

  if (!nombre) { alert(_t('mkt_name_required')); return; }
  if (isNaN(precio) || precio <= 0) { alert(_t('mkt_price_required')); return; }

  var btn = document.getElementById('zmMktSubmitBtn');
  btn.disabled = true;
  btn.textContent = _t('mkt_saving');

  try {
    var imagen_url = null;

    // Upload image if selected
    if (fileInput && fileInput.files[0]) {
      var file = fileInput.files[0];
      var ext = file.name.split('.').pop().toLowerCase();
      var fileName = 'market/' + Date.now() + '_' + Math.random().toString(36).substring(7) + '.' + ext;
      var uploadRes = await supabaseClient.storage.from('school-files').upload(fileName, file, { contentType: file.type, upsert: true });
      if (uploadRes.error) throw new Error(_t('mkt_img_upload_err') + uploadRes.error.message);
      var urlRes = supabaseClient.storage.from('school-files').getPublicUrl(fileName);
      imagen_url = urlRes.data.publicUrl;
    }

    var productData = {
      nombre: nombre,
      descripcion: descripcion || null,
      precio: precio,
      categoria: categoria,
      enlace_externo: enlace || null
    };
    if (imagen_url) productData.imagen_url = imagen_url;

    if (editId) {
      await _adminMarketCall('update', { id: editId, product: productData });
    } else {
      if (!imagen_url) productData.imagen_url = null;
      await _adminMarketCall('insert', { product: productData });
    }

    var modalEl = document.getElementById('zmMarketModal');
    if (modalEl) modalEl.remove();
    if (typeof showNotification === 'function') {
      showNotification(editId ? '✅ ' + _t('mkt_updated') : '✅ ' + _t('mkt_added'), 'success');
    }
    loadAdminMarketProducts();
    _marketProductsLoaded = false; // Force reload on student side
  } catch(e) {
    console.error('[Admin] Error saving market product:', e);
    alert(_t('mkt_save_error') + e.message);
    btn.disabled = false;
    btn.textContent = editId ? '💾 ' + _t('mkt_save_changes') : '🛍️ ' + _t('mkt_add_product');
  }
}

async function editMarketProduct(productId) {
  try {
    var res = await supabaseClient.from('market_products').select('*').eq('id', productId).single();
    if (res.error) throw new Error(res.error.message);
    openCreateMarketProductModal(res.data);
  } catch(e) {
    alert(_t('mkt_load_prod_error') + e.message);
  }
}

async function toggleMarketProductStatus(productId, currentStatus) {
  var newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
  try {
    await _adminMarketCall('update', { id: productId, product: { estado: newStatus } });
    if (typeof showNotification === 'function') {
      showNotification(newStatus === 'activo' ? '▶️ ' + _t('mkt_activated') : '⏸️ ' + _t('mkt_deactivated'), 'success');
    }
    loadAdminMarketProducts();
    _marketProductsLoaded = false;
  } catch(e) {
    alert(_t('mkt_status_error') + e.message);
  }
}

async function deleteMarketProduct(productId) {
  if (!confirm(_t('mkt_confirm_delete'))) return;
  try {
    await _adminMarketCall('delete', { id: productId });
    if (typeof showNotification === 'function') {
      showNotification('🗑️ ' + _t('mkt_deleted'), 'success');
    }
    loadAdminMarketProducts();
    _marketProductsLoaded = false;
  } catch(e) {
    alert(_t('mkt_delete_error') + e.message);
  }
}

// ===== BANCO DE PREGUNTAS =====
var ZM_MASTER_CATEGORIES = [
  { value: 'HVAC', emoji: '🌡️', label: 'HVAC' },
  { value: 'Herramientas', emoji: '🔧', label: 'Herramientas' },
  { value: 'Diagnóstico', emoji: '🔍', label: 'Diagnóstico' },
  { value: 'Instalación', emoji: '🏗️', label: 'Instalación' },
  { value: 'Refrigeración', emoji: '❄️', label: 'Refrigeración' },
  { value: 'Electricidad', emoji: '⚡', label: 'Electricidad' },
  { value: 'Instalación Eléctrica', emoji: '🔌', label: 'Instalación Eléctrica' },
  { value: 'Códigos Eléctricos', emoji: '📋', label: 'Códigos Eléctricos' },
  { value: 'Seguridad Eléctrica', emoji: '⚠️', label: 'Seguridad Eléctrica' },
  { value: 'Conductores', emoji: '🔗', label: 'Conductores' },
  { value: 'Cajas Eléctricas', emoji: '📦', label: 'Cajas Eléctricas' },
  { value: 'Eficiencia Energética', emoji: '💡', label: 'Eficiencia Energética' },
  { value: 'Controles', emoji: '🎛️', label: 'Controles' },
  { value: 'Mantenimiento', emoji: '🛠️', label: 'Mantenimiento' },
  { value: 'Soldadura', emoji: '🔥', label: 'Soldadura' },
  { value: 'Tubería', emoji: '🪈', label: 'Tubería' },
  { value: 'Vacío', emoji: '🌀', label: 'Vacío' },
  { value: 'EPA 608', emoji: '📜', label: 'EPA 608' },
  { value: 'NATE', emoji: '🎓', label: 'NATE' },
  { value: 'OSHA 30', emoji: '🦺', label: 'OSHA 30' },
  { value: 'Seguridad', emoji: '🛡️', label: 'Seguridad' },
  { value: 'General', emoji: '📖', label: 'General' }
];

var ZM_CATEGORY_ALIASES = {
  'electrico': 'Electricidad', 'eléctrico': 'Electricidad', 'electrical': 'Electricidad', 'electric': 'Electricidad',
  'instalacion electrica': 'Instalación Eléctrica', 'instalación electrica': 'Instalación Eléctrica',
  'codigos electricos': 'Códigos Eléctricos', 'códigos electricos': 'Códigos Eléctricos', 'electrical codes': 'Códigos Eléctricos',
  'seguridad electrica': 'Seguridad Eléctrica', 'electrical safety': 'Seguridad Eléctrica',
  'conductores electricos': 'Conductores', 'wiring': 'Conductores',
  'cajas electricas': 'Cajas Eléctricas', 'electrical boxes': 'Cajas Eléctricas',
  'eficiencia energetica': 'Eficiencia Energética', 'energy efficiency': 'Eficiencia Energética',
  'refrigeracion': 'Refrigeración', 'refrigeration': 'Refrigeración',
  'instalacion': 'Instalación', 'installation': 'Instalación',
  'diagnostico': 'Diagnóstico', 'diagnosis': 'Diagnóstico', 'diagnostic': 'Diagnóstico',
  'herramientas': 'Herramientas', 'tools': 'Herramientas',
  'controles': 'Controles', 'controls': 'Controles',
  'mantenimiento': 'Mantenimiento', 'maintenance': 'Mantenimiento',
  'soldadura': 'Soldadura', 'welding': 'Soldadura', 'brazing': 'Soldadura',
  'tuberia': 'Tubería', 'piping': 'Tubería',
  'vacio': 'Vacío', 'vacuum': 'Vacío',
  'seguridad': 'Seguridad', 'safety': 'Seguridad',
  'general': 'General',
  'hvac': 'HVAC',
  'epa': 'EPA 608', 'epa608': 'EPA 608', 'epa 608': 'EPA 608',
  'nate': 'NATE',
  'osha': 'OSHA 30', 'osha30': 'OSHA 30', 'osha 30': 'OSHA 30',
  'tema de hvac': 'HVAC'
};

function _normalizeCategoryName(cat) {
  if (!cat) return 'General';
  var trimmed = cat.trim();
  // Check exact match first
  for (var i = 0; i < ZM_MASTER_CATEGORIES.length; i++) {
    if (ZM_MASTER_CATEGORIES[i].value === trimmed) return trimmed;
  }
  // Check aliases (case-insensitive)
  var lower = trimmed.toLowerCase().replace(/[áéíóúñü]/g, function(c) {
    return { 'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n','ü':'u' }[c] || c;
  });
  if (ZM_CATEGORY_ALIASES[lower]) return ZM_CATEGORY_ALIASES[lower];
  // Check partial match
  for (var key in ZM_CATEGORY_ALIASES) {
    if (lower.indexOf(key) !== -1 || key.indexOf(lower) !== -1) return ZM_CATEGORY_ALIASES[key];
  }
  return trimmed; // Return as-is if no match found
}

var _zmQuestionsCache = {};
var _questionChats = {};
var _zmActiveStatFilter = null;
var INSTRUCTOR_AI_URL = 'https://htklsowiyjwsjnacnvnr.supabase.co/functions/v1/instructor-ai-chat';
var INSTRUCTOR_AI_SYSTEM = 'Eres un experto verificador de preguntas técnicas de HVAC (calefacción, ventilación y aire acondicionado). Tu rol es revisar preguntas de examen para certificaciones EPA 608, NATE y OSHA 30. Responde siempre en español. Sé conciso (máximo 200 palabras). Evalúa: precisión técnica, que la respuesta correcta sea realmente correcta, que los distractores sean plausibles pero incorrectos, y que la dificultad sea apropiada.';

// _escHtml defined earlier (line ~8732) with single-quote escaping

