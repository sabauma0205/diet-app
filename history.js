const allHistory = document.getElementById("allHistory");
const backButton = document.getElementById("backButton");

const records = JSON.parse(localStorage.getItem("records")) || [];

//記録表示
const reverseRecords = records.slice().reverse();

if(records.length === 0){
    allHistory.textContent = "まだ記録がありません";
}
for (const record of reverseRecords){
    const newRecord = document.createElement("p");

    newRecord.textContent = formatDate(record.date) + " " + record.weight + " kg";

    allHistory.appendChild(newRecord);
}

//戻るボタン
backButton.addEventListener("click", function(){
    window.location.href = "index.html";
})

function formatDate(date) {
    const parts = date.split("-");

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return year + "年" + month + "月" + day + "日";
}