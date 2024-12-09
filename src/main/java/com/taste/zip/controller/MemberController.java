package com.taste.zip.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.taste.zip.entity.MemberEntity;
import com.taste.zip.service.MemberService;
import com.taste.zip.vo.MemberVO;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
	private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

	private final MemberService memberServiceImpl;
	// RestTemplate 주입 (외부 API 호출을 위해 사용)
	private final RestTemplate restTemplate;
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	// Naver 관련 애플리케이션 설정값
	@Value("${naver.client-id}")
	private String naverClientId;

	@Value("${naver.client-secret}")
	private String naverClientSecret;

	// Kakao 관련 애플리케이션 설정값
	@Value("${kakao.client-id}")
	private String kakaoClientId;

	@Value("${kakao.logout-redirect-uri}")
	private String kakaoLogoutRedirectUri;

	@PostMapping("/joinProcess.do")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> joinProcess(MemberVO vo) {
		Map<String, Object> response = new HashMap<>();

		// 회원 정보 생성
		MemberEntity entity = MemberEntity.builder()
				.memberId(vo.getMemberId()) // 사용자 ID 설정
				.memberPw(vo.getMemberPw()) // 사용자 비밀번호 설정
				.memberName(vo.getMemberName()) // 사용자 이름 설정
				.birthday(vo.getBirthday()) // 사용자 생일 설정
				.phone(vo.getPhone()) // 사용자 전화번호 설정
				.introduction(vo.getIntroduction()) // 자기소개
				.socialType("LOCAL") // 로컬 회원임을 명시
				.build();

		try {
			// 회원 정보 저장
			MemberEntity savedEntity = memberServiceImpl.save(entity);
			if (savedEntity != null) {
				response.put("success", true); // 저장 성공 시 success=true
			} else {
				response.put("success", false);
				response.put("msg", "회원가입이 실패했습니다."); // 저장 실패 메시지
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("msg", "서버 오류가 발생했습니다."); // 예외 발생 시 오류 메시지
			System.out.println("회원가입 프로세스 오류 발생: " + e);
		}
		return ResponseEntity.ok()
				.header("Content-Type", "application/json") // 명시적으로 JSON 헤더 설정
				.body(response);
	}

	@PostMapping("/loginProcess.do")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> loginProcess(String memberId, String memberPw,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();

		// 아이디와 비밀번호 입력값 검증
		if (memberId == null || memberPw == null) {
			response.put("success", false);
			response.put("msg", "아이디나 비밀번호가 입력되지 않았습니다.");

			return ResponseEntity.ok()
					.header("Content-Type", "application/json") // 명시적으로 JSON 헤더 설정
					.body(response);
		}

		// 로그인 시도
		MemberEntity member = memberServiceImpl.login(memberId, memberPw, "LOCAL");

		if (member != null) {
			// 로그인 성공 시 세션에 사용자 정보 저장
			HttpSession session = request.getSession();
			session.setAttribute("member", member);
			response.put("success", true); // 로그인 성공 메시지

			// 현재 페이지 URL 가져오기
			String referer = request.getHeader("Referer");
			response.put("redirectUrl", referer != null ? referer : "/");
		} else {
			response.put("success", false);
			response.put("msg", "아이디나 비밀번호가 일치하지 않습니다."); // 로그인 실패 메시지
		}
		return ResponseEntity.ok()
				.header("Content-Type", "application/json") // 명시적으로 JSON 헤더 설정
				.body(response); // 처리 결과 반환
	}

	@GetMapping("/update.do")
	public ModelAndView update(ModelAndView mav) {
		// 회원정보 수정 화면으로 이동
		mav.setViewName("member/update");
		return mav;
	}

	@PostMapping("/updateProcess.do")
	public ModelAndView updateProcess(MemberVO vo, HttpServletRequest request, ModelAndView mav) {
		// 수정된 회원 정보 생성
		MemberEntity entity = MemberEntity.builder()
				.memberId(vo.getMemberId()) // 수정된 사용자 ID
				.memberPw(vo.getMemberPw()) // 수정된 비밀번호
				.memberName(vo.getMemberName()) // 수정된 이름
				.birthday(vo.getBirthday()) // 수정된 생일
				.phone(vo.getPhone()) // 수정된 전화번호
				.introduction(vo.getIntroduction()) // 수정된 자기소개
				.profileImage(vo.getProfileImage()) // 수정된 프로필이미지
				.build();

		// 회원 인덱스 설정 (수정 대상 식별자)
		entity.updateMemIdx(vo.getMemIdx());

		String viewName = "member/update"; // 기본적으로 회원 수정 페이지로 설정
		int result = memberServiceImpl.updateMember(entity); // 회원 정보 업데이트 처리

		if (result == 1) { // 업데이트 성공
			HttpSession session = request.getSession();
			session.removeAttribute("member"); // 기존 세션의 사용자 정보 제거

			// 업데이트된 사용자 정보를 세션에 저장
			memberServiceImpl.getMember(entity.getMemIdx()).ifPresent(member -> {
				session.setAttribute("member", member);
			});

			viewName = "redirect:/"; // 메인 페이지로 리다이렉트
		} else { // 업데이트 실패
			mav.addObject("msg", "회원정보 변경시 오류가 발생했습니다. 변경내용을 확인해 주세요");
		}
		mav.setViewName(viewName); // 처리 결과에 따라 뷰 이름 설정

		return mav;
	}

	@PostMapping("/updatePassword.do")
	public ResponseEntity<?> updatePassword(@RequestParam String memberPw, @RequestParam String confirmPassword,
			HttpSession session) {
		if (!memberPw.equals(confirmPassword)) {
			return ResponseEntity.badRequest().body("Passwords do not match");
		}

		MemberEntity member = (MemberEntity) session.getAttribute("member");
		String encodedPassword = passwordEncoder.encode(memberPw);
		memberServiceImpl.updatePassword(member.getMemIdx(), encodedPassword);

		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("redirectUrl", "/");

		return ResponseEntity.ok(response);
	}

	@GetMapping("/logout.do")
	public String logout(HttpServletRequest request) {
		// HttpServletRequest를 통해 현재 세션 가져오기
		HttpSession session = request.getSession();

		// 세션에서 각 소셜 플랫폼의 액세스 토큰 가져오기
		String kakaoAccessToken = (String) session.getAttribute("KAKAO_accessToken");
		String googleAccessToken = (String) session.getAttribute("GOOGLE_accessToken");
		String naverAccessToken = (String) session.getAttribute("NAVER_accessToken");

		// 세션 무효화: 모든 세션 속성을 제거하여 사용자 로그아웃 처리
		session.invalidate();

		// Kakao 로그아웃 처리
		if (kakaoAccessToken != null) {
			// Kakao 로그아웃을 위한 URL 생성
			String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout"
					+ "?client_id=" + kakaoClientId // Kakao 애플리케이션의 Client ID
					+ "&logout_redirect_uri=" + kakaoLogoutRedirectUri; // 로그아웃 완료 후 리다이렉트할 URI
			logger.info("Kakao 로그아웃 URL로 리다이렉트: {}", kakaoLogoutUrl);
			// Kakao 로그아웃 URL로 리다이렉트
			return "redirect:" + kakaoLogoutUrl;
		}

		// Google 액세스 토큰 무효화 처리
		if (googleAccessToken != null) {
			// Google의 토큰 무효화 API 호출
			revokeGoogleToken(googleAccessToken);
		}

		// Naver 액세스 토큰 삭제 처리
		if (naverAccessToken != null) {
			// Naver의 토큰 삭제 API 호출
			deleteNaverToken(naverAccessToken);
		}

		// 모든 로그아웃 처리가 완료된 후 로그아웃 완료 페이지로 리다이렉트
		return "redirect:/logout/complete";
	}

	// Google의 액세스 토큰 무효화 처리 메서드
	private void revokeGoogleToken(String accessToken) {
		// Google 액세스 토큰 무효화를 위한 URL 생성
		String googleRevokeUrl = "https://oauth2.googleapis.com/revoke?token=" + accessToken;
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // 요청 헤더 설정

		HttpEntity<Void> request = new HttpEntity<>(headers); // 요청 엔티티 생성

		try {
			// Google의 토큰 무효화 API 호출 (POST 요청)
			restTemplate.exchange(googleRevokeUrl, HttpMethod.POST, request, String.class);
			logger.info("Google 액세스 토큰이 성공적으로 무효화되었습니다."); // 성공 로그
		} catch (Exception e) {
			// 토큰 무효화 실패 시 오류 로그 출력
			logger.error("Google 액세스 토큰을 무효화하는 데 실패했습니다.", e);
		}
	}

	// Naver의 액세스 토큰 삭제 처리 메서드
	private void deleteNaverToken(String accessToken) {
		// Naver 액세스 토큰 삭제를 위한 URL 생성
		String naverDeleteUrl = "https://nid.naver.com/oauth2.0/token"
				+ "?grant_type=delete" // 토큰 삭제를 위한 grant_type
				+ "&client_id=" + naverClientId // Naver 애플리케이션의 Client ID
				+ "&client_secret=" + naverClientSecret // Naver 애플리케이션의 Client Secret
				+ "&access_token=" + accessToken // 삭제할 액세스 토큰
				+ "&service_provider=NAVER"; // 서비스 제공자 (Naver)

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // 요청 헤더 설정

		HttpEntity<Void> request = new HttpEntity<>(headers); // 요청 엔티티 생성

		try {
			// Naver의 토큰 삭제 API 호출 (GET 요청)
			restTemplate.exchange(naverDeleteUrl, HttpMethod.GET, request, String.class);
			logger.info("Naver 액세스 토큰이 성공적으로 삭제되었습니다."); // 성공 로그
		} catch (Exception e) {
			// 토큰 삭제 실패 시 오류 로그 출력
			logger.error("Naver 액세스 토큰을 삭제하는 데 실패했습니다.", e);
		}
	}

}
