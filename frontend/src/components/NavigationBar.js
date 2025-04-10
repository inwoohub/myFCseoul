// NavigationBar.js
import React, { useState } from "react";
import "../css/NavigationBar.css";

function NavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        console.log("Mobile Menu Open: ", !isMobileMenuOpen);
    };


    return (
        <header className="NavigationBar">
            <div style={{display:"flex" ,gap:"1vw"}}>
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

            {/* 데스크탑용 로그인/회원가입 */}
            <span className="Navigation_sign">로그인/회원가입</span>

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
                        <li>로그인/회원가입</li>
                    </ul>
                </nav>
            )}
        </header>
    );
}

export default NavigationBar;
