import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import africa from './africa.json';
import classes from './Site.module.css';
import { BarChart, Cell, Bar, Tooltip, XAxis,ResponsiveContainer} from 'recharts';
import ReactGA from 'react-ga';
import './index.css';
import logo from './OECD_white_EN.png';
import MaterialIcon from 'material-icons-react';
import { ForceGraph2D } from 'react-force-graph';


ReactGA.initialize('UA-128268752-1');
ReactGA.pageview(window.location.search+window.location.pathname);

//iso_3166_1_alpha_3

//// Access token for Africapolis mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoibWttZCIsImEiOiJjajBqYjJpY2owMDE0Mndsbml0d2V1ZXczIn0.el8wQmA-TSJp2ggX8fJ1rA';


const colors = ["#F3F2E8","#D4EBE2","#B6E3DB","#97DCD5","#79D5CF","#5ACEC9","#3CC6C2","#1DBFBC","#333333"]

const Dist = 1950

const TimeSlider = ({ Dist, width }) => {
  return (    
    <div style={{ width: `${width}px` }} className={classes["input-slider"]}>
      <input type="range"
        min={1950}
        max={2020}
        value={Dist}
        step={10}
        onChange={(e) =>
           console.log(e)
          }
      />
      {<span>{Dist}</span>}
    </div>
  );
};

export default TimeSlider;


//////////////////

// sort array ascending

const legend = (
<div>
  <h4>Social Connectedness</h4>
<div><span style={{backgroundColor: colors[0]}}></span>{"< 1x"} <small>{"(20th percentile)"}</small></div>
<div><span style={{backgroundColor: colors[1]}}></span>1-2x</div>
<div><span style={{backgroundColor: colors[2]}}></span>2-3x</div>
<div><span style={{backgroundColor: colors[3]}}></span>3-5x</div>
<div><span style={{backgroundColor: colors[4]}}></span>5-10x</div>
<div><span style={{backgroundColor: colors[5]}}></span>10-25x</div>
<div><span style={{backgroundColor: colors[6]}}></span>25-100x</div>
<div><span style={{backgroundColor: colors[7]}}></span>{">= 100x"}</div>
<div><span style={{backgroundColor: colors[8]}}></span>{"Data not available"}</div>
</div>
);

const tooltip = e => {
  if (e.payload[0]) {
  return ( <div className={classes.tooltip}> {e.payload[0].payload.region} <br/>SCI {e.payload[0].payload.sciScaled}x</div> ) }
}

//// Basic setting of the map
class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 10,
      lat: 0,
      zoom: 2.5,
      selectedCountry: "NG",
      name: "",
      region: "Africa",
      button: "Map",
      rendered: "",
      distance: "1950"
    };
  }

componentDidMount() {
//// Initial map setting

this.map = new mapboxgl.Map({
  container: this.mapContainer,
  style: 'mapbox://styles/mkmd/ckguwdhux0j7719p9rz2hpmpi', /// Select mapstyle from mapbox studio
  center: [this.state.lng, this.state.lat],
  zoom: this.state.zoom,
  attributionControl: false
});

this.map.on('load', () => {
this.map.addSource('node-237nu4', { type: 'vector', url: 'mapbox://mkmd.1ya649n5'});
this.map.addSource('edge-dm0qvz', { type: 'vector', url: 'mapbox://mkmd.1rxtvzvy'});
this.map.addLayer({
  id: 'edge',
  source:'edge-dm0qvz',
  type : "line",
  'source-layer':'edge-dm0qvz',
  // filter: [ "match", ["get", "iso_3166_1"], ["TJ","IR","CN", "GL", "SJ", "TM", "EH", "KP" ], false, true ],
  paint: {
    "line-color" : ["match", ["get","border"],
     ["0"],colors[0],
     "red"
  ]
  },
})

this.map.addLayer({
  id: 'node',
  source:'node-237nu4',
  type : "circle",
  'source-layer':'node-237nu4',
  // filter: [ "match", ["get", "iso_3166_1"], ["TJ","IR","CN", "GL", "SJ", "TM", "EH", "KP" ], false, true ],
  paint: {
    "circle-radius":  [
      "step",
      ["get", `Pop2015`],
      2.5,
      10000,
      3,
      30000,
      4,
      100000,
      6,
      300000,
      8,
      1000000,
      10,
      2000000,
      13,
      11847635,
      15,
    ]
    ,
    "circle-color": [
      "step",
      ["get", `Pop2015`],
      colors[0],
      10000,
      colors[1],
      30000,
      colors[2],
      100000,
      colors[3],
      300000,
      colors[4],
      1000000,
      colors[5],
      2000000,
      colors[6],
      11847635,
      colors[7],
    ],

    "circle-stroke-width": 1,
    "circle-stroke-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0,
      3,
      0,
      15,
      1,
    ],
    "circle-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      0,
      3,
      0.4,
      10,
      1
    ]

    
    // [
    //   "case",
    //   ["boolean", ["feature-state", "hover"], false],
    //   1,
    //   0.7,
    // ],
  },
});
});



/////////////////////////////////////////// Network part



africa.links.map(e => e.border===1? e.color="rgb(255,0,0)" : e.color="rgb(255,255,255,.3)")
// africa.links.map(e => e.border==1? e.value=e.value+1000 : null)
// africa.links.map(e => e.value=e.value*Math.random())
console.log(africa)



/////////////////////////////////////////////////////////////////////////////////////

}

componentDidUpdate(prevProps, prevState){
  if(prevState.button !== this.state.button)
  {this.onUpdate(this.state.button)}
  

}

onUpdate = (button) => {
  
  this.setState({rendered:"Yes"})
  // if (button==="Map")
  // {this.setState({rendered:"Yes"})}
  // else {this.setState({rendered:"Yes"})}
  
}



//5 Countries with the highest SCI
render() {
    return (
      <div>
        <div className={classes.topleft}> <div className={classes.headwrapper}> <div className={classes.buttonwrapper}>          
        <button className={this.state.button==="Map"? classes.buttonActive : classes.button} onClick={() => this.state.button==="Network"? this.setState({button:"Map"}) : null}>{"Map"}</button>
        <button className={this.state.button==="Network"? classes.buttonActive : classes.button} onClick={() => this.state.button==="Map"? this.setState({button:"Network"}) : null}>{"Network"}</button></div>
        <headtitle> {this.state.name}</headtitle></div><br/>
        <span>Cities and roads in Africa</span>
        <TimeSlider/>
        <table className={classes.table}>
            <thead>
              <tr>
                {/* <th>Country</th><th>Road</th><th>Network</th> */}
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
        {/* <br/> <span>Regional average</span> */}
              <div className="VariableInfoWrapper">
                  <MaterialIcon icon="info"/>
                  <span><strong>How it is calculated?</strong><br/>
                  The Social Connectedness Index measures the strength of connectedness between two geographic areas as represented by Facebook friendship ties.<br/><br/>
                  <strong>Methodology</strong><br/>
                  We use aggregated friendship connections on Facebook to measure social connectedness between geographies. Locations are assigned to users based on information they provide, connection information, and location services they have opted into. We use these friendships to estimate the probability a pair of users in these countries are Facebook friends and map this to an index score called the Social Connectedness Index (SCI). If the SCI is twice as large between two pairs of regions, it means the users in the first region-pair are about twice as likely to be connected than the second region-pair.<br/><br/>
                The figure shows a heat map of the social connectedness. For each country in our data, the colors highlight connections of the focal country, given in orange. The lightest color corresponds to the 20th percentile of the connectedness to the focal country; darker colors correspond to closer connections.
                <br/><br/><color>Click the right button to check more detail and download the data on the Facebook page</color> </span>
              </div>
              <div className="FB">
              <a href="https://dataforgood.fb.com/tools/social-connectedness-index/#:~:text=The%20Social%20Connectedness%20Index%20measures,social%20mobility%2C%20trade%20and%20more.">
                  <MaterialIcon icon="facebook"/>
                  <span>Move to the Facebook Data for Good page to check detail and download the data</span>
              </a>
              </div>
           </div>
           <div><div ref={el => this.mapContainer = el} className={classes.mapContainer} /></div>
           {this.state.button==="Map"? null :  < ForceGraph2D     
        d3Force={('link',null)}
        backgroundColor="black"    
        graphData={africa}
        nodeId="id"
        nodeVal="size3"
        nodeLabel="nameG"
        nodeAutoColorBy="group"
        linkSource="source"
        linkTarget="target"
        linkColor="color"
        cooldownTicks="50"        
        onZoom={(z)=>{
          console.log(z)
        }}        
        /> }          
      </div>      
    )
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
