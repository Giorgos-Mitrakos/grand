import React from 'react';
import { Link } from 'react-router-dom';
import { navigation } from '../data/data';

function MainMenu(props) {

    return (
        <div>
            <ul>
                {navigation.map(x =>
                    <li><Link to={x.linkto}>{x.title}</Link></li>
                )}
            </ul>
        </div>
    )
}

export default MainMenu;