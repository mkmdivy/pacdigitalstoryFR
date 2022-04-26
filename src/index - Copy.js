import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import sciOriginal from './sci.json';
import countryData from './country.json';
import classes from './Site.module.css';
import { BarChart, Cell, Bar, Tooltip, XAxis,ResponsiveContainer} from 'recharts';
import ReactGA from 'react-ga';
import './index.css';
import logo from './OECD_white_EN.png';
import MaterialIcon from 'material-icons-react';


ReactGA.initialize('UA-128268752-1');
ReactGA.pageview(window.location.search+window.location.pathname);

//iso_3166_1_alpha_3

//// Access token for Africapolis mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoibWttZCIsImEiOiJjajBqYjJpY2owMDE0Mndsbml0d2V1ZXczIn0.el8wQmA-TSJp2ggX8fJ1rA';


const colors = ["#F3F2E8","#D4EBE2","#B6E3DB","#97DCD5","#79D5CF","#5ACEC9","#3CC6C2","#1DBFBC","#333333"]



//////////////////

// sort array ascending
let top5_list=[[],[],[],[],[]];
let result=[];



const regionTotal={Africa:55,Americas:40,Asia:46,Europe:42,Oceania:12}

const asc = arr => arr.sort((a, b) => a - b);

const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

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
      lng: 40,
      lat: 30,
      zoom: 2,
      selectedCountry: "NG",
      name: "",
      region: "Africa",
      button: "From",
      rendered: ""
    };
  }

componentDidMount() {
//// Initial map setting

let sci=[];
sciOriginal.map(e=>this.state.button==="From"? sci.push({start:e.start,end:e.end,sci:e.sci}) : sci.push({end:e.start,start:e.end,sci:e.sci}))

let selected = [];
let scidata= [];
let scidataRank = [];
let scidataRankRegion = {Africa:[],Americas:[],Asia:[],Europe:[],Oceania:[]}
let scidataRankRegionCode = {Africa:[],Americas:[],Asia:[],Europe:[],Oceania:[]}
sci.map(e => e.start===this.state.selectedCountry? selected.push(e) : null)
selected.map(e => {
  scidata.push(e.sci)
  scidataRank.push(e.sci)
  scidataRankRegion[countryData[e.end][1]].push(e.sci)
  scidataRankRegionCode[countryData[e.end][1]].push(e.end)
})


Object.keys(scidataRankRegion).map(
  k => {
    let sorted = scidataRankRegion[k].slice().sort((a,b) => b-a);
    let rank_region=scidataRankRegion[k].map(v => sorted.indexOf(v)+1);
    scidataRankRegion[k]=rank_region
  }
 )

     this.popUp = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false
          });

     this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mkmd/ckguwdhux0j7719p9rz2hpmpi', /// Select mapstyle from mapbox studio
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      attributionControl: false
    });
                  let top5=scidata.sort((a,b) => b-a).slice(0,5);
                  let sortedSCI=scidata.sort((a,b) => b-a);
                  let rank_country=scidataRank.map(v => sortedSCI.indexOf(v)+1 );

                  let percentile20 = quantile(scidata, .20)
                  selected.map(e => {
                    e.region=countryData[e.end][1]
                    e.sciScaled= Math.round(e.sci/percentile20)
                    if(e.sci===top5[0]) {top5_list[0]=e}
                    else if(e.sci===top5[1]) {top5_list[1]=e}
                    else if(e.sci===top5[2]) {top5_list[2]=e}
                    else if(e.sci===top5[3]) {top5_list[3]=e}
                    else if(e.sci===top5[4]) {top5_list[4]=e}
                  })
                                // Calculate the sums and group data (while tracking count)
                  const reduced = selected.reduce(function(m, d){
                      if(!m[d.region]){
                        m[d.region] = {...d, count: 1};
                        return m;
                      }
                      m[d.region].sciScaled += d.sciScaled;
                      m[d.region].count += 1;
                      return m;
                   },{});

                   // Create new array from grouped data and compute the average
                      result = Object.keys(reduced).map(function(k){
                       const item  = reduced[k];
                       return {
                           region: item.region,
                           sciScaled: Math.round(item.sciScaled/item.count*100)/100,
                       }
                   })

                   let matchExpression = ['match', ['get', 'iso_3166_1']];

                   // Calculate color values for each country based on 'hdi' value
                   selected.forEach( e => {
                   if(e.sci/percentile20 < 1) {matchExpression.push(e['end'], "#F3F2E8");}
                   else if (e.sci/percentile20 < 2) {matchExpression.push(e['end'], "#D4EBE2");}
                   else if (e.sci/percentile20 < 3) {matchExpression.push(e['end'], "#B6E3DB");}
                   else if (e.sci/percentile20 < 5) {matchExpression.push(e['end'], "#97DCD5");}
                   else if (e.sci/percentile20 < 10) {matchExpression.push(e['end'], "#79D5CF");}
                   else if (e.sci/percentile20 < 25) {matchExpression.push(e['end'], "#5ACEC9");}
                   else if (e.sci/percentile20 < 100) {matchExpression.push(e['end'], "#3CC6C2");}
                   else {matchExpression.push(e['end'], "#1DBFBC");}
                   });

                   matchExpression.push(this.state.selectedCountry, '#e8ae40');
                   // Last value is the default, used where there is no data
                   matchExpression.push('rgba(0, 0, 0, 0)');
                   // //console.log(this.state.selectedOption, prevState.selectedOption);

                       this.map.on('load', () => {

                         this.map.addControl(new mapboxgl.AttributionControl({customAttribution: "Africapolis"}));
                   // Add Country shape
                         this.map.addSource('africapolis_country', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1'});

                   // Add Country layer
                         this.map.addLayer({
                           id: 'country',
                           source:'africapolis_country',
                           type: 'fill',
                           'source-layer':'country_boundaries',
                           filter: [ "match", ["get", "iso_3166_1"], ["TJ","IR","CN", "GL", "SJ", "TM", "EH", "KP" ], false, true ],
                           paint: {
                             'fill-color': matchExpression,
                             'fill-opacity': 0.9
                           }
                         });

                           this.map.on('click', 'country', e =>  {
                              this.popUp.remove()
                              this.onUpdate(e.features[0].properties.iso_3166_1,e.features[0].properties.name_en,e.features[0].properties.region)
                               });

                           this.map.on('mousemove', 'country', e =>  {
                              if(this.state.selectedCountry!==e.features[0].properties.iso_3166_1) {
                              this.map.getCanvas().style.cursor = 'pointer';
                              let coordinates = [e.lngLat.lng, e.lngLat.lat];
                              let sciPopup=[];
                              let rankPopup=[];
                              let sciColor=[];
                              let rankPopupRegion=[];
                              let regionNumber=regionTotal[e.features[0].properties.region];

                              selected.forEach( (d,i) => {
                              if(d.end===e.features[0].properties.iso_3166_1) {
                                sciPopup=Math.round(d.sci/percentile20)
                                rankPopup=rank_country[i]

                                if(d.sci/percentile20 < 1) {sciColor.push("#F3F2E8");}
                                else if (d.sci/percentile20 < 2) {sciColor.push("#D4EBE2");}
                                else if (d.sci/percentile20 < 3) {sciColor.push("#B6E3DB");}
                                else if (d.sci/percentile20 < 5) {sciColor.push("#97DCD5");}
                                else if (d.sci/percentile20 < 10) {sciColor.push("#79D5CF");}
                                else if (d.sci/percentile20 < 25) {sciColor.push("#5ACEC9");}
                                else if (d.sci/percentile20 < 100) {sciColor.push("#3CC6C2");}
                                else {sciColor.push("#1DBFBC");}
                              }
                              });

                            if(scidataRankRegionCode[e.features[0].properties.region]) {
                              scidataRankRegionCode[e.features[0].properties.region].map(
                                (d,i)=> e.features[0].properties.iso_3166_1===d? rankPopupRegion.push(scidataRankRegion[e.features[0].properties.region][i]) : null
                            )}


                          		this.popUp
                                .setLngLat(coordinates)
                          			.setHTML(
                                `<strong>${e.features[0].properties.name_en}</strong> ${sciPopup}<little>x</little><br/>
                              <span>Rank:</span><bold>${rankPopup}</bold><span>/194</span><br/>
                                <small>In ${e.features[0].properties.region}:</small><bold>${rankPopupRegion}</bold><span>/${regionNumber}</span>`
                                )
                          			.addTo(this.map);
                                var popupElem = this.popUp.getElement();
                                popupElem.style.color = sciColor[0];
                              } else {this.popUp.remove()}
                            });

                            this.map.on('mouseleave', 'country', e =>  {
                              this.map.getCanvas().style.cursor = ''
                              this.popUp.remove()
                            });

                       });

                       this.setState({name: "Nigeria"})

}

componentDidUpdate(prevProps, prevState){
  if(prevState.button !== this.state.button)
  {this.onUpdate(this.state.selectedCountry, this.state.name, this.state.region)}
}

onUpdate = (ISO2, Name, Region) => {

              this.setState({selectedCountry:ISO2})

              let sci=[];
              sciOriginal.map(e=>this.state.button==="From"? sci.push({start:e.start,end:e.end,sci:e.sci}) : sci.push({end:e.start,start:e.end,sci:e.sci}))


              let selected = [];
              let scidata= [];
              let scidataRank = [];
              let scidataRankRegion = {Africa:[],Americas:[],Asia:[],Europe:[],Oceania:[]}
              let scidataRankRegionCode = {Africa:[],Americas:[],Asia:[],Europe:[],Oceania:[]}
              sci.map(e => e.start===this.state.selectedCountry? selected.push(e) : null)
              selected.map(e => {
                scidata.push(e.sci)
                scidataRank.push(e.sci)
                scidataRankRegion[countryData[e.end][1]].push(e.sci)
                scidataRankRegionCode[countryData[e.end][1]].push(e.end)

              })


              Object.keys(scidataRankRegion).map(
                k => {
                  let sorted = scidataRankRegion[k].slice().sort((a,b) => b-a);
                  let rank_region=scidataRankRegion[k].map(v => sorted.indexOf(v)+1);
                  scidataRankRegion[k]=rank_region
                }
               )


              let percentile20 = quantile(scidata, .20)
              //selected.map(e => e.sci = e.sci/ percentile20)

              let sortedSCI=scidata.sort((a,b) => b-a);
              let rank_country=scidataRank.map(v => sortedSCI.indexOf(v)+1 );
              let top5=scidata.sort((a,b) => b-a).slice(0,5);
              selected.map(e => {
                e.region=countryData[e.end][1]
                e.sciScaled= Math.round(e.sci/percentile20)
                if(e.sci===top5[0]) {top5_list[0]=e}
                else if(e.sci===top5[1]) {top5_list[1]=e}
                else if(e.sci===top5[2]) {top5_list[2]=e}
                else if(e.sci===top5[3]) {top5_list[3]=e}
                else if(e.sci===top5[4]) {top5_list[4]=e}
              })

              //top5_list.map(e => e.sciScaled= Math.round(e.sci/percentile20))

                            // Calculate the sums and group data (while tracking count)
              const reduced = selected.reduce(function(m, d){
                  if(!m[d.region]){
                    m[d.region] = {...d, count: 1};
                    return m;
                  }
                  m[d.region].sciScaled += d.sciScaled;
                  m[d.region].count += 1;
                  return m;
               },{});

               // Create new array from grouped data and compute the average
                  result = Object.keys(reduced).map(function(k){
                   const item  = reduced[k];
                   return {
                       region: item.region,
                       sciScaled: Math.round(item.sciScaled/item.count*100)/100,
                       numbers:item.count
                   }
               })

            // console.log(JSON.stringify(result,null,4));

              this.setState({name:Name,region:Region})

              let matchExpression = ['match', ['get', 'iso_3166_1']];

              // Calculate color values for each country based on 'hdi' value
              selected.forEach( e => {
              if(e.sci/percentile20 < 1) {matchExpression.push(e['end'], "#F3F2E8");}
              else if (e.sci/percentile20 < 2) {matchExpression.push(e['end'], "#D4EBE2");}
              else if (e.sci/percentile20 < 3) {matchExpression.push(e['end'], "#B6E3DB");}
              else if (e.sci/percentile20 < 5) {matchExpression.push(e['end'], "#97DCD5");}
              else if (e.sci/percentile20 < 10) {matchExpression.push(e['end'], "#79D5CF");}
              else if (e.sci/percentile20 < 25) {matchExpression.push(e['end'], "#5ACEC9");}
              else if (e.sci/percentile20 < 100) {matchExpression.push(e['end'], "#3CC6C2");}
              else {matchExpression.push(e['end'], "#1DBFBC");}
              });

              matchExpression.push(this.state.selectedCountry, '#e8ae40');
              // Last value is the default, used where there is no data
              matchExpression.push('rgba(0, 0, 0, 0)');

              // //console.log(this.state.selectedOption, prevState.selectedOption);

              this.remove('country');

              this.map.addLayer({
                id: 'country',
                source:'africapolis_country',
                type: 'fill',
                filter: [ "match", ["get", "iso_3166_1"], ["IR","CN", "GL", "SJ", "TM", "EH", "KP","TJ" ], false, true ],
                'source-layer':'country_boundaries',
                paint: {
                  'fill-color': matchExpression,
                  'fill-opacity': 0.9
                }
              });
              this.map.on('mousemove', 'country', e =>  {
                if(this.state.selectedCountry!==e.features[0].properties.iso_3166_1) {
                this.map.getCanvas().style.cursor = 'pointer';
                let coordinates = [e.lngLat.lng, e.lngLat.lat];
                let sciPopup=[];
                let rankPopup=[];
                let sciColor=[];
                let rankPopupRegion=[];
                let regionNumber=regionTotal[e.features[0].properties.region];

                selected.forEach( (d,i) => {
                if(d.end===e.features[0].properties.iso_3166_1) {
                  sciPopup=Math.round(d.sci/percentile20)
                  rankPopup=rank_country[i]

                  if(d.sci/percentile20 < 1) {sciColor.push("#F3F2E8");}
                  else if (d.sci/percentile20 < 2) {sciColor.push("#D4EBE2");}
                  else if (d.sci/percentile20 < 3) {sciColor.push("#B6E3DB");}
                  else if (d.sci/percentile20 < 5) {sciColor.push("#97DCD5");}
                  else if (d.sci/percentile20 < 10) {sciColor.push("#79D5CF");}
                  else if (d.sci/percentile20 < 25) {sciColor.push("#5ACEC9");}
                  else if (d.sci/percentile20 < 100) {sciColor.push("#3CC6C2");}
                  else {sciColor.push("#1DBFBC");}
                }
                });

              if(scidataRankRegionCode[e.features[0].properties.region]) {
                scidataRankRegionCode[e.features[0].properties.region].map(
                  (d,i)=> e.features[0].properties.iso_3166_1===d? rankPopupRegion.push(scidataRankRegion[e.features[0].properties.region][i]) : null
              )}


                this.popUp
                  .setLngLat(coordinates)
                  .setHTML(
                  `<strong>${e.features[0].properties.name_en}</strong> ${sciPopup}<little>x</little><br/>
                <span>Rank:</span><bold>${rankPopup}</bold><span>/194</span><br/>
                  <small>In ${e.features[0].properties.region}:</small><bold>${rankPopupRegion}</bold><span>/${regionNumber}</span>`
                  )
                  .addTo(this.map);
                  var popupElem = this.popUp.getElement();
                  popupElem.style.color = sciColor[0];
                } else {this.popUp.remove()}
               });
               this.setState({rendered:"Yes"})
}

remove = obj => {
    this.map.removeLayer(obj)
}

moveRegion = e => {
      if(e) {
      switch(e.activeLabel){
      case 'Africa':
      this.map.flyTo({center: [32.259 ,2.036], zoom:3.14, essential: true }); break;
      case 'Americas':
      this.map.flyTo({center: [-69.390 ,22.259], zoom:1.82, essential: true }); break;
      case 'Asia':
      this.map.flyTo({center: [104.687 ,32.592], zoom:3.14, essential: true }); break;
      case 'Europe':
      this.map.flyTo({center: [27.920 ,56.907], zoom:3.19, essential: true }); break;
      case 'Oceania':
      this.map.flyTo({center: [155.731 ,-16.435], zoom:3.11, essential: true }); break;
      default:
      return null;
            }}
}



//5 Countries with the highest SCI
render() {
    return (
      <div>
        <div className={classes.topleft}> <div className={classes.headwrapper}> <div className={classes.buttonwrapper}>
          <button className={this.state.button==="From"? classes.buttonActive : classes.button} onClick={() => this.state.button==="To"? this.setState({button:"From"}) : null}>{"From"}</button>
          <button className={this.state.button==="To"? classes.buttonActive : classes.button} onClick={() => this.state.button==="From"? this.setState({button:"To"}) : null}>{"To"}</button></div>
          <headtitle> {this.state.name}</headtitle></div><br/>
        <span>5 Most Connected Countries</span>
        <table className={classes.table}>
            <thead>
              <tr>
                <th>Country</th><th>SCI</th><th>Region</th>
              </tr>
            </thead>
            <tbody>
              {top5_list[0].end? top5_list.map((e,i)=>
              <tr> <td>{countryData[top5_list[i].end][0]}</td> <td>{top5_list[i].sciScaled}x</td><td className={ countryData[top5_list[i].end][1]===this.state.region? classes.regionsel : classes.normal }>{countryData[top5_list[i].end][1]}</td></tr>
              ) : null}
            </tbody>
          </table>
        <br/> <span>Regional average</span>
          <ResponsiveContainer width='100%' aspect={32.0/15.0}>
            <BarChart data={result.sort((a, b) => a.region.localeCompare(b.region))} style={{marginTop: "10px"}}  onClick={e => this.moveRegion(e)} >
              <XAxis dataKey="region" interval={0} style={{ textAnchor: 'middle', fontFamily: 'Arial', fill: 'rgba(255, 255, 255, 1)' }} />
              <Tooltip content={tooltip} cursor={{fill: 'rgba(255, 255, 255, 0.3)'}} />
              <Bar dataKey="sciScaled" fill="#3CC6C2" id="region">
                {result.map((entry,index) => (
										<Cell cursor="pointer" key={`cell-${index}`} fill={entry.region ===  this.state.region ? '#e8ae40' : '#3CC6C2' } />
									))}
  						</Bar>
  					</BarChart>
          </ResponsiveContainer>
              <div className="VariableInfoWrapper">
                  <MaterialIcon icon="info"/>
                  <span><strong>What is the Social Connectedness Index?</strong><br/>
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
        <div ref={el => this.mapContainer = el} className={classes.mapContainer} />
 
      </div>
    )
  }
}
ReactDOM.render(<Application />, document.getElementById('app'));
