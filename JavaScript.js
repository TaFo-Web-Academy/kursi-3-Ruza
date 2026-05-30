(function () {
    // ==================== APP STATE ====================
    const state = {
        currentSection: 'sectionHero',
        currentQuestionIndex: 0,
        answers: new Array(15).fill(null),
        totalScore: 0,
        blockScores: [0, 0, 0, 0, 0],
        transitioning: false,
    };

    // ==================== QUESTIONS DATA ====================
    const questions = [
        'Вақте мард ба ман камтар менависад, камтар диққат медиҳад ё сард мешавад, дар дарунам холигӣ ва нооромӣ бедор мешавад.',
        'Ман худро зебо, муҳим ва арзишманд бештар вақте ҳис мекунам, ки мард маро мебинад, таъриф мекунад ё мехоҳад.',
        'Вақте ман танҳо мемонам, гӯё чизе дар зиндагиям намерасад: на завқ, на энергия, на оромӣ.',
        'Ман аз мард на танҳо муҳаббат, балки пуштибонӣ, амният, пул, оромӣ ва ҳисси "ман танҳо нестам"-ро интизор мешавам.',
        'Дар дохилам як қисми ман мехоҳад, ки мард мисли падар бошад: муҳофизат кунад, роҳ нишон диҳад, масъулият гирад, маро наҷот диҳад.',
        'Вақте мард масъулият намегирад ё маро дар ҳолати ноором мегузорад, ман на танҳо хафа мешавам — ман мешиканам.',
        'Ман бештар ба мардҳои сард, дастнорас, номуайян ё камэҳсос ҷалб мешавам.',
        'Вақте мард дур мешавад, ман худро гум мекунам: анализ мекунам, интизор мешавам, телефон месанҷам, дарун метарсам.',
        'Дар муносибатҳои ман як сценарияи такрорӣ ҳаст: аввал умед, баъд наздикӣ, баъд сардӣ, баъд тарс ва часпидан.',
        'Барои писанд омадан, ман баъзан худро дигар мекунам: рафторам, либосам, овозам, фикрам, ҳатто ҳудудамро.',
        'Вақте мард ба ман маъқул мешавад, ман аз ҳолати занонаи ором мебароям: ё зиёд исбот мекунам, ё сахт мешавам, ё илтимосӣ мешавам.',
        'Ман бисёр энергияамро ба фикри мард медиҳам, на ба худ: на ба баданам, на ба кор, на ба ибодат, на ба оромии худам.',
        'Ман дер мефаҳмам, ки муносибат ба ман дард медиҳад. Аввал тоқат мекунам, умед мебандам, сабрро бо паст кардани худ омехта мекунам.',
        'Ман медонам, ки бояд худам тағйир ёбам, аммо як қисми дарунам ҳанӯз мехоҳад касе биёяд ва маро наҷот диҳад.',
        'Агар ҳамин хел идома ёбад, ман метарсам, ки боз солҳо дар ҳамин давр мемонам: интизорӣ, ноумедӣ, паст шудан, гиря, боз умед.',
    ];

    // ==================== ANSWER LABELS ====================
    const answerLabels = ['Не', 'Баъзан', 'Бисёр вақт', 'Қариб ҳамеша'];
    const answerPrefix = ['А', 'Б', 'В', 'Г'];

    // ==================== DOM REFS ====================
    const appContainer = document.getElementById('appContainer');
    const sectionHero = document.getElementById('sectionHero');
    const sectionIntro = document.getElementById('sectionIntro');
    const sectionTest = document.getElementById('sectionTest');
    const sectionResults = document.getElementById('sectionResults');
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');
    const questionCounter = document.getElementById('questionCounter');
    const questionText = document.getElementById('questionText');
    const answersGrid = document.getElementById('answersGrid');
    const resultsContent = document.getElementById('resultsContent');
    const btnStartHero = document.getElementById('btnStartHero');
    const btnStartTest = document.getElementById('btnStartTest');
    const btnBack = document.getElementById('btnBack');

    // ==================== HELPER: Switch Section ====================
    function switchSection(fromId, toId, callback) {
        if (state.transitioning) return;
        state.transitioning = true;
        const fromEl = document.getElementById(fromId);
        const toEl = document.getElementById(toId);

        if (fromEl && fromEl.classList.contains('active')) {
            fromEl.classList.add('fade-out');
            fromEl.addEventListener('animationend', function handler() {
                fromEl.removeEventListener('animationend', handler);
                fromEl.classList.remove('active', 'fade-out');
                state.currentSection = toId;
                toEl.classList.add('active');
                state.transitioning = false;
                if (callback) callback();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, { once: true });
        } else {
            document.querySelectorAll('.section.active').forEach(s => s.classList.remove('active', 'fade-out'));
            state.currentSection = toId;
            toEl.classList.add('active');
            state.transitioning = false;
            if (callback) callback();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ==================== RENDER QUESTION ====================
    function renderQuestion(index) {
        if (index < 0 || index >= questions.length) return;
        state.currentQuestionIndex = index;
        const qNum = index + 1;
        questionCounter.textContent = 'Саволи ' + qNum + ' аз 15';
        progressLabel.textContent = 'Саволи ' + qNum + ' аз 15';
        questionText.textContent = questions[index];

        answersGrid.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const btn = document.createElement('button');
            btn.className = 'btn-answer';
            btn.textContent = answerPrefix[i] + ' — ' + answerLabels[i];
            btn.setAttribute('data-value', i);
            btn.addEventListener('click', function () {
                handleAnswerSelection(index, i, btn);
            });
            if (state.answers[index] === i) {
                btn.classList.add('selected');
            }
            answersGrid.appendChild(btn);
        }

        const progressPercentAfter = Math.round((index / 15) * 100);
        progressFill.style.width = progressPercentAfter + '%';
    }

    // ==================== HANDLE ANSWER ====================
    function handleAnswerSelection(qIndex, value, clickedBtn) {
        if (state.transitioning) return;
        state.answers[qIndex] = value;
        const allBtns = answersGrid.querySelectorAll('.btn-answer');
        allBtns.forEach(b => b.classList.remove('selected'));
        clickedBtn.classList.add('selected');

        state.transitioning = true;
        setTimeout(() => {
            if (qIndex < 14) {
                const nextIndex = qIndex + 1;
                progressFill.style.width = Math.round((nextIndex / 15) * 100) + '%';
                const card = document.getElementById('questionCard');
                card.style.opacity = '0';
                card.style.transform = 'translateY(8px)';
                card.style.transition = 'all 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)';
                setTimeout(() => {
                    renderQuestion(nextIndex);
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    state.transitioning = false;
                    window.scrollTo({ top: card.offsetTop - 60, behavior: 'smooth' });
                }, 350);
            } else {
                progressFill.style.width = '100%';
                progressLabel.textContent = 'Саволи 15 аз 15';
                calculateResults();
                state.transitioning = false;
                switchSection('sectionTest', 'sectionResults', () => {
                    renderResults();
                    setTimeout(() => {
                        const resultsEl = document.getElementById('resultsContent');
                        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                });
            }
        }, 280);
    }

    // ==================== CALCULATE RESULTS ====================
    function calculateResults() {
        state.totalScore = state.answers.reduce((sum, val) => sum + (val !== null ? val : 0), 0);
        state.blockScores[0] = (state.answers[0] || 0) + (state.answers[1] || 0) + (state.answers[2] || 0);
        state.blockScores[1] = (state.answers[3] || 0) + (state.answers[4] || 0) + (state.answers[5] || 0);
        state.blockScores[2] = (state.answers[6] || 0) + (state.answers[7] || 0) + (state.answers[8] || 0);
        state.blockScores[3] = (state.answers[9] || 0) + (state.answers[10] || 0) + (state.answers[11] || 0);
        state.blockScores[4] = (state.answers[12] || 0) + (state.answers[13] || 0) + (state.answers[14] || 0);
    }

    function getResultData() {
        const ts = state.totalScore;
        if (ts <= 11) return getResult1();
        if (ts <= 23) return getResult2();
        if (ts <= 35) return getResult3();
        return getResult4();
    }

    function getResult1() {
        return {
            title: '«Ҳанӯз пурра дар капкан нестӣ»',
            text: 'Ту баъзан ба мард часпида мешавӣ, аммо ҳоло метавонӣ худро нигоҳ дорӣ. Лекин ҷойҳои холӣ ҳастанд. Агар ҳозир кор накунӣ, ҳамин холигӣ метавонад туро ба муносибати нодуруст барад.\n\nБа ту чӣ намерасад:\nробитаи амиқ бо худ.\n\nРоҳи хуруҷ:\nпеш аз муносибат,\nаввал фаҳм:\nман чӣ мехоҳам,\nчӣ қабул мекунам,\nчӣ қабул намекунам.',
        };
    }

    function getResult2() {
        return {
            title: '«Захм фаъол аст»',
            text: 'Ту муҳаббат мехоҳӣ, аммо бисёр вақт аз эҳтиёҷ амал мекунӣ. Вақте мард медиҳад — ту зинда мешавӣ. Вақте намедиҳад — ту холӣ мешавӣ.\n\nБа ту чӣ намерасад:\nоромӣ,\nдиққат,\nқабул\nва ҳисси "ман муҳимам".\n\nЧаро мард дур мешавад:\nчун ӯ ҳис мекунад,\nки ту аз ӯ на танҳо муҳаббат,\nбалки пуршавӣ мехоҳӣ.\nИн ба ӯ фишор медиҳад.\n\nРоҳи хуруҷ:\nаввал холигии худро бин.\nМард набояд манбаи ягонаи энергияат бошад.',
        };
    }

    function getResult3() {
        return {
            title: '«Вобастагӣ ва сценарияи такрорӣ»',
            text: 'Ин ҷо аллакай масъала ҷиддӣ аст. Ту эҳтимол дар муносибатҳо худро гум мекунӣ. Мард ба маркази асаб, фикр, рӯз ва арзиши ту табдил меёбад.\n\nБа ту чӣ намерасад:\nарзиши дохилӣ\nва эҳсоси амният.\n\nЧаро ту ҷолибиятро гум мекунӣ:\nна барои он ки ту зебо нестӣ.\n\nБарои он ки энергияат аз\n"ман пур ҳастам"\nнамеояд,\n\nаз\n"маро бин,\nмаро интихоб кун,\nмаро наҷот деҳ"\nмеояд.\n\nИн ҳолат ҷолибиятро паст мекунад.\n\nАгар ҳамин хел равад:\nту мардро не,\nбалки дарди кӯдакиатро таъқиб мекунӣ.\n\nВа ҳар мард метавонад\nба ту ҳамон дарди кӯҳнаро баргардонад.\n\nРоҳи хуруҷ:\nкор бо кӯдаки дарун,\nпастии арзиш,\nмарзҳо\nва тарси танҳоӣ.',
        };
    }

    function getResult4() {
        return {
            title: '«Ман худро дар муносибат гум кардаам»',
            text: 'Ин натиҷа сахт аст.\nЛекин рост аст:\n\nту эҳтимол муҳаббатро\nбо наҷот омехта кардаӣ.\n\nМард барои ту\nна танҳо мард,\nбалки дору,\nпадар,\nпуштибонӣ,\nисботи арзиш\nва роҳи гурез аз холигӣ шудааст.\n\nБа ту чӣ намерасад:\nхудат.\n\nНа мард.\nНа тӯҳфа.\nНа сухани ширин.\nНа обещание.\n\nБа ту худат намерасад:\nоромии худат,\nмарзи худат,\nарзиши худат,\nиртибот бо Аллоҳ\nва бо қалби худат.\n\nЧаро мард дур мешавад:\nчун вақте зан худро гум мекунад,\nдар муносибат вазнинӣ пайдо мешавад.\n\nМард эҳсос мекунад,\nки ӯ бояд тамоми холигии занро бардорад.\n\nИн муҳаббатро\nба масъулияти сангин табдил медиҳад.\n\nАгар ҳамин хел равад:\nту ҳар бор умед мебандӣ,\nҳар бор худро паст мекунӣ,\nҳар бор аз нав мешиканӣ.\n\nСолҳо мегузаранд,\nаммо сценария дигар намешавад:\n\nмарди нав —\nдарди кӯҳна.\n\nРоҳи хуруҷ:\nфавран ба худ баргаштан.\n\nНа барои нигоҳ доштани мард.\n\nБарои наҷот додани худат.',
        };
    }

    // ==================== BLOCK DATA ====================
    function getBlockData(blockIndex) {
        const blocks = [
            {
                title: '«Холигии дарун»',
                text: 'Ту аз дарун камбудӣ ҳис мекунӣ.\nБа ту эҳсоси пур будан намерасад.\n\nБарои ҳамин вақте мард меояд,\nту зинда мешавӣ;\nвақте меравад,\nту мешиканӣ.\n\nҲақиқат:\nмард холигии туро пур карда наметавонад.\n\nВай фақат онро муваққатан пӯшонида метавонад.',
            },
            {
                title: '«Мард ҳамчун наҷотдиҳанда»',
                text: 'Ту аз мард\nна танҳо муҳаббат,\nбалки амният,\nпуштибонӣ,\nпадарӣ\nва наҷот мехоҳӣ.\n\nҲақиқат:\nагар мардро наҷотдиҳанда кунӣ,\nдер ё зуд аз ӯ ранҷ мебинӣ.\n\nЧун ҳеҷ инсон\nвазифаи пур кардани ҳамаи захмҳои туро надорад.',
            },
            {
                title: '«Сценарияи такрорӣ»',
                text: 'Ту эҳтимол\nмардҳои дастнорасро интихоб мекунӣ,\n\nчун дарунат ба\n"муҳаббати сахтгир,\nномуайян,\nкамёб"\nодат кардааст.\n\nҲақиқат:\nту шояд муҳаббатро\nбо изтироб омехта кардаӣ.\n\nАгар дилат тез мезанад,\nин ҳамеша ишқ нест.\n\nБаъзан ин\nтарси партофта шудан аст.',
            },
            {
                title: '«Ҷолибият ва энергия»',
                text: 'Ту барои писанд омадан\nаз худ дур мешавӣ.\n\nВақте зан аз худ дур мешавад,\nҷолибияташ кам мешавад.\n\nНа аз зоҳир.\nАз энергия.\n\nҲақиқат:\nзан вақте ҷолиб аст,\nки худро гум намекунад.\n\nВақте фақат\n"маро интихоб кун"\nмегӯяд,\nэнергияаш заиф мешавад.',
            },
            {
                title: '«Тайёрӣ ба тағйир»',
                text: 'Ту медонӣ,\nки дард ҳаст,\n\nаммо ҳанӯз\nпурра масъулият нагирифтаӣ.\n\nЯк қисми ту\nмехоҳад бедор шавад,\n\nқисми дигар\nмехоҳад касе омада\nтуро халос кунад.\n\nҲақиқат:\nто даме ки ту интизорӣ,\nки мард туро наҷот диҳад,\n\nту қудрати худро\nба дасти ӯ медиҳӣ.',
            },
        ];
        return blocks[blockIndex] || null;
    }

    // ==================== RENDER RESULTS ====================
    function renderResults() {
        const resultData = getResultData();
        let html = '';

        // --- Блок 1: Главный результат ---
        html += '<div class="card-result result-reveal">';
        html += '<h2 class="result-title">' + escapeHTML(resultData.title) + '</h2>';
        html += '<p class="emotional-text">' + formatText(resultData.text) + '</p>';
        html += '<p class="text-secondary mt-16" style="font-size:0.9rem;">Ҷамъи холҳо: <strong>' + state.totalScore + '</strong> аз 45</p>';
        html += '</div>';

        // --- Блок 2: Анализ блоков (компактно, всё в одной карточке) ---
        const triggeredBlocks = [];
        for (let i = 0; i < 5; i++) {
            if (state.blockScores[i] >= 6) {
                const blockData = getBlockData(i);
                if (blockData) triggeredBlocks.push(blockData);
            }
        }
        if (triggeredBlocks.length > 0) {
            html += '<div class="card-block result-reveal">';
            triggeredBlocks.forEach((bd, idx) => {
                if (idx > 0) html += '<hr style="border:none;border-top:1px solid #f0ecef;margin:18px 0;">';
                html += '<h3 class="block-title">' + escapeHTML(bd.title) + '</h3>';
                html += '<p class="emotional-text">' + formatText(bd.text) + '</p>';
            });
            html += '</div>';
        }

        // --- Блок 3: CTA + пробуждение (объединено) ---
        html += '<div class="card-cta result-reveal mt-24">';
        html += '<p class="emotional-text-lg" style="text-align:center;margin-bottom:16px;">';
        html += '<em>Мушкили асосӣ ин нест, ки мардҳо баданд. Мушкили асосӣ ин аст, ки ту баъзан ба муносибат аз ҳолати холигӣ медароӣ.</em><br><br>';
        html += 'Агар ту дар ин тест худро шинохтӣ — ин тасодуф нест.<br>Ту ба дари бедорӣ расидӣ.<br><br>';
        html += 'Ман туро ба <strong>3 рӯзи ройгон</strong> даъват мекунам:<br>';
        html += '<strong>«Ман мард мехоҳам ё наҷотдиҳанда?»</strong><br><br>';
        html += '<strong>Рӯзи 1:</strong> Чаро ман бе диққати мард холӣ мешавам?<br>';
        html += '<strong>Рӯзи 2:</strong> Чаро ман аз мард наҷот мехоҳам?<br>';
        html += '<strong>Рӯзи 3:</strong> Чӣ гуна ба худ баргардам ва дигар аз тарс интихоб накунам?';
        html += '</p>';
        html += '<div style="margin-top:24px;">';
        html += '<button class="btn btn-primary" id="btnAdmin" style="font-size:1.05rem;padding:16px 40px;">Ворид шудан ба 3 рӯзи ройгон</button>';
        html += '</div>';
        html += '<div class="inline-flex-wrap mt-16">';
        html += '<a href="https://t.me/Jannat_Abdullaeva_Kanal" target="_blank" class="btn btn-telegram" style="font-size:0.9rem; display: inline-flex; align-items: center; justify-content: center; gap: 8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.578.192l-8.533 7.701-.33 4.955c.488 0 .703-.223.976-.485l2.344-2.279 4.875 3.6c.898.496 1.543.24 1.768-.83l3.195-15.059c.328-1.313-.502-1.91-1.361-1.514z"/></svg>Телеграм Канал</a>';
        html += '</div>';
        html += '</div>';

        resultsContent.innerHTML = html;

        const btnAdmin = document.getElementById('btnAdmin');
        if (btnAdmin) {
            btnAdmin.addEventListener('click', function () {
                window.open('https://t.me/Jannat_Abdullaeva_Admin', '_blank');
            });
        }
    }

    function restartTest() {
        state.answers = new Array(15).fill(null);
        state.totalScore = 0;
        state.blockScores = [0, 0, 0, 0, 0];
        state.currentQuestionIndex = 0;
        resultsContent.innerHTML = '';
        progressFill.style.width = '0%';
        progressLabel.textContent = 'Саволи 1 аз 15';
        switchSection('sectionResults', 'sectionHero');
    }

    // ==================== BACK BUTTON ====================
    function goBack() {
        if (state.transitioning) return;
        if (state.currentQuestionIndex > 0) {
            const prevIndex = state.currentQuestionIndex - 1;
            const card = document.getElementById('questionCard');
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            card.style.transition = 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)';
            setTimeout(() => {
                renderQuestion(prevIndex);
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300);
        } else {
            switchSection('sectionTest', 'sectionIntro');
        }
    }

    // ==================== FORMAT HELPERS ====================
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatText(text) {
        return escapeHTML(text).replace(/\n/g, '<br>');
    }

    // ==================== EVENT BINDINGS ====================
    btnStartHero.addEventListener('click', function () {
        switchSection('sectionHero', 'sectionIntro');
    });

    btnStartTest.addEventListener('click', function () {
        state.answers = new Array(15).fill(null);
        state.totalScore = 0;
        state.blockScores = [0, 0, 0, 0, 0];
        state.currentQuestionIndex = 0;
        progressFill.style.width = '0%';
        progressLabel.textContent = 'Саволи 1 аз 15';
        renderQuestion(0);
        switchSection('sectionIntro', 'sectionTest', () => {
            const card = document.getElementById('questionCard');
            if (card) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Back button
    if (btnBack) btnBack.addEventListener('click', goBack);

    // ==================== INIT ====================
    sectionHero.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderQuestion(0);

    console.log('✨ Психологический тест готов. Будьте бережны к себе.');
})();
