import React from 'react';
import RedBtn from './RedBtn.module.css';
const RedButton = (props) =>{
    return (
        <div>
            <button type="submit" className={RedBtn.RedButton}>{props.value}</button>
        </div>
    );
};

export default RedButton;