import './App.css';
import Navbar from './components/Navbar';
import TodoApp from './components/TodoApp';
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <div className='App'>
      <RegistrationForm/>
      <header className='header'>
        <Navbar/>
      </header>
      <TodoApp/>
    </div>
  );
}

export default App;