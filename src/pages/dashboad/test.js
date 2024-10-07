// src/App.js
import React, { useState } from 'react';

const App = () => {
    const [year, setYear] = useState('2023');
    const [selectedMonths, setSelectedMonths] = useState([]);

    const data = [
        { date: 1672531199000 }, // 2023-01-01
        { date: 1680307200000 }, // 2024-04-01
        { date: 1682899200000 }, // 2024-05-01
        { date: 1685577600000 }, // 2024-06-01
        { date: 1693564800000 }, // 2024-09-01
    ];

    const handleMonthChange = (event) => {
        const { options } = event.target;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(parseInt(options[i].value));
            }
        }
        setSelectedMonths(selected);
    };

    const filterData = () => {
        return data.filter(item => {
            const date = new Date(item.date);
            return date.getFullYear() === parseInt(year) && selectedMonths.includes(date.getMonth());
        });
    };

    const filteredData = filterData();

    return (
        <div>
            <h1>Chọn Năm và Tháng</h1>

            <label htmlFor="year">Chọn Năm:</label>
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </select>

            <label htmlFor="months">Chọn Tháng:</label>
            <select id="months" multiple onChange={handleMonthChange}>
                {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>Tháng {i + 1}</option>
                ))}
            </select>

            <button onClick={filterData}>Lọc</button>

            <div className="result">
                {filteredData.length === 0 ? (
                    <p>Không có dữ liệu nào phù hợp.</p>
                ) : (
                    filteredData.map((item, index) => (
                        <div key={index}>
                            {new Date(item.date).toLocaleDateString('vi-VN')}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default App;