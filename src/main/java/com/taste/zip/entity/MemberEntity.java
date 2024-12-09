package com.taste.zip.entity;

import java.util.Date;
import javax.persistence.*;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "tb_member")
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mem_idx", updatable = false)
    private int memIdx;

    @Column(name = "member_name", nullable = false, length = 30)
    private String memberName;

    @Column(name = "member_id", nullable = false, length = 50, unique = true)
    private String memberId; // 카카오, 네이버 등의 소셜 ID 통합 저장

    @Column(name = "member_pw", nullable = true, length = 200)
    private String memberPw;

    @Column(name = "birthday", nullable = true, length = 20)
    private String birthday;

    @Column(name = "phone", nullable = true, length = 20)
    private String phone;

    @Column(name = "reg_date", columnDefinition = "DATETIME DEFAULT NOW()")
    private Date regDate;

    @Column(name = "mod_date", columnDefinition = "DATETIME DEFAULT NOW()")
    private Date modDate;

    @Column(name = "mem_status", columnDefinition = "TINYINT DEFAULT 1")
    private int memStatus;

    @Column(name = "mem_grade", columnDefinition = "TINYINT DEFAULT 1")
    private int memGrade;

    @Column(name = "social_type", nullable = false, length = 20) // 소셜 타입 구분 필드 추가
    private String socialType;

    @Column(name = "introduction", length = 500)
    private String introduction;

    @Column(name = "profile_image", columnDefinition = "VARCHAR(255) DEFAULT '/resources/img/default-profile.png'")
    private String profileImage;

    @Column(name = "point", columnDefinition = "INT DEFAULT 10")
    private int point;

    @Builder
    public MemberEntity(String memberId, String memberPw, String memberName, String birthday, String phone,
            String socialType, String introduction, String profileImage) { // socialType 추가
        this.memberId = memberId; // 카카오, 네이버 등의 소셜 ID 통합 저장
        this.memberPw = (memberPw != null) ? memberPw : "N/A";
        this.memberName = memberName;
        this.birthday = birthday != null ? birthday : "N/A";
        this.phone = phone != null ? phone : "N/A";
        this.socialType = socialType; // 설정
        this.introduction = introduction;
        this.profileImage = profileImage;
        this.regDate = new Date();
        this.modDate = new Date();
        this.memStatus = 1;
        this.memGrade = 1;
    }

    public void updateMemIdx(int memIdx) {
        this.memIdx = memIdx;
    }

    public void setMemberPw(String memberPw) {
        this.memberPw = memberPw;
    }

    public void setPoint(int point) {
        this.point = point;
    }

}
