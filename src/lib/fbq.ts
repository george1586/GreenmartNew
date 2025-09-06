// src/lib/fbq.ts
type Params = Record<string, any>;

export function fbqTrack(event: string, params?: Params) {
    (window as any)?.fbq?.('track', event, params);
}

export function fbqPageView() {
    (window as any)?.fbq?.('track', 'PageView');
}

// (optional) advanced matching after login/signup
export function fbqSetUser(email?: string, phone?: string) {
    if (!email && !phone) return;
    // Meta will hash in-browser; pass plain values.
    (window as any)?.fbq?.('init', '770536062251831', {
        ...(email ? { em: email } : {}),
        ...(phone ? { ph: phone } : {}),
    });
}
