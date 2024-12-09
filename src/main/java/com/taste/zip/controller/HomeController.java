package com.taste.zip.controller;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Calendar;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.taste.zip.entity.MemberEntity;
import com.taste.zip.service.MemberService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class HomeController {

	private MemberService memberService;

    // 메인 페이지 요청
    @GetMapping("/")
    public ModelAndView home(ModelAndView mav) {
        mav.setViewName("home");
        return mav;
    }

    // 지도 페이지 요청
    @GetMapping("/map")
    public ModelAndView map(ModelAndView mav) {
        mav.setViewName("map");
        return mav;
    }

    @GetMapping("/submitPlace")
    public ModelAndView submitPlace(ModelAndView mav) {
        mav.setViewName("submitPlace");
        return mav;
    }

    @GetMapping("/randomCharacter")
    public ModelAndView randomCharacter(ModelAndView mav, HttpSession session) {
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        Integer memIdx = member != null ? member.getMemIdx() : null;
        System.out.println("memIdx in session: " + memIdx);
        mav.addObject("memIdx", memIdx);
        mav.setViewName("randomCharacter");
        return mav;
    }

    // 마이 페이지 요청
    @GetMapping("/myzip")
    public ModelAndView mypage(@RequestParam(value = "id", required = false) Integer id, HttpSession session,
            ModelAndView mav) {
        MemberEntity currentMember = (MemberEntity) session.getAttribute("member");
        System.out.println("Requested member ID: " + id);

		if (id != null) {
			Optional<MemberEntity> targetMember = memberService.getMember(id);

			if (targetMember.isPresent()) {
				MemberEntity member = targetMember.get();
				mav.addObject("targetMem", member);
				mav.addObject("memberIdx", id);
				mav.addObject("isOwner", currentMember != null && id.equals(currentMember.getMemIdx()));
			} else {
				mav.addObject("error", "해당 사용자를 찾을 수 없습니다.");
				System.out.println("사용자를 찾을 수 없음");
			}
		} else if (currentMember != null) {
			// id가 없고 로그인 상태인 경우 본인 프로필
			mav.addObject("member", currentMember);
			mav.addObject("memberIdx", currentMember.getMemIdx());
			mav.addObject("isOwner", true);
		} else {
			// 비로그인 상태에서 id도 없는 경우
			mav.addObject("error", "로그인이 필요합니다.");
			System.out.println("로그인 필요");
		}

		mav.setViewName("myzip");
		return mav;
	}

    // 로그아웃 요청
    @GetMapping("/logout/complete")
    public String logoutComplete() {
        // 홈 페이지로 리다이렉트
        return "redirect:/";
    }

    // 에러 페이지 요청
    @GetMapping("/error/error500.do")
    public String error500(Exception e, HttpServletRequest request, Model model) {

        // 예외 정보 구성
        model.addAttribute("time", Calendar.getInstance().getTime());// 예외 발생 시간
        model.addAttribute("url", request.getServletPath());// 예외 발생 URL
        model.addAttribute("message", e.getMessage());// 예외 메시지

        // 예외 상세내용
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw); // 스택 트레이스를 PrintWriter로 출력
        String stackTrace = sw.toString(); // 문자열로 변환
        model.addAttribute("stackTrace", stackTrace);

        return "error/error";
    }

}
