function buildMetadata(sample) {

    var url = "/metadata/"+sample;
    console.log('metadata:', sample);
    d3.json(url).then(function(metadataSampleNames) {
        console.log('metadataSampleNames:', metadataSampleNames);
        var div_metadata = d3.select("#sample-metadata");
        console.log('div-metadata:', div_metadata)

//      sample_metadata = {}
//      for result in results:
//        sample_metadata["sample"] = result[0]
//        sample_metadata["ETHNICITY"] = result[1]
//        sample_metadata["GENDER"] = result[2]
//        sample_metadata["AGE"] = result[3]
//        sample_metadata["LOCATION"] = result[4]
//        sample_metadata["BBTYPE"] = result[5]
//       sample_metadata["WFREQ"] = result[6]
        
        var metadata_info = div_metadata.html();  
        if (metadata_info != ''){
            var all_h6 = div_metadata.selectAll("h6").remove();
         }
        Object.entries(metadataSampleNames).forEach(([key, value]) => {
             var details = `${key} : ${value}`;
             if (key !== 'WFREQ') {   
                 div_metadata.append("h6").text(details);
             }    
             else {buildGauge(value);
             } 
            
        });



    // BONUS: Build the Gauge Chart
    });
}



function buildGauge(sample_wfreq) {
    
    var wfreq = parseInt(sample_wfreq);
    
    // Trig to calc meter point
    var degrees = 180-wfreq * 20,
         radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
    var gauge_data = [
        { type: 'scatter',
          x: [0], y:[0],
          marker: {size: 28, color:'850000'},
          showlegend: false,
          name: 'Belly Button Washing Frequency',
          text: wfreq,
          hoverinfo: 'text'},
                
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
          rotation: 90,
          text: ["8-9", "7-8","6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
          textinfo: 'text',
          textposition:'inside',
          marker: {colors:['#0b610b', '#088A4B', '#01DF01',  '#2EFE9A', '#81F7BE', '#CEF6CE', '#E3F6CE', '#F5ECCE', '#EFFBEF', 'white']},
//          marker: {colors:['#088A29', '#04B431', '#01DF3A', '#00FF00',  '#2EFE2E', '#58FA58',  '#81F781', '#A9F5A9', '#CEF6CE', 'white']},
          labels: ["8-9", "7-8","6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
          hoverinfo: 'label',
          hole: .5,
          type: 'pie',
          showlegend: false
    }];
       var gauge_layout = {
          shapes:[{
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              },
        }],
          title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
          height: 500,
          width: 500,
          xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
          yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
        };

    Plotly.newPlot('gauge', gauge_data, gauge_layout);
    
    
}    




function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots

    var url = "/samples/"+sample; 
    console.log('samples:', url)

    d3.json(url).then(function(sample) {
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var sample_values = sample.sample_values;
     
 
        sample_arr=[];
        for (var i=0; i < otu_ids.length; i++) {
         
              sample_dict ={
                  otu_id : otu_ids[i],
                  otu_label : otu_labels[i],
                  sample_value : sample_values[i]
              }
             console.log('sample_dict', i, sample_dict);
             sample_arr.push(sample_dict)
         }    
        
        var sorted_array =    sample_arr.sort(function(a, b) {
              return parseFloat(b.sample_value) - parseFloat(a.sample_value);
        });

        console.log('sorted :', sorted_array);

        const top_10_array = sorted_array.slice(0,10);
        console.log('top_10 :', top_10_array);
                   
        // @TODO: Build a Bubble Chart using the sample data
        var top_10_otu_ids = top_10_array.map(row => row.otu_id);
        var top_10_otu_labels = top_10_array.map(row => row.otu_label);
        var top_10_sample_values = top_10_array.map(row => row.sample_value);
        console.log('top_10 labels:', top_10_otu_labels);

        var bubble_data = [{
            type: "scatter",
            mode: "markers",
            marker : {symbol:"circle",
                      size:sample_values,
                      color:otu_ids},
            text:  otu_labels,
            name : 'Belly Button Biodiversity',
            x: otu_ids,
            y: sample_values
        }]
        
        var layout = {
          title: "<b>Belly Button Biodiversity</b>",
        };

        Plotly.newPlot("bubble", bubble_data, layout);
        console.log('bubble chart done');

        


    // @TODO: Build a Pie Chart
        var pie_data = [{
            labels: top_10_otu_ids,
            values: top_10_sample_values,
            name : top_10_otu_labels,
            hovertext:top_10_otu_labels,
            hoverinfo: 'text'+'labels'+'values',
            type : 'pie'
        }]
        var pie_layout = {
            title: "<b>Top 10 Samples</b>",
//          height: 500,
//          width: 500,
//          margin: {
//            l: 0,
//            r: 0,
//            t: 0,
//            b: 0
//          }
      };


        Plotly.newPlot("pie", pie_data, pie_layout);
        

    }); 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(`BB_${sample}`)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
