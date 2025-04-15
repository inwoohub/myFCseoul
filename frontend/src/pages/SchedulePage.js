import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import ScheduleList from "../components/ScheduleList";
import AttendanceDoughnutChart from "../components/AttendanceDoughnutChart";
import ScheduleWinRateChart from "../components/ScheduleWinRateChart";
import "../css/SchedulePage.css";

function SchedulePage() {
    const [user, setUser] = useState(null);
    const [myDataList, setMyDataList] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);

    // 사용자 정보 불러오기
    useEffect(() => {
        fetch("/api/user", { credentials: "include" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("사용자 정보를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.nickname) {
                    setUser(data);
                }
            })
            .catch((error) => console.error("에러:", error));
    }, []);

    // MyData(직관 데이터) 불러오기
    useEffect(() => {
        if (user) {
            fetch("/api/mydata", { credentials: "include" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("출석 데이터를 불러오지 못했습니다.");
                    }
                    return response.json();
                })
                .then((data) => setMyDataList(data))
                .catch((error) =>
                    console.error("출석 데이터를 불러오는데 실패:", error)
                );
        }
    }, [user]);

    // 스케줄 전체 데이터 불러오기
    useEffect(() => {
        fetch("http://localhost:8080/api/schedule")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("스케줄 데이터를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setSchedules(data);
                setLoadingSchedules(false);
            })
            .catch((error) => {
                console.error("스케줄 데이터 로딩 실패:", error);
                setLoadingSchedules(false);
            });
    }, []);

    // 직관 관련 승, 무, 패 집계 (myDataList 기반)
    const attendanceWinCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "승"
    ).length;
    const attendanceDrawCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "무"
    ).length;
    const attendanceLoseCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "패"
    ).length;

    // 전체 경기 중 결과가 등록된 경기만 필터링 및 집계 (schedules 기반)
    const finishedSchedules = schedules.filter(
        (schedule) => schedule.result !== null
    );
    const scheduleWinCount = finishedSchedules.filter(
        (schedule) => schedule.result === "승"
    ).length;
    const scheduleDrawCount = finishedSchedules.filter(
        (schedule) => schedule.result === "무"
    ).length;
    const scheduleLoseCount = finishedSchedules.filter(
        (schedule) => schedule.result === "패"
    ).length;

    if (loadingSchedules) {
        return <div>스케줄 데이터를 불러오는 중...</div>;
    }

    return (
        <div className="SchedulePage">
            <NavigationBar className="NavigationBar" />

            <div className="SchedulePage2">
                {/* 스케줄 콘텐츠 영역 */}
                <div className="ScheduleContent">
                    <ScheduleList className="ScheduleList" user={user} />
                </div>

                <div className="ScheduleStatistics">
                    <AttendanceDoughnutChart
                        winCount={attendanceWinCount}
                        drawCount={attendanceDrawCount}
                        loseCount={attendanceLoseCount}
                    />
                    <ScheduleWinRateChart
                        winCount={scheduleWinCount}
                        drawCount={scheduleDrawCount}
                        loseCount={scheduleLoseCount}
                    />
                </div>
            </div>
        </div>
    );
}

export default SchedulePage;
