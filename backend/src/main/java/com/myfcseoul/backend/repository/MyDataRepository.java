package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MyDataRepository extends JpaRepository<MyData, Long> {
    List<MyData> findByUser(User user);
}
