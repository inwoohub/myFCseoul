package com.myfcseoul.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.myfcseoul.backend.model.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // 필요에 따라 추가 쿼리 메서드를 작성할 수 있습니다.
}
