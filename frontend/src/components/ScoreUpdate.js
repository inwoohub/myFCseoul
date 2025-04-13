import React, { useState } from "react";
import "../css/ScoreUpdate.css";

function ScoreUpdate({ schedule, onClose, onScoreUpdated }) {
    // Schedule 엔티티의 scoreHome, scoreAway, result 값을 초기값으로 사용합니다.
    const [scoreHome, setScoreHome] = useState(
        schedule.scoreHome !== null ? schedule.scoreHome : ""
    );
    const [scoreAway, setScoreAway] = useState(
        schedule.scoreAway !== null ? schedule.scoreAway : ""
    );
    const [result, setResult] = useState(schedule.result || "");

    const handleSubmit = () => {
        // 간단한 입력값 검증
        if (scoreHome === "" || scoreAway === "" || result === "") {
            alert("모든 값을 입력해 주세요.");
            return;
        }

        const payload = {
            scheduleId: schedule.scheduleId,
            scoreHome: parseInt(scoreHome, 10),
            scoreAway: parseInt(scoreAway, 10),
            result: result // '승', '무', '패' 중 하나
        };

        fetch("/api/scheduleresult", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Result update failed.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Match result updated successfully!");
                if (onScoreUpdated) {
                    onScoreUpdated(payload);
                }
                onClose();
                window.location.reload();
            })
            .catch((error) => {
                console.error("Score update error:", error);
                alert("Failed to update result.");
            });
    };

    return (
        <div className="ScoreUpdate_page">
            <div className="ScoreUpdate_modal_content">
                <button className="ScoreUpdate_close_btn" onClick={onClose}>X</button>
                <div className="ScoreUpdate_match_info">
                    <p>
                        {schedule.homeTeam} vs {schedule.awayTeam}
                    </p>
                    <p>
                        {schedule.matchDate} {schedule.matchTime}
                    </p>
                </div>
                <div className="ScoreUpdate_input_group">
                    {/* 홈 팀 이름을 라벨로 사용 */}
                    <label>{schedule.homeTeam} Score:</label>
                    <input
                        type="number"
                        value={scoreHome}
                        onChange={(e) => setScoreHome(e.target.value)}
                    />
                </div>
                <div className="ScoreUpdate_input_group">
                    {/* 원정 팀 이름을 라벨로 사용 */}
                    <label>{schedule.awayTeam} Score:</label>
                    <input
                        type="number"
                        value={scoreAway}
                        onChange={(e) => setScoreAway(e.target.value)}
                    />
                </div>
                <div className="ScoreUpdate_input_group">
                    <label>Result:</label>
                    <select value={result} onChange={(e) => setResult(e.target.value)}>
                        <option value="">결과 선택</option>
                        <option value="승">승</option>
                        <option value="무">무</option>
                        <option value="패">패</option>
                    </select>
                </div>
                <button className="ScoreUpdate_submit_btn" onClick={handleSubmit } >
                    등록
                </button>
            </div>
        </div>
    );
}

export default ScoreUpdate;
