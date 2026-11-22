/* Puuradministratie, homepage: bonnetjes-schakelaar, keuze per soort klant, vragen en de mail die klaarstaat. */
(() => {
  const MAIL = "info@puuradministratiekantoor.nl";
  const mailto = (subject, body) => `mailto:${MAIL}?subject=${encodeURIComponent(subject || "Kennismaking")}${body ? "&body=" + encodeURIComponent(body) : ""}`;
  const $ = s => document.querySelector(s);
  document.querySelectorAll(".js-mail").forEach(a => { a.href = mailto(a.dataset.subject, a.dataset.body); });

  /* ---------- Kop: zonder of met ---------- */
  const sw = $(".flip__sw");
  sw.addEventListener("click", e => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    sw.querySelectorAll("[data-v]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $("[data-mess]").hidden = b.dataset.v !== "zonder";
    $("[data-ledger]").hidden = b.dataset.v !== "met";
  });

  /* ---------- Voor wie ---------- */
  const WHO = [
    { k: "zorg", l: "Zzp'er in de zorg", who: "zzp'er in de zorg", h: "Jij zorgt voor je cliënten. Wij voor je cijfers.", p: "Je werkt voor een instelling, via een bemiddelaar of voor eigen cliënten. Veel zorg is vrijgesteld van btw, maar niet alles. Wij zoeken uit wat voor jou geldt.", list: [["Facturen en uren", "verwerkt"], ["Btw-vrijstelling", "uitgezocht"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "les", l: "Leraar of docent", who: "leraar of docent", h: "Les geven of bijles als zzp'er.", p: "Onderwijs is soms vrijgesteld van btw, bijvoorbeeld met een CRKBO-registratie. En werk je in loondienst met wat werk ernaast? Dan regelen we je aangifte.", list: [["Boekhouding", "doorlopend"], ["Btw", "als het nodig is"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "free", l: "Freelancer of creatief", who: "freelancer", h: "Jij maakt het werk. Wij houden de boeken bij.", p: "Ontwerper, fotograaf, ontwikkelaar of tekstschrijver: je stuurt facturen met btw en koopt spullen voor je werk. Wij zorgen dat je alles goed aftrekt.", list: [["Facturen en kosten", "verwerkt"], ["Btw-aangifte", "per kwartaal"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "bouw", l: "Bouw en klussen", who: "zzp'er in de bouw", h: "Klussen, materiaal en verlegde btw.", p: "Werk je als onderaannemer, dan geldt vaak de verleggingsregeling: je factureert zonder btw. Wij zorgen dat je facturen en je aangifte daarop kloppen.", list: [["Facturen en materiaal", "verwerkt"], ["Btw verlegd", "goed aangegeven"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "kap", l: "Kapper of schoonheid", who: "kapper of schoonheidsspecialist", h: "Je salon draait. Je administratie ook.", p: "Pin en contant, behandelingen en producten. Knippen valt onder 9% btw, producten die je verkoopt meestal onder 21%. Wij houden dat uit elkaar.", list: [["Kassa en pin", "verwerkt"], ["Btw 9% en 21%", "gesplitst"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "taxi", l: "Taxichauffeur", who: "taxichauffeur", h: "Je ritten, kilometers en btw kloppen.", p: "Of je via Uber of Bolt rijdt of eigen klanten hebt: we weten hoe je ritadministratie werkt.", list: [["Ritadministratie", "per kwartaal"], ["Kilometers zakelijk en privé", "gescheiden"], ["Btw op personenvervoer", "9%"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "bol", l: "Bol-verkoper", who: "bol-verkoper", h: "Omzet, commissie en btw uit elkaar.", p: "Je bol-uitbetaling is niet je omzet. Wij boeken je verkopen, de commissie, retouren en voorraad apart, zodat je btw klopt.", list: [["Bol-overzichten", "per kwartaal"], ["Btw over verkopen", "aangegeven"], ["Btw op commissie", "teruggevraagd"], ["Inkomstenbelasting", "jaarlijks"]] },
    { k: "part", l: "Particulier", who: "particulier", h: "Je aangifte inkomstenbelasting, goed gedaan.", p: "Wij vullen je aangifte in en kijken wat je mag aftrekken. Je weet vooraf wat je moet betalen of terugkrijgt.", list: [["Aangifte inkomstenbelasting", "voor 1 mei"]] },
    { k: "bv", l: "Bv of groter bedrijf", who: "bv of groter bedrijf", h: "Een bv of een groter bedrijf?", p: "Dan kijken we eerst samen wat je nodig hebt. Je krijgt een offerte op maat, zodat je vooraf weet waar je aan toe bent.", list: [["Boekhouding", "op maat"], ["Btw-aangifte", "per maand of kwartaal"]], offer: true }
  ];
  const list = $("[data-list]"), panel = $("[data-panel]");
  list.innerHTML = WHO.map((w, i) => `<button type="button" role="tab" id="w-${w.k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-k="${w.k}">${w.l}</button>`).join("");
  function show(k, focus) {
    const w = WHO.find(x => x.k === k);
    list.querySelectorAll("[data-k]").forEach(b => {
      const on = b.dataset.k === k;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    panel.setAttribute("aria-labelledby", "w-" + k);
    const subj = w.offer ? "Offerte aanvragen" : "Kennismaking";
    const body = `Hoi Puuradministratie, ik ben ${w.who} en ik zoek hulp met mijn ${w.offer ? "administratie. Kunnen jullie een offerte maken?" : "boekhouding en aangifte."}`;
    panel.innerHTML = `<div class="who__l"><span class="k">${w.l}</span><h3>${w.h}</h3><p>${w.p}</p><a class="btn" href="${mailto(subj, body)}"><svg aria-hidden="true"><use href="#mail"/></svg>${w.offer ? "Vraag een offerte" : "Mail ons"}</a></div>
      <div class="who__r"><h4>Wat we voor je doen</h4><ul>${w.list.map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join("")}</ul><p class="hint">${w.offer ? "Prijs op offerte." : `Vaste prijs, vooraf afgesproken: vanaf <span class="todo">[EUR ..]</span>`}</p></div>`;
  }
  list.addEventListener("click", e => {
    const b = e.target.closest("[data-k]");
    if (!b) return;
    show(b.dataset.k);
    if (list.scrollWidth > list.clientWidth) b.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
  list.addEventListener("keydown", e => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const t = [...list.querySelectorAll("[data-k]")], i = t.indexOf(document.activeElement);
    if (i < 0) return;
    const n = t[(i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : t.length - 1)) % t.length];
    show(n.dataset.k, true);
    e.preventDefault();
  });
  show("zorg");

  /* ---------- Vragen (algemene uitleg) ---------- */
  const GROUPS = { alle: "Alle vragen", taxi: "Taxi", bol: "Bol", zzp: "Zzp'er", part: "Particulier", bv: "Bv" };
  const QA = [
    { g: "zzp", q: "Wanneer moet mijn btw-aangifte binnen zijn?", a: "Meestal per kwartaal. De aangifte moet binnen zijn op de laatste dag van de maand na het kwartaal: 30 april, 31 juli, 31 oktober en 31 januari.", b: "Wij houden de data bij en dienen op tijd in." },
    { g: "zzp", q: "Moet ik als zzp'er in de zorg btw rekenen?", a: "Dat hangt af van je werk. Medische zorg door een BIG-geregistreerde zorgverlener is vaak vrijgesteld van btw. Niet alle zorg valt daaronder.", b: "Wij zoeken uit wat voor jouw werk geldt." },
    { g: "zzp", q: "Welke bonnetjes moet ik bewaren?", a: "Alles wat met je werk te maken heeft: facturen die je stuurt, bonnetjes en facturen van wat je koopt, en je bankafschriften.", b: "Je administratie moet je 7 jaar bewaren. Hoe je het aan ons geeft, spreken we samen af." },
    { g: "taxi", q: "Welk btw-tarief reken ik als taxichauffeur?", a: "Voor personenvervoer geldt het lage tarief van 9%. Dat geldt voor je ritten, ook als die via een platform lopen.", b: "Wij zorgen dat je ritten met het juiste tarief in je aangifte staan." },
    { g: "taxi", q: "Ik rij via Uber of Bolt. Doe ik dan zelf aangifte?", a: "Ja. Rij je als zelfstandige, dan doe je zelf je btw-aangifte en je inkomstenbelasting. Het platform doet dat niet voor je.", b: "Wij verwerken de overzichten van het platform en je eigen ritten samen." },
    { g: "bol", q: "Is mijn bol-uitbetaling mijn omzet?", a: "Nee. Bol houdt commissie en kosten in voordat het uitbetaalt. Je omzet is wat je klanten betaalden.", b: "De commissie en kosten zijn aparte kostenposten. Wij halen dat uit je bol-overzichten." },
    { g: "bol", q: "Kan ik de btw op de bol-commissie terugvragen?", a: "Bol rekent btw over de commissie en kosten die het jou in rekening brengt. Ben je btw-ondernemer, dan mag je die btw meestal aftrekken in je aangifte.", b: "Wij nemen dat mee in je btw-aangifte." },
    { g: "bol", q: "Ik verkoop ook aan klanten in België. Wat dan?", a: "Verkoop je aan particulieren in andere EU-landen voor meer dan €10.000 per jaar bij elkaar, dan reken je de btw van het land van je klant.", b: "Met de OSS-regeling doe je daarvoor één aangifte in Nederland. Wij regelen die voor je." },
    { g: "part", q: "Moet ik als particulier aangifte doen?", a: "Als je een uitnodiging van de Belastingdienst krijgt, moet het. Krijg je die niet, dan kan het toch slim zijn, bijvoorbeeld als je geld terugkrijgt.", b: "De aangifte over vorig jaar doe je voor 1 mei. Wij vullen hem voor je in." },
    { g: "bv", q: "Werken jullie ook voor bv's?", a: "Ja. Voor een bv of een groter bedrijf maken we eerst een offerte, zodat je vooraf weet wat we doen en wat het kost.", b: "Mail ons wat je bedrijf doet, dan nemen we contact met je op." }
  ];
  const chips = $("[data-chips]"), qal = $("[data-qalist]"), input = $("[data-q]");
  let group = "alle";
  chips.innerHTML = Object.entries(GROUPS).map(([k, l]) => `<button type="button" data-g="${k}" aria-pressed="${k === "alle"}">${l}</button>`).join("");
  const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function renderQA() {
    const term = norm(input.value.trim());
    const hits = QA.filter(x => (group === "alle" || x.g === group) && (!term || norm(x.q + " " + x.a + " " + x.b).includes(term)));
    qal.innerHTML = hits.length
      ? hits.map((x, i) => `<details${i === 0 ? " open" : ""}><summary><strong>${x.q}</strong><small>${GROUPS[x.g]}</small></summary><div><p>${x.a}</p><p>${x.b}</p></div></details>`).join("")
      : `<p class="qa__empty">Geen vraag gevonden. Mail hem gerust naar ${MAIL}.</p>`;
  }
  chips.addEventListener("click", e => {
    const b = e.target.closest("[data-g]");
    if (!b) return;
    group = b.dataset.g;
    chips.querySelectorAll("[data-g]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    renderQA();
  });
  input.addEventListener("input", renderQA);
  renderQA();

  /* ---------- Contact: mail klaarzetten ---------- */
  const form = $("[data-quiz]");
  form.addEventListener("submit", e => e.preventDefault());
  form.querySelector("[data-who-opts]").innerHTML = WHO.map((w, i) => `<label><input type="radio" name="who" value="${w.k}" ${i === 0 ? "checked" : ""}><span>${w.l}</span></label>`).join("");
  function buildMail() {
    const w = WHO.find(x => x.k === form.querySelector('input[name="who"]:checked').value);
    const what = [...form.querySelectorAll('input[name="what"]:checked')].map(i => i.value);
    const offer = w.offer || what.includes("iets anders");
    const join = a => a.length > 1 ? a.slice(0, -1).join(", ") + " en " + a[a.length - 1] : a[0];
    const body = `Hoi Puuradministratie,\n\nIk ben ${w.who} en ik zoek hulp met ${what.length ? join(what) : "mijn administratie"}.\n${offer ? "Kunnen jullie een offerte maken?" : "Kunnen we kennismaken?"}\n\nMet vriendelijke groet,\n`;
    const subj = offer ? "Offerte aanvragen" : "Kennismaking";
    form.querySelector("[data-out]").textContent = `Aan: ${MAIL}\nOnderwerp: ${subj}\n\n${body}`;
    form.querySelector("[data-send]").href = mailto(subj, body);
  }
  form.addEventListener("change", buildMail);
  buildMail();

  /* ---------- Verschijnen tijdens het scrollen ---------- */
  window.puurKlaar = true;
  const enkel = [".hero__t > *", ".flip", ".head > *", ".who", ".deal", ".deal__more", ".qa", ".contact__t > *", ".quiz", ".foot > *"];
  const groepen = [".spec > article", ".mess .slip", ".who__list button"];
  const doelen = new Set(document.querySelectorAll(enkel.join(",")));
  groepen.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => { el.style.setProperty("--vertraging", (i * 0.08) + "s"); doelen.add(el); }));
  document.querySelectorAll(".hero__t > *, .head > *, .contact__t > *").forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--vertraging", (i * 0.09) + "s");
  });
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(items => items.forEach(it => {
      if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); }
    }), { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    doelen.forEach(el => { el.classList.add("reveal"); io.observe(el); });
  }

  $("[data-copy]").addEventListener("click", e => {
    const b = e.currentTarget;
    const select = () => getSelection().selectAllChildren($("[data-addr]"));
    const done = () => { b.textContent = "Gekopieerd"; setTimeout(() => { b.textContent = "Kopieer"; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(MAIL).then(done, select);
    else select();
  });
})();
