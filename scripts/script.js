let emails;
const data = fetch("data/emails.json").then(response => response.json()).then(data => emails=data);

const litePicker = document.getElementById('litepicker');

picker.on('selected', (startdate,enddate) => {
        let filteredEmails = emails.filter(email => {
            const emailDateTime = new Date(email.date).getTime();
            const startDateTime = startdate.dateInstance.getTime();
            const endDateTime = enddate.dateInstance.getTime();
            return (emailDateTime >= startDateTime && emailDateTime <= endDateTime);
        });

        console.log(filteredEmails);

        document.getElementById('results').innerText = `Results: ${filteredEmails.length} email(s)`;

        renderEmails(filteredEmails);
});

function renderEmails(emails) {
    const table = document.getElementById('email-table');

    table.innerHTML = "";

    table.innerHTML = emails.map(email => {
        return `<tr>
            <td>${email.from}</td>
            <td>${email.to[0]}</td>
            <td>${email.subject}</td>
            <td>${email.date}</td>
        <tr>`
    }).join("");
}