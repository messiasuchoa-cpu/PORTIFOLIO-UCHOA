document.documentElement.classList.add('js');

const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-site-menu]');

if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
        menu.classList.toggle('is-open', !isOpen);
    });

    menu.addEventListener('click', (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Abrir menu');
            menu.classList.remove('is-open');
        }
    });
}

const revealItems = document.querySelectorAll('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

const typedText = document.querySelector('[data-typewriter]');

if (typedText && !reducedMotion) {
    const phrase = typedText.textContent.trim();
    typedText.textContent = '';
    typedText.setAttribute('aria-label', phrase);
    typedText.insertAdjacentHTML('afterend', '<span class="typing-caret" aria-hidden="true"></span>');

    let position = 0;
    const writeNextCharacter = () => {
        if (position < phrase.length) {
            typedText.textContent += phrase.charAt(position);
            position += 1;
            window.setTimeout(writeNextCharacter, 64 + Math.random() * 48);
        } else {
            const caret = typedText.nextElementSibling;
            if (caret) caret.remove();
        }
    };

    window.setTimeout(writeNextCharacter, 400);
}

const contactForm = document.querySelector('[data-contact-form]');

if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const name = String(formData.get('nome') ?? '').trim();
        const email = String(formData.get('email') ?? '').trim();
        const message = String(formData.get('mensagem') ?? '').trim();
        const subject = encodeURIComponent(`Contato pelo portfólio — ${name}`);
        const body = encodeURIComponent(`Olá, Messias!\n\n${message}\n\nEnviado por: ${name}\nE-mail para resposta: ${email}`);
        const status = contactForm.querySelector('[data-form-status]');

        if (status) status.textContent = 'Abrindo seu aplicativo de e-mail para revisar e enviar a mensagem...';
        window.location.href = `mailto:messiasdesouzauchoa@gmail.com?subject=${subject}&body=${body}`;
    });
}
