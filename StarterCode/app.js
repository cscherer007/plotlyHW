// bring in metadata from json file
function importMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    });
}

// start building the charts
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples= data.samples;
        var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
        var result= resultsarray[0]
    
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        //bar chart
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
          };
        
        //bar chart data
        var barData =[
            {
                y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x:values.slice(0,10).reverse(),
                text:labels.slice(0,10).reverse(),
                type:"bar",
                orientation:"h"  
            }
        ];
        Plotly.newPlot("bar", barData, barLayout);
        
        //bubble chart
        var bubbleLayout = {
            margin: {t: 0},
            xaxis: {title: "ID's"},
            hovermode: "closest",
        };

        //bubble data
        var bubbleData = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                color: ids,
                size: values,
                }
            }
        ];

        Plotly.plot("bubble", bubbleData, bubbleLayout);      
  });
}

function init() {
    // refer to dropdown element
    var selector = d3.select("#selDataset");
    
    // populate dropdwon selector with names from data list
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // use selected sample to build the initial plots
      const firstSample = sampleNames[0];
      importMetadata(firstSample);
      buildCharts(firstSample);
      buildGauge(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    //build new charts when new selection occurs
    importMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
  }
  
  // initialize dashboard
  init();
