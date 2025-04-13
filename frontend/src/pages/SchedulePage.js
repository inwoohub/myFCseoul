import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import ScheduleList from "../components/ScheduleList";
import "../css/SchedulePage.css";

function SchedulePage() {
    const [user, setUser] = useState(null);

    // 컴포넌트 마운트 시 /api/user 엔드포인트에서 사용자 정보를 불러옴
    useEffect(() => {
        fetch("/api/user", {
            credentials: "include", // 쿠키와 인증정보 포함
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("사용자 정보를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                // 백엔드에서 반환한 JSON에 role, nickname 속성이 있다고 가정
                if (data && data.nickname) {
                    setUser(data);
                }
            })
            .catch((error) => console.error("에러:", error));
    }, []);

    return (
        <div className="SchedulePage">
            <NavigationBar className="NavigationBar" />

            <div className="SchedulePage2">
                {/* 스케줄 콘텐츠 영역 */}
                <div className="ScheduleContent">
                    {/* ScheduleList 컴포넌트에 사용자 정보를 prop으로 전달 */}
                    <ScheduleList className="ScheduleList" user={user} />
                </div>

                <div className="ScheduleStatistics">
                    <span>직관 성적 공간</span>
                </div>
            </div>
        </div>
    );
}

export default SchedulePage;
