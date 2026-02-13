import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardRouter } from './pages/DashboardRouter';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<DashboardRouter />} />
            </Routes>
        </Router>
    );
}

export default App;
