document.addEventListener("DOMContentLoaded", () => {

  /*  THEME MANAGEMENT (ENHANCED)*/
  const body = document.body;

  const themeBtn = document.createElement("button");
  themeBtn.id = "dynamic-theme-toggle";
  themeBtn.setAttribute("aria-label", "Toggle Dark Mode");
  themeBtn.innerHTML = "🌙";

  Object.assign(themeBtn.style, {
    position: "fixed",
    top: "15px",
    right: "15px",
    zIndex: "10000",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "1.3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  });

  document.body.prepend(themeBtn);

  const applyTheme = (isDark) => {
    body.classList.toggle("dark", isDark);
    themeBtn.innerHTML = isDark ? "☀️" : "🌙";
    themeBtn.style.background = isDark ? "#1e293b" : "#fff";
    themeBtn.style.color = isDark ? "#fff" : "#111";
  };

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

  themeBtn.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* PROGRAM CARD INTERACTION*/
  document.querySelectorAll(".program-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.02)";
      card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });

  /* SMART MEDIA CONTROLLER*/
  const videos = document.querySelectorAll("video");
  const audios = document.querySelectorAll("audio");
  const iframes = document.querySelectorAll("iframe");

  const stopAllVideos = (except) => {
    videos.forEach(v => v !== except && v.pause());
    iframes.forEach(f => {
      if (f !== except) {
        const src = f.src;
        f.src = "";
        f.src = src;
      }
    });
  };

  videos.forEach(v => v.addEventListener("play", () => stopAllVideos(v)));
  audios.forEach(a => a.addEventListener("play", () => {
    audios.forEach(other => other !== a && other.pause());
  }));

  /* TABLE INTERACTIVITY*/
  document.querySelectorAll("tbody tr").forEach(row => {
    row.tabIndex = 0;

    row.addEventListener("mouseenter", () => {
      row.style.backgroundColor = body.classList.contains("dark")
        ? "#334155"
        : "#e0f2fe";
    });

    row.addEventListener("mouseleave", () => row.style.backgroundColor = "");

    row.addEventListener("focus", () => {
      row.style.outline = "2px solid #2563eb";
    });

    row.addEventListener("blur", () => {
      row.style.outline = "";
    });
  });

  /* DRAG & DROP (UPGRADED)*/
  const exercises = document.querySelectorAll(".exercise");
  const days = ["monday", "tuesday", "wednesday"];

  exercises.forEach(ex => {
    ex.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", ex.id);
      ex.style.opacity = "0.5";
    });
    ex.addEventListener("dragend", () => ex.style.opacity = "1");
  });

  window.allowDrop = e => e.preventDefault();

  window.drop = e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const original = document.getElementById(id);
    const target = e.target.closest("div[id]");

    if (!original || !target || !days.includes(target.id)) return;

    const clone = original.cloneNode(true);
    clone.id = `${id}-${Date.now()}`;
    clone.classList.add("planned-exercise");

    const removeBtn = document.createElement("span");
    removeBtn.textContent = " ✖";
    removeBtn.style.cssText = "color:red;cursor:pointer;font-weight:bold;";
    removeBtn.onclick = () => {
      clone.remove();
      savePlan();
    };

    clone.appendChild(removeBtn);
    target.appendChild(clone);

    savePlan();
  };

  /* SAVE / RESTORE WEEKLY PLAN*/
  const savePlan = () => {
    const plan = {};
    days.forEach(day => {
      plan[day] = [...document.querySelectorAll(`#${day} .planned-exercise`)]
        .map(el => el.firstChild.textContent.trim());
    });
    localStorage.setItem("weeklyPlan", JSON.stringify(plan));
  };

  const restorePlan = () => {
    const saved = JSON.parse(localStorage.getItem("weeklyPlan"));
    if (!saved) return;

    days.forEach(day => {
      const container = document.getElementById(day);
      saved[day]?.forEach(text => {
        const div = document.createElement("div");
        div.className = "planned-exercise";
        div.textContent = text;
        container.appendChild(div);
      });
    });
  };

  restorePlan();

  /*  FOOTER YEAR AUTO UPDATE*/
  const footerP = document.querySelector("footer p");
  if (footerP) {
    footerP.innerHTML = `&copy; Marta Tegegne ${new Date().getFullYear()}. All rights reserved.`;
  }

});
