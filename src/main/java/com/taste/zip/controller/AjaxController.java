package com.taste.zip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taste.zip.service.MemberService;

import lombok.AllArgsConstructor;

@RestController // @Controller + @ResponseBody
@AllArgsConstructor
public class AjaxController {

	// 필드 정의
	private MemberService memberServiceImpl;

	// 아이디 중복검사
	@PostMapping("/member/checkId.do")
	public ResponseEntity<String> checkId(String member_id) {
		// 중복 아이디가 없는 경우 결과값
		ResponseEntity<String> result = ResponseEntity.ok("PASS");

		if (memberServiceImpl.checkId(member_id) == 1) {
			result = ResponseEntity.ok("FAIL");
		}
		return result;
	}
    
	// 이메일 인증
	@PostMapping("/member/checkEmail.do")
	public String checkEmail(String email) {
		System.out.println("이메일 인증 이메일: " + email);
		return memberServiceImpl.authEmail(email);
	}

}
