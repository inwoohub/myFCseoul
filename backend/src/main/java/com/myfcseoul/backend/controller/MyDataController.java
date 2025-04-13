package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.MyDataRepository;
import com.myfcseoul.backend.repository.ScheduleRepository;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.security.Principal;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/mydata")
public class MyDataController {

    @Autowired
    private MyDataRepository myDataRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    /**
     * 클라이언트에서 전달한 출석(직관) 정보를 저장합니다.
     * @param request 클라이언트가 전송하는 JSON 데이터 (scheduleId, attended)
     * @param principal 현재 로그인한 사용자의 정보를 포함합니다.
     * @return 저장 처리 결과 (JSON 형태)
     */
    @PostMapping
    public ResponseEntity<?> saveMyData(@RequestBody MyDataRequest request, Principal principal) {
        // 현재 로그인한 사용자 정보를 가져옴 (카카오 고유 ID 사용)
        User user = userRepository.findByUserId(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // 전달받은 scheduleId에 해당하는 Schedule 엔티티 조회
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(request.getScheduleId());
        if (!optionalSchedule.isPresent()) {
            return ResponseEntity.badRequest().body("Schedule not found.");
        }
        Schedule schedule = optionalSchedule.get();

        // MyData 엔티티 생성 및 설정
        MyData myData = new MyData();
        myData.setUser(user);
        myData.setSchedule(schedule);
        myData.setAttended(request.getAttended());

        // DB에 저장
        myDataRepository.save(myData);

        // JSON 형태의 응답 반환
        return ResponseEntity.ok(Collections.singletonMap("message", "Attendance saved successfully."));
    }

    /**
     * 현재 로그인한 사용자의 출석(직관) 상태를 조회하는 엔드포인트입니다.
     * @param principal 현재 로그인한 사용자 정보를 포함합니다.
     * @return 사용자의 출석 정보 목록 (JSON 배열)
     */
    @GetMapping
    public ResponseEntity<?> getMyData(Principal principal) {
        // 현재 로그인한 사용자 정보를 가져옴 (카카오 고유 ID 사용)
        User user = userRepository.findByUserId(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        // 사용자에 해당하는 MyData 목록 조회
        List<MyData> myDataList = myDataRepository.findByUser(user);
        return ResponseEntity.ok(myDataList);
    }

    // 클라이언트로부터 전달받을 데이터를 위한 DTO 클래스
    public static class MyDataRequest {
        private Long scheduleId;
        private Integer attended;

        public Long getScheduleId() {
            return scheduleId;
        }
        public void setScheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
        }
        public Integer getAttended() {
            return attended;
        }
        public void setAttended(Integer attended) {
            this.attended = attended;
        }
    }
}
