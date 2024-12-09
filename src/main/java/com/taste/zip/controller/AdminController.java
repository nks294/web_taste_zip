package com.taste.zip.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class AdminController {

	// 관리자 페이지 요청
    @GetMapping("/admin")
    public ModelAndView mypage(HttpSession session, ModelAndView mav) {
        
        // 권한이 없을경우 메인페이지로 이동
        // MemberEntity member = (MemberEntity) session.getAttribute("member");
        // if (member == null || member.getMemGrade() != 2) {
        //     mav.setViewName("redirect:/");
        //     return mav;
        // }

        mav.setViewName("admin");
        return mav;
    }
}
