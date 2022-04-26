import React from 'react';
import {Link} from 'react-router-dom';

const Mainheader = (props) => {    
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/networkmap">Network</Link>
                    </li>
                    <li>
                        <Link to="/urban">Urban</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
export default Mainheader;