import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select'
import './index.css';
import greendb from './greendb.json';
import wordlist from './wordlist.json';
import classes from './Site.module.css';
import { Badge, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StackGrid from "react-stack-grid";
import { Web, Videocam, Description, PictureAsPdf} from '@material-ui/icons';


const App = props => {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }));

  const chipclasses = useStyles();


  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgba(45,45,45,1)",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "rgba(255,255,255,1)" : "rgba(255,255,255,1)",
      // Removes weird border around container      
      // "&:hover": {
      //   // Overwrittes the different states of border
      //   borderColor: state.isFocused ? "red" : "blue"

      // }
    }),
    menu: base => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0
    }),
    menuList: base => ({
      ...base,
      // kill the white space on first and last option
                 
      padding: 0
    }),
    singleValue: base => ({
      ...base,
      color:'white'            
    })


  }

  useEffect(() => { 
    
  },[])


  const handleClick = (e) => {
    console.log(e)
    setSelectedOption({value:e, label:e})
  }
 
  const top5buttons = () => {
    return (
      <div class={chipclasses.root}>
      <button value={''} onClick={(e) => handleClick(e.target.value)}>{"Select all"}</button>            
      {options.slice(0,10).map((e,i)=> 
      <Badge badgeContent={freqSorted[i]} color={freqSorted[i] > 50? "secondary" : freqSorted[i] > 40? "error" : "primary" }><Chip  label={e.value} onClick={() => handleClick(e.value)} /></Badge>)
      }      
      </div>
    )
  
  }    
  
  const dataPresent = (input) => {
    return (
      <div>
        <StackGrid
        columnWidth={230}
        gutterWidth={10}
      >
      {result.slice(0,150).map((e,idx)=> {return <a href={e.Link} target="_blank"><button key={idx} className={e.Type==="Website"? classes.buttonW : e.Type==='Video'?  classes.buttonV : e.Type==='Article'?  classes.buttonA : classes.buttonR}>{e.Name}<div style={{position:"fixed",right:5,bottom:5}}>{e.Type==="Website"? <Web/> : e.Type==='Video'? <Videocam/>  : e.Type==='Article'?  <Description/> : <PictureAsPdf/>}</div> </button><br/></a>})}
      </StackGrid>
      </div>
    )
  
  }    

{/* <button className={classes.buttonActive}>{e.Name}</button> */}

  const [selectedOption, setSelectedOption] = useState({value: '', label: 'Search'});
  console.log(selectedOption)
  // +"  "+e.freq
const options = []
const wordcount = []
const wordAvoid = ["THE","OF","IN","AND","TO","FOR","A","IS","WITH","ON","FROM","-","USING","HOW","BY","NEW","INTO","AN","&","WHAT","ABOUT",2020,"ARE","AT","IT","CHANGE","FIRST",10,"WORLD?????S","USE","OVER","HAS","|","ONE",2019,"TIME",2050,"OR","?????",":"]
// wordlist.map(e => options.push({value: e.name, label: e.name}))

greendb.map(e => {
  e.keyword=e.Name.toUpperCase().split(' ')
  // e.keyword.map(x => wordcount.push(x))    
})

// greendb.map(e => console.log(e.keyword))
let result = selectedOption.value==''? greendb: greendb.filter(e => (e.keyword.includes(selectedOption.value)))
result.map(e => e.keyword.map(x => wordcount.push(x)))


const wordresult = wordcount.filter(e => !wordAvoid.includes(e))
// console.log(wordcount)


const counts = {};

wordresult.map(num => counts[num] = counts[num] ? counts[num] + 1 : 1)


// console.log(counts)


// console.log(selectedOption)
const keysSorted = Object.keys(counts).sort(function(b,a){return counts[a]-counts[b]})
console.log(keysSorted);     // bar,me,you,foo

const freqSorted = Object.keys(counts).sort(function(b,a){return counts[a]-counts[b]}).map(key => counts[key]);
console.log(freqSorted);

keysSorted.map((e,idx) => options.push({value:e,label:e+" "+freqSorted[idx]}) )


  
return (
<div class={classes.main}>
  <div class={classes.header}>
  <div style={{position:"fixed",right:350,top:20,color:"white"}}><Web/><Videocam/><Description/><PictureAsPdf/></div>
    <div class={classes.title}>{"Green Technologies Knowledge Resources Explorer"}</div>    
    <div class={classes.box}>
    <Select 
    styles={customStyles}
    options={options} 
    // isMulti 
    value={selectedOption}
    onChange={setSelectedOption}
    /></div>
    {top5buttons()}
  </div>
{dataPresent()}
</div>
  );
};

export default App;



