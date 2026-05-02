/**
 * PipePub Auth Module
 * OAuth authorization helper for PipePub publishing platform
 * 
 * TEST: ?test=true
 * File: /assets/js/auth.js
 */

(function() {
    'use strict';

    const currentScript = document.currentScript.src;
    const currentFolder = currentScript.substring(0, currentScript.lastIndexOf('/')) + '/';
    console.log("currentScript:", currentScript);
    console.log("currentFolder:", currentFolder);

    let config = {};
    let isTestMode = false;
    
    const elements = {
        platformSelect: null,
        clientIdInput: null,
        clientSecretInput: null,
        authForm: null,
        resultContainer: null,
        infoBox: null,
        testModeBadge: null
    };
    
    let successTemplate = null;
    let errorTemplate = null;
    
    function checkTestMode() {
        const urlParams = new URLSearchParams(window.location.search);
        isTestMode = urlParams.get('test') === 'true';
        
        if (isTestMode) {
            const cardHeader = document.querySelector('.card-header');
            if (cardHeader && !elements.testModeBadge) {
                const badge = document.createElement('div');
                badge.className = 'mt-2';
                badge.id = 'testModeBadge';
                badge.innerHTML = '<span class="badge bg-warning text-dark"><i class="bi bi-flask"></i> TEST MODE - Mock OAuth Server</span>';
                cardHeader.appendChild(badge);
                elements.testModeBadge = badge;
            }
        }
    }
    
    function showSuccess(platformName, code, secretName) {
        if (!elements.resultContainer || !successTemplate) return;
        
        const clone = document.importNode(successTemplate.content, true);
        
        clone.querySelector('#platformName').textContent = platformName;
        clone.querySelector('#authCode').textContent = code;
        clone.querySelector('#stepPlatform').textContent = platformName;
        clone.querySelector('#secretName').textContent = secretName;
        
        const copyBtn = clone.querySelector('#copyButton');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code);
            copyBtn.innerHTML = '<i class="bi bi-check"></i> Copy Code';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy Code';
            }, 2000);
        });
        
        elements.resultContainer.innerHTML = '';
        elements.resultContainer.appendChild(clone);
        
        if (elements.authForm) elements.authForm.style.display = 'none';
        if (elements.infoBox) elements.infoBox.style.display = 'none';
    }
    
    function showError(message) {
        if (!elements.resultContainer || !errorTemplate) return;
        
        const clone = document.importNode(errorTemplate.content, true);
        clone.querySelector('#errorMessage').textContent = message;
        
        elements.resultContainer.innerHTML = '';
        elements.resultContainer.appendChild(clone);
    }
    
    function generateRandomString(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    async function generatePKCE() {
        const codeVerifier = generateRandomString(64);
        
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hash = await crypto.subtle.digest('SHA-256', data);
        
        const hashArray = Array.from(new Uint8Array(hash));
        const hashBase64 = btoa(String.fromCharCode(...hashArray));
        const codeChallenge = hashBase64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        
        return {
            code_verifier: codeVerifier,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        };
    }
    
    function populatePlatformSelect() {
        if (!elements.platformSelect) return;
        
        elements.platformSelect.innerHTML = '<option value="">Select a platform</option>';
        
        for (const [key, service] of Object.entries(config.services || {})) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = isTestMode ? `${service.name} (MOCK)` : service.name;
            elements.platformSelect.appendChild(option);
        }
    }
    
    function generateSecureState(platform, clientId) {
        const publicKey = config.public_key;
        const timestamp = Date.now();
        const random = generateRandomString(32);
        
        const stateObj = {
            p: platform,
            c: clientId,
            k: publicKey,
            t: timestamp,
            r: random
        };
        
        const stateJson = JSON.stringify(stateObj);
        const state = btoa(stateJson);
        
        console.log('Generated state (first 50):', state.substring(0, 50));
        
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_platform', platform);
        sessionStorage.setItem('oauth_clientId', clientId);
        
        return state;
    }
    
    function verifyState(receivedState, platform, clientId) {
        if (!receivedState) return false;
        
        const storedState = sessionStorage.getItem('oauth_state');
        
        let decodedState = receivedState;
        if (receivedState.includes('%')) {
            decodedState = decodeURIComponent(receivedState);
        }
        
        if (storedState !== decodedState && storedState !== receivedState) {
            console.error('State mismatch:', {
                stored: storedState?.substring(0, 50),
                received: receivedState?.substring(0, 50),
                decoded: decodedState?.substring(0, 50)
            });
            return false;
        }
        
        try {
            const stateToParse = storedState === decodedState ? decodedState : receivedState;
            const decoded = JSON.parse(atob(stateToParse));
            
            if (decoded.p !== platform) return false;
            if (decoded.c !== clientId) return false;
            if (decoded.k !== config.public_key) return false;
            
            const age = Date.now() - decoded.t;
            if (age > 600000) {
                console.error('State expired');
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('State verification failed:', e);
            return false;
        }
    }
    
    function handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        console.log('=== CALLBACK DEBUG ===');
        console.log('Code:', code ? 'YES' : 'NO');
        console.log('State (first 50):', state ? state.substring(0, 50) + '...' : 'NO');
        
        if (error) {
            showError(`${error}: ${errorDescription || 'Unknown error'}`);
            return false;
        }
        
        if (code && state) {
            const storedPlatform = sessionStorage.getItem('oauth_platform');
            const storedClientId = sessionStorage.getItem('oauth_clientId');
            const storedState = sessionStorage.getItem('oauth_state');
            
            console.log('Stored state (first 50):', storedState?.substring(0, 50));
            console.log('States match:', storedState === state);
            
            const service = config.services?.[storedPlatform];
            const secretName = service?.secret_name || `${storedPlatform?.toUpperCase()}_TOKEN`;
            const platformName = service?.name || storedPlatform;
            
            if (storedPlatform && storedClientId && verifyState(state, storedPlatform, storedClientId)) {
                showSuccess(platformName, code, secretName);
                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('oauth_platform');
                sessionStorage.removeItem('oauth_clientId');
                sessionStorage.removeItem('oauth_clientSecret');

                const cleanUrl = isTestMode ? window.location.pathname + '?test=true' : window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);

                return true;
            } else {
                console.error('VERIFICATION FAILED');
                showError('Security verification failed. The request may have expired or been tampered with. Please try again.');
                return false;
            }
        }
        return false;
    }
    
    function initElements() {
        elements.platformSelect = document.getElementById('platform');
        elements.clientIdInput = document.getElementById('clientId');
        elements.clientSecretInput = document.getElementById('clientSecret');
        elements.authForm = document.getElementById('oauthForm');
        elements.resultContainer = document.getElementById('resultContainer');
        elements.infoBox = document.getElementById('infoBox');
        
        successTemplate = document.getElementById('successTemplate');
        errorTemplate = document.getElementById('errorTemplate');
    }
    
    async function loadConfig() {
        try {
            const configFile = isTestMode ? `${currentFolder}../test.json` : `${currentFolder}../config.json`;
            const response = await fetch(configFile);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            config = await response.json();
            populatePlatformSelect();
            handleCallback();
        } catch (error) {
            console.error('Failed to load config:', error);
            if (elements.platformSelect) {
                elements.platformSelect.innerHTML = '<option>Error loading platforms</option>';
            }
            const configType = isTestMode ? 'test' : 'platform';
            showError(`Failed to load ${configType} configuration. Please refresh the page and try again.`);
        }
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        const platform = elements.platformSelect?.value;
        const service = config.services?.[platform];
        
        if (!service) {
            alert('Please select a valid platform');
            return;
        }
        
        const clientId = elements.clientIdInput?.value.trim();
        const clientSecret = elements.clientSecretInput?.value.trim();
        
        if (!clientId) {
            alert('Please enter your Client ID');
            return;
        }
        
        if (!clientSecret) {
            alert('Please enter your Client Secret');
            return;
        }
        
        const redirectUri = window.location.href.split('?')[0];
        
        sessionStorage.setItem('oauth_clientSecret', clientSecret);
        const state = generateSecureState(platform, clientId);
        
        const separator = service.authorize_url.includes('?') ? '&' : '?';
        let authUrl = `${service.authorize_url}${separator}` +
            `response_type=${service.response_type || 'code'}` +
            `&client_id=${encodeURIComponent(clientId)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&state=${state}`;
        
        if (service.requires_pkce === true) {
            try {
                const pkce = await generatePKCE();
                sessionStorage.setItem('pkce_verifier', pkce.code_verifier);
                authUrl += `&code_challenge=${encodeURIComponent(pkce.code_challenge)}`;
                authUrl += `&code_challenge_method=${encodeURIComponent(pkce.code_challenge_method)}`;
                console.log('PKCE enabled for this service');
            } catch (error) {
                console.error('Failed to generate PKCE:', error);
            }
        }
        
        if (service.scope) {
            authUrl += `&scope=${encodeURIComponent(service.scope)}`;
        }
        
        console.log('Redirect URL:', authUrl);
        window.location.href = authUrl;
    }
    
    function attachEventListeners() {
        if (elements.authForm) {
            elements.authForm.addEventListener('submit', handleSubmit);
        }
    }
    
    function init() {
        checkTestMode();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initElements();
                attachEventListeners();
                loadConfig();
            });
        } else {
            initElements();
            attachEventListeners();
            loadConfig();
        }
    }
    
    init();
    
})();