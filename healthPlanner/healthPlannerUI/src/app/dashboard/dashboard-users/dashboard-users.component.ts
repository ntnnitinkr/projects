import { Component, OnInit } from '@angular/core';
import customers from './customers.js';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.scss']
})
export class DashboardUsersComponent implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  
  name = 'Angular';
  today = new Date().toLocaleDateString();
  customers = customers;
  
  websiteTraffic:zingchart.graphset = {
    type: 'line',
    "background-color" : '#FFC107',
    tooltip: {
    
      "font-color" : '#333'
    },
    plot: {
      marker: {
        "background-color" : '#FFC107',
        "border-width" : '2px'
        },
      aspect: 'spline'
    },
    plotarea: {
      margin: "35 40 40 40",
    },
    "scale-x": {
      "line-color": "#ffd363",
      tick: {
        "line-color":'none'
          },
      "show-labels": ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'],
      item: {
        "font-color": "white",
       
      },
      guide: {
        "line-color":'none'
      }
    },
    "scale-y": {
              "offset-x": -15,
      "line-color": "none",
      tick: {
        "line-color":'none'
      },
      item: {
        "font-color": "white"
      },
      guide: {
        "line-color": "#ffd363"
      }
    },
    series: [{
      values: [500, 300, 400, 500, 600, 200, 300],
      
      "line-color" :'white',
      "line-width" : '2px'
       
    }]
  };

  allocatedBudget:zingchart.graphset = {
    type: 'gauge',
    alpha: 1,
    "background-color": '#fff',
    plot: {
      "background-color": '#be314b'
    },
    plotarea: {
      margin: '30 0 0 0'
    },
    scale: {
      "size-factor": 1
    },
    "scale-r": {
      tick: {
        'line-color': "none",
      },
      values: '0:100:10',
  
      
      center: {  //Pivot Point
        size:5,
        'background-color': "white",
        'border-color': "b"
      },
      item: {
        "font-color": '#777'
        
      },
      
    },
    
    tooltip: {
      "background-color": 'black'
    },
    series: [
      {
        values: [70],
        animation: {
                   speed: 2500
        }
      }
    ]
  };

  mediaConsumption:zingchart.graphset = {
  type: 'area',
  legend: {
    align: 'left',
    "margin-top": '30px',
    "background-color": 'none',
    "border-width": '0px',
    item: {
      "font-family": 'Roboto'
    },
    layout: 'x4',
    marker: {
      type: 'circle',
      "border-color": 'transparent',
      "line-segment-size": '5px'
    },
    shadow: false,
    "toggle-action": 'remove',
    "vertical-align": 'top'
  },
  plot: {
    tooltip: {
     // text: '<div style="text-align: center; line-height: 14px; padding-top: 5px;"><b>%t</b><br><br>%kt<br><br><b>Traffic: %node-value KBps</b></div>',
      "margin-top": '5px',
      padding: '5px 15px',
      "font-family": 'Roboto'
    },
    
    aspect: 'spline',
    marker: {
      "border-color": '#ffffff',
      shadow: false,
      size: '3px'
    },
    shadow: false
  },
  plotarea: {
    "margin-top": '70px',
    "margin-right": '65px',
    "margin-left": '20px'
  },
  "scale-x": {
    values: [1564646407000, 1564646707000, 1564647007000, 1564647307000, 1564647607000, 1564647907000, 1564648207000, 1564648507000, 1564648807000, 1564649107000, 1564649407000, 1564649707000, 1564650007000],
    guide: {
      visible: false
    },
    item: {
      "font-color": '#acacac',
      "font-family": 'Roboto',
      "offset-y": '2px',
       "fill-offset-x": '20px',
         
    },
    "line-gap-size": '0px',
    tick: {
      visible: false
    },
    transform: {
      all: '%h:%i %A'
    },
  },
  "scale-y": {
    format: '%v KBps',
    guide: {
      "line-style": 'dotted'
    },
    item: {
      "font-color": '#acacac',
      "font-family": 'Roboto'
    },
    "line-width": '0px',
    placement: 'opposite',
    tick: {
      visible: false
    },
    "zoom-snap": true
  },
  
  series: [

    {
      "legend-text": 'Outbound',
      values: [32.0226, 28.9014, 28.1703, 23.3206, 32.8237, 27.3159, 27.2535, 25.1924, 16.7938, 15.0575, 13.4819, 12.0279, 0.009],
      "background-color": '#ffc107',
      "line-color": '#ffc107',
      marker: {
        "background-color": '#ffc107'
      },
      
    },
        {
      "legend-text": 'Inbound',
      values: [7.1359, 7.4406, 8.2906, 6.6474, 6.8506, 17.8208, 15.6422, 9.8198, 7.3635, 6.0869, 3.0183, 4.4826, 0.0155],
      "background-color": '#ff5722',
      "line-color": '#ff5722',
      marker: {
        "background-color": '#ff5722'
      },
      
    },
  ]
};

  customerInteractions:zingchart.graphset = {
  type : 'radar',
  "background-color": '#2196f3',
  plot : {
    aspect : 'area',
    animation: {
      effect:3
    },
    marker: {
      alpha: 0,
    },
  },
  "scale-v" : {
    visible : false
  },
  "scale-k" : {
    values : '0:5:1',
    labels : ['Support', 'Sales', 'Returns', 'Orders', 'Marketing', 'General' ],
    item : {
      "font-color" : 'white',
      "background-color" : "none",
      "border-color" : "#aeaeae",
      "border-width" : 0,
      "font-size": 12,
      "border-radius" : 10
    },
    tick : {
      "line-color" : '#c6e3ff',
      "line-width" : 1,
      "line-style" : 'solid',
      size : 10
    },
    guide : {
      "line-color" : "none",
      "line-style" : 'solid',
      alpha : 0.4,
      "background-color" : "#b2ebf2 #cfd8dc"
    }
  },
  plotarea: {
    margin: '20'
  },
  series : [
    {
      values : [70, 39, 48, 39, 41, 35],
      "line-color": '#fff',
      "background-color": '#fff',
    },
    {
      values : [10, 20, 54, 60, 51, 75],
      "line-color" : '#00e5ff',
      "background-color" : '#00e5ff'
    },

  ]
};

  enagementPlatforms:zingchart.graphset = 
  {
        type: 'bar',
        legend: {
          align: 'right',
          "margin-top": '0px',
          "margin-left": '0px',
          "background-color": 'none',
          "border-width": '0px',
          item: {
            "font-family": 'Roboto'
          },
          layout: 'x4',
          marker: {
            type: 'circle',
            "border-color": 'transparent',
            "line-segment-size" :'5px'
          },
          shadow: false,
          "toggle-action": 'remove',
          "vertical-align": 'top'
        },
        plotarea: {
          "margin-top": 40,
         "margin-bottom": 90,
          "margin-left": 80,
        },
        "scale-y": {
          values: '0:120:10',
          guide: {
            "line-style": 'dashed',
            "line-gap-size": 10
          },
          "line-color": 'none',
          tick: {
            visible: false
          },
          item: {
            color: '#b8beca',
            "padding-right": 20,
          }
        },
        tooltip: {
          visible: false,
        },
        "scale-x": {
          "line-color": 'none',
          guide: {
            "line-color": '#657685',
          },
          tick: {
            visible: false,
          },
          item: {
            "padding-top": '20px',
               color: '#b8beca'
          }
        },

        "background-color": '#fff',
        plot: {
            stacked: true,
            "bar-width": 10,
        },
        crosshair: {
          marker: {

          },
          "plot-label": {
          },
          "scale-label": {
          }
        },
        series: [{
          "values":[19,5,13,23,9,15,10,14,17,13,6,28,13,17,2,20,5,9,15,4,10,10,17,28,16,8,5,3,9,22],"background-color":"#9c27b0", 
          "legend-text": "Facebook"},
          {"values":[11,29,27,12,16,19,27,5,13,3,2,2,9,16,3,16,2,27,11,28,22,16,3,6,11,0,24,15,5,15],"background-color":"#673ab7", "legend-text": 'Twitter'},
          {"values":[19,20,22,10,19,7,8,7,24,7,25,26,3,4,25,19,28,25,24,5,22,14,17,4,29,4,16,0,16,23],"background-color":"#e91e63", "legend-text": "Instagram"},
          {"values":[16,3,12,5,11,20,14,8,19,18,28,15,14,17,20,24,24,14,11,2,2,28,12,4,1,8,5,14,11,6],"background-color":"#2196f3", "legend-text": "TikTok"}]
      }

      reachSpark:zingchart.graphset = {
        "type": "line",
        "plotarea": {
          margin: 3,
        },
        "scale-x": {
          visible: false,
        },
        "scale-y": {
          visible: false,
        },
        tooltip: {
          visible: false,
        },
        plot: {
          aspect: 'spline',
          marker: {
            visible: false,
          }
        },
        "series": [
          {
            "values": [1,2,5,3,9,4],
            "line-color": '#2196f3',
          }
        ]
      };

      impressionsSpark:zingchart.graphset = {
        "type": "bar",
        "plotarea": {
          margin: 3,
        },
        "scale-x": {
          visible: false,
        },
        "scale-y": {
          visible: false,
        },
        tooltip: {
          visible: false,
        },
        plot: {
          aspect: 'spline',
          marker: {
            visible: false,
          }
        },
        "series": [
          {
            "values": [3,4,6,7,4,10],
            "background-color": '#8bc34a',
          }
        ]
      };

      campaignSpark:zingchart.graphset = {
        "type": "area",
        "plotarea": {
          margin: 3,
        },
        "scale-x" :{
          visible: false,
        },
        "scale-y" : {
          visible: false,
        },
        tooltip: {
          visible: false,
        },
        plot: {
          aspect: 'spline',
          marker: {
            visible: false,
          }
        },
        "series": [
          {
            "values": [3,4,6,7,4,3],
            "line-color":'#FFF',
            "background-color":'#f44336',
          }
        ]
      };

  
}
