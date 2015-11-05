function drawChart(name, labels){
	var ctx = document.getElementById(name).getContext("2d");//"myChart"

	var data = {
	    labels: labels,
	    datasets: [
	    	makeDataset([65, 59, 80, 81, 56, 55, 40], 'first', 0, null),
	    	makeDataset([28, 48, 40, 19, 86, 27, 190], second, 1, null)
		/*{
		    label: "My First dataset",
		    fillColor: "rgba(220,220,220,0.2)",
		    strokeColor: "rgba(220,220,220,1)",
		    pointColor: "rgba(220,220,220,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(220,220,220,1)",
		    data: [65, 59, 80, 81, 56, 55, 40]
		},
		{
		    label: "My Second dataset",
		    fillColor: "rgba(151,187,205,0.2)",
		    strokeColor: "rgba(151,187,205,1)",
		    pointColor: "rgba(151,187,205,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(151,187,205,1)",
		    data: [28, 48, 40, 19, 86, 27, 190]
		}*/
	    ]
	};
	var myLineChart = new Chart(ctx).Line(data, options);
}

drawChart('myChart', ["January", "February", "March", "April", "May", "June", "July", "August"]);

function makeDataset(data, name, index, colour){
	return {
		label: name,
		fillColor: "rgba(220,220,220,0.2)",
		strokeColor: "rgba(220,220,220,1)",
		pointColor: "rgba(220,220,220,1)",
		pointHighlightStroke: "rgba(220,220,220,1)",

		pointStrokeColor: "#fff",
		pointHighlightFill: "#fff",
		data: data
	};
}