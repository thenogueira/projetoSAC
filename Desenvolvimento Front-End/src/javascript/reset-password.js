document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token'); // espera ?token=...

    const form = document.getElementById('resetPasswordForm');
    const novaSenhaField = document.getElementById('novaSenha');
    const confirmaSenhaField = document.getElementById('confirmaSenha');
    const msg = document.getElementById('resetMessage');

    if (!token) {
        msg.textContent = 'Token não encontrado. Verifique o link recebido por e‑mail.';
        msg.classList.add('text-red-500');
        if (form) form.style.display = 'none';
        return;
    }

    async function tryBackendReset(token, nova) {
        try {
            const resp = await fetch('http://localhost:8080/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, senha_hash: nova })
            });
            if (resp.ok) return { ok: true };
            const err = await resp.json().catch(() => ({}));
            return { ok: false, message: err.message || `Erro ${resp.status}` };
        } catch (e) {
            console.warn('Erro ao conectar backend reset-password:', e);
            return { ok: false, network: true };
        }
    }

    function checkLocalToken(token) {
        const raw = localStorage.getItem('pwResetTokens');
        if (!raw) return null;
        try {
            const map = JSON.parse(raw);
            const entry = map[token];
            if (!entry) return null;
            if (Date.now() > entry.expires) {
                // token expirado -> remover
                delete map[token];
                localStorage.setItem('pwResetTokens', JSON.stringify(map));
                return null;
            }
            return entry; // { email, expires }
        } catch (e) {
            console.error('Erro lendo pwResetTokens:', e);
            return null;
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const nova = novaSenhaField.value.trim();
        const conf = confirmaSenhaField.value.trim();

        if (!nova || !conf) {
            msg.textContent = 'Preencha os dois campos.';
            msg.className = 'text-red-500';
            return;
        }
        if (nova !== conf) {
            msg.textContent = 'As senhas não coincidem.';
            msg.className = 'text-red-500';
            return;
        }
        if (nova.length < 6) {
            msg.textContent = 'Senha muito curta (mínimo 6 caracteres).';
            msg.className = 'text-red-500';
            return;
        }

        // Tenta backend primeiro
        const backendResult = await tryBackendReset(token, nova);
        if (backendResult.ok) {
            msg.textContent = 'Senha redefinida com sucesso. Redirecionando para login...';
            msg.className = 'text-green-600';
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        // Se backend não acessível (network) ou retornou erro, tenta fallback local
        const localEntry = checkLocalToken(token);
        if (!localEntry) {
            msg.textContent = backendResult.message || 'Token inválido ou expirado.';
            msg.className = 'text-red-500';
            return;
        }

        // Aqui podemos atualizar senha em storage local (apenas para ambiente de desenvolvimento)
        // tenta atualizar lista 'cadastros' se existir (fluxo de cadastro local)
        try {
            const cadRaw = localStorage.getItem('cadastros');
            if (cadRaw) {
                const cadArr = JSON.parse(cadRaw);
                const idx = cadArr.findIndex(c => c.email === localEntry.email);
                if (idx !== -1) {
                    cadArr[idx].senha = nova;
                    localStorage.setItem('cadastros', JSON.stringify(cadArr));
                }
            }
            // remover token após uso
            const map = JSON.parse(localStorage.getItem('pwResetTokens') || '{}');
            delete map[token];
            localStorage.setItem('pwResetTokens', JSON.stringify(map));

            msg.textContent = 'Senha redefinida localmente (ambiente dev). Faça login com a nova senha.';
            msg.className = 'text-green-600';
            setTimeout(() => window.location.href = 'login.html', 1500);
        } catch (err) {
            console.error('Erro ao aplicar fallback local de reset:', err);
            msg.textContent = 'Erro ao redefinir senha localmente.';
            msg.className = 'text-red-500';
        }
    });
});