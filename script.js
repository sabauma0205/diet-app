const weightInput = document.getElementById("weight");
const recordButton = document.getElementById("recordButton");
const result = document.getElementById("result");
const dateInput = document.getElementById("date");
const today = new Date();
dateInput.value = today.toISOString().split("T")[0];
const records = JSON.parse(localStorage.getItem("records")) || [];
const savedGoalWeight = localStorage.getItem("goalWeight");
const history = document.getElementById("history")
const weightChart = document.getElementById("weightChart");
const goalWeight = document.getElementById("goalWeight");
const goalButton = document.getElementById("goalButton");
const goalResult = document.getElementById("goalResult");

if (savedGoalWeight !== null) {
    goalResult.textContent = "目標体重:" + savedGoalWeight + " kg";
    goalWeight.value = savedGoalWeight;
}

goalButton.addEventListener("click", function () {
    if (goalWeight.value === "") {
        goalResult.textContent = "目標体重を入力してください";
        return;
    }
    goalResult.textContent = "目標体重:" + goalWeight.value + " kg";
    localStorage.setItem("goalWeight", goalWeight.value);
})
function showRecord(record) {
    const newRecord = document.createElement("p");
    newRecord.textContent = record.date + " " + record.weight + " kg";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    newRecord.appendChild(deleteButton);
    history.appendChild(newRecord);
    deleteButton.addEventListener("click", function () {
        const index = records.indexOf(record);
        records.splice(index, 1);
        localStorage.setItem("records", JSON.stringify(records));
        chart.data.labels.splice(index, 1);
        chart.data.datasets[0].data.splice(index, 1);
        chart.update();
        newRecord.remove();
    })
}

for (const record of records) {
    showRecord(record);
}

recordButton.addEventListener("click", function () {
    if (dateInput.value === "" || weightInput.value === "") {
        result.textContent = "日付と体重を記入してください";
        return;
    }
    const sameDate = records.some(function (record) {
        return record.date === dateInput.value;
    })
    if (sameDate) {
        result.textContent = "すでに記録されています。";
        return;
    }
    const record = {
        date: dateInput.value,
        weight: Number(weightInput.value)
    };

    if (goalWeight.value !== "") {
        const goalCount = record.weight - Number(goalWeight.value);
        goalResult.textContent = "目標体重:" + goalWeight.value + " kg" + "目標まであと:" + goalCount.toFixed(1) + " kg";
    }
    if (records.length > 0) {
        const previousRecord = records[records.length - 1];
        const difference = record.weight - previousRecord.weight;
        if (difference > 0) {
            result.textContent = dateInput.value + " " + weightInput.value + " kg" + " " + "前回比: " + "+" + difference.toFixed(1) + " kg";
        } else if (difference < 0) {
            result.textContent = dateInput.value + " " + weightInput.value + " kg" + " " + "前回比: " + difference.toFixed(1) + " kg";
        } else {
            result.textContent = dateInput.value + " " + weightInput.value + " kg" + " " + "前回比: " + "±" + difference.toFixed(1) + " kg";
        }
    } else {
        result.textContent = dateInput.value + " " + weightInput.value + " kg";
    }

    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));
    showRecord(record);
    updateChart(record);
    weightInput.value = "";

});
const weights = records.map(function (record) {
    return record.weight;
});
const dates = records.map(function (record) {
    return record.date;
});
//グラフ
const chart = new Chart(weightChart, {
    type: "line",

    data: {
        labels: dates,
        datasets: [{
            label: "体重",
            data: weights
        }]
    }
})

function updateChart(record) {
    chart.data.labels.push(record.date);
    chart.data.datasets[0].data.push(record.weight);
    chart.update();
}
