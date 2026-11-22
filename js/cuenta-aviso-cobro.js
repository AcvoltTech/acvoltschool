/**
 * Aviso de cobro antes de eliminar la cuenta — WEB (22-nov-2026)
 *
 * RIESGO que cierra: eliminar la cuenta NO cancela la renovación en Stripe (la función
 * `delete-account` solo desactiva la membresía en nuestra base). Un alumno que paga la
 * membresía web ($149 al mes) podía borrar su acceso y seguir pagando, ya sin poder entrar
 * a «Mi cuenta» para cancelar. En la app de tienda ya había un aviso (js/auth.js); en la web no.
 *
 * Aquí: antes del borrado, en la web SIEMPRE se enseña cómo cancelar. Si el servidor confirma
 * un pago activo (`web_access_check`), el aviso lo dice sin rodeos. Si no se pudo saber, se
 * avisa igual: "todavía no sé" nunca se trata como "no paga".
 *
 * Uso (js/auth.js):  var seguir = await MaestroAvisoCobro.antesDeBorrar();  if (!seguir) return;
 */
(function (global) {
  'use strict';

  var CUENTA_URL = 'https://maestrohvacr.com/estudiar#cuenta';
  var SOPORTE = 'soporte@maestrohvacr.com';
  var ESPERA_MS = 4000;

  function _t(k, fb) { return typeof global._t === 'function' ? global._t(k, fb) : fb; }

  // Dentro de la app de tienda el aviso es el de js/auth.js (cancelar en App Store / Google Play).
  function _esAppDeTienda() {
    try {
      if (global.isIOSAppStore || global.isAndroidPlayStore || global.isAndroidApp) return true;
      if (global.__IS_NATIVE_APP === true) return true;
      if (/MaestroHVACR/i.test(navigator.userAgent || '')) return true;
      if (global.AndroidIAP || global.RevenueCatBridge) return true;
    } catch (_) {}
    return false;
  }

  // true = el servidor confirma un pago activo · false = confirma que no · null = no se pudo saber.
  function _hayPagoActivo() {
    return new Promise(function (resolve) {
      var listo = false;
      var fin = function (v) { if (!listo) { listo = true; resolve(v); } };
      setTimeout(function () { fin(null); }, ESPERA_MS);
      try {
        var sb = global.supabaseClient;
        if (!sb || !sb.rpc) { fin(null); return; }
        // El builder de Supabase NO es Promise real: 2º argumento de then(), nunca .catch().
        sb.rpc('web_access_check').then(function (res) {
          var d = res && res.data;
          if (!d || (res && res.error)) { fin(null); return; }
          if (d.access !== true) { fin(false); return; }
          if (d.modo === 'solo_grabaciones' || d.reason === 'paid' || d.reason === 'web_membership') { fin(true); return; }
          // 'admin' y 'student' se deciden ANTES que el pago en el servidor: pueden tener además
          // una membresía de pago. No se sabe → aviso general.
          fin(null);
        }, function () { fin(null); });
      } catch (_) { fin(null); }
    });
  }

  function _textos(pago) {
    var comoCancelar = _t('aviso_cobro_como',
      'Para cancelar: entra a maestrohvacr.com/estudiar → «Mi cuenta» → «Administrar pagos o cancelar membresía». ' +
      'Si pagas desde la app, cancela en App Store o Google Play. ' +
      '¿No puedes entrar? Escribe a ' + SOPORTE + ' desde el correo de tu cuenta y lo cancelamos por ti.');
    if (pago === true) {
      return {
        title: _t('aviso_cobro_titulo_activo', 'Primero cancela tu pago mensual'),
        message: _t('aviso_cobro_msg_activo',
          'Tienes un pago activo. Eliminar tu cuenta NO cancela el cobro: tu tarjeta se seguiría cobrando ' +
          'y ya no podrías entrar a «Mi cuenta» para cancelarlo.') + ' ' + comoCancelar,
        okText: _t('aviso_cobro_ir', 'Ir a cancelar'),
        cancelText: _t('aviso_cobro_ya_cancele', 'Ya cancelé, continuar')
      };
    }
    return {
      title: _t('aviso_cobro_titulo', '¿Pagas una membresía mensual?'),
      message: _t('aviso_cobro_msg',
        'Eliminar tu cuenta NO cancela el cobro de una membresía. Si pagas cada mes, cancélala primero: ' +
        'después ya no podrás entrar a «Mi cuenta».') + ' ' + comoCancelar,
      okText: _t('aviso_cobro_ir', 'Ir a cancelar'),
      cancelText: _t('aviso_cobro_no_pago', 'No pago nada, continuar')
    };
  }

  /** Resuelve true = seguir con el borrado · false = el alumno se fue a cancelar (no borrar). */
  function antesDeBorrar() {
    if (_esAppDeTienda()) return Promise.resolve(true);
    return _hayPagoActivo().then(function (pago) {
      var t = _textos(pago);
      var pregunta = (global.MaestroDialog && global.MaestroDialog.confirm)
        ? global.MaestroDialog.confirm({ title: t.title, message: t.message, okText: t.okText, cancelText: t.cancelText, kind: 'warning' })
        : Promise.resolve(global.confirm(t.title + '\n\n' + t.message + '\n\n[OK] ' + t.okText + ' · [Cancelar] ' + t.cancelText));
      return pregunta.then(function (irACancelar) {
        if (!irACancelar) return true;
        try { global.open(CUENTA_URL, '_blank', 'noopener'); } catch (_) {}
        return false;
      });
    });
  }

  global.MaestroAvisoCobro = { antesDeBorrar: antesDeBorrar, CUENTA_URL: CUENTA_URL };
})(window);
