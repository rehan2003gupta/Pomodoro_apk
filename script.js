document.addEventListener("DOMContentLoaded", function () {
    const startbtn = document.querySelector(".btn");
    const timer = document.querySelector(".timer");
    const Restart = document.querySelector(".restart");
    const SBreak = document.querySelector(".sbreak");
    const LBreak = document.querySelector(".lbreak");
    const header = document.querySelector(".logo");
    const skip = document.querySelector(".skip");
    const settingsBtn = document.querySelector(".setting");
    const modal = document.getElementById("settingsModal");
    const overlay = document.getElementById("overlay");
    const saveBtn = document.querySelector(".save-btn");
    let alarmSound = new Audio("kitchen.mp3");
    const task_counter = document.querySelector(".cnt_txt");
    const suggestion_txt = document.querySelector(".cnt_suggestion");
    const darkModeBtn = document.querySelector(".dark_mode");
    const numberBox1 = document.getElementById("numberBox1");
    const numberBox2 = document.getElementById("numberBox2");
    const numberBox3 = document.getElementById("numberBox3");
    const numberBox4 = document.getElementById("numberBox4");
    const repeatCnt = document.getElementById("repeat_alarm");
    const progressBar = document.getElementById("progress-bar");
    const assistantButton = document.getElementById("assistant_button");
    const assistantFrame = document.getElementById("assistant_frame");

    assistantButton.addEventListener("click", () => {
        // assistantFrame.src = "https://chat-gpt-clone-five-delta.vercel.app/";
        if (assistantFrame.style.display === "none" || assistantFrame.style.display === "") {
            // Show the iframe and load the URL
            assistantFrame.src = "https://chat-gpt-clone-five-delta.vercel.app/";
            assistantFrame.style.display = "block";
            assistantFrame.style.width = "60vw";   // Or whatever size you want
            assistantFrame.style.height = "80vh";
            assistantFrame.style.margin = "1rem auto"
        } else {
            // Hide the iframe
            assistantFrame.style.display = "none"; // Hide the iframe
            assistantFrame.src = ""; // Optional: Clears the iframe content to stop loading the external page when hidden
        }
    });
    let timeleft = parseInt(numberBox1.value, 10) * 60;
    let timerInterval;
    let isRunning = false;
    let currentMode = "pomodoro";
    var pomodoroCount = parseInt(numberBox4.value, 10);
    let pomodorocountTimes = 0;
    var repeatCounter = 0;
    let task_cnt = 0; // Initialize task count
    suggestion_txt.textContent = `Time to focus`;
    document.querySelector(".skip").style.display = "none";
    function updateTimerDisplay() {
        let min = Math.floor(timeleft / 60);
        let sec = timeleft % 60;
        timer.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
    function resetting() {
        progressBar.style.width = "0%";
        playAlarmRepeatedly(repeatCounter);
        clearInterval(timerInterval);
        startbtn.textContent = "START";
        isRunning = false;
        currentMode = "pomodoro";
        timeleft = pomodoroDuration * 60; // Set time for pomodoro
        updateTimerDisplay();
        document.body.style.backgroundColor = "rgb(209, 77, 77)";
        document.getElementsByClassName("container")[0].style.backgroundColor = "rgba(249, 123, 123, 0.318)";
        document.getElementsByClassName("restart")[0].style.backgroundColor = "rgba(0, 0, 0, 0.32)";
        document.getElementsByClassName("sbreak")[0].style.backgroundColor = "rgba(249, 123, 123, 0.318)";
        document.getElementsByClassName("lbreak")[0].style.backgroundColor = "rgba(249, 123, 123, 0.318)";
        document.getElementsByClassName("btn")[0].style.color = "rgb(209, 77, 77)";
        changeBoxColors("rgba(249, 123, 123, 0.318)");
        document.querySelector(".skip").style.backgroundColor = "rgba(249, 123, 123, 0.318)";
        applyCurrentTheme();
    }

    function sbresetting() {
        progressBar.style.width = "0%";
        playAlarmRepeatedly(repeatCounter);
        clearInterval(timerInterval);
        startbtn.textContent = "START";
        isRunning = false;
        currentMode = "shortBreak";
        timeleft = shortBreakDuration * 60;
        updateTimerDisplay();
        document.body.style.backgroundColor = "rgba(95, 217, 244, 0.78)";
        document.getElementsByClassName("container")[0].style.backgroundColor = "rgba(129, 198, 214, 0.4)";
        document.getElementsByClassName("sbreak")[0].style.backgroundColor = "rgba(0, 0, 0, 0.32)";
        document.getElementsByClassName("restart")[0].style.backgroundColor = "rgba(129, 198, 214, 0.4)";
        document.getElementsByClassName("lbreak")[0].style.backgroundColor = "rgba(129, 198, 214, 0.4)";
        document.getElementsByClassName("btn")[0].style.color = "rgba(95, 217, 244, 0.78)";
        changeBoxColors("rgba(129, 198, 214, 0.4)");
        document.querySelector(".skip").style.backgroundColor = "rgba(129, 198, 214, 0.4)";
        applyCurrentTheme();
    }
    function lbresetting() {
        progressBar.style.width = "0%";
        playAlarmRepeatedly(repeatCounter);
        clearInterval(timerInterval);
        startbtn.textContent = "START";
        isRunning = false;
        currentMode = "longBreak";
        timeleft = longBreakDuration * 60; // Set time for long break
        updateTimerDisplay();
        pomodorocountTimes = 0; // Reset pomodoro count
        document.body.style.backgroundColor = "rgb(80, 110, 218)";
        document.getElementsByClassName("container")[0].style.backgroundColor = "rgba(129, 166, 214, 0.4)";
        document.getElementsByClassName("lbreak")[0].style.backgroundColor = "rgba(0, 0, 0, 0.32)";
        document.getElementsByClassName("sbreak")[0].style.backgroundColor = "rgba(129, 166, 214, 0.4)";
        document.getElementsByClassName("restart")[0].style.backgroundColor = "rgba(129, 198, 214, 0.4)";
        document.getElementsByClassName("btn")[0].style.color = "rgb(80, 110, 218)";
        changeBoxColors("rgba(129, 198, 214, 0.4)");
        document.querySelector(".skip").style.backgroundColor = "rgba(129, 198, 214, 0.4)";
        applyCurrentTheme();
    }

    function changeBoxColors(color) {
        let boxes = document.querySelectorAll(".box");
        boxes.forEach(box => {
            box.style.backgroundColor = color;
        });
    }
    function toggleTimer() {
        document.querySelector(".skip").style.display = "block";
        if (isRunning) {
            clearInterval(timerInterval);
            startbtn.textContent = "START";
        }
        else {
            timerInterval = setInterval(() => {
                if (timeleft > 0) {
                    timeleft--;
                    updateTimerDisplay();
                    updateProgressBar();
                }
                else {
                    clearInterval(timerInterval);
                    startbtn.textContent = "START";
                    isRunning = false;
                    playAlarmRepeatedly(repeatCounter);
                    if (currentMode === "pomodoro") {
                        pomodorocountTimes++;
                        task_cnt++;
                        task_counter.textContent = `Task Completed #: ${task_cnt}`;
                        if (pomodoroCount === pomodorocountTimes) {
                            suggestion_txt.textContent = `Great job! Time to take a long break`;
                            lbresetting(); // Take a long break after 4 Pomodoros
                        } else {
                            suggestion_txt.textContent = `Break time!`;
                            sbresetting(); // Otherwise, short break
                        }
                    } else {
                        suggestion_txt.textContent = `Time to focus`;
                        resetting(); // After any break, go back to Pomodoro
                    }
                }
            }, 1000);
            startbtn.textContent = "PAUSE";
        }
        isRunning = !isRunning;
    }
    function skip_time() {
        clearInterval(timerInterval);
        if (currentMode === "pomodoro") {
            pomodorocountTimes++;
            task_cnt++; // ✅ Increment once per Pomodoro
            task_counter.textContent = `Task Completed #: ${task_cnt}`;
            if (pomodorocountTimes >= pomodoroCount) {
                suggestion_txt.textContent = `Great job! Time to take a long break`;
                lbresetting(); // Go to long break
                pomodorocountTimes = 0;
            } else {
                suggestion_txt.textContent = `Break time!`;
                sbresetting(); // Go to short break
            }
        } else {
            suggestion_txt.textContent = `Time to focus`;
            resetting(); // From break to Pomodoro
        }

        document.querySelector(".skip").style.display = "none";
    }
    settingsBtn.addEventListener("click", () => {
        modal.style.display = "block";
        overlay.style.display = "block";
    });

    // Close modal and overlay
    saveBtn.addEventListener("click", () => {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // Close modal when clicking on overlay
    overlay.addEventListener("click", () => {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    startbtn.addEventListener('click', toggleTimer);
    updateTimerDisplay();
    Restart.addEventListener('click', resetting);
    updateTimerDisplay();
    SBreak.addEventListener('click', sbresetting);
    updateTimerDisplay();
    LBreak.addEventListener('click', lbresetting);
    updateTimerDisplay();
    skip.addEventListener('click', skip_time);
    updateTimerDisplay();

    let isDarkMode = false; // Initialize dark mode state
    function dark_mode_change() {
        isDarkMode = !isDarkMode;  // Toggle dark mode ON/OFF
        applyCurrentTheme();
    }

    // Helper function: Apply dark mode or normal mode based on current state
    function applyCurrentTheme() {
        if (isDarkMode) {
            // Dark Mode
            document.body.style.backgroundColor = "black";
            document.querySelector(".container").style.backgroundColor = "black";
            document.querySelector(".btn").style.color = "rgba(176, 185, 187, 0.78)";
            changeBoxColors("rgba(0, 0, 0, 0.4)");
            document.querySelector(".skip").style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        } else {
            // Normal Mode (based on current session: pomodoro, short break, long break)
            if (currentMode === "pomodoro") {
                document.body.style.backgroundColor = "rgb(209, 77, 77)";
                document.querySelector(".container").style.backgroundColor = "rgba(249, 123, 123, 0.318)";
                document.querySelector(".btn").style.color = "rgb(209, 77, 77)";
                changeBoxColors("rgba(249, 123, 123, 0.318)");
                document.querySelector(".skip").style.backgroundColor = "rgba(249, 123, 123, 0.318)";
            }
            else if (currentMode === "shortBreak") {
                document.body.style.backgroundColor = "rgba(95, 217, 244, 0.78)";
                document.querySelector(".container").style.backgroundColor = "rgba(129, 198, 214, 0.4)";
                document.querySelector(".btn").style.color = "rgba(95, 217, 244, 0.78)";
                changeBoxColors("rgba(129, 198, 214, 0.4)");
                document.querySelector(".skip").style.backgroundColor = "rgba(129, 198, 214, 0.4)";
            }
            else if (currentMode === "longBreak") {
                document.body.style.backgroundColor = "rgb(80, 110, 218)";
                document.querySelector(".container").style.backgroundColor = "rgba(129, 166, 214, 0.4)";
                document.querySelector(".btn").style.color = "rgb(80, 110, 218)";
                changeBoxColors("rgba(129, 198, 214, 0.4)");
                document.querySelector(".skip").style.backgroundColor = "rgba(129, 198, 214, 0.4)";
            }
            // Headers and buttons stay VISIBLE
            header.style.display = "flex";
            Restart.style.display = "inline-block";
            SBreak.style.display = "inline-block";
            LBreak.style.display = "inline-block";
        }
    }
    darkModeBtn.addEventListener("click", dark_mode_change);


    let pomodoroDuration = parseInt(numberBox1.value, 10);  // in minutes
    let shortBreakDuration = parseInt(numberBox2.value, 10);
    let longBreakDuration = parseInt(numberBox3.value, 10);
    saveBtn.addEventListener("click", () => {
        // Get updated values from inputs
        pomodoroDuration = parseInt(numberBox1.value, 10);
        if (pomodoroDuration < 25) {
            pomodoroDuration = 25;
            numberBox1.value = 25;
        }
        if (pomodoroDuration > 55) {
            pomodoroDuration = 55;
            numberBox1.value = 55;
        }
        shortBreakDuration = parseInt(numberBox2.value, 10);
        if (shortBreakDuration < 5) {
            shortBreakDuration = 5;
            numberBox2.value = 5;
        }
        if (shortBreakDuration > 15) {
            shortBreakDuration = 15;
            numberBox2.value = 15;
        }
        longBreakDuration = parseInt(numberBox3.value, 10);
        if (longBreakDuration < 15) {
            longBreakDuration = 15;
            numberBox3.value = 15;
        }
        if (longBreakDuration > 30) {
            longBreakDuration = 30;
            numberBox3.value = 30;
        }
        pomodoroCount = parseInt(numberBox4.value, 10);
        repeatCounter = parseInt(repeatCnt.value, 10);
        const selectedAlarm = document.getElementById("alarm_options").value;
        alarmSound.src = `${selectedAlarm}.mp3`;
        alarmSound.load();
        // Optionally: update timer if not running
        if (!isRunning) {
            if (currentMode === "pomodoro") {
                timeleft = pomodoroDuration * 60;
            } else if (currentMode === "shortBreak") {
                timeleft = shortBreakDuration * 60;
            } else if (currentMode === "longBreak") {
                timeleft = longBreakDuration * 60;
            }
            updateTimerDisplay();
        }

        // Close modal
        modal.style.display = "none";
        overlay.style.display = "none";
    });
    let tempPomodoro, tempShortBreak, tempLongBreak;
    settingsBtn.addEventListener("click", () => {
        modal.style.display = "block";
        overlay.style.display = "block";

        // Store original values before user starts typing
        tempPomodoro = numberBox1.value;
        tempShortBreak = numberBox2.value;
        tempLongBreak = numberBox3.value;
        pomodoroCount = numberBox4.value;
    });

    overlay.addEventListener("click", () => {
        // Revert input values back to the original ones
        numberBox1.value = tempPomodoro;
        numberBox2.value = tempShortBreak;
        numberBox3.value = tempLongBreak;
        numberBox4.value = pomodoroCount;
        modal.style.display = "none";
        overlay.style.display = "none";
    });
    function playAlarmRepeatedly(count) {
        let plays = 0;
        const sound = new Audio(alarmSound.src);

        sound.addEventListener("ended", () => {
            plays++;
            if (plays < count) {
                sound.currentTime = 0;
                sound.play().catch(err => console.log("Audio play failed:", err));
            }
        });

        sound.play().catch(err => console.log("Audio play failed:", err));
    }
    function updateProgressBar() {
        let totalTime;
        // Determine total time based on the current mode
        if (currentMode === "pomodoro") {
            totalTime = pomodoroDuration * 60;
        } else if (currentMode === "shortBreak") {
            totalTime = shortBreakDuration * 60;
        } else if (currentMode === "longBreak") {
            totalTime = longBreakDuration * 60;
        }

        // Calculate progress as a percentage
        const progress = ((totalTime - timeleft) / totalTime) * 100;

        // Update the width of the progress bar
        progressBar.style.width = progress + "%";
    }
})