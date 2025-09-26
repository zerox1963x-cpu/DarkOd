const periodInput = document.getElementById('periodInput');
const predictBtn = document.getElementById('predictBtn');
const predictedNumberEl = document.getElementById('predictedNumber');
const predictedBSEl = document.getElementById('predictedBS');
const predictedWinLoseEl = document.getElementById('predictedWinLose');
const historyBody = document.getElementById('historyBody');

let history = [];

// --- AI prediction function ---
async function getAIPrediction(period) {
  try {
    // Replace this URL with your AI API endpoint
    const response = await fetch('https://your-ai-api.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period })
    });
    const data = await response.json();
    // Expected: { num: 7, bs: "Big", winPercent: 75.2, losePercent: 28.5 }
    return data;
  } catch (err) {
    console.error('AI Prediction Error:', err);
    return null;
  }
}

// --- Predict button click ---
predictBtn.addEventListener('click', async () => {
  const period = periodInput.value.trim();
  if (period.length !== 5 || isNaN(period)) {
    alert("Enter valid 5-digit period number");
    return;
  }

  // --- Get prediction from AI ---
  const prediction = await getAIPrediction(period);

  if (!prediction) {
    alert("Prediction failed. Try again.");
    return;
  }

  const { num, bs, winPercent, losePercent } = prediction;

  // --- Display results ---
  predictedNumberEl.textContent = num;
  predictedBSEl.textContent = "Big/Small: " + bs;
  predictedWinLoseEl.textContent = `Win: ${winPercent}% | Lose: ${losePercent}%`;

  // --- Update history ---
  history.unshift({ period, num, bs, winPercent, losePercent });
  if (history.length > 50) history.pop();
  renderHistory();

  periodInput.value = '';
});

// --- Render history table ---
function renderHistory() {
  historyBody.innerHTML = '';
  history.forEach(item => {
    const row = `<tr>
      <td>${item.period}</td>
      <td>${item.num}</td>
      <td>${item.bs}</td>
      <td>${item.winPercent}%</td>
      <td>${item.losePercent}%</td>
    </tr>`;
    historyBody.insertAdjacentHTML('beforeend', row);
  });
}