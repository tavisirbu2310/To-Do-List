import React from "react";
import './ToDoElement.scss';
import UncheckedCheck from '../img/checkEmpty.svg';
import CheckedCheck from '../img/checkFull.svg';
import Close from '../img/close.svg';

const ToDoElement = (props) => {
    let style = {
        backgroundColor: props.color
    }
    return (
         <div className='block__wrapper'>
                <li style={style}
                    className={`element ${props.elementStatus ? 'element_list-checked' : 'element_list-unchecked'}`}>
                    <div className='element__image-wrapper'>
                        <img onClick={props.checkItem} className='element__image' src={props.elementStatus ?
                            CheckedCheck : UncheckedCheck} alt="check"/>
                    </div>
                    <span className={`element__text`}>
                    {props.element}
                </span>
                </li>
                <button onClick={props.deleteItem} className="element__delete-item">
                    <img className='element__image-delete' src={Close} alt="delete"/>
                </button>
         </div>

    )
}

export default ToDoElement;
