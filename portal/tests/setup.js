// ============================================================
// Test Setup — simulates browser globals for Vitest + jsdom
// ============================================================
import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.resolve(__dirname, '..');

/**
 * Load a JS source file into the global scope (simulates <script> tag).
 * Uses vm.runInThisContext so const/let/var declarations mirror browser behavior.
 */
export function loadScript(relativePath) {
  const abs = path.join(ROOT, relativePath);
  let code = fs.readFileSync(abs, 'utf8');
  // Replace top-level const/let with var so declarations become globalThis
  // properties and are shared across eval calls (simulating <script> tags).
  code = code.replace(/^(\s*)(const|let) /gm, '$1var ');
  (0, eval)(code);
}

/**
 * Load multiple scripts in order (simulates Tier 0/1 loading).
 */
export function loadScripts(paths) {
  for (const p of paths) {
    loadScript(p);
  }
}

// Mock Supabase SDK (window.supabase)
const mockAuth = {
  getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
  getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  resetPasswordForEmail: vi.fn(),
};

const mockSupabaseClient = {
  auth: mockAuth,
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        then: vi.fn().mockImplementation(cb => Promise.resolve(cb({ data: [], error: null }))),
      }),
      then: vi.fn().mockImplementation(cb => Promise.resolve(cb({ data: [], error: null }))),
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
  rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
};

globalThis.supabase = {
  createClient: vi.fn().mockReturnValue(mockSupabaseClient),
};

// Stub functions that supabase-init.js calls on load (normally defined by
// auth.js and navigation.js which load later as Tier 1 scripts).
globalThis.init = vi.fn().mockResolvedValue(undefined);
globalThis.showScreen = vi.fn();

// Replace localStorage/sessionStorage with a full mock that supports .clear()
// (jsdom's Proxy-based Storage can be missing .clear() or reject assignments)
function createStorageMock() {
  const store = {};
  return {
    getItem(key) { return key in store ? store[key] : null; },
    setItem(key, val) { store[key] = String(val); },
    removeItem(key) { delete store[key]; },
    clear() { for (const k in store) delete store[k]; },
    get length() { return Object.keys(store).length; },
    key(i) { return Object.keys(store)[i] || null; },
  };
}
Object.defineProperty(globalThis, 'localStorage', { value: createStorageMock(), writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: createStorageMock(), writable: true });

// Expose mocks for tests to access
export { mockAuth, mockSupabaseClient };

// Mock console.log/warn to reduce noise (keep errors visible)
// vi.spyOn(console, 'log').mockImplementation(() => {});
// vi.spyOn(console, 'warn').mockImplementation(() => {});
