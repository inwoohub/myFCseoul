package com.myfcseoul.backend.dto;

import java.util.List;

/**
 * 랭킹 조회 결과를 클라이언트에 반환하기 위한 DTO
 */
public class RankingResponse {

    private List<AttendanceRankDTO> attendanceKings;
    private List<CheerRankDTO>      cheerFairies;

    // Jackson 직렬화를 위한 기본 생성자
    public RankingResponse() {}

    // 전체 필드 초기화용 생성자
    public RankingResponse(List<AttendanceRankDTO> attendanceKings,
                           List<CheerRankDTO>       cheerFairies) {
        this.attendanceKings = attendanceKings;
        this.cheerFairies    = cheerFairies;
    }

    // Getters & Setters
    public List<AttendanceRankDTO> getAttendanceKings() {
        return attendanceKings;
    }
    public void setAttendanceKings(List<AttendanceRankDTO> attendanceKings) {
        this.attendanceKings = attendanceKings;
    }

    public List<CheerRankDTO> getCheerFairies() {
        return cheerFairies;
    }
    public void setCheerFairies(List<CheerRankDTO> cheerFairies) {
        this.cheerFairies = cheerFairies;
    }

    @Override
    public String toString() {
        return "RankingResponse{" +
                "attendanceKings=" + attendanceKings +
                ", cheerFairies="  + cheerFairies  +
                '}';
    }
}
