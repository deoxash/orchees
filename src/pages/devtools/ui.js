/*globals BackgroundPage: true, UI*/
window.UI = {
    getTheme: function() {
        BackgroundPage.send({
            query: "theme"
        });
    },
    setTheme: function (theme) {
        var sheet = document.getElementById("theme");
        if (!theme.fname) {console.log("No theme file given, using default."); theme.fname = "night";}
        sheet.href = `../stylesheets/${theme.fname}.css`;
    },

    //Input: {id, value} optionally in Array
    //Updates every id in upd with the given value.
    setValue: function (upd) {
        if (Array.isArray(upd)) {
            for (let entry of upd) {
                this.setValue({id: entry.id, value: entry.value});
            }
        }
        else {
            var ele = document.getElementById(upd.id);
            ele.textContent = upd.value;
        }
    },
    
    switchNav: function (ev) {
        if (!ev.target.dataset.navpage) {return;}
        var oldNav = this.getElementsByClassName("active")[0];
        oldNav.classList.remove("active");
        var oldTab = document.getElementById(oldNav.dataset.navpage); 
        oldTab.classList.remove("active");

        ev.target.classList.add("active");
        document.getElementById(ev.target.dataset.navpage).classList.add("active");
    },
    initButtons: function () {
        var nl = document.getElementsByClassName("navlist");
        for (let nav of nl) {
            nav.addEventListener("click", this.switchNav);
        }
    },
    
    time: {
        display: {jst: {},
                  strike: {},
                  daily: {},
                  weekly: {},
                  monthly: {}},
        timers: {
            daily: {},
            weekly: {},
            monthly: {}
        },
        current: {},
        
        format: function(t) {
            var options = {hour: 'numeric', 
                          minute: 'numeric',
                          second: 'numeric', 
                          timeZone: 'Asia/Tokyo'};
            return Intl.DateTimeFormat('jp-JP', options).formatToParts(t);
            },
        initJST: function () {
            this.display.jst = {
                h: document.getElementById("jst-h"),
                m: document.getElementById("jst-m"),
                s: document.getElementById("jst-s")
            };
            this.updateJST();
            setInterval(this.updateJST, 1000);
        },
        updateJST: function() {
            var time = UI.time.format(Date.now());
            UI.time.display.jst.h.textContent = time[0].value;
            UI.time.display.jst.m.textContent = time[2].value;
            UI.time.display.jst.s.textContent = time[4].value;
        },
        setStrike: function() {
            
        },
        initResets: function() {
            for (let timer in this.timers) {
                if (this.timers.hasOwnProperty(timer)) {
                    this.display[timer] = {d: document.getElementById(`${timer}-d`),
                                           h: document.getElementById(`${timer}-h`),
                                           m: document.getElementById(`${timer}-m`),
                                           s: document.getElementById(`${timer}-s`)};
                }
            }
            
            var current = new Date();
            current.setHours(current.getUTCHours() + 9);
            this.current = current;
            
            var daily = new Date(current);
            daily.setHours(5);
            daily.setMinutes(0);
            daily.setSeconds(0);
            var weekly = new Date(daily);
            var monthly = new Date(daily);
            var timers = {daily, weekly, monthly};
            
            //Daily
            if (current.getHours() >= 5) {
                daily.setDate(daily.getDate() + 1);
            }
            //Weekly
            if (current.getDay() === 0) {
                weekly.setDate(current.getDay() + 1);
            }
            else if (current.getDay() != 1 || current.getHours() >= 5) {
                weekly.setDate(current.getDate() + (8 - current.getDay()));
            }
            //Monthly
            if (current.getDate() > 1 || current.getHours() >= 5) {
                monthly.setDate(1);
                monthly.setMonth(current.getMonth() + 1);
            }
            
            for (let timer in timers) {
                if (timers.hasOwnProperty(timer)) {
                    this.timers[timer] = timers[timer];
                }
            }
            
            this.updateResets();
            setInterval(this.updateResets, 1000);
        },
        updateResets: function() {
/*            var current = new Date();
            current.setHours(current.getUTCHours() + 9);
            UI.time.current = current;*/
            UI.time.current.setSeconds(UI.time.current.getSeconds() + 1);
            
            for (let timer in UI.time.timers) {
                if (UI.time.timers.hasOwnProperty(timer)) {
                    var diff = new Date(UI.time.timers[timer] - UI.time.current);
                    
                    if (UI.time.display[timer].d) {UI.time.display[timer].d.textContent = diff.getUTCDate() - 1;}
                    UI.time.display[timer].h.textContent = diff.getUTCHours();
                    UI.time.display[timer].m.textContent = ('0' + diff.getUTCMinutes()).slice(-2);
                    UI.time.display[timer].s.textContent = ('0' + diff.getUTCSeconds()).slice(-2);
                }
            }
        }
    }
};