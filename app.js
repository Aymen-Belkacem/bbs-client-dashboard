const API_BASE_URL = window.env.API_BASE_URL;

let chartDay = null;
let chartFood = null;

console.log("Hello from aymen");

async function loadData() {
  const username = document.getElementById("username").value;
  if (!username) {
    alert("Veuillez entrer un nom d'utilisateur");
    return;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/users/${username}`
  );

  if (!response.ok) {
    alert("Utilisateur non trouvé");
    return;
  }

  const foodEntries = await response.json();
  

  //La suite du code sera a faire par le pretraitement!

    // Agréger par jour
  const daily_calories = {};
  foodEntries.forEach(entry => {
    const date = new Date(entry.created_at).toLocaleDateString();
    daily_calories[date] = (daily_calories[date] || 0) + entry.calories;
  });

   // Agréger par aliment
  const by_food = {};
  foodEntries.forEach(entry => {
    by_food[entry.food_name] = (by_food[entry.food_name] || 0) + entry.calories;
  });

    const data = {
    daily_calories: Object.entries(daily_calories).map(([date, calories]) => ({date, calories})),
    by_food: Object.entries(by_food).map(([food, calories]) => ({food, calories}))
  };

  renderCharts(data)

}

function renderCharts(data) {
  const ctxDay = document.getElementById("caloriesByDay").getContext("2d");
  const ctxFood = document.getElementById("caloriesByFood").getContext("2d");

  if (chartDay) chartDay.destroy();
  if (chartFood) chartFood.destroy();

  chartDay = new Chart(ctxDay, {
    type: "line",
    data: {
      labels: data.daily_calories.map(d => d.date),
      datasets: [{
        label: "Calories par jour",
        data: data.daily_calories.map(d => d.calories),
      }]
    }
  });

  chartFood = new Chart(ctxFood, {
    type: "bar",
    data: {
      labels: data.by_food.map(f => f.food),
      datasets: [{
        label: "Calories par aliment",
        data: data.by_food.map(f => f.calories),
      }]
    }
  });
}
