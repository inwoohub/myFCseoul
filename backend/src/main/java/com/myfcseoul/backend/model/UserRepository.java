package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    // 카카오 고유 ID로 사용자 조회
    Optional<User> findByUserId(String userId);
}
