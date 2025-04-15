package com.myfcseoul.backend.repository;

// MyDataRepository.java
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MyDataRepository extends JpaRepository<MyData, Long> {
    List<MyData> findByUser(User user);

    // 특정 사용자와 경기(Schedule)에 해당하는 MyData를 찾는 메서드
    Optional<MyData> findByUserAndSchedule(User user, Schedule schedule);
}
