function validateEmail(event) {
  if (event && event.preventDefault) event.preventDefault();

  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const login = document.getElementById("login");

  const email = emailEl ? String(emailEl.value).trim() : "";
  const password = passwordEl ? String(passwordEl.value) : "";

  // Helpers (no regex):
  function isFirstCharUpper(str) {
    if (!str || str.length === 0) return false;
    const ch = str.charAt(0);
    const code = ch.charCodeAt(0);
    return code >= 65 && code <= 90; // 'A'..'Z'
  }

  function containsSpecialChar(str) {
    for (let i = 0; i < str.length; i++) {
      const ch = str.charAt(i);
      const code = ch.charCodeAt(0);
      const isDigit = code >= 48 && code <= 57; // '0'..'9'
      const isUpper = code >= 65 && code <= 90; // 'A'..'Z'
      const isLower = code >= 97 && code <= 122; // 'a'..'z'
      if (!isDigit && !isUpper && !isLower) {
        return true;
      }
    }
    return false;
  }

  const minLength = 8;

  // Email basic check
  if (!email.includes("@") || !email.includes(".")) {
    if (login) login.disabled = true;
    alert("Please enter a valid email address.");
    return;
  }

  // Password length check
  if (password.length < minLength) {
    if (login) login.disabled = true;
    alert("Password must be at least " + minLength + " characters.");
    return;
  }

  // First char uppercase
  if (!isFirstCharUpper(password)) {
    if (login) login.disabled = true;
    alert("Password must start with an uppercase letter.");
    return;
  }

  // Contains at least one special (non-alphanumeric) character
  if (!containsSpecialChar(password)) {
    if (login) login.disabled = true;
    alert(
      "Password must include at least one special character (non-alphanumeric).",
    );
    return;
  }

  // All checks passed
  if (login) login.disabled = false;
  alert("Login successful!");
}
