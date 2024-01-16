import './App.css';
import Navbar from './components/Navbar';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className='App'>
      <header className='header'>
        <Navbar/>
      </header>
      <TodoApp/>
    </div>
  );
}

export default App;