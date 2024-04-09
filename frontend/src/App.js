import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UsersList from './pages/userlist/UserList';
import GetUser from './pages/get-user/GetUser';
import CreateUser from './pages/create-user/CreateUser';
import UpdateUser from './pages/update-user/UpdateUser';
import DeleteUser from './pages/delete-user/DeleteUser';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/api/users/:id" element={<GetUser />} />
          <Route path="/api/users/new" element={<CreateUser />} />
          <Route path="/api/users/:id/edit" element={<UpdateUser />} />
          <Route path="/api/users/:id/delete" element={<DeleteUser />} />
          <Route path="/" element={<UsersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
