
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameError = document.querySelector('.nameerror');
    const passwordError = document.querySelector('.passworderror');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // reset errors
        nameError.textContent = '';
        passwordError.textContent = '';

        // get values
        const username = form.name.value;
        const password = form.password.value;
        console.log(username);

        try {
            const res = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            console.log(data);
            if (data.errors) {
                nameError.textContent = data.errors.name;
                passwordError.textContent = data.errors.password;
            }
            if (data.user) {
                location.assign('/');
            }

        }
        catch (err) {
            console.log(err);
        }

    });
})
