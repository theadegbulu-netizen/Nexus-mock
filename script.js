// ====== Stage 2: password toggle + live validation === 

// 1. Grab the elements we need (by the ids we put in the HTML)
const callsign = document.getElementById("callsign")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmPw = document.getElementById("confirm")

const callsignHint = document.getElementById("callsignHint")
const emailHint = document.getElementById("emailHint")
const passwordHint = document.getElementById("passwordHint")
const confirmHint = document.getElementById("confirmHint")
const bars = document.querySelectorAll(".strength-bar");

// 2. Remember which fields are valid (Stage 3 will use this)
const valid = { callsign: false, email: false, password: false, confirm: false };

// 3. Helper: show a hint in a state ("error", "ok" or "neutral")
function showHint (el, state, message) {
    el.textContent = message;
    el.classList.remove("hidden", "text-lime", "text-muted");
    el.classList.add(
        state === "error" ? "text-red-400" : state === "ok" ? "text-lime" : "text-muted"
    );
}

// 4. Helper: colour the input border to match its state
function setBorder (input, state) {
    input.classList.remove("border-red-400", "border-lime", "border-line");
    input.classList.add(
        state === "error" ? "border-red-400" : state === "ok" ? "border-lime" : "border-line"
    );
}

// -------- Show / hide password -------- 
document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.toggle);
        const showing = input.type === "text";
        input.type = showing ? "password" : "text";
        btn.classList.toggle("text-lime", !showing);
    });
});

// -------- Callsign -------------- 
function checkCallsign() {
    const value = callsign.value.trim();
    if (value === "") {
        valid.callsign = false;
        setBorder(callsign, "neutral");
        showHint(callsignHint, "neutral", "3-20 characters: letters, numbers, _ or -");
        return;
    }
    valid.callsign = /^[A-Za-z0-9_-]{3,20}$/.test(value);
    setBorder(callsign, valid.callsign ? "ok" : "error");
    showHint(callsignHint, valid.callsign ? "ok" : "error",
        valid.callsign ? "Callsign available" : "Use 3-20 letters, numbers, _ or -");
}

// ---------- Email ----------
function checkEmail() {
  const value = email.value.trim();
  if (value === "") {
    valid.email = false;
    setBorder(email, "neutral");
    emailHint.classList.add("hidden");
    return;
  }
  valid.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  setBorder(email, valid.email ? "ok" : "error");
  showHint(emailHint, valid.email ? "ok" : "error", valid.email ? "Email looks good" : "Enter a valid email address");
}

// ---------- Password + strength meter ----------
const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-300", "bg-lime"];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++; // upper + lower
  if (/\d/.test(pw)) score++;                        // a number
  if (/[^A-Za-z0-9]/.test(pw)) score++;              // a symbol
  return score; // 0 to 4
}

function checkPassword() {
  const value = password.value;
  const score = getStrength(value);

  // Colour the first `score` bars, reset the rest
  bars.forEach((bar, i) => {
    const color = i < score ? strengthColors[score - 1] : "bg-line";
    bar.className = `strength-bar h-0.5 flex-1 transition-colors ${color}`;
  });

  if (value === "") {
    valid.password = false;
    setBorder(password, "neutral");
    showHint(passwordHint, "neutral", "At least 8 characters");
  } else {
    valid.password = value.length >= 8;
    setBorder(password, valid.password ? "ok" : "error");
    const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
    showHint(passwordHint, valid.password ? "ok" : "error", labels[score]);
  }
  checkConfirm(); // the confirm field depends on this one
}

// ---------- Confirm password ----------
function checkConfirm() {
  const value = confirmPw.value;
  if (value === "") {
    valid.confirm = false;
    setBorder(confirmPw, "neutral");
    confirmHint.classList.add("hidden");
    return;
  }
  valid.confirm = value === password.value && valid.password;
  setBorder(confirmPw, valid.confirm ? "ok" : "error");
  showHint(confirmHint, valid.confirm ? "ok" : "error", valid.confirm ? "Passwords match" : "Passwords do not match");
}

// 5. Run the checks every time the user types
callsign.addEventListener("input", checkCallsign);
email.addEventListener("input", checkEmail);
password.addEventListener("input", checkPassword);
confirmPw.addEventListener("input", checkConfirm);
