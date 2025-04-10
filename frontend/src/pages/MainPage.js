import React,{ useEffect } from 'react';
import NavigationBar from "../components/NavigationBar";
import MPSchedule from "../components/MPSchedule";
import MPStatistics from "../components/MPStatistics";
import MPRanking from "../components/MPRanking";
import "../css/MainPage.css";

function MainPage() {
    useEffect(() => {
        fetch("/api/hello")
            .then(res => res.text())
            .then(data => console.log(data));
    }, []);


    return (
    <div className="MainPage">
        <NavigationBar className="NavigationBar" />
        <div className="MainPageTop">
            <img
                className="MainPage_homeimage"
                alt="seoul_logo"
                src="/mainimage.jpg"
            />
        </div>
        <div className="MainPagebottom">
            <MPRanking className="MPRanking" />
            <MPStatistics className="MPStatistics" />
            <MPSchedule className="MPSchedule" />
        </div>
    </div>
  )
}
export default MainPage;
