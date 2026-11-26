// Stand-in for a third-party analytics script (served locally for feature tests).
window.__fakeThirdParty = { loadedAt: performance.now(), readyState: document.readyState };
document.documentElement.setAttribute('data-fake-third-party', 'loaded');
