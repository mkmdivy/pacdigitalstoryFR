import React, { useState, useCallback } from 'react';
import Select, { components } from 'react-select'
import './index.css';
import data from './data.json';
import optionsvariable from './optionvariable.json';
import options from './option.json';
// import wordlist from './wordlist.json';
import classes from './Site.module.css';
import { FacebookShareButton, FacebookIcon, TwitterIcon, TwitterShareButton} from 'react-share';
// import { Badge, Chip } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
// import StackGrid from "react-stack-grid";
// import { Web, Videocam, Description, PictureAsPdf} from '@material-ui/icons';
// import ReactGA from 'react-ga';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import queryString from "query-string";
import { useLocation, useParams, useHistory } from 'react-router';
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import { map } from 'd3';





const App = props => {


const location = useLocation()
const history = useHistory()
const [getPng, { ref, isLoading }] = useCurrentPng();

const handleDownload = useCallback(async () => {
  const png = await getPng();
  // Verify that png is not undefined
  if (png) {
    // Download with FileSaver
    FileSaver.saveAs(png, 'myChart.png');
  }
}, [getPng]);

const queryoption =[]


const queryparse = location.search===""?  "Afrique 2000-2020" : queryString.parse(location.search).country 
typeof queryparse==='string'? queryoption.push({value:queryparse,label:queryparse}) : queryparse.map(e => queryoption.push({value:e,label:e}))  
const queryparsevar = location.search===""?  'hv108' : queryString.parse(location.search).type


const queryoptionvar ={value:queryparsevar,label:optionsvariable.map(e=>e.value===queryparsevar? e.label : null)}

const locale = "fr"


const colorBasket = [
  "#0b1e2d",
  "rgb(42,79,95)",  
  "rgb(67,107,101)",
  "rgb(133,163,147)",    
  "rgb(197,209,191)",  
  "rgb(246,186,112)",
  "rgb(42,79,95)",  
  "rgb(67,107,101)",
  "rgb(133,163,147)",    
  "rgb(197,209,191)",
  "rgb(246,186,112)",
  "rgb(42,79,95)",  
  "rgb(67,107,101)",
  "rgb(133,163,147)",    
  "rgb(197,209,191)",
  ];  


const [selectedOption, setSelectedOption] = useState([{value: 'Angola', label: 'Angola'}]);
const [selectedOptionvar, setSelectedOptionvar] = useState({value: 'hv108', label: 'Niveau d’éducation. Nombre médian d’années d’instruction '});
const [selectedType, setSelectedType] = useState('all');

const disableList = {
  "hv108":["Malawi 2012","Madagascar 2011","Madagascar 2013","Angola 2011","Madagascar 2016","Burkina Faso 2014","Angola 2006","Burkina Faso 2017","Malawi 2014","Uganda 2009","Malawi 2017","Ghana 2019","Mali 2010","Liberia 2009","Mali 2015","Liberia 2016","Mozambique 2018","Uganda 2014","Rwanda 2008","Kenya 2015","Senegal 2008","Uganda 2018","Sierra Leone 2016","Liberia 2011","Tanzania 2017","Ghana 2016","Togo 2017"],	
  "hv206":["Mali 2010"],		
  "hv207":["Mali 2010"],		
  "hv208":["Mali 2010"],	
  "hv209":["Ethiopia 2000","Malawi 2000","Mali 2010"],	
  "hv210"	:["Mali 2010"],	
  "hv211"	:["Mali 2010"],	
  "hv212"	:["Mali 2010"],	
  "hv225"	:["Mali 2010","Tanzania 2003","Senegal 2008","Angola 2011","Nigeria 2010","Liberia 2009","Angola 2006","Uganda 2009"],	
  "hv243a":["Kenya 2003","Guinea 2005","Uganda 2000","Benin 2001","Lesotho 2004","Cameroon 2004","Malawi 2000","Egypt 2003","Malawi 2004","Egypt 2005","Ethiopia 2000","Ethiopia 2005","Mali 2001","Tanzania 2003","Mali 2010","Egypt 2000","Morocco 2003","Ghana 2003","Namibia 2000","Senegal 2005","Nigeria 2003","Burkina Faso 2003","Rwanda 2005"],	
  "hv247":["Kenya 2008","Uganda 2011","Lesotho 2004","Angola 2011","Liberia 2009","Burkina Faso 2003","Malawi 2000","Democratic Republic of the Congo 2007","Uganda 2006","Malawi 2004","Egypt 2000","Mali 2001","Egypt 2005","Mali 2006","Mali 2010","Uganda 2000","Morocco 2003","Ghana 2003","Mozambique 2009","Kenya 2003","Namibia 2000","Benin 2001","Nigeria 2003","Egypt 2003","Nigeria 2010","Ethiopia 2005","Rwanda 2005","Angola 2006","Rwanda 2008","Ethiopia 2000","Senegal 2005","Cameroon 2004","Senegal 2008","Guinea 2005","South Africa 2017"],	
  "Education":["Malawi 2012","Madagascar 2011","Madagascar 2013","Angola 2011","Madagascar 2016","Burkina Faso 2017","Angola 2006","Malawi 2014","Malawi 2017","Ghana 2016","Mali 2010","Kenya 2015","Mali 2015","Liberia 2011","Mozambique 2018","Uganda 2018","Rwanda 2008","Uganda 2014","Senegal 2008","Liberia 2009","Sierra Leone 2016","Burkina Faso 2014","Tanzania 2017","Liberia 2016","Togo 2017","Ghana 2019","Uganda 2009"]
}

console.log(disableList["hv108"])
options.map(e => disableList[selectedOptionvar.value].includes(e.value)? e.isDisabled=true : e.isDisabled=false)



const countrylist = []


queryoption.map(d=>countrylist.push(d.value))



const filteredData = data.filter(d => countrylist.includes(d.FR) && d.type === selectedType)
const selectedData = [
  {category:0,label:'Rural', samplesize:0, citysize:0},
  {category:10,label:'10 000 - 50 000', samplesize:0, citysize:0},
  {category:50,label:'50 000 - 250 000', samplesize:0, citysize:0},
  {category:250,label:'250 000 - 1 000 000', samplesize:0, citysize:0},
  {category:1000,label:'1 000 000+', samplesize:0, citysize:0},
]

const eduGroup = ["no education","incomplete primary","complete primary","incomplete secondary","complete secondary","higher"]
let SelectedVariable = selectedOptionvar.value
filteredData.map(d=>
  selectedData.map(e => 
    selectedOptionvar.value==="Education"?
      eduGroup.map(f => 
        e.category === d.category?               
        selectedType === 'all' ? 
          e[d.FR+f]=d[f] :
          selectedType === 'sex'? 
            d.hv219 === 'male'? 
              e[d.FR+"_male"+f]=d[f] :  
            e[d.FR+"_female"+f]=d[f] :         
            d.AgeCategory === 0? 
              e[d.FR+"_young"+f]=d[f] : 
              e[d.FR+"_old"+f]=d[f] :
      null                     
        ) :
    e.category === d.category?       
      selectedType === 'all' ? 
        e[d.FR]=d[SelectedVariable] :
        selectedType === 'sex'? 
          d.hv219 === 'male'? 
            e[d.FR+"_male"]=d[SelectedVariable] :  
          e[d.FR+"_female"]=d[SelectedVariable] :         
          d.AgeCategory === 0? 
            e[d.FR+"_young"]=d[SelectedVariable] : 
            e[d.FR+"_old"]=d[SelectedVariable] :
    null 
  
    )
  )
filteredData.map(d=>
  selectedData.map(e =>       
    e.category === d.category?    
    e["samplesize"] = e["samplesize"]+d.NumberofInd : null   
    )
  )
filteredData.map(d=>
  selectedData.map(e =>       
    e.category === d.category?    
    e["citysize"] = e["citysize"]+d.Numberofcities : null   
    )
  )

  

  const styles = {    
    menu: (base, state) => {
        return {
            ...base,
            backgroundColor: "#ffffff",
            // backgroundColor: "#fef7e7",
            borderRadius: 0,
            boxShadow: 0,
            height: '572px',
            // opacity: ".9"
        }
    },
    option: (base, { isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: isSelected ? "#0b1e2d" : null,
        // color: isDisabled
        //   ? '#ccc'
        //   : isSelected
        //   ? chroma.contrast(color, 'white') > 2
        //     ? 'white'
        //     : 'black'
        //   : data.color,
        ':active': {
          // ...styles[':active'],
          // backgroundColor: isSelected ? "#a70000" : "#a70000",
          // opacity: isSelected ? ".4" : ".7",
          // color: isSelected ? "#fef7e7" : ".7",
        },
      }
    },
    menuList: (base, state) => {
        return {
            ...base,
            maxHeight: 'none',
            height: '100%',
        }
    },
    dropdownIndicator: (base, state) => {
      return { ...base,
        
      };
    },
    control: (base, state) => {
      return { ...base,
        isHidden: true, 
        boxShadow: 'none',
        backgroundColor: 'none',
        borderStyle: 'solid', 
        borderColor: '#449999',
        borderWidth: '0px',
        color: 'none', 
        "&:hover": { 
        }
      };
    },
    singleValue: (base, state) => {
      return {
        ...base,
        fontSize:'2rem',
        fontWeight:'600',
        color: '#212529',
      }
    },
    input: (base, state) => {
      return {
        ...base,
        fontSize:'2rem',
        fontWeight:'900',
        color: '#212529'
      }
    }
};


const IndicatorsContainer = props => {  
  return (
    <div className={classes.Control}>      
      <components.IndicatorsContainer {...props} />
    </div>
  )
}





const renderTooltip = (props) => {
  if (props.active && props.payload !== null && props.payload[0] !== null) {
    let payload = props.payload[0].payload;
    let tooltip = null;    
          tooltip = selectedOptionvar.value==='hv108'? (
            <div className={classes.Tooltip}>            
              {props.payload.map((i, idx) => (
                <p
                  key={idx}
                  style={{
                    color: i.color,
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  {i.dataKey}: {Math.round(i.value * 100) / 100} ans
                </p>
              ))}
            </div>
          ) : (
            <div className={classes.Tooltip}>            
              {props.payload.map((i, idx) => (
                <p
                  key={idx}
                  style={{
                    color: i.color,
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  {i.dataKey}: {Math.round(i.value * 1000) / 10}%
                </p>
              ))}
            </div>
          );
        

    return tooltip;
  }
}

const styleVar = {
  // indicatorSeparator: (base, state) => {

  // },
  menu: (base, state) => {
      return {
          ...base,
          backgroundColor: "white",
          borderRadius: 0,
          boxShadow: 0,
      }
  },
  menuList: (base, state) => {
      return {
          ...base,
      }
  },
  control: (base, state) => {
    return { ...base,
      isHidden: true, 
      boxShadow: 'none',
      backgroundColor: 'none',
      borderStyle: 'solid', 
      borderColor: '#449999',
      borderWidth: '0px',
      color: 'none', 
      "&:hover": { 
      }
    };
  },
  singleValue: (base, state) => {
    return {
      ...base,      
      color: '#212529',
      textAlign: "right",
    }
  },
  input: (base, state) => {
    return {
      ...base,
      color: '#212529'
    }
  },
  multiValue: (base, state) => {
    return {
      ...base,
      color: '#212529',
      textAlign: "right",
      backgroundColor: '#ffffff'
    }
  }
};

let renderLineChart = (
  <ResponsiveContainer height="100%" ref={ref}>
      <BarChart 
      // width={1000}
      // height={600}
      data={selectedData}
      margin={{top: 10, right: 20, left: 20, bottom: 10}}
      >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          {selectedOptionvar.value==="Education"? <YAxis domain={[0,1.05]} /> : <YAxis /> }
          <Tooltip
              cursor={{ strokeWidth: 0 }}
              content={renderTooltip}      
              language={locale} />
          {selectedOptionvar.value==="Education"? null : <Legend />   }
          
          {countrylist.map((d,e) => 
            selectedOptionvar.value==="Education"?                         
              selectedType === 'all'?
              eduGroup.map((f,g) => <Bar dataKey={d+f} stackId='a' fill={colorBasket[g]} />) :
              selectedType === 'sex'?            
              eduGroup.map((f,g) => <Bar dataKey={d+'_male'+f} stackId='a' fill={colorBasket[g]} />) : 
              eduGroup.map((f,g) => <Bar dataKey={d+'_young'+f} stackId='a' fill={colorBasket[g]} />) :
            selectedType === 'all'?
            <Bar dataKey={d} fill={colorBasket[e]}/> :
            selectedType === 'sex'?            
            <Bar dataKey={d+'_male'} fill={colorBasket[e]}/> :
            <Bar dataKey={d+'_young'} fill={colorBasket[e]}/>
          )}     
          {countrylist.map((d,e) => 
            selectedOptionvar.value==="Education"?                         
              selectedType === 'all'?
              null :
              selectedType === 'sex'?            
              eduGroup.map((f,g) => <Bar dataKey={d+'_female'+f} stackId='b' fill={colorBasket[g]} />) : 
              eduGroup.map((f,g) => <Bar dataKey={d+'_old'+f} stackId='b' fill={colorBasket[g]} />) :
            selectedType === 'all'?
            null :
            selectedType === 'sex'?            
            <Bar dataKey={d+'_female'} fill={colorBasket[e+1]}/>                        
            :
            <Bar dataKey={d+'_old'} fill={colorBasket[e+1]}/>
          )}                
      </BarChart>
  </ResponsiveContainer>
);

let buttonGroup = (
  <div className={classes.buttonGroup}>
    <div className={classes.datagroup}>
      <button className={selectedType === 'all'? classes.buttonActive : classes.button} onClick={() => handleChangeType('all',setSelectedType,history,queryparse,queryparsevar)}>Ensemble</button>
      <button className={selectedType === 'sex'? classes.buttonActive : classes.button} onClick={() => handleChangeType('sex',setSelectedType,history,queryparse,queryparsevar)}>Homme/Femme </button>
      <button className={selectedType === 'age'? classes.buttonActive : classes.button} onClick={() => handleChangeType('age',setSelectedType,history,queryparse,queryparsevar)}>Jeune/Vieux</button>
    </div>
    <div className={classes.socialgroup}>
      <TwitterShareButton
        url={"https://mkmdivy.github.io/pacdigitalstoryFR/"+location.search}
        title={"The Economic Power of Africa's cities \n" + selectedOptionvar.label + ":" + queryparse.toString() + "\n" + "Explore more here:"}
        className="Demo__some-network__share-button">
        <TwitterIcon
          size={38}
          bgStyle={{ fill: 'white'}} iconFillColor='#00ACEE'
          round
           />
      </TwitterShareButton>
      <FacebookShareButton
      url={"https://mkmdivy.github.io/pacdigitalstoryFR/"+location.search}
      title="The Economic Power of Africa's cities"
      className="Demo__some-network__share-button">
      <FacebookIcon 
      size={38} 
      bgStyle={{ fill: 'white'}} iconFillColor='#4267B2'
      round
      />
      </FacebookShareButton>      
      {/* <i className={classes.download} onClick={handleDownload}>
        <i className={classes["download-icon"]}> get_app </i> */}
        {/* {isLoading ? 'Downloading...' : 'Download Chart'} */}
      {/* </i> */}
      {/* <a className={classes.fullstory}      
          href="https://oecd.org/africa-urbanisation"
          target='_blank'
          rel="noopener"
          aria-label='Github'
        >        
          Explore the<br/> full story
      </a>     */}
    </div>
</div>
);

// let menubar = (
// );

  
return (
<div class={classes.Layout}>
  <div class={classes.Mixer}>
    <div className={classes.Large}>      
      <div className={classes.SearchBar}>
        <Select 
        styles={styles}
        options={options} 
        isSearchable={false}
        isMulti 
        value={queryoption}
        onChange={ (e,d) => handleChange(e,d,history, selectedOptionvar,setSelectedOption,queryparsevar,selectedType)
          // e => pushQuery(history,{country:e[1].value})
          // setSelectedOption      
        }
        menuIsOpen={true}
        hideSelectedOptions={false}
        components={{
          Control: () => null
        }}
        />                
      </div>      
      <div className={classes.Sm_Md}>
      Mobile view
      </div>
    </div>
  </div>
  <div className={classes.Visualisation} >
    <div className={classes.KeyFigure__Md_Lg}>
    Sélectionner un indicateur
      <div className={classes.KeyFiguresWrapper}>      
          <Select 
          styles={styleVar}
          options={optionsvariable} 
          className={classes.KeyFigures}
          // // isMulti 
          value={selectedOptionvar}
          onChange={ (e,d) => handleChangevar(e,d,history,setSelectedOptionvar,queryparse) }
          components={{
            // IndicatorSeparator: null,
            IndicatorsContainer: IndicatorsContainer
          }}
          
          />      
      </div>
      
      <div className={classes.Sm_Md}>        
        <Select 
          className={classes.KeyFigures}
          styles={styleVar}
          options={options}           
          isMulti 
          value={queryoption}
          onChange={ (e,d) => handleChange(e,d,history, selectedOptionvar,setSelectedOption,queryparsevar,selectedType)}          
          hideSelectedOptions={true}
          isClearable={false}
          />                
      </div>      
      {buttonGroup}
      <div className={classes.textgroup}>
      <br/>
      </div>
      <div className={classes.Control}>
      {separator(selectedData.reduce((e,f) => e + f.samplesize,0))} individus issus de {selectedData.slice(1,5).reduce((e,f) => e + f.citysize,0)} villes.&nbsp;
      <div className={classes.ControlInfoS}>
       <span className={classes.span}>Plus de renseignements info</span>
        <i className={classes["material-icons"]}> info </i>
        <div className={classes.InfoTooltipS}>
            Nombre d'individus utilisés pour calculer l'indicateur <br/>
            Rural: { separator(selectedData[0].samplesize) } <br/>
            10 000 - 50 000: { separator(selectedData[1].samplesize) } <br/>
            50 000 - 250 000: { separator(selectedData[2].samplesize) } <br/>
            250 000 - 1M: { separator(selectedData[3].samplesize) } <br/>
            1M+: { separator(selectedData[4].samplesize) } <br/> 
            <br/> Nombre de villes utilisées pour calculer l'indicateur <br/>
            10 000 - 50 000: { separator(selectedData[1].citysize) } <br/>
            50 000 - 250 000: { separator(selectedData[2].citysize) } <br/>
            250 000 - 1M: { separator(selectedData[3].citysize) } <br/>
            1M+: { separator(selectedData[4].citysize) } <br/>
            </div>
          </div>      
        </div>
        Personnes interrogées qui vivent dans des villes de taille différente
    </div>
    <div className={classes.LineGraph}>
    {renderLineChart}

    </div>
    Note: Les données ne sont pas systématiquement disponibles pour tous les pays et années. Les pays et les années indisponibles apparaissent en gris. <br/>
    Source: The Demographic and Health Surveys (DHS) Program.
    <div className={classes.socialgroupSM}>
      <TwitterShareButton
        url={"https://mkmdivy.github.io/pacdigitalstoryFR/"+location.search}
        title={"The Economic Power of Africa's cities \n" + selectedOptionvar.label + ":" + queryparse.toString() + "\n" + "Explore more here:"}
        className="Demo__some-network__share-button">
        <TwitterIcon
          size={38}
          bgStyle={{ fill: 'white'}} iconFillColor='#00ACEE'
          round
           />
      </TwitterShareButton>
      <FacebookShareButton
      url={"https://mkmdivy.github.io/pacdigitalstoryFR/"+location.search}
      title="The Economic Power of Africa's cities"
      className="Demo__some-network__share-button">
      <FacebookIcon 
      size={38} 
      bgStyle={{ fill: 'white'}} iconFillColor='#4267B2'
      round
      />
      </FacebookShareButton>      
      <i className={classes.download} onClick={handleDownload}>
        <i className={classes["download-icon"]}> get_app </i>
        {/* {isLoading ? 'Downloading...' : 'Download Chart'} */}
      </i>
      {/* <a className={classes.fullstory}      
          href="https://oecd.org/africa-urbanisation"
          target='_blank'
          rel="noopener"
          aria-label='Github'
        >        
          Explore the<br/> full story
      </a>     */}
    </div>
  </div>
</div>
  );
};

export default App;

function handleChange(e, d, history, selectedOptionvar, setSelectedOption ,queryparsevar, selectedType) {
  if (e) {
    if (e.length === 0 ) {
      return;
    } else {
        console.log(selectedOptionvar)
        if(selectedType !== 'all' || selectedOptionvar.value === 'Education' ){e=[e[e.length-1]]}
        const newCountries = e.map(d => d.value);       
        // pushQuery(history, { country: newCountries });
        history.push({
            pathname: history.pathname,
            search: queryString.stringify({country:newCountries,type:queryparsevar})  
        })
      }
  }
}

function handleChangevar(e, d, history, setSelectedOptionvar,queryparse) {
  if (e === null) {
    return;
  } else {
    console.log(queryparse)    
    let newcon = queryparse
    if(e.value === 'Education' ){newcon = typeof(queryparse)==="string"? queryparse : [queryparse[queryparse.length-1]]}    
    setSelectedOptionvar(e)
    console.log(newcon)
    history.push({
        pathname: history.pathname,
        search: queryString.stringify({country:newcon,type:e.value})  
    })
}
}

function handleChangeType(e,setSelectedType, history,queryparse,queryparsevar) {
  
  const newcountry = typeof(queryparse)==="string"? queryparse : queryparse[queryparse.length-1]
  setSelectedType(e)
history.push({
  pathname: history.pathname,
  search: queryString.stringify({country:newcountry,type:queryparsevar,class:e})  
})
}


function separator(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}