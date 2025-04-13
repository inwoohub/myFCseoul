import React, { useState, useEffect } from "react";
import ScheduleRegistrationModal from "../components/ScheduleRegistrationModal";
import "../css/ScheduleList.css";

// 기존 시간 포맷 함수
function formatTime(timeString) {
    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;
    return `${parts[0]}:${parts[1]}`;
}

// 새 날짜 포맷 함수: "15일(토)" 형태로 변환
function formatDateWithDay(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${day}일(${dayOfWeek})`;
}

function ScheduleList({ user, className }) {
    // 상태 설정: 스케줄 데이터, 로딩 상태, 모달(일정 등록, 출석 선택) 오픈 여부, 선택된 경기
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // 컴포넌트 마운트 시 API 호출 (일정 데이터 가져오기)
    useEffect(() => {
        fetch("/api/schedule")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("스케줄 데이터를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setSchedules(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("스케줄 데이터를 불러오는데 실패:", error);
                setLoading(false);
            });
    }, []);

    // 일정 등록 모달 열기/닫기 (관리자 전용)
    const openRegistrationModal = () => {
        setIsRegistrationModalOpen(true);
    };
    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    // 출석(직관) 선택 모달 열기: 해당 경기 항목을 클릭하면 호출
    const openAttendanceModal = (sch) => {
        if (!user) return; // 로그인한 사용자만 처리
        setSelectedSchedule(sch);
        setIsAttendanceModalOpen(true);
    };
    const closeAttendanceModal = () => {
        setIsAttendanceModalOpen(false);
        setSelectedSchedule(null);
    };

    // 출석(직관) 상태 선택 처리 (attended: 1 → "직관 완료", 0 → "직관 미완료")
    const handleAttendanceSelection = (attendedValue) => {
        if (!selectedSchedule || !user) return;
        const payload = {
            scheduleId: selectedSchedule.scheduleId,
            attended: attendedValue
        };

        fetch("/api/mydata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("출석 상태를 저장하지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                alert("출석 상태가 저장되었습니다.");
                closeAttendanceModal();
            })
            .catch((error) => {
                console.error("출석 상태 저장 실패:", error);
                alert("출석 상태 저장에 실패하였습니다.");
            });
    };

    if (loading) {
        return (
            <div className={`ScheduleList ${className || ""}`}>
                <h3>K리그 일정 및 경기 결과</h3>
                <p>Loading...</p>
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <div className={`ScheduleList ${className || ""}`}>
                <h3>K리그 일정 및 경기 결과</h3>
                <p>등록된 일정이 없습니다.</p>
                {user && user.role === "admin" && (
                    <div className="AdminScheduleRegistration">
                        <button onClick={openRegistrationModal}>일정 등록</button>
                    </div>
                )}
                {isRegistrationModalOpen && (
                    <ScheduleRegistrationModal onClose={closeRegistrationModal} />
                )}
            </div>
        );
    }

    // 월별 그룹화: 날짜 (YYYY-MM-DD) 문자열에서 월 추출
    const groupedSchedules = schedules.reduce((acc, sch) => {
        const [, month] = sch.matchDate.split("-");
        const numericMonth = parseInt(month, 10);
        if (!acc[numericMonth]) {
            acc[numericMonth] = [];
        }
        acc[numericMonth].push(sch);
        return acc;
    }, {});

    // 그룹화된 월을 오름차순 정렬
    const sortedMonthKeys = Object.keys(groupedSchedules)
        .map((key) => parseInt(key, 10))
        .sort((a, b) => a - b);

    return (
        <div className={`ScheduleList ${className || ""}`}>
            <div className="monthContainer">
                {user && user.role === "admin" && (
                    <div className="AdminScheduleRegistration">
                        <button onClick={openRegistrationModal}>(관리자) 일정 등록</button>
                    </div>
                )}
                {sortedMonthKeys.map((monthKey) => {
                    const monthSchedules = groupedSchedules[monthKey];
                    return (
                        <div key={monthKey} className="monthSection">
                            <h4>{monthKey}월</h4>
                            <ul>
                                {monthSchedules.map((sch) => {
                                    let opponent = "";
                                    let matchType = "";
                                    if (sch.homeTeam === "서울") {
                                        opponent = sch.awayTeam;
                                        matchType = "주";
                                    } else if (sch.awayTeam === "서울") {
                                        opponent = sch.homeTeam;
                                        matchType = "원정";
                                    } else {
                                        opponent = `${sch.homeTeam} vs. ${sch.awayTeam}`;
                                    }

                                    return (
                                        <li key={sch.scheduleId} onClick={() => openAttendanceModal(sch)} className="Schedulelitext">
                                            {formatDateWithDay(sch.matchDate)} {formatTime(sch.matchTime)}{" "}
                                            {opponent}{matchType && `(${matchType})`}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {isRegistrationModalOpen && (
                <ScheduleRegistrationModal onClose={closeRegistrationModal} />
            )}

            {/* 출석(직관) 선택 모달 */}
            {isAttendanceModalOpen && selectedSchedule && (
                <div className="attendanceModal">
                    <div className="attendanceModalContent">
                        <button className="modal-close" onClick={closeAttendanceModal}>X</button>
                        {/* Login 컴포넌트 포함 */}
                        <h4>직관 여부 선택</h4>
                        <p>
                            {`${formatDateWithDay(selectedSchedule.matchDate)} ${formatTime(selectedSchedule.matchTime)} 시 ${
                                selectedSchedule.homeTeam === "서울"
                                    ? selectedSchedule.awayTeam
                                    : selectedSchedule.awayTeam === "서울"
                                        ? selectedSchedule.homeTeam
                                        : ""
                            } 경기를 관람하셨나요?`}
                            <br />
                            {"아래 옵션에서 확인해 주세요."}
                        </p>
                        <div className="attendanceOptions">
                            <button className="SchduleListbtn" onClick={() => handleAttendanceSelection(1)}>직관 완료</button>
                            <button className="SchduleListbtn" onClick={() => handleAttendanceSelection(0)}>직관 미완료</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleList;
