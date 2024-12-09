package com.taste.zip.service;

import java.util.Optional;

import javax.mail.internet.MimeMessage;
// import javax.persistence.EntityNotFoundException;

import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.client.RestTemplate;

import com.taste.zip.entity.MemberEntity;
import com.taste.zip.repository.MemberRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository repository;
    private final JavaMailSenderImpl mailSender;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    // private final RestTemplate restTemplate;

    @Override
    public MemberEntity save(MemberEntity vo) {
        // 비밀번호가 있을 경우 암호화 저장
        if (vo.getMemberPw() != null) {
            vo.setMemberPw(passwordEncoder.encode(vo.getMemberPw()));
        }
        return repository.save(vo);
    }

    @Override
    public int checkId(String memberId) {
        return repository.checkId(memberId);
    }

    @Override
    public String authEmail(String email) {
        int authNumber = (int) (Math.random() * 888889) + 111111;
        String setFrom = "humandev007@gmail.com";
        String toMail = email;
        String title = "회원가입 인증 이메일입니다";
        String content = "인증번호: " + authNumber;
        mailSend(setFrom, toMail, title, content);
        return Integer.toString(authNumber);
    }

    private void mailSend(String setFrom, String toMail, String title, String content) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("메일전송 중 예외발생");
        }
    }

    @Override
public MemberEntity login(String memberId, String memberPw, String socialType) {
    if (memberId == null || memberPw == null) {
        System.out.println("로그인 실패: memberId 또는 memberPw가 null입니다.");
        return null;
    }

    // 소셜 타입과 일치하는 사용자 조회 시도
    Optional<MemberEntity> optionalMember = repository.findByMemberIdAndSocialType(memberId, socialType);
    if (!optionalMember.isPresent()) {
        System.out.println("로그인 실패: 해당 memberId와 socialType을 가진 사용자를 찾을 수 없습니다.");
        return null;
    }

    MemberEntity member = optionalMember.get();

    // 일반 로그인 시에만 비밀번호 검증 수행
    if ("LOCAL".equals(socialType)) {
        if (passwordEncoder.matches(memberPw, member.getMemberPw())) {
            System.out.println("로그인 성공: 일반 로그인으로 사용자 인증에 성공했습니다.");
            return member;
        } else {
            System.out.println("로그인 실패: 비밀번호가 일치하지 않습니다.");
            return null;
        }
    } else {
        System.out.println("소셜 로그인 성공: " + socialType + " 사용자로 로그인되었습니다.");
        return member;
    }
}



    @Transactional
    @Override
    public int updateMember(MemberEntity vo) {
        return repository.updateMember(vo);
    }

    @Transactional
    @Override
    public int updatePassword(int memIdx, String encodedPassword) {
        return repository.updatePassword(memIdx, encodedPassword);
    }
    

    @Override
    public Optional<MemberEntity> getMember(int memIdx) {
        return repository.findById(memIdx);
    }

    @Transactional
    @Override
    public int cancel(int memIdx) {
        return repository.cancel(memIdx);
    }

    // 소셜 로그인 시 사용될 메서드, socialType을 이용하여 사용자 조회
    @Override
    public Optional<MemberEntity> findByMemberIdAndSocialType(String memberId, String socialType) {
        return repository.findByMemberIdAndSocialType(memberId, socialType);
    }
}
