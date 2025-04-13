import React, { useState, useEffect } from "react";
import ScheduleRegistrationModal from "../components/ScheduleRegistrationModal";
import ScoreUpdateModal from "../components/ScoreUpdateModal";
import "../css/ScheduleList.css";

// 시간 포맷 함수
function formatTime(timeString) {
    const parts = timeString.split(":");
    if (parts.length < 2) return timeString;
    return `${parts[0]}:${parts[1]}`;
}

// 날짜 포맷 함수: "15일(토)" 형태
function formatDateWithDay(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${day}일(${dayOfWeek})`;
}

function ScheduleList({ user, className }) {
    const [schedules, setSchedules] = useState([]);
    const [myDataList, setMyDataList] = useState([]); // 출석 상태 데이터
    const [loading, setLoading] = useState(true);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isScoreUpdateModalOpen, setIsScoreUpdateModalOpen] = useState(false);
    const [selectedScoreSchedule, setSelectedScoreSchedule] = useState(null);

    // 일정 데이터 불러오기
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

    // 출석 상태 데이터 불러오기
    useEffect(() => {
        if (user) {
            fetch("/api/mydata", { credentials: "include" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("출석 데이터를 불러오지 못했습니다.");
                    }
                    return response.json();
                })
                .then((data) => {
                    setMyDataList(data);
                })
                .catch((error) => {
                    console.error("출석 데이터를 불러오는데 실패:", error);
                });
        }
    }, [user]);

    // 모달 열기/닫기 함수
    const openRegistrationModal = () => setIsRegistrationModalOpen(true);
    const closeRegistrationModal = () => setIsRegistrationModalOpen(false);

    const openAttendanceModal = (sch) => {
        if (!user) return;
        setSelectedSchedule(sch);
        setIsAttendanceModalOpen(true);
    };
    const closeAttendanceModal = () => {
        setIsAttendanceModalOpen(false);
        setSelectedSchedule(null);
    };

    // 결과 등록 모달 열기/닫기 – ✏️ 버튼으로만 열림
    const openScoreUpdateModal = () => setIsScoreUpdateModalOpen(true);
    const closeScoreUpdateModal = () => {
        setIsScoreUpdateModalOpen(false);
        setSelectedScoreSchedule(null);
    };

    // 출석 상태 저장 처리
    const handleAttendanceSelection = (attendedValue) => {
        if (!selectedSchedule || !user) return;
        const payload = {
            scheduleId: selectedSchedule.scheduleId,
            attended: attendedValue,
        };

        fetch("/api/mydata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("출석 상태를 저장하지 못했습니다.");
                }
                return response.json();
            })
            .then(() => {
                alert("출석 상태가 저장되었습니다.");
                setMyDataList((prevData) => {
                    const withoutCurrent = prevData.filter(
                        (item) => item.schedule.scheduleId !== selectedSchedule.scheduleId
                    );
                    return [...withoutCurrent, { schedule: selectedSchedule, attended: attendedValue }];
                });
                closeAttendanceModal();
            })
            .catch((error) => {
                console.error("출석 상태 저장 실패:", error);
                alert("출석 상태 저장에 실패하였습니다.");
            });
    };

    // schedule의 출석 상태 조회 함수
    const getAttendanceForSchedule = (scheduleId) => {
        const record = myDataList.find((item) => item.schedule.scheduleId === scheduleId);
        return record ? record.attended : undefined;
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
                {isRegistrationModalOpen && <ScheduleRegistrationModal onClose={closeRegistrationModal} />}
            </div>
        );
    }

    // 월별 그룹화 (matchDate 기준)
    const groupedSchedules = schedules.reduce((acc, sch) => {
        const [, month] = sch.matchDate.split("-");
        const numericMonth = parseInt(month, 10);
        if (!acc[numericMonth]) {
            acc[numericMonth] = [];
        }
        acc[numericMonth].push(sch);
        return acc;
    }, {});

    const sortedMonthKeys = Object.keys(groupedSchedules)
        .map(Number)
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
                                        matchType = "(H)";
                                    } else if (sch.awayTeam === "서울") {
                                        opponent = sch.homeTeam;
                                        matchType = "(A)";
                                    } else {
                                        opponent = `${sch.homeTeam} vs. ${sch.awayTeam}`;
                                    }

                                    // 출석 상태 조회
                                    const attendance = getAttendanceForSchedule(sch.scheduleId);
                                    const attendanceIcon = attendance === 1 ? "✅" : attendance === 0 ? "❌" : "";

                                    // 경기 시작 시간 비교
                                    const matchDateTime = new Date(`${sch.matchDate}T${sch.matchTime}`);
                                    const now = new Date();
                                    const isPast = matchDateTime < now;

                                    return (
                                        <li
                                            key={sch.scheduleId}
                                            onClick={() => {
                                                // 로그인하지 않은 경우 처리
                                                if (!user) {
                                                    alert("로그인 후 이용해 주세요.");
                                                    return;
                                                }
                                                // 로그인 상태라면 경기 시간이 지난 경우 출석 모달 열기, 아니면 경고 메시지 표시
                                                if (isPast) {
                                                    openAttendanceModal(sch);
                                                } else {
                                                    alert("경기가 아직 진행되지 않아 출석 상태를 등록할 수 없습니다.");
                                                }
                                            }}
                                            className={`Schedulelitext ${sch.scoreHome !== null && sch.scoreAway !== null ? "result-registered" : ""}`}
                                        >
                                            {formatDateWithDay(sch.matchDate)} {formatTime(sch.matchTime)}{" "}
                                            {sch.scoreHome !== null && sch.scoreAway !== null
                                                ? (
                                                    sch.homeTeam === "서울"
                                                        ? `${sch.homeTeam} ${sch.scoreHome} : ${sch.scoreAway} ${opponent}`
                                                        : `${opponent} ${sch.scoreHome} : ${sch.scoreAway} ${sch.awayTeam}`
                                                )
                                                : `서울 vs ${opponent}`
                                            }
                                            {matchType && `${matchType}`}
                                            {attendanceIcon && ` ${attendanceIcon}`}
                                            {/* 관리자용 결과 업데이트 버튼 (✏️) */}
                                            {user && user.role === "admin" && (
                                                <button
                                                    className="score-update-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedScoreSchedule(sch);
                                                        openScoreUpdateModal();
                                                    }}
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                        </li>


                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {isRegistrationModalOpen && <ScheduleRegistrationModal onClose={closeRegistrationModal} />}
            {isAttendanceModalOpen && selectedSchedule && (
                <div className="attendanceModal">
                    <div className="attendanceModalContent">
                        <button className="modal-close" onClick={closeAttendanceModal}>X</button>
                        <h4>직관 여부 선택</h4>
                        <p>
                            {`${formatDateWithDay(selectedSchedule.matchDate)} ${formatTime(
                                selectedSchedule.matchTime
                            )} 시 ${
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
                            <button className="SchduleListbtn" onClick={() => handleAttendanceSelection(1)}>
                                직관 완료
                            </button>
                            <button className="SchduleListbtn" onClick={() => handleAttendanceSelection(0)}>
                                직관 미완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isScoreUpdateModalOpen && selectedScoreSchedule && (
                <ScoreUpdateModal
                    schedule={selectedScoreSchedule}
                    onClose={closeScoreUpdateModal}
                    onScoreUpdated={(updatedData) => {
                    }}
                />
            )}
        </div>
    );
}

export default ScheduleList;
