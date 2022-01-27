import React from 'react';
import ReactDOM from 'react-dom';

function App() {
    for (let i = 0; i < 5; i++) {
        console.log(i);
    }
    return <div>Hello World!</div>;
}

ReactDOM.render(<App />, document.getElementById('root'));
