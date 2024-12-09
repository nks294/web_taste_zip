package com.taste.zip.handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;

import com.taste.zip.entity.MemberEntity;

public class LoginInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		boolean result = true; // Controller로 사용자의 요청이 전달되게 하는 결과값

		// 로그인 여부 체크: 세션객체에 저장된 member객체의 유무로 판단
		HttpSession session = request.getSession();
		MemberEntity vo = (MemberEntity) session.getAttribute("member");

		if (vo == null) {// 로그인이 안된 경우
			// 사용자의 요청을 로그인 페이지로 재요청하게 함
			response.sendRedirect(request.getContextPath() + "/member/login.do");
			result = false; // Controller로 사용자의 요청이 전달되지 못하게 하는 결과값
		}

		return result;
	}
}
