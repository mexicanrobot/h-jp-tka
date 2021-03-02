let emails;
const data = fetch("data/emails.json").then(response => response.json()).then(data => {emails=data; renderEmails(emails);});
const picker = new Litepicker({ 
    element: document.getElementById('litepicker'),
    singleMode: false,
    numberOfColumns: 2,
    numberOfMonths: 2
});

picker.on('selected', (startdate,enddate) => {
    let filteredEmails = emails.filter(email => {
        const emailDateTime = new Date(email.date).getTime();
        const startDateTime = startdate.dateInstance.getTime();
        const endDateTime = enddate.dateInstance.getTime();
        return (emailDateTime >= startDateTime && emailDateTime <= endDateTime);
    });

    document.querySelector('.results').innerText = `Results: ${filteredEmails.length} email(s)`;

    renderEmails(filteredEmails);
});

document.querySelectorAll('.email-table-header div').forEach(element => {
    let filterBy = element.innerText.toLowerCase();
});

function formatSubjectText(subjectText, attachments) {
    subjectText = `<div>${subjectText}</div>`;

    if(attachments.length > 0) {
        subjectText += `<object class="attachment-icon" type="image/svg+xml" data="images/icon_clip.svg"></object>`;
    }

    return subjectText;
}

function formatToArray(toArray) {
    if(toArray.length > 1) {
        return `<div>${toArray[0]},...</div><div class="plus-email">+${toArray.length-1}</div>`
    } else {
        return toArray[0];
    }
}

function formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function renderEmails(emails) {
    const table = document.querySelector('.email-table-body');
    const tableHeader = document.querySelector('.email-table-header');
    const appIcon = document.querySelector('.app-icon');

    if(emails.length > 0) {
        tableHeader.style.display = "flex";
        appIcon.style.display = "none";
    } else {
        tableHeader.style.display = "none";
        appIcon.style.display = "block";
    }

    table.innerHTML = "";
    table.innerHTML = emails.map(email => {
        return `<div class="email-table-row">
            <div>${email.from}</div>
            <div>${formatToArray(email.to)}</div>
            <div>${formatSubjectText(email.subject, email.attachments)}</div>
            <div class="email-date">${formatDate(email.date)}</div>
        </div>`
    }).join("");
}