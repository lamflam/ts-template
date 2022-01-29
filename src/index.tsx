import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function App() {
    return (
        <>
            <div className="w-full h-24 bg-blue-400" />
            <div className="m-auto w-[1024px]">
                <article>
                    <header className="text-6xl font-semibold my-10">Template</header>
                    <p>Template page</p>
                </article>
            </div>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
