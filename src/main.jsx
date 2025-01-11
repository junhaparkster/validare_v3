import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.jsx';
    import './index.css';
    import UserList from './UserList';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import ResultsPage from './ResultsPage';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/user-list" element={<UserList />} />
          </Routes>
        </Router>
      </React.StrictMode>,
    )
