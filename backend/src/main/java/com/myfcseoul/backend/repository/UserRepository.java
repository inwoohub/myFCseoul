package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.dto.AttendanceRankDTO;
import com.myfcseoul.backend.dto.CheerRankDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // 카카오 고유 ID로 사용자 조회
    Optional<User> findByUserId(String userId);

    // 직관왕 랭킹 상위 N명 (attended = 1 개수 기준)
    @Query("""
        SELECT u.nickname AS nickname,
               COUNT(md)    AS attendanceCount
          FROM MyData md
          JOIN md.user u
         WHERE md.attended = 1
         GROUP BY u.nickname
         ORDER BY COUNT(md) DESC
        """)
    List<AttendanceRankDTO> findTopAttendance(Pageable pageable);

    // 승리요정 랭킹 상위 N명 (CheerMessage 개수 기준)
    @Query("""
        SELECT u.nickname AS nickname,
               COUNT(cm)    AS messageCount
          FROM CheerMessage cm
          JOIN cm.user u
         GROUP BY u.nickname
         ORDER BY COUNT(cm) DESC
        """)
    List<CheerRankDTO> findTopCheer(Pageable pageable);

}
