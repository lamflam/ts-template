import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function App() {
    for (let i = 0; i < 5; i++) {
        console.log(i);
    }
    return <div className="bg-blue-300">Hello World!</div>;
}

ReactDOM.render(<App />, document.getElementById('root'));
