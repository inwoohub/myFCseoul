import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import MPSchedule from "../components/MPSchedule";
import MPStatistics from "../components/MPStatistics";
import MPRanking from "../components/MPRanking";
import "../css/MainPage.css";

function MainPage() {
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [myDataList, setMyDataList] = useState([]);
    const [loadingMyData, setLoadingMyData] = useState(true);

    // 스케줄 데이터 API 호출
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

    // 직관 데이터(API mydata) API 호출
    useEffect(() => {
        fetch("/api/mydata", { credentials: "include" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("출석 데이터를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setMyDataList(data);
                setLoadingMyData(false);
            })
            .catch((error) => {
                console.error("출석 데이터 로딩 실패:", error);
                setLoadingMyData(false);
            });
    }, []);



    // myDataList를 바탕으로 승, 무, 패 집계 (예: item.schedule.result에 "승", "무", "패"가 기록되어 있다고 가정)
    const winCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "승"
    ).length;
    const drawCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "무"
    ).length;
    const loseCount = myDataList.filter(
        (item) => item.attended === 1 && item.schedule.result === "패"
    ).length;

    return (
        <div className="MainPage">
            <NavigationBar className="NavigationBar" />
            <div className="MainPageTop">
                <img
                    className="MainPage_homeimage"
                    alt="seoul_logo"
                    src="/mainimage.jpg"
                />
            </div>
            <div className="MainPagebottom">
                {/* 스케줄 데이터는 MPSchedule 컴포넌트에 props로 전달 */}
                <MPSchedule className="MPSchedule" schedules={schedules} />
                {/* 분석된 직관 데이터를 MPStatistics에 props로 전달 */}
                <MPStatistics
                    className="MPStatistics"
                    winCount={winCount}
                    drawCount={drawCount}
                    loseCount={loseCount}
                />
                <MPRanking className="MPRanking" />
            </div>
            <div className="Main_footer">

            </div>
        </div>
    );
}

export default MainPage;
