document.getElementById("calculate-button").addEventListener("click", calculate);

const ctxWithInterest = document.getElementById('chartWithInterest').getContext('2d');
const ctxWithoutInterest = document.getElementById('chartWithoutInterest').getContext('2d');

let chartWithInterest, chartWithoutInterest;

function formatCurrency(value) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculate() {
    let P = Number(document.getElementById("starting-balance").value);
    let r = Number(document.getElementById("interest-rate").value) / 100;
    let n = Number(document.getElementById("compound").value);
    let t = Number(document.getElementById("years").value);
    let PMT = Number(document.getElementById("contribution").value);

    let years = [], totalsWithInterest = [], totalsWithoutInterest = [];
    let totalWithoutInterest = P, totalWithInterest = P;

    for (let year = 1; year <= t; year++) {
        totalWithoutInterest += PMT * 12; // Monthly contributions

        let temp = Math.pow(1 + (r / n), n * year);
        let result1 = P * temp;
        let result2 = PMT * (temp - 1) / (r / n);
        totalWithInterest = result1 + result2;

        years.push(year);
        totalsWithoutInterest.push(totalWithoutInterest);
        totalsWithInterest.push(totalWithInterest);
    }

    let totalInvested = P + (PMT * 12 * t);
    let totalInterest = totalWithInterest - totalInvested;
    let annualIncome = totalWithInterest * (r || 0.04); // Default to 4% withdrawal rule

    // Update results with formatted currency
    document.getElementById("result").innerText = formatCurrency(totalWithInterest);
    document.getElementById("total-invested").innerText = formatCurrency(totalInvested);
    document.getElementById("total-interest").innerText = formatCurrency(totalInterest);
    document.getElementById("interest-rate-display").innerText = (r * 100).toFixed(2);
    document.getElementById("annual-income").innerText = formatCurrency(annualIncome);

    // Handle tax calculations
    let taxRateInput = document.getElementById("tax-rate").value;
    let taxRate = taxRateInput === "" ? 0 : Number(taxRateInput) / 100; // Default to 0% if empty

    let afterTaxIncome = annualIncome * (1 - taxRate);
    let monthlyIncome = afterTaxIncome / 12;

    document.getElementById("tax-rate-display").innerText = (taxRate * 100).toFixed(2);
    document.getElementById("after-tax-income").innerText = formatCurrency(afterTaxIncome);
    document.getElementById("monthly-income").innerText = formatCurrency(monthlyIncome);

    // Chart updates
    if (chartWithInterest) chartWithInterest.destroy();
    if (chartWithoutInterest) chartWithoutInterest.destroy();

    chartWithInterest = new Chart(ctxWithInterest, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Total with Interest',
                data: totalsWithInterest,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    chartWithoutInterest = new Chart(ctxWithoutInterest, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Total Without Interest',
                data: totalsWithoutInterest,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}