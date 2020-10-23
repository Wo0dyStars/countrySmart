export const drawChart = (values) => {
    $("#bar-chart").remove();
    $(".bar-container").append(`<canvas id="bar-chart" width="800" height="400"></canvas>`);
    Chart.defaults.global.defaultFontColor = ' #203a43';
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 50;
    };
    console.log(values);
    new Chart($("#bar-chart"), {
        type: "bar",
        data: {
            labels: ["0-20K", "20K-50K", "50K-100K", "100K-500K", "500K-1M", "1M+"],
            datasets: [
                {
                    label: "Population",
                    backgroundColor: ["#3D3D3D", "#CB2B3E","#9C2BCB","#2AAD27","#2A81CB", "#CB8427"],
                    data: [
                        values[0], values[1], values[2], values[3], values[4], values[5]
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            legend: { display: false }
        }
    })
}