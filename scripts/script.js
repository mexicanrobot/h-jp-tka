//Variables to store current emails, and all from list
let originalEmails;
let filteredEmails;

//Fetch emails
const data = fetch("data/emails.json").then(response => response.json()).then(data => {
    originalEmails=data; 
    filteredEmails = originalEmails;
});

//Init datepicker
const picker = new Litepicker({ 
    element: document.getElementById('litepicker'),
    singleMode: false,
    numberOfColumns: 1,
    numberOfMonths: 1
});

//Add event listeners
addEventListeners();

//Functions 
function addEventListeners() {
    //On picker select data
    picker.on('selected', (startdate,enddate) => {
        filteredEmails = originalEmails.filter(email => {
            const emailDateTime = new Date(email.date).getTime();
            const startDateTime = startdate.dateInstance.getTime();
            const endDateTime = enddate.dateInstance.getTime();
            return (emailDateTime >= startDateTime && emailDateTime <= endDateTime);
        });

        document.querySelector('.results').innerText = `Results: ${filteredEmails.length} email(s)`;

        renderEmails(filteredEmails);
    });

    //Sort columns when clicked
    document.querySelectorAll('.email-table-header div').forEach(element => {
        element.onclick = () => {
            //Get category
            let filterBy = element.innerText.toLowerCase();

            //Flip through ascending and descending
            if(element.classList.contains('asc')) {
                element.classList.add('desc');
                element.classList.remove('asc');
            } else if(element.classList.contains('desc')) {
                element.classList.add('asc');
                element.classList.remove('desc');
            } else {
                element.classList.add('asc');
            }

            //Remove from other columns
            document.querySelectorAll('.asc, .desc').forEach(otherElements => {
                if(otherElements !== element) {
                    otherElements.classList.remove('asc','desc');
                }
            });

            //Sort emails by field
            filteredEmails.sort((a,b) => {
                switch(filterBy) { 
                    case 'to':
                        if(element.classList.contains('asc')) {
                            return a[filterBy][0].localeCompare(b[filterBy][0]);
                        } else {
                            return b[filterBy][0].localeCompare(a[filterBy][0]);
                        }
                    case 'date':
                        if(element.classList.contains('asc')) {
                            return new Date(a[filterBy]).getTime() - new Date(b[filterBy]).getTime();
                        } else {
                            return new Date(b[filterBy]).getTime() - new Date(a[filterBy]).getTime();
                        }
                    default: //From and Subject
                        if(element.classList.contains('asc')) {
                            return a[filterBy].localeCompare(b[filterBy]);
                        } else {
                            return b[filterBy].localeCompare(a[filterBy]);
                        }
                }
            });

            //Render new email list
            renderEmails(filteredEmails);
        };
    });
}

//Format subject text with attachment if available
function formatSubjectText(subjectText, attachments) {
    subjectText = `<div>${subjectText}</div>`;

    if(attachments.length > 0) {
        subjectText += `<object class="attachment-icon" type="image/svg+xml" data="images/icon_clip.svg"></object>`;
    }

    return subjectText;
}

//Add plus n square if multiple receivers of email else just return first element
function formatToArray(toArray) {
    if(toArray.length > 1) {
        return `<div>${toArray[0]},...</div><div class="plus-email">+${toArray.length-1}</div>`
    } else {
        return `<div>${toArray[0]}</div>`;
    }
}

//Format date to full if other month, if this year, print without year, if today, print hour.
function formatDate(date) {
    let today = new Date();
    date = new Date(date);
    if(today.getFullYear() === date.getFullYear()) {
        if(today.getMonth() === date.getMonth() && today.getDate() === date.getDate()) {
            let hour = date.toString().split(" ")[4].split(":");
            return `${hour[0]}:${hour[1]}`;
        } else {
            return `${date.toString().split(" ")[1]} ${date.toString().split(" ")[2]}`;
        }
    } else {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
}

//Render emails to table
function renderEmails(emails) {
    const table = document.querySelector('.email-table-body');
    const tableHeader = document.querySelector('.email-table-header');
    const appIcon = document.querySelector('.app-icon');
    const hr = document.querySelector('hr');

    //Remove logo if emails available
    if(emails.length > 0) {
        tableHeader.style.display = "flex";
        appIcon.style.display = "none";
        hr.style.display = "none";
    } else {
        tableHeader.style.display = "none";
        appIcon.style.display = "block";
        hr.style.display = "block";
    }

    //Clear existing content
    table.innerHTML = "";
    
    //Render emails into array then concat
    table.innerText = emails.map(email => {
        return `<div class="email-table-row">
        <object class="email-icon" type="image/svg+xml" data="images/icon_mail_sp.svg"></object>
            <div class="email-from">${email.from}</div>
            <div class="email-to">${formatToArray(email.to)}</div>
            <div class="email-subject">${formatSubjectText(email.subject, email.attachments)}</div>
            <object class="open-icon" type="image/svg+xml" data="images/icon_arrow02.svg"></object>
            <div class="email-date">${formatDate(email.date)}</div>
            <div class="email-body">${email.body}</div>
        </div>`
    }).join("");

    //To prevent XSS
    table.innerHTML = table.innerText;

    document.querySelectorAll('.email-table-row').forEach(row => {
        row.onclick = () => {
            row.classList.toggle('active');
        }
    })
}