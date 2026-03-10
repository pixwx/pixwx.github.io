const url = "https://api.allorigins.win/get?url=https%3A%2F%2Fcalendar.google.com%2Fcalendar%2Fical%2F3d4c9455e9c97965f1f0aefb85bcf2d81ebca6b58640c51843b0c9a44c802277%2540group.calendar.google.com%2Fpublic%2Fbasic.ics";
fetch(url).then(res => res.json()).then(data => {
    let lines = data.contents.split(/\r?\n/);
    let events = [];
    let ev = null;
    for (let ln of lines) {
        if (ln.startsWith('BEGIN:VEVENT')) ev = {};
        if (ln.startsWith('SUMMARY:')) ev.title = ln.substring(8);
        if (ln.startsWith('DTSTART')) {
            let parts = ln.split(':');
            if(parts.length > 1) {
                let str = parts[1];
                if(str.length >= 8) {
                    ev.dateObj = new Date(str.substring(0,4), parseInt(str.substring(4,6))-1, str.substring(6,8)); 
                }
            }
        }
        if (ln.startsWith('END:VEVENT') && ev && ev.title && ev.dateObj) {
            events.push(ev);
        }
    }
    console.log("Events:", events.length);
}).catch(console.error);
