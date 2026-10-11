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
const goalForm = document.getElementById("goalForm");
const changeGoalButton = document.getElementById("changeGoalButton");

changeGoalButton.style.display = "none";

if (savedGoalWeight !== null) {
    goalResult.textContent = "目標体重:" + savedGoalWeight + " kg";
    goalWeight.value = savedGoalWeight;

    goalForm.style.display = "none";
    changeGoalButton.style.display = "block";
}

goalButton.addEventListener("click", function () {
    if (goalWeight.value === "") {
        goalResult.textContent = "目標体重を入力してください";
        return;
    }
    chart.data.datasets[1].data = chart.data.labels.map(function () {
    return Number(goalWeight.value);
    });

    chart.update();
    goalResult.textContent = "目標体重:" + goalWeight.value + " kg";
    localStorage.setItem("goalWeight", goalWeight.value);
    goalForm.style.display = "none";
    changeGoalButton.style.display = "block";
})

changeGoalButton.addEventListener("click", function(){
    goalForm.style.display = "block";
    changeGoalButton.style.display = "none";
})

//結果表示
function showRecord(record) {
    const newRecord = document.createElement("p");
    newRecord.textContent = formatDate(record.date) + " " + record.weight + " kg";
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
        chart.data.datasets[1].data.splice(index, 1);
        chart.update();
        newRecord.remove();
    })
}

for (const record of records) {
    showRecord(record);
}

//記録ボタン
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
            data: weights,
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 4
        },
        {
            label: "目標体重",
            data: dates.map(function () {
                if (goalWeight.value === "") {
                    return null;
                }

                return Number(goalWeight.value);
            }),

            borderColor: "#2e7d32",
            backgroundColor: "rgba(76, 175, 80, 0.12)",

            borderWidth: 2,
            borderDash: [8, 6],
            pointRadius: 0,
            fill: "start"

        }]
    }
})

function updateChart(record) {
    chart.data.labels.push(record.date);
    chart.data.datasets[0].data.push(record.weight);
    if(goalWeight.value === ""){
        chart.data.datasets[1].data.push(null);
    }else{
    chart.data.datasets[1].data.push(Number(goalWeight.value));
    }
    chart.update();
}

function formatDate(date){
    const parts = date.split("-");

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return year + "年" + month + "月" + day + "日";
}
