import React, { useState, useEffect } from "react";
import "../css/MPRanking.css";

function MPRanking() {
    const [attendanceRank, setAttendanceRank] = useState([]);
    const [cheerRank, setCheerRank] = useState([]);

    useEffect(() => {
        fetch("/api/rankings", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setAttendanceRank(data.attendanceKings);
                setCheerRank(data.cheerFairies);
            })
            .catch(console.error);
    }, []);

    const renderList = (list, countKey) =>
        list.map((item, i) => (
            <li key={item.nickname}>
                <span className="rank">{i + 1}</span>
                <span className="name">{item.nickname}</span>
                <span className="count">{item[countKey]}</span>
            </li>
        ));

    return (
        <div className="MPRankingPage">
            <div className="rankingSection">
                <h3>🏆 직관왕</h3>
                <ol className="rankingList">
                    {renderList(attendanceRank, "attendanceCount")}
                </ol>
            </div>
            <div className="rankingSection">
                <h3>✨ 승리요정</h3>
                <ol className="rankingList">
                    {renderList(cheerRank, "messageCount")}
                </ol>
            </div>
        </div>
    );
}

export default MPRanking;
