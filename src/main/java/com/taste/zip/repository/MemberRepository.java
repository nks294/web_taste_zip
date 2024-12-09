package com.taste.zip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.taste.zip.entity.MemberEntity;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Integer> {

    // 기존에 사용하던 아이디 중복 체크 메서드
    @Query("select count(*) from MemberEntity m where m.memberId = ?1")
    int checkId(String memberId);

    // 기존의 findByMemberId 메서드 대신 memberId와 socialType을 같이 조건으로 조회
    Optional<MemberEntity> findByMemberIdAndSocialType(String memberId, String socialType);
    Optional<MemberEntity> findByMemberId(String memberId);
    @Modifying
    @Query("update MemberEntity m "
            + " set m.memberPw = :#{#entity.memberPw}, "
            + " m.memberName = :#{#entity.memberName}, "
            + " m.phone = :#{#entity.phone}, "
            + " m.birthday = :#{#entity.birthday}, "
            + " m.introduction = :#{#entity.introduction}, "
            + " m.profileImage = :#{#entity.profileImage} "
            + " where m.memIdx = :#{#entity.memIdx} ")
    int updateMember(@Param("entity") MemberEntity vo);

    @Modifying
    @Query("update MemberEntity m set m.memberPw = :encodedPassword where m.memIdx = :memIdx")
    int updatePassword(@Param("memIdx") int memIdx, @Param("encodedPassword") String encodedPassword);


    @Modifying
    @Query("update MemberEntity m set m.memStatus = -1, m.modDate = now() where m.memIdx = ?1")
    int cancel(int memIdx);
}
