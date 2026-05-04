(function () {
    'use strict';

    const STORAGE_KEY = 'bloomtracker_data';

    const HABITS = [
        { id: 'water', icon: '💧', label: 'Drank 3.5L water' },
        { id: 'workout', icon: '🏋️', label: 'Workout done' },
        { id: 'steps', icon: '🚶', label: '6k–8k steps' },
        { id: 'no-sugar', icon: '🚫', label: 'No sugar' },
        { id: 'no-junk', icon: '🥗', label: 'No junk food' },
        { id: 'kind-to-others', icon: '🤍', label: "Kind to everyone" },
        { id: 'loving-partner', icon: '🥰', label: 'Loving partner' },
        { id: 'parents', icon: '📞', label: 'Talked to parents' },
        { id: 'no-overthinking', icon: '🧘', label: "Didn't overthink" },
        { id: 'boundaries', icon: '🛡️', label: 'Set boundaries' },
        { id: 'prioritize-self', icon: '👑', label: 'Prioritized myself' }
    ];

    const TOTAL_HABITS = 11;

    const MOODS = {
        1: { emoji: '😢', label: 'Terrible', color: '#ef4444' },
        2: { emoji: '😔', label: 'Low', color: '#f97316' },
        3: { emoji: '😐', label: 'Okay', color: '#eab308' },
        4: { emoji: '😊', label: 'Good', color: '#22c55e' },
        5: { emoji: '🥰', label: 'Amazing', color: '#ec4899' }
    };

    const OVERTHINK_LEVELS = {
        none: { emoji: '🌟', label: 'Not at all', score: 0 },
        little: { emoji: '🌤️', label: 'A little', score: 1 },
        moderate: { emoji: '☁️', label: 'Moderate', score: 2 },
        alot: { emoji: '🌧️', label: 'A lot', score: 3 },
        spiral: { emoji: '🌪️', label: 'Full spiral', score: 4 }
    };

    const PLANT_STAGES = [
        { min: 0, emoji: '🥀', label: 'Wilting' },
        { min: 4, emoji: '🌱', label: 'Sprouting' },
        { min: 6, emoji: '🌿', label: 'Growing' },
        { min: 8, emoji: '🌸', label: 'Blooming' },
        { min: 11, emoji: '🌺', label: 'Full Bloom!' }
    ];

    const QUOTES = [
        { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
        { text: "She remembered who she was and the game changed.", author: "Lalah Delia" },
        { text: "You don't have to be perfect to be worthy of love and belonging.", author: "Brené Brown" },
        { text: "The most powerful thing you can do is show up as yourself.", author: "" },
        { text: "Rest is not a reward. It is a right.", author: "" },
        { text: "You are not behind. You are exactly where you need to be.", author: "" },
        { text: "Your boundaries are not walls — they are the bridges to healthy relationships.", author: "" },
        { text: "Healing is not linear. Some days you bloom, some days you rest.", author: "" },
        { text: "You cannot pour from an empty cup. Take care of yourself first.", author: "" },
        { text: "Progress, not perfection. Every small step counts.", author: "" },
        { text: "Your worth is not determined by your productivity.", author: "" },
        { text: "It's okay to outgrow people, places, and patterns.", author: "" },
        { text: "The right people will never make you feel hard to love.", author: "" },
        { text: "Stop watering dead plants. Invest in what grows.", author: "" },
        { text: "You are not difficult. You just know what you deserve.", author: "" },
        { text: "Overthinking is just your brain trying to protect you. Thank it, then let go.", author: "" },
        { text: "Your feelings are valid even if others don't understand them.", author: "" },
        { text: "Being soft in a hard world is not weakness — it is courage.", author: "" },
        { text: "You don't need to set yourself on fire to keep others warm.", author: "" },
        { text: "Today's agenda: be kind to yourself. That's it. That's the whole list.", author: "" },
        { text: "Comparison is the thief of joy. Your journey is uniquely yours.", author: "Theodore Roosevelt" },
        { text: "Strong women don't have attitudes. They have standards.", author: "" },
        { text: "Sometimes the bravest thing you can do is ask for help.", author: "" },
        { text: "Your career does not define your worth as a human being.", author: "" },
        { text: "You are more than your code reviews, deadlines, and sprint velocity.", author: "" },
        { text: "Distance means nothing when someone means everything. Call your parents today.", author: "" },
        { text: "Choosing yourself is not selfish. It is necessary.", author: "" },
        { text: "You survived 100% of your worst days. You're doing better than you think.", author: "" },
        { text: "Not every thought deserves your attention. Let some pass like clouds.", author: "" },
        { text: "A woman who knows her worth doesn't measure herself against other women.", author: "" },
        { text: "Your energy is currency. Spend it wisely.", author: "" }
    ];

    // --- Storage ---

    function getData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { entries: {} };
        } catch {
            return { entries: {} };
        }
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }

    function getTodayEntry() {
        const data = getData();
        return data.entries[getTodayKey()] || null;
    }

    function saveTodayEntry(entry) {
        const data = getData();
        data.entries[getTodayKey()] = entry;
        saveData(data);
    }

    function getLast7Days() {
        const data = getData();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            days.push({
                key,
                date,
                entry: data.entries[key] || null
            });
        }
        return days;
    }

    function getRecentEntries(count) {
        const data = getData();
        return Object.entries(data.entries)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, count)
            .map(([key, entry]) => ({ ...entry, dateKey: key }));
    }

    // --- Daily Quote ---

    function getDailyQuote() {
        const today = getTodayKey();
        let seed = 0;
        for (let i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i);
        }
        return QUOTES[seed % QUOTES.length];
    }

    // --- Plant Logic ---

    function getPlantForScore(score) {
        let plant = PLANT_STAGES[0];
        for (const stage of PLANT_STAGES) {
            if (score >= stage.min) plant = stage;
        }
        return plant;
    }

    function getPlantMessage(score) {
        if (score === TOTAL_HABITS) return "Your plant is in FULL BLOOM! You're unstoppable! 🌺✨";
        if (score >= 8) return "Almost perfect! Your plant is blooming beautifully! 🌸";
        if (score >= 6) return "Your plant is growing nicely! Keep going! 🌿";
        if (score >= 4) return "A sprout! Every small effort counts. 🌱";
        if (score >= 1) return "Tomorrow is a fresh start. Be gentle with yourself. 💜";
        return "Start your check-in to grow your plant today!";
    }

    // --- Streak ---

    function calculateStreak() {
        const data = getData();
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            if (data.entries[key]) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    // --- Navigation ---

    function initNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById(`${view}-view`).classList.add('active');

                if (view === 'home') renderHome();
                if (view === 'garden') renderGarden();
                if (view === 'analysis') renderAnalysis();
            });
        });
    }

    // --- Home View ---

    function renderHome() {
        const quote = getDailyQuote();
        document.getElementById('daily-quote').textContent = `"${quote.text}"`;
        document.getElementById('quote-author').textContent = quote.author ? `— ${quote.author}` : '';

        const today = new Date();
        document.getElementById('today-date').textContent = today.toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric'
        });

        const entry = getTodayEntry();
        const habitCount = entry ? entry.habits.filter(Boolean).length : 0;
        const plant = getPlantForScore(habitCount);

        document.getElementById('home-plant-visual').textContent = plant.emoji;
        document.getElementById('plant-status-text').textContent = getPlantMessage(habitCount);
        document.getElementById('home-progress-number').textContent = habitCount;
        document.getElementById('home-progress-fill').style.width = `${(habitCount / TOTAL_HABITS) * 100}%`;

        document.getElementById('streak-count').textContent = calculateStreak();

        const last7 = getLast7Days();
        const daysWithEntries = last7.filter(d => d.entry);
        const totalHabits = daysWithEntries.reduce((sum, d) => sum + d.entry.habits.filter(Boolean).length, 0);
        const maxPossible = 7 * TOTAL_HABITS;
        const weekPercent = Math.round((totalHabits / maxPossible) * 100);
        document.getElementById('week-completion').textContent = `${weekPercent}%`;

        const moodsThisWeek = daysWithEntries.filter(d => d.entry.mood).map(d => d.entry.mood);
        const avgMood = moodsThisWeek.length > 0
            ? (moodsThisWeek.reduce((a, b) => a + b, 0) / moodsThisWeek.length).toFixed(1)
            : '—';
        document.getElementById('avg-mood-home').textContent = avgMood;
    }

    // --- Check-in View ---

    function initCheckin() {
        initHabits();
        initMoodSelector();
        initOverthinkSelector();
        initEmojiTags();
        initSleepSlider();
        initSaveButton();
        loadTodayIfExists();
    }

    function initSleepSlider() {
        const slider = document.getElementById('sleep-hours');
        const display = document.getElementById('sleep-value');
        slider.addEventListener('input', () => {
            display.textContent = slider.value;
        });
    }

    function initHabits() {
        document.querySelectorAll('.habit-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('checked');
            });
        });
    }

    function initMoodSelector() {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    }

    function initOverthinkSelector() {
        document.querySelectorAll('.overthink-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.overthink-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    }

    function initEmojiTags() {
        document.querySelectorAll('.emoji-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });
    }

    function initSaveButton() {
        document.getElementById('save-checkin').addEventListener('click', saveCheckin);
    }

    function saveCheckin() {
        const habits = HABITS.map(h => {
            const item = document.querySelector(`[data-habit="${h.id}"]`);
            return item.classList.contains('checked');
        });

        const moodBtn = document.querySelector('.mood-btn.selected');
        const mood = moodBtn ? parseInt(moodBtn.dataset.mood) : null;

        const overthinkBtn = document.querySelector('.overthink-btn.selected');
        const overthink = overthinkBtn ? overthinkBtn.dataset.overthink : null;

        const selectedEmojis = Array.from(document.querySelectorAll('.emoji-tag.selected'))
            .map(e => e.dataset.emoji);

        const sleepHours = parseFloat(document.getElementById('sleep-hours').value) || 0;
        const wentWell = document.getElementById('went-well').value.trim();
        const didntWork = document.getElementById('didnt-work').value.trim();
        const journalText = document.getElementById('journal-text').value.trim();

        const entry = {
            habits,
            mood,
            overthink,
            emojis: selectedEmojis,
            sleepHours,
            wentWell,
            didntWork,
            journal: journalText,
            timestamp: new Date().toISOString()
        };

        saveTodayEntry(entry);

        const successEl = document.getElementById('save-success');
        successEl.style.display = 'block';
        setTimeout(() => { successEl.style.display = 'none'; }, 4000);

        renderHome();
    }

    function loadTodayIfExists() {
        const entry = getTodayEntry();
        if (!entry) return;

        entry.habits.forEach((checked, i) => {
            if (checked && HABITS[i]) {
                const item = document.querySelector(`[data-habit="${HABITS[i].id}"]`);
                if (item) {
                    item.classList.add('checked');
                }
            }
        });

        if (entry.mood) {
            const moodBtn = document.querySelector(`.mood-btn[data-mood="${entry.mood}"]`);
            if (moodBtn) moodBtn.classList.add('selected');
        }

        if (entry.overthink) {
            const oBtn = document.querySelector(`.overthink-btn[data-overthink="${entry.overthink}"]`);
            if (oBtn) oBtn.classList.add('selected');
        }

        if (entry.emojis) {
            entry.emojis.forEach(emoji => {
                const tag = document.querySelector(`.emoji-tag[data-emoji="${emoji}"]`);
                if (tag) tag.classList.add('selected');
            });
        }

        if (entry.sleepHours !== undefined) {
            const slider = document.getElementById('sleep-hours');
            slider.value = entry.sleepHours;
            document.getElementById('sleep-value').textContent = entry.sleepHours;
        }

        if (entry.wentWell) {
            document.getElementById('went-well').value = entry.wentWell;
        }

        if (entry.didntWork) {
            document.getElementById('didnt-work').value = entry.didntWork;
        }

        if (entry.journal) {
            document.getElementById('journal-text').value = entry.journal;
        }
    }

    // --- Garden View ---

    function renderGarden() {
        const last7 = getLast7Days();
        const container = document.getElementById('garden-container');
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        container.innerHTML = last7.map(day => {
            const habitCount = day.entry ? day.entry.habits.filter(Boolean).length : 0;
            const plant = getPlantForScore(habitCount);
            const dayLabel = dayNames[day.date.getDay()];
            const isToday = day.key === getTodayKey();

            return `<div class="garden-day ${isToday ? 'today' : ''}">
                <span class="garden-plant">${day.entry ? plant.emoji : '🪴'}</span>
                <div class="garden-pot"></div>
                <span class="garden-day-label">${dayLabel}${isToday ? ' ✨' : ''}</span>
                <span class="garden-day-score">${day.entry ? `${habitCount}/${TOTAL_HABITS}` : '—'}</span>
            </div>`;
        }).join('');

        renderWeekBreakdown(last7);
    }

    function renderWeekBreakdown(last7) {
        const container = document.getElementById('week-habits-breakdown');
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        container.innerHTML = HABITS.map((habit, hi) => {
            const dots = last7.map(day => {
                if (!day.entry) return '<div class="habit-dot empty"></div>';
                const done = day.entry.habits[hi];
                return `<div class="habit-dot ${done ? 'done' : 'missed'}"></div>`;
            }).join('');

            return `<div class="week-habit-row">
                <span class="week-habit-label">${habit.icon} ${habit.label}</span>
                <div class="week-habit-dots">${dots}</div>
            </div>`;
        }).join('');

        const headerDots = last7.map(day => {
            const dn = dayNames[day.date.getDay()];
            return `<div class="habit-dot empty" style="font-size:0.6rem;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">${dn}</div>`;
        }).join('');

        container.innerHTML = `<div class="week-habit-row">
            <span class="week-habit-label" style="font-weight:600">Habit</span>
            <div class="week-habit-dots">${headerDots}</div>
        </div>` + container.innerHTML;
    }

    // --- Analysis View ---

    function renderAnalysis() {
        renderMoodAnalysis();
        renderOverthinkAnalysis();
        renderGrowthInsights();
        renderJournalHighlights();
    }

    function renderMoodAnalysis() {
        const container = document.getElementById('mood-analysis');
        const last7 = getLast7Days();
        const entries = last7.filter(d => d.entry && d.entry.mood);

        if (entries.length === 0) {
            container.innerHTML = '<p class="empty-state">No mood data yet. Start checking in! 🌱</p>';
            return;
        }

        const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        entries.forEach(d => { moodCounts[d.entry.mood]++; });

        const maxCount = Math.max(...Object.values(moodCounts), 1);

        const sadDays = moodCounts[1] + moodCounts[2];
        const happyDays = moodCounts[4] + moodCounts[5];

        let summary = '';
        if (sadDays > happyDays) {
            summary = `<div class="insight-item">💜 You had <strong>${sadDays} tough day${sadDays > 1 ? 's' : ''}</strong> this week. Remember: bad days don't make a bad life. Be extra gentle with yourself.</div>`;
        } else if (happyDays > sadDays) {
            summary = `<div class="insight-item">✨ You had <strong>${happyDays} good day${happyDays > 1 ? 's' : ''}</strong> this week! Notice what contributed to those — do more of that.</div>`;
        } else {
            summary = `<div class="insight-item">🌤️ A mixed week — that's completely normal. Every day is a fresh start.</div>`;
        }

        const bars = Object.entries(MOODS).reverse().map(([level, info]) => {
            const count = moodCounts[level];
            const width = (count / maxCount) * 100;
            return `<div class="mood-bar-row">
                <span class="mood-bar-emoji">${info.emoji}</span>
                <div class="mood-bar-container">
                    <div class="mood-bar-fill" style="width:${width}%; background:${info.color}"></div>
                </div>
                <span class="mood-bar-count">${count} day${count !== 1 ? 's' : ''}</span>
            </div>`;
        }).join('');

        container.innerHTML = bars + summary;
    }

    function renderOverthinkAnalysis() {
        const container = document.getElementById('overthink-analysis');
        const last7 = getLast7Days();
        const entries = last7.filter(d => d.entry && d.entry.overthink);

        if (entries.length === 0) {
            container.innerHTML = '<p class="empty-state">Track your overthinking patterns to see insights 🧠</p>';
            return;
        }

        const counts = { none: 0, little: 0, moderate: 0, alot: 0, spiral: 0 };
        entries.forEach(d => { counts[d.entry.overthink]++; });

        const totalScore = entries.reduce((sum, d) => sum + OVERTHINK_LEVELS[d.entry.overthink].score, 0);
        const avgScore = totalScore / entries.length;

        let message = '';
        if (avgScore <= 1) {
            message = "Your mind has been pretty calm this week. That's incredible growth! 🌟";
        } else if (avgScore <= 2) {
            message = "Some overthinking this week — totally normal. Try grounding exercises when you notice it starting.";
        } else {
            message = "Your brain was working overtime this week. Consider journaling, meditation, or talking to someone you trust. 💜";
        }

        const spiralDays = counts.alot + counts.spiral;
        const calmDays = counts.none + counts.little;

        container.innerHTML = `
            <div class="overthink-stat">
                <span class="overthink-stat-icon">🧠</span>
                <span class="overthink-stat-text">${message}</span>
            </div>
            <div class="overthink-stat">
                <span class="overthink-stat-icon">🌟</span>
                <span class="overthink-stat-text"><strong>${calmDays}</strong> calm day${calmDays !== 1 ? 's' : ''} vs <strong>${spiralDays}</strong> heavy day${spiralDays !== 1 ? 's' : ''} this week</span>
            </div>
        `;
    }

    function renderGrowthInsights() {
        const container = document.getElementById('growth-insights');
        const last7 = getLast7Days();
        const entries = last7.filter(d => d.entry);

        if (entries.length < 2) {
            container.innerHTML = '<p class="empty-state">Keep logging for at least 2 days to see growth insights 🌱</p>';
            return;
        }

        const insights = [];

        const totalHabitsCompleted = entries.reduce((sum, d) => sum + d.entry.habits.filter(Boolean).length, 0);
        const avgHabits = (totalHabitsCompleted / entries.length).toFixed(1);
        insights.push(`On average, you completed <strong>${avgHabits} out of ${TOTAL_HABITS}</strong> habits per day this week.`);

        const habitCompletions = HABITS.map((h, i) => ({
            ...h,
            count: entries.filter(d => d.entry.habits[i]).length
        }));

        const sorted = [...habitCompletions].sort((a, b) => b.count - a.count);
        const bestHabit = sorted[0];
        const worstHabit = sorted[sorted.length - 1];

        if (bestHabit.count > 0) {
            insights.push(`Your strongest habit: <strong>${bestHabit.icon} ${bestHabit.label}</strong> (${bestHabit.count}/${entries.length} days). Keep it up!`);
        }
        if (worstHabit.count < entries.length) {
            insights.push(`Needs attention: <strong>${worstHabit.icon} ${worstHabit.label}</strong> (${worstHabit.count}/${entries.length} days). Small steps count!`);
        }

        const kindToOthersIdx = HABITS.findIndex(h => h.id === 'kind-to-others');
        const lovingPartnerIdx = HABITS.findIndex(h => h.id === 'loving-partner');
        const kindDays = entries.filter(d => d.entry.habits[kindToOthersIdx]).length;
        const lovingDays = entries.filter(d => d.entry.habits[lovingPartnerIdx]).length;
        if (kindDays >= entries.length - 1 && lovingDays >= entries.length - 1) {
            insights.push(`You've been kind and loving almost every day this week. That's beautiful growth! 💕`);
        } else if (kindDays < entries.length / 2) {
            insights.push(`Gentle reminder: words have weight. You're aware of it — that's already growth. 🤍`);
        }

        const parentIdx = HABITS.findIndex(h => h.id === 'parents');
        const parentDays = entries.filter(d => d.entry.habits[parentIdx]).length;
        if (parentDays > 0) {
            insights.push(`You connected with your parents <strong>${parentDays} time${parentDays > 1 ? 's' : ''}</strong> this week. 📞💜 Long distance love counts.`);
        }

        const sleepEntries = entries.filter(d => d.entry.sleepHours);
        if (sleepEntries.length > 0) {
            const avgSleep = (sleepEntries.reduce((s, d) => s + d.entry.sleepHours, 0) / sleepEntries.length).toFixed(1);
            const sleepMsg = avgSleep >= 7.5
                ? `Avg sleep: <strong>${avgSleep}h</strong> — great rest! Your body thanks you. 😴✨`
                : `Avg sleep: <strong>${avgSleep}h</strong> — try to get closer to 8h. Rest fuels everything else. 🌙`;
            insights.push(sleepMsg);
        }

        const prioritizeIdx = HABITS.findIndex(h => h.id === 'prioritize-self');
        const prioritizeDays = entries.filter(d => d.entry.habits[prioritizeIdx]).length;
        if (prioritizeDays >= 5) {
            insights.push(`You prioritized yourself <strong>${prioritizeDays} days</strong>! You're learning to put yourself first. 👑`);
        }

        container.innerHTML = insights.map(i => `<div class="insight-item">${i}</div>`).join('');
    }

    function renderJournalHighlights() {
        const container = document.getElementById('journal-highlights');
        const last7 = getLast7Days();
        const entries = last7.filter(d => d.entry && (d.entry.journal || d.entry.wentWell || d.entry.didntWork || (d.entry.emojis && d.entry.emojis.length > 0))).reverse();

        if (entries.length === 0) {
            container.innerHTML = '<p class="empty-state">Your journal entries will appear here. Write about your days! 📝</p>';
            return;
        }

        container.innerHTML = entries.slice(0, 5).map(day => {
            const date = new Date(day.key).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            const emojis = day.entry.emojis ? day.entry.emojis.join(' ') : '';
            const wentWell = day.entry.wentWell || '';
            const didntWork = day.entry.didntWork || '';
            const text = day.entry.journal || '';

            return `<div class="journal-entry-mini">
                <div class="journal-entry-date">${date} ${day.entry.sleepHours ? `· 😴 ${day.entry.sleepHours}h sleep` : ''}</div>
                ${emojis ? `<div class="journal-entry-emojis">${emojis}</div>` : ''}
                ${wentWell ? `<div class="journal-entry-text"><span style="color:var(--primary)">✨ Went well:</span> ${escapeHtml(wentWell)}</div>` : ''}
                ${didntWork ? `<div class="journal-entry-text"><span style="color:#f97316">🔧 Didn't work:</span> ${escapeHtml(didntWork)}</div>` : ''}
                ${text ? `<div class="journal-entry-text">${escapeHtml(text)}</div>` : ''}
            </div>`;
        }).join('');
    }

    // --- Utilities ---

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Init ---

    function init() {
        initNavigation();
        initCheckin();
        renderHome();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
