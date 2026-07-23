"use strict";
/* =========================================================================
   Metro Typing Thailand — TypeScript source
   Single-player typing game using real BTS / MRT station names & order.
   Compiles to plain JS with `tsc` (see tsconfig.json), no bundler needed.
   ========================================================================= */
/* ----------------------------- Station data ----------------------------- */
/* th = Thai name, en = English name, code = official/approx station code.
   Verified against current BTS/MRT route listings. */
const LINES = {
    sukhumvit: {
        label: "BTS สายสุขุมวิท",
        short: "Sukhumvit",
        colorHex: "#8fc31f",
        stations: [
            { code: "N24", th: "คูคต", en: "Khu Khot" },
            { code: "N23", th: "แยก คปอ.", en: "Yaek Kor Por Aor" },
            { code: "N22", th: "พิพิธภัณฑ์กองทัพอากาศ", en: "Royal Thai Air Force Museum" },
            { code: "N21", th: "โรงพยาบาลภูมิพลอดุลยเดช", en: "Bhumibol Adulyadej Hospital" },
            { code: "N20", th: "สะพานใหม่", en: "Saphan Mai" },
            { code: "N19", th: "สายหยุด", en: "Sai Yud" },
            { code: "N18", th: "พหลโยธิน 59", en: "Phahon Yothin 59" },
            { code: "N17", th: "วัดพระศรีมหาธาตุ", en: "Wat Phra Sri Mahathat" },
            { code: "N16", th: "กรมทหารราบที่ 11", en: "11th Infantry Regiment" },
            { code: "N15", th: "บางบัว", en: "Bang Bua" },
            { code: "N14", th: "กรมป่าไม้", en: "Royal Forest Department" },
            { code: "N13", th: "มหาวิทยาลัยเกษตรศาสตร์", en: "Kasetsart University" },
            { code: "N12", th: "เสนานิคม", en: "Sena Nikhom" },
            { code: "N11", th: "รัชโยธิน", en: "Ratchayothin" },
            { code: "N10", th: "พหลโยธิน 24", en: "Phahon Yothin 24" },
            { code: "N9", th: "ห้าแยกลาดพร้าว", en: "Ha Yaek Lat Phrao" },
            { code: "N8", th: "หมอชิต", en: "Mo Chit" },
            { code: "N7", th: "สะพานควาย", en: "Saphan Khwai" },
            { code: "N5", th: "อารีย์", en: "Ari" },
            { code: "N4", th: "สนามเป้า", en: "Sanam Pao" },
            { code: "N3", th: "อนุสาวรีย์ชัยสมรภูมิ", en: "Victory Monument" },
            { code: "N2", th: "พญาไท", en: "Phaya Thai" },
            { code: "N1", th: "ราชเทวี", en: "Ratchathewi" },
            { code: "CEN", th: "สยาม", en: "Siam" },
            { code: "E1", th: "ชิดลม", en: "Chit Lom" },
            { code: "E2", th: "เพลินจิต", en: "Phloen Chit" },
            { code: "E3", th: "นานา", en: "Nana" },
            { code: "E4", th: "อโศก", en: "Asok" },
            { code: "E5", th: "พร้อมพงษ์", en: "Phrom Phong" },
            { code: "E6", th: "ทองหล่อ", en: "Thong Lo" },
            { code: "E7", th: "เอกมัย", en: "Ekkamai" },
            { code: "E8", th: "พระโขนง", en: "Phra Khanong" },
            { code: "E9", th: "อ่อนนุช", en: "On Nut" },
            { code: "E10", th: "บางจาก", en: "Bang Chak" },
            { code: "E11", th: "ปุณณวิถี", en: "Punnawithi" },
            { code: "E12", th: "อุดมสุข", en: "Udom Suk" },
            { code: "E13", th: "บางนา", en: "Bang Na" },
            { code: "E14", th: "แบริ่ง", en: "Bearing" },
            { code: "E15", th: "สำโรง", en: "Samrong" },
            { code: "E16", th: "ปู่เจ้า", en: "Pu Chao" },
            { code: "E17", th: "ช้างเอราวัณ", en: "Chang Erawan" },
            { code: "E18", th: "โรงเรียนนายเรือ", en: "Royal Thai Naval Academy" },
            { code: "E19", th: "ปากน้ำ", en: "Pak Nam" },
            { code: "E20", th: "ศรีนครินทร์", en: "Srinagarindra" },
            { code: "E21", th: "แพรกษา", en: "Phraek Sa" },
            { code: "E22", th: "สายลวด", en: "Sai Luat" },
            { code: "E23", th: "เคหะฯ", en: "Kheha" },
        ],
    },
    silom: {
        label: "BTS สายสีลม",
        short: "Silom",
        colorHex: "#00754a",
        stations: [
            { code: "W1", th: "สนามกีฬาแห่งชาติ", en: "National Stadium" },
            { code: "CEN", th: "สยาม", en: "Siam" },
            { code: "S1", th: "ราชดำริ", en: "Ratchadamri" },
            { code: "S2", th: "ศาลาแดง", en: "Sala Daeng" },
            { code: "S3", th: "ช่องนนทรี", en: "Chong Nonsi" },
            { code: "S4", th: "เซนต์หลุยส์", en: "Saint Louis" },
            { code: "S5", th: "สุรศักดิ์", en: "Surasak" },
            { code: "S6", th: "สะพานตากสิน", en: "Saphan Taksin" },
            { code: "S7", th: "กรุงธนบุรี", en: "Krung Thon Buri" },
            { code: "S8", th: "วงเวียนใหญ่", en: "Wongwian Yai" },
            { code: "S9", th: "โพธิ์นิมิตร", en: "Pho Nimit" },
            { code: "S10", th: "ตลาดพลู", en: "Talat Phlu" },
            { code: "S11", th: "วุฒากาศ", en: "Wutthakat" },
            { code: "S12", th: "บางหว้า", en: "Bang Wa" },
        ],
    },
    blue: {
        label: "MRT สายสีน้ำเงิน",
        short: "Blue Line",
        colorHex: "#1f4fb0",
        stations: [
            { code: "BL", th: "หลักสอง", en: "Lak Song" },
            { code: "BL", th: "บางแค", en: "Bang Khae" },
            { code: "BL", th: "เพชรเกษม 48", en: "Phetkasem 48" },
            { code: "BL", th: "ภาษีเจริญ", en: "Phasi Charoen" },
            { code: "BL", th: "บางหว้า", en: "Bang Wa" },
            { code: "BL", th: "บางไผ่", en: "Bang Phai" },
            { code: "BL", th: "ท่าพระ", en: "Tha Phra" },
            { code: "BL", th: "อิสรภาพ", en: "Itsaraphap" },
            { code: "BL", th: "สนามไชย", en: "Sanam Chai" },
            { code: "BL", th: "สามยอด", en: "Sam Yot" },
            { code: "BL", th: "วัดมังกร", en: "Wat Mangkon" },
            { code: "BL", th: "หัวลำโพง", en: "Hua Lamphong" },
            { code: "BL", th: "สามย่าน", en: "Sam Yan" },
            { code: "BL", th: "สีลม", en: "Si Lom" },
            { code: "BL", th: "ลุมพินี", en: "Lumphini" },
            { code: "BL", th: "คลองเตย", en: "Khlong Toei" },
            { code: "BL", th: "ศูนย์การประชุมแห่งชาติสิริกิติ์", en: "Queen Sirikit National Convention Centre" },
            { code: "BL", th: "สุขุมวิท", en: "Sukhumvit" },
            { code: "BL", th: "เพชรบุรี", en: "Phetchaburi" },
            { code: "BL", th: "พระราม 9", en: "Phra Ram 9" },
            { code: "BL", th: "ศูนย์วัฒนธรรมแห่งประเทศไทย", en: "Thailand Cultural Centre" },
            { code: "BL", th: "ห้วยขวาง", en: "Huai Khwang" },
            { code: "BL", th: "สุทธิสาร", en: "Sutthisan" },
            { code: "BL", th: "รัชดาภิเษก", en: "Ratchadaphisek" },
            { code: "BL", th: "ลาดพร้าว", en: "Lat Phrao" },
            { code: "BL", th: "พหลโยธิน", en: "Phahon Yothin" },
            { code: "BL", th: "สวนจตุจักร", en: "Chatuchak Park" },
            { code: "BL", th: "กำแพงเพชร", en: "Kamphaeng Phet" },
            { code: "BL", th: "บางซื่อ", en: "Bang Sue" },
            { code: "BL", th: "เตาปูน", en: "Tao Poon" },
            { code: "BL", th: "บางโพ", en: "Bang Pho" },
            { code: "BL", th: "บางอ้อ", en: "Bang O" },
            { code: "BL", th: "บางพลัด", en: "Bang Phlat" },
            { code: "BL", th: "สิรินธร", en: "Sirindhorn" },
            { code: "BL", th: "บางยี่ขัน", en: "Bang Yi Khan" },
            { code: "BL", th: "บางขุนนนท์", en: "Bang Khun Non" },
            { code: "BL", th: "ไฟฉาย", en: "Fai Chai" },
            { code: "BL", th: "จรัญฯ 13", en: "Charan 13" },
        ],
    },
    purple: {
        label: "MRT สายสีม่วง",
        short: "Purple Line",
        colorHex: "#7c3aa8",
        stations: [
            { code: "PP01", th: "คลองบางไผ่", en: "Khlong Bang Phai" },
            { code: "PP02", th: "ตลาดบางใหญ่", en: "Talad Bang Yai" },
            { code: "PP03", th: "สามแยกบางใหญ่", en: "Sam Yaek Bang Yai" },
            { code: "PP04", th: "บางพลู", en: "Bang Phlu" },
            { code: "PP05", th: "บางรักใหญ่", en: "Bang Rak Yai" },
            { code: "PP06", th: "บางรักน้อยท่าอิฐ", en: "Bang Rak Noi Tha It" },
            { code: "PP07", th: "ไทรม้า", en: "Sai Ma" },
            { code: "PP08", th: "สะพานพระนั่งเกล้า", en: "Saphan Phra Nang Klao" },
            { code: "PP09", th: "แยกนนทบุรี 1", en: "Yaek Nonthaburi 1" },
            { code: "PP10", th: "บางกระสอ", en: "Bang Kraso" },
            { code: "PP11", th: "ศูนย์ราชการนนทบุรี", en: "Nonthaburi Civic Center" },
            { code: "PP12", th: "กระทรวงสาธารณสุข", en: "Ministry of Public Health" },
            { code: "PP13", th: "แยกติวานนท์", en: "Yaek Tiwanon" },
            { code: "PP14", th: "วงศ์สว่าง", en: "Wong Sawang" },
            { code: "PP15", th: "บางซ่อน", en: "Bang Son" },
            { code: "PP16", th: "เตาปูน", en: "Tao Poon" },
        ],
    },
};
/* ----------------------------- DOM helpers ----------------------------- */
function $(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element #${id}`);
    return el;
}
/* ----------------------------- Game class ------------------------------- */
class MetroTypingGame {
    constructor() {
        this.state = {
            lineKey: null,
            lang: "th",
            mode: null,
            route: [],
            idx: 0,
            typed: "",
            startTime: 0,
            totalChars: 0,
            correctChars: 0,
            errors: 0,
            combo: 0,
            maxCombo: 0,
            timerHandle: undefined,
        };
        this.lineGrid = $("lineGrid");
        this.fromSel = $("fromSel");
        this.toSel = $("toSel");
        this.customRange = $("customRange");
        this.startBtn = $("startBtn");
        this.typeInput = $("typeInput");
        this.routePreview = $("routePreview");
        this.routeMap = $("routeMap");
        this.screenMenu = $("screenMenu");
        this.screenGame = $("screenGame");
        this.screenResult = $("screenResult");
        this.buildLineCards();
        this.bindModeButtons();
        this.bindLangButtons();
        this.bindStaticButtons();
        this.bindTypingInput();
        this.selectLine("blue");
        document.querySelectorAll(".mode-btn").forEach((btn) => {
            if (btn.dataset.mode === "full")
                btn.click();
        });
    }
    /* ---------- menu construction ---------- */
    buildLineCards() {
        const preferredOrder = ["blue", "purple", "sukhumvit", "silom"];
        const orderedKeys = [
            ...preferredOrder.filter((key) => key in LINES),
            ...Object.keys(LINES).filter((key) => !preferredOrder.includes(key)),
        ];
        orderedKeys.forEach((key) => {
            const line = LINES[key];
            const card = document.createElement("button");
            card.className = "line-card";
            card.style.setProperty("--card-color", line.colorHex);
            card.dataset.line = key;
            card.innerHTML = `<div class="lname"><span class="line-dot"></span>${line.label}</div>
                         <div class="lmeta">${line.stations.length} สถานี</div>`;
            card.addEventListener("click", () => this.selectLine(key));
            this.lineGrid.appendChild(card);
        });
    }
    selectLine(key) {
        this.state.lineKey = key;
        document.querySelectorAll(".line-card").forEach((c) => {
            c.classList.toggle("selected", c.dataset.line === key);
        });
        document.documentElement.style.setProperty("--line-color", LINES[key].colorHex);
        $("titleAccent").style.color = LINES[key].colorHex;
        const line = LINES[key];
        this.routePreview.innerHTML = this.buildMapMarkup(line.stations, 0, line.label, line.colorHex, true);
        this.populateRangeSelects();
        this.validateStart();
    }
    populateRangeSelects() {
        this.fromSel.innerHTML = "";
        this.toSel.innerHTML = "";
        if (!this.state.lineKey)
            return;
        LINES[this.state.lineKey].stations.forEach((s, i) => {
            const label = `${s.th}${s.en ? " · " + s.en : ""}`;
            this.fromSel.innerHTML += `<option value="${i}">${label}</option>`;
            this.toSel.innerHTML += `<option value="${i}">${label}</option>`;
        });
        this.toSel.selectedIndex = LINES[this.state.lineKey].stations.length - 1;
    }
    bindModeButtons() {
        document.querySelectorAll(".mode-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".mode-btn").forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                this.state.mode = btn.dataset.mode;
                this.customRange.classList.toggle("hidden", this.state.mode !== "custom");
                this.validateStart();
            });
        });
    }
    bindLangButtons() {
        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                this.state.lang = btn.dataset.lang;
            });
        });
    }
    validateStart() {
        this.startBtn.disabled = !(this.state.lineKey && this.state.mode);
    }
    bindStaticButtons() {
        this.startBtn.addEventListener("click", () => {
            this.state.route = this.buildRoute();
            this.startGame();
        });
        $("quitLink").addEventListener("click", () => {
            window.clearInterval(this.state.timerHandle);
            this.showScreen("menu");
        });
        $("menuBtn").addEventListener("click", () => this.showScreen("menu"));
        $("againBtn").addEventListener("click", () => this.startGame());
    }
    /* ---------- route building ---------- */
    buildRoute() {
        if (!this.state.lineKey)
            return [];
        const stations = LINES[this.state.lineKey].stations.slice();
        let route;
        switch (this.state.mode) {
            case "full":
                route = stations.slice();
                break;
            case "reverse":
                route = stations.slice().reverse();
                break;
            case "custom": {
                const a = parseInt(this.fromSel.value, 10);
                const b = parseInt(this.toSel.value, 10);
                route = a <= b ? stations.slice(a, b + 1) : stations.slice(b, a + 1).reverse();
                if (route.length < 2)
                    route = stations.slice();
                break;
            }
            case "free": {
                route = stations.slice();
                for (let i = route.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [route[i], route[j]] = [route[j], route[i]];
                }
                break;
            }
            default:
                route = stations.slice();
        }
        return route;
    }
    /* ---------- screen management ---------- */
    showScreen(name) {
        this.screenMenu.classList.toggle("hidden", name !== "menu");
        this.screenGame.classList.toggle("hidden", name !== "game");
        this.screenResult.classList.toggle("hidden", name !== "result");
    }
    /* ---------- game flow ---------- */
    startGame() {
        const s = this.state;
        s.idx = 0;
        s.typed = "";
        s.startTime = performance.now();
        s.totalChars = 0;
        s.correctChars = 0;
        s.errors = 0;
        s.combo = 0;
        s.maxCombo = 0;
        $("railStart").textContent = s.route[0].th;
        $("railEnd").textContent = s.route[s.route.length - 1].th;
        this.buildRailDots();
        this.renderTarget();
        this.updateStats();
        this.showScreen("game");
        this.typeInput.value = "";
        window.clearInterval(s.timerHandle);
        s.timerHandle = window.setInterval(() => this.updateStats(), 100);
        setTimeout(() => this.typeInput.focus(), 50);
    }
    buildRailDots() {
        const wrap = $("railDots");
        wrap.innerHTML = "";
        this.state.route.forEach((_s, i) => {
            const d = document.createElement("div");
            d.className = "rail-dot";
            d.dataset.i = String(i);
            wrap.appendChild(d);
        });
        this.updateRail();
    }
    updateRail() {
        const s = this.state;
        const total = s.route.length - 1;
        const pct = total === 0 ? 100 : (s.idx / total) * 100;
        $("railFill").style.width = pct + "%";
        document.querySelectorAll(".rail-dot").forEach((d) => {
            const i = parseInt(d.dataset.i ?? "0", 10);
            d.classList.toggle("done", i < s.idx);
            d.classList.toggle("now", i === s.idx);
        });
        $("remainLabel").textContent = `เหลืออีก ${Math.max(0, s.route.length - 1 - s.idx)} สถานี`;
    }
    currentTarget() {
        return this.state.route[this.state.idx][this.state.lang];
    }
    renderTarget() {
        const s = this.state;
        const station = s.route[s.idx];
        $("flapCode").textContent = station.code || "—";
        const next = s.route[s.idx + 1];
        $("flapNext").innerHTML = next
            ? `สถานีถัดไป: <b>${next[s.lang]}</b>`
            : `<b>สถานีปลายทาง 🏁</b>`;
        this.renderTypedChars();
        this.updateRail();
        this.renderRouteMap();
    }
    renderTypedChars() {
        const target = this.currentTarget();
        const typed = this.state.typed;
        let html = "";
        for (let i = 0; i < target.length; i++) {
            let cls = "pending";
            if (i < typed.length) {
                cls = typed[i] === target[i] ? "correct" : "wrong";
            }
            const isCursor = i === typed.length ? " cursor" : "";
            const ch = target[i] === " " ? "&nbsp;" : target[i];
            html += `<span class="ch ${cls}${isCursor}">${ch}</span>`;
        }
        if (typed.length >= target.length) {
            html += '<span class="ch cursor">&nbsp;</span>';
        }
        $("flapName").innerHTML = html;
    }
    buildMapMarkup(route, currentIdx, title, color, compact) {
        if (!route.length)
            return "";
        const total = Math.max(route.length - 1, 1);
        const points = route.map((_, i) => {
            const x = 8 + (i / total) * 84;
            const y = 24 + (i % 2 === 0 ? 20 : 56);
            return `${x},${y}`;
        });
        const step = compact ? Math.max(1, Math.ceil(route.length / 6)) : 1;
        const labels = route
            .map((station, i) => {
            const x = 8 + (i / total) * 84;
            const y = 24 + (i % 2 === 0 ? 20 : 56);
            const show = compact ? i === 0 || i === route.length - 1 || i === currentIdx || i % step === 0 : true;
            if (!show)
                return "";
            const labelY = y - 8;
            const labelX = x + 1;
            return `<text class="route-map-label" x="${labelX}" y="${labelY}">${station.th}</text><text class="route-map-code" x="${labelX}" y="${labelY + 9}">${station.code || "—"}</text>`;
        })
            .join("");
        const stops = route
            .map((station, i) => {
            const x = 8 + (i / total) * 84;
            const y = 24 + (i % 2 === 0 ? 20 : 56);
            const cls = i < currentIdx ? "done" : i === currentIdx ? "current" : "pending";
            const fill = cls === "current" ? "#f2a93c" : cls === "done" ? color : "#ffffff";
            return `<circle cx="${x}" cy="${y}" r="${compact ? 4.4 : 3.6}" fill="${fill}" stroke="${color}" stroke-width="1.8" />`;
        })
            .join("");
        return `
      <div class="rp-title">ตัวอย่างเส้นทาง</div>
      <div class="rp-line">${title}</div>
      <div class="rp-sub">MRT route • สถานีจริงตามลำดับ</div>
      <svg class="route-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="2" y="2" width="96" height="96" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
        <path d="M ${points.join(" L ")}" stroke="${color}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        ${stops}
        ${labels}
      </svg>
      <div class="route-map-hint">สถานีปัจจุบันจะถูกเน้นด้วยสีเหลือง</div>
    `;
    }
    renderRouteMap() {
        const s = this.state;
        this.routeMap.innerHTML = "";
        if (!s.route.length)
            return;
        const line = LINES[s.lineKey ?? "blue"];
        this.routeMap.innerHTML = this.buildMapMarkup(s.route, s.idx, line.label, line.colorHex, false);
    }
    bindTypingInput() {
        this.typeInput.addEventListener("input", () => {
            const target = this.currentTarget();
            const val = this.typeInput.value;
            const s = this.state;
            if (val.length > s.typed.length) {
                const idx = s.typed.length;
                const expected = target[idx];
                const gotChar = val[idx];
                s.totalChars++;
                if (gotChar === expected) {
                    s.correctChars++;
                    s.combo++;
                    s.maxCombo = Math.max(s.maxCombo, s.combo);
                }
                else {
                    s.errors++;
                    s.combo = 0;
                    this.typeInput.classList.add("shake");
                    setTimeout(() => this.typeInput.classList.remove("shake"), 250);
                }
            }
            s.typed = val;
            this.renderTypedChars();
            this.updateStats();
            if (this.normalize(val) === this.normalize(target)) {
                this.advanceStation();
            }
        });
        this.typeInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const target = this.currentTarget();
                if (this.normalize(this.typeInput.value) === this.normalize(target)) {
                    this.advanceStation();
                }
            }
        });
    }
    normalize(str) {
        return str.trim().toLowerCase().replace(/\s+/g, " ");
    }
    advanceStation() {
        const s = this.state;
        if (s.idx >= s.route.length - 1) {
            this.finishGame();
            return;
        }
        s.idx++;
        s.typed = "";
        this.typeInput.value = "";
        this.renderTarget();
    }
    updateStats() {
        const s = this.state;
        const elapsedSec = (performance.now() - s.startTime) / 1000;
        $("statTime").textContent = elapsedSec.toFixed(1);
        const cpm = elapsedSec > 0 ? Math.round((s.correctChars / elapsedSec) * 60) : 0;
        $("statCpm").textContent = String(cpm);
        const acc = s.totalChars > 0 ? Math.round((s.correctChars / s.totalChars) * 100) : 100;
        $("statAcc").textContent = acc + "%";
        $("statCombo").textContent = String(s.combo);
    }
    finishGame() {
        const s = this.state;
        window.clearInterval(s.timerHandle);
        const elapsedSec = (performance.now() - s.startTime) / 1000;
        const cpm = elapsedSec > 0 ? Math.round((s.correctChars / elapsedSec) * 60) : 0;
        const acc = s.totalChars > 0 ? Math.round((s.correctChars / s.totalChars) * 100) : 100;
        $("resultLine").textContent = `${s.route[0].th} → ${s.route[s.route.length - 1].th}`;
        $("resTime").textContent = elapsedSec.toFixed(1) + "s";
        $("resCpm").textContent = String(cpm);
        $("resAcc").textContent = acc + "%";
        $("resErr").textContent = String(s.errors);
        $("resCombo").textContent = String(s.maxCombo);
        $("resStations").textContent = String(s.route.length);
        this.showScreen("result");
    }
}
/* ----------------------------- Bootstrap ----------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    new MetroTypingGame();
});
//# sourceMappingURL=game.js.map