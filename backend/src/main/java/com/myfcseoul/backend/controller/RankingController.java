package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.dto.AttendanceRankDTO;
import com.myfcseoul.backend.dto.CheerRankDTO;
import com.myfcseoul.backend.dto.RankingResponse;
import com.myfcseoul.backend.repository.UserRepository;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.List;


@RestController
@RequestMapping("/api")
public class RankingController {

    private final UserRepository userRepo;

    public RankingController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/rankings")
    public RankingResponse getRankings() {
        Pageable top5 = PageRequest.of(0, 5);
        List<AttendanceRankDTO> attends = userRepo.findTopAttendance(top5);
        List<CheerRankDTO>       cheers  = userRepo.findTopCheer(top5);
        return new RankingResponse(attends, cheers);
    }
}
