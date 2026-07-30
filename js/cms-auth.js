/* ============================================================
   CMS AUTH — Login Guard, Session Management & Credential Store
   Sandeep Patel Portfolio
   ============================================================ */

(function () {
    'use strict';

    const CMS_CRED_KEY       = 'sandeep_cms_creds';
    const CMS_SESSION_KEY    = 'sandeep_cms_session';
    const SESSION_DURATION   = 8 * 60 * 60 * 1000; // 8 hours

    /* ── Default credentials ──
       IMPORTANT: Log in once with the new default password given to you separately,
       then IMMEDIATELY go to CMS → Change ID / Password and set your own.
       The password is intentionally NOT written anywhere in this file — this file is
       public (anyone can view it in the browser), so the old version leaking the
       password here was a security hole. ── */
    const DEFAULT_CREDS = {
        username:     'admin',
        passwordHash: '26299c5be207914f39248144b8e617ec7ea1d98f1ea63f47f78bb74398295499'
    };

    /* ── SHA-256 via SubtleCrypto ── */
    async function sha256(str) {
        const buf  = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash))
                    .map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /* ── Session ── */
    function getSession() {
        try {
            const raw = (function(k){try{return sessionStorage.getItem(k);}catch(e){return null;}})(CMS_SESSION_KEY);
            if (!raw) return null;
            const s = JSON.parse(raw);
            if (Date.now() > s.expiresAt) { (function(k){try{sessionStorage.removeItem(k);}catch(e){}})(CMS_SESSION_KEY); return null; }
            return s;
        } catch { return null; }
    }

    function createSession(username) {
        const s = { username, createdAt: Date.now(), expiresAt: Date.now() + SESSION_DURATION };
        (function(k,v){try{sessionStorage.setItem(k,v);}catch(e){}})(CMS_SESSION_KEY, JSON.stringify(s));
    }

    function destroySession() {
        (function(k){try{sessionStorage.removeItem(k);}catch(e){}})(CMS_SESSION_KEY);
    }

    /* ── Credentials ── */
    function getStoredCreds() {
        try {
            const raw = (function(k){try{return localStorage.getItem(k);}catch(e){return null;}})(CMS_CRED_KEY);
            if (raw) return JSON.parse(raw);
        } catch {}
        return DEFAULT_CREDS;
    }

    function saveCreds(username, passwordHash) {
        (function(k,v){try{localStorage.setItem(k,v);}catch(e){}})(CMS_CRED_KEY, JSON.stringify({ username, passwordHash }));
    }

    /* ── Public API ── */
    window.CMSAuth = {
        isAuthenticated() { return !!getSession(); },
        getSession,
        destroySession,
        sha256,
        getStoredCreds,
        getCurrentUsername() { const s = getSession(); return s ? s.username : null; },

        async login(username, password) {
            const creds = getStoredCreds();
            const hash  = await sha256(password);
            if (username.trim() === creds.username && hash === creds.passwordHash) {
                createSession(username.trim());
                return true;
            }
            return false;
        },

        logout() {
            destroySession();
            window.location.href = this._loginPage();
        },

        async changeCredentials(currentPassword, newUsername, newPassword) {
            const creds = getStoredCreds();
            const hash  = await sha256(currentPassword);
            if (hash !== creds.passwordHash) return { ok: false, reason: 'wrong_password' };
            if (!newUsername || newUsername.trim().length < 3) return { ok: false, reason: 'bad_username' };
            if (!newPassword || newPassword.length < 6) return { ok: false, reason: 'weak_password' };
            const newHash = await sha256(newPassword);
            saveCreds(newUsername.trim(), newHash);
            // Update session username
            const s = getSession();
            if (s) { s.username = newUsername.trim(); (function(k,v){try{sessionStorage.setItem(k,v);}catch(e){}})(CMS_SESSION_KEY, JSON.stringify(s)); }
            return { ok: true };
        },

        /* Determine login page relative to current path */
        _loginPage() {
            const path = window.location.pathname;
            const inSubdir = path.includes('/work/') || path.match(/\/[^/]+\/[^/]+\.html$/);
            return inSubdir ? '../cms-login.html' : 'cms-login.html';
        },

        /* Call at top of admin.html — redirects to login if not authenticated */
        guardPage() {
            if (!this.isAuthenticated()) {
                window.location.replace(this._loginPage());
                return false;
            }
            return true;
        }
    };

    /* ── Auto-guard any page that includes this script ── */
    (function autoGuard() {
        const path = window.location.pathname;
        const isAdmin = path.endsWith('admin.html') || path.endsWith('/admin');
        if (isAdmin && !window.CMSAuth.isAuthenticated()) {
            window.location.replace(window.CMSAuth._loginPage());
        }
    })();

})();
