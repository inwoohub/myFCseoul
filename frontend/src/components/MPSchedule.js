import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GameDetailModal from "../components/GameDetailModal";
import "../css/MPSchedule.css";

function MPSchedule({ schedules }) {
    const [date, setDate] = useState(new Date());
    // 로딩 상태는 MainPage에서 처리되므로 이 상태는 제거하거나 초기값 없이 사용할 수 있음
    // const [loading, setLoading] = useState(true);
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);
    const [selectedGameSchedules, setSelectedGameSchedules] = useState([]);
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);

    // 창 크기 변경 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1150);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 요일을 "일", "월", "화", "수", "목", "금", "토"로 표시
    const formatShortWeekday = (_, date) => {
        const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
        return weekdays[date.getDay()];
    };

    // 날짜를 "YYYY-MM-DD" 형식으로 포맷하는 헬퍼 함수
    function formatLocalDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        return `${year}-${month}-${day}`;
    }

    // tileContent 함수: 달력의 각 셀에 일정이 있으면 마커 표시
    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const formattedDate = formatLocalDate(date);
            const hasSchedule = schedules.some(
                (schedule) => schedule.matchDate === formattedDate
            );
            if (hasSchedule) {
                return <div className="game-marker">🔥</div>;
            }
        }
        return null;
    };

    // 셀 클릭 시, 현재 달에 속한 날짜라면 일정이 있으면 모달을 엽니다.
    const handleClickDay = (clickedDate) => {
        // 현재 달(activeStartDate의 월)과 클릭된 날짜의 월이 같지 않으면 모달을 열지 않음
        if (clickedDate.getMonth() !== activeStartDate.getMonth()) {
            // 단순히 선택 날짜를 업데이트 함
            setDate(clickedDate);
            return;
        }
        // 클릭된 날짜를 포맷하여 일정 여부 확인
        const formattedDate = formatLocalDate(clickedDate);
        const schedulesForDate = schedules.filter(
            (schedule) => schedule.matchDate === formattedDate
        );
        if (schedulesForDate.length > 0) {
            setSelectedGameSchedules(schedulesForDate);
            setIsGameModalOpen(true);
        }
        setDate(clickedDate);
    };

    return (
        <div className="custom-mainschedule">
            <div className="calendar-container">
                <Calendar
                    value={date}
                    onChange={setDate}
                    onClickDay={handleClickDay}
                    formatShortWeekday={formatShortWeekday}
                    calendarType="gregory"
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({ activeStartDate }) =>
                        setActiveStartDate(activeStartDate)
                    }
                    tileContent={tileContent}
                    tileClassName={({ date, view }) => {
                        // 현재 달의 월~금(요일 1~5)인 셀에 "weekday-tile" 클래스를 추가
                        if (
                            view === "month" &&
                            date.getMonth() === activeStartDate.getMonth() &&
                            date.getDay() >= 1 &&
                            date.getDay() <= 5
                        ) {
                            return "weekday-tile";
                        }
                        return null;
                    }}
                    // 창 너비가 1150px 미만이면 숫자만, 그렇지 않으면 "일" 붙임
                    formatDay={(locale, date) =>
                        isMobile ? date.getDate() : `${date.getDate()}일`
                    }
                />
            </div>
            {isGameModalOpen && (
                <GameDetailModal
                    schedules={selectedGameSchedules}
                    onClose={() => setIsGameModalOpen(false)}
                />
            )}
        </div>
    );
}

export default MPSchedule;
