package com.taste.zip.service;

import java.util.Optional;
import com.taste.zip.entity.MemberEntity;

public interface MemberService {

    MemberEntity save(MemberEntity vo);

    int checkId(String memberId);

    String authEmail(String email);

    MemberEntity login(String memberId, String memberPw, String socialType); // socialType 추가

    int updateMember(MemberEntity vo);

    int updatePassword(int memIdx, String encodedPassword);


    Optional<MemberEntity> getMember(int memIdx);

    int cancel(int memIdx);

    // socialType을 추가하여 소셜 로그인 시 회원 조회 메서드 추가
    Optional<MemberEntity> findByMemberIdAndSocialType(String memberId, String socialType);
}
