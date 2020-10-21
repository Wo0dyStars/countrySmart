export const drawChart = (values) => {
    $("#bar-chart").remove();
    $(".bar-container").append(`<canvas id="bar-chart" width="800" height="400"></canvas>`);
    Chart.defaults.global.defaultFontColor = ' #203a43';
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 50;
    };

    new Chart($("#bar-chart"), {
        type: "bar",
        data: {
            labels: ["0-100000", "100000-200000", "200000-300000", "300000-400000", "400000-500000", "500000-1000000", "1000000-5000000", "5000000+"],
            datasets: [
                {
                    label: "Population",
                    backgroundColor: ["#3D3D3D", "#7B7B7B","#9C2BCB","#2AAD27","#2A81CB", "#CB2B3E", "#CB8427", "#CAC428"],
                    data: [
                        values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7]
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