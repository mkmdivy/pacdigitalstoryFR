import React, {useState, useEffect, useRef} from 'react';
import DataTable, { createTheme } from "react-data-table-component";
import mapboxgl from 'mapbox-gl';
import classes from './Site.module.css';
import MaterialIcon from 'material-icons-react';
import urbandata from './urbandata.json';

const Urban = () =>  {
    
    mapboxgl.accessToken = 'pk.eyJ1IjoibWttZCIsImEiOiJjajBqYjJpY2owMDE0Mndsbml0d2V1ZXczIn0.el8wQmA-TSJp2ggX8fJ1rA';
    const colors = ["#F3F2E8","#D4EBE2","#B6E3DB","#97DCD5","#79D5CF","#5ACEC9","#3CC6C2","#1DBFBC","#333333"]

    
  const [Dist, setDist] = useState(1000)  
  const [mapnetwork, setmapnetwork] = useState("Network")  
  
  createTheme("solarized", {
    text: {
      primary: "rgba(255,255,255,.99)",
      secondary: "rgba(255,255,255,.99)",
      
    },

    background: {
      default: null,
    },
    context: {
      background: "#cb4b16",
      text: "#fff",
    },
    divider: {
      default: "rgba(0,0,0,.10)",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(70,0,0,.99)",
      disabled: "rgba(0,0,0,.12)",
    },
    highlightOnHover: {
      default: "#e3e3e3",
      text: "#000",
    },
  });

  const columns = [
    // {
    //   name: <h2>ID</h2>,
    //   selector: "Agglomeration_ID",
    //   sortable: true,
    //   cell: (row) => (
    //     <b>
    //       {row.Agglomeration_ID}
    //     </b>
    //   ),
    // },
    {
      name: <h2>Name</h2>,
      selector: "Agglomeration_Name",
      sortable: true,
    },
    {
      name: <h2>Pop</h2>,
      selector: "Population_2015",
      sortable: true,
    },
    {
      name: <h2>D-Index</h2>,
      selector: "nS",
      sortable: true,
    },
    // {
    //   name: <h2>Country</h2>,
    //   selector: "Country",
    //   sortable: true,
    // }
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "72px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };

  

  
  


  const tooltip = e => {
    if (e.payload[0]) {
    return ( <div className={classes.tooltip}> {e.payload[0].payload.time} <br/>SCI {e.payload[0].payload.time}x</div> ) }
  }

  const TimeSlider = ({ Dist, width }) => {
    return (    
      <div style={{ width: `${width}px` }} className={classes["input-slider"]}>
        <input type="range"
          min={0}
          max={1000}
          value={Dist}
          step={1}
          onChange={event =>
             setDist(event.target.value)
            }
        />
        {<span>{Dist} Minutes</span>}
      </div>
    );
  }
  
  
 const [mapbox, setmapbox] = useState( {lng: 10,
    lat: 0,
    zoom: 2.5,
    button: "Map"} );

    const mapContainerRef = useRef(null);

    const [map, setMap] = useState(null);

    

    useEffect(() => { 
  
        if (!map) {
        const popUp = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
      
        const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mkmd/ckh29t4mc06t51aoojdc7v1hl', /// Select mapstyle from mapbox studio
        center: [mapbox.lng, mapbox.lat],
        zoom: mapbox.zoom,
        attributionControl: false
      });
                    
      map.on('load', () => {
        setMap(map);
        });
      }},[map]);
      
const moveMap = e => {
        if(e) {        
        map.flyTo({center: [e.Longitude ,e.Latitude], zoom:11, essential: true });
              }}
  
  
      


return (
    <div>
    <div className={classes.topleft}> <div className={classes.headwrapper}> 
    <DataTable
        columns={columns}
        data={urbandata}
        highlightOnHover={true}
        dense={true}
        noHeader={true}
        theme="solarized"
        customStyles={customStyles}
        pagination={true}
        onRowClicked={e => moveMap(e)}
      />        
          </div></div>
<div><div ref={mapContainerRef} className={classes.mapContainer} /></div>
</div>


);
}

export default Urban;
