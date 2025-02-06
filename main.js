const calculate_btn = document.getElementById("calculate-button");
calculate_btn.addEventListener("click", calculate);

const ctxWithInterest = document.getElementById('chartWithInterest').getContext('2d');
const ctxWithoutInterest = document.getElementById('chartWithoutInterest').getContext('2d');

let chartWithInterest;
let chartWithoutInterest;

function calculate() {
    // Get input values
    let P = Number(document.getElementById("starting-balance").value);
    let r = Number(document.getElementById("interest-rate").value) / 100;
    let n = Number(document.getElementById("compound").value);
    let t = Number(document.getElementById("years").value);
    let PMT = Number(document.getElementById("contribution").value);

    let years = [];
    let totalsWithInterest = [];
    let totalsWithoutInterest = [];

    let totalWithoutInterest = P; // Start with initial balance
    let totalWithInterest = P; // Start with initial balance

    for (let year = 1; year <= t; year++) {
        totalWithoutInterest += PMT * 12; // Assuming monthly contributions

        let temp = Math.pow(1 + (r / n), n * year);
        let result1 = P * temp;
        let result2 = PMT * (temp - 1) / (r / n);
        totalWithInterest = result1 + result2;

        years.push(year);
        totalsWithoutInterest.push(totalWithoutInterest);
        totalsWithInterest.push(totalWithInterest);
    }

    document.getElementById("result").innerText = `Total Amount: $${totalWithInterest.toFixed(2)}`;

    // Destroy existing charts if they exist
    if (chartWithInterest) chartWithInterest.destroy();
    if (chartWithoutInterest) chartWithoutInterest.destroy();

    // Chart with interest
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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Years' } },
                y: { title: { display: true, text: 'Total Amount' }, beginAtZero: true }
            }
        }
    });

    // Chart without interest
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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Years' } },
                y: { title: { display: true, text: 'Total Amount' }, beginAtZero: true }
            }
        }
    });
}
