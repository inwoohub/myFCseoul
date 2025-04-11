package com.myfcseoul.backend.service;

import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        logger.info("CustomOAuth2UserService.loadUser 호출됨.");
        OAuth2User oauth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oauth2User.getAttributes();
        logger.info("Kakao attributes: {}", attributes);

        // Kakao API 응답에서 "id"가 카카오 사용자의 고유 ID입니다.
        String kakaoId = String.valueOf(attributes.get("id"));
        logger.info("Extracted kakaoId: {}", kakaoId);

        // "kakao_account"에서 추가 정보를 추출 (이메일은 사용하지 않음)
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");

        // "profile" 내에서 닉네임을 추출합니다.
        Map<String, Object> profile = kakaoAccount != null ? (Map<String, Object>) kakaoAccount.get("profile") : null;
        String nickname = (profile != null && profile.get("nickname") != null)
                ? (String) profile.get("nickname")
                : "Unknown";
        logger.info("Extracted nickname: {}", nickname);

        // DB에서 카카오 고유 ID(userId)로 사용자 조회, 없으면 새로 생성합니다.
        User user = userRepository.findByUserId(kakaoId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserId(kakaoId);      // 카카오 고유 ID를 userId 필드에 저장
                    newUser.setNickname(nickname);
                    newUser.setCreatedAt(LocalDateTime.now()); // 🟢 이 부분 꼭 필요!
                    return newUser;
                });

        if (user.getNickname() == null || user.getNickname().isEmpty()) {
            user.setNickname(nickname);
        }

        logger.info("저장하기 전 User 정보: userId={}, nickname={}", user.getUserId(), user.getNickname());
        userRepository.save(user);
        logger.info("사용자 저장 완료.");

        return oauth2User;
    }
}
