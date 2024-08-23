document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById("theme-toggle");
    const sidebar = document.querySelector(".sidebar");

    themeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-theme", themeToggle.checked);
        sidebar.style.backgroundColor = themeToggle.checked ? "#003459" : "#00171f";
    });

    function updateTime() {
        const timeElement = document.getElementById("time");
        const now = new Date();
        timeElement.innerText = now.toLocaleTimeString();
    }

    setInterval(updateTime, 1000);
    updateTime();

    const journalLink = document.querySelector(".dropdown > a");
    const dropdownContent = document.querySelector(".dropdown-content");

    journalLink.addEventListener("mouseenter", () => {
        dropdownContent.style.display = "block";
    });

    dropdownContent.addEventListener("mouseleave", () => {
        dropdownContent.style.display = "none";
    });

    // Trading Checklist
    const tradingChecklistItems = document.querySelectorAll('.consistency-checkboxes input[type="checkbox"]');

    // Load saved state
    tradingChecklistItems.forEach(item => {
        const savedState = localStorage.getItem(item.id);
        if (savedState === 'true') {
            item.checked = true;
        }
    });

    // Save state on change
    tradingChecklistItems.forEach(item => {
        item.addEventListener('change', () => {
            localStorage.setItem(item.id, item.checked);
        });
    });

    // Risk Calculator
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'calculateRisk') {
            calculateRisk();
        }
    });

    function calculateRisk() {
        const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
        const winPercentage = parseFloat(document.getElementById('winPercentage').value);
        const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);

        if (isNaN(investmentAmount) || isNaN(winPercentage) || isNaN(riskPercentage)) {
            alert("Please enter valid numerical values.");
            return;
        }

        const dailyProfit = (investmentAmount * winPercentage) / 100;
        const dailyLoss = (investmentAmount * riskPercentage) / 100;
        const weeklyProfit = dailyProfit * 5;
        const weeklyLoss = dailyLoss * 5;
        const monthlyProfit = dailyProfit * 20;
        const monthlyLoss = dailyLoss * 20;

        const resultElement = document.getElementById('result');

        if (resultElement) {
            resultElement.innerHTML = `
                <p>Daily Profit: $${dailyProfit.toFixed(2)}</p>
                <p>Daily Loss: $${dailyLoss.toFixed(2)}</p>
                <p>Weekly Profit: $${weeklyProfit.toFixed(2)}</p>
                <p>Weekly Loss: $${weeklyLoss.toFixed(2)}</p>
                <p>Monthly Profit: $${monthlyProfit.toFixed(2)}</p>
                <p>Monthly Loss: $${monthlyLoss.toFixed(2)}</p>
            `;
        }
    }

    // Alarm
    const setAlarmButton = document.getElementById('setAlarmButton');
    setAlarmButton.addEventListener('click', setAlarm);

    let alarmTimeout;
    let alarmInterval;

    function setAlarm() {
        const alarmTimeInput = document.getElementById("alarmTime").value;
        const [alarmHour, alarmMinute] = alarmTimeInput.split(':').map(Number);
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const alarmTotalMinutes = alarmHour * 60 + alarmMinute;

        if (alarmTotalMinutes <= currentTotalMinutes) {
            alert("Please select a future time for the alarm.");
            return;
        }

        const timeDifference = alarmTotalMinutes - currentTotalMinutes;

        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }

        if (alarmInterval) {
            clearInterval(alarmInterval);
        }

        const countdownElement = document.getElementById('alarmCountdown');
        
        alarmInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = alarmTotalMinutes - (now.getHours() * 60 + now.getMinutes());
            
            if (timeLeft <= 0) {
                clearInterval(alarmInterval);
                countdownElement.textContent = "Alarm!";
            } else {
                const hours = Math.floor(timeLeft / 60);
                const minutes = timeLeft % 60;
                countdownElement.textContent = `Time until alarm: ${hours}h ${minutes}m`;
            }
        }, 1000);

        alarmTimeout = setTimeout(() => {
            alert("Alarm!");

            if (document.hidden) {
                window.focus();
            }
        }, timeDifference * 60000);
    }

    // Journal
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    loadTasks();

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach((taskText) => addTask(taskText));
        makeTasksDraggable();
    }

    function makeTasksDraggable() {
        const tasks = taskList.querySelectorAll("li");
        tasks.forEach((task) => {
            task.setAttribute("draggable", "true");

            task.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData("text/plain", task.innerHTML);
            });

            task.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            task.addEventListener("drop", function (e) {
                e.preventDefault();
                const data = e.dataTransfer.getData("text/plain");
                task.innerHTML = data;
                saveTasksToLocalStorage();
            });
        });
    }

    function addTask(taskText) {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${taskText}</span>
          <button class="delete-button">Delete</button>
        `;

        taskList.appendChild(li);
        taskInput.value = "";

        li.querySelector(".delete-button").addEventListener("click", function () {
            li.remove();
            saveTasksToLocalStorage();
        });
    }

    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.querySelectorAll("li")).map((li) =>
            li.querySelector("span").textContent
        );
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTask(taskText);
            saveTasksToLocalStorage();
            makeTasksDraggable();
        }
    });

    // TradingView Widgets
    function initTradingViewWidget(containerId, symbol) {
        new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": containerId
        });
    }

    initTradingViewWidget("tradingview_1", "BINANCE:BTCUSDT.P");
    initTradingViewWidget("tradingview_2", "BINANCE:EGLDUSDT.P");
    initTradingViewWidget("tradingview_3", "BINANCE:COMPUSDT.P");
    initTradingViewWidget("tradingview_4", "BINANCE:MATICUSDT.P");
});