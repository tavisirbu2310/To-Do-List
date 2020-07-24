import React, {useState,useEffect} from 'react';
import './ToDoCenter.scss';
import ToDoElement from "../components/ToDoElement";
import axios from 'axios';
import uniqid from 'uniqid';
import Spinner from "../components/Spinner/Spinner";
import Radium from "radium";


const ToDoCenter = () => {
    let [todoItems, setToDoItems] = useState([]);
    let [item, setItem] = useState('');
    let [color,setColor] = useState('orangered');

    useEffect(()=>{
        axios.get('https://todo-44463.firebaseio.com/tasks.json')
            .then(response=>{
                const taskList = [];
                for(let key in response.data){
                    taskList.push({...response.data[key],firebaseId:key});
                }
                if(taskList.length>0){
                    setToDoItems(taskList);
                }
            })
            .catch(error=>{
                console.log(error);
            });
    },[])

    let storeItem = (event) => {
        setItem(event.target.value);
    }

    let addItem = () => {
        let itemObject= {
            task: item,
            checked: false,
            id: uniqid(),
            color: color
        }
        axios.post('https://todo-44463.firebaseio.com/tasks.json',itemObject)
            .then(response=>{
                axios.get('https://todo-44463.firebaseio.com/tasks.json')
                    .then(response=>{
                        const taskList = [];
                        for(let key in response.data){
                            taskList.push({...response.data[key],firebaseId:key});
                        }
                        if(taskList.length>0){
                            setToDoItems(taskList);
                            setItem('');
                        }
                    })
            });
    }

    let checkItem = (item) =>{
        let tasksCopy = [...todoItems];
        let tasksIds = tasksCopy.map(e=>e.id);
        let currIdIndex = tasksIds.indexOf(item.id);
        tasksCopy[currIdIndex]={...tasksCopy[currIdIndex],checked:!tasksCopy[currIdIndex].checked};
        setToDoItems(tasksCopy);
        axios.get('https://todo-44463.firebaseio.com/tasks.json')
            .then(response=>{
                let updatedObject = {...response.data,[item.firebaseId]:tasksCopy[currIdIndex]};
                axios.put('https://todo-44463.firebaseio.com/tasks.json',updatedObject).then(response=>{});
            })
    }

    let deleteItem  = (id) => {
        axios.delete('https://todo-44463.firebaseio.com/tasks/'+id+'.json').then(response=>{
            let tasksCopy = [...todoItems];
            let tasksIds = tasksCopy.map(e=>e.firebaseId);
            let currIdIndex = tasksIds.indexOf(id);
            tasksCopy.splice(currIdIndex,1);
            setToDoItems(tasksCopy);
        });
    }

    let red = () => {
       setColor('orangered');
    }
    let blue = () => {
        setColor('#137bb0');
    }
    let yellow = () => {
        setColor('#a5a50d');
    }
    let orange = () => {
        setColor('#996b1d');
    }
    let pink = () => {
        setColor('deeppink');
    }
    let purple = () => {
        setColor('rebeccapurple');
    }
    let green = () => {
        setColor('forestgreen');
    }

    let inputStyle = {
        ':focus':{borderBottom: `3px solid ${color}`}
    }

    return (
        <div className='content_wrapper'>
            <ul className='content_wrapper__list'>
                {todoItems.length>0?todoItems.map((element, index) => {
                    return (
                        <ToDoElement
                            key={element.id?element.id:index}
                            element={element.task}
                            elementStatus = {element.checked}
                            checkItem={()=>checkItem(element)}
                            deleteItem={()=>deleteItem(element.firebaseId)}
                            color={element.color}
                            />
                    )
                }):<div className='loading__faze'>You got nothing to do yet... <Spinner/></div>}
            </ul>
            <div className="content_wrapper__add-item">
                <div className='input-wrapper'>
                    <input id='item' placeholder='Type new to-do item' onChange={storeItem} style={inputStyle}
                           className='content_wrapper__input' type="text" value={item}/>
                    <label className='content_wrapper__input-label' htmlFor='item'>Type new to-do item</label>
                </div>
                <div className="content_wrapper__color-selector">
                    <button onClick={red} className='content_wrapper__color red'>&nbsp;</button>
                    <button onClick={blue} className='content_wrapper__color blue'>&nbsp;</button>
                    <button onClick={yellow} className='content_wrapper__color yellow'>&nbsp;</button>
                    <button onClick={orange} className='content_wrapper__color orange'>&nbsp;</button>
                    <button onClick={pink} className='content_wrapper__color pink'>&nbsp;</button>
                    <button onClick={purple} className='content_wrapper__color purple'>&nbsp;</button>
                    <button onClick={green} className='content_wrapper__color green'>&nbsp;</button>
                </div>
            </div>
            <button onClick={addItem} className='content_wrapper__button'>Add</button>
        </div>
    )
}

export default Radium(ToDoCenter);