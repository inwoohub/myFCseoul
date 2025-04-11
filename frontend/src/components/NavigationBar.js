import React, { useState } from "react";
import "../css/NavigationBar.css";
import LoginModal from "./LoginModal"; // 모달 컴포넌트 import

function NavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

    return (
        <header className="NavigationBar">
            <div style={{display:"flex", gap:"1vw"}}>
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
                    <li>일정</li>
                    <li>Ai 경기 기록</li>
                </ul>
            </nav>

            {/* 데스크탑용 로그인/회원가입 - 클릭 시 로그인 모달 열림 */}
            <span className="Navigation_sign" onClick={openLoginModal}>
                로그인/회원가입
            </span>

            {/* 모바일용 햄버거 버튼 */}
            <button className="Hamburger" onClick={toggleMobileMenu}>
                ☰
            </button>

            {/* 모바일 메뉴 토글 영역 */}
            {isMobileMenuOpen && (
                <nav className="Mobile_nav">
                    <ul>
                        <li>일정</li>
                        <li>Ai 경기 기록</li>
                        <li onClick={openLoginModal}>로그인/회원가입</li>
                    </ul>
                </nav>
            )}

            {/* 로그인 모달 조건부 렌더링 */}
            {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
        </header>
    );
}

export default NavigationBar;
