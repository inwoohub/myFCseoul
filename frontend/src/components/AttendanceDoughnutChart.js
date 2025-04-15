import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // 모든 필요한 Chart.js 요소가 자동으로 등록됩니다.
import '../css/AttendanceDoughnutChart.css';  // CSS 파일을 import 합니다.

function AttendanceDoughnutChart({ winCount, drawCount, loseCount }) {
    const data = {
        labels: ['승리', '무승부', '패배'],
        datasets: [
            {
                data: [winCount, drawCount, loseCount],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        cutout: '60%', // 도넛 모양의 두께 조절 (Chart.js v3 이상)
        plugins: {
            legend: {
                display: false,
            },
        },
        animation: {               /* 원하는 애니메이션 효과 옵션 추가 가능 */
            duration: 1500,
            easing: 'easeInOutQuad',
        },
    };

    return (
        <div className="attendance-doughnut-container">
            <Doughnut data={data} options={options} />
        </div>
    );
}

export default AttendanceDoughnutChart;
