package com.myfcseoul.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "MyData")
public class MyData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mydata_id")
    private Long mydataId;

    // 사용자와 다대일 관계
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 경기 일정과 다대일 관계
    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    /**
     * attended: TINYINT
     * 0: 기본, 1: 직관 완료, 2: 직관 예정
     */
    @Column(name = "attended")
    private Integer attended;

    /**
     * prediction: ENUM('승', '무', '패') (nullable)
     * 편의상 String 타입으로 처리
     */
    @Column(name = "prediction")
    private String prediction;

    /**
     * prediction_result: BOOLEAN (nullable)
     */
    @Column(name = "prediction_result")
    private Boolean predictionResult;

    // 기본 생성자
    public MyData() {}

    // Getters and Setters
    public Long getMydataId() {
        return mydataId;
    }
    public void setMydataId(Long mydataId) {
        this.mydataId = mydataId;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Schedule getSchedule() {
        return schedule;
    }
    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }
    public Integer getAttended() {
        return attended;
    }
    public void setAttended(Integer attended) {
        this.attended = attended;
    }
    public String getPrediction() {
        return prediction;
    }
    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }
    public Boolean getPredictionResult() {
        return predictionResult;
    }
    public void setPredictionResult(Boolean predictionResult) {
        this.predictionResult = predictionResult;
    }
}
