// mortgage.js

// =====================
// Update html
// =====================

let mortgageChart;
function updateChart() {
    const principal = parseFloat(document.getElementById('principal').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const years = parseInt(document.getElementById('years').value);

    const payments = calculateMortgage(principal, interestRate, years);

    if (mortgageChart) {
        mortgageChart.destroy();
    }

    mortgageChart = generateMortgageChart(payments);
    const tableContainer = document.getElementById('table-container');
    tableContainer.appendChild(generateMortgageTable(payments));
}

window.onload = updateChart;

// =====================
// Hidden reset button
// =====================
function resetValues() {
    document.getElementById('principal').value = "496000";
    document.getElementById('interestRate').value = "6.0";
    document.getElementById('years').value = "30";
    updateChart();
}

// =====================
// Function to calculate mortgage payments and breakdown principal/interest
// =====================
function calculateMortgage(principal, interestRate, years) {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

    let payments = [];
    let remainingBalance = principal;

    for (let i = 1; i <= totalMonths; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        payments.push({
            month: i,
            interest: Math.round(interestPayment * 100) / 100,
            principal: Math.round(principalPayment * 100) / 100
        });
    }

    return payments;
}

function formatMonthToYears(month) {
    if (month < 12) {
        return `${month}mo`;
    }
    const years = Math.floor(month / 12);
    const months = month % 12
    return `${years}y ${months}mo`
}

// =====================
// Generate mortgage chart
// =====================
function generateMortgageChart(payments) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const labels = payments.map(payment => `Month ${payment.month} (${formatMonthToYears(payment.month)})`);
    const interestData = payments.map(payment => payment.interest.toFixed(2));
    const principalData = payments.map(payment => payment.principal.toFixed(2));
    console.log("labels", labels)
    console.log("interestData", interestData)
    console.log("principalData", principalData)
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Interest Payment',
                    data: interestData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true
                },
                {
                    label: 'Principal Payment',
                    data: principalData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Mortgage Payment Breakdown (Interest vs Principal)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                }
            }
        }
    });

    return chart;
}

// =====================
// Create table
// =====================
function generateMortgageTable(payments) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table headers
    const paymentsKeys = Object.keys(payments[0]);
    const headers = [
        "Year",
        "Month",
        "Interest",
        "Principal",
        "Total Interest",
        "Total Principal",
        "Remaining Principal"
    ];
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        headerRow.appendChild(createTableCell('th', {textContent: header}));
    });
    thead.appendChild(headerRow);

    // Create table body
    let totalInterest = 0;
    let totalPrincipal = 0;
    let remainingPrincipal = parseFloat(document.getElementById('principal').value);
    payments.forEach((item, i) => {
        const row = document.createElement('tr');
        if (i % 12 == 0) {
            row.appendChild(createTableCell('th', {textContent: `Year ${i / 12 + 1}`, rowSpan: 12}));
        }

        paymentsKeys.forEach(key => {
            row.appendChild(createTableCell('td', {textContent: item[key]}));

        });

        const interest = item.interest;
        totalInterest += interest;

        const principal = item.principal;
        totalPrincipal += principal;
        remainingPrincipal -= principal;

        row.appendChild(createTableCell('td', {textContent: totalInterest}));
        row.appendChild(createTableCell('td', {textContent: totalPrincipal}));
        row.appendChild(createTableCell('td', {textContent: remainingPrincipal}));

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function createTableCell(type, props) {
    const elem = document.createElement(type)
    Object.keys(props).forEach(key => {
        elem[key] = props[key];
    })
    return elem;
}
