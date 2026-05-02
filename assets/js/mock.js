/**
 * Mock OAuth Provider
 * Simulates OAuth2 authorization flow for testing PipePub Auth
 * 
 * File: /assets/js/mock.js
 * 
 * URL params:
 * - test=true    : Test mode (preserved in redirect)
 */

(function() {
    'use strict';
    
    let requestParams = {};
    let validationErrors = [];
    let currentService = null;

    function parseRequestParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        requestParams = {
            response_type: urlParams.get('response_type'),
            client_id: urlParams.get('client_id'),
            redirect_uri: urlParams.get('redirect_uri'),
            state: urlParams.get('state'),
            scope: urlParams.get('scope'),
            code_challenge: urlParams.get('code_challenge'),
            code_challenge_method: urlParams.get('code_challenge_method')
        };
        
        const scope = requestParams.scope || '';
        if (scope.includes('pkce')) {
            currentService = 'MockWithPKCE';
        } else if (scope.includes('norefresh')) {
            currentService = 'MockNoRefresh';
        } else {
            currentService = 'MockStandard';
        }
        
        const paramsDisplay = document.getElementById('requestParams');
        if (paramsDisplay) {
            paramsDisplay.innerHTML = `<pre class="mb-0">${JSON.stringify(requestParams, null, 2)}</pre>`;
        }
    }
    
    function buildRedirectUrlWithParams(baseUrl, params) {
        const fragmentIndex = baseUrl.indexOf('#');
        let urlWithoutFragment = baseUrl;
        let fragment = '';
        
        if (fragmentIndex !== -1) {
            urlWithoutFragment = baseUrl.substring(0, fragmentIndex);
            fragment = baseUrl.substring(fragmentIndex);
        }
        
        const queryParams = { ...params };
        queryParams.test = 'true';
        
        const queryString = Object.entries(queryParams)
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        
        const separator = urlWithoutFragment.includes('?') ? '&' : '?';
        let finalUrl = `${urlWithoutFragment}${separator}${queryString}${fragment}`;
        
        if (!finalUrl.includes('test=true')) {
            const urlSeparator = finalUrl.includes('?') ? '&' : '?';
            finalUrl = `${finalUrl}${urlSeparator}test=true`;
        }
        
        console.log('Built redirect URL:', finalUrl);
        return finalUrl;
    }
    
    function validateRequest() {
        validationErrors = [];
        
        if (!requestParams.response_type) {
            validationErrors.push('Missing required parameter: response_type');
        } else if (requestParams.response_type !== 'code') {
            validationErrors.push('Only response_type=code is supported in this mock');
        }
        
        if (!requestParams.client_id) {
            validationErrors.push('Missing required parameter: client_id');
        } else if (requestParams.client_id.length < 3) {
            validationErrors.push('client_id seems too short (min 3 chars recommended)');
        }
        
        if (!requestParams.redirect_uri) {
            validationErrors.push('Missing required parameter: redirect_uri');
        } else if (!requestParams.redirect_uri.startsWith('http')) {
            validationErrors.push('redirect_uri must be a valid HTTP/HTTPS URL');
        }
        
        if (currentService === 'MockWithPKCE') {
            if (!requestParams.code_challenge) {
                validationErrors.push('Missing required parameter: code_challenge (PKCE required for this service)');
            }
            if (requestParams.code_challenge_method && !['plain', 'S256'].includes(requestParams.code_challenge_method)) {
                validationErrors.push('Invalid code_challenge_method. Supported: plain, S256');
            }
        }
        
        if (!requestParams.state) {
            validationErrors.push('⚠️ Warning: Missing state parameter (CSRF protection recommended)');
        }
        
        const validationDiv = document.getElementById('validationResult');
        const criticalErrors = validationErrors.filter(e => !e.includes('Warning'));
        
        if (criticalErrors.length > 0) {
            validationDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <strong>Validation Failed:</strong>
                    <ul class="mb-0 mt-2">
                        ${criticalErrors.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
            `;
            return false;
        } else if (validationErrors.length > 0) {
            validationDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Validation Warnings:</strong>
                    <ul class="mb-0 mt-2">
                        ${validationErrors.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
            `;
            return true;
        } else {
            validationDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle"></i>
                    <strong>Validation Passed!</strong> All OAuth parameters are correct.
                </div>
            `;
            return true;
        }
    }
    
    function generateAuthCode() {
        const customCode = document.getElementById('customCode')?.value.trim();
        if (customCode) {
            return customCode;
        }
        return 'mock_auth_' + Math.random().toString(36).substring(2, 20) + 
               '_' + Date.now().toString(36);
    }
    
    function redirectWithCode(code, error = null, errorDescription = null) {
        if (!requestParams.redirect_uri) {
            alert('No redirect_uri provided! Cannot complete flow.');
            return;
        }
        
        const params = {};
        
        if (error) {
            params.error = error;
            if (errorDescription) {
                params.error_description = errorDescription;
            }
        } else {
            params.code = code;
        }
        
        if (requestParams.state) {
            params.state = requestParams.state;
        }
        
        const redirectUrl = buildRedirectUrlWithParams(requestParams.redirect_uri, params);
        
        console.log('Mock OAuth redirecting to:', redirectUrl);
        console.log('Mock OAuth state:', requestParams.state);
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }
    
    function copyRequestParams() {
        const jsonStr = JSON.stringify(requestParams, null, 2);
        navigator.clipboard.writeText(jsonStr);
        const copyBtn = document.getElementById('copyButton');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> Copy Request';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    function handleApprove() {
        if (!validateRequest()) {
            alert('Request validation failed. Please fix the issues and try again.');
            return;
        }
        
        const authCode = generateAuthCode();
        
        sessionStorage.setItem('mock_auth_code', authCode);
        sessionStorage.setItem('mock_client_id', requestParams.client_id);
        sessionStorage.setItem('mock_scope', requestParams.scope || '');
        
        if (requestParams.code_challenge) {
            sessionStorage.setItem('mock_code_challenge', requestParams.code_challenge);
            sessionStorage.setItem('mock_code_challenge_method', requestParams.code_challenge_method || 'plain');
        }
        
        redirectWithCode(authCode);
    }
    
    function handleDeny() {
        redirectWithCode(null, 'access_denied', 'User denied the authorization request');
    }
    
    function init() {
        parseRequestParams();
        validateRequest();
        
        const approveBtn = document.getElementById('approveBtn');
        const denyBtn = document.getElementById('denyBtn');
        const copyBtn = document.getElementById('copyButton');
        
        if (approveBtn) approveBtn.addEventListener('click', handleApprove);
        if (denyBtn) denyBtn.addEventListener('click', handleDeny);
        if (copyBtn) copyBtn.addEventListener('click', copyRequestParams);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();