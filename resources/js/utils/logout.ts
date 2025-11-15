let isLoggingOut = false;

export function logout() {
    if (isLoggingOut) return;
    isLoggingOut = true;

    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';

    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = '_token';
    tokenInput.value = token;

    form.appendChild(tokenInput);
    document.body.appendChild(form);
    form.submit();
}

