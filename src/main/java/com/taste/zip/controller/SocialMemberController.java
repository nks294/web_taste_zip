package com.taste.zip.controller;

import java.util.Map;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.taste.zip.entity.MemberEntity;
import com.taste.zip.service.MemberService;

@Controller
public class SocialMemberController {

    private static final Logger logger = LoggerFactory.getLogger(SocialMemberController.class);

    private final RestTemplate restTemplate;
    private final MemberService memberService;

    public SocialMemberController(RestTemplate restTemplate, MemberService memberService) {
        this.restTemplate = restTemplate;
        this.memberService = memberService;
    }

    // Kakao 관련 애플리케이션 설정값
    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.token-uri}")
    private String kakaoTokenUri;

    @Value("${kakao.user-info-uri}")
    private String kakaoUserInfoUri;

    // Naver 관련 애플리케이션 설정값
    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-uri}")
    private String naverRedirectUri;

    @Value("${naver.token-uri}")
    private String naverTokenUri;

    @Value("${naver.user-info-uri}")
    private String naverUserInfoUri;

    // Google 관련 애플리케이션 설정값
    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.client-secret}")
    private String googleClientSecret;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${google.token-uri}")
    private String googleTokenUri;

    @Value("${google.user-info-uri}")
    private String googleUserInfoUri;

    @PostConstruct
    public void logConfigValues() {
        // 애플리케이션 시작시 소셜 로그인 설정값 로깅
        logger.info("소셜 로그인 설정값이 로드되었습니다.");
    }

    // Google 로그인 URL 생성 및 리다이렉트
    @GetMapping("/social/google/login")
    public String googleLogin() {
        String authorizationUri = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + googleClientId +
                "&redirect_uri=" + googleRedirectUri +
                "&response_type=code" +
                "&scope=email%20profile";
        logger.info("Google 인증 URL로 리다이렉트: {}", authorizationUri);
        return "redirect:" + authorizationUri;
    }

    // Google 인증 콜백 처리
    @GetMapping("/social/google/callback")
    public String googleCallback(@RequestParam("code") String code, Model model, HttpServletRequest request) {
        try {
            // 1.Access Token 가져오기
            // Google 인증 서버로부터 전달받은 "code"를 사용하여 Access Token을 요청
            String accessToken = getGoogleAccessToken(code);

            // 2.사용자 정보 가져오기
            // Access Token을 사용하여 Google 사용자 정보를 요청
            Map<String, Object> userInfo = getGoogleUserInfo(accessToken);

            // 3.사용자 정보 파싱
            // 가져온 사용자 정보에서 ID, 이메일, 이름을 추출
            String socialId = userInfo.get("id").toString(); // Google에서 제공하는 고유 사용자 ID
            String email = userInfo.containsKey("email") ? userInfo.get("email").toString() : socialId; // 이메일 정보
            String name = userInfo.containsKey("name") ? userInfo.get("name").toString() : "Unknown"; // 이름 정보

            // 4.기존 사용자 여부 확인 및 저장
            // 데이터베이스에서 사용자가 이미 존재하는지 확인
            Optional<MemberEntity> existingMember = memberService.findByMemberIdAndSocialType(email, "GOOGLE");

            MemberEntity member;
            if (existingMember.isPresent()) {
                member = existingMember.get();
                logger.info("기존 Google 회원이 확인되었습니다: {}", member);
            } else {
                member = MemberEntity.builder()
                        .memberId(email) // 사용자 이메일
                        .memberName(name) // 사용자 이름
                        .socialType("GOOGLE") // 소셜 타입(Google)
                        .build();
                member = memberService.save(member); // 사용자 정보를 데이터베이스에 저장
                logger.info("새로운 Google 회원이 저장되었습니다: {}", member);
            }

            // 5.세션에 사용자 정보 및 Access Token 저장
            // 인증된 사용자 정보를 세션에 저장하여 로그인 상태 유지
            HttpSession session = request.getSession();
            session.setAttribute("member", member); // 사용자 정보 저장
            session.setAttribute("GOOGLE_accessToken", accessToken); // Google Access Token 저장
            logger.info("Google 회원 세션이 설정되었습니다: {}", member);

            // 메인 페이지로 리다이렉트
            return "redirect:/";
        } catch (Exception e) {
            // 오류 발생 시 에러 로그를 출력하고 에러 페이지로 이동
            logger.error("Google 로그인 처리 중 오류 발생", e);
            model.addAttribute("error", "Google 로그인 중 오류가 발생했습니다.");
            return "error"; // 에러 페이지로 이동
        }
    }

    // Google Access Token 요청
    private String getGoogleAccessToken(String code) {
        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // Content-Type 설정

        // 요청 파라미터 설정
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code"); // 인증 타입
        params.add("client_id", googleClientId); // Google Client ID
        params.add("client_secret", googleClientSecret); // Google Client Secret
        params.add("redirect_uri", googleRedirectUri); // 리다이렉트 URI
        params.add("code", code); // Google에서 전달받은 인증 코드

        // 요청 엔티티 생성
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        // Google 토큰 발급 API 호출 (POST 요청)
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                googleTokenUri, // Google Access Token 요청 URL
                HttpMethod.POST, // HTTP 메서드
                request, // 요청 데이터
                new ParameterizedTypeReference<Map<String, Object>>() {
                });

        // 응답 데이터 파싱
        Map<String, Object> responseBody = response.getBody();

        if (responseBody != null && responseBody.containsKey("access_token")) {
            // Access Token 반환
            return responseBody.get("access_token").toString();
        } else {
            throw new RuntimeException("Google Access Token을 가져오지 못했습니다."); // Access Token 가져오기 실패
        }
    }

    // Google 사용자 정보 요청
    private Map<String, Object> getGoogleUserInfo(String accessToken) {
        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken); // Access Token을 Authorization 헤더에 추가

        // 요청 엔티티 생성
        HttpEntity<Void> request = new HttpEntity<>(headers);

        // Google 사용자 정보 API 호출 (GET 요청)
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                googleUserInfoUri, // Google 사용자 정보 요청 URL
                HttpMethod.GET, // HTTP 메서드
                request, // 요청 데이터
                new ParameterizedTypeReference<Map<String, Object>>() {
                });

        // 응답 데이터 파싱
        Map<String, Object> responseBody = response.getBody();

        if (responseBody != null) {
            // 사용자 정보 반환
            return responseBody;
        } else {
            throw new RuntimeException("Google 사용자 정보를 가져오지 못했습니다."); // 사용자 정보 가져오기 실패
        }
    }

    // Kakao 로그인 URL 생성 및 리다이렉트
    @GetMapping("/social/kakao/login")
    public String kakaoLogin() {
        String authorizationUri = "https://kauth.kakao.com/oauth/authorize?client_id=" + kakaoClientId +
                "&redirect_uri=" + kakaoRedirectUri + "&response_type=code" + "&scope=account_email profile_nickname";
        logger.info("Kakao 인증 URL로 리다이렉트: {}", authorizationUri);
        return "redirect:" + authorizationUri;
    }

    // Kakao 콜백 처리
    @GetMapping("/social/kakao/callback")
    public String kakaoCallback(@RequestParam("code") String code, Model model, HttpServletRequest request) {
        return handleCallback("KAKAO", code, model, request);
    }

    // Naver 로그인 URL 생성 및 리다이렉트
    @GetMapping("/social/naver/login")
    public String naverLogin() {
        String authorizationUri = "https://nid.naver.com/oauth2.0/authorize?client_id=" + naverClientId +
                "&redirect_uri=" + naverRedirectUri + "&response_type=code";
        logger.info("Naver 인증 URL로 리다이렉트: {}", authorizationUri);
        return "redirect:" + authorizationUri;
    }

    // Naver 콜백 처리
    @GetMapping("/social/naver/callback")
    public String naverCallback(@RequestParam("code") String code, Model model, HttpServletRequest request) {
        return handleCallback("NAVER", code, model, request);
    }

    // 공통 콜백 처리 메서드
    private String handleCallback(String socialType, String code, Model model, HttpServletRequest request) {
        try {
            // 1.Access Token 가져오기
            // 소셜 플랫폼에 따라 Access Token을 가져옴
            String accessToken = getAccessToken(socialType, code, Map.class);

            // 2.사용자 정보 가져오기
            // 소셜 플랫폼에 따라 사용자 정보를 가져옴
            Map<String, Object> userInfo = getUserInfo(socialType, accessToken,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            // 3.사용자 정보 파싱
            // 소셜 플랫폼에 따라 다른 사용자 정보 구조를 파싱하여 이메일과 이름을 추출
            String email = null;
            String memberName = "Unknown"; // 이름 기본값 설정

            if (socialType.equalsIgnoreCase("KAKAO")) {
                // Kakao 사용자 정보 파싱
                Map<String, Object> kakaoAccount = getNestedMap(userInfo, "kakao_account");
                if (kakaoAccount != null) {
                    email = (String) kakaoAccount.get("email");
                    Map<String, Object> profile = getNestedMap(kakaoAccount, "profile");
                    if (profile != null) {
                        memberName = (String) profile.getOrDefault("nickname", "Unknown");
                    }
                }
            } else if (socialType.equalsIgnoreCase("NAVER")) {
                // Naver 사용자 정보 파싱
                Map<String, Object> response = getNestedMap(userInfo, "response");
                if (response != null) {
                    email = (String) response.get("email");
                    memberName = (String) response.getOrDefault("name", "Unknown");
                }
            }

            if (email == null) {
                // 이메일 정보가 없는 경우 예외 발생
                throw new RuntimeException(socialType + "에 대한 이메일 정보를 가져오는 데 실패했습니다.");
            }

            // 4.기존 사용자 여부 확인 및 저장
            // 데이터베이스에서 해당 사용자가 이미 존재하는지 확인합니다.
            Optional<MemberEntity> existingMember = memberService.findByMemberIdAndSocialType(email, socialType);

            MemberEntity member;
            if (existingMember.isPresent()) {
                member = existingMember.get();
                logger.info("기존 {} 회원이 확인되었습니다: {}", socialType, member);
            } else {
                member = MemberEntity.builder()
                        .memberId(email) // 이메일 저장
                        .memberName(memberName) // 이름 저장
                        .socialType(socialType) // 소셜 타입 저장
                        .build();
                member = memberService.save(member); // 새 사용자 정보 저장
                logger.info("새로운 {} 회원이 저장되었습니다: {}", socialType, member);
            }

            // 5.세션에 사용자 정보 및 Access Token 저장
            // 세션에 사용자 정보와 액세스 토큰을 저장
            HttpSession session = request.getSession();
            session.setAttribute("member", member); // 사용자 정보 저장
            session.setAttribute(socialType + "_accessToken", accessToken); // 소셜 Access Token 저장
            logger.info("세션이 설정되었습니다: {} 회원 정보 {}", socialType, member);

            // 6.성공 시 리다이렉트
            // 로그인 성공 후 메인 페이지로 리다이렉트
            return "redirect:/";
        } catch (Exception e) {
            // 로그인 처리 중 오류 발생 시 에러 로그 출력 및 에러 메시지 설정
            logger.error("{} 로그인 중 오류가 발생했습니다.", socialType, e);
            model.addAttribute("error", socialType + " 로그인 중 오류가 발생했습니다.");
            return "error";
        }
    }

    // Access Token 요청 메서드
    private <T> String getAccessToken(String socialType, String code, Class<T> responseType) {
        String tokenUrl = null; // 소셜 플랫폼의 Access Token 요청 URL
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // 요청 Content-Type 설정

        params.add("grant_type", "authorization_code"); // 인증 타입
        params.add("code", code); // 소셜 플랫폼에서 받은 인증 코드

        // 소셜 플랫폼별로 토큰 URL 및 요청 파라미터 설정
        if (socialType.equalsIgnoreCase("KAKAO")) {
            tokenUrl = kakaoTokenUri;
            params.add("client_id", kakaoClientId);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("client_secret", kakaoClientSecret);
        } else if (socialType.equalsIgnoreCase("NAVER")) {
            tokenUrl = naverTokenUri;
            params.add("client_id", naverClientId);
            params.add("client_secret", naverClientSecret);
            params.add("redirect_uri", naverRedirectUri);
        }

        if (tokenUrl == null) {
            // 잘못된 소셜 타입인 경우 예외 발생
            throw new IllegalArgumentException("잘못된 소셜 타입입니다: " + socialType);
        }

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            // Access Token 요청
            ResponseEntity<T> response = restTemplate.postForEntity(tokenUrl, request, responseType);
            T responseBody = response.getBody();
            if (responseBody instanceof Map) {
                Map<?, ?> responseMap = (Map<?, ?>) responseBody;
                if (responseMap.containsKey("access_token")) {
                    return (String) responseMap.get("access_token"); // Access Token 반환
                }
            }
            throw new RuntimeException(socialType + "에 대한 액세스 토큰을 가져오는 데 실패했습니다.");
        } catch (Exception e) {
            // Access Token 요청 중 오류 발생 시 예외 처리
            throw new RuntimeException(socialType + "에 대한 액세스 토큰 요청 중 오류가 발생했습니다.", e);
        }
    }

    // 사용자 정보 요청 메서드
    private Map<String, Object> getUserInfo(String socialType, String accessToken,
            ParameterizedTypeReference<Map<String, Object>> responseType) {
        String userInfoUrl = null; // 사용자 정보 요청 URL

        // 소셜 플랫폼별로 사용자 정보 요청 URL 설정
        if (socialType.equalsIgnoreCase("KAKAO")) {
            userInfoUrl = kakaoUserInfoUri;
        } else if (socialType.equalsIgnoreCase("NAVER")) {
            userInfoUrl = naverUserInfoUri;
        }

        if (userInfoUrl == null) {
            // 잘못된 소셜 타입인 경우 예외 발생
            throw new IllegalArgumentException("잘못된 소셜 타입입니다: " + socialType);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken); // Bearer Token 인증 헤더 설정
        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            // 사용자 정보 요청
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    userInfoUrl, HttpMethod.GET, request, responseType);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                logger.info("{} 사용자 정보 가져오기 완료: {}", socialType, responseBody);
                return responseBody; // 사용자 정보 반환
            } else {
                throw new RuntimeException(socialType + "에서 사용자 정보를 가져오는 데 실패했습니다.");
            }
        } catch (Exception e) {
            // 사용자 정보 요청 중 오류 발생 시 예외 처리
            throw new RuntimeException(socialType + "에서 사용자 정보 요청 중 오류가 발생했습니다.", e);
        }
    }

    // 안전하게 중첩된 Map 가져오기
    @SuppressWarnings("unchecked")
    private Map<String, Object> getNestedMap(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Map) {
            return (Map<String, Object>) value;
        }
        return null;
    }
}
