// On a essayé d'en faire une variable d'env pas hardcodée mais sans succès, pas très grave
const API_BASE_URL = "https://web-api-3-bbs-d5hcb6fjbrb7cdau.italynorth-01.azurewebsites.net";

let chartDay = null;
let chartFood = null;
let chartStats = null;

console.log("Hello from BBS");
//console.log("Hello from Aymen");

async function loadData() {
  const username = document.getElementById("username").value;
  if (!username) {
    alert("Enter a username");
    return;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/users/${username}`
  );

  if (!response.ok) {
    alert("User not found");
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

async function loadData2() {
  const foodprocessed_id = document.getElementById("foodprocessed_id").value;
  if (!foodprocessed_id) {
    alert("Enter a foodprocessed id");
    return;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/foodprocessed/${foodprocessed_id}`
  );

    if (!response.ok) {
    alert("Food processed not found");
    return;
  }

  const foodProcessed = await response.json();

  const response2= await fetch(
    `${API_BASE_URL}/api/foodentries/${foodprocessed_id}`
  );

  if (!response2.ok) {
    alert("Food entry not found");
    return;

  foodEntry=await response2.json;

  renderCharts2(foodProcessed);
  showFoodEntry(foodEntry);
}

function showFoodEntry(data)
{
  const foodParagraph=document.getElementById("foodEntryContent");

  foodParagraph.innerHTML=data;
}

function renderCharts2(data)
{

  const ctxStats = document.getElementById("foodEntryStats").getContext("2d");
  
  if (chartStats) chartStats.destroy();
  

   const labels = [
    "protein_efficiency",
    "caloric_density",
    "sugar_to_protein_ratio",
    "estimated_carbs"
  ];

  chartStats=new Chart(ctxStats,{
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Food entry stats",
        data: labels.map(key => data[key])
      }]
    }
  });

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
        label: "Calories per day",
        data: data.daily_calories.map(d => d.calories),
      }]
    }
  });

  chartFood = new Chart(ctxFood, {
    type: "bar",
    data: {
      labels: data.by_food.map(f => f.food),
      datasets: [{
        label: "Calories per aliment",
        data: data.by_food.map(f => f.calories),
      }]
    }
  });
}
