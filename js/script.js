const passOutput = document.getElementById("pass-output");
const regenBtn = document.getElementById("regen-btn");
const saveBtn = document.getElementById("save-btn");
const savedList = document.getElementById("saved-list");

let savedPasswords = [];

function loadFromLocalStorage() {
  const saved = localStorage.getItem("savedPasswords");
  if (saved) {
    savedPasswords = JSON.parse(saved);
  }
}

function saveToLocalStorage() {
  localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
}

function generatePassword(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let pass = "";

  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }

  return pass;
}

function maskPassword(password) {
  if (password.length <= 4) {
    return "*".repeat(password.length);
  }

  const start = password.slice(0, 2);
  const end = password.slice(-2);
  const middle = "*".repeat(password.length - 4);

  return start + middle + end;
}

function renderSavedPasswords() {
  savedList.innerHTML = "";

  savedPasswords.forEach((item, index) => {
    const container = document.createElement("div");

    const label = document.createElement("p");

    // show masked by default
    const displayPass = item.hidden
      ? maskPassword(item.password)
      : item.password;
    label.textContent = item.name + ": " + displayPass;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.id = "delete-btn";
    deleteBtn.onclick = () => {
      savedPasswords.splice(index, 1);
      saveToLocalStorage();
      renderSavedPasswords();
    };

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "copy";
    copyBtn.id = "copy-btn";
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(item.password);
    };

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "rename";
    renameBtn.id = "rename-btn";
    renameBtn.onclick = () => {
      const newName = prompt("New name:", item.name);
      if (newName && newName.trim() !== "") {
        item.name = newName.trim();
        saveToLocalStorage();
        renderSavedPasswords();
      }
    };

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = item.hidden ? "show" : "hide";
    toggleBtn.id = "toggle-btn";
    toggleBtn.onclick = () => {
      item.hidden = !item.hidden;
      saveToLocalStorage();
      renderSavedPasswords();
    };

    container.appendChild(label);
    container.appendChild(deleteBtn);
    container.appendChild(copyBtn);
    container.appendChild(renameBtn);
    container.appendChild(toggleBtn);

    savedList.appendChild(container);
  });
}

regenBtn.onclick = () => {
  passOutput.textContent = generatePassword();
};

saveBtn.onclick = () => {
  if (passOutput.textContent.trim() === "") return;

  savedPasswords.push({
    name: "Password " + (savedPasswords.length + 1),
    password: passOutput.textContent,
    hidden: true,
  });

  saveToLocalStorage();
  renderSavedPasswords();
};

loadFromLocalStorage();
passOutput.textContent = generatePassword();
renderSavedPasswords();
