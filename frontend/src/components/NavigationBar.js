import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "../css/NavigationBar.css";
import LoginModal from "./LoginModal"; // 모달 컴포넌트 import
import { useNavigate } from "react-router-dom";

function NavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 컴포넌트가 마운트되면 백엔드 API에서 사용자 정보를 불러옵니다.
    useEffect(() => {
        fetch("/api/user", {
            credentials: "include", // 쿠키와 인증 정보를 포함하도록 설정
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("사용자 정보를 불러오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                // 백엔드에서 반환한 JSON의 필드명이 "nickname"이라면 이를 사용합니다.
                if (data && data.nickname) {
                    setUser(data);
                }
            })
            .catch((error) => console.error("에러:", error));
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        console.log("Mobile Menu Open: ", !isMobileMenuOpen);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    // 로그인 안 된 상태에서 클릭하면 모달을 열고, 로그인된 상태라면 프로필 관련 처리를 할 수 있습니다.
    const handleSignClick = () => {
        if (!user) {
            openLoginModal();
        } else {
            // 필요한 경우, 프로필 드롭다운 열기 혹은 로그아웃 처리 등 추가 작업
            console.log("로그인된 사용자:", user.nickname);
        }
    };

    return (
        <>
            <header className="NavigationBar">
                <div className="LogoTitle" onClick={() => navigate("/")}>
                    <img
                        className="Navigation_logoimage"
                        alt="seoul_logo"
                        src="/seoul_logo.png"
                        style={{ cursor: "pointer" }}
                    />
                    <span className="Navigation_title">myFCseoul</span>
                </div>

                {/* 데스크탑용 네비게이션 */}
                <nav className="Navigation_nav">
                    <ul>
                        <li onClick={() => navigate("/schedule")}>일정</li>
                        <li onClick={() => navigate("/diary")}>다이어리</li>
                        <li onClick={() => navigate("/statistics")}>Ai 경기 분석</li>
                    </ul>
                </nav>

                {/* 데스크탑용 로그인/회원가입 또는 닉네임 표시 */}
                <span className="Navigation_sign" onClick={handleSignClick}>
          {user ? `${user.nickname}님` : "로그인/회원가입"}
        </span>

                {/* 모바일용 햄버거 버튼 */}
                <button className="Hamburger" onClick={toggleMobileMenu}>
                    ☰
                </button>

                {/* 로그인 모달 조건부 렌더링 */}
                {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
            </header>

            {/* React Portal을 통한 모바일 메뉴 렌더링 */}
            {isMobileMenuOpen &&
                createPortal(
                    <nav
                        className="Mobile_nav" style={{fontSize:"12px"}}
                        onClick={() => setIsMobileMenuOpen(false)}
                        // 스타일 혹은 CSS 파일에서 position, top, left, width, z-index 등 설정 필요
                    >
                        <div className="Mobile_nav_header" onClick={handleSignClick}>
                            {user ? `${user.nickname}님` : "로그인/회원가입"}
                        </div>
                        <ul onClick={(e) => e.stopPropagation()}>
                            <li onClick={() => { navigate("/schedule"); setIsMobileMenuOpen(false); }}>
                                일정
                            </li>
                            <li onClick={() => { navigate("/diary"); setIsMobileMenuOpen(false); }}>
                                다이어리
                            </li>
                            <li onClick={() => { navigate("/statistics"); setIsMobileMenuOpen(false); }}>
                                Ai 경기 분석
                            </li>
                        </ul>
                    </nav>,
                    document.getElementById("mobile-menu-root")
                )}
        </>
    );
}

export default NavigationBar;
