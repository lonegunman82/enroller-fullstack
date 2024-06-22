import React, { useState } from "react";

export default function LoginForm({ onLogin, buttonLabel }) {
    const [email, setEmail] = useState('');

    const handleLoginClick = async () => {
        const response = await fetch(`/api/participants/`, {
            method: 'POST',
            body: JSON.stringify({"login": email}),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {

            onLogin(email);
        } else {
            console.error("Błąd podczas logowania");
        }
    };

    return (
        <div>
            <label>Zaloguj się e-mailem</label>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                type="button"
                onClick={handleLoginClick}
            >
                {buttonLabel || 'Wchodzę'}
            </button>
        </div>
    );
}



// import {useState} from "react";
//
// export default function LoginForm({onLogin, buttonLabel}) {
//     const [email, setEmail] = useState('');
//
//     return <div>
//         <label>Zaloguj się e-mailem</label>
//         <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
//         <button type="button" onClick={() => onLogin(email)}>{buttonLabel || 'Wchodzę'}</button>
//     </div>;
// }
